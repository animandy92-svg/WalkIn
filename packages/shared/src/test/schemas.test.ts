import assert from 'node:assert/strict';
import test from 'node:test';
import { createBookingRequestSchema, saveServiceRequestSchema } from '../index.js';

test('createBooking request requires a usable idempotency key', () => {
  const base = {
    providerId: 'provider-1',
    serviceId: 'service-1',
    startUtc: '2026-11-20T10:00:00Z',
    source: 'web' as const,
  };

  assert.equal(createBookingRequestSchema.safeParse({ ...base, idempotencyKey: 'short' }).success, false);
  assert.equal(createBookingRequestSchema.safeParse({ ...base, idempotencyKey: 'client-abc-123' }).success, true);
});

test('service schema applies defaults and rejects invalid modes', () => {
  const parsed = saveServiceRequestSchema.parse({
    providerId: 'provider-1',
    name: 'Haircut',
    description: 'Standard cut',
    durationMinutes: 30,
    price: { amountCents: 2500, currency: 'usd' },
    confirmationMode: 'instant',
    capacityScope: 'staff',
    staffIds: ['staff-1'],
  });

  assert.equal(parsed.price.currency, 'USD');
  assert.equal(parsed.bufferBeforeMinutes, 0);
  assert.equal(parsed.active, true);

  const invalid = saveServiceRequestSchema.safeParse({
    providerId: 'provider-1',
    name: 'Haircut',
    description: '',
    durationMinutes: 30,
    price: { amountCents: 2500, currency: 'USD' },
    confirmationMode: 'maybe',
    capacityScope: 'staff',
    staffIds: ['staff-1'],
  });
  assert.equal(invalid.success, false);
});
