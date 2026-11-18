'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { StaffRole } from '@walkin/shared';
import { useAuth } from './auth-provider';

type AccessState = {
  providerId: string | null;
  role: StaffRole | null;
  loading: boolean;
};

type ProviderAccess = AccessState & {
  /** Re-read claims after saveProvider/saveStaff changes them. */
  refresh: () => Promise<void>;
};

const ProviderAccessContext = createContext<ProviderAccess>({
  providerId: null,
  role: null,
  loading: true,
  refresh: async () => undefined,
});

const roles: StaffRole[] = ['owner', 'staff', 'admin'];

export function ProviderAccessProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<AccessState>({ providerId: null, role: null, loading: true });

  const load = useCallback(async (force: boolean) => {
    if (!user) {
      setState({ providerId: null, role: null, loading: false });
      return;
    }
    try {
      const token = await user.getIdTokenResult(force);
      const claims = token.claims as { providerId?: unknown; role?: unknown };
      const providerId = typeof claims.providerId === 'string' ? claims.providerId : null;
      const role = roles.find((item) => item === claims.role) ?? null;
      setState({ providerId, role, loading: false });
    } catch {
      setState({ providerId: null, role: null, loading: false });
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void load(false);
  }, [authLoading, load]);

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  return (
    <ProviderAccessContext.Provider value={{ ...state, refresh }}>
      {children}
    </ProviderAccessContext.Provider>
  );
}

export function useProviderAccess(): ProviderAccess {
  return useContext(ProviderAccessContext);
}
