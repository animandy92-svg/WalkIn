'use client';

import type { StaffConfigView } from '@walkin/shared';
import { LoaderCircle, Minus, Pencil, Plus, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useDashboard } from '@/components/dashboard/context';
import { Drawer } from '@/components/dashboard/drawer';
import { api } from '@/lib/api';
import { apiMessage } from '@/lib/errors';

type Draft = { staffId?: string; name: string; active: boolean; serviceIds: string[]; concurrentSlots: number };

const toDraft = (member?: StaffConfigView): Draft => ({
  staffId: member?.id,
  name: member?.name ?? '',
  active: member?.active ?? true,
  serviceIds: member?.serviceIds ?? [],
  concurrentSlots: member?.concurrentSlots ?? 1,
});

export default function StaffPage() {
  const { data, providerId, reload, error } = useDashboard();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  async function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      setFormError('Add a name customers will recognise.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await api.saveStaff({
        providerId,
        ...(draft.staffId ? { staffId: draft.staffId } : {}),
        name: draft.name.trim(),
        active: draft.active,
        serviceIds: draft.serviceIds,
        concurrentSlots: draft.concurrentSlots,
      });
      await reload();
      setDraft(null);
    } catch (err) {
      setFormError(apiMessage(err, 'Could not save this person.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div className="stack-2">
          <h1 className="notice-heading h2">Staff</h1>
          <p className="dash-summary">Customers can choose who they book with for services done by named staff.</p>
        </div>
        <button type="button" className="btn" onClick={() => { setDraft(toDraft()); setFormError(''); }}><Plus aria-hidden="true" />Add a person</button>
      </header>

      {error ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error}</p> : null}
      {!data ? (
        <p className="meta row"><LoaderCircle className="spin" width={16} height={16} aria-hidden="true" />Loading staff…</p>
      ) : (
        <div className="data-scroll">
          <table className="data">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Does</th>
                <th scope="col" className="num">At once</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody>
              {data.staff.length === 0 ? (
                <tr><td colSpan={5} className="meta">No staff yet.</td></tr>
              ) : data.staff.map((member) => (
                <tr key={member.id} className={member.active ? '' : 'is-off'}>
                  <td><strong>{member.name}</strong></td>
                  <td>{member.serviceIds.map((id) => data.services.find((service) => service.id === id)?.name).filter(Boolean).join(', ') || '—'}</td>
                  <td className="num">{member.concurrentSlots}</td>
                  <td>{member.active ? 'Working' : 'Away'}</td>
                  <td className="num">
                    <button type="button" className="icon-btn" aria-label={`Edit ${member.name}`} onClick={() => { setDraft(toDraft(member)); setFormError(''); }}>
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
          title={draft.staffId ? `Edit ${draft.name || 'person'}` : 'New person'}
          onClose={() => setDraft(null)}
          footer={(
            <>
              {formError ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{formError}</p> : null}
              <button type="button" className="btn btn--block" disabled={saving} onClick={() => void save()}>
                {saving ? <><LoaderCircle className="spin" aria-hidden="true" />Saving…</> : 'Save'}
              </button>
            </>
          )}
        >
          <div className="field">
            <label htmlFor="staff-name">Name</label>
            <input id="staff-name" className="input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </div>
          <div className="field">
            <span className="label">Services they do</span>
            <div className="choice-row" role="group" aria-label="Services">
              {data.services.map((service) => {
                const on = draft.serviceIds.includes(service.id);
                return (
                  <button key={service.id} type="button" className="choice" aria-pressed={on} onClick={() => setDraft({ ...draft, serviceIds: on ? draft.serviceIds.filter((id) => id !== service.id) : [...draft.serviceIds, service.id] })}>
                    {service.name}
                  </button>
                );
              })}
            </div>
            <span className="hint">To let customers pick this person, also tick them on the service in Price list.</span>
          </div>
          <div className="field">
            <span className="label" id="slots-label">Customers at the same time</span>
            <div className="stepper" role="group" aria-labelledby="slots-label">
              <button type="button" aria-label="Fewer" onClick={() => setDraft({ ...draft, concurrentSlots: Math.max(1, draft.concurrentSlots - 1) })}><Minus aria-hidden="true" /></button>
              <output aria-live="polite">{draft.concurrentSlots}</output>
              <button type="button" aria-label="More" onClick={() => setDraft({ ...draft, concurrentSlots: Math.min(20, draft.concurrentSlots + 1) })}><Plus aria-hidden="true" /></button>
            </div>
          </div>
          <label className="choice" style={{ justifySelf: 'start' }}>
            <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
            {draft.active ? 'Working (bookable)' : 'Away (not bookable)'}
          </label>
        </Drawer>
      ) : null}
    </div>
  );
}
