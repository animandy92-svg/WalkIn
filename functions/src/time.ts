import { DateTime } from 'luxon';

export const GRID_MINUTES = 15;
export const GRID_MS = GRID_MINUTES * 60_000;
export const MINUTE_MS = 60_000;

export function buildSlotKeys(
  providerId: string,
  staffKey: string,
  firstCellMs: number,
  cellCount: number,
): string[] {
  const keys: string[] = [];
  for (let index = 0; index < cellCount; index += 1) {
    const cell = DateTime.fromMillis(firstCellMs + index * GRID_MS, { zone: 'utc' });
    keys.push(`${providerId}|${staffKey}|${cell.toFormat('yyyyLLdd_HHmm')}`);
  }
  return keys;
}

export function parseLocalTime(value: string): { hour: number; minute: number } | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match || match[1] === undefined || match[2] === undefined) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

export function dateKeysBetween(fromMs: number, toMs: number, zone: string): string[] {
  const start = DateTime.fromMillis(fromMs, { zone: 'utc' }).setZone(zone).startOf('day');
  const end = DateTime.fromMillis(toMs, { zone: 'utc' }).setZone(zone).startOf('day');
  const keys: string[] = [];
  let cursor = start;

  while (cursor <= end && keys.length < 62) {
    keys.push(cursor.toFormat('yyyy-LL-dd'));
    cursor = cursor.plus({ days: 1 });
  }

  return keys;
}

/** Luxon weekday is 1=Monday .. 7=Sunday; convert to 0=Sunday .. 6=Saturday. */
export function weekdayForDate(dateKey: string, zone: string): number {
  return DateTime.fromISO(dateKey, { zone }).weekday % 7;
}

export function localIntervalToUtc(
  dateKey: string,
  startLocal: string,
  endLocal: string,
  zone: string,
): { startMs: number; endMs: number } | null {
  const start = parseLocalTime(startLocal);
  const end = parseLocalTime(endLocal);
  const day = DateTime.fromISO(dateKey, { zone });
  if (!start || !end || !day.isValid) return null;

  let startAt = day.set({ hour: start.hour, minute: start.minute, second: 0, millisecond: 0 });
  let endAt = day.set({ hour: end.hour, minute: end.minute, second: 0, millisecond: 0 });
  if (endAt <= startAt) endAt = endAt.plus({ days: 1 });
  if (endAt <= startAt) return null;

  startAt = startAt.toUTC();
  endAt = endAt.toUTC();
  return { startMs: startAt.toMillis(), endMs: endAt.toMillis() };
}

export function localLabelFor(ms: number, zone: string): string {
  return DateTime.fromMillis(ms, { zone: 'utc' }).setZone(zone).toFormat('ccc, LLL d • HH:mm');
}

/** Slot keys end with the UTC cell in yyyyLLdd_HHmm form. */
export function cellMsFromKey(key: string): number | null {
  const suffix = key.split('|').pop();
  if (!suffix) return null;
  const cell = DateTime.fromFormat(suffix, 'yyyyLLdd_HHmm', { zone: 'utc' });
  return cell.isValid ? cell.toMillis() : null;
}
