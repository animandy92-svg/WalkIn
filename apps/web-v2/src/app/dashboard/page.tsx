'use client';

import type { BookingView } from '@walkin/shared';
import { ChevronLeft, ChevronRight, LoaderCircle, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { BookingFacts, RespondButtons, RespondError, useRespond } from '@/components/dashboard/booking-detail';
import { useDashboard } from '@/components/dashboard/context';
import { Drawer } from '@/components/dashboard/drawer';
import { Stamp } from '@/components/paper';
import { api } from '@/lib/api';
import { BOARD_HOURS } from '@/lib/board';
import { apiMessage } from '@/lib/errors';
import { clock, dateKeyOf, dayLabel, localHour, relativeDay, shiftDateKey, timeLabel, todayKey, weekdayOf } from '@/lib/format';
import { STATUS } from '@/lib/vocab';

const SHOWN: BookingView['status'][] = ['pending', 'confirmed', 'in_progress', 'ready_for_pickup', 'completed'];
const START = BOARD_HOURS[0];
const SPAN = BOARD_HOURS.length;
const HOUR_PX = 64;

/**
 * Place overlapping bookings (counter shops take several at once) side by side. Lanes are counted
 * per group of bookings that actually overlap, so a booking with nothing beside it keeps the full width.
 */
function placeLanes(items: BookingView[]) {
  const placed: Array<{ booking: BookingView; lane: number; lanes: number }> = [];
  let group: Array<{ booking: BookingView; lane: number }> = [];
  let ends: number[] = [];
  let groupEnd = -Infinity;
  const flush = () => {
    const lanes = Math.max(1, ends.length);
    for (const item of group) placed.push({ ...item, lanes });
    group = [];
    ends = [];
    groupEnd = -Infinity;
  };
  for (const booking of [...items].sort((a, b) => a.startUtc.localeCompare(b.startUtc))) {
    const start = Date.parse(booking.startUtc);
    const end = Date.parse(booking.endUtc);
    if (group.length && start >= groupEnd) flush();
    let lane = ends.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) lane = ends.length;
    ends[lane] = end;
    group.push({ booking, lane });
    groupEnd = Math.max(groupEnd, end);
  }
  flush();
  return placed;
}

