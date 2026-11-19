'use client';

import { CalendarDays, Clock, Inbox, LogOut, Settings, Store, Users, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';
import { DashboardProvider, useDashboard } from '@/components/dashboard/context';
import { Pin, VerticalTag } from '@/components/paper';
import { SiteHeader, Wordmark } from '@/components/site-header';
import { useAuth } from '@/lib/auth';
import { useEmulators } from '@/lib/firebase';

const NAV: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/dashboard', label: 'Timetable', icon: CalendarDays },
  { href: '/dashboard/requests', label: 'Requests', icon: Inbox },
  { href: '/dashboard/services', label: 'Price list', icon: Store },
  { href: '/dashboard/hours', label: 'Opening hours', icon: Clock },
  { href: '/dashboard/staff', label: 'Staff', icon: Users },
  { href: '/dashboard/shop', label: 'Shop details', icon: Settings },
];

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data, pendingCount } = useDashboard();
  const { displayName, signOut } = useAuth();

  return (
    <div className="dash">
      <aside className="dash-rail on-felt" aria-label="Shop dashboard">
        <div className="dash-rail__top">
          <Wordmark />
          <div className="dash-rail__shop">
            <strong>{data?.provider.name ?? 'Your shop'}</strong>
            {data ? (
              <span className="row" style={{ gap: 6 }}>
                <VerticalTag vertical={data.provider.vertical} />
                <span className={`dash-status dash-status--${data.provider.status}`}>{data.provider.status === 'published' ? 'On the board' : 'Draft, hidden'}</span>
              </span>
            ) : null}
          </div>
        </div>
        <nav className="dash-nav" aria-label="Dashboard">
          {NAV.map((item) => {
            const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}>
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
                {item.href === '/dashboard/requests' && pendingCount > 0 ? (
                  <span className="dash-nav__count" aria-label={`${pendingCount} waiting`}>{pendingCount}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="dash-rail__foot">
          {useEmulators ? <span className="dash-demo">Demo data: this shop and its bookings are made up.</span> : null}
          {data ? <Link href={`/shops/${data.provider.slug}`} className="on-felt-2">See your page on the board</Link> : null}
          <span className="on-felt-2">{displayName}</span>
          <button type="button" className="dash-signout" onClick={() => void signOut()}>
            <LogOut aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { ready, signedIn, claims } = useAuth();

  if (!ready) return null;

  if (!signedIn || !claims.providerId) {
    return (
      <>
        <SiteHeader />
        <main className="wrap page">
          <section className="sheet sheet--pad stack-4" style={{ '--tilt': '-0.4deg', maxWidth: 640 } as CSSProperties}>
            <Pin />
            <h1 className="notice-heading h2">For shop owners</h1>
            <p className="lede">
              {signedIn
                ? 'This account isn’t linked to a shop. Sign in with your shop account to open the dashboard.'
                : 'Sign in with your shop account to see today’s timetable, approve requests, and keep your hours and prices current.'}
            </p>
            <div className="row">
              <Link className="btn" href="/sign-in?next=/dashboard">Shop sign-in</Link>
              <Link className="btn btn--ghost" href="/">Back to the board</Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <DashboardProvider providerId={claims.providerId}>
      <Shell>{children}</Shell>
    </DashboardProvider>
  );
}
