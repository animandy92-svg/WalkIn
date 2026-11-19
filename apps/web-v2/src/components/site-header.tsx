'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function Wordmark({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="wordmark" aria-label="WalkIn, open slots board">
      Walk<span className="wordmark__in">In</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { signedIn, displayName, claims, signOut, ready } = useAuth();
  const current = (href: string) =>
    (href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined;

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Wordmark />
        <nav className="site-nav" aria-label="Main">
          <Link href="/" aria-current={current('/')}>Board</Link>
          <Link href="/bookings" aria-current={current('/bookings')}>My bookings</Link>
          <Link href={claims.providerId ? '/dashboard' : '/#for-shops'} aria-current={claims.providerId ? current('/dashboard') : undefined} className="hide-sm">
            {claims.providerId ? 'My shop' : 'For shops'}
          </Link>
          {!ready ? null : signedIn ? (
            <span className="site-nav__account">
              <span className="hide-sm on-felt-2" style={{ fontSize: 'var(--fs-sm)' }}>{displayName}</span>
              <button type="button" onClick={() => void signOut()}>Sign out</button>
            </span>
          ) : (
            <Link href={`/sign-in?next=${encodeURIComponent(pathname)}`} aria-current={current('/sign-in')}>Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
