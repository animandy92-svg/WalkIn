'use client';

import type { ServiceConfigView, ServiceType } from '@walkin/shared';
import { LoaderCircle, Pencil, Plus, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useDashboard } from '@/components/dashboard/context';
import { Drawer } from '@/components/dashboard/drawer';
import { api } from '@/lib/api';
import { apiMessage } from '@/lib/errors';
import { durationLabel, money } from '@/lib/format';
import { SERVICE_TYPES } from '@/lib/vocab';

type Draft = {
  serviceId?: string;
  name: string;
  description: string;
  durationMinutes: string;
  price: string;
  confirmationMode: 'instant' | 'approval';
  serviceType: ServiceType;
  capacityScope: 'staff' | 'provider';
  staffIds: string[];
  bufferBeforeMinutes: string;
  bufferAfterMinutes: string;
  active: boolean;
};

function toDraft(service?: ServiceConfigView): Draft {
  return {
    serviceId: service?.id,
    name: service?.name ?? '',
    description: service?.description ?? '',
    durationMinutes: String(service?.durationMinutes ?? 30),
    price: service ? (service.price.amountCents / 100).toFixed(service.price.amountCents % 100 ? 2 : 0) : '',
    confirmationMode: service?.confirmationMode ?? 'instant',
    serviceType: service?.serviceType ?? 'appointment',
    capacityScope: service?.capacityScope ?? 'staff',
    staffIds: service?.staffIds ?? [],
    bufferBeforeMinutes: String(service?.bufferBeforeMinutes ?? 0),
    bufferAfterMinutes: String(service?.bufferAfterMinutes ?? 0),
    active: service?.active ?? true,
  };
}

