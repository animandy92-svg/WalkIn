'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { AvailabilityRuleView } from '@walkin/shared';
import { useDashboardData } from '@/components/dashboard-data';
import { useProviderAccess } from '@/components/provider-access';
import { api } from '@/lib/api';

type Interval = { startLocal: string; endLocal: string };
type RuleForm = {
  ruleId?: string;
  kind: 'weekly' | 'exception';
  staffId: string;
  dayOfWeek: number;
  startLocal: string;
  endLocal: string;
  date: string;
  intervals: Interval[];
  reason: string;
};

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function emptyForm(): RuleForm {
  return {
    kind: 'weekly',
    staffId: '',
    dayOfWeek: 1,
    startLocal: '09:00',
    endLocal: '17:00',
    date: '',
    intervals: [{ startLocal: '09:00', endLocal: '17:00' }],
    reason: '',
  };
}

function fromRule(rule: AvailabilityRuleView): RuleForm {
  return {
    ruleId: rule.id,
    kind: rule.kind,
    staffId: rule.staffId ?? '',
    dayOfWeek: rule.dayOfWeek ?? 1,
    startLocal: rule.startLocal ?? '09:00',
    endLocal: rule.endLocal ?? '17:00',
    date: rule.date ?? '',
    intervals: rule.intervals?.length ? rule.intervals.map((item) => ({ ...item })) : [],
    reason: rule.reason ?? '',
  };
}

function describeRule(rule: AvailabilityRuleView): string {
  if (rule.kind === 'weekly') {
    return `${weekdays[rule.dayOfWeek ?? 0]}: ${rule.startLocal ?? '—'}–${rule.endLocal ?? '—'}`;
  }
  const intervals = rule.intervals?.length
    ? rule.intervals.map((item) => `${item.startLocal}–${item.endLocal}`).join(', ')
    : 'Closed';
  return `${rule.date}: ${intervals}`;
}

