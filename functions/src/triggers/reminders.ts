import { logger } from 'firebase-functions';
import { db, messages } from '../firebase.js';
import type { BookingDoc, ProviderDoc, UserDoc } from '../types.js';

export async function sendReminderPush(booking: BookingDoc, window: '24h' | '1h'): Promise<void> {
  const snapshot = await db.collection('users').doc(booking.customerId).get();
  const tokens = snapshot.exists
    ? Object.keys((snapshot.data() as UserDoc).fcmTokens ?? {})
    : [];
  if (tokens.length === 0) return;

  const provider = await db.collection('providers').doc(booking.providerId).get();
  const name = provider.exists ? (provider.data() as ProviderDoc).name : 'your provider';

  try {
    const messaging = await messages();
    await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: 'Upcoming appointment',
        body: `${name} in ${window === '1h' ? '1 hour' : '24 hours'}.`,
      },
      data: { bookingId: booking.id, window },
    });
  } catch (error) {
    logger.warn('Unable to send reminder', error);
  }
}
