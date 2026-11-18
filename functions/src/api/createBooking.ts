import { onCall } from 'firebase-functions/v2/https';
import { createBookingRequestSchema, createBookingResponseSchema } from '@walkin/shared';
import { createBookingInTransaction, prepareBooking } from '../booking.js';
import { db, enforceAppCheck, TRANSACTION_OPTIONS } from '../firebase.js';
import { bookingToView } from '../views.js';
import { parseRequest, requireUid, toHttpsError } from './helpers.js';

export const createBooking = onCall({ enforceAppCheck }, async (request) => {
  try {
    const uid = requireUid(request);
    const input = parseRequest(createBookingRequestSchema, request.data);
    const prepared = await prepareBooking({ ...input, customerId: uid });
    const booking = await db.runTransaction(
      (transaction) => createBookingInTransaction(transaction, prepared),
      TRANSACTION_OPTIONS,
    );
    return createBookingResponseSchema.parse({ booking: bookingToView(booking) });
  } catch (error) {
    throw toHttpsError(error);
  }
});
