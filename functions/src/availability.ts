import type { CapacityScope } from '@walkin/shared';
import type { AvailabilityRuleDoc } from './types.js';
import {
  GRID_MS,
  MINUTE_MS,
  buildSlotKeys,
  dateKeysBetween,
  localIntervalToUtc,
  localLabelFor,
  weekdayForDate,
} from './time.js';

export const ANY_STAFF_KEY = '__any__';

export interface StaffResource {
  id: string;
  concurrentSlots: number;
}

export interface SlotCandidate {
  startMs: number;
  endMs: number;
  staffId: string | null;
  staffKey: string;
  capacity: number;
  slotKeys: string[];
  cells: number[];
  localLabel: string;
}

export interface BuildSlotsInput {
  providerId: string;
  timeZone: string;
  nowMs: number;
  leadTimeMinutes: number;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  capacityScope: CapacityScope;
  providerDefaultCapacity: number;
  staff: StaffResource[];
  rules: AvailabilityRuleDoc[];
  fromMs: number;
  toMs: number;
}

interface Pool {
  staffId: string | null;
  staffKey: string;
  capacity: number;
}

function poolsFor(input: BuildSlotsInput): Pool[] {
  if (input.capacityScope === 'provider') {
    return [{
      staffId: null,
      staffKey: ANY_STAFF_KEY,
      capacity: input.providerDefaultCapacity,
    }];
  }

  return input.staff.map((member) => ({
    staffId: member.id,
    staffKey: member.id,
    capacity: member.concurrentSlots,
  }));
}

function rulesForPool(rules: AvailabilityRuleDoc[], staffKey: string): AvailabilityRuleDoc[] {
  if (staffKey === ANY_STAFF_KEY) return rules.filter((rule) => !rule.staffId);
  return rules.filter((rule) => !rule.staffId || rule.staffId === staffKey);
}

function isEffective(rule: AvailabilityRuleDoc, nowMs: number): boolean {
  const from = rule.effectiveFrom?.toMillis();
  const until = rule.effectiveUntil?.toMillis();
  if (from !== undefined && from !== null && nowMs < from) return false;
  if (until !== undefined && until !== null && nowMs > until) return false;
  return true;
}

function intervalsForDate(
  dateKey: string,
  zone: string,
  rules: AvailabilityRuleDoc[],
  nowMs: number,
): Array<{ startMs: number; endMs: number }> {
  const weekday = weekdayForDate(dateKey, zone);
  const intervals: Array<{ startMs: number; endMs: number }> = [];

  for (const rule of rules) {
    if (!isEffective(rule, nowMs)) continue;
    if (rule.kind === 'weekly' && rule.dayOfWeek === weekday && rule.startLocal && rule.endLocal) {
      const converted = localIntervalToUtc(dateKey, rule.startLocal, rule.endLocal, zone);
      if (converted) intervals.push(converted);
    }
  }

  for (const rule of rules) {
    if (!isEffective(rule, nowMs)) continue;
    if (rule.kind !== 'exception' || rule.date !== dateKey) continue;

    if (!rule.intervals || rule.intervals.length === 0) return [];

    const special: Array<{ startMs: number; endMs: number }> = [];
    for (const interval of rule.intervals) {
      const converted = localIntervalToUtc(dateKey, interval.startLocal, interval.endLocal, zone);
      if (converted) special.push(converted);
    }
    return special;
  }

  return intervals;
}

export function buildSlotCandidates(input: BuildSlotsInput): SlotCandidate[] {
  const pools = poolsFor(input);
  const dateKeys = dateKeysBetween(input.fromMs, input.toMs, input.timeZone);
  const durationMs = input.durationMinutes * MINUTE_MS;
  const beforeMs = input.bufferBeforeMinutes * MINUTE_MS;
  const afterMs = input.bufferAfterMinutes * MINUTE_MS;
  const totalMs = beforeMs + durationMs + afterMs;
  const earliestStartMs = input.nowMs + input.leadTimeMinutes * MINUTE_MS;
  const seen = new Set<string>();
  const candidates: SlotCandidate[] = [];

  for (const pool of pools) {
    const rules = rulesForPool(input.rules, pool.staffKey);

    for (const dateKey of dateKeys) {
      const intervals = intervalsForDate(dateKey, input.timeZone, rules, input.nowMs);

      for (const interval of intervals) {
        let cursor = Math.ceil(interval.startMs / GRID_MS) * GRID_MS;

        while (cursor + totalMs <= interval.endMs) {
          if (cursor >= earliestStartMs) {
            const dedupeKey = `${cursor}|${pool.staffKey}`;
            if (!seen.has(dedupeKey)) {
              seen.add(dedupeKey);
              const firstCellMs = Math.floor((cursor - beforeMs) / GRID_MS) * GRID_MS;
              const lastCellMs = Math.ceil((cursor + durationMs + afterMs) / GRID_MS) * GRID_MS;
              const cellCount = Math.max(1, Math.round((lastCellMs - firstCellMs) / GRID_MS));
              const cells = Array.from(
                { length: cellCount },
                (_, index) => firstCellMs + index * GRID_MS,
              );

              candidates.push({
                startMs: cursor,
                endMs: cursor + durationMs,
                staffId: pool.staffId,
                staffKey: pool.staffKey,
                capacity: pool.capacity,
                slotKeys: buildSlotKeys(input.providerId, pool.staffKey, firstCellMs, cellCount),
                cells,
                localLabel: localLabelFor(cursor, input.timeZone),
              });
            }
          }
          cursor += GRID_MS;
        }
      }
    }
  }

  return candidates.sort((left, right) => left.startMs - right.startMs);
}
