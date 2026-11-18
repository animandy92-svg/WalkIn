'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { BookingView } from '@walkin/shared';
import { useDashboardData } from '@/components/dashboard-data';
import { useProviderAccess } from '@/components/provider-access';
import {
  formatClock,
  formatDateKey,
  localDateKey,
  shiftDateKey,
  weekStart,
} from '@/lib/format';

type View = 'day' | 'week';

export default function DashboardCalendarPage() {
  const { providerId } = useProviderAccess();
  const { data, loading, error } = useDashboardData();
  const [view, setView] = useState<View>('week');
  const [selectedDate, setSelectedDate] = useState(() => localDateKey(new Date().toISOString()));

  useEffect(() => {
    if (data) setSelectedDate(localDateKey(new Date().toISOString(), data.provider.timeZone));
  }, [data?.provider.timeZone]);

  const timeZone = data?.provider.timeZone;
  const dates = useMemo(
    () => view === 'week'
      ? Array.from({ length: 7 }, (_, index) => shiftDateKey(weekStart(selectedDate), index))
      : [selectedDate],
    [view, selectedDate],
  );

  if (!providerId) return <p>Set up your provider in <Link href="/dashboard/settings">settings</Link> first.</p>;
  if (loading) return <p>Loading calendar…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data || !timeZone) return <p>Provider not found.</p>;

  const serviceNames = new Map(data.services.map((service) => [service.id, service.name]));
  const staffNames = new Map(data.staff.map((member) => [member.id, member.name]));
  const byDate = new Map<string, BookingView[]>();
  for (const booking of data.bookings) {
    const key = localDateKey(booking.startUtc, timeZone);
    const list = byDate.get(key) ?? [];
    list.push(booking);
    byDate.set(key, list);
  }
  for (const list of byDate.values()) {
    list.sort((a, b) => a.startUtc.localeCompare(b.startUtc));
  }

  function renderBooking(booking: BookingView, compact: boolean) {
    return (
      <div key={booking.id} className={`calendar-item status-${booking.status}`}>
        <div className="calendar-item-head">
          <strong>{compact ? formatClock(booking.startUtc, timeZone) : serviceNames.get(booking.serviceId) ?? booking.serviceId}</strong>
          <span className={`badge ${booking.status}`}>{booking.status}</span>
        </div>
        <div className="muted">
          {compact
            ? serviceNames.get(booking.serviceId) ?? booking.serviceId
            : `${formatClock(booking.startUtc, timeZone)}–${formatClock(booking.endUtc, timeZone)}`}
        </div>
        <div className="muted">
          {booking.staffId ? staffNames.get(booking.staffId) ?? booking.staffId : 'Any staff'}
          {' · '}{booking.customerId.slice(0, 8)}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="muted">Appointments in {timeZone}</p>
        </div>
        <div className="toolbar">
          <button
            className="secondary"
            type="button"
            onClick={() => setSelectedDate((current) => shiftDateKey(current, view === 'week' ? -7 : -1))}
          >
            ← Previous
          </button>
          <button className="secondary" type="button" onClick={() => setSelectedDate(localDateKey(new Date().toISOString(), timeZone))}>
            Today
          </button>
          <button
            className="secondary"
            type="button"
            onClick={() => setSelectedDate((current) => shiftDateKey(current, view === 'week' ? 7 : 1))}
          >
            Next →
          </button>
          <div className="segmented">
            <button className={view === 'day' ? 'active' : ''} type="button" onClick={() => setView('day')}>Day</button>
            <button className={view === 'week' ? 'active' : ''} type="button" onClick={() => setView('week')}>Week</button>
          </div>
        </div>
      </div>

      <input
        className="calendar-date-input"
        type="date"
        aria-label="Jump to date"
        value={selectedDate}
        onChange={(event) => event.target.value && setSelectedDate(event.target.value)}
      />

      <div className={`calendar ${view}`}>
        {dates.map((key) => {
          const bookings = byDate.get(key) ?? [];
          return (
            <div key={key} className={`calendar-day ${key === localDateKey(new Date().toISOString(), timeZone) ? 'today' : ''}`}>
              <div className="calendar-day-head">
                <strong>{formatDateKey(key, timeZone)}</strong>
                <span className="badge">{bookings.length}</span>
              </div>
              {bookings.length === 0 ? (
                <p className="muted calendar-empty">No appointments</p>
              ) : (
                bookings.map((booking) => renderBooking(booking, view === 'week'))
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
