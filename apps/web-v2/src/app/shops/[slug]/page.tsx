'use client';

import type { GetProviderDetailsResponse, SlotView } from '@walkin/shared';
import { ArrowLeft, MapPin, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { BookingSlip } from '@/components/booking-slip';
import { Pin, Stroke, VerticalTag } from '@/components/paper';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { BOARD_HOURS, providerDetails } from '@/lib/board';
import { apiMessage } from '@/lib/errors';
import {
  clock,
  dateKeyOf,
  dayLabel,
  durationLabel,
  localHour,
  money,
  nowHour,
  relativeDay,
  shiftDateKey,
  timeLabel,
  todayKey,
} from '@/lib/format';
import { VERTICALS, leadService, serviceTypeOf, SERVICE_TYPES } from '@/lib/vocab';

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [details, setDetails] = useState<GetProviderDetailsResponse | null>(null);
  const [error, setError] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [weekSlots, setWeekSlots] = useState<SlotView[] | null>(null);
  const [slotsError, setSlotsError] = useState('');
  const [slip, setSlip] = useState<{ dateKey: string; slot: SlotView; hour: number } | null>(null);

  const today = todayKey();
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => shiftDateKey(today, index)), [today]);

  useEffect(() => {
    if (!user || !slug) return;
    providerDetails(slug)
      .then((result) => {
        setDetails(result);
        setServiceId((current) => current || leadService(result.provider.vertical, result.services)?.id || result.services[0]?.id || '');
      })
      .catch((err) => setError(apiMessage(err, 'Could not open this shop.')));
  }, [user, slug]);

  const service = details?.services.find((item) => item.id === serviceId);

  const loadWeek = useCallback(() => {
    if (!details || !service) return;
    setWeekSlots(null);
    setSlotsError('');
    // One ranged call covers the whole week; the shop's zone is GMT, so UTC day bounds line up.
    api.getAvailability({
      providerId: details.provider.id,
      serviceId: service.id,
      from: `${days[0]}T00:00:00Z`,
      to: `${shiftDateKey(days[6], 1)}T00:00:00Z`,
      ...(staffId ? { staffId } : {}),
    })
      .then(({ slots }) => setWeekSlots(slots))
      .catch((err) => setSlotsError(apiMessage(err, 'Could not read this week’s times.')));
  }, [details, service, staffId, days]);

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  const grid = useMemo(() => {
    const map = new Map<string, SlotView[]>();
    if (!details) return map;
    for (const slot of weekSlots ?? []) {
      const key = `${dateKeyOf(slot.startUtc, details.provider.timeZone)}|${Math.floor(localHour(slot.startUtc, details.provider.timeZone))}`;
      map.set(key, [...(map.get(key) ?? []), slot]);
    }
    return map;
  }, [weekSlots, details]);

  const staffChoices = useMemo(() => {
    if (!details || !service || service.staffIds.includes('__any__')) return [];
    return details.staff.filter((member) => service.staffIds.includes(member.id));
  }, [details, service]);

  if (error) {
    return (
      <>
        <SiteHeader />
        <main className="wrap page">
          <Link className="crumb" href="/"><ArrowLeft aria-hidden="true" />Back to the board</Link>
          <div className="sheet sheet--pad stack-3">
            <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error}</p>
          </div>
        </main>
      </>
    );
  }

  const provider = details?.provider;
  const vertical = provider ? VERTICALS[provider.vertical] : null;
  const current = nowHour();

  return (
    <>
      <SiteHeader />
      <main className="wrap page">
        <Link className="crumb" href="/"><ArrowLeft aria-hidden="true" />Back to the board</Link>
        <article className="sheet sheet--pad shop-sheet" style={{ '--tilt': '0.2deg' } as CSSProperties} aria-busy={!details}>
          <Pin x="12%" />
          <Pin x="88%" color="#2f6fd6" />
          <header className="shop-head">
            <div className="shop-head__main">
              {provider ? (
                <>
                  <h1 className="notice-heading display" style={{ maxWidth: '18ch' }}>{provider.name}</h1>
                  <div className="summary-line">
                    <VerticalTag vertical={provider.vertical} />
                    {provider.city ? <span><MapPin aria-hidden="true" />{provider.city}</span> : null}
                    <span>Campus time (GMT)</span>
                  </div>
                  {provider.description ? <p className="lede">{provider.description}</p> : null}
                </>
              ) : (
                <>
                  <div className="skeleton-line" style={{ width: 420, maxWidth: '80vw', height: 56 }} />
                  <div className="skeleton-line" style={{ width: 260, maxWidth: '60vw' }} />
                </>
              )}
            </div>
          </header>

          <div className="shop-layout">
            <section aria-labelledby="price-title" className="stack-3">
              <h2 id="price-title" className="h3">Price list</h2>
              {details ? (
                <table className="price-list">
                  <tbody>
                    {details.services.map((item) => {
                      const kind = serviceTypeOf(item, details.provider.vertical);
                      const selected = item.id === serviceId;
                      return (
                        <tr key={item.id}>
                          <td>
                            <button
                              type="button"
                              aria-pressed={selected}
                              onClick={() => {
                                setServiceId(item.id);
                                setStaffId('');
                              }}
                            >
                              {selected ? <Stroke color="yellow" swipe /> : null}
                              <span className="price-list__name">{item.name}</span>
                              <span className="price-list__price">{money(item.price.amountCents, item.price.currency)}</span>
                              <span className="price-list__meta">
                                {SERVICE_TYPES[kind].label} · {durationLabel(item.durationMinutes)} · {item.confirmationMode === 'instant' ? 'confirmed instantly' : 'shop checks first'}
                                {item.description ? ` · ${item.description}` : ''}
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="stack-2">{[0, 1, 2].map((index) => <div key={index} className="skeleton-line" style={{ height: 52 }} />)}</div>
              )}
              <p className="meta">Prices are paid at the shop. WalkIn holds your slot; it does not take payment.</p>
            </section>

            <section aria-labelledby="week-title" className="stack-3">
              <div className="row row--between">
                <h2 id="week-title" className="h3">{service ? `${service.name}, this week` : 'This week'}</h2>
                {staffChoices.length > 1 ? (
                  <div className="choice-row" role="group" aria-label="Staff">
                    <button type="button" className="choice" aria-pressed={staffId === ''} onClick={() => setStaffId('')}>Anyone</button>
                    {staffChoices.map((member) => (
                      <button key={member.id} type="button" className="choice" aria-pressed={staffId === member.id} onClick={() => setStaffId(member.id)}>{member.name}</button>
                    ))}
                  </div>
                ) : null}
              </div>
              {slotsError ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{slotsError}</p> : null}
              <div className="tt-scroll" tabIndex={0} aria-label="This week’s open times, scrolls sideways">
                <table className="tt week-tt">
                  <caption className="sr-only">Open times for the next seven days</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="tt__time">Time</th>
                      {days.map((day) => (
                        <th key={day} scope="col">
                          {relativeDay(day) === 'Today' || relativeDay(day) === 'Tomorrow' ? relativeDay(day) : dayLabel(day).split(' ')[0]}
                          <br />
                          <span style={{ fontWeight: 400 }}>{dayLabel(day).split(' ').slice(1).join(' ')}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BOARD_HOURS.map((hour) => (
                      <tr key={hour}>
                        <th scope="row" className="tt__time">{clock(hour)}</th>
                        {days.map((day) => {
                          const slots = grid.get(`${day}|${hour}`) ?? [];
                          if (weekSlots === null) return <td key={day}><span className="cell" /></td>;
                          if (!slots.length) {
                            const past = day === today && hour + 1 <= current;
                            return <td key={day}><span className={`cell ${past ? 'cell--past' : 'cell--closed'}`} aria-label={past ? 'Past' : 'No open time'}>{past ? '' : '–'}</span></td>;
                          }
                          const starts = [...new Set(slots.map((slot) => slot.startUtc))].sort();
                          const isSelected = slip?.dateKey === day && slip.hour === hour;
                          return (
                            <td key={day}>
                              <button
                                type="button"
                                className={`cell cell--open ${isSelected ? 'cell--selected' : ''}`}
                                aria-label={`${dayLabel(day)}: free at ${starts.map((iso) => timeLabel(iso)).join(', ')}`}
                                onClick={() => setSlip({ dateKey: day, slot: slots[0], hour })}
                              >
                                {isSelected ? <Stroke color="yellow" /> : null}
                                {starts.length >= 3 ? (
                                  <span className="cell__free" aria-hidden="true">free</span>
                                ) : (
                                  <span className="cell__marks cell__marks--few" aria-hidden="true">
                                    {starts.map((iso) => <span key={iso}>:{timeLabel(iso).match(/:(\d\d)/)?.[1] ?? '00'}</span>)}
                                  </span>
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="meta">Free means most of that hour is open; red minutes are the last starts left. Tap a cell to pick an exact time.</p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />

      {details && slip ? (
        <BookingSlip
          details={details}
          initialServiceId={serviceId}
          dateKey={slip.dateKey}
          initialSlot={slip.slot}
          onClose={() => setSlip(null)}
          onDone={() => loadWeek()}
        />
      ) : null}
    </>
  );
}