export default function DashboardHoursPage() {
  const { providerId } = useProviderAccess();
  const { data, loading, error, reload } = useDashboardData();
  const [form, setForm] = useState<RuleForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');

  if (!providerId) return <p>Set up your provider in <Link href="/dashboard/settings">settings</Link> first.</p>;
  if (loading) return <p>Loading hours…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Provider not found.</p>;

  function update<K extends keyof RuleForm>(key: K, value: RuleForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateInterval(index: number, key: keyof Interval, value: string) {
    setForm((current) => ({
      ...current,
      intervals: current.intervals.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  }

  function startEdit(rule: AvailabilityRuleView) {
    setForm(fromRule(rule));
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
      await api.saveAvailability({
        providerId: providerId!,
        ...(form.ruleId ? { ruleId: form.ruleId } : {}),
        kind: form.kind,
        ...(form.staffId ? { staffId: form.staffId } : {}),
        ...(form.kind === 'weekly'
          ? { dayOfWeek: Number(form.dayOfWeek), startLocal: form.startLocal, endLocal: form.endLocal }
          : { date: form.date, intervals: form.intervals, ...(form.reason ? { reason: form.reason } : {}) }),
      });
      await reload();
      reset();
      setNotice(editing ? 'Availability rule updated.' : 'Availability rule added.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save availability rule');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(rule: AvailabilityRuleView) {
    if (!window.confirm(`Delete rule “${describeRule(rule)}”?`)) return;
    setBusy(true);
    setFormError('');
    setNotice('');
    try {
      await api.deleteAvailabilityRule({ providerId: providerId!, ruleId: rule.id });
      if (form.ruleId === rule.id) reset();
      await reload();
      setNotice('Availability rule deleted.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to delete availability rule');
    } finally {
      setBusy(false);
    }
  }

  const weekly = data.availability.filter((rule) => rule.kind === 'weekly');
  const exceptions = data.availability.filter((rule) => rule.kind === 'exception');

  return (
    <>
      <h1 className="page-title">Hours & availability</h1>
      <p className="muted">
        Weekly rules define normal hours. Date exceptions add extra intervals or close a day when left empty.
      </p>
      {notice ? <p className="notice">{notice}</p> : null}

      <div className="panel">
        <h2>{editing ? 'Edit rule' : 'Add rule'}</h2>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="rule-kind">Rule type</label>
              <select id="rule-kind" value={form.kind} onChange={(e) => update('kind', e.target.value as RuleForm['kind'])}>
                <option value="weekly">Weekly hours</option>
                <option value="exception">Date exception</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="rule-staff">Staff member</label>
              <select id="rule-staff" value={form.staffId} onChange={(e) => update('staffId', e.target.value)}>
                <option value="">Whole provider</option>
                {data.staff.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select>
            </div>
          </div>

          {form.kind === 'weekly' ? (
            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="rule-day">Day of week</label>
                <select id="rule-day" value={form.dayOfWeek} onChange={(e) => update('dayOfWeek', Number(e.target.value))}>
                  {weekdays.map((day, index) => <option key={day} value={index}>{day}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="rule-start">Start</label>
                <input id="rule-start" type="time" required value={form.startLocal} onChange={(e) => update('startLocal', e.target.value)} />
              </div>
              <div className="field">
                <label className="label" htmlFor="rule-end">End</label>
                <input id="rule-end" type="time" required value={form.endLocal} onChange={(e) => update('endLocal', e.target.value)} />
              </div>
            </div>
          ) : (
            <>
              <div className="field">
                <label className="label" htmlFor="rule-date">Date</label>
                <input id="rule-date" type="date" required value={form.date} onChange={(e) => update('date', e.target.value)} />
              </div>
              <div className="field">
                <span className="label">Intervals (leave empty to close)</span>
                {form.intervals.map((interval, index) => (
                  <div key={index} className="interval-row">
                    <input
                      type="time"
                      aria-label={`Interval ${index + 1} start`}
                      value={interval.startLocal}
                      onChange={(e) => updateInterval(index, 'startLocal', e.target.value)}
                    />
                    <span>–</span>
                    <input
                      type="time"
                      aria-label={`Interval ${index + 1} end`}
                      value={interval.endLocal}
                      onChange={(e) => updateInterval(index, 'endLocal', e.target.value)}
                    />
                    <button className="link-button" type="button" onClick={() => update('intervals', form.intervals.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
                  </div>
                ))}
                <button
                  className="link-button"
                  type="button"
                  onClick={() => update('intervals', [...form.intervals, { startLocal: '09:00', endLocal: '17:00' }])}
                >
                  + Add interval
                </button>
              </div>
              <div className="field">
                <label className="label" htmlFor="rule-reason">Reason (optional)</label>
                <input id="rule-reason" maxLength={500} value={form.reason} onChange={(e) => update('reason', e.target.value)} />
              </div>
            </>
          )}

          {formError ? <p className="error">{formError}</p> : null}
          <div className="actions">
            <button className="primary" type="submit" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add rule'}</button>
            {editing ? <button className="secondary" type="button" onClick={reset}>Cancel</button> : null}
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Weekly hours</h2>
        {weekly.length === 0 ? <p className="muted">No weekly rules yet.</p> : (
          <ul className="plain-list">
            {weekly.map((rule) => (
              <li key={rule.id} className="list-row">
                <span>{describeRule(rule)} {rule.staffId ? <span className="muted">· {rule.staffId.slice(0, 8)}</span> : null}</span>
                <span>
                  <button className="link-button" type="button" onClick={() => startEdit(rule)}>Edit</button>
                  {' · '}
                  <button className="link-button" type="button" disabled={busy} onClick={() => void handleDelete(rule)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel">
        <h2>Date exceptions</h2>
        {exceptions.length === 0 ? <p className="muted">No exceptions scheduled.</p> : (
          <ul className="plain-list">
            {exceptions.map((rule) => (
              <li key={rule.id} className="list-row">
                <span>{describeRule(rule)} {rule.reason ? <span className="muted">· {rule.reason}</span> : null}</span>
                <span>
                  <button className="link-button" type="button" onClick={() => startEdit(rule)}>Edit</button>
                  {' · '}
                  <button className="link-button" type="button" disabled={busy} onClick={() => void handleDelete(rule)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
