import { DateTime } from 'luxon';
import { onCall } from 'firebase-functions/v2/https';
import {
  getAvailabilityRequestSchema,
  getAvailabilityResponseSchema,
  type SlotView,
} from '@walkin/shared';
import { buildSlotCandidates } from '../availability.js';
import {
  eligibleStaff,
  loadAvailabilityRules,
  loadProvider,
  loadService,
} from '../booking.js';
import { DomainError } from '../errors.js';
import { db, enforceAppCheck } from '../firebase.js';
import type { SlotLockDoc } from '../types.js';
import { parseRequest, requireUid, toHttpsError } from './helpers.js';

const DAY_MS = 86_400_000;
const MAX_RANGE_MS = 31 * DAY_MS;

export const getAvailability = onCall({ enforceAppCheck }, async (request) => {
  try {
    requireUid(request);
    const input = parseRequest(getAvailabilityRequestSchema, request.data);
    const provider = await loadProvider(input.providerId);

    let fromMs: number;
    let toMs: number;
    if (input.date) {
      const startOfDay = DateTime.fromISO(input.date, { zone: provider.timeZone }).startOf('day');
      if (!startOfDay.isValid) throw new DomainError('INVALID_ARGUMENT', 'Invalid date');
      fromMs = startOfDay.toUTC().toMillis();
      toMs = startOfDay.plus({ days: 1 }).toUTC().toMillis();
    } else if (input.from && input.to) {
      fromMs = Date.parse(input.from);
      toMs = Date.parse(input.to);
    } else {
      throw new DomainError('INVALID_ARGUMENT', 'Provide a date or a UTC range');
    }

    if (!Number.isFinite(fromMs) || !Number.isFinite(toMs) || toMs <= fromMs || toMs - fromMs > MAX_RANGE_MS) {
      throw new DomainError('INVALID_ARGUMENT', 'Requested range must be between 0 and 31 days');
    }

    const service = await loadService(input.providerId, input.serviceId);
    if (service.providerId !== provider.id) {
      throw new DomainError('NOT_FOUND', 'Service does not belong to provider');
    }

    if (input.staffId && !service.staffIds.includes(input.staffId)) {
      throw new DomainError('STAFF_NOT_ELIGIBLE', 'Staff member cannot provide this service');
    }

    const staff = await eligibleStaff(input.providerId, service);
    const rules = await loadAvailabilityRules(input.providerId);
    const candidates = buildSlotCandidates({
      providerId: provider.id,
      timeZone: provider.timeZone,
      nowMs: Date.now(),
      leadTimeMinutes: provider.bookingPolicy.leadTimeMinutes,
      durationMinutes: service.durationMinutes,
      bufferBeforeMinutes: service.bufferBeforeMinutes,
      bufferAfterMinutes: service.bufferAfterMinutes,
      capacityScope: service.capacityScope,
      providerDefaultCapacity: provider.bookingPolicy.defaultConcurrentSlots,
      staff,
      rules,
      fromMs,
      toMs,
    });

    const keys = [...new Set(candidates.flatMap((candidate) => candidate.slotKeys))];
    const lockState = new Map<string, { capacity: number; occupied: number }>();

    for (let index = 0; index < keys.length; index += 100) {
      const chunk = keys.slice(index, index + 100);
      const snapshots = await db.getAll(...chunk.map((key) => db.collection('slotLocks').doc(key)));
      for (const snapshot of snapshots) {
        if (!snapshot.exists) continue;
        const data = snapshot.data() as SlotLockDoc;
        lockState.set(snapshot.id, {
          capacity: data.capacity ?? 1,
          occupied: data.occupied ?? 0,
        });
      }
    }

    const slots: SlotView[] = [];
    for (const candidate of candidates) {
      const states = candidate.slotKeys.map((key) => lockState.get(key));
      const capacity = Math.min(...states.map((state) => state?.capacity ?? candidate.capacity));
      const remaining = Math.min(...states.map((state) => Math.max(0, capacity - (state?.occupied ?? 0))));

      if (remaining <= 0) continue;
      slots.push({
        startUtc: new Date(candidate.startMs).toISOString(),
        endUtc: new Date(candidate.endMs).toISOString(),
        localLabel: candidate.localLabel,
        staffId: candidate.staffId,
        remaining,
        capacity,
      });
    }

    return getAvailabilityResponseSchema.parse({ slots });
  } catch (error) {
    throw toHttpsError(error);
  }
});
