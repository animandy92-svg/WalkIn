'use client';

import type { BookingView } from '@walkin/shared';
import { Check, ExternalLink, FileText, LoaderCircle, Timer, TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import { Stamp } from '@/components/paper';
import { api } from '@/lib/api';
import { apiMessage } from '@/lib/errors';
import { durationLabel, money, shortRef, timeLabel, timeLeft, whenLabel } from '@/lib/format';

const FINISH: Record<string, string> = { none: 'Loose sheets', stapled: 'Stapled', spiral_bound: 'Spiral bound', laminated: 'Laminated' };
const LAUNDRY: Record<string, string> = { wash_and_fold: 'Wash & fold', dry_cleaning: 'Dry cleaning', ironing_only: 'Ironing only' };

/** What the shop needs to see about one booking, and the approve/decline actions when it is waiting. */
export function BookingFacts({ booking, staffName }: { booking: BookingView; staffName: string }) {
  const tz = booking.providerTimeZone;
  const print = booking.verticalData?.printJob;
  const laundry = booking.verticalData?.laundryJob;
  return (
    <dl className="facts">
      <div><dt>When</dt><dd>{whenLabel(booking.startUtc, tz)} to {timeLabel(booking.endUtc, tz)}</dd></div>
      <div><dt>Customer</dt><dd>{shortRef(booking.customerId, 'CU')}</dd></div>
      <div><dt>With</dt><dd>{staffName}</dd></div>
      <div><dt>Price</dt><dd>{money(booking.priceSnapshot.amountCents, booking.priceSnapshot.currency)} · {durationLabel(booking.priceSnapshot.durationMinutes)}</dd></div>
      {print ? (
        <>
          <div><dt>Print</dt><dd>{print.copies} × {print.paperSize}, {print.colorMode === 'color' ? 'colour' : 'black & white'}, {FINISH[print.finish] ?? print.finish}</dd></div>
          <div>
            <dt>Files</dt>
            <dd className="stack-2">
              {print.fileUrls.map((url, index) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="file-chip">
                  <FileText aria-hidden="true" />Open file {print.fileUrls.length > 1 ? index + 1 : ''}<ExternalLink width={14} height={14} aria-hidden="true" />
                </a>
              ))}
            </dd>
          </div>
          {print.notes ? <div><dt>Instructions</dt><dd>“{print.notes}”</dd></div> : null}
        </>
      ) : null}
      {laundry ? (
        <>
          <div><dt>Laundry</dt><dd>{LAUNDRY[laundry.serviceCategory] ?? laundry.serviceCategory}{laundry.bagCount ? `, ${laundry.bagCount} bag${laundry.bagCount > 1 ? 's' : ''}` : ''}{laundry.estimatedWeightKg ? `, about ${laundry.estimatedWeightKg} kg` : ''}</dd></div>
          {laundry.specialInstructions ? <div><dt>Instructions</dt><dd>“{laundry.specialInstructions}”</dd></div> : null}
        </>
      ) : null}
      {booking.customerNote && !print?.notes && !laundry?.specialInstructions ? <div><dt>Note</dt><dd>“{booking.customerNote}”</dd></div> : null}
      <div><dt>Ref</dt><dd>{shortRef(booking.id)}</dd></div>
    </dl>
  );
}

export function useRespond(onDone: (booking: BookingView) => void) {
  const [busy, setBusy] = useState<'confirm' | 'reject' | null>(null);
  const [error, setError] = useState('');
  async function respond(booking: BookingView, action: 'confirm' | 'reject') {
    setBusy(action);
    setError('');
    try {
      const { booking: next } = await api.respondToBooking({ bookingId: booking.id, action });
      onDone(next);
    } catch (err) {
      setError(apiMessage(err, 'Could not update this request.'));
    } finally {
      setBusy(null);
    }
  }
  return { busy, error, respond };
}

export function RespondButtons({
  booking,
  busy,
  onRespond,
}: {
  booking: BookingView;
  busy: 'confirm' | 'reject' | null;
  onRespond: (action: 'confirm' | 'reject') => void;
}) {
  const left = timeLeft(booking.holdExpiresAt);
  return (
    <div className="stack-3">
      {left ? (
        <p className="meta row" style={{ gap: 6 }}>
          <Timer width={16} height={16} aria-hidden="true" />
          Slot held for {left.replace(' left', '')}. Answer before {timeLabel(booking.holdExpiresAt!, booking.providerTimeZone)} or it’s released.
        </p>
      ) : null}
      <div className="row">
        <button type="button" className="btn" disabled={Boolean(busy)} onClick={() => onRespond('confirm')}>
          {busy === 'confirm' ? <LoaderCircle className="spin" aria-hidden="true" /> : <Check aria-hidden="true" />} Approve
        </button>
        <button type="button" className="btn btn--danger" disabled={Boolean(busy)} onClick={() => onRespond('reject')}>
          {busy === 'reject' ? <LoaderCircle className="spin" aria-hidden="true" /> : <X aria-hidden="true" />} Decline
        </button>
      </div>
    </div>
  );
}

export function RespondError({ error }: { error: string }) {
  return error ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error}</p> : null;
}

export { Stamp };
