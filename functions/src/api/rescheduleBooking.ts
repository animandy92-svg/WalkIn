import { Timestamp, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { rescheduleBookingRequestSchema, rescheduleBookingResponseSchema } from '@walkin/shared';
import {
  bookingRef,
  cancelBookingInTransaction,
  createBookingInTransaction,
  loadProvider,
  prepareBooking,
} from '../booking.js';
import { DomainError } from '../errors.js';
import { db, enforceAppCheck } from '../firebase.js';
import type { BookingDoc } from '../types.js';
import { bookingToView, readDoc } from '../views.js';
import { canReadBooking, parseRequest, requireUid, toHttpsError } from './helpers.js';

const HOUR_MS = 3_600_000;

export const rescheduleBooking = onCall({ enforceAppCheck }, async (request) => {
  try {
    const uid = requireUid(request);
    const input = parseRequest(rescheduleBookingRequestSchema, request.data);
    const snapshot = await bookingRef(input.bookingId).get();
    if (!snapshot.exists) throw new DomainError('NOT_FOUND', 'Booking not found');

    const oldBooking = readDoc<BookingDoc>(snapshot as QueryDocumentSnapshot);
    canReadBooking(request, oldBooking.providerId, oldBooking.customerId);

    if (!['pending', 'confirmed'].includes(oldBooking.status)) {
      throw new DomainError('POLICY_VIOLATION', 'Booking cannot be rescheduled');
    }

    const provider = await loadProvider(oldBooking.providerId);
    if (
      uid === oldBooking.customerId
      && oldBooking.startUtc.toMillis() - Date.now()
        < provider.bookingPolicy.rescheduleCutoffHours * HOUR_MS
    ) {
      throw new DomainError('POLICY_VIOLATION', 'This booking can no longer be rescheduled online');
    }

    const prepared = await prepareBooking({
      providerId: oldBooking.providerId,
      serviceId: oldBooking.serviceId,
      staffId: oldBooking.staffId ?? undefined,
      startUtc: input.startUtc,
      idempotencyKey: input.idempotencyKey,
      customerId: oldBooking.customerId,
      note: oldBooking.customerNote,
      source: oldBooking.source,
    });

    const now = Timestamp.now();
    const newBooking = await db.runTransaction(async (transaction) => {
      const fresh = await transaction.get(bookingRef(input.bookingId));
      if (!fresh.exists) throw new DomainError('NOT_FOUND', 'Booking not found');

      const created = await createBookingInTransaction(transaction, prepared);
      await cancelBookingInTransaction(
        transaction,
        bookingRef(input.bookingId),
        fresh as QueryDocumentSnapshot,
        uid,
        'rescheduled',
        now,
      );
      return created;
    });

    return rescheduleBookingResponseSchema.parse({ booking: bookingToView(newBooking) });
  } catch (error) {
    throw toHttpsError(error);
  }
});
