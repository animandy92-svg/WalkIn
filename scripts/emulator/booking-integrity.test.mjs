import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import { callFunction, closeAdmin, db, runScheduled, signIn, Timestamp } from './common.mjs';
import { seed } from './seed.mjs';

after(async () => {
  await closeAdmin();
});

let seeded = await seed();
let customerToken = await signIn(seeded.customerEmails[0]);
let ownerToken = await signIn('owner@walkin.test');

async function slotsFor(serviceId) {
  const result = await callFunction('getAvailability', {
    providerId: seeded.providerId,
    serviceId,
    date: seeded.targetDate,
  }, customerToken);
  assert.ok(result.slots.length > 5, 'seed data should produce several slots');
  return result.slots;
}

async function createBooking(serviceId, startUtc, suffix) {
  const result = await callFunction('createBooking', {
    providerId: seeded.providerId,
    serviceId,
    startUtc,
    idempotencyKey: `integrity-${suffix}-${Date.now()}-${Math.random()}`,
    source: 'web',
  }, customerToken);
  return result.booking;
}

// Re-seeding rotates provider ids, so the owner's custom claims (and token)
// must be refreshed too.
async function reseed() {
  seeded = await seed();
  customerToken = await signIn(seeded.customerEmails[0]);
  ownerToken = await signIn('owner@walkin.test');
}

test('an expired hold releases its locks and frees the slot for a new booking', async () => {
  await reseed();
  const slot = (await slotsFor(seeded.approvalServiceId))[0];
  const booking = await createBooking(seeded.approvalServiceId, slot.startUtc, 'hold');
  assert.equal(booking.status, 'pending');

  const ref = db.collection('bookings').doc(booking.id);
  const original = (await ref.get()).data();
  const lockRefs = original.slotKeys.map((key) => db.collection('slotLocks').doc(key));
  const locksBefore = await Promise.all(lockRefs.map((lockRef) => lockRef.get()));

  await ref.update({ holdExpiresAt: Timestamp.fromMillis(Date.now() - 60_000) });

  await assert.rejects(
    () => callFunction('respondToBooking', { bookingId: booking.id, action: 'confirm' }, ownerToken),
    (error) => error.code === 'HOLD_EXPIRED',
  );

  await runScheduled('expirePendingHolds');

  const expired = (await ref.get()).data();
  assert.equal(expired.status, 'expired');
  assert.equal(expired.holdExpiresAt, null);

  const locksAfter = await Promise.all(lockRefs.map((lockRef) => lockRef.get()));
  for (const [index, lockBefore] of locksBefore.entries()) {
    assert.equal(
      locksAfter[index].data().occupied,
      lockBefore.data().occupied - 1,
      `slot lock ${original.slotKeys[index]} should be released`,
    );
  }

  const rebooked = await createBooking(seeded.instantServiceId, slot.startUtc, 'rebook');
  assert.equal(rebooked.status, 'confirmed');
});

test('a live pending hold is left untouched by the expiry job', async () => {
  await reseed();
  const slot = (await slotsFor(seeded.approvalServiceId))[0];
  const booking = await createBooking(seeded.approvalServiceId, slot.startUtc, 'live-hold');
  const ref = db.collection('bookings').doc(booking.id);

  await runScheduled('expirePendingHolds');

  assert.equal((await ref.get()).data().status, 'pending');
});

test('cancelling a confirmed booking releases its slot locks', async () => {
  await reseed();
  const slot = (await slotsFor(seeded.instantServiceId))[0];
  const booking = await createBooking(seeded.instantServiceId, slot.startUtc, 'cancel');

  const ref = db.collection('bookings').doc(booking.id);
  const original = (await ref.get()).data();
  const lockRefs = original.slotKeys.map((key) => db.collection('slotLocks').doc(key));
  const before = await Promise.all(lockRefs.map((lockRef) => lockRef.get()));

  const cancelled = await callFunction('cancelBooking', { bookingId: booking.id }, customerToken);
  assert.equal(cancelled.booking.status, 'cancelled');

  const after = await Promise.all(lockRefs.map((lockRef) => lockRef.get()));
  for (const [index, lockBefore] of before.entries()) {
    assert.equal(after[index].data().occupied, lockBefore.data().occupied - 1);
  }
});

