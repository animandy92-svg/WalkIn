'use client';

import type { BookingView } from '@walkin/shared';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BookingFacts, RespondButtons, useRespond } from '@/components/dashboard/booking-detail';
import { useDashboard } from '@/components/dashboard/context';
import { Stamp } from '@/components/paper';
import { dateKeyOf, relativeDay, timeLabel } from '@/lib/format';

function RequestSlip({ booking, staffName, onSettled }: { booking: BookingView; staffName: string; onSettled: () => void }) {
  const [result, setResult] = useState<BookingView | null>(null);
  const { respond, busy, error } = useRespond((next) => {
    setResult(next);
    // Let the stamp land before the slip leaves the pile.
    window.setTimeout(onSettled, 1400);
  });
  const tz = booking.providerTimeZone;

  return (
    <li className={`req ${result ? 'req--settled' : ''}`}>
      <div className="req__when">
        <span className="meta">{relativeDay(dateKeyOf(booking.startUtc, tz))}</span>
        <strong>{timeLabel(booking.startUtc, tz)}</strong>
      </div>
      <div className="req__body stack-3">
        <h2 className="h3" style={{ fontSize: 'var(--fs-md)' }}>{booking.priceSnapshot.serviceName}</h2>
        <BookingFacts booking={booking} staffName={staffName} />
        {error ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error}</p> : null}
      </div>
      <div className="req__actions">
        {result ? (
          <Stamp status={result.status} size="lg" thud tilt={-9} />
        ) : (
          <>
            <Stamp status="pending" size="sm" tilt={-4} />
            <RespondButtons booking={booking} busy={busy} onRespond={(action) => void respond(booking, action)} />
          </>
        )}
      </div>
    </li>
  );
}

export default function RequestsPage() {
  const { data, error, reload, staffName } = useDashboard();
  const pending = useMemo(
    () => (data?.bookings ?? [])
      .filter((booking) => booking.status === 'pending' && Date.parse(booking.endUtc) > Date.now())
      .sort((a, b) => (a.holdExpiresAt ?? a.startUtc).localeCompare(b.holdExpiresAt ?? b.startUtc)),
    [data],
  );

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div className="stack-2">
          <h1 className="notice-heading h2">Requests</h1>
          <p className="dash-summary">
            Customers booked these, but your services ask you to check first. Each slot is held until you answer or the hold runs out. Soonest deadline first.
          </p>
        </div>
      </header>

      {error ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error}</p> : null}
      {!data ? (
        <p className="meta row"><LoaderCircle className="spin" width={16} height={16} aria-hidden="true" />Fetching requests…</p>
      ) : pending.length === 0 ? (
        <div className="empty">
          <Stamp status="confirmed" tilt={-6} />
          <p><strong>Nothing waiting.</strong> New requests land here stamped <em>received</em>, and you’ll see the count on the left.</p>
        </div>
      ) : (
        <ul className="req-list">
          {pending.map((booking) => (
            <RequestSlip key={booking.id} booking={booking} staffName={staffName(booking.staffId)} onSettled={() => void reload()} />
          ))}
        </ul>
      )}
    </div>
  );
}
