export function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amountCents / 100);
}

export function formatAppointment(iso: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(iso));
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Calendar date (YYYY-MM-DD) of an instant in the provider's time zone. */
export function localDateKey(iso: string, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(iso));
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

/** Shift a plain calendar date by whole days without time-zone drift. */
export function shiftDateKey(key: string, days: number): string {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Monday of the week containing the given calendar date. */
export function weekStart(key: string): string {
  const weekday = new Date(`${key}T12:00:00Z`).getUTCDay(); // 0 = Sunday
  return shiftDateKey(key, weekday === 0 ? -6 : 1 - weekday);
}

export function formatDateKey(key: string, timeZone = 'UTC'): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(new Date(`${key}T12:00:00Z`));
}

export function formatClock(iso: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(iso));
}
