'use client';

import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from './auth-provider';
import { useProviderAccess } from './provider-access';

export function SiteHeader() {
  const { user } = useAuth();
  const { providerId } = useProviderAccess();

  return (
    <header className="site-header">
      <Link href="/" className="brand">WalkIn</Link>
      <nav>
        <Link href="/">Providers</Link>
        {user && <Link href="/bookings">My bookings</Link>}
        {providerId && <Link href="/dashboard">Dashboard</Link>}
        {user ? (
          <button type="button" className="link-button" onClick={() => void signOut(auth)}>
            Sign out
          </button>
        ) : (
          <Link href="/sign-in">Sign in</Link>
        )}
      </nav>
    </header>
  );
}
