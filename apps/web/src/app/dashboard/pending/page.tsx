'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { BookingView } from '@walkin/shared';
import { useDashboardData } from '@/components/dashboard-data';
import { useProviderAccess } from '@/components/provider-access';
import { api } from '@/lib/api';
import { formatAppointment, formatClock } from '@/lib/format';

export default function DashboardPendingPage() {
  const { providerId } = useProviderAccess();
  const { data, loading, error, reload } = useDashboardData();
  const [actingOn, setActingOn] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  if (!providerId) return <p>Set up your provider in <Link href="/dashboard/settings">settings</Link> first.</p>;
  if (loading) return <p>Loading pending requests…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Provider not found.</p>;

  const serviceNames = new Map(data.services.map((service) => [service.id, service.name]));
  const staffNames = new Map(data.staff.map((member) => [member.id, member.name]));
  const pending = data.bookings
    .filter((booking) => booking.status === 'pending')
    .sort((a, b) => (a.holdExpiresAt ?? '').localeCompare(b.holdExpiresAt ?? ''));

  async function respond(booking: BookingView, action: 'confirm' | 'reject') {
    setActingOn(booking.id);
    setActionError('');
    try {
      await api.respondToBooking({ bookingId: booking.id, action });
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Unable to ${action} booking`);
    } finally {
      setActingOn(null);
    }
  }

  return (
    <>
      <h1 className="page-title">Pending approvals</h1>
      <p className="muted">
        Confirm or reject requests before their holds expire. Times shown in {data.provider.timeZone}.
      </p>
      {actionError ? <p className="error">{actionError}</p> : null}

      {pending.length === 0 ? (
        <div className="panel">
          <p className="muted">No bookings are waiting for approval.</p>
        </div>
      ) : (
        <div className="queue">
          {pending.map((booking) => (
            <div key={booking.id} className="panel queue-item">
              <div className="booking-row">
                <div>
                  <h3>{serviceNames.get(booking.serviceId) ?? booking.serviceId}</h3>
                  <p className="muted">{formatAppointment(booking.startUtc, data.provider.timeZone)}</p>
                </div>
                <span className="badge pending">pending</span>
              </div>
              <p>
                {booking.staffId ? staffNames.get(booking.staffId) ?? booking.staffId : 'Any staff'}
                {' · '}Customer {booking.customerId.slice(0, 8)}
              </p>
              {booking.customerNote ? <p className="muted">“{booking.customerNote}”</p> : null}
              {booking.holdExpiresAt ? (
                <p className="muted">Hold expires at {formatClock(booking.holdExpiresAt, data.provider.timeZone)}</p>
              ) : null}
              <div className="actions">
                <button
                  className="primary"
                  type="button"
                  disabled={actingOn === booking.id}
                  onClick={() => void respond(booking, 'confirm')}
                >
                  Confirm
                </button>
                <button
                  className="danger"
                  type="button"
                  disabled={actingOn === booking.id}
                  onClick={() => void respond(booking, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
