'use client';

import type { BusinessVertical, ProviderStatus } from '@walkin/shared';
import { Check, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDashboard } from '@/components/dashboard/context';
import { api } from '@/lib/api';
import { invalidateBoard } from '@/lib/board';
import { apiMessage } from '@/lib/errors';
import { VERTICAL_ORDER, VERTICALS } from '@/lib/vocab';

type Form = {
  name: string;
  description: string;
  vertical: BusinessVertical;
  line1: string;
  city: string;
  status: ProviderStatus;
  leadTimeMinutes: string;
  cancelCutoffHours: string;
  rescheduleCutoffHours: string;
  pendingHoldMinutes: string;
  defaultConcurrentSlots: string;
};

export default function ShopDetailsPage() {
  const { data, providerId, reload, error } = useDashboard();
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!data) return;
    const { provider } = data;
    setForm({
      name: provider.name,
      description: provider.description,
      vertical: provider.vertical,
      line1: provider.address?.line1 ?? '',
      city: provider.address?.city ?? '',
      status: provider.status,
      leadTimeMinutes: String(provider.bookingPolicy.leadTimeMinutes),
      cancelCutoffHours: String(provider.bookingPolicy.cancelCutoffHours),
      rescheduleCutoffHours: String(provider.bookingPolicy.rescheduleCutoffHours),
      pendingHoldMinutes: String(provider.bookingPolicy.pendingHoldMinutes),
      defaultConcurrentSlots: String(provider.bookingPolicy.defaultConcurrentSlots),
    });
  }, [data]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setSaved(false);
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  async function save() {
    if (!form || !data) return;
    if (!form.name.trim()) {
      setFormError('Your shop needs a name.');
      return;
    }
    const whole = (value: string) => Math.max(0, Math.round(Number(value) || 0));
    setSaving(true);
    setFormError('');
    try {
      await api.saveProvider({
        providerId,
        name: form.name.trim(),
        slug: data.provider.slug,
        description: form.description.trim(),
        timeZone: data.provider.timeZone,
        status: form.status,
        vertical: form.vertical,
        ...(form.line1.trim() && form.city.trim()
          ? { address: { line1: form.line1.trim(), city: form.city.trim(), country: data.provider.address?.country ?? 'GH' } }
          : {}),
        bookingPolicy: {
          leadTimeMinutes: whole(form.leadTimeMinutes),
          cancelCutoffHours: whole(form.cancelCutoffHours),
          rescheduleCutoffHours: whole(form.rescheduleCutoffHours),
          pendingHoldMinutes: Math.max(1, whole(form.pendingHoldMinutes)),
          defaultConcurrentSlots: Math.max(1, whole(form.defaultConcurrentSlots)),
        },
      });
      invalidateBoard();
      await reload();
      setSaved(true);
    } catch (err) {
      setFormError(apiMessage(err, 'Could not save your shop details.'));
    } finally {
      setSaving(false);
    }
  }

  const numberField = (key: keyof Form, label: string, hint: string) => (
    <div className="field">
      <label htmlFor={key}>{label}</label>
      <input id={key} className="input" inputMode="numeric" value={form ? form[key] : ''} onChange={(event) => set(key, event.target.value.replace(/\D/g, '') as never)} />
      <span className="hint">{hint}</span>
    </div>
  );

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div className="stack-2">
          <h1 className="notice-heading h2">Shop details</h1>
          <p className="dash-summary">What students see at the top of your page, and the rules every booking follows.</p>
        </div>
      </header>

      {error || formError ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error || formError}</p> : null}
      {!form ? (
        <p className="meta row"><LoaderCircle className="spin" width={16} height={16} aria-hidden="true" />Loading your shop…</p>
      ) : (
        <div className="form-cols">
          <section className="stack-4" aria-labelledby="about-shop">
            <h2 id="about-shop" className="h3">About the shop</h2>
            <div className="field">
              <label htmlFor="shop-name">Name</label>
              <input id="shop-name" className="input" value={form.name} onChange={(event) => set('name', event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="shop-desc">One line about you</label>
              <textarea id="shop-desc" className="textarea" value={form.description} onChange={(event) => set('description', event.target.value)} />
            </div>
            <div className="field">
              <span className="label">Kind of shop</span>
              <div className="choice-row" role="group" aria-label="Kind of shop">
                {VERTICAL_ORDER.map((vertical) => (
                  <button key={vertical} type="button" className={`choice c-${VERTICALS[vertical].highlight}`} aria-pressed={form.vertical === vertical} onClick={() => set('vertical', vertical)}>
                    {VERTICALS[vertical].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="line1">Where on campus</label>
                <input id="line1" className="input" value={form.line1} onChange={(event) => set('line1', event.target.value)} placeholder="e.g. Shop 12, Commercial Area" />
              </div>
              <div className="field">
                <label htmlFor="city">Short location</label>
                <input id="city" className="input" value={form.city} onChange={(event) => set('city', event.target.value)} placeholder="Shown on the board" />
              </div>
            </div>
            <div className="field">
              <span className="label">On the board</span>
              <div className="choice-row" role="group" aria-label="Visibility">
                <button type="button" className="choice" aria-pressed={form.status === 'published'} onClick={() => set('status', 'published')}>Published</button>
                <button type="button" className="choice" aria-pressed={form.status === 'draft'} onClick={() => set('status', 'draft')}>Draft (hidden)</button>
              </div>
            </div>
          </section>

          <section className="stack-4" aria-labelledby="rules">
            <h2 id="rules" className="h3">Booking rules</h2>
            {numberField('leadTimeMinutes', 'Notice needed (minutes)', 'How soon before a slot customers can still book it.')}
            <div className="grid-2">
              {numberField('cancelCutoffHours', 'Cancel up to (hours before)', 'After this, customers can’t cancel online.')}
              {numberField('rescheduleCutoffHours', 'Change time up to (hours before)', 'After this, customers can’t move it online.')}
            </div>
            {numberField('pendingHoldMinutes', 'Hold requests for (minutes)', 'How long a “check first” slot stays held while you decide.')}
            {numberField('defaultConcurrentSlots', 'Counter capacity', 'Customers you can take at once for counter services (laundry, printing).')}
          </section>
        </div>
      )}

      {form ? (
        <div className="row">
          <button type="button" className="btn" disabled={saving} onClick={() => void save()}>
            {saving ? <><LoaderCircle className="spin" aria-hidden="true" />Saving…</> : 'Save shop details'}
          </button>
          {saved ? <span className="row meta" style={{ gap: 4 }}><Check width={16} height={16} aria-hidden="true" />Saved.</span> : null}
        </div>
      ) : null}
    </div>
  );
}
