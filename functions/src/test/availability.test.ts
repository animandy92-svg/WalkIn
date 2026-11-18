import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSlotCandidates, type BuildSlotsInput } from '../availability.js';
import { buildSlotKeys, weekdayForDate } from '../time.js';

const zone = 'America/New_York';
const targetDate = '2026-11-20';

function baseInput(overrides: Partial<BuildSlotsInput> = {}): BuildSlotsInput {
  return {
    providerId: 'provider-1',
    timeZone: zone,
    nowMs: Date.parse('2026-11-01T00:00:00Z'),
    leadTimeMinutes: 0,
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    capacityScope: 'staff',
    providerDefaultCapacity: 1,
    staff: [{ id: 'staff-1', concurrentSlots: 1 }],
    rules: [{
      kind: 'weekly',
      dayOfWeek: weekdayForDate(targetDate, zone),
      startLocal: '09:00',
      endLocal: '10:00',
    }],
    fromMs: Date.parse('2026-11-19T00:00:00Z'),
    toMs: Date.parse('2026-11-22T00:00:00Z'),
    ...overrides,
  };
}

test('slot keys encode provider, staff, and UTC cell', () => {
  assert.deepEqual(
    buildSlotKeys('provider-1', 'staff-1', Date.parse('2026-11-20T14:00:00Z'), 2),
    ['provider-1|staff-1|20261120_1400', 'provider-1|staff-1|20261120_1415'],
  );
});

test('weekly rules produce 15-minute starts in the provider time zone', () => {
  const candidates = buildSlotCandidates(baseInput());
  assert.equal(candidates.length, 3);
  assert.deepEqual(
    candidates.map((candidate) => new Date(candidate.startMs).toISOString()),
    [
      '2026-11-20T14:00:00.000Z',
      '2026-11-20T14:15:00.000Z',
      '2026-11-20T14:30:00.000Z',
    ],
  );
  assert.equal(candidates[0]?.staffId, 'staff-1');
  assert.equal(candidates[0]?.slotKeys.length, 2);
});

test('an exception with no intervals closes the day', () => {
  const candidates = buildSlotCandidates(baseInput({
    rules: [
      ...baseInput().rules,
      { kind: 'exception', date: targetDate, intervals: [], reason: 'Holiday' },
    ],
  }));
  assert.equal(candidates.length, 0);
});

test('provider capacity uses a shared pool without a staff id', () => {
  const candidates = buildSlotCandidates(baseInput({
    capacityScope: 'provider',
    providerDefaultCapacity: 3,
  }));
  assert.equal(candidates.length, 3);
  assert.equal(candidates[0]?.staffId, null);
  assert.equal(candidates[0]?.capacity, 3);
  assert.match(candidates[0]?.slotKeys[0] ?? '', /\|__any__\|/);
});
