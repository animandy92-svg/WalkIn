'use client';

import type {
  BookingVerticalData,
  BookingView,
  GetProviderDetailsResponse,
  LaundryServiceCategory,
  PrintColorMode,
  PrintFinish,
  PrintPaperSize,
  SlotView,
} from '@walkin/shared';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ArrowRight, Clock, FileText, LoaderCircle, MapPin, Minus, Plus, TriangleAlert, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { authErrorMessage, useAuth } from '@/lib/auth';
import { invalidateBoard, slotsForDay } from '@/lib/board';
import { apiMessage } from '@/lib/errors';
import { storage } from '@/lib/firebase';
import {
  dayLabel,
  durationLabel,
  money,
  newIdempotencyKey,
  relativeDay,
  shiftDateKey,
  shortRef,
  timeLabel,
  timeLeft,
  todayKey,
  localHour,
  whenLabel,
} from '@/lib/format';
import { SERVICE_TYPES, VERTICALS, serviceTypeOf } from '@/lib/vocab';
import { Stamp, Stroke, VerticalTag } from './paper';

type Props = {
  details: GetProviderDetailsResponse;
  initialServiceId?: string;
  dateKey: string;
  initialSlot?: SlotView | null;
  /** Rescheduling keeps the service and moves the time. */
  reschedule?: BookingView;
  onClose: () => void;
  onDone?: (booking: BookingView) => void;
};

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const LAUNDRY: Array<{ value: LaundryServiceCategory; label: string }> = [
  { value: 'wash_and_fold', label: 'Wash & fold' },
  { value: 'dry_cleaning', label: 'Dry cleaning' },
  { value: 'ironing_only', label: 'Ironing only' },
];

const FINISHES: Array<{ value: PrintFinish; label: string }> = [
  { value: 'none', label: 'Loose sheets' },
  { value: 'stapled', label: 'Stapled' },
  { value: 'spiral_bound', label: 'Spiral bound' },
  { value: 'laminated', label: 'Laminated' },
];

