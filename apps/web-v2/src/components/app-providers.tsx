'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === '/' ? children : <AuthProvider>{children}</AuthProvider>;
}