export default function TimetablePage() {
  const { providerId, data, error: loadError, staffName, reload } = useDashboard();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [anchor, setAnchor] = useState(todayKey());
  const [bookings, setBookings] = useState<BookingView[] | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<BookingView | null>(null);
  const [stamped, setStamped] = useState<BookingView | null>(null);

  const tz = data?.provider.timeZone ?? 'Africa/Accra';
  const today = todayKey();
  const days = useMemo(() => {
    if (view === 'day') return [anchor];
    const monday = shiftDateKey(anchor, -((weekdayOf(anchor) + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => shiftDateKey(monday, index));
  }, [view, anchor]);

  const load = useCallback(() => {
    setBookings(null);
    setError('');
    api.listProviderBookings({
      providerId,
      from: `${days[0]}T00:00:00Z`,
      to: `${shiftDateKey(days[days.length - 1], 1)}T00:00:00Z`,
    })
      .then(({ bookings: list }) => setBookings(list.filter((booking) => SHOWN.includes(booking.status))))
      .catch((err) => setError(apiMessage(err, 'Could not load bookings.')));
  }, [providerId, days]);

  useEffect(() => {
    load();
  }, [load]);

  const { respond, busy, error: respondError } = useRespond((next) => {
    setStamped(next);
    void reload();
    load();
  });

  // Columns: each named staff member on a day view (one "Counter" for capacity shops), each day on a week view.
  const columns = useMemo(() => {
    const list = bookings ?? [];
    if (view === 'week') {
      return days.map((day) => ({
        key: day,
        label: relativeDay(day) === 'Today' ? 'Today' : dayLabel(day),
        isToday: day === today,
        items: list.filter((booking) => dateKeyOf(booking.startUtc, tz) === day),
      }));
    }
    const named = new Set((data?.services ?? []).flatMap((service) => service.staffIds).filter((id) => id !== '__any__'));
    const staffIds = new Set<string | null>((data?.staff ?? []).filter((member) => member.active && named.has(member.id)).map((member) => member.id));
    for (const booking of list) staffIds.add(booking.staffId);
    if (staffIds.size === 0) staffIds.add(null);
    return [...staffIds].map((id) => ({
      key: id ?? 'counter',
      label: staffName(id),
      isToday: anchor === today,
      items: list.filter((booking) => booking.staffId === id),
    }));
  }, [bookings, view, days, data, staffName, tz, anchor, today]);

  const active = (bookings ?? []).filter((booking) => booking.status !== 'completed');
  const pending = active.filter((booking) => booking.status === 'pending');
  const next = anchor === today
    ? active.filter((booking) => Date.parse(booking.startUtc) > Date.now()).sort((a, b) => a.startUtc.localeCompare(b.startUtc))[0]
    : undefined;
  const nowOffset = (localHour(new Date().toISOString(), tz) - START) * HOUR_PX;
  const showNow = nowOffset > 0 && nowOffset < SPAN * HOUR_PX;

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div className="stack-2">
          <h1 className="notice-heading h2">{view === 'day' ? (relativeDay(anchor) === 'Today' || relativeDay(anchor) === 'Tomorrow' ? `${relativeDay(anchor)} · ${dayLabel(anchor)}` : dayLabel(anchor)) : `Week of ${dayLabel(days[0])}`}</h1>
          <p className="dash-summary">
            {bookings === null ? 'Reading the timetable…' : (
              <>
                <strong>{active.length}</strong> booked
                {pending.length ? <> · <Link href="/dashboard/requests"><strong>{pending.length}</strong> waiting for your stamp</Link></> : null}
                {next ? <> · next: <strong>{timeLabel(next.startUtc, tz)}</strong> {next.priceSnapshot.serviceName}</> : null}
              </>
            )}
          </p>
        </div>
        <div className="row">
          <div className="seg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'day'} onClick={() => setView('day')}>Day</button>
            <button type="button" aria-pressed={view === 'week'} onClick={() => setView('week')}>Week</button>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button type="button" className="icon-btn" aria-label={view === 'day' ? 'Previous day' : 'Previous week'} onClick={() => setAnchor(shiftDateKey(anchor, view === 'day' ? -1 : -7))}><ChevronLeft aria-hidden="true" /></button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAnchor(today)}>Today</button>
            <button type="button" className="icon-btn" aria-label={view === 'day' ? 'Next day' : 'Next week'} onClick={() => setAnchor(shiftDateKey(anchor, view === 'day' ? 1 : 7))}><ChevronRight aria-hidden="true" /></button>
          </div>
        </div>
      </header>

      {loadError || error ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{loadError || error}</p> : null}

      <div className="cal-scroll">
        <div
          className="cal"
          style={{ gridTemplateColumns: `var(--cal-gutter) repeat(${Math.max(1, columns.length)}, minmax(var(${view === 'week' ? '--cal-week-col' : '--cal-day-col'}), 1fr))` } as CSSProperties}
          aria-label={view === 'day' ? `Bookings for ${dayLabel(anchor)}` : 'Bookings this week'}
          aria-busy={bookings === null}
        >
          <div className="cal__corner" />
          {columns.map((column) => (
            <div key={column.key} className={`cal__colhead ${view === 'week' && column.isToday ? 'is-today' : ''}`}>
              {column.label}
              <span className="meta">{bookings === null ? '' : `${column.items.filter((booking) => booking.status !== 'completed').length} booked`}</span>
            </div>
          ))}

          <div className="cal__gutter" style={{ height: SPAN * HOUR_PX }} aria-hidden="true">
            {BOARD_HOURS.map((hour) => (
              <span key={hour} style={{ top: (hour - START) * HOUR_PX }}>{clock(hour)}</span>
            ))}
          </div>

          {columns.map((column) => {
            const placed = placeLanes(column.items);
            return (
              <div key={column.key} className="cal__col" style={{ height: SPAN * HOUR_PX }}>
                {BOARD_HOURS.map((hour) => <span key={hour} className="cal__hour" style={{ height: HOUR_PX }} />)}
                {bookings === null ? (
                  <span className="cal__loading meta"><LoaderCircle className="spin" width={14} height={14} aria-hidden="true" />Loading</span>
                ) : null}
                {column.isToday && showNow ? <span className="cal__now" style={{ top: nowOffset }} aria-hidden="true" /> : null}
                {placed.map(({ booking, lane, lanes }) => {
                  const start = Math.max(START, localHour(booking.startUtc, tz));
                  const end = Math.min(START + SPAN, localHour(booking.endUtc, tz));
                  const top = (start - START) * HOUR_PX;
                  const height = Math.max(22, (end - start) * HOUR_PX - 2);
                  return (
                    <button
                      type="button"
                      key={booking.id}
                      className={`bk bk--${booking.status} ${height < 40 ? 'bk--short' : ''}`}
                      style={{
                        top,
                        height,
                        left: `calc(${(lane / lanes) * 100}% + 3px)`,
                        width: `calc(${100 / lanes}% - 6px)`,
                      }}
                      onClick={() => setOpen(booking)}
                      aria-label={`${timeLabel(booking.startUtc, tz)}, ${booking.priceSnapshot.serviceName}, ${STATUS[booking.status].plain}`}
                    >
                      <span className="bk__time">{timeLabel(booking.startUtc, tz)}</span>
                      <span className="bk__name">{booking.priceSnapshot.serviceName}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <ul className="tl-key" aria-label="Key">
        <li><span className="bk-swatch bk--confirmed" aria-hidden="true" />Confirmed</li>
        <li><span className="bk-swatch bk--pending" aria-hidden="true" />Waiting for your stamp</li>
        <li><span className="bk-swatch bk--completed" aria-hidden="true" />Done</li>
        <li><span className="tl-key__now" aria-hidden="true" />Now</li>
      </ul>

      {open ? (
        <Drawer
          title={open.priceSnapshot.serviceName}
          sub={<Stamp status={stamped?.id === open.id ? stamped.status : open.status} size="sm" thud={stamped?.id === open.id} />}
          onClose={() => {
            setOpen(null);
            setStamped(null);
          }}
          footer={open.status === 'pending' && stamped?.id !== open.id ? (
            <>
              <RespondError error={respondError} />
              <RespondButtons booking={open} busy={busy} onRespond={(action) => void respond(open, action)} />
            </>
          ) : undefined}
        >
          <BookingFacts booking={stamped?.id === open.id ? stamped : open} staffName={staffName(open.staffId)} />
        </Drawer>
      ) : null}
    </div>
  );
}
