import assert from 'node:assert/strict';
import test from 'node:test';
import { Timestamp } from 'firebase-admin/firestore';
import { dueReminderWindows, reminderLogId } from '../triggers/reminderWindows.js';
import type { ReminderDueInput } from '../triggers/reminderWindows.js';

const now = Date.parse('2026-11-18T12:00:00.000Z');

function booking(hoursUntil: number, overrides: Partial<ReminderDueInput> = {}): ReminderDueInput {
  return {
    status: 'confirmed',
    startUtc: Timestamp.fromMillis(now + hoursUntil * 3_600_000),
    ...overrides,
  };
}

test('the 24h window is due between 1h and 24h before start', () => {
  assert.deepEqual(dueReminderWindows(booking(12), now), ['24h']);
  assert.deepEqual(dueReminderWindows(booking(24), now), ['24h']);
});

test('the 1h window is due inside the final hour', () => {
  assert.deepEqual(dueReminderWindows(booking(0.5), now), ['1h']);
  assert.deepEqual(dueReminderWindows(booking(1), now), ['1h']);
});

test('a sent flag suppresses its window', () => {
  assert.deepEqual(dueReminderWindows(booking(12, { reminder24hSent: true }), now), []);
  assert.deepEqual(dueReminderWindows(booking(0.5, { reminder1hSent: true }), now), []);
});

test('non-confirmed and past bookings are never due', () => {
  assert.deepEqual(dueReminderWindows(booking(12, { status: 'pending' }), now), []);
  assert.deepEqual(dueReminderWindows(booking(-1), now), []);
});

test('notification log ids are deterministic per booking and window', () => {
  assert.equal(reminderLogId('booking-1', '24h'), 'booking-1_24h');
  assert.equal(reminderLogId('booking-1', '1h'), 'booking-1_1h');
});
