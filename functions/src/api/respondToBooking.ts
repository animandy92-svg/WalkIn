import { Timestamp, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { respondToBookingRequestSchema, respondToBookingResponseSchema } from '@walkin/shared';
import {
  bookingRef,
  respondToBookingInTransaction,
} from '../booking.js';
import { DomainError } from '../errors.js';
import { db, enforceAppCheck } from '../firebase.js';
import type { BookingDoc } from '../types.js';
import { bookingToView, readDoc } from '../views.js';
import { parseRequest, requireProviderRole, toHttpsError } from './helpers.js';

export const respondToBooking = onCall({ enforceAppCheck }, async (request) => {
  try {
    const input = parseRequest(respondToBookingRequestSchema, request.data);
    const snapshot = await bookingRef(input.bookingId).get();
    if (!snapshot.exists) throw new DomainError('NOT_FOUND', 'Booking not found');

    const booking = readDoc<BookingDoc>(snapshot as QueryDocumentSnapshot);
    const actor = requireProviderRole(request, booking.providerId);

    const updated = await db.runTransaction(async (transaction) => {
      const fresh = await transaction.get(bookingRef(input.bookingId));
      if (!fresh.exists) throw new DomainError('NOT_FOUND', 'Booking not found');
      return respondToBookingInTransaction(
        transaction,
        bookingRef(input.bookingId),
        fresh as QueryDocumentSnapshot,
        input.action,
        actor,
        Timestamp.now(),
      );
    });

    return respondToBookingResponseSchema.parse({ booking: bookingToView(updated) });
  } catch (error) {
    throw toHttpsError(error);
  }
});
