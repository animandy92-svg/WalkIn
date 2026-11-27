'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const currentUser = auth.currentUser;
        if (currentUser?.isAnonymous) {
          await linkWithCredential(currentUser, EmailAuthProvider.credential(email, password));
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      }
      const next = new URLSearchParams(window.location.search).get('next') ?? '/';
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="page-title">{mode === 'signin' ? 'Sign in' : 'Create an account'}</h1>
      <div className="panel">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="actions">
            <button className="primary" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
            <button
              className="secondary"
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? 'Need an account?' : 'Already have an account?'}
            </button>
          </div>
          {error ? <p className="error">{error}</p> : null}
        </form>
      </div>
    </>
  );
}