export default function ServicesPage() {
  const { data, providerId, reload, error } = useDashboard();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => (current ? { ...current, [key]: value } : current));

  async function save() {
    if (!draft) return;
    const duration = Number(draft.durationMinutes);
    const price = Number(draft.price);
    if (!draft.name.trim()) return setFormError('Give the service a name customers will recognise.');
    if (!Number.isInteger(duration) || duration <= 0) return setFormError('Duration must be a whole number of minutes.');
    if (!Number.isFinite(price) || price < 0) return setFormError('Price must be a number in cedis, like 35 or 12.50.');
    const staffIds = draft.capacityScope === 'provider' ? ['__any__'] : draft.staffIds;
    if (staffIds.length === 0) return setFormError('Pick at least one person who offers this service.');
    setSaving(true);
    setFormError('');
    try {
      await api.saveService({
        providerId,
        ...(draft.serviceId ? { serviceId: draft.serviceId } : {}),
        name: draft.name.trim(),
        description: draft.description.trim(),
        durationMinutes: duration,
        price: { amountCents: Math.round(price * 100), currency: 'GHS' },
        confirmationMode: draft.confirmationMode,
        capacityScope: draft.capacityScope,
        staffIds,
        bufferBeforeMinutes: Number(draft.bufferBeforeMinutes) || 0,
        bufferAfterMinutes: Number(draft.bufferAfterMinutes) || 0,
        active: draft.active,
        serviceType: draft.serviceType,
      });
      await reload();
      setDraft(null);
    } catch (err) {
      setFormError(apiMessage(err, 'Could not save this service.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div className="stack-2">
          <h1 className="notice-heading h2">Price list</h1>
          <p className="dash-summary">What customers can book, how long it takes, and whether you check it first.</p>
        </div>
        <button type="button" className="btn" onClick={() => { setDraft(toDraft()); setFormError(''); }}><Plus aria-hidden="true" />Add a service</button>
      </header>

      {error ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error}</p> : null}
      {!data ? (
        <p className="meta row"><LoaderCircle className="spin" width={16} height={16} aria-hidden="true" />Loading services…</p>
      ) : (
        <div className="data-scroll">
          <table className="data">
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Type</th>
                <th scope="col">Time</th>
                <th scope="col" className="num">Price</th>
                <th scope="col">Confirms</th>
                <th scope="col">Who</th>
                <th scope="col"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody>
              {data.services.length === 0 ? (
                <tr><td colSpan={7} className="meta">No services yet. Add the first thing customers can book.</td></tr>
              ) : data.services.map((service) => (
                <tr key={service.id} className={service.active ? '' : 'is-off'}>
                  <td>
                    <strong>{service.name}</strong>
                    {!service.active ? <span className="meta"> · hidden from the board</span> : null}
                  </td>
                  <td>{SERVICE_TYPES[service.serviceType ?? 'appointment'].label}</td>
                  <td>{durationLabel(service.durationMinutes)}</td>
                  <td className="num"><strong>{money(service.price.amountCents, service.price.currency)}</strong></td>
                  <td>{service.confirmationMode === 'instant' ? 'Instantly' : 'You check first'}</td>
                  <td>{service.staffIds.includes('__any__') ? 'Counter' : service.staffIds.map((id) => data.staff.find((member) => member.id === id)?.name ?? '—').join(', ')}</td>
                  <td className="num">
                    <button type="button" className="icon-btn" aria-label={`Edit ${service.name}`} onClick={() => { setDraft(toDraft(service)); setFormError(''); }}>
                      <Pencil aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {draft && data ? (
        <Drawer
          title={draft.serviceId ? `Edit ${draft.name || 'service'}` : 'New service'}
          onClose={() => setDraft(null)}
          footer={(
            <>
              {formError ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{formError}</p> : null}
              <button type="button" className="btn btn--block" disabled={saving} onClick={() => void save()}>
                {saving ? <><LoaderCircle className="spin" aria-hidden="true" />Saving…</> : 'Save service'}
              </button>
            </>
          )}
        >
          <div className="field">
            <label htmlFor="svc-name">Name</label>
            <input id="svc-name" className="input" value={draft.name} onChange={(event) => set('name', event.target.value)} placeholder="e.g. Haircut" />
          </div>
          <div className="field">
            <label htmlFor="svc-desc">Description</label>
            <textarea id="svc-desc" className="textarea" value={draft.description} onChange={(event) => set('description', event.target.value)} placeholder="One line customers see on your price list" />
          </div>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="svc-price">Price (GH₵)</label>
              <input id="svc-price" className="input" inputMode="decimal" value={draft.price} onChange={(event) => set('price', event.target.value.replace(/[^\d.]/g, ''))} />
            </div>
            <div className="field">
              <label htmlFor="svc-dur">Takes (minutes)</label>
              <input id="svc-dur" className="input" inputMode="numeric" value={draft.durationMinutes} onChange={(event) => set('durationMinutes', event.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
          <div className="field">
            <span className="label">Customers book</span>
            <div className="choice-row" role="group" aria-label="Service type">
              {(['appointment', 'drop_off', 'print_job'] as ServiceType[]).map((type) => (
                <button key={type} type="button" className="choice" aria-pressed={draft.serviceType === type} onClick={() => set('serviceType', type)}>{SERVICE_TYPES[type].label}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <span className="label">Confirm bookings</span>
            <div className="choice-row" role="group" aria-label="Confirmation">
              <button type="button" className="choice" aria-pressed={draft.confirmationMode === 'instant'} onClick={() => set('confirmationMode', 'instant')}>Instantly</button>
              <button type="button" className="choice" aria-pressed={draft.confirmationMode === 'approval'} onClick={() => set('confirmationMode', 'approval')}>I check first</button>
            </div>
            <span className="hint">“I check first” holds the slot until you approve it under Requests.</span>
          </div>
          <div className="field">
            <span className="label">Who does it</span>
            <div className="choice-row" role="group" aria-label="Capacity">
              <button type="button" className="choice" aria-pressed={draft.capacityScope === 'staff'} onClick={() => set('capacityScope', 'staff')}>Named staff</button>
              <button type="button" className="choice" aria-pressed={draft.capacityScope === 'provider'} onClick={() => set('capacityScope', 'provider')}>The counter (by capacity)</button>
            </div>
          </div>
          {draft.capacityScope === 'staff' ? (
            <div className="choice-row" role="group" aria-label="Staff">
              {data.staff.map((member) => {
                const on = draft.staffIds.includes(member.id);
                return (
                  <button key={member.id} type="button" className="choice" aria-pressed={on} onClick={() => set('staffIds', on ? draft.staffIds.filter((id) => id !== member.id) : [...draft.staffIds.filter((id) => id !== '__any__'), member.id])}>
                    {member.name}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div className="grid-2">
            <div className="field">
              <label htmlFor="svc-before">Prep before (min)</label>
              <input id="svc-before" className="input" inputMode="numeric" value={draft.bufferBeforeMinutes} onChange={(event) => set('bufferBeforeMinutes', event.target.value.replace(/\D/g, ''))} />
            </div>
            <div className="field">
              <label htmlFor="svc-after">Clean-up after (min)</label>
              <input id="svc-after" className="input" inputMode="numeric" value={draft.bufferAfterMinutes} onChange={(event) => set('bufferAfterMinutes', event.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
          <label className="choice" style={{ justifySelf: 'start' }}>
            <input type="checkbox" checked={draft.active} onChange={(event) => set('active', event.target.checked)} />
            {draft.active ? 'Shown on the board' : 'Hidden from the board'}
          </label>
        </Drawer>
      ) : null}
    </div>
  );
}
