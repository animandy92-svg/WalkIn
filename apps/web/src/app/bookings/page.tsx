'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { BookingView, SlotView } from '@walkin/shared';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api';
import { formatAppointment, todayIsoDate } from '@/lib/format';

function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingView[]>([]);
  const [providerNames, setProviderNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [canceling, setCanceling] = useState<string | null>(null);
  const [rescheduleFor, setRescheduleFor] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState(todayIsoDate);
  const [rescheduleSlots, setRescheduleSlots] = useState<SlotView[]>([]);
  const [rescheduleSelected, setRescheduleSelected] = useState<SlotView | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;

    let active = true;
    api.getMyBookings()
      .then((result) => {
        if (!active) return;
        setBookings(result.bookings);
        const ids = [...new Set(result.bookings.map((booking) => booking.providerId))];
        void Promise.all(
          ids.map(async (providerId) => {
            try {
              const details = await api.getProviderDetails({ providerId });
              return [providerId, details.provider.name] as const;
            } catch {
              return [providerId, providerId] as const;
            }
          }),
        ).then((entries) => {
          if (active) setProviderNames(Object.fromEntries(entries));
        });
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const rescheduling = bookings.find((booking) => booking.id === rescheduleFor) ?? null;
  const reschedulingProviderId = rescheduling?.providerId ?? '';
  const reschedulingServiceId = rescheduling?.serviceId ?? '';
  const reschedulingStaffId = rescheduling?.staffId ?? '';

  useEffect(() => {
    if (!reschedulingProviderId || !reschedulingServiceId) return;

    let active = true;
    setRescheduleSlots([]);
    setRescheduleSelected(null);

    api.getAvailability({
      providerId: reschedulingProviderId,
      serviceId: reschedulingServiceId,
      staffId: reschedulingStaffId || undefined,
      date: rescheduleDate,
    })
      .then((result) => {
        if (active) setRescheduleSlots(result.slots);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [reschedulingProviderId, reschedulingServiceId, reschedulingStaffId, rescheduleDate]);

  async function handleCancel(booking: BookingView) {
    if (!window.confirm('Cancel this booking?')) return;
    setCanceling(booking.id);
    setError('');
    try {
      const result = await api.cancelBooking({ bookingId: booking.id, reason: 'Cancelled by customer' });
      setBookings((current) => current.map((item) => item.id === booking.id ? result.booking : item));
      setNotice('Booking cancelled.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel booking');
    } finally {
      setCanceling(null);
    }
  }

  async function handleReschedule() {
    if (!rescheduling || !rescheduleSelected) return;
    setBusy(true);
    setError('');
    try {
      const result = await api.rescheduleBooking({
        bookingId: rescheduling.id,
        startUtc: rescheduleSelected.startUtc,
        idempotencyKey: newIdempotencyKey(),
      });
      setBookings((current) => [result.booking, ...current.filter((item) => item.id !== rescheduling.id)]);
      setRescheduleFor(null);
      setRescheduleSelected(null);
      setNotice('Booking rescheduled.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reschedule booking');
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) return <p>Loading bookings…</p>;
  if (!user) return <p>Bookings are unavailable until a guest session can be started.</p>;

  return (
    <>
      <h1 className="page-title">My bookings</h1>
      {notice ? <p className="notice">{notice}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {bookings.length === 0 ? <p className="muted">You have no bookings yet.</p> : null}

      <div className="card-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="panel">
            <div className="booking-row">
              <div>
                <h3>{booking.priceSnapshot.serviceName}</h3>
                <p className="muted">{providerNames[booking.providerId] ?? booking.providerId}</p>
              </div>
              <span className={`badge ${booking.status}`}>{booking.status}</span>
            </div>
            <p>{formatAppointment(booking.startUtc, booking.providerTimeZone)}</p>
            <p className="muted">{booking.confirmationMode === 'instant' ? 'Instant confirmation' : 'Approval required'}</p>
            {booking.verticalData?.printJob ? (
              <p className="muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                🖨️ {booking.verticalData.printJob.copies} copy · {booking.verticalData.printJob.colorMode.replace('_', ' ')} · {booking.verticalData.printJob.paperSize}
              </p>
            ) : null}
            {booking.verticalData?.laundryJob ? (
              <p className="muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                🧺 {booking.verticalData.laundryJob.serviceCategory.replace(/_/g, ' ')}
                {booking.verticalData.laundryJob.estimatedWeightKg ? ` (~${booking.verticalData.laundryJob.estimatedWeightKg}kg)` : ''}
              </p>
            ) : null}

            <div className="actions">
              {['confirmed', 'pending'].includes(booking.status) ? (
                <button
                  className="secondary"
                  type="button"
                  onClick={() => {
                    setRescheduleFor(booking.id === rescheduleFor ? null : booking.id);
                    setRescheduleSelected(null);
                  }}
                >
                  Reschedule
                </button>
              ) : null}
              {['confirmed', 'pending'].includes(booking.status) ? (
                <button
                  className="danger"
                  type="button"
                  disabled={canceling === booking.id}
                  onClick={() => void handleCancel(booking)}
                >
                  {canceling === booking.id ? 'Cancelling…' : 'Cancel'}
                </button>
              ) : null}
            </div>

            {rescheduleFor === booking.id ? (
              <div style={{ marginTop: '1rem' }}>
                <div className="field">
                  <label className="label" htmlFor={`reschedule-date-${booking.id}`}>New date</label>
                  <input
                    id={`reschedule-date-${booking.id}`}
                    type="date"
                    value={rescheduleDate}
                    onChange={(event) => setRescheduleDate(event.target.value)}
                  />
                </div>
                <div className="slot-grid">
                  {rescheduleSlots.map((slot) => {
                    const key = `${slot.startUtc}-${slot.staffId ?? 'any'}`;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`slot ${rescheduleSelected?.startUtc === slot.startUtc ? 'selected' : ''}`}
                        onClick={() => setRescheduleSelected(slot)}
                      >
                        <strong>{slot.localLabel}</strong>
                      </button>
                    );
                  })}
                </div>
                <div className="actions">
                  <button
                    className="primary"
                    type="button"
                    disabled={!rescheduleSelected || busy}
                    onClick={() => void handleReschedule()}
                  >
                    {busy ? 'Rescheduling…' : 'Confirm new time'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
