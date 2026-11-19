import type { GetProviderDetailsResponse, ProviderSummaryView, ServiceView, SlotView } from '@walkin/shared';
import { api } from './api';
import { CAMPUS_TZ, dateKeyOf, localHour, nowHour, todayKey } from './format';
import { leadService } from './vocab';

export type BoardRow = {
  provider: ProviderSummaryView;
  details: GetProviderDetailsResponse;
  service: ServiceView | undefined;
  slots: SlotView[];
  error?: string;
};

export type CellState =
  | { kind: 'open'; slots: SlotView[]; remaining: number }
  | { kind: 'full' }
  | { kind: 'closed' }
  | { kind: 'past' };

/** The timetable runs 7am to 9pm, one column per hour. */
export const BOARD_HOURS = Array.from({ length: 14 }, (_, index) => 7 + index);

const TTL_MS = 45_000;
let providersCache: { at: number; value: ProviderSummaryView[] } | null = null;
const detailsCache = new Map<string, { at: number; value: GetProviderDetailsResponse }>();
const boardCache = new Map<string, { at: number; value: BoardRow[] }>();

const fresh = (at: number) => Date.now() - at < TTL_MS;

export async function listProviders(): Promise<ProviderSummaryView[]> {
  if (providersCache && fresh(providersCache.at)) return providersCache.value;
  const { providers } = await api.listPublishedProviders();
  providersCache = { at: Date.now(), value: providers };
  return providers;
}

export async function providerDetails(slug: string): Promise<GetProviderDetailsResponse> {
  const cached = detailsCache.get(slug);
  if (cached && fresh(cached.at)) return cached.value;
  const result = await api.getProviderDetails({ slug });
  // Read a price list cheapest first, the way a shop's board lists it.
  const value = { ...result, services: [...result.services].sort((a, b) => a.price.amountCents - b.price.amountCents) };
  detailsCache.set(slug, { at: Date.now(), value });
  return value;
}

export async function loadBoard(dateKey: string, options: { force?: boolean } = {}): Promise<BoardRow[]> {
  const cached = boardCache.get(dateKey);
  if (!options.force && cached && fresh(cached.at)) return cached.value;

  const providers = await listProviders();
  const rows = await mapLimit(providers, 3, async (provider): Promise<BoardRow | null> => {
    let details: GetProviderDetailsResponse;
    try {
      details = await retryOnce(() => providerDetails(provider.slug));
    } catch {
      return null;
    }
    const service = leadService(provider.vertical, details.services);
    if (!service) return { provider, details, service, slots: [] };
    try {
      const slots = await retryOnce(() => slotsForDay(provider.id, service.id, dateKey, provider.timeZone));
      return { provider, details, service, slots };
    } catch {
      return { provider, details, service, slots: [], error: 'Could not read this shop’s times.' };
    }
  });

  const value = rows.filter((row): row is BoardRow => row !== null);
  if (value.every((row) => !row.error)) boardCache.set(dateKey, { at: Date.now(), value });
  return value;
}

/** Run at most `limit` calls at once; a burst of parallel callables can stall the local emulator. */
async function mapLimit<T, R>(items: T[], limit: number, run: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await run(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function retryOnce<T>(call: () => Promise<T>, ms = 8000): Promise<T> {
  try {
    return await withTimeout(call(), ms);
  } catch {
    return withTimeout(call(), ms);
  }
}

/**
 * Open slots for one provider-local day. The backend's `date` query also returns slots from the
 * following day, so keep only those that start on the requested date, sorted by time.
 */
export async function slotsForDay(
  providerId: string,
  serviceId: string,
  dateKey: string,
  timeZone = CAMPUS_TZ,
  staffId?: string,
): Promise<SlotView[]> {
  // Callables serialise an undefined field as null, which the schema rejects, so omit it.
  const { slots } = await api.getAvailability({ providerId, serviceId, date: dateKey, ...(staffId ? { staffId } : {}) });
  return slots
    .filter((slot) => dateKeyOf(slot.startUtc, timeZone) === dateKey)
    .sort((a, b) => a.startUtc.localeCompare(b.startUtc));
}

export function invalidateBoard(): void {
  boardCache.clear();
}

/** Group a day's open slots into the hour columns of the timetable. */
export function cellsFor(slots: SlotView[], dateKey: string, timeZone = CAMPUS_TZ): Map<number, CellState> {
  const cells = new Map<number, CellState>();
  const isToday = dateKey === todayKey(timeZone);
  const current = isToday ? nowHour(timeZone) : -1;
  const hours = slots.map((slot) => localHour(slot.startUtc, timeZone));
  const first = hours.length ? Math.floor(Math.min(...hours)) : null;
  const last = hours.length ? Math.floor(Math.max(...hours)) : null;

  for (const hour of BOARD_HOURS) {
    const inHour = slots.filter((slot) => Math.floor(localHour(slot.startUtc, timeZone)) === hour);
    if (inHour.length) {
      cells.set(hour, { kind: 'open', slots: inHour, remaining: inHour.reduce((sum, slot) => sum + slot.remaining, 0) });
    } else if (isToday && hour + 1 <= current) {
      cells.set(hour, { kind: 'past' });
    } else if (first !== null && last !== null && hour > first && hour < last) {
      cells.set(hour, { kind: 'full' });
    } else {
      cells.set(hour, { kind: 'closed' });
    }
  }
  return cells;
}

/** Earliest open slot on a row, for the "next free" column. */
export function nextOpen(slots: SlotView[]): SlotView | undefined {
  return [...slots].sort((a, b) => a.startUtc.localeCompare(b.startUtc))[0];
}
