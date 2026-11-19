'use client';

import type { BusinessVertical, SlotView } from '@walkin/shared';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { BOARD_HOURS, cellsFor, type BoardRow } from '@/lib/board';
import { clock, localHour, money, nowHour, timeLabel, todayKey } from '@/lib/format';
import { VERTICALS } from '@/lib/vocab';
import { Stroke, VERTICAL_ICONS } from './paper';

export type CellPick = { slug: string; hour: number; slot: SlotView };

export function BoardTable({
  rows,
  dateKey,
  selected,
  onPick,
  caption,
}: {
  rows: BoardRow[];
  dateKey: string;
  selected: CellPick | null;
  onPick: (row: BoardRow, pick: CellPick) => void;
  caption: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  // On a narrow screen, open today's board at the current hour instead of at 7am.
  useEffect(() => {
    const box = scroller.current;
    if (!box || dateKey !== todayKey() || box.scrollWidth <= box.clientWidth) return;
    const index = BOARD_HOURS.indexOf(Math.floor(nowHour()));
    if (index <= 0) return;
    const headers = box.querySelectorAll<HTMLElement>('thead th');
    const target = headers[index + 1];
    const sticky = headers[0]?.offsetWidth ?? 0;
    if (target) box.scrollLeft = Math.max(0, target.offsetLeft - sticky);
  }, [dateKey, rows.length]);

  return (
    <div className="tt-scroll" tabIndex={0} aria-label="Open slots timetable, scrolls sideways" ref={scroller}>
      <table className="tt">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col className="tt__shop-col" />
          {BOARD_HOURS.map((hour) => <col key={hour} />)}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="tt__corner tt__row-head">Shop</th>
            {BOARD_HOURS.map((hour) => (
              <th key={hour} scope="col">{clock(hour)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const cells = cellsFor(row.slots, dateKey, row.provider.timeZone);
            const Icon = VERTICAL_ICONS[row.provider.vertical as BusinessVertical];
            const tone = VERTICALS[row.provider.vertical].highlight;
            return (
              <tr key={row.provider.id}>
                <th scope="row" className="tt__row-head">
                  <Link href={`/shops/${row.provider.slug}`}>{row.provider.name}</Link>
                  <span className="tt__row-sub">
                    <span className={`tag c-${tone}`} style={{ padding: '3px 4px' }} aria-label={VERTICALS[row.provider.vertical].label}>
                      <Icon aria-hidden="true" />
                    </span>
                    {row.service ? `${row.service.name} · ${money(row.service.price.amountCents, row.service.price.currency)}` : 'No services listed'}
                  </span>
                </th>
                {row.error ? (
                  <td colSpan={BOARD_HOURS.length}>
                    <span className="cell cell--full" style={{ justifyItems: 'start', paddingLeft: 16 }}>{row.error} Use Refresh below to try again.</span>
                  </td>
                ) : BOARD_HOURS.map((hour) => {
                  const cell = cells.get(hour)!;
                  if (cell.kind === 'open') {
                    const isSelected = selected?.slug === row.provider.slug && selected.hour === hour;
                    const first = cell.slots[0];
                    const starts = [...new Set(cell.slots.map((slot) => slot.startUtc))].sort();
                    const marks = starts.map((iso) => `:${String(Math.round((localHour(iso, row.provider.timeZone) % 1) * 60)).padStart(2, '0')}`);
                    const spoken = starts.map((iso) => timeLabel(iso, row.provider.timeZone)).join(', ');
                    return (
                      <td key={hour}>
                        <button
                          type="button"
                          className={`cell cell--open ${isSelected ? 'cell--selected' : ''}`}
                          aria-pressed={isSelected}
                          aria-label={`${row.provider.name}: free at ${spoken}`}
                          onClick={() => onPick(row, { slug: row.provider.slug, hour, slot: first })}
                        >
                          {isSelected ? <Stroke color="yellow" /> : null}
                          {marks.length >= 3 ? (
                            <span className="cell__free" aria-hidden="true">free</span>
                          ) : (
                            <span className="cell__marks cell__marks--few" aria-hidden="true">
                              {marks.map((mark) => <span key={mark}>{mark}</span>)}
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  }
                  if (cell.kind === 'full') {
                    return <td key={hour}><span className="cell cell--full">full</span></td>;
                  }
                  if (cell.kind === 'past') {
                    return <td key={hour}><span className="cell cell--past" aria-label="Past" /></td>;
                  }
                  return <td key={hour}><span className="cell cell--closed" aria-label="Closed">–</span></td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="tt-scroll" aria-busy="true" aria-label="Loading the timetable">
      <table className="tt">
        <colgroup>
          <col className="tt__shop-col" />
          {BOARD_HOURS.map((hour) => <col key={hour} />)}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="tt__corner tt__row-head">Shop</th>
            {BOARD_HOURS.map((hour) => <th key={hour} scope="col">{clock(hour)}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, index) => (
            <tr key={index}>
              <th scope="row" className="tt__row-head">
                <div className="skeleton-line" style={{ width: `${60 + ((index * 17) % 30)}%` }} />
                <div className="skeleton-line" style={{ width: '45%', marginTop: 8, height: 10 }} />
              </th>
              {BOARD_HOURS.map((hour) => <td key={hour}><span className="cell" /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
