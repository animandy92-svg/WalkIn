import { Timestamp, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { cancelBookingRequestSchema, cancelBookingResponseSchema } from '@walkin/shared';
import {
  bookingRef,
  cancelBookingInTransaction,
  loadProvider,
} from '../booking.js';
import { DomainError } from '../errors.js';
import { db, enforceAppCheck, TRANSACTION_OPTIONS } from '../firebase.js';
import type { BookingDoc } from '../types.js';
import { bookingToView, readDoc } from '../views.js';
import { canReadBooking, parseRequest, requireUid, toHttpsError } from './helpers.js';

const HOUR_MS = 3_600_000;

export const cancelBooking = onCall({ enforceAppCheck }, async (request) => {
  try {
    const uid = requireUid(request);
    const input = parseRequest(cancelBookingRequestSchema, request.data);
    const snapshot = await bookingRef(input.bookingId).get();
    if (!snapshot.exists) throw new DomainError('NOT_FOUND', 'Booking not found');

    const booking = readDoc<BookingDoc>(snapshot as QueryDocumentSnapshot);
    canReadBooking(request, booking.providerId, booking.customerId);

    const provider = await loadProvider(booking.providerId);
    const isCustomer = uid === booking.customerId;
    const startsInMs = booking.startUtc.toMillis() - Date.now();
    if (
      isCustomer
      && booking.status === 'confirmed'
      && startsInMs < provider.bookingPolicy.cancelCutoffHours * HOUR_MS
    ) {
      throw new DomainError('POLICY_VIOLATION', 'This booking can no longer be cancelled online');
    }

    const updated = await db.runTransaction(async (transaction) => {
      const fresh = await transaction.get(bookingRef(input.bookingId));
      if (!fresh.exists) throw new DomainError('NOT_FOUND', 'Booking not found');
      return cancelBookingInTransaction(
        transaction,
        bookingRef(input.bookingId),
        fresh as QueryDocumentSnapshot,
        uid,
        input.reason,
        Timestamp.now(),
      );
    }, TRANSACTION_OPTIONS);

    return cancelBookingResponseSchema.parse({ booking: bookingToView(updated) });
  } catch (error) {
    throw toHttpsError(error);
  }
});
