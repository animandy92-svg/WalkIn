'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { GetProviderDetailsResponse } from '@walkin/shared';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';

export default function ProviderPage() {
  const params = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  const [details, setDetails] = useState<GetProviderDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !params.slug) return;

    let active = true;
    api.getProviderDetails({ slug: params.slug })
      .then((result) => {
        if (active) setDetails(result);
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
  }, [user, params.slug]);

  if (authLoading || loading) return <p>Loading provider…</p>;
  if (!user) return <p>Provider details are unavailable until a guest session can be started.</p>;
  if (error) return <p className="error">{error}</p>;
  if (!details) return <p>Provider not found.</p>;

  const { provider, services } = details;

  return (
    <>
      <Link href="/">← All providers</Link>
      <h1 className="page-title">{provider.name}</h1>
      <p className="muted">{provider.description}</p>
      <p className="muted">
        {provider.city ? `${provider.city} · ` : ''}Times shown in {provider.timeZone}
      </p>

      <h2>Services</h2>
      {services.length === 0 ? (
        <p className="muted">This provider has no active services yet.</p>
      ) : (
        <div className="card-grid">
          {services.map((service) => (
            <Link
              key={service.id}
              className="card"
              href={`/providers/${provider.slug}/services/${service.id}`}
            >
              <h3>{service.name}</h3>
              <p className="muted">{service.description}</p>
              <p>{formatMoney(service.price.amountCents, service.price.currency)} · {service.durationMinutes} min</p>
              <span className="badge">
                {service.confirmationMode === 'instant' ? 'Instant confirmation' : 'Approval required'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
