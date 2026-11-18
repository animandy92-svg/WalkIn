'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { CapacityScope, ConfirmationMode, ServiceConfigView } from '@walkin/shared';
import { useDashboardData } from '@/components/dashboard-data';
import { useProviderAccess } from '@/components/provider-access';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';

type ServiceForm = {
  serviceId?: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: string;
  currency: string;
  confirmationMode: ConfirmationMode;
  capacityScope: CapacityScope;
  staffIds: string[];
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  active: boolean;
  imageUrl: string;
};

function emptyForm(): ServiceForm {
  return {
    name: '',
    description: '',
    durationMinutes: 30,
    price: '0',
    currency: 'USD',
    confirmationMode: 'instant',
    capacityScope: 'provider',
    staffIds: ['__any__'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    active: true,
    imageUrl: '',
  };
}

function fromService(service: ServiceConfigView): ServiceForm {
  return {
    serviceId: service.id,
    name: service.name,
    description: service.description,
    durationMinutes: service.durationMinutes,
    price: (service.price.amountCents / 100).toFixed(2),
    currency: service.price.currency,
    confirmationMode: service.confirmationMode,
    capacityScope: service.capacityScope,
    staffIds: [...service.staffIds],
    bufferBeforeMinutes: service.bufferBeforeMinutes,
    bufferAfterMinutes: service.bufferAfterMinutes,
    active: service.active,
    imageUrl: service.imageUrl ?? '',
  };
}

export default function DashboardServicesPage() {
  const { providerId } = useProviderAccess();
  const { data, loading, error, reload } = useDashboardData();
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');

  if (!providerId) return <p>Set up your provider in <Link href="/dashboard/settings">settings</Link> first.</p>;
  if (loading) return <p>Loading services…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Provider not found.</p>;

  function update<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleStaff(id: string) {
    setForm((current) => ({
      ...current,
      staffIds: current.staffIds.includes(id)
        ? current.staffIds.filter((item) => item !== id)
        : [...current.staffIds, id],
    }));
  }

  function startEdit(service: ServiceConfigView) {
    setForm(fromService(service));
    setEditing(true);
    setNotice('');
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    setForm(emptyForm());
    setEditing(false);
    setFormError('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.staffIds.length === 0) {
      setFormError('Select at least one staff option (or “Any staff”).');
      return;
    }
    setBusy(true);
    setFormError('');
    setNotice('');
    try {
      const amountCents = Math.round(Number(form.price) * 100);
      if (!Number.isFinite(amountCents) || amountCents < 0) throw new Error('Enter a valid price');
      await api.saveService({
        providerId: providerId!,
        ...(form.serviceId ? { serviceId: form.serviceId } : {}),
        name: form.name,
        description: form.description,
        durationMinutes: Number(form.durationMinutes),
        price: { amountCents, currency: form.currency.trim().toUpperCase() },
        confirmationMode: form.confirmationMode,
        capacityScope: form.capacityScope,
        staffIds: form.staffIds,
        bufferBeforeMinutes: Number(form.bufferBeforeMinutes),
        bufferAfterMinutes: Number(form.bufferAfterMinutes),
        active: form.active,
        ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
      });
      await reload();
      reset();
      setNotice(editing ? 'Service updated.' : 'Service created.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save service');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Services</h1>
      <p className="muted">Define what customers can book and how each booking is confirmed.</p>
      {notice ? <p className="notice">{notice}</p> : null}

      <div className="panel">
        <h2>{editing ? `Editing ${form.name}` : 'New service'}</h2>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="service-name">Name</label>
              <input id="service-name" required maxLength={120} value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="service-duration">Duration (minutes)</label>
              <input id="service-duration" type="number" min={1} required value={form.durationMinutes} onChange={(e) => update('durationMinutes', Number(e.target.value))} />
            </div>
            <div className="field">
              <label className="label" htmlFor="service-price">Price</label>
              <input id="service-price" type="number" min={0} step="0.01" required value={form.price} onChange={(e) => update('price', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="service-currency">Currency</label>
              <input id="service-currency" maxLength={3} required value={form.currency} onChange={(e) => update('currency', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="service-confirmation">Confirmation</label>
              <select id="service-confirmation" value={form.confirmationMode} onChange={(e) => update('confirmationMode', e.target.value as ConfirmationMode)}>
                <option value="instant">Instant</option>
                <option value="approval">Provider approval</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="service-capacity">Capacity pool</label>
              <select id="service-capacity" value={form.capacityScope} onChange={(e) => update('capacityScope', e.target.value as CapacityScope)}>
                <option value="provider">Provider-wide</option>
                <option value="staff">Per staff member</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="service-buffer-before">Buffer before (min)</label>
              <input id="service-buffer-before" type="number" min={0} value={form.bufferBeforeMinutes} onChange={(e) => update('bufferBeforeMinutes', Number(e.target.value))} />
            </div>
            <div className="field">
              <label className="label" htmlFor="service-buffer-after">Buffer after (min)</label>
              <input id="service-buffer-after" type="number" min={0} value={form.bufferAfterMinutes} onChange={(e) => update('bufferAfterMinutes', Number(e.target.value))} />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="service-description">Description</label>
            <textarea id="service-description" maxLength={4000} rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
          <div className="field">
            <label className="label" htmlFor="service-image">Image URL (optional)</label>
            <input id="service-image" type="url" value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} />
          </div>

          <fieldset className="checkbox-group">
            <legend className="label">Eligible staff</legend>
            <label><input type="checkbox" checked={form.staffIds.includes('__any__')} onChange={() => toggleStaff('__any__')} /> Any staff</label>
            {data.staff.map((member) => (
              <label key={member.id}>
                <input type="checkbox" checked={form.staffIds.includes(member.id)} onChange={() => toggleStaff(member.id)} /> {member.name}
              </label>
            ))}
          </fieldset>

          <label className="inline-check">
            <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} /> Active (visible to customers)
          </label>

          {formError ? <p className="error">{formError}</p> : null}
          <div className="actions">
            <button className="primary" type="submit" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create service'}</button>
            {editing ? <button className="secondary" type="button" onClick={reset}>Cancel</button> : null}
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Current services</h2>
        {data.services.length === 0 ? <p className="muted">No services yet.</p> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Service</th><th>Duration</th><th>Price</th><th>Confirmation</th><th>Staff</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {data.services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{service.durationMinutes} min</td>
                    <td>{formatMoney(service.price.amountCents, service.price.currency)}</td>
                    <td>{service.confirmationMode === 'approval' ? 'Approval' : 'Instant'}</td>
                    <td>{service.staffIds.includes('__any__') ? 'Any' : service.staffIds.length}</td>
                    <td><span className={`badge ${service.active ? 'confirmed' : ''}`}>{service.active ? 'Active' : 'Inactive'}</span></td>
                    <td><button className="link-button" type="button" onClick={() => startEdit(service)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
