'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { BusinessVertical, ProviderSummaryView } from '@walkin/shared';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api';

const VERTICAL_FILTERS: Array<{ key: 'all' | BusinessVertical; label: string; icon: string }> = [
  { key: 'all', label: 'All Services', icon: '✨' },
  { key: 'barbershop', label: 'Barbershops', icon: '✂️' },
  { key: 'salon', label: 'Salons & Spas', icon: '💇' },
  { key: 'laundry', label: 'Laundry & Dry Clean', icon: '🧺' },
  { key: 'printing', label: 'Printing & Copies', icon: '🖨️' },
  { key: 'general', label: 'Other', icon: '🏢' },
];

const VERTICAL_INFO: Record<BusinessVertical, { label: string; icon: string }> = {
  barbershop: { label: 'Barbershop', icon: '✂️' },
  salon: { label: 'Salon', icon: '💇' },
  laundry: { label: 'Laundry', icon: '🧺' },
  printing: { label: 'Print Shop', icon: '🖨️' },
  general: { label: 'Service', icon: '🏢' },
};

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [providers, setProviders] = useState<ProviderSummaryView[]>([]);
  const [selectedVertical, setSelectedVertical] = useState<'all' | BusinessVertical>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let active = true;
    api.listPublishedProviders()
      .then((result) => {
        if (active) setProviders(result.providers);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const filteredProviders = useMemo(() => {
    if (selectedVertical === 'all') return providers;
    return providers.filter((p) => (p.vertical ?? 'general') === selectedVertical);
  }, [providers, selectedVertical]);

  return (
    <>
      <h1 className="page-title">Book before you arrive</h1>
      <p className="muted">
        Skip the line. Reserve barbers, salons, laundry drop-offs, and print jobs ahead of time.
      </p>

      {user ? (
        <div className="filter-pills">
          {VERTICAL_FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`filter-pill ${selectedVertical === item.key ? 'active' : ''}`}
              onClick={() => setSelectedVertical(item.key)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {authLoading || loading ? <p>Loading providers…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!authLoading && !user ? (
        <div className="panel">
          <h2>Sign in to browse</h2>
          <p className="muted">Customer accounts let you book and manage appointments.</p>
          <div className="actions">
            <Link className="primary" href="/sign-in">Sign in or create an account</Link>
          </div>
        </div>
      ) : null}

      {filteredProviders.length > 0 ? (
        <div className="card-grid">
          {filteredProviders.map((provider) => {
            const vertical = provider.vertical ?? 'general';
            const info = VERTICAL_INFO[vertical];
            return (
              <Link key={provider.id} className="card" href={`/providers/${provider.slug}`}>
                <div className="vertical-badge">
                  {info.icon} {info.label}
                </div>
                <h3>{provider.name}</h3>
                <p className="muted">{provider.description}</p>
                {provider.city ? <p className="muted">📍 {provider.city}</p> : null}
              </Link>
            );
          })}
        </div>
      ) : null}

      {!authLoading && user && !loading && providers.length === 0 && !error ? (
        <p className="muted">No providers are published yet.</p>
      ) : null}

      {!authLoading && user && !loading && providers.length > 0 && filteredProviders.length === 0 ? (
        <p className="muted">No providers found in this category.</p>
      ) : null}
    </>
  );
}