export function BookingSlip({ details, initialServiceId, dateKey: initialDate, initialSlot, reschedule, onClose, onDone }: Props) {
  const { provider, services, staff } = details;
  const { signedIn, signIn, register, user } = useAuth();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [serviceId, setServiceId] = useState(reschedule?.serviceId ?? initialServiceId ?? services[0]?.id ?? '');
  const [dateKey, setDateKey] = useState(initialDate);
  const [staffId, setStaffId] = useState('');
  const [slots, setSlots] = useState<SlotView[] | null>(null);
  const [selected, setSelected] = useState<SlotView | null>(initialSlot ?? null);
  const [slotsError, setSlotsError] = useState('');

  // Intake
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState<PrintColorMode>('black_and_white');
  const [paperSize, setPaperSize] = useState<PrintPaperSize>('A4');
  const [finish, setFinish] = useState<PrintFinish>('none');
  const [laundryCategory, setLaundryCategory] = useState<LaundryServiceCategory>('wash_and_fold');
  const [bags, setBags] = useState(1);
  const [weight, setWeight] = useState('');

  // Account
  const [mode, setMode] = useState<'register' | 'signin'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BookingView | null>(null);

  const service = services.find((item) => item.id === serviceId);
  const kind = service ? serviceTypeOf(service, provider.vertical) : 'appointment';
  const staffChoices = useMemo(() => {
    if (!service || service.staffIds.includes('__any__')) return [];
    return staff.filter((member) => service.staffIds.includes(member.id));
  }, [service, staff]);
  const staffName = (id: string | null) => staff.find((member) => member.id === id)?.name;

  // Close on Escape, keep focus inside the slip.
  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  useEffect(() => {
    if (!service || result) return;
    let active = true;
    setSlots(null);
    setSlotsError('');
    slotsForDay(provider.id, service.id, dateKey, provider.timeZone, staffId || undefined)
      .then((next) => {
        if (!active) return;
        // "Anyone" can return the same start time for several people; show each time once.
        const seen = new Set<string>();
        const unique = staffId ? next : next.filter((slot) => (seen.has(slot.startUtc) ? false : (seen.add(slot.startUtc), true)));
        setSlots(unique);
        setSelected((current) => (current && unique.some((slot) => slot.startUtc === current.startUtc) ? current : null));
      })
      .catch((err) => {
        if (active) setSlotsError(apiMessage(err, 'Could not load open times.'));
      });
    return () => {
      active = false;
    };
  }, [provider.id, service, staffId, dateKey, result]);

  // Bring the time picked on the timetable into view the first time the list appears.
  const scrolledToPick = useRef(false);
  useEffect(() => {
    if (!slots || scrolledToPick.current) return;
    scrolledToPick.current = true;
    panelRef.current?.querySelector<HTMLElement>('.time-btn[aria-pressed="true"]')?.scrollIntoView({ block: 'center' });
  }, [slots]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => shiftDateKey(todayKey(), index)), []);
  const groups = useMemo(() => {
    const byPart = new Map<string, SlotView[]>();
    for (const slot of slots ?? []) {
      const hour = localHour(slot.startUtc, provider.timeZone);
      const part = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      byPart.set(part, [...(byPart.get(part) ?? []), slot]);
    }
    return [...byPart.entries()];
  }, [slots, provider.timeZone]);

  function pickFile(next: File | undefined) {
    setFileError('');
    if (!next) return;
    if (next.size > MAX_FILE_BYTES) {
      setFileError('That file is over 50 MB. Compress it or split it into parts.');
      return;
    }
    if (!next.type.startsWith('image/') && !FILE_TYPES.includes(next.type)) {
      setFileError('Send a PDF, Word document, text file or image.');
      return;
    }
    setFile(next);
  }

  async function ensureAccount(): Promise<void> {
    if (signedIn) return;
    if (!email.trim() || !password) throw new Error('Add your email and a password to create your account and book.');
    try {
      if (mode === 'register') {
        if (!name.trim()) throw Object.assign(new Error('Add your name to create your account.'), { code: 'local' });
        await register(name, email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      if ((err as { code?: string }).code === 'local') throw err;
      throw new Error(authErrorMessage(err));
    }
  }

  async function submit() {
    if (!service || !selected) return;
    setError('');
    try {
      if (reschedule) {
        setBusy('Moving your booking…');
        const { booking } = await api.rescheduleBooking({
          bookingId: reschedule.id,
          startUtc: selected.startUtc,
          idempotencyKey: newIdempotencyKey(),
        });
        invalidateBoard();
        setResult(booking);
        onDone?.(booking);
        return;
      }

      if (kind === 'print_job' && !file) {
        setError('Attach the file you want printed.');
        return;
      }

      setBusy(signedIn ? 'Booking…' : mode === 'register' ? 'Creating your account…' : 'Signing you in…');
      await ensureAccount();

      let verticalData: BookingVerticalData | undefined;
      if (kind === 'print_job' && file) {
        setBusy('Uploading your file…');
        const { auth } = await import('@/lib/firebase');
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('Sign in again to upload your file.');
        const path = `printJobs/${uid}/${newIdempotencyKey()}/${file.name.replace(/[^\w.\- ]+/g, '_')}`;
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, file, { contentType: file.type || 'application/octet-stream' });
        const url = await getDownloadURL(fileRef);
        verticalData = {
          printJob: { fileUrls: [url], copies, colorMode, paperSize, finish, ...(note.trim() ? { notes: note.trim() } : {}) },
        };
      } else if (kind === 'drop_off' && provider.vertical === 'laundry') {
        const kg = Number(weight);
        verticalData = {
          laundryJob: {
            serviceCategory: laundryCategory,
            bagCount: bags,
            ...(kg > 0 ? { estimatedWeightKg: kg } : {}),
            ...(note.trim() ? { specialInstructions: note.trim() } : {}),
          },
        };
      }

      setBusy('Booking…');
      // Optional fields are spread in only when set: callables send undefined as null.
      const { booking } = await api.createBooking({
        providerId: provider.id,
        serviceId: service.id,
        startUtc: selected.startUtc,
        idempotencyKey: newIdempotencyKey(),
        source: 'web',
        ...(selected.staffId ? { staffId: selected.staffId } : {}),
        ...(note.trim() ? { note: note.trim() } : {}),
        ...(verticalData ? { verticalData } : {}),
      });
      invalidateBoard();
      setResult(booking);
      onDone?.(booking);
    } catch (err) {
      const message = apiMessage(err, err instanceof Error ? err.message : 'Could not book that slot.');
      setError(message);
      if ((err as { code?: string }).code === 'SLOT_UNAVAILABLE') {
        setSelected(null);
        setSlots(null);
        slotsForDay(provider.id, service.id, dateKey, provider.timeZone, staffId || undefined)
          .then(setSlots)
          .catch(() => undefined);
      }
    } finally {
      setBusy(null);
    }
  }

  const vertical = VERTICALS[provider.vertical];
  const actionLabel = reschedule
    ? 'Move to this time'
    : !signedIn
      ? mode === 'register' ? 'Create account & book' : 'Sign in & book'
      : SERVICE_TYPES[kind].action;

  return (
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div
        className="slip"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="slip__head">
          <div className="stack-2">
            <h2 id={titleId} className="h3">
              {result ? (result.status === 'pending' ? 'Request sent' : reschedule ? 'Booking moved' : 'You’re booked') : reschedule ? 'Move your booking' : service?.name ?? 'Book a slot'}
            </h2>
            <div className="summary-line">
              <VerticalTag vertical={provider.vertical} />
              <span><strong>{provider.name}</strong></span>
              {provider.city ? <span><MapPin aria-hidden="true" />{provider.city}</span> : null}
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close booking slip">
            <X aria-hidden="true" />
          </button>
        </div>

        {result ? (
          <div className="slip__body">
            <div className="result">
              <Stamp
                status={result.status}
                size="lg"
                thud
                note={shortRef(result.id)}
              />
              <p className="lede" style={{ fontSize: 'var(--fs-base)' }}>
                {result.status === 'pending'
                  ? `${provider.name} checks ${vertical.noun === 'print job' ? 'print jobs' : 'this kind of booking'} before confirming. Your slot is held while they decide. It turns to confirmed in My bookings when they approve; if they haven’t answered by ${result.holdExpiresAt ? whenLabel(result.holdExpiresAt, provider.timeZone) : 'the deadline'}, the request lapses and the slot is released.`
                  : `${result.priceSnapshot.serviceName} at ${provider.name}, ${whenLabel(result.startUtc, provider.timeZone)}. Walk in at your time; the slot is yours.`}
              </p>
              <dl className="stack-2" style={{ margin: 0 }}>
                <div className="row"><dt className="meta">When</dt><dd style={{ margin: 0, fontWeight: 700 }}>{whenLabel(result.startUtc, provider.timeZone)}</dd></div>
                <div className="row"><dt className="meta">Price</dt><dd style={{ margin: 0, fontWeight: 700 }}>{money(result.priceSnapshot.amountCents, result.priceSnapshot.currency)}, paid at the shop</dd></div>
                <div className="row"><dt className="meta">Reference</dt><dd style={{ margin: 0, fontWeight: 700 }}>{shortRef(result.id)}</dd></div>
              </dl>
            </div>
            <div className="row">
              <Link className="btn" href="/bookings">My bookings <ArrowRight aria-hidden="true" /></Link>
              <button type="button" className="btn btn--ghost" onClick={onClose}>Back to the board</button>
            </div>
          </div>
        ) : (
          <>
            <div className="slip__body">
              {!reschedule && services.length > 1 ? (
                <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend className="section-label">Service</legend>
                  <div className="stack-2">
                    {services.map((item) => (
                      <label key={item.id} className="choice" style={{ justifyContent: 'space-between', width: '100%' }}>
                        <input
                          type="radio"
                          name="service"
                          value={item.id}
                          checked={item.id === serviceId}
                          onChange={() => {
                            setServiceId(item.id);
                            setStaffId('');
                            setSelected(null);
                          }}
                        />
                        <span>{item.name}</span>
                        <span style={{ fontWeight: 400 }}>{durationLabel(item.durationMinutes)} · <strong>{money(item.price.amountCents, item.price.currency)}</strong></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : service ? (
                <p className="summary-line">
                  <span><Clock aria-hidden="true" />{durationLabel(service.durationMinutes)}</span>
                  <span><strong>{money(service.price.amountCents, service.price.currency)}</strong>, paid at the shop</span>
                  <span>{service.confirmationMode === 'instant' ? 'Confirmed instantly' : 'Shop checks first'}</span>
                </p>
              ) : null}

              <div>
                <p className="section-label">Day</p>
                <div className="choice-row" role="group" aria-label="Day">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className="choice"
                      aria-pressed={day === dateKey}
                      onClick={() => {
                        setDateKey(day);
                        setSelected(null);
                      }}
                      title={dayLabel(day)}
                    >
                      {relativeDay(day)}
                    </button>
                  ))}
                </div>
              </div>

              {staffChoices.length > 1 ? (
                <div>
                  <p className="section-label">With</p>
                  <div className="choice-row" role="group" aria-label="Staff">
                    <button type="button" className="choice" aria-pressed={staffId === ''} onClick={() => setStaffId('')}>Anyone free</button>
                    {staffChoices.map((member) => (
                      <button key={member.id} type="button" className="choice" aria-pressed={staffId === member.id} onClick={() => setStaffId(member.id)}>
                        {member.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="section-label">
                  {kind === 'drop_off' ? 'Drop-off time' : kind === 'print_job' ? 'Collection time' : 'Time'} · {relativeDay(dateKey)}
                </p>
                {slotsError ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{slotsError}</p> : null}
                {slots === null && !slotsError ? (
                  <p className="meta row"><LoaderCircle className="spin" width={16} height={16} aria-hidden="true" /> Checking the shop’s timetable…</p>
                ) : null}
                {slots && slots.length === 0 ? (
                  <p className="note">No open {kind === 'drop_off' ? 'drop-off windows' : 'times'} left {relativeDay(dateKey).toLowerCase() === 'today' ? 'today' : `on ${dayLabel(dateKey)}`}. Try another day.</p>
                ) : null}
                <div className="stack-3">
                  {groups.map(([part, list]) => (
                    <div key={part}>
                      <p className="meta" style={{ marginBottom: 6 }}>{part}</p>
                      <div className="times">
                        {list.map((slot) => {
                          const isSelected = selected?.startUtc === slot.startUtc && (!staffId || selected.staffId === slot.staffId);
                          return (
                            <button
                              key={`${slot.startUtc}-${slot.staffId ?? 'any'}`}
                              type="button"
                              className="time-btn"
                              aria-pressed={isSelected}
                              onClick={() => setSelected(slot)}
                            >
                              {isSelected ? <Stroke color="yellow" /> : null}
                              {timeLabel(slot.startUtc, provider.timeZone)}
                              {staffId || !staffName(slot.staffId) ? (slot.capacity > 1 ? <small>{slot.remaining} of {slot.capacity} free</small> : null) : <small>{staffName(slot.staffId)}</small>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!reschedule && kind === 'print_job' ? (
                <div className="stack-4">
                  <p className="section-label" style={{ marginBottom: 0 }}>What to print</p>
                  <label
                    className="dropzone"
                    data-over={dragOver}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragOver(false);
                      pickFile(event.dataTransfer.files[0]);
                    }}
                  >
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.txt,image/*"
                      onChange={(event) => pickFile(event.target.files?.[0])}
                    />
                    {file ? (
                      <span className="file-chip"><FileText aria-hidden="true" />{file.name}</span>
                    ) : (
                      <span className="file-chip"><Upload aria-hidden="true" />Attach your file</span>
                    )}
                    <span className="meta">PDF, Word, text or image, up to 50 MB. Only this shop can open it.</span>
                  </label>
                  {fileError ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{fileError}</p> : null}
                  <div className="grid-2">
                    <div className="field">
                      <span className="label" id="copies-label">Copies</span>
                      <div className="stepper" role="group" aria-labelledby="copies-label">
                        <button type="button" onClick={() => setCopies((value) => Math.max(1, value - 1))} aria-label="Fewer copies"><Minus aria-hidden="true" /></button>
                        <output aria-live="polite">{copies}</output>
                        <button type="button" onClick={() => setCopies((value) => Math.min(500, value + 1))} aria-label="More copies"><Plus aria-hidden="true" /></button>
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="paper">Paper</label>
                      <select id="paper" className="select" value={paperSize} onChange={(event) => setPaperSize(event.target.value as PrintPaperSize)}>
                        <option value="A4">A4</option>
                        <option value="A3">A3</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                      </select>
                    </div>
                  </div>
                  <div className="choice-row" role="group" aria-label="Colour">
                    <button type="button" className="choice" aria-pressed={colorMode === 'black_and_white'} onClick={() => setColorMode('black_and_white')}>Black & white</button>
                    <button type="button" className="choice" aria-pressed={colorMode === 'color'} onClick={() => setColorMode('color')}>Colour</button>
                  </div>
                  <div className="choice-row" role="group" aria-label="Finishing">
                    {FINISHES.map((option) => (
                      <button key={option.value} type="button" className="choice" aria-pressed={finish === option.value} onClick={() => setFinish(option.value)}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {!reschedule && kind === 'drop_off' && provider.vertical === 'laundry' ? (
                <div className="stack-4">
                  <p className="section-label" style={{ marginBottom: 0 }}>Your laundry</p>
                  <div className="choice-row" role="group" aria-label="Laundry service">
                    {LAUNDRY.map((option) => (
                      <button key={option.value} type="button" className="choice" aria-pressed={laundryCategory === option.value} onClick={() => setLaundryCategory(option.value)}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid-2">
                    <div className="field">
                      <span className="label" id="bags-label">Bags</span>
                      <div className="stepper" role="group" aria-labelledby="bags-label">
                        <button type="button" onClick={() => setBags((value) => Math.max(1, value - 1))} aria-label="Fewer bags"><Minus aria-hidden="true" /></button>
                        <output aria-live="polite">{bags}</output>
                        <button type="button" onClick={() => setBags((value) => Math.min(20, value + 1))} aria-label="More bags"><Plus aria-hidden="true" /></button>
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="weight">Rough weight (kg)</label>
                      <input id="weight" className="input" inputMode="decimal" placeholder="Optional" value={weight} onChange={(event) => setWeight(event.target.value.replace(/[^\d.]/g, ''))} />
                    </div>
                  </div>
                </div>
              ) : null}

              {!reschedule ? (
                <div className="field">
                  <label htmlFor="note">{kind === 'print_job' ? 'Instructions for the shop' : 'Note for the shop'}</label>
                  <textarea
                    id="note"
                    className="textarea"
                    maxLength={500}
                    placeholder={kind === 'print_job' ? 'e.g. pages 3–12 only, due at 4pm' : kind === 'drop_off' ? 'e.g. white shirts separate' : 'e.g. low fade, keep the top'}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </div>
              ) : null}

              {!signedIn && !reschedule ? (
                <div className="stack-3" style={{ borderTop: '2px solid var(--rule)', paddingTop: 'var(--s-4)' }}>
                  <div className="row row--between">
                    <p className="section-label" style={{ margin: 0 }}>{mode === 'register' ? 'Create your account to book' : 'Sign in to book'}</p>
                    <button type="button" className="link-btn" style={{ fontSize: 'var(--fs-sm)' }} onClick={() => setMode(mode === 'register' ? 'signin' : 'register')}>
                      {mode === 'register' ? 'I have an account' : 'Create an account instead'}
                    </button>
                  </div>
                  {mode === 'register' ? (
                    <div className="field">
                      <label htmlFor="name">Your name</label>
                      <input id="name" className="input" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                    </div>
                  ) : null}
                  <div className="grid-2">
                    <div className="field">
                      <label htmlFor="email">Email</label>
                      <input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                    <div className="field">
                      <label htmlFor="password">Password</label>
                      <input id="password" className="input" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="slip__foot">
              {error ? <p className="alert" role="alert"><TriangleAlert aria-hidden="true" />{error}</p> : null}
              <p className="meta" aria-live="polite">
                {selected
                  ? `${relativeDay(dateKey)} at ${timeLabel(selected.startUtc, provider.timeZone)}${service ? ` · ${money(service.price.amountCents, service.price.currency)}` : ''}${service?.confirmationMode === 'approval' && !reschedule ? ' · held until the shop confirms' : ''}`
                  : 'Pick a time to continue.'}
              </p>
              <button type="button" className="btn btn--block" disabled={!selected || Boolean(busy) || !user} onClick={() => void submit()}>
                {busy ? <><LoaderCircle className="spin" aria-hidden="true" />{busy}</> : actionLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
