'use client';

import Link from 'next/link';
import { useDashboardData } from '@/components/dashboard-data';
import { useProviderAccess } from '@/components/provider-access';
import { formatAppointment } from '@/lib/format';

export default function DashboardOverviewPage() {
  const { providerId } = useProviderAccess();
  const { data, loading, error } = useDashboardData();

  if (!providerId) {
    return (
      <>
        <h1 className="page-title">Provider dashboard</h1>
        <p className="muted">Create your provider profile in settings, then come back to manage bookings.</p>
        <div className="actions">
          <Link className="primary" href="/dashboard/settings">Set up provider</Link>
        </div>
      </>
    );
  }
  if (loading) return <p>Loading dashboard…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Provider not found.</p>;

  const now = Date.now();
  const upcoming = data.bookings.filter(
    (booking) => booking.status === 'confirmed' && new Date(booking.startUtc).getTime() >= now,
  );
  const pending = data.bookings.filter((booking) => booking.status === 'pending');

  return (
    <>
      <h1 className="page-title">{data.provider.name}</h1>
      <p className="muted">
        {data.provider.status === 'published' ? 'Published' : 'Draft'} · Times shown in {data.provider.timeZone}
      </p>

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-value">{pending.length}</span>
          <span className="stat-label">Awaiting approval</span>
        </div>
        <div className="stat">
          <span className="stat-value">{upcoming.length}</span>
          <span className="stat-label">Upcoming</span>
        </div>
        <div className="stat">
          <span className="stat-value">{data.services.filter((service) => service.active).length}</span>
          <span className="stat-label">Active services</span>
        </div>
        <div className="stat">
          <span className="stat-value">{data.staff.filter((member) => member.active).length}</span>
          <span className="stat-label">Active staff</span>
        </div>
      </div>

      <div className="actions">
        <Link className="primary" href="/dashboard/pending">Review pending requests</Link>
        <Link className="secondary" href="/dashboard/calendar">Open calendar</Link>
      </div>

      <div className="panel">
        <h2>Next appointments</h2>
        {upcoming.length === 0 ? (
          <p className="muted">No upcoming confirmed appointments.</p>
        ) : (
          <ul className="plain-list">
            {upcoming.slice(0, 5).map((booking) => (
              <li key={booking.id}>
                <strong>{booking.priceSnapshot.serviceName}</strong>{' '}
                <span className="muted">· {formatAppointment(booking.startUtc, data.provider.timeZone)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
