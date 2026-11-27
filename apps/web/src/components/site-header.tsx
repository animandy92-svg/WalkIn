'use client';

import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { disableNotifications } from '@/lib/notifications';
import { useAuth } from './auth-provider';
import { NotificationToggle } from './notification-toggle';
import { useProviderAccess } from './provider-access';

export function SiteHeader() {
  const { user } = useAuth();
  const { providerId } = useProviderAccess();
  const signedIn = user && !user.isAnonymous;

  return (
    <header className="site-header">
      <Link href="/" className="brand">WalkIn</Link>
      <nav>
        <Link href="/">Providers</Link>
        <Link href="/bookings">My bookings</Link>
        {providerId && <Link href="/dashboard">Dashboard</Link>}
        {signedIn && <NotificationToggle />}
        {signedIn ? (
          <button
            type="button"
            className="link-button"
            onClick={() => void disableNotifications().finally(() => signOut(auth))}
          >
            Sign out
          </button>
        ) : (
          <Link href="/sign-in">Sign in</Link>
        )}
      </nav>
    </header>
  );
}
