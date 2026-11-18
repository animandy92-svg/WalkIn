'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { StaffConfigView } from '@walkin/shared';
import { useDashboardData } from '@/components/dashboard-data';
import { useProviderAccess } from '@/components/provider-access';
import { api } from '@/lib/api';

type StaffForm = {
  staffId?: string;
  name: string;
  userId: string;
  photoUrl: string;
  active: boolean;
  serviceIds: string[];
  concurrentSlots: number;
};

function emptyForm(): StaffForm {
  return {
    name: '',
    userId: '',
    photoUrl: '',
    active: true,
    serviceIds: [],
    concurrentSlots: 1,
  };
}

function fromStaff(member: StaffConfigView): StaffForm {
  return {
    staffId: member.id,
    name: member.name,
    userId: member.userId ?? '',
    photoUrl: member.photoUrl ?? '',
    active: member.active,
    serviceIds: [...member.serviceIds],
    concurrentSlots: member.concurrentSlots,
  };
}

export default function DashboardStaffPage() {
  const { providerId } = useProviderAccess();
  const { data, loading, error, reload } = useDashboardData();
  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');

  if (!providerId) return <p>Set up your provider in <Link href="/dashboard/settings">settings</Link> first.</p>;
  if (loading) return <p>Loading staff…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Provider not found.</p>;

  function update<K extends keyof StaffForm>(key: K, value: StaffForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleService(id: string) {
    setForm((current) => ({
      ...current,
      serviceIds: current.serviceIds.includes(id)
        ? current.serviceIds.filter((item) => item !== id)
        : [...current.serviceIds, id],
    }));
  }

  function startEdit(member: StaffConfigView) {
    setForm(fromStaff(member));
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
    setBusy(true);
    setFormError('');
    setNotice('');
    try {
      await api.saveStaff({
        providerId: providerId!,
        ...(form.staffId ? { staffId: form.staffId } : {}),
        name: form.name,
        ...(form.userId.trim() ? { userId: form.userId.trim() } : {}),
        ...(form.photoUrl.trim() ? { photoUrl: form.photoUrl.trim() } : {}),
        active: form.active,
        serviceIds: form.serviceIds,
        concurrentSlots: Number(form.concurrentSlots),
      });
      await reload();
      reset();
      setNotice(editing ? 'Staff member updated.' : 'Staff member added.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save staff member');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Staff</h1>
      <p className="muted">
        Manage who can deliver your services. Linking a Firebase Auth user gives that account dashboard access.
      </p>
      {notice ? <p className="notice">{notice}</p> : null}

      <div className="panel">
        <h2>{editing ? `Editing ${form.name}` : 'Add staff member'}</h2>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="staff-name">Name</label>
              <input id="staff-name" required maxLength={120} value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="staff-user">Linked Auth user ID (optional)</label>
              <input id="staff-user" value={form.userId} onChange={(e) => update('userId', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="staff-photo">Photo URL (optional)</label>
              <input id="staff-photo" type="url" value={form.photoUrl} onChange={(e) => update('photoUrl', e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="staff-capacity">Concurrent slots</label>
              <input id="staff-capacity" type="number" min={1} required value={form.concurrentSlots} onChange={(e) => update('concurrentSlots', Number(e.target.value))} />
            </div>
          </div>

          <fieldset className="checkbox-group">
            <legend className="label">Services offered</legend>
            {data.services.length === 0 ? <p className="muted">Add a service first.</p> : data.services.map((service) => (
              <label key={service.id}>
                <input type="checkbox" checked={form.serviceIds.includes(service.id)} onChange={() => toggleService(service.id)} /> {service.name}
              </label>
            ))}
          </fieldset>

          <label className="inline-check">
            <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} /> Active
          </label>

          {formError ? <p className="error">{formError}</p> : null}
          <div className="actions">
            <button className="primary" type="submit" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add staff'}</button>
            {editing ? <button className="secondary" type="button" onClick={reset}>Cancel</button> : null}
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Current staff</h2>
        {data.staff.length === 0 ? <p className="muted">No staff members yet. Services can still use “Any staff”.</p> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Linked user</th><th>Services</th><th>Capacity</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {data.staff.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.userId ? member.userId.slice(0, 8) : '—'}</td>
                    <td>{member.serviceIds.length}</td>
                    <td>{member.concurrentSlots}</td>
                    <td><span className={`badge ${member.active ? 'confirmed' : ''}`}>{member.active ? 'Active' : 'Inactive'}</span></td>
                    <td><button className="link-button" type="button" onClick={() => startEdit(member)}>Edit</button></td>
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
