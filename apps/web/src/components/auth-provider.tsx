'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthState>({ user: null, loading: true, error: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        setState({ user, loading: false, error: null });
        return;
      }

      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Unable to start a guest session', error);
        setState({
          user: null,
          loading: false,
          error: 'Guest access is unavailable. Enable Anonymous authentication in Firebase to continue.',
        });
      }
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
