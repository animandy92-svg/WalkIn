import type { BookingStatus } from '@walkin/shared';
import type { ReminderWindow } from '../types.js';

const HOUR_MS = 3_600_000;

/** Kept structural so this helper stays pure and easy to unit test. */
export interface ReminderDueInput {
  status: BookingStatus;
  startUtc: { toMillis(): number };
  reminder24hSent?: boolean;
  reminder1hSent?: boolean;
}

/**
 * The 24h window covers (1h, 24h] and the 1h window covers (0h, 1h], so a
 * booking can only be due for one window at a time. Returning an array keeps
 * the claim logic general if the windows ever overlap.
 */
export function dueReminderWindows(booking: ReminderDueInput, nowMs: number): ReminderWindow[] {
  if (booking.status !== 'confirmed') return [];

  const hoursUntil = (booking.startUtc.toMillis() - nowMs) / HOUR_MS;
  const windows: ReminderWindow[] = [];

  if (hoursUntil <= 24 && hoursUntil > 1 && !booking.reminder24hSent) windows.push('24h');
  if (hoursUntil <= 1 && hoursUntil > 0 && !booking.reminder1hSent) windows.push('1h');

  return windows;
}

export function reminderLogId(bookingId: string, window: ReminderWindow): string {
  return `${bookingId}_${window}`;
}
