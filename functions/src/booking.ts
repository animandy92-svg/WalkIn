import {
  FieldValue,
  Timestamp,
  type DocumentReference,
  type QueryDocumentSnapshot,
  type Transaction,
} from 'firebase-admin/firestore';
import type { BookingSource } from '@walkin/shared';
import { ANY_STAFF_KEY, buildSlotCandidates, type SlotCandidate } from './availability.js';
import { DomainError } from './errors.js';
import { db } from './firebase.js';
import { cellMsFromKey } from './time.js';
import type {
  AvailabilityRuleDoc,
  BookingDoc,
  ProviderDoc,
  ServiceDoc,
  SlotLockDoc,
  StaffDoc,
} from './types.js';
import { readDoc } from './views.js';

export interface CreateBookingInput {
  customerId: string;
  providerId: string;
  serviceId: string;
  staffId?: string;
  startUtc: string;
  note?: string;
  source: BookingSource;
}

export interface PreparedBooking {
  provider: ProviderDoc;
  service: ServiceDoc;
  candidates: SlotCandidate[];
  customerId: string;
  note?: string;
  source: BookingSource;
  idempotencyKey: string;
}

export function bookingRef(bookingId: string): DocumentReference {
  return db.collection('bookings').doc(bookingId);
}

function lockRef(key: string): DocumentReference {
  return db.collection('slotLocks').doc(key);
}

export async function loadProvider(providerId: string): Promise<ProviderDoc> {
  const snapshot = await db.collection('providers').doc(providerId).get();
  if (!snapshot.exists) throw new DomainError('NOT_FOUND', 'Provider not found');
  const provider = readDoc<ProviderDoc>(snapshot as QueryDocumentSnapshot);
  if (provider.status !== 'published') {
    throw new DomainError('NOT_FOUND', 'Provider is not accepting bookings');
  }
  return provider;
}

export async function loadService(providerId: string, serviceId: string): Promise<ServiceDoc> {
  const snapshot = await db
    .collection('providers')
    .doc(providerId)
    .collection('services')
    .doc(serviceId)
    .get();
  if (!snapshot.exists) throw new DomainError('NOT_FOUND', 'Service not found');
  const service = readDoc<ServiceDoc>(snapshot as QueryDocumentSnapshot);
  if (!service.active) throw new DomainError('NOT_FOUND', 'Service is not available');
  return service;
}

export async function eligibleStaff(providerId: string, service: ServiceDoc): Promise<StaffDoc[]> {
  const providerRef = db.collection('providers').doc(providerId);

  if (service.staffIds.includes(ANY_STAFF_KEY)) {
    const snapshot = await providerRef.collection('staff').where('active', '==', true).get();
    return snapshot.docs.map((doc) => readDoc<StaffDoc>(doc));
  }

  const refs = service.staffIds.map((id) => providerRef.collection('staff').doc(id));
  const snapshots = await db.getAll(...refs);
  return snapshots
    .filter((snapshot) => snapshot.exists)
    .map((snapshot) => readDoc<StaffDoc>(snapshot as QueryDocumentSnapshot))
    .filter((member) => member.active);
}

export async function loadAvailabilityRules(providerId: string): Promise<AvailabilityRuleDoc[]> {
  const snapshot = await db
    .collection('providers')
    .doc(providerId)
    .collection('availability')
    .get();
  return snapshot.docs.map((doc) => readDoc<AvailabilityRuleDoc>(doc));
}

