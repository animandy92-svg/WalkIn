import { logger } from 'firebase-functions';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { db, messages } from '../firebase.js';
import type { BookingDoc, ProviderDoc, UserDoc } from '../types.js';

async function fcmTokensFor(userIds: string[]): Promise<string[]> {
  if (userIds.length === 0) return [];
  const snapshots = await db.getAll(...userIds.map((uid) => db.collection('users').doc(uid)));
  return snapshots.flatMap((snapshot) => {
    if (!snapshot.exists) return [];
    return Object.keys((snapshot.data() as UserDoc).fcmTokens ?? {});
  });
}

async function providerStaffTokens(providerId: string): Promise<string[]> {
  const snapshot = await db.collection('users').where('providerId', '==', providerId).get();
  return snapshot.docs.flatMap((doc) => Object.keys((doc.data() as UserDoc).fcmTokens ?? {}));
}

async function sendPush(tokens: string[], title: string, body: string, data: Record<string, string>) {
  if (tokens.length === 0) return;
  try {
    const messaging = await messages();
    await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
      data,
    });
  } catch (error) {
    logger.warn('Unable to send push notification', error);
  }
}

async function providerName(providerId: string): Promise<string> {
  const snapshot = await db.collection('providers').doc(providerId).get();
  return snapshot.exists ? (snapshot.data() as ProviderDoc).name : 'WalkIn';
}

export const onBookingCreated = onDocumentCreated('bookings/{bookingId}', async (event) => {
  const data = event.data?.data();
  if (!data) return;
  const booking = { ...(data as BookingDoc), id: event.params.bookingId as string };
  const name = await providerName(booking.providerId);

  const customerTitle = booking.status === 'pending' ? 'Booking requested' : 'Booking confirmed';
  await sendPush(
    await fcmTokensFor([booking.customerId]),
    customerTitle,
    `${name} — your appointment is ${booking.status === 'pending' ? 'awaiting approval' : 'confirmed'}.`,
    { bookingId: booking.id, status: booking.status },
  );

  if (booking.status === 'pending') {
    await sendPush(
      await providerStaffTokens(booking.providerId),
      'New booking request',
      `Review the request for ${name}.`,
      { bookingId: booking.id, status: booking.status },
    );
  }
});

export const onBookingUpdated = onDocumentUpdated('bookings/{bookingId}', async (event) => {
  const before = event.data?.before.data() as BookingDoc | undefined;
  const after = event.data?.after.data() as BookingDoc | undefined;
  if (!before || !after || before.status === after.status) return;

  const booking = { ...after, id: event.params.bookingId as string };
  const name = await providerName(booking.providerId);

  const messagesByStatus: Record<string, { title: string; body: string }> = {
    confirmed: { title: 'Booking confirmed', body: `${name} confirmed your appointment.` },
    rejected: { title: 'Booking declined', body: `${name} could not accept your appointment.` },
    expired: { title: 'Booking expired', body: `Your request with ${name} expired.` },
    cancelled: { title: 'Booking cancelled', body: `Your appointment with ${name} was cancelled.` },
  };

  const message = messagesByStatus[booking.status];
  if (!message) return;

  await sendPush(
    await fcmTokensFor([booking.customerId]),
    message.title,
    message.body,
    { bookingId: booking.id, status: booking.status },
  );
});
