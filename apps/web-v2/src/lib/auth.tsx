'use client';

import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onIdTokenChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth } from './firebase';

export type Claims = { providerId?: string; role?: 'owner' | 'staff' | 'admin' };

type AuthState = {
  /** Always present once ready: an anonymous session is used for browsing. */
  user: User | null;
  ready: boolean;
  /** True when the visitor has a real account (not the anonymous browsing session). */
  signedIn: boolean;
  claims: Claims;
  displayName: string;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claims>({});
  const [ready, setReady] = useState(false);
  // Linking an anonymous session mutates the same User object, so track a revision to re-render.
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    return onIdTokenChanged(auth, async (next) => {
      if (!next) {
        // Browsing needs a session because every read endpoint is a signed-in callable.
        try {
          await signInAnonymously(auth);
        } catch {
          setUser(null);
          setReady(true);
        }
        return;
      }
      const token = await next.getIdTokenResult();
      setClaims({
        providerId: token.claims.providerId as string | undefined,
        role: token.claims.role as Claims['role'],
      });
      setUser(next);
      setRevision((value) => value + 1);
      setReady(true);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const current = auth.currentUser;
    if (current?.isAnonymous) {
      // Keep the same uid so anything done while browsing stays with the account.
      const credential = EmailAuthProvider.credential(email.trim(), password);
      const result = await linkWithCredential(current, credential);
      if (name.trim()) await updateProfile(result.user, { displayName: name.trim() });
      await result.user.getIdToken(true);
      setUser(auth.currentUser);
      setRevision((value) => value + 1);
      return;
    }
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name.trim()) await updateProfile(result.user, { displayName: name.trim() });
  }, []);

  const signOut = useCallback(async () => {
    setClaims({});
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<AuthState>(() => {
    const signedIn = Boolean(user && !user.isAnonymous);
    const displayName = user?.displayName || user?.email?.split('@')[0] || '';
    return { user, ready, signedIn, claims, displayName, signIn, register, signOut };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, ready, claims, signIn, register, signOut, revision]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

/** Turn Firebase auth error codes into sentences a student can act on. */
export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string }).code ?? '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'That email and password do not match an account. Check them, or create an account instead.';
    case 'auth/email-already-in-use':
    case 'auth/credential-already-in-use':
      return 'An account already uses that email. Sign in with it instead.';
    case 'auth/weak-password':
      return 'Use a password of at least 6 characters.';
    case 'auth/invalid-email':
      return 'That email address does not look complete.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a minute, then try again.';
    case 'auth/network-request-failed':
      return 'No connection. Check your data or Wi-Fi and try again.';
    default:
      return 'Something went wrong signing you in. Try again.';
  }
}
