'use client';

import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Pin } from '@/components/paper';
import { SiteHeader } from '@/components/site-header';
import { authErrorMessage, useAuth } from '@/lib/auth';
import { useEmulators } from '@/lib/firebase';

// Seeded accounts for the local emulator only (see scripts/emulator/seed-campus.mjs).
const DEMO_PASSWORD = 'password123';
const DEMO_ACCOUNTS = [
  { label: 'Ama', role: 'Student with bookings', email: 'ama@walkin.test', next: '/bookings' },
  { label: 'Kopy Kiosk', role: 'Print shop owner', email: 'owner@walkin.test', next: '/dashboard' },
  { label: 'Sharp Lines', role: 'Barber shop owner', email: 'barber@walkin.test', next: '/dashboard' },
];

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const { signIn, register, signedIn, claims, ready } = useAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !signedIn) return;
    const destination = target ?? next;
    const wantsDashboard = destination.startsWith('/dashboard');
    router.replace(wantsDashboard && !claims.providerId ? '/' : destination);
  }, [ready, signedIn, claims.providerId, next, target, router]);

  async function submit(event: FormEvent, override?: { email: string; password: string }) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'register' && !override) {
        if (!name.trim()) {
          setError('Add your name to create your account.');
          return;
        }
        await register(name, email, password);
      } else {
        await signIn(override?.email ?? email, override?.password ?? password);
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="signin">
      <form className="sheet sheet--pad signin__form" style={{ '--tilt': '-0.4deg' } as CSSProperties} onSubmit={(event) => void submit(event)}>
        <Pin />
        <div className="stack-3">
          <h1 className="notice-heading h2">{mode === 'signin' ? 'Sign in' : 'Create your account'}</h1>
          <p className="meta">
            {next.startsWith('/dashboard')
              ? 'Shop owners and staff sign in here to open the dashboard.'
              : 'Book and manage your slots with an email and password.'}
          </p>
        </div>
        {mode === 'register' ? (
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input id="name" className="input" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" className="input" type="password" required minLength={6} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} />
          {mode === 'register' ? <span className="hint">At least 6 characters.</span> : null}
        </div>
        {error ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error}</p> : null}
        <button type="submit" className="btn btn--block" disabled={busy}>
          {busy ? <><LoaderCircle className="spin" aria-hidden="true" />{mode === 'signin' ? 'Signing in…' : 'Creating account…'}</> : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
        <p className="meta">
          {mode === 'signin' ? 'New to WalkIn? ' : 'Already have an account? '}
          <button type="button" className="link-btn" onClick={() => { setMode(mode === 'signin' ? 'register' : 'signin'); setError(''); }}>
            {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
          </button>
        </p>
      </form>

      {useEmulators ? (
        <aside className="sheet sheet--pad demo-card" style={{ '--tilt': '1.2deg' } as CSSProperties} aria-labelledby="demo-title">
          <Pin color="#2a9d55" />
          <h2 id="demo-title" className="h3">Demo accounts</h2>
          <p className="meta">This preview runs on local demo data. Sign in as one of the seeded people to look around.</p>
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              className="btn btn--ghost btn--block"
              disabled={busy}
              onClick={(event) => {
                setMode('signin');
                setEmail(account.email);
                setPassword(DEMO_PASSWORD);
                setTarget(params.get('next') ? next : account.next);
                void submit(event, { email: account.email, password: DEMO_PASSWORD });
              }}
            >
              <span>{account.label}</span>
              <span style={{ fontFamily: 'var(--font-body)', textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>{account.role}</span>
            </button>
          ))}
        </aside>
      ) : null}
    </div>
  );
}

export default function SignInPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap page">
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </main>
    </>
  );
}
