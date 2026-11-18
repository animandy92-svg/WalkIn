import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import { callFunction, closeAdmin, db, signIn, Timestamp } from './common.mjs';
import { CUSTOMER_COUNT, seed } from './seed.mjs';

after(async () => {
  await closeAdmin();
});

const seeded = await seed();
const customerTokens = await Promise.all(
  Array.from({ length: CUSTOMER_COUNT }, (_, index) =>
    signIn(seeded.customerEmails[index])),
);

// The Functions emulator starts a fresh worker per concurrent request. Warm the
// createBooking worker once so 20 simultaneous calls don't all race cold starts.
await assert.rejects(
  () => callFunction('createBooking', {
    providerId: seeded.providerId,
    serviceId: seeded.instantServiceId,
    startUtc: '2020-01-01T00:00:00.000Z',
    idempotencyKey: `warmup-${Date.now()}`,
    source: 'web',
  }, customerTokens[0]),
  (error) => error.code === 'INVALID_TIME',
);

async function availabilityFor(serviceId, token) {
  const result = await callFunction('getAvailability', {
    providerId: seeded.providerId,
    serviceId,
    date: seeded.targetDate,
  }, token);
  assert.ok(result.slots.length > 0, 'seed data should produce availability');
  return result.slots;
}

test('20 parallel bookings for a single-capacity slot produce exactly one booking', async () => {
  const slots = await availabilityFor(seeded.instantServiceId, customerTokens[0]);
  const slot = slots[0];

  const results = await Promise.allSettled(customerTokens.map((token, index) =>
    callFunction('createBooking', {
      providerId: seeded.providerId,
      serviceId: seeded.instantServiceId,
      startUtc: slot.startUtc,
      idempotencyKey: `concurrency-${Date.now()}-${index}`,
      source: 'web',
    }, token)));

  const successful = results.filter((result) => result.status === 'fulfilled');
  const failed = results.filter((result) => result.status === 'rejected');

  assert.equal(successful.length, 1, 'exactly one booking should succeed');
  assert.equal(failed.length, CUSTOMER_COUNT - 1, 'all other attempts should fail');
  for (const failure of failed) {
    assert.equal(failure.reason.code, 'SLOT_UNAVAILABLE');
  }

  const stored = await db.collection('bookings')
    .where('providerId', '==', seeded.providerId)
    .where('startUtc', '==', Timestamp.fromMillis(Date.parse(slot.startUtc)))
    .get();
  assert.equal(stored.size, 1, 'Firestore should contain exactly one booking for the slot');
});

test('approval holds are idempotent and only provider staff can review them', async () => {
  const token = customerTokens[0];
  const slots = await availabilityFor(seeded.approvalServiceId, token);
  const slot = slots[0];
  const idempotencyKey = `approval-${Date.now()}`;

  const request = {
    providerId: seeded.providerId,
    serviceId: seeded.approvalServiceId,
    startUtc: slot.startUtc,
    idempotencyKey,
    source: 'web',
  };

  const first = await callFunction('createBooking', request, token);
  assert.equal(first.booking.status, 'pending');
  assert.ok(first.booking.holdExpiresAt, 'pending booking should carry a hold expiry');

  const repeated = await callFunction('createBooking', request, token);
  assert.equal(repeated.booking.id, first.booking.id, 'idempotency key must be honoured');

  const otherOwnerToken = await signIn('other-owner@walkin.test');
  await assert.rejects(
    () => callFunction('respondToBooking', {
      bookingId: first.booking.id,
      action: 'confirm',
    }, otherOwnerToken),
    (error) => error.code === 'PERMISSION_DENIED',
  );

  const ownerToken = await signIn('owner@walkin.test');
  const confirmed = await callFunction('respondToBooking', {
    bookingId: first.booking.id,
    action: 'confirm',
  }, ownerToken);
  assert.equal(confirmed.booking.status, 'confirmed');
});
