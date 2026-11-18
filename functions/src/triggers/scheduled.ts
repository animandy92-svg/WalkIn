import { Timestamp, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import {
  bookingRef,
  expireBookingInTransaction,
} from '../booking.js';
import { db, TRANSACTION_OPTIONS } from '../firebase.js';
import type { BookingDoc } from '../types.js';
import { sendReminderPush } from './reminders.js';

export const expirePendingHolds = onSchedule('every 5 minutes', async () => {
  const now = Timestamp.now();
  const snapshot = await db
    .collection('bookings')
    .where('status', '==', 'pending')
    .where('holdExpiresAt', '<=', now)
    .limit(100)
    .get();

  for (const doc of snapshot.docs) {
    try {
      await db.runTransaction(async (transaction) => {
        const fresh = await transaction.get(bookingRef(doc.id));
        if (!fresh.exists) return;
        await expireBookingInTransaction(
          transaction,
          bookingRef(doc.id),
          fresh as QueryDocumentSnapshot,
          now,
        );
      }, TRANSACTION_OPTIONS);
    } catch (error) {
      logger.error(`Failed to expire booking ${doc.id}`, error);
    }
  }
});

export const sendReminders = onSchedule('every 15 minutes', async () => {
  const now = Date.now();
  const horizon = now + 25 * 3_600_000;
  const snapshot = await db
    .collection('bookings')
    .where('status', '==', 'confirmed')
    .where('startUtc', '>=', Timestamp.fromMillis(now))
    .where('startUtc', '<=', Timestamp.fromMillis(horizon))
    .limit(200)
    .get();

  for (const doc of snapshot.docs) {
    const booking = { ...(doc.data() as BookingDoc), id: doc.id };
    const hoursUntil = (booking.startUtc.toMillis() - now) / 3_600_000;
    const needs24h = hoursUntil <= 24 && hoursUntil > 1 && !booking.reminder24hSent;
    const needs1h = hoursUntil <= 1 && hoursUntil > 0 && !booking.reminder1hSent;
    if (!needs24h && !needs1h) continue;

    try {
      await sendReminderPush(booking, needs1h ? '1h' : '24h');
      await bookingRef(doc.id).update({
        [needs1h ? 'reminder1hSent' : 'reminder24hSent']: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      logger.error(`Failed to send reminder for booking ${doc.id}`, error);
    }
  }
});

export const completePastBookings = onSchedule('every hour', async () => {
  const snapshot = await db
    .collection('bookings')
    .where('status', '==', 'confirmed')
    .where('endUtc', '<=', Timestamp.now())
    .limit(200)
    .get();

  const batch = db.batch();
  for (const doc of snapshot.docs) {
    batch.update(doc.ref, { status: 'completed', updatedAt: Timestamp.now() });
  }
  await batch.commit();
});
