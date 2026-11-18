'use client';

import { useEffect, useState } from 'react';
import type { ProviderConfigView, ProviderStatus } from '@walkin/shared';
import { useDashboardData } from '@/components/dashboard-data';
import { useProviderAccess } from '@/components/provider-access';
import { api } from '@/lib/api';

type SettingsForm = {
  name: string;
  slug: string;
  description: string;
  timeZone: string;
  logoUrl: string;
  status: ProviderStatus;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  leadTimeMinutes: number;
  cancelCutoffHours: number;
  rescheduleCutoffHours: number;
  pendingHoldMinutes: number;
  defaultConcurrentSlots: number;
};

function emptyForm(): SettingsForm {
  return {
    name: '',
    slug: '',
    description: '',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    logoUrl: '',
    status: 'draft',
    line1: '',
    line2: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    leadTimeMinutes: 60,
    cancelCutoffHours: 24,
    rescheduleCutoffHours: 24,
    pendingHoldMinutes: 60,
    defaultConcurrentSlots: 1,
  };
}

function fromProvider(provider: ProviderConfigView): SettingsForm {
  return {
    name: provider.name,
    slug: provider.slug,
    description: provider.description,
    timeZone: provider.timeZone,
    logoUrl: provider.logoUrl ?? '',
    status: provider.status,
    line1: provider.address?.line1 ?? '',
    line2: provider.address?.line2 ?? '',
    city: provider.address?.city ?? '',
    region: provider.address?.region ?? '',
    postalCode: provider.address?.postalCode ?? '',
    country: provider.address?.country ?? '',
    leadTimeMinutes: provider.bookingPolicy.leadTimeMinutes,
    cancelCutoffHours: provider.bookingPolicy.cancelCutoffHours,
    rescheduleCutoffHours: provider.bookingPolicy.rescheduleCutoffHours,
    pendingHoldMinutes: provider.bookingPolicy.pendingHoldMinutes,
    defaultConcurrentSlots: provider.bookingPolicy.defaultConcurrentSlots,
  };
}

export default function DashboardSettingsPage() {
  const { providerId, refresh: refreshClaims } = useProviderAccess();
  const { data, loading, error, reload } = useDashboardData();
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (data) setForm(fromProvider(data.provider));
  }, [data]);

  function update<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    setNotice('');
    try {
      const addressProvided = form.line1.trim() || form.city.trim() || form.country.trim();
      if (addressProvided && (!form.line1.trim() || !form.city.trim() || form.country.trim().length < 2)) {
        throw new Error('Address needs a street, city, and country');
      }
      await api.saveProvider({
        ...(providerId ? { providerId } : {}),
        name: form.name,
        slug: form.slug.trim(),
        description: form.description,
        timeZone: form.timeZone.trim(),
        status: form.status,
        ...(form.logoUrl.trim() ? { logoUrl: form.logoUrl.trim() } : {}),
        ...(addressProvided ? {
          address: {
            line1: form.line1.trim(),
            city: form.city.trim(),
            country: form.country.trim(),
            ...(form.line2.trim() ? { line2: form.line2.trim() } : {}),
            ...(form.region.trim() ? { region: form.region.trim() } : {}),
            ...(form.postalCode.trim() ? { postalCode: form.postalCode.trim() } : {}),
          },
        } : {}),
        bookingPolicy: {
          leadTimeMinutes: Number(form.leadTimeMinutes),
          cancelCutoffHours: Number(form.cancelCutoffHours),
          rescheduleCutoffHours: Number(form.rescheduleCutoffHours),
          pendingHoldMinutes: Number(form.pendingHoldMinutes),
          defaultConcurrentSlots: Number(form.defaultConcurrentSlots),
        },
      });
      await refreshClaims();
      await reload();
      setNotice(providerId ? 'Settings saved.' : 'Provider created. You can now configure services and hours.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save settings');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p>Loading settings…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1 className="page-title">{providerId ? 'Provider settings' : 'Create your provider'}</h1>
      <p className="muted">
        Profile details appear on your public page. Booking policies control timing for every service.
      </p>
      {notice ? <p className="notice">{notice}</p> : null}

      <div className="panel">
        <form onSubmit={(event) => void handleSubmit(event)}>
          <h2>Profile</h2>
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="settings-name">Name</label>
              <input id="settings-name" required maxLength={120} value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-slug">URL slug</label>
              <input id="settings-slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(e) => update('slug', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-timezone">IANA time zone</label>
              <input id="settings-timezone" required value={form.timeZone} onChange={(e) => update('timeZone', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-status">Status</label>
              <select id="settings-status" value={form.status} onChange={(e) => update('status', e.target.value as ProviderStatus)}>
                <option value="draft">Draft (hidden from customers)</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="settings-description">Description</label>
            <textarea id="settings-description" rows={3} maxLength={4000} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
          <div className="field">
            <label className="label" htmlFor="settings-logo">Logo URL (optional)</label>
            <input id="settings-logo" type="url" value={form.logoUrl} onChange={(e) => update('logoUrl', e.target.value)} />
          </div>

          <h2>Address (optional)</h2>
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="settings-line1">Street</label>
              <input id="settings-line1" value={form.line1} onChange={(e) => update('line1', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-line2">Street line 2</label>
              <input id="settings-line2" value={form.line2} onChange={(e) => update('line2', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-city">City</label>
              <input id="settings-city" value={form.city} onChange={(e) => update('city', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-region">Region</label>
              <input id="settings-region" value={form.region} onChange={(e) => update('region', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-postal">Postal code</label>
              <input id="settings-postal" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-country">Country</label>
              <input id="settings-country" minLength={2} value={form.country} onChange={(e) => update('country', e.target.value)} />
            </div>
          </div>

          <h2>Booking policy</h2>
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="settings-lead">Lead time (minutes)</label>
              <input id="settings-lead" type="number" min={0} required value={form.leadTimeMinutes} onChange={(e) => update('leadTimeMinutes', Number(e.target.value))} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-cancel">Cancel cutoff (hours)</label>
              <input id="settings-cancel" type="number" min={0} required value={form.cancelCutoffHours} onChange={(e) => update('cancelCutoffHours', Number(e.target.value))} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-reschedule">Reschedule cutoff (hours)</label>
              <input id="settings-reschedule" type="number" min={0} required value={form.rescheduleCutoffHours} onChange={(e) => update('rescheduleCutoffHours', Number(e.target.value))} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-hold">Pending hold (minutes)</label>
              <input id="settings-hold" type="number" min={1} required value={form.pendingHoldMinutes} onChange={(e) => update('pendingHoldMinutes', Number(e.target.value))} />
            </div>
            <div className="field">
              <label className="label" htmlFor="settings-concurrent">Default concurrent slots</label>
              <input id="settings-concurrent" type="number" min={1} required value={form.defaultConcurrentSlots} onChange={(e) => update('defaultConcurrentSlots', Number(e.target.value))} />
            </div>
          </div>

          {formError ? <p className="error">{formError}</p> : null}
          <div className="actions">
            <button className="primary" type="submit" disabled={busy}>
              {busy ? 'Saving…' : providerId ? 'Save settings' : 'Create provider'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
