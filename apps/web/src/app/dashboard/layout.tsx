'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { DashboardDataProvider } from '@/components/dashboard-data';
import { useProviderAccess } from '@/components/provider-access';

const navigation = [
  { href: '/dashboard', label: 'Overview', exact: true },
  { href: '/dashboard/calendar', label: 'Calendar' },
  { href: '/dashboard/pending', label: 'Pending approvals' },
  { href: '/dashboard/services', label: 'Services' },
  { href: '/dashboard/hours', label: 'Hours' },
  { href: '/dashboard/staff', label: 'Staff' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, loading: authLoading } = useAuth();
  const { providerId, role, loading: accessLoading } = useProviderAccess();
  const pathname = usePathname();

  if (authLoading || accessLoading) return <p>Loading dashboard…</p>;
  if (!user) {
    return (
      <p>
        Please <Link href="/sign-in?next=/dashboard">sign in</Link> to open the provider dashboard.
      </p>
    );
  }

  return (
    <DashboardDataProvider>
      <div className="dashboard">
        <aside className="dashboard-sidebar">
          <p className="dashboard-sidebar-title">Provider dashboard</p>
          <nav className="dashboard-nav">
            {navigation.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={active ? 'active' : ''}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {providerId ? (
            <p className="dashboard-sidebar-foot muted">
              {role ?? 'staff'} · {providerId.slice(0, 8)}
            </p>
          ) : null}
        </aside>

        <section className="dashboard-content">
          {!providerId ? (
            <p className="dashboard-banner">
              You are not linked to a provider yet. <Link href="/dashboard/settings">Create one in settings</Link> to get started.
            </p>
          ) : null}
          {children}
        </section>
      </div>
    </DashboardDataProvider>
  );
}
