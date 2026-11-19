export const CAMPUS_TZ = 'Africa/Accra';

const pad = (value: number) => String(value).padStart(2, '0');

/** GH₵35 or GH₵35.50; other currencies fall back to Intl. */
export function money(amountCents: number, currency = 'GHS'): string {
  const whole = amountCents % 100 === 0;
  if (currency === 'GHS') {
    return `GH₵${(amountCents / 100).toFixed(whole ? 0 : 2)}`;
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : 2,
  }).format(amountCents / 100);
}

function parts(iso: string | Date, timeZone: string) {
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(date);
  const get = (type: string) => formatted.find((part) => part.type === type)?.value ?? '';
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    weekday: get('weekday'),
  };
}

/** 10:30am, 1pm */
export function clock(hour: number, minute = 0): string {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${h}${suffix}` : `${h}:${pad(minute)}${suffix}`;
}

export function timeLabel(iso: string, timeZone = CAMPUS_TZ): string {
  const p = parts(iso, timeZone);
  return clock(p.hour, p.minute);
}

/** Local hour as a decimal, e.g. 10.5 for 10:30. */
export function localHour(iso: string, timeZone = CAMPUS_TZ): number {
  const p = parts(iso, timeZone);
  return p.hour + p.minute / 60;
}

export function dateKeyOf(iso: string | Date, timeZone = CAMPUS_TZ): string {
  const p = parts(iso, timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function todayKey(timeZone = CAMPUS_TZ): string {
  return dateKeyOf(new Date(), timeZone);
}

export function nowHour(timeZone = CAMPUS_TZ): number {
  return localHour(new Date().toISOString(), timeZone);
}

export function shiftDateKey(key: string, days: number): string {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function weekdayOf(key: string): number {
  return new Date(`${key}T12:00:00Z`).getUTCDay();
}

export function weekdayName(index: number, long = false): string {
  return (long ? WEEKDAYS_LONG : WEEKDAYS)[index] ?? '';
}

/** Thu 19 Nov */
export function dayLabel(key: string): string {
  const date = new Date(`${key}T12:00:00Z`);
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

/** Today / Tomorrow / Sat 21 Nov */
export function relativeDay(key: string, timeZone = CAMPUS_TZ): string {
  const today = todayKey(timeZone);
  if (key === today) return 'Today';
  if (key === shiftDateKey(today, 1)) return 'Tomorrow';
  if (key === shiftDateKey(today, -1)) return 'Yesterday';
  return dayLabel(key);
}

export function whenLabel(iso: string, timeZone = CAMPUS_TZ): string {
  return `${relativeDay(dateKeyOf(iso, timeZone), timeZone)}, ${timeLabel(iso, timeZone)}`;
}

export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

export function timeLeft(iso: string | null): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso) - Date.now();
  if (ms <= 0) return 'hold expired';
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `${minutes} min left`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min left` : `${hours} hr left`;
}

/** Short, stable reference for a booking or customer id: WK-4F7Q */
export function shortRef(id: string, prefix = 'WK'): string {
  return `${prefix}-${id.slice(-4).toUpperCase()}`;
}

export function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