export async function prepareBooking(
  input: CreateBookingInput & { idempotencyKey: string },
): Promise<PreparedBooking> {
  const startMs = Date.parse(input.startUtc);
  if (!Number.isFinite(startMs)) {
    throw new DomainError('INVALID_TIME', 'startUtc must be an ISO-8601 timestamp');
  }

  const provider = await loadProvider(input.providerId);
  const service = await loadService(input.providerId, input.serviceId);

  if (
    input.staffId
    && !service.staffIds.includes(ANY_STAFF_KEY)
    && !service.staffIds.includes(input.staffId)
  ) {
    throw new DomainError('STAFF_NOT_ELIGIBLE', 'Staff member cannot provide this service');
  }

  const staff = await eligibleStaff(input.providerId, service);
  const rules = await loadAvailabilityRules(input.providerId);

  const candidates = buildSlotCandidates({
    providerId: input.providerId,
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
    fromMs: startMs,
    toMs: startMs + 60_000,
  }).filter(
    (candidate) => candidate.startMs === startMs
      && (!input.staffId || candidate.staffId === input.staffId || candidate.staffId === null),
  );

  if (candidates.length === 0) {
    throw new DomainError('INVALID_TIME', 'No availability at the requested time');
  }

  return {
    provider,
    service,
    candidates,
    customerId: input.customerId,
    note: input.note,
    source: input.source,
    idempotencyKey: input.idempotencyKey,
  };
}

export async function createBookingInTransaction(
  transaction: Transaction,
  prepared: PreparedBooking,
): Promise<BookingDoc> {
  const idempotencyRef = db.collection('idempotencyKeys').doc(prepared.idempotencyKey);
  const existingKey = await transaction.get(idempotencyRef);
  if (existingKey.exists) {
    const bookingId = existingKey.get('bookingId') as string | undefined;
    if (bookingId) {
      const existingBooking = await transaction.get(bookingRef(bookingId));
      if (existingBooking.exists) {
        return readDoc<BookingDoc>(existingBooking as QueryDocumentSnapshot);
      }
    }
  }

  const refs = new Map<string, DocumentReference>();
  for (const candidate of prepared.candidates) {
    for (const key of candidate.slotKeys) refs.set(key, lockRef(key));
  }

  const lockSnapshots = await transaction.getAll(...refs.values());
  const locks = new Map<string, QueryDocumentSnapshot>();
  for (const [index, ref] of [...refs.values()].entries()) {
    const snapshot = lockSnapshots[index];
    if (snapshot?.exists) locks.set(ref.id, snapshot as QueryDocumentSnapshot);
  }

  const chosen = prepared.candidates.find((candidate) =>
    candidate.slotKeys.every((key) => {
      const snapshot = locks.get(key);
      if (!snapshot) return candidate.capacity > 0;
      const data = snapshot.data() as SlotLockDoc;
      return data.occupied < (data.capacity ?? candidate.capacity);
    }),
  );

  if (!chosen) throw new DomainError('SLOT_UNAVAILABLE', 'This time is no longer available');

  const now = Timestamp.now();
  const status = prepared.service.confirmationMode === 'instant' ? 'confirmed' : 'pending';
  const ref = bookingRef(db.collection('bookings').doc().id);
  const booking: BookingDoc = {
    id: ref.id,
    providerId: prepared.provider.id,
    serviceId: prepared.service.id,
    staffId: chosen.staffId,
    customerId: prepared.customerId,
    startUtc: Timestamp.fromMillis(chosen.startMs),
    endUtc: Timestamp.fromMillis(chosen.endMs),
    providerTimeZone: prepared.provider.timeZone,
    slotKeys: chosen.slotKeys,
    status,
    confirmationMode: prepared.service.confirmationMode,
    priceSnapshot: {
      amountCents: prepared.service.price.amountCents,
      currency: prepared.service.price.currency,
      serviceName: prepared.service.name,
      durationMinutes: prepared.service.durationMinutes,
    },
    holdExpiresAt:
      status === 'pending'
        ? Timestamp.fromMillis(now.toMillis() + prepared.provider.bookingPolicy.pendingHoldMinutes * 60_000)
        : null,
    customerNote: prepared.note,
    source: prepared.source,
    timeline: [{ status: 'created', at: now, actor: prepared.customerId }],
    idempotencyKey: prepared.idempotencyKey,
    createdAt: now,
    updatedAt: now,
  };

  transaction.create(ref, booking);

  for (const [index, key] of chosen.slotKeys.entries()) {
    const snapshot = locks.get(key);
    if (snapshot) {
      transaction.update(refs.get(key)!, { occupied: FieldValue.increment(1), updatedAt: now });
    } else {
      transaction.set(refs.get(key)!, {
        lockId: key,
        staffKey: chosen.staffKey,
        cellUtc: Timestamp.fromMillis(chosen.cells[index] ?? cellMsFromKey(key) ?? chosen.startMs),
        capacity: chosen.capacity,
        occupied: 1,
        updatedAt: now,
      });
    }
  }

  transaction.set(idempotencyRef, { bookingId: ref.id, createdAt: now });
  return booking;
}

