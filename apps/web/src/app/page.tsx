'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ProviderSummaryView } from '@walkin/shared';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [providers, setProviders] = useState<ProviderSummaryView[]>([]);
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

  return (
    <>
      <h1 className="page-title">Book a local service</h1>
      <p className="muted">
        Find a provider, choose a service, and reserve a time that works for you.
      </p>

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

      {providers.length > 0 ? (
        <div className="card-grid">
          {providers.map((provider) => (
            <Link key={provider.id} className="card" href={`/providers/${provider.slug}`}>
              <h3>{provider.name}</h3>
              <p className="muted">{provider.description}</p>
              {provider.city ? <p className="muted">{provider.city}</p> : null}
            </Link>
          ))}
        </div>
      ) : null}

      {!authLoading && user && !loading && providers.length === 0 && !error ? (
        <p className="muted">No providers are published yet.</p>
      ) : null}
    </>
  );
}