test('rejecting a pending booking releases its slot locks', async () => {
  await reseed();
  const slot = (await slotsFor(seeded.approvalServiceId))[0];
  const booking = await createBooking(seeded.approvalServiceId, slot.startUtc, 'reject');

  const ref = db.collection('bookings').doc(booking.id);
  const original = (await ref.get()).data();
  const lockRefs = original.slotKeys.map((key) => db.collection('slotLocks').doc(key));
  const before = await Promise.all(lockRefs.map((lockRef) => lockRef.get()));

  const rejected = await callFunction('respondToBooking', {
    bookingId: booking.id,
    action: 'reject',
  }, ownerToken);
  assert.equal(rejected.booking.status, 'rejected');

  const after = await Promise.all(lockRefs.map((lockRef) => lockRef.get()));
  for (const [index, lockBefore] of before.entries()) {
    assert.equal(after[index].data().occupied, lockBefore.data().occupied - 1);
  }
});

test('reminders are claimed exactly once per booking and window', async () => {
  await reseed();
  const slots = await slotsFor(seeded.instantServiceId);
  const bookings = [];
  // 30-minute bookings on a 15-minute grid need a gap of at least two cells.
  const slotIndexes = [2, 5];

  for (const [index, hoursUntil] of [12, 0.5].entries()) {
    const booking = await createBooking(
      seeded.instantServiceId,
      slots[slotIndexes[index]].startUtc,
      `reminder-${index}`,
    );
    const ref = db.collection('bookings').doc(booking.id);
    const startMs = Date.now() + hoursUntil * 3_600_000;
    await ref.update({
      startUtc: Timestamp.fromMillis(startMs),
      endUtc: Timestamp.fromMillis(startMs + 30 * 60_000),
      reminder24hSent: false,
      reminder1hSent: false,
    });
    bookings.push({ id: booking.id, window: hoursUntil === 12 ? '24h' : '1h' });
  }

  // Two runs (stand-ins for overlapping scheduler invocations) must not
  // produce a second notification for either window.
  await runScheduled('sendReminders');
  await runScheduled('sendReminders');

  for (const { id, window } of bookings) {
    const data = (await db.collection('bookings').doc(id).get()).data();
    assert.equal(data[window === '24h' ? 'reminder24hSent' : 'reminder1hSent'], true);

    const logs = await db.collection('notificationLogs')
      .where('bookingId', '==', id)
      .where('window', '==', window)
      .get();
    assert.equal(logs.size, 1, `exactly one ${window} reminder log`);
    assert.equal(logs.docs[0].id, `${id}_${window}`);
    assert.equal(logs.docs[0].data().status, 'sent');
  }
});

test('booking lifecycle writes audit records', async () => {
  await reseed();
  const slot = (await slotsFor(seeded.instantServiceId))[0];
  const booking = await createBooking(seeded.instantServiceId, slot.startUtc, 'audit');

  const cancelled = await callFunction('cancelBooking', { bookingId: booking.id }, customerToken);
  assert.equal(cancelled.booking.status, 'cancelled');

  const logs = await db.collection('auditLogs')
    .where('bookingId', '==', booking.id)
    .orderBy('createdAt', 'asc')
    .get();

  const actions = logs.docs.map((doc) => doc.data().action);
  assert.deepEqual(actions, ['booking.created', 'booking.cancelled']);
  for (const doc of logs.docs) {
    assert.equal(doc.data().providerId, seeded.providerId);
    assert.equal(doc.data().actor, booking.customerId);
  }
});