export async function releaseLocks(
  transaction: Transaction,
  booking: BookingDoc,
  now: Timestamp,
): Promise<void> {
  const refs = booking.slotKeys.map(lockRef);
  if (refs.length === 0) return;
  const snapshots = await transaction.getAll(...refs);

  for (const [index, snapshot] of snapshots.entries()) {
    const ref = refs[index];
    if (snapshot?.exists && ref) {
      transaction.update(ref, { occupied: FieldValue.increment(-1), updatedAt: now });
    }
  }
}

export async function cancelBookingInTransaction(
  transaction: Transaction,
  ref: DocumentReference,
  snapshot: QueryDocumentSnapshot,
  actor: string,
  reason: string | undefined,
  now: Timestamp,
): Promise<BookingDoc> {
  const booking = readDoc<BookingDoc>(snapshot);
  if (booking.status === 'cancelled') return booking;
  if (!['pending', 'confirmed', 'rejected'].includes(booking.status)) {
    throw new DomainError('POLICY_VIOLATION', 'Booking cannot be cancelled in its current state');
  }

  const updates = {
    status: 'cancelled' as const,
    cancelledAt: now,
    cancellationReason: reason,
    updatedAt: now,
    timeline: [...booking.timeline, { status: 'cancelled' as const, at: now, actor }],
  };
  transaction.update(ref, updates);

  if (booking.status === 'pending' || booking.status === 'confirmed') {
    await releaseLocks(transaction, booking, now);
  }

  return { ...booking, ...updates };
}

export async function respondToBookingInTransaction(
  transaction: Transaction,
  ref: DocumentReference,
  snapshot: QueryDocumentSnapshot,
  action: 'confirm' | 'reject',
  actor: string,
  now: Timestamp,
): Promise<BookingDoc> {
  const booking = readDoc<BookingDoc>(snapshot);
  if (booking.status !== 'pending') {
    throw new DomainError('POLICY_VIOLATION', 'Only pending bookings can be reviewed');
  }
  if (booking.holdExpiresAt && now.toMillis() > booking.holdExpiresAt.toMillis()) {
    throw new DomainError('HOLD_EXPIRED', 'The hold on this booking has expired');
  }

  const status = (action === 'confirm' ? 'confirmed' : 'rejected') as 'confirmed' | 'rejected';
  const updates = {
    status,
    holdExpiresAt: null,
    updatedAt: now,
    timeline: [...booking.timeline, { status, at: now, actor }],
  };
  transaction.update(ref, updates);

  if (action === 'reject') await releaseLocks(transaction, booking, now);

  return { ...booking, ...updates };
}

export async function expireBookingInTransaction(
  transaction: Transaction,
  ref: DocumentReference,
  snapshot: QueryDocumentSnapshot,
  now: Timestamp,
): Promise<BookingDoc> {
  const booking = readDoc<BookingDoc>(snapshot);
  if (booking.status !== 'pending') return booking;

  const updates = {
    status: 'expired' as const,
    holdExpiresAt: null,
    updatedAt: now,
    timeline: [...booking.timeline, { status: 'expired' as const, at: now, actor: 'system' }],
  };
  transaction.update(ref, updates);
  await releaseLocks(transaction, booking, now);

  return { ...booking, ...updates };
}
