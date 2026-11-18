import { Timestamp, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import {
  savedEntityResponseSchema,
  saveAvailabilityRequestSchema,
  saveProviderRequestSchema,
  saveServiceRequestSchema,
  saveStaffRequestSchema,
} from '@walkin/shared';
import { auth, db, enforceAppCheck } from '../firebase.js';
import type { AvailabilityRuleDoc, BookingDoc, ProviderDoc, ServiceDoc, StaffDoc } from '../types.js';
import { bookingToView, readDoc } from '../views.js';
import { DomainError } from '../errors.js';
import { parseRequest, requireProviderRole, requireUid, toHttpsError } from './helpers.js';

function providerDocumentRef(providerId: string) {
  return db.collection('providers').doc(providerId);
}

export const saveProvider = onCall({ enforceAppCheck }, async (request) => {
  try {
    const uid = requireUid(request);
    const input = parseRequest(saveProviderRequestSchema, request.data);
    const now = Timestamp.now();

    const duplicate = await db.collection('providers').where('slug', '==', input.slug).get();
    if (duplicate.docs.some((doc) => doc.id !== input.providerId)) {
      throw new DomainError('INVALID_ARGUMENT', 'That slug is already in use');
    }

    const ref = input.providerId
      ? providerDocumentRef(input.providerId)
      : db.collection('providers').doc();

    if (input.providerId) {
      requireProviderRole(request, input.providerId, ['owner', 'admin']);
      const existing = await ref.get();
      if (!existing.exists) throw new DomainError('NOT_FOUND', 'Provider not found');
    }

    const previous = input.providerId ? (await ref.get()).data() as Partial<ProviderDoc> | undefined : undefined;
    const data: Partial<ProviderDoc> = {
      name: input.name,
      slug: input.slug,
      description: input.description,
      timeZone: input.timeZone,
      status: input.status,
      bookingPolicy: input.bookingPolicy,
      updatedAt: now,
    };
    if (input.address !== undefined) data.address = input.address;
    if (input.logoUrl !== undefined) data.logoUrl = input.logoUrl;
    if (!previous) {
      data.ownerId = uid;
      data.createdAt = now;
    }

    await ref.set(data, { merge: true });

    if (!input.providerId) {
      await auth.setCustomUserClaims(uid, { providerId: ref.id, role: 'owner' });
      await db.collection('users').doc(uid).set(
        { providerId: ref.id, role: 'owner', updatedAt: now },
        { merge: true },
      );
    }

    return savedEntityResponseSchema.parse({ id: ref.id });
  } catch (error) {
    throw toHttpsError(error);
  }
});

export const saveService = onCall({ enforceAppCheck }, async (request) => {
  try {
    const input = parseRequest(saveServiceRequestSchema, request.data);
    requireProviderRole(request, input.providerId, ['owner', 'admin']);
    const now = Timestamp.now();
    const ref = input.serviceId
      ? providerDocumentRef(input.providerId).collection('services').doc(input.serviceId)
      : providerDocumentRef(input.providerId).collection('services').doc();

    const previous = input.serviceId ? (await ref.get()).data() as Partial<ServiceDoc> | undefined : undefined;
    const data: Partial<ServiceDoc> = {
      providerId: input.providerId,
      name: input.name,
      description: input.description,
      durationMinutes: input.durationMinutes,
      price: input.price,
      confirmationMode: input.confirmationMode,
      capacityScope: input.capacityScope,
      staffIds: input.staffIds,
      bufferBeforeMinutes: input.bufferBeforeMinutes,
      bufferAfterMinutes: input.bufferAfterMinutes,
      active: input.active,
      updatedAt: now,
    };
    if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
    if (!previous) data.createdAt = now;

    await ref.set(data, { merge: true });
    return savedEntityResponseSchema.parse({ id: ref.id });
  } catch (error) {
    throw toHttpsError(error);
  }
});

export const saveStaff = onCall({ enforceAppCheck }, async (request) => {
  try {
    const input = parseRequest(saveStaffRequestSchema, request.data);
    requireProviderRole(request, input.providerId, ['owner', 'admin']);
    const now = Timestamp.now();
    const ref = input.staffId
      ? providerDocumentRef(input.providerId).collection('staff').doc(input.staffId)
      : providerDocumentRef(input.providerId).collection('staff').doc();

    const previous = input.staffId ? (await ref.get()).data() as Partial<StaffDoc> | undefined : undefined;
    const data: Partial<StaffDoc> = {
      providerId: input.providerId,
      name: input.name,
      active: input.active,
      serviceIds: input.serviceIds,
      concurrentSlots: input.concurrentSlots,
      updatedAt: now,
    };
    if (input.userId !== undefined) data.userId = input.userId;
    if (input.photoUrl !== undefined) data.photoUrl = input.photoUrl;
    if (!previous) data.createdAt = now;

    await ref.set(data, { merge: true });

    if (input.userId) {
      await auth.setCustomUserClaims(input.userId, { providerId: input.providerId, role: 'staff' });
      await db.collection('users').doc(input.userId).set(
        { providerId: input.providerId, role: 'staff', updatedAt: now },
        { merge: true },
      );
    }

    return savedEntityResponseSchema.parse({ id: ref.id });
  } catch (error) {
    throw toHttpsError(error);
  }
});

export const saveAvailability = onCall({ enforceAppCheck }, async (request) => {
  try {
    const input = parseRequest(saveAvailabilityRequestSchema, request.data);
    requireProviderRole(request, input.providerId, ['owner', 'admin']);

    if (input.kind === 'weekly' && (input.dayOfWeek === undefined || !input.startLocal || !input.endLocal)) {
      throw new DomainError('INVALID_ARGUMENT', 'Weekly rules need a day, start, and end time');
    }
    if (input.kind === 'exception' && !input.date) {
      throw new DomainError('INVALID_ARGUMENT', 'Exception rules need a date');
    }

    const now = Timestamp.now();
    const ref = input.ruleId
      ? providerDocumentRef(input.providerId).collection('availability').doc(input.ruleId)
      : providerDocumentRef(input.providerId).collection('availability').doc();

    const previous = input.ruleId ? (await ref.get()).data() as AvailabilityRuleDoc | undefined : undefined;
    const data: AvailabilityRuleDoc = {
      kind: input.kind,
      staffId: input.staffId,
      dayOfWeek: input.dayOfWeek,
      startLocal: input.startLocal,
      endLocal: input.endLocal,
      date: input.date,
      intervals: input.intervals,
      reason: input.reason,
      effectiveFrom: previous?.effectiveFrom ?? null,
      effectiveUntil: previous?.effectiveUntil ?? null,
    };

    await ref.set(data, { merge: true });
    return savedEntityResponseSchema.parse({ id: ref.id });
  } catch (error) {
    throw toHttpsError(error);
  }
});

/** Provider-safe read used by the dashboard, since client rules deny direct writes. */
export const listProviderBookings = onCall({ enforceAppCheck }, async (request) => {
  try {
    const data = request.data as { providerId?: string; from?: string; to?: string };
    if (!data.providerId) throw new DomainError('INVALID_ARGUMENT', 'providerId is required');
    requireProviderRole(request, data.providerId);

    const snapshot = await db
      .collection('bookings')
      .where('providerId', '==', data.providerId)
      .orderBy('startUtc', 'asc')
      .limit(200)
      .get();

    return {
      bookings: snapshot.docs.map((doc) => bookingToView(readDoc<BookingDoc>(doc as QueryDocumentSnapshot))),
    };
  } catch (error) {
    throw toHttpsError(error);
  }
});
