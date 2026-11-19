'use client';

import type { BookingView, BusinessVertical } from '@walkin/shared';
import { ArrowRight, RefreshCw, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { BoardSkeleton, BoardTable, type CellPick } from '@/components/board-table';
import { BookingSlip } from '@/components/booking-slip';
import { Highlight, Pin, Stamp, VERTICAL_ICONS } from '@/components/paper';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { listProviders, loadBoard, type BoardRow } from '@/lib/board';
import { apiMessage } from '@/lib/errors';
import { dayLabel, money, relativeDay, shiftDateKey, todayKey, weekdayName, weekdayOf, whenLabel } from '@/lib/format';
import { ACTIVE_STATUSES, VERTICAL_ORDER, VERTICALS } from '@/lib/vocab';

export default function BoardPage() {
  const { user, signedIn, ready } = useAuth();
  const today = todayKey();
  const days = [today, shiftDateKey(today, 1), shiftDateKey(today, 2)];
  const [dateKey, setDateKey] = useState(today);
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<BusinessVertical | 'all'>('all');
  const [pick, setPick] = useState<{ row: BoardRow; cell: CellPick } | null>(null);
  const [slipOpen, setSlipOpen] = useState(false);
  const [mine, setMine] = useState<BookingView[] | null>(null);
  const [shopNames, setShopNames] = useState<Map<string, string>>(new Map());

  const load = useCallback((force = false) => {
    setError('');
    setRows(null);
    loadBoard(dateKey, { force })
      .then(setRows)
      .catch((err) => setError(apiMessage(err, 'Could not load the board.')));
  }, [dateKey]);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user, load]);

  const refreshMine = useCallback(() => {
    if (!signedIn) {
      setMine(null);
      return;
    }
    // Shop names come from the published list, not the board rows, so slips never show a placeholder name.
    Promise.all([api.getMyBookings(), listProviders()])
      .then(([{ bookings }, shops]) => {
        setShopNames(new Map(shops.map((shop) => [shop.id, shop.name])));
        setMine(bookings);
      })
      .catch(() => setMine([]));
  }, [signedIn]);

  useEffect(() => {
    refreshMine();
  }, [refreshMine]);

  const visible = useMemo(() => {
    const sorted = [...(rows ?? [])].sort((a, b) =>
      VERTICAL_ORDER.indexOf(a.provider.vertical) - VERTICAL_ORDER.indexOf(b.provider.vertical)
      || a.provider.name.localeCompare(b.provider.name));
    return filter === 'all' ? sorted : sorted.filter((row) => row.provider.vertical === filter);
  }, [rows, filter]);

  const present = useMemo(() => VERTICAL_ORDER.filter((vertical) => rows?.some((row) => row.provider.vertical === vertical)), [rows]);
  const openCount = useMemo(() => visible.reduce((sum, row) => sum + row.slots.length, 0), [visible]);
  const upcoming = useMemo(
    () => (mine ?? [])
      .filter((booking) => ACTIVE_STATUSES.includes(booking.status) && Date.parse(booking.endUtc) > Date.now())
      .sort((a, b) => a.startUtc.localeCompare(b.startUtc)),
    [mine],
  );

  return (
    <>
      <SiteHeader />
      <main>
        <section className="wrap front" aria-labelledby="board-title">
          <div className="sheet board-sheet" style={{ '--tilt': '-0.35deg' } as CSSProperties}>
            <Pin x="18%" />
            <Pin x="82%" color="#2f6fd6" />
            <header className="title-block">
              <h1 id="board-title" className="notice-heading board-title">
                <span className="board-title__line">Campus shops</span>{' '}
                <span className="board-title__line">Open slots</span>
              </h1>
              <p className="notice-heading board-date" aria-live="polite">{dayLabel(dateKey)}</p>
              <p className="typed board-sub">
                Barbers, salons, laundry and print shops on one timetable. Highlight a free slot to book it, then walk in without the queue.
              </p>
            </header>

            <div className="board-controls">
              <div className="daytabs" role="group" aria-label="Day">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className="daytab"
                    aria-pressed={day === dateKey}
                    onClick={() => {
                      setDateKey(day);
                      setPick(null);
                    }}
                  >
                    {(() => {
                      const label = day === today || day === shiftDateKey(today, 1) ? relativeDay(day) : weekdayName(weekdayOf(day));
                      return day === dateKey ? <Highlight swipe>{label}</Highlight> : label;
                    })()}
                    <span className="daytab__date">{day === today || day === shiftDateKey(today, 1) ? dayLabel(day) : dayLabel(day).split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
              <div className="key" role="group" aria-label="Filter by shop type">
                <span className="key__label">Key</span>
                <button type="button" className="key__item" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
                {present.map((vertical) => {
                  const Icon = VERTICAL_ICONS[vertical];
                  return (
                    <button
                      key={vertical}
                      type="button"
                      className={`key__item c-${VERTICALS[vertical].highlight}`}
                      aria-pressed={filter === vertical}
                      onClick={() => setFilter(filter === vertical ? 'all' : vertical)}
                    >
                      <span className="key__swatch" aria-hidden="true"><Icon /></span>
                      {VERTICALS[vertical].plural}
                    </button>
                  );
                })}
              </div>
            </div>

            {ready && !user ? (
              <div className="alert" role="alert">
                <TriangleAlert aria-hidden="true" />
                <span>Could not start a browsing session, so the board can’t load. Check your connection and reload the page.</span>
              </div>
            ) : error ? (
              <div className="alert" role="alert">
                <TriangleAlert aria-hidden="true" />
                <span>{error}</span>
                <button type="button" className="link-btn" onClick={() => load(true)} style={{ marginLeft: 'auto' }}>Try again</button>
              </div>
            ) : rows === null ? (
              <BoardSkeleton />
            ) : visible.length === 0 ? (
              <p className="note">No shops on the board yet. Shop owners can add their hours from the dashboard.</p>
            ) : (
              <BoardTable
                rows={visible}
                dateKey={dateKey}
                selected={pick?.cell ?? null}
                caption={`Open slots for ${dayLabel(dateKey)}`}
                onPick={(row, cell) => {
                  setPick({ row, cell });
                  setSlipOpen(true);
                }}
              />
            )}

            <p className="board-legend">
              <span><strong>free</strong> most of that hour is open</span>
              <span><strong className="board-legend__few">:45</strong> the last start times left in that hour</span>
              <span><strong>full</strong> booked up</span>
              <span><strong>–</strong> closed</span>
            </p>

            <div className="board-foot">
              <p className="meta">
                {rows ? `${openCount} open start times ${relativeDay(dateKey) === 'Today' ? 'left today' : `on ${dayLabel(dateKey)}`}` : 'Reading the timetable…'}
                {' · '}Times are campus time (GMT).
              </p>
              <p className="meta">
                <button type="button" className="link-btn" onClick={() => load(true)}><RefreshCw width={13} height={13} aria-hidden="true" /> Refresh</button>
                {' · '}Demo data: shops, people and prices are made up for this preview.
              </p>
            </div>
          </div>

          <aside className="front-aside" aria-label="Your slips and shop owners">
            <div className="sheet sheet--pad slips" style={{ '--tilt': '1deg' } as CSSProperties}>
              <Pin color="#e6b800" />
              <h2 className="h3">Your slips</h2>
              {!signedIn ? (
                <p className="meta">Booked slots show up here with the shop’s stamp. <Link href="/sign-in?next=/">Sign in</Link> to see yours.</p>
              ) : mine === null ? (
                <p className="meta">Fetching your bookings…</p>
              ) : upcoming.length === 0 ? (
                <p className="meta">Nothing booked yet. Highlight a free slot on the board to start.</p>
              ) : (
                <ul className="slip-list">
                  {upcoming.slice(0, 3).map((booking) => (
                    <li key={booking.id}>
                      <div>
                        <strong>{booking.priceSnapshot.serviceName}</strong>
                        {shopNames.get(booking.providerId) ? <span className="meta">{shopNames.get(booking.providerId)}</span> : null}
                        <span className="meta">{whenLabel(booking.startUtc, booking.providerTimeZone)}</span>
                      </div>
                      <Stamp status={booking.status} size="sm" tilt={-7} />
                    </li>
                  ))}
                </ul>
              )}
              {signedIn ? <Link className="btn btn--ghost btn--sm" href="/bookings">All my bookings <ArrowRight aria-hidden="true" /></Link> : null}
            </div>

            <div id="for-shops" className="sheet flyer" style={{ '--tilt': '-1.6deg' } as CSSProperties}>
              <Pin color="#2a9d55" />
              <div className="flyer__body">
                <h2 className="notice-heading flyer__title">Run a shop near campus?</h2>
                <p>Put your hours on this board. Students book ahead; you approve braids and print jobs before anyone walks in.</p>
              </div>
              <ul className="flyer__tabs" aria-label="Shop owner links">
                <li><Link href="/sign-in?next=/dashboard">Shop sign-in</Link></li>
                <li><Link href="/sign-in?next=/dashboard/requests">Approve requests</Link></li>
                <li><Link href="/sign-in?next=/dashboard/hours">Set your hours</Link></li>
                <li><Link href="/sign-in?next=/dashboard/services">List services</Link></li>
                <li><Link href="/sign-in?next=/dashboard">See your bookings</Link></li>
              </ul>
            </div>
          </aside>
        </section>

        <section className="wrap lifecycle" aria-labelledby="lifecycle-title">
          <h2 id="lifecycle-title" className="notice-heading h2 on-felt">How a slot becomes yours</h2>
          <ol className="lifecycle__steps">
            <li className="lifecycle__step">
              <div className="sheet sheet--pad lifecycle__paper" style={{ '--tilt': '-1deg' } as CSSProperties}>
                <div className="mini-tt" aria-hidden="true">
                  <span>10am</span><span>11am</span><span>12pm</span>
                  <span className="mini-tt__cell">full</span>
                  <span className="mini-tt__cell mini-tt__cell--open"><Highlight swipe>free</Highlight></span>
                  <span className="mini-tt__cell mini-tt__cell--few">:45</span>
                </div>
              </div>
              <p className="on-felt"><strong>You highlight a free slot.</strong> Every open time on the board is live; nobody else can take it while you book.</p>
            </li>
            <li className="lifecycle__step">
              <div className="sheet sheet--pad lifecycle__paper" style={{ '--tilt': '0.8deg' } as CSSProperties}>
                <p className="typed">Knotless braids · Sat 10am</p>
                <Stamp status="pending" note="held till the shop answers" />
              </div>
              <p className="on-felt"><strong>Some shops check first.</strong> Long styles and print jobs are stamped <em>received</em> and held while the shop looks at your request.</p>
            </li>
            <li className="lifecycle__step">
              <div className="sheet sheet--pad lifecycle__paper" style={{ '--tilt': '-0.6deg' } as CSSProperties}>
                <p className="typed">Haircut · Fri 4:30pm</p>
                <Stamp status="confirmed" tilt={-8} />
              </div>
              <p className="on-felt"><strong>Stamped confirmed, you walk in.</strong> Instant services are confirmed straight away. Change or cancel from My bookings before the shop’s cutoff.</p>
            </li>
          </ol>
        </section>

        <section className="wrap" aria-labelledby="kinds-title">
          <div className="sheet sheet--pad kinds" style={{ '--tilt': '0.25deg' } as CSSProperties}>
            <Pin x="10%" />
            <Pin x="90%" color="#e6b800" />
            <h2 id="kinds-title" className="notice-heading h2">Every shop books its own way</h2>
            <p className="lede">A haircut is a chair at a time. Laundry is a drop-off window. A print job is a file the shop has to see. WalkIn asks each shop’s own questions.</p>
            <div className="kinds__scroll">
              <table className="kinds__table">
                <thead>
                  <tr>
                    <th scope="col">Shop</th>
                    <th scope="col">You book</th>
                    <th scope="col">You tell them</th>
                    <th scope="col">Confirmed</th>
                    <th scope="col">On the board</th>
                  </tr>
                </thead>
                <tbody>
                  {KINDS.map((kind) => {
                    const Icon = VERTICAL_ICONS[kind.vertical];
                    const prices = (rows ?? []).filter((row) => row.provider.vertical === kind.vertical)
                      .flatMap((row) => row.details.services.map((service) => service.price.amountCents));
                    return (
                      <tr key={kind.vertical}>
                        <th scope="row">
                          <span className={`tag c-${VERTICALS[kind.vertical].highlight}`}><Icon aria-hidden="true" />{VERTICALS[kind.vertical].plural}</span>
                        </th>
                        <td data-label="You book">{kind.book}</td>
                        <td data-label="You tell them">{kind.tell}</td>
                        <td data-label="Confirmed">{kind.confirm}</td>
                        <td data-label="On the board">{prices.length ? `from ${money(Math.min(...prices))}` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      {slipOpen && pick ? (
        <BookingSlip
          details={pick.row.details}
          initialServiceId={pick.row.service?.id}
          dateKey={dateKey}
          initialSlot={pick.cell.slot}
          onClose={() => {
            setSlipOpen(false);
            setPick(null);
          }}
          onDone={() => {
            refreshMine();
            loadBoard(dateKey, { force: true }).then(setRows).catch(() => undefined);
          }}
        />
      ) : null}
    </>
  );
}

const KINDS: Array<{ vertical: BusinessVertical; book: string; tell: string; confirm: string }> = [
  { vertical: 'barbershop', book: 'A chair time, with a barber or whoever is free', tell: 'The cut you want, if you like', confirm: 'Instantly' },
  { vertical: 'salon', book: 'An appointment with a stylist', tell: 'Style and length; long styles take hours', confirm: 'Instantly, or after the stylist checks' },
  { vertical: 'laundry', book: 'A drop-off window', tell: 'Wash, dry-clean or iron; bags and rough weight', confirm: 'Instantly' },
  { vertical: 'printing', book: 'A collection time', tell: 'Your file, copies, colour, paper and binding', confirm: 'After the shop checks your file' },
  { vertical: 'general', book: 'A fitting or a drop-off', tell: 'What needs measuring or altering', confirm: 'After the tailor checks' },
];
