'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { GetProviderDashboardResponse } from '@walkin/shared';
import { api } from '@/lib/api';
import { useProviderAccess } from './provider-access';

type DashboardDataState = {
  data: GetProviderDashboardResponse | null;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
};

const DashboardDataContext = createContext<DashboardDataState>({
  data: null,
  loading: true,
  error: '',
  reload: async () => undefined,
});

export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const { providerId, loading: accessLoading } = useProviderAccess();
  const [state, setState] = useState<Omit<DashboardDataState, 'reload'>>({
    data: null,
    loading: true,
    error: '',
  });

  const reload = useCallback(async () => {
    if (!providerId) {
      setState({ data: null, loading: false, error: '' });
      return;
    }
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const data = await api.getProviderDashboard({ providerId });
      setState({ data, loading: false, error: '' });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Unable to load dashboard',
      });
    }
  }, [providerId]);

  useEffect(() => {
    if (!accessLoading) void reload();
  }, [accessLoading, reload]);

  return (
    <DashboardDataContext.Provider value={{ ...state, reload }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData(): DashboardDataState {
  return useContext(DashboardDataContext);
}
