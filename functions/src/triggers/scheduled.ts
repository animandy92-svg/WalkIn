import { Timestamp, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { writeAuditLog } from '../audit.js';
import {
  bookingRef,
  expireBookingInTransaction,
} from '../booking.js';
import { db, TRANSACTION_OPTIONS } from '../firebase.js';
import {
  claimRemindersInTransaction,
  markReminderResult,
  sendReminderPush,
} from './reminders.js';

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
  const now = Timestamp.now();
  const horizon = now.toMillis() + 25 * 3_600_000;
  const snapshot = await db
    .collection('bookings')
    .where('status', '==', 'confirmed')
    .where('startUtc', '>=', now)
    .where('startUtc', '<=', Timestamp.fromMillis(horizon))
    .limit(200)
    .get();

  for (const doc of snapshot.docs) {
    try {
      // Re-read and claim inside a transaction: a second run (or a retry) can
      // never claim the same window while this one is sending.
      const claimed = await db.runTransaction(async (transaction) => {
        const fresh = await transaction.get(doc.ref);
        if (!fresh.exists) return null;
        return claimRemindersInTransaction(
          transaction,
          doc.ref,
          fresh as QueryDocumentSnapshot,
          now,
        );
      }, TRANSACTION_OPTIONS);

      if (!claimed) continue;

      for (const window of claimed.windows) {
        try {
          await sendReminderPush(claimed.booking, window);
          await markReminderResult(claimed.booking.id, window, 'sent');
        } catch (error) {
          logger.error(`Failed to send ${window} reminder for booking ${claimed.booking.id}`, error);
          await markReminderResult(claimed.booking.id, window, 'failed');
        }
      }
    } catch (error) {
      logger.error(`Failed to claim reminders for booking ${doc.id}`, error);
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

  await Promise.all(snapshot.docs.map((doc) => {
    const booking = doc.data() as { providerId: string };
    return writeAuditLog({
      action: 'booking.completed',
      resourceType: 'booking',
      resourceId: doc.id,
      actor: 'system',
      providerId: booking.providerId,
      bookingId: doc.id,
    });
  }));
});
