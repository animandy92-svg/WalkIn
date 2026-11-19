'use client';

import type { GetProviderDashboardResponse } from '@walkin/shared';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { apiMessage } from '@/lib/errors';

type DashboardState = {
  providerId: string;
  data: GetProviderDashboardResponse | null;
  error: string;
  reload: () => Promise<void>;
  pendingCount: number;
  staffName: (id: string | null) => string;
  serviceName: (id: string) => string;
};

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ providerId, children }: { providerId: string; children: ReactNode }) {
  const [data, setData] = useState<GetProviderDashboardResponse | null>(null);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      setError('');
      setData(await api.getProviderDashboard({ providerId }));
    } catch (err) {
      setError(apiMessage(err, 'Could not load your shop.'));
    }
  }, [providerId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo<DashboardState>(() => {
    const now = Date.now();
    return {
      providerId,
      data,
      error,
      reload,
      pendingCount: (data?.bookings ?? []).filter((booking) => booking.status === 'pending' && Date.parse(booking.endUtc) > now).length,
      staffName: (id) => (id ? data?.staff.find((member) => member.id === id)?.name ?? 'Staff' : 'Counter'),
      serviceName: (id) => data?.services.find((service) => service.id === id)?.name ?? 'Service',
    };
  }, [providerId, data, error, reload]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardState {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used inside DashboardProvider');
  return context;
}
