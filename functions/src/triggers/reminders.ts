import {
  Timestamp,
  type DocumentReference,
  type QueryDocumentSnapshot,
  type Transaction,
} from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { writeAuditLogInTransaction } from '../audit.js';
import { db, messages } from '../firebase.js';
import type { BookingDoc, ReminderWindow } from '../types.js';
import { readDoc } from '../views.js';
import { dueReminderWindows, reminderLogId } from './reminderWindows.js';

export interface ClaimedReminders {
  booking: BookingDoc;
  windows: ReminderWindow[];
}

/**
 * Atomically claims every reminder window that is currently due. The booking
 * flags and deterministic notification log rows are written in one Firestore
 * transaction, so two scheduler runs can never both claim the same reminder.
 */
export async function claimRemindersInTransaction(
  transaction: Transaction,
  ref: DocumentReference,
  snapshot: QueryDocumentSnapshot,
  now: Timestamp,
): Promise<ClaimedReminders | null> {
  const booking = readDoc<BookingDoc>(snapshot);
  const windows = dueReminderWindows(booking, now.toMillis());
  if (windows.length === 0) return null;

  const updates: {
    reminder24hSent?: boolean;
    reminder1hSent?: boolean;
    updatedAt: Timestamp;
  } = { updatedAt: now };
  for (const window of windows) {
    if (window === '24h') updates.reminder24hSent = true;
    else updates.reminder1hSent = true;
  }

  transaction.update(ref, updates);

  for (const window of windows) {
    transaction.set(db.collection('notificationLogs').doc(reminderLogId(booking.id, window)), {
      bookingId: booking.id,
      providerId: booking.providerId,
      customerId: booking.customerId,
      window,
      status: 'claimed',
      createdAt: now,
      updatedAt: now,
    });
    writeAuditLogInTransaction(transaction, {
      action: 'notification.reminder.claimed',
      resourceType: 'notification',
      resourceId: reminderLogId(booking.id, window),
      actor: 'system',
      providerId: booking.providerId,
      bookingId: booking.id,
      metadata: { window },
    });
  }

  return { booking: { ...booking, ...updates }, windows };
}

export async function markReminderResult(
  bookingId: string,
  window: ReminderWindow,
  status: 'sent' | 'failed',
): Promise<void> {
  await db.collection('notificationLogs').doc(reminderLogId(bookingId, window)).update({
    status,
    updatedAt: Timestamp.now(),
  });
}

async function fcmTokensFor(userIds: string[]): Promise<string[]> {
  if (userIds.length === 0) return [];
  const snapshots = await db.getAll(...userIds.map((uid) => db.collection('users').doc(uid)));
  return snapshots.flatMap((snapshot) => {
    if (!snapshot.exists) return [];
    return Object.keys((snapshot.data() as { fcmTokens?: Record<string, unknown> }).fcmTokens ?? {});
  });
}

/**
 * Sends a reminder and lets FCM failures propagate so the caller can record
 * them. A claimed reminder is never silently marked as sent after a failure.
 */
export async function sendReminderPush(booking: BookingDoc, window: ReminderWindow): Promise<void> {
  const tokens = await fcmTokensFor([booking.customerId]);
  if (tokens.length === 0) return;

  const provider = await db.collection('providers').doc(booking.providerId).get();
  const name = provider.exists ? provider.data()?.name ?? 'your provider' : 'your provider';

  const messaging = await messages();
  const result = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title: 'Upcoming appointment',
      body: `${name} in ${window === '1h' ? '1 hour' : '24 hours'}.`,
    },
    data: { bookingId: booking.id, window },
  });

  if (result.failureCount > 0) {
    throw new Error(`${result.failureCount} FCM token(s) rejected the ${window} reminder`);
  }
  logger.info(`Sent ${window} reminder for booking ${booking.id}`);
}
