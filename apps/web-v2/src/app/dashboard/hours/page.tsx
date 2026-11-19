'use client';

import type { AvailabilityRuleView } from '@walkin/shared';
import { Check, LoaderCircle, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDashboard } from '@/components/dashboard/context';
import { api } from '@/lib/api';
import { apiMessage } from '@/lib/errors';
import { dayLabel, todayKey, weekdayName } from '@/lib/format';

type DayRow = { open: boolean; start: string; end: string; ruleId?: string; extra: number };

const ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first, the way a timetable runs

export default function HoursPage() {
  const { data, providerId, reload, error } = useDashboard();
  const [rows, setRows] = useState<Record<number, DayRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [closeReason, setCloseReason] = useState('');
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const weekly = useMemo(
    () => (data?.availability ?? []).filter((rule) => rule.kind === 'weekly' && !rule.staffId),
    [data],
  );
  const exceptions = useMemo(
    () => (data?.availability ?? [])
      .filter((rule) => rule.kind === 'exception' && rule.date && rule.date >= todayKey())
      .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '')),
    [data],
  );

  useEffect(() => {
    if (!data) return;
    const next: Record<number, DayRow> = {};
    for (const day of ORDER) {
      const rules = weekly.filter((rule) => rule.dayOfWeek === day);
      const first = rules[0];
      next[day] = first
        ? { open: true, start: first.startLocal ?? '09:00', end: first.endLocal ?? '17:00', ruleId: first.id, extra: rules.length - 1 }
        : { open: false, start: '09:00', end: '17:00', extra: 0 };
    }
    setRows(next);
  }, [data, weekly]);

  const update = (day: number, patch: Partial<DayRow>) => {
    setSaved(false);
    setRows((current) => (current ? { ...current, [day]: { ...current[day], ...patch } } : current));
  };

  async function saveWeek() {
    if (!rows) return;
    for (const day of ORDER) {
      const row = rows[day];
      if (row.open && row.end <= row.start) {
        setFormError(`${weekdayName(day, true)} closes before it opens. Check the times.`);
        return;
      }
    }
    setSaving(true);
    setFormError('');
    try {
      for (const day of ORDER) {
        const row = rows[day];
        if (row.open) {
          await api.saveAvailability({
            providerId,
            ...(row.ruleId ? { ruleId: row.ruleId } : {}),
            kind: 'weekly',
            dayOfWeek: day,
            startLocal: row.start,
            endLocal: row.end,
          });
        } else if (row.ruleId) {
          await api.deleteAvailabilityRule({ providerId, ruleId: row.ruleId });
        }
      }
      await reload();
      setSaved(true);
    } catch (err) {
      setFormError(apiMessage(err, 'Could not save your hours.'));
    } finally {
      setSaving(false);
    }
  }

  async function addClosure() {
    if (!closeDate) {
      setFormError('Pick the date you’ll be closed.');
      return;
    }
    setAdding(true);
    setFormError('');
    try {
      await api.saveAvailability({
        providerId,
        kind: 'exception',
        date: closeDate,
        intervals: [],
        ...(closeReason.trim() ? { reason: closeReason.trim() } : {}),
      });
      setCloseDate('');
      setCloseReason('');
      await reload();
    } catch (err) {
      setFormError(apiMessage(err, 'Could not add that closed day.'));
    } finally {
      setAdding(false);
    }
  }

  async function removeClosure(rule: AvailabilityRuleView) {
    setRemoving(rule.id);
    try {
      await api.deleteAvailabilityRule({ providerId, ruleId: rule.id });
      await reload();
    } catch (err) {
      setFormError(apiMessage(err, 'Could not remove that closed day.'));
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div className="stack-2">
          <h1 className="notice-heading h2">Opening hours</h1>
          <p className="dash-summary">The board only offers times inside these hours. Bookings already made are kept if you change them.</p>
        </div>
      </header>

      {error || formError ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error || formError}</p> : null}

      {!rows ? (
        <p className="meta row"><LoaderCircle className="spin" width={16} height={16} aria-hidden="true" />Loading hours…</p>
      ) : (
        <section className="stack-4" aria-labelledby="week-hours">
          <h2 id="week-hours" className="h3">Every week</h2>
          <div className="data-scroll">
            <table className="data hours">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Open?</th>
                  <th scope="col">Opens</th>
                  <th scope="col">Closes</th>
                </tr>
              </thead>
              <tbody>
                {ORDER.map((day) => {
                  const row = rows[day];
                  return (
                    <tr key={day} className={row.open ? '' : 'is-off'}>
                      <th scope="row">{weekdayName(day, true)}</th>
                      <td>
                        <label className="choice">
                          <input type="checkbox" checked={row.open} onChange={(event) => update(day, { open: event.target.checked })} />
                          {row.open ? 'Open' : 'Closed'}
                        </label>
                      </td>
                      <td>
                        <input aria-label={`${weekdayName(day, true)} opens`} type="time" className="input" value={row.start} disabled={!row.open} onChange={(event) => update(day, { start: event.target.value })} />
                      </td>
                      <td>
                        <input aria-label={`${weekdayName(day, true)} closes`} type="time" className="input" value={row.end} disabled={!row.open} onChange={(event) => update(day, { end: event.target.value })} />
                        {row.extra > 0 ? <span className="hint" style={{ display: 'block', marginTop: 4 }}>+{row.extra} more opening on this day, kept as is</span> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="row">
            <button type="button" className="btn" disabled={saving} onClick={() => void saveWeek()}>
              {saving ? <><LoaderCircle className="spin" aria-hidden="true" />Saving…</> : 'Save hours'}
            </button>
            {saved ? <span className="row meta" style={{ gap: 4 }}><Check width={16} height={16} aria-hidden="true" />Saved. The board shows these now.</span> : null}
          </div>
        </section>
      )}

      <section className="stack-4" aria-labelledby="closed-days">
        <h2 id="closed-days" className="h3">Closed days</h2>
        <p className="meta" style={{ maxWidth: '60ch' }}>Public holidays, funerals, a day off. Nobody can book you on these dates.</p>
        {exceptions.length ? (
          <ul className="plain-list">
            {exceptions.map((rule) => (
              <li key={rule.id}>
                <span><strong>{rule.date ? dayLabel(rule.date) : ''}</strong>{rule.intervals?.length ? ` · special hours ${rule.intervals.map((interval) => `${interval.startLocal}–${interval.endLocal}`).join(', ')}` : ' · closed all day'}{rule.reason ? ` · ${rule.reason}` : ''}</span>
                <button type="button" className="icon-btn" aria-label={`Remove closed day ${rule.date}`} disabled={removing === rule.id} onClick={() => void removeClosure(rule)}>
                  {removing === rule.id ? <LoaderCircle className="spin" aria-hidden="true" /> : <Trash2 aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        ) : <p className="meta">No closed days coming up.</p>}
        <div className="row" style={{ alignItems: 'flex-end' }}>
          <div className="field">
            <label htmlFor="close-date">Date</label>
            <input id="close-date" type="date" className="input" min={todayKey()} value={closeDate} onChange={(event) => setCloseDate(event.target.value)} />
          </div>
          <div className="field" style={{ flex: '1 1 220px' }}>
            <label htmlFor="close-reason">Reason (optional)</label>
            <input id="close-reason" className="input" value={closeReason} onChange={(event) => setCloseReason(event.target.value)} placeholder="e.g. Farmers’ Day" />
          </div>
          <button type="button" className="btn btn--ghost" disabled={adding} onClick={() => void addClosure()}>
            {adding ? <LoaderCircle className="spin" aria-hidden="true" /> : <Plus aria-hidden="true" />}Add closed day
          </button>
        </div>
      </section>
    </div>
  );
}
