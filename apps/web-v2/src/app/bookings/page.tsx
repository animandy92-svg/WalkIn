'use client';

import type { BookingView, GetProviderDetailsResponse, ProviderSummaryView } from '@walkin/shared';
import { ExternalLink, LoaderCircle, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { BookingSlip } from '@/components/booking-slip';
import { Pin, Stamp } from '@/components/paper';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { invalidateBoard, listProviders } from '@/lib/board';
import { apiMessage } from '@/lib/errors';
import { dateKeyOf, money, relativeDay, shortRef, timeLabel, timeLeft, whenLabel } from '@/lib/format';
import { ACTIVE_STATUSES } from '@/lib/vocab';

const FINISH: Record<string, string> = { none: 'loose sheets', stapled: 'stapled', spiral_bound: 'spiral bound', laminated: 'laminated' };
const LAUNDRY: Record<string, string> = { wash_and_fold: 'Wash & fold', dry_cleaning: 'Dry cleaning', ironing_only: 'Ironing only' };

export default function BookingsPage() {
  const { ready, signedIn, displayName } = useAuth();
  const [bookings, setBookings] = useState<BookingView[] | null>(null);
  const [providers, setProviders] = useState<Map<string, ProviderSummaryView>>(new Map());
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);
  const [moving, setMoving] = useState<{ booking: BookingView; details: GetProviderDetailsResponse } | null>(null);
  const [justChanged, setJustChanged] = useState<string | null>(null);

  const load = useCallback(() => {
    setError('');
    Promise.all([api.getMyBookings(), listProviders()])
      .then(([{ bookings: list }, shops]) => {
        setBookings(list);
        setProviders(new Map(shops.map((shop) => [shop.id, shop])));
      })
      .catch((err) => setError(apiMessage(err, 'Could not load your bookings.')));
  }, []);

  useEffect(() => {
    if (ready && signedIn) load();
  }, [ready, signedIn, load]);

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const all = bookings ?? [];
    return {
      upcoming: all
        .filter((booking) => ACTIVE_STATUSES.includes(booking.status) && Date.parse(booking.endUtc) > now)
        .sort((a, b) => a.startUtc.localeCompare(b.startUtc)),
      past: all
        .filter((booking) => !ACTIVE_STATUSES.includes(booking.status) || Date.parse(booking.endUtc) <= now)
        .sort((a, b) => b.startUtc.localeCompare(a.startUtc)),
    };
  }, [bookings]);

  async function cancel(booking: BookingView) {
    setBusyId(booking.id);
    setRowError(null);
    try {
      await api.cancelBooking({ bookingId: booking.id });
      invalidateBoard();
      setConfirming(null);
      setJustChanged(booking.id);
      load();
    } catch (err) {
      setRowError({ id: booking.id, message: apiMessage(err, 'Could not cancel this booking.') });
    } finally {
      setBusyId(null);
    }
  }

  async function startMove(booking: BookingView) {
    setBusyId(booking.id);
    setRowError(null);
    try {
      const details = await api.getProviderDetails({ providerId: booking.providerId });
      setMoving({ booking, details });
    } catch (err) {
      setRowError({ id: booking.id, message: apiMessage(err, 'Could not open this shop’s times.') });
    } finally {
      setBusyId(null);
    }
  }

  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <>
      <SiteHeader />
      <main className="wrap page">
        <section className="sheet sheet--pad bookings-sheet" style={{ '--tilt': '-0.2deg' } as CSSProperties} aria-labelledby="bookings-title">
          <Pin x="20%" color="#e6b800" />
          <Pin x="80%" />
          <div className="stack-3">
            <h1 id="bookings-title" className="notice-heading display">My bookings</h1>
            <p className="lede">
              {signedIn
                ? `${displayName ? `${displayName}, every` : 'Every'} slot you’ve booked, with the shop’s stamp on it.`
                : 'Every slot you book shows up here with the shop’s stamp on it.'}
            </p>
          </div>

          {!ready ? null : !signedIn ? (
            <div className="note stack-3" style={{ justifyItems: 'start' }}>
              <p>Sign in to see your bookings. New here? Book any free slot on the board and you’ll create an account as you go.</p>
              <div className="row">
                <Link className="btn" href="/sign-in?next=/bookings">Sign in</Link>
                <Link className="btn btn--ghost" href="/">Go to the board</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="tabs" role="tablist" aria-label="Bookings">
                <button type="button" role="tab" className="tab" aria-selected={tab === 'upcoming'} onClick={() => setTab('upcoming')}>
                  Coming up{bookings ? ` (${upcoming.length})` : ''}
                </button>
                <button type="button" role="tab" className="tab" aria-selected={tab === 'past'} onClick={() => setTab('past')}>
                  Past{bookings ? ` (${past.length})` : ''}
                </button>
              </div>

              {error ? (
                <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error} <button type="button" className="link-btn" onClick={load}>Try again</button></p>
              ) : bookings === null ? (
                <p className="meta row"><LoaderCircle className="spin" width={16} height={16} aria-hidden="true" />Fetching your slips…</p>
              ) : list.length === 0 ? (
                <div className="note stack-3" style={{ justifyItems: 'start' }}>
                  <p>{tab === 'upcoming' ? 'Nothing coming up. Find a free slot on the board and it will land here.' : 'No past bookings yet.'}</p>
                  {tab === 'upcoming' ? <Link className="btn" href="/">Find a slot</Link> : null}
                </div>
              ) : (
                <ul className="booking-list" role="tabpanel">
                  {list.map((booking) => {
                    const shop = providers.get(booking.providerId);
                    const tz = booking.providerTimeZone;
                    const active = ACTIVE_STATUSES.includes(booking.status) && Date.parse(booking.endUtc) > Date.now();
                    const print = booking.verticalData?.printJob;
                    const laundry = booking.verticalData?.laundryJob;
                    return (
                      <li key={booking.id} className="booking-item">
                        <div className="booking-item__date">
                          <span className="meta">{relativeDay(dateKeyOf(booking.startUtc, tz))}</span>
                          <strong>{timeLabel(booking.startUtc, tz)}</strong>
                        </div>
                        <div className="booking-item__body">
                          <p><strong>{booking.priceSnapshot.serviceName}</strong> at {shop ? <Link href={`/shops/${shop.slug}`}>{shop.name}</Link> : 'a campus shop'}</p>
                          <p className="specs">
                            <span>{money(booking.priceSnapshot.amountCents, booking.priceSnapshot.currency)} at the shop</span>
                            <span>Ref {shortRef(booking.id)}</span>
                            {booking.status === 'pending' && booking.holdExpiresAt ? <span>Lapses {whenLabel(booking.holdExpiresAt, tz)} unless the shop approves ({timeLeft(booking.holdExpiresAt)})</span> : null}
                          </p>
                          {print ? (
                            <p className="specs">
                              <span>{print.copies} × {print.paperSize}, {print.colorMode === 'color' ? 'colour' : 'black & white'}, {FINISH[print.finish] ?? print.finish}</span>
                              {print.fileUrls.map((url, index) => (
                                <a key={url} href={url} target="_blank" rel="noreferrer">Open file{print.fileUrls.length > 1 ? ` ${index + 1}` : ''} <ExternalLink width={13} height={13} aria-hidden="true" /></a>
                              ))}
                            </p>
                          ) : null}
                          {laundry ? (
                            <p className="specs">
                              <span>{LAUNDRY[laundry.serviceCategory] ?? laundry.serviceCategory}</span>
                              {laundry.bagCount ? <span>{laundry.bagCount} bag{laundry.bagCount > 1 ? 's' : ''}</span> : null}
                              {laundry.estimatedWeightKg ? <span>about {laundry.estimatedWeightKg} kg</span> : null}
                            </p>
                          ) : null}
                          {booking.customerNote ? <p className="specs"><span>“{booking.customerNote}”</span></p> : null}
                          {rowError?.id === booking.id ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{rowError.message}</p> : null}
                        </div>
                        <div className="booking-item__actions">
                          <Stamp status={booking.status} thud={justChanged === booking.id} tilt={-6} />
                          {active ? (
                            confirming === booking.id ? (
                              <div className="row" role="group" aria-label="Confirm cancellation">
                                <span className="meta">Cancel this booking?</span>
                                <button type="button" className="btn btn--danger btn--sm" disabled={busyId === booking.id} onClick={() => void cancel(booking)}>
                                  {busyId === booking.id ? 'Cancelling…' : 'Yes, cancel'}
                                </button>
                                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(null)}>Keep it</button>
                              </div>
                            ) : (
                              <div className="row">
                                <button type="button" className="btn btn--ghost btn--sm" disabled={busyId === booking.id} onClick={() => void startMove(booking)}>Change time</button>
                                <button type="button" className="link-btn" style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-red)' }} onClick={() => setConfirming(booking.id)}>Cancel</button>
                              </div>
                            )
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className="meta">Each shop sets how late you can change or cancel. If a change is refused, it’s past that shop’s cutoff; speak to the shop directly.</p>
            </>
          )}
        </section>
      </main>
      <SiteFooter />

      {moving ? (
        <BookingSlip
          details={moving.details}
          reschedule={moving.booking}
          dateKey={dateKeyOf(moving.booking.startUtc, moving.booking.providerTimeZone)}
          onClose={() => setMoving(null)}
          onDone={(booking) => {
            setJustChanged(booking.id);
            load();
          }}
        />
      ) : null}
    </>
  );
}
