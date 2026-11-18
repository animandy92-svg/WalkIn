'use client';

import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from './auth-provider';

export function SiteHeader() {
  const { user } = useAuth();

  return (
    <header className="site-header">
      <Link href="/" className="brand">WalkIn</Link>
      <nav>
        <Link href="/">Providers</Link>
        {user && <Link href="/bookings">My bookings</Link>}
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
