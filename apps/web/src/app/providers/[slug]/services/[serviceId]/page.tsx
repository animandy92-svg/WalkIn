'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type {
  BookingView,
  GetProviderDetailsResponse,
  SlotView,
} from '@walkin/shared';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api';
import { formatMoney, todayIsoDate } from '@/lib/format';

function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ServiceBookingPage() {
  const params = useParams<{ slug: string; serviceId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [details, setDetails] = useState<GetProviderDetailsResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState(todayIsoDate);
  const [slots, setSlots] = useState<SlotView[]>([]);
  const [selected, setSelected] = useState<SlotView | null>(null);
  const [note, setNote] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<BookingView | null>(null);

  const service = useMemo(
    () => details?.services.find((item) => item.id === params.serviceId) ?? null,
    [details, params.serviceId],
  );

  useEffect(() => {
    if (!user || !params.slug) return;

    let active = true;
    api.getProviderDetails({ slug: params.slug })
      .then((result) => {
        if (!active) return;
        setDetails(result);
        const target = result.services.find((item) => item.id === params.serviceId);
        if (target && !target.staffIds.includes('__any__')) {
          setStaffId(target.staffIds[0] ?? '');
        }
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoadingDetails(false);
      });

    return () => {
      active = false;
    };
  }, [user, params.slug, params.serviceId]);

  useEffect(() => {
    if (!details || !service || !date) return;

    let active = true;
    setLoadingSlots(true);
    setSelected(null);
    setSlots([]);

    api.getAvailability({
      providerId: details.provider.id,
      serviceId: service.id,
      staffId: staffId || undefined,
      date,
    })
      .then((result) => {
        if (active) setSlots(result.slots);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [details, service, staffId, date]);

  async function handleBooking() {
    if (!details || !service || !selected) return;
    setBusy(true);
    setError('');

    try {
      const result = await api.createBooking({
        providerId: details.provider.id,
        serviceId: service.id,
        staffId: selected.staffId ?? undefined,
        startUtc: selected.startUtc,
        idempotencyKey: newIdempotencyKey(),
        note: note || undefined,
        source: 'web',
      });
      setConfirmed(result.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to book');
      if ((err as { code?: string }).code === 'SLOT_UNAVAILABLE') {
        setSelected(null);
      }
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loadingDetails) return <p>Loading service…</p>;
  if (!user) {
    const next = `/providers/${params.slug}/services/${params.serviceId}`;
    return <p>Please <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>sign in</Link> to book.</p>;
  }
  if (error && !confirmed) return <p className="error">{error}</p>;
  if (!details || !service) return <p>Service not found.</p>;

  const { provider } = details;
  const staffName = (id: string | null) =>
    details.staff.find((member) => member.id === id)?.name ?? 'Any available staff';

  if (confirmed) {
    return (
      <>
        <h1 className="page-title">Booking {confirmed.status === 'pending' ? 'requested' : 'confirmed'}</h1>
        <div className="notice">
          <p>{service.name} with {provider.name} is {confirmed.status}.</p>
          {confirmed.status === 'pending' ? (
            <p>The provider will review your request. We will notify you when it is decided.</p>
          ) : null}
        </div>
        <div className="actions">
          <Link className="primary" href="/bookings">View my bookings</Link>
        </div>
      </>
    );
  }

  const staffOptions = service.staffIds.includes('__any__')
    ? [{ id: '', name: 'Any available staff' }]
    : service.staffIds
      .map((id) => ({ id, name: details.staff.find((member) => member.id === id)?.name ?? id }));

  return (
    <>
      <Link href={`/providers/${provider.slug}`}>← {provider.name}</Link>
      <h1 className="page-title">{service.name}</h1>
      <p className="muted">{service.description}</p>
      <p>
        {formatMoney(service.price.amountCents, service.price.currency)} · {service.durationMinutes} min ·{' '}
        {service.confirmationMode === 'instant' ? 'Instant confirmation' : 'Provider approval required'}
      </p>

      <div className="panel">
        <h2>Choose a time</h2>
        <p className="muted">Times are shown in {provider.timeZone}.</p>

        <div className="field">
          <label className="label" htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>

        {staffOptions.length > 1 ? (
          <div className="field">
            <label className="label" htmlFor="staff">Staff member</label>
            <select id="staff" value={staffId} onChange={(event) => setStaffId(event.target.value)}>
              {staffOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
        ) : null}

        {loadingSlots ? <p>Finding available times…</p> : null}
        {!loadingSlots && slots.length === 0 ? <p className="muted">No times available on this date.</p> : null}

        <div className="slot-grid">
          {slots.map((slot) => {
            const key = `${slot.startUtc}-${slot.staffId ?? 'any'}`;
            return (
              <button
                key={key}
                type="button"
                className={`slot ${selected?.startUtc === slot.startUtc && selected.staffId === slot.staffId ? 'selected' : ''}`}
                onClick={() => setSelected(slot)}
              >
                <strong>{slot.localLabel}</strong>
                <br />
                <span className="muted">{staffName(slot.staffId)}</span>
              </button>
            );
          })}
        </div>

        <div className="field" style={{ marginTop: '1.25rem' }}>
          <label className="label" htmlFor="note">Note to provider (optional)</label>
          <textarea id="note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
        </div>

        <div className="actions">
          <button className="primary" type="button" disabled={!selected || busy} onClick={() => void handleBooking()}>
            {busy ? 'Booking…' : 'Book this time'}
          </button>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </div>
    </>
  );
}
