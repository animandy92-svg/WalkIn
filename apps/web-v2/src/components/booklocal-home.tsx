'use client';

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Grid2X2,
  MapPin,
  Printer,
  Search,
  Shirt,
  Scissors,
  Sparkles,
  Star,
  Store,
  Ticket,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import styles from './booklocal-home.module.css';

type CategoryId = 'barbers' | 'salons' | 'laundry' | 'printing' | 'other';
type CategoryFilter = CategoryId | 'all';
type Service = { id: string; name: string; price: number; duration: string };
type Provider = {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  location: string;
  rating: number;
  reviews: number;
  status: string;
  tone: 'green' | 'teal' | 'blue' | 'amber';
  gradient: string;
  waitSaved: string;
  notePlaceholder: string;
  bookedSlots: string[];
  services: Service[];
};
type Booking = {
  id: string;
  providerId: string;
  providerName: string;
  categoryLabel: string;
  location: string;
  services: Service[];
  totalPrice: number;
  dateLabel: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerNote: string;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
};
type UpcomingDay = { dayName: string; monthShort: string; dateNum: number; fullLabel: string };
type Toast = { id: number; message: string; tone: 'success' | 'info' | 'error' };

const STORAGE_KEY = 'booklocal_bookings_v1';
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:30 PM', '02:30 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const CATEGORIES: Array<{ id: CategoryFilter; label: string; Icon: LucideIcon }> = [
  { id: 'all', label: 'All Services', Icon: Grid2X2 },
  { id: 'barbers', label: 'Barbers', Icon: Scissors },
  { id: 'salons', label: 'Salons', Icon: Sparkles },
  { id: 'laundry', label: 'Laundry', Icon: Shirt },
  { id: 'printing', label: 'Printing Shops', Icon: Printer },
  { id: 'other', label: 'Repairs & Tailoring', Icon: Wrench },
];

const PROVIDERS: Provider[] = [
  {
    id: 'sharpfade', name: 'SharpFade Barbershop', category: 'barbers', categoryLabel: 'Barbershop',
    location: 'UCC Science Market, Cape Coast', rating: 4.9, reviews: 184, status: 'Available Today', tone: 'green',
    gradient: 'linear-gradient(125deg,#263744,#0f766e)', waitSaved: 'Saves ~40 mins wait',
    notePlaceholder: 'e.g., Low skin fade with sharp beard lineup', bookedSlots: ['10:00 AM', '01:30 PM', '04:00 PM'],
    services: [
      { id: 'sf-1', name: 'Skin Fade & Lineup', price: 45, duration: '35 mins' },
      { id: 'sf-2', name: 'Classic Haircut & Hot Towel', price: 40, duration: '30 mins' },
      { id: 'sf-3', name: 'Beard Trim & Dye Enhancement', price: 30, duration: '20 mins' },
      { id: 'sf-4', name: 'VIP Full Grooming Package', price: 85, duration: '60 mins' },
    ],
  },
  {
    id: 'crowncuts', name: 'Crown Cuts Studio', category: 'barbers', categoryLabel: 'Barbershop',
    location: 'Kotokuraba Road, Cape Coast', rating: 4.8, reviews: 129, status: 'Next slot: 11:00 AM', tone: 'teal',
    gradient: 'linear-gradient(125deg,#303238,#111827)', waitSaved: 'Saves ~35 mins wait',
    notePlaceholder: 'e.g., Taper fade, keep top curly', bookedSlots: ['09:00 AM', '10:00 AM', '02:30 PM'],
    services: [
      { id: 'cc-1', name: 'Executive Taper Fade', price: 50, duration: '40 mins' },
      { id: 'cc-2', name: 'Kids Haircut', price: 25, duration: '25 mins' },
      { id: 'cc-3', name: 'Scalp Detox & Haircut', price: 70, duration: '50 mins' },
    ],
  },
  {
    id: 'glowbraid', name: 'Glow & Braid Lounge', category: 'salons', categoryLabel: 'Beauty Salon',
    location: 'Pedu Junction, Cape Coast', rating: 4.9, reviews: 216, status: 'Available Today', tone: 'green',
    gradient: 'linear-gradient(125deg,#9f315e,#b45309)', waitSaved: 'Saves ~55 mins wait',
    notePlaceholder: 'e.g., Bringing my own attachment (Colour 1B)', bookedSlots: ['09:00 AM', '11:00 AM', '03:00 PM'],
    services: [
      { id: 'gb-1', name: 'Knotless Braids (Medium)', price: 180, duration: '150 mins' },
      { id: 'gb-2', name: 'Wash, Deep Condition & Blowout', price: 75, duration: '50 mins' },
      { id: 'gb-3', name: 'Cornrows / Stitch Braids', price: 90, duration: '70 mins' },
      { id: 'gb-4', name: 'Wig Revamp & Styling', price: 110, duration: '60 mins' },
    ],
  },
  {
    id: 'velvettouch', name: 'Velvet Touch Beauty', category: 'salons', categoryLabel: 'Beauty Salon',
    location: 'Ola Estate, Cape Coast', rating: 4.7, reviews: 94, status: 'Next slot: 12:00 PM', tone: 'teal',
    gradient: 'linear-gradient(125deg,#6b3f8f,#9f315e)', waitSaved: 'Saves ~30 mins wait',
    notePlaceholder: 'e.g., Gel polish French tips, natural glam makeup', bookedSlots: ['10:00 AM', '11:00 AM', '04:00 PM'],
    services: [
      { id: 'vt-1', name: 'Gel Manicure & Nail Art', price: 80, duration: '45 mins' },
      { id: 'vt-2', name: 'Spa Pedicure', price: 95, duration: '50 mins' },
      { id: 'vt-3', name: 'Soft Glam Makeup Session', price: 150, duration: '60 mins' },
    ],
  },
  {
    id: 'freshpress', name: 'FreshPress Laundry & Dryclean', category: 'laundry', categoryLabel: 'Laundry Service',
    location: 'Tantri Station Area, Cape Coast', rating: 4.8, reviews: 142, status: 'Express Drop-off', tone: 'blue',
    gradient: 'linear-gradient(125deg,#0369a1,#0f766e)', waitSaved: 'Saves ~20 mins drop-off',
    notePlaceholder: 'e.g., 4 office shirts + 2 trousers, light starch', bookedSlots: ['12:00 PM', '05:00 PM'],
    services: [
      { id: 'fp-1', name: 'Wash & Fold Drop-off (Up to 6kg)', price: 65, duration: '10 mins drop-off' },
      { id: 'fp-2', name: 'Express Ironing (5 Pieces)', price: 35, duration: '10 mins drop-off' },
      { id: 'fp-3', name: '2-Piece Suit Dry Cleaning', price: 75, duration: '10 mins drop-off' },
      { id: 'fp-4', name: 'Duvet / Bedsheet Deep Wash', price: 60, duration: '10 mins drop-off' },
    ],
  },
  {
    id: 'sparklewash', name: 'SparkleWash Express', category: 'laundry', categoryLabel: 'Laundry Service',
    location: 'Amamoma / UCC West Gate', rating: 4.7, reviews: 118, status: 'Available Today', tone: 'green',
    gradient: 'linear-gradient(125deg,#0e7490,#1e40af)', waitSaved: 'Saves ~25 mins drop-off',
    notePlaceholder: 'e.g., Student basket, separate whites from colors', bookedSlots: ['09:00 AM', '01:30 PM'],
    services: [
      { id: 'sw-1', name: 'Student Wash & Fold Basket', price: 50, duration: '5 mins drop-off' },
      { id: 'sw-2', name: 'Same-Day Express Ironing', price: 40, duration: '5 mins drop-off' },
      { id: 'sw-3', name: 'Sneaker Deep Cleaning', price: 45, duration: '5 mins drop-off' },
    ],
  },
  {
    id: 'rapidprint', name: 'RapidPrint & Bind Hub', category: 'printing', categoryLabel: 'Printing Shop',
    location: 'UCC Old Site, Cape Coast', rating: 4.9, reviews: 263, status: 'Express Queue', tone: 'amber',
    gradient: 'linear-gradient(125deg,#3730a3,#111827)', waitSaved: 'Saves ~45 mins queue',
    notePlaceholder: 'e.g., Bringing 45-page project PDF on USB for comb binding', bookedSlots: ['10:00 AM', '11:00 AM', '02:30 PM'],
    services: [
      { id: 'rp-1', name: 'Document Printing & Comb Binding', price: 35, duration: '15 mins' },
      { id: 'rp-2', name: 'Large Format Poster (A1 / A2)', price: 60, duration: '20 mins' },
      { id: 'rp-3', name: 'Express Photocopying (Up to 100 pgs)', price: 25, duration: '10 mins' },
      { id: 'rp-4', name: 'Thesis Hardcover Binding', price: 95, duration: '30 mins' },
    ],
  },
  {
    id: 'campuscopy', name: 'CampusCopy & Graphics', category: 'printing', categoryLabel: 'Printing Shop',
    location: 'Apewosika, Cape Coast', rating: 4.6, reviews: 109, status: 'Available Today', tone: 'green',
    gradient: 'linear-gradient(125deg,#115e59,#065f46)', waitSaved: 'Saves ~30 mins queue',
    notePlaceholder: 'e.g., 20 color flyers + 4 passport photos', bookedSlots: ['12:00 PM', '03:00 PM'],
    services: [
      { id: 'cg-1', name: 'Color Document Printing (20 pgs)', price: 30, duration: '15 mins' },
      { id: 'cg-2', name: 'Flyer & Business Card Print Run', price: 85, duration: '25 mins' },
      { id: 'cg-3', name: 'Instant Passport Photos & Laminating', price: 20, duration: '10 mins' },
    ],
  },
  {
    id: 'stitchright', name: 'StitchRight Tailoring', category: 'other', categoryLabel: 'Tailoring & Alterations',
    location: 'Abura Market Road, Cape Coast', rating: 4.8, reviews: 87, status: 'Next slot: 01:30 PM', tone: 'teal',
    gradient: 'linear-gradient(125deg,#92400e,#292524)', waitSaved: 'Saves ~25 mins wait',
    notePlaceholder: 'e.g., Bringing Ankara fabric for Friday kaftan measurement', bookedSlots: ['09:00 AM', '11:00 AM', '12:00 PM'],
    services: [
      { id: 'sr-1', name: 'Express Trouser / Dress Alteration', price: 35, duration: '25 mins' },
      { id: 'sr-2', name: 'Custom Kaftan Measurement & Fitting', price: 160, duration: '30 mins' },
      { id: 'sr-3', name: 'Zipper Replacement & Hemming', price: 25, duration: '20 mins' },
    ],
  },
  {
    id: 'quickfix', name: 'QuickFix Phone Lab', category: 'other', categoryLabel: 'Device Repairs',
    location: 'Kotokuraba Plaza, Cape Coast', rating: 4.8, reviews: 151, status: 'Available Today', tone: 'green',
    gradient: 'linear-gradient(125deg,#334155,#164e63)', waitSaved: 'Saves ~35 mins wait',
    notePlaceholder: 'e.g., iPhone 13 cracked screen or Samsung charging port', bookedSlots: ['10:00 AM', '04:00 PM'],
    services: [
      { id: 'qf-1', name: 'Phone Diagnostic & Charging Port Fix', price: 70, duration: '35 mins' },
      { id: 'qf-2', name: 'Screen Replacement Consultation & Fit', price: 250, duration: '45 mins' },
      { id: 'qf-3', name: 'Battery Replacement (Most Models)', price: 140, duration: '30 mins' },
    ],
  },
];

function upcomingDays(): UpcomingDay[] {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);
    const dayName = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
    return { dayName, monthShort, dateNum: date.getDate(), fullLabel: `${dayName}, ${monthShort} ${date.getDate()}` };
  });
}

function isService(value: unknown): value is Service {
  if (!value || typeof value !== 'object') return false;
  const service = value as Partial<Service>;
  return typeof service.id === 'string'
    && typeof service.name === 'string'
    && typeof service.price === 'number'
    && typeof service.duration === 'string';
}

function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== 'object') return false;
  const booking = value as Partial<Booking>;
  return typeof booking.id === 'string'
    && typeof booking.providerId === 'string'
    && typeof booking.providerName === 'string'
    && typeof booking.categoryLabel === 'string'
    && typeof booking.location === 'string'
    && Array.isArray(booking.services)
    && booking.services.every(isService)
    && typeof booking.totalPrice === 'number'
    && typeof booking.dateLabel === 'string'
    && typeof booking.timeSlot === 'string'
    && typeof booking.customerName === 'string'
    && typeof booking.customerPhone === 'string'
    && typeof booking.customerNote === 'string'
    && typeof booking.createdAt === 'string'
    && (booking.status === 'Confirmed' || booking.status === 'Cancelled');
}

function money(amount: number): string {
  return `GH₵ ${amount}`;
}

function Dialog({
  titleId,
  children,
  onClose,
  className = '',
}: {
  titleId: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={styles.overlay} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={`${styles.dialog} ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        {children}
      </section>
    </div>
  );
}

export default function BookLocalHome() {
  const dates = useMemo(upcomingDays, []);
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings'>('explore');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dateIndex, setDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [formError, setFormError] = useState('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const filteredProviders = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return PROVIDERS.filter((provider) => {
      if (category !== 'all' && provider.category !== category) return false;
      if (!term) return true;
      const services = provider.services.map((service) => service.name).join(' ');
      return `${provider.name} ${provider.location} ${provider.categoryLabel} ${services}`.toLocaleLowerCase().includes(term);
    });
  }, [category, query]);

  const selectedProviderServices = bookingProvider?.services.filter((service) => selectedServices.includes(service.id)) ?? [];
  const bookingTotal = selectedProviderServices.reduce((total, service) => total + service.price, 0);
  const activeBookings = bookings.filter((booking) => booking.status === 'Confirmed');
  const selectedDay = dates[dateIndex];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error('Saved bookings have an invalid format.');
        const valid = parsed.filter(isBooking);
        if (valid.length !== parsed.length) {
          setToast({ id: Date.now(), message: 'Some saved bookings could not be read and were skipped.', tone: 'error' });
        }
        setBookings(valid);
      }
    } catch (error) {
      console.error('Unable to load saved BookLocal bookings.', error);
      setToast({ id: Date.now(), message: 'Saved bookings could not be loaded from this browser.', tone: 'error' });
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const modalOpen = Boolean(bookingProvider || cancelId || businessOpen);
    if (!modalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBookingProvider(null);
        setCancelId(null);
        setBusinessOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [bookingProvider, cancelId, businessOpen]);

  function notify(message: string, tone: Toast['tone'] = 'success') {
    setToast({ id: Date.now(), message, tone });
  }

  function persistBookings(next: Booking[]) {
    setBookings(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Unable to save BookLocal bookings.', error);
      notify('This browser could not save your booking. It will remain visible until you close this tab.', 'error');
    }
  }

  function openBooking(provider: Provider) {
    setBookingProvider(provider);
    setStep(1);
    setSelectedServices([provider.services[0].id]);
    setDateIndex(0);
    setSelectedTime('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerNote('');
    setFormError('');
    setCreatedBooking(null);
  }

  function closeBooking() {
    setBookingProvider(null);
    setCreatedBooking(null);
  }

  function toggleService(id: string) {
    setSelectedServices((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  function availableTimes(provider: Provider): string[] {
    const bookedFromSample = dateIndex === 0 ? provider.bookedSlots : provider.bookedSlots.slice(0, Math.max(1, provider.bookedSlots.length - 1));
    const bookedFromLocal = bookings
      .filter((booking) => booking.providerId === provider.id && booking.dateLabel === selectedDay.fullLabel && booking.status === 'Confirmed')
      .map((booking) => booking.timeSlot);
    return TIME_SLOTS.filter((slot) => !bookedFromSample.includes(slot) && !bookedFromLocal.includes(slot));
  }

  function confirmBooking() {
    if (!bookingProvider || !selectedDay) return;
    const name = customerName.trim();
    const phone = customerPhone.trim();
    if (!name || !phone) {
      setFormError('Enter your full name and phone number to reserve this slot.');
      return;
    }
    if (!selectedServices.length || !selectedTime) {
      setFormError('Choose at least one service and an available time.');
      return;
    }
    const services = bookingProvider.services.filter((service) => selectedServices.includes(service.id));
    const id = `BL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const booking: Booking = {
      id,
      providerId: bookingProvider.id,
      providerName: bookingProvider.name,
      categoryLabel: bookingProvider.categoryLabel,
      location: bookingProvider.location,
      services,
      totalPrice: services.reduce((total, service) => total + service.price, 0),
      dateLabel: selectedDay.fullLabel,
      timeSlot: selectedTime,
      customerName: name,
      customerPhone: phone,
      customerNote: customerNote.trim(),
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    persistBookings([booking, ...bookings]);
    setCreatedBooking(booking);
    setFormError('');
    setStep(4);
    notify(`Booking ${id} confirmed with ${booking.providerName}.`);
  }

  function cancelBooking() {
    if (!cancelId) return;
    const booking = bookings.find((item) => item.id === cancelId);
    if (booking) {
      persistBookings(bookings.map((item) => item.id === cancelId ? { ...item, status: 'Cancelled' } : item));
      notify(`Booking ${booking.id} has been cancelled.`, 'info');
    }
    setCancelId(null);
  }

  async function copyBookingCode(id: string) {
    try {
      await navigator.clipboard.writeText(`#${id}`);
      notify(`Pass code #${id} copied.`);
    } catch (error) {
      console.error('Unable to copy the booking code.', error);
      notify(`Copy was unavailable. Your pass code is #${id}.`, 'info');
    }
  }

  function submitBusinessForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusinessOpen(false);
    notify('Thanks for your interest. Business applications are a demo and are not submitted yet.', 'info');
    event.currentTarget.reset();
  }

  const cancelBookingDetails = bookings.find((booking) => booking.id === cancelId);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="/" aria-label="BookLocal home">
            <span className={styles.brandMark}><CalendarDays size={21} aria-hidden="true" /></span>
            <span className={styles.brandText}>Book<span>Local</span><small>Cape Coast &amp; UCC</small></span>
          </a>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <button type="button" className={activeTab === 'explore' ? styles.navActive : ''} onClick={() => setActiveTab('explore')}>Explore Services</button>
            <button type="button" className={activeTab === 'bookings' ? styles.navActive : ''} onClick={() => setActiveTab('bookings')}>
              My Bookings
              {activeBookings.length > 0 && <span className={styles.badge}>{activeBookings.length}</span>}
            </button>
          </nav>
          <button type="button" className={styles.partnerButton} onClick={() => setBusinessOpen(true)}>
            <Store size={16} aria-hidden="true" /><span>List Your Business</span>
          </button>
        </div>
        <nav className={styles.mobileNav} aria-label="Main navigation">
          <button type="button" className={activeTab === 'explore' ? styles.navActive : ''} onClick={() => setActiveTab('explore')}>Explore Services</button>
          <button type="button" className={activeTab === 'bookings' ? styles.navActive : ''} onClick={() => setActiveTab('bookings')}>
            My Bookings{activeBookings.length > 0 && <span className={styles.badge}>{activeBookings.length}</span>}
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {activeTab === 'explore' ? (
          <>
            <section className={styles.hero}>
              <div className={styles.heroInner}>
                <p className={styles.eyebrow}><span /> Instant queue passes · zero walk-in waiting</p>
                <h1>Skip the wait. Book local services <span>before you arrive.</span></h1>
                <p className={styles.heroCopy}>Reserve your spot at trusted barbers, beauty salons, express laundry drop-offs, printing hubs, and repair shops around Cape Coast &amp; UCC in seconds.</p>
                <label className={styles.searchBox}>
                  <Search size={20} aria-hidden="true" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search barber, braids, laundry, printing, or neighborhood…" aria-label="Search services" />
                  {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={17} /></button>}
                </label>
                <div className={styles.categories} role="group" aria-label="Filter by service category">
                  {CATEGORIES.map(({ id, label, Icon }) => (
                    <button key={id} type="button" className={category === id ? styles.categoryActive : ''} aria-pressed={category === id} onClick={() => setCategory(id)}>
                      <Icon size={16} aria-hidden="true" />{label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className={styles.directory} aria-labelledby="directory-title">
              <div className={styles.demoBanner} role="note">
                <BadgeCheck size={16} aria-hidden="true" />
                <span>Preview only: providers, prices, and availability are illustrative. Bookings stay in this browser and are not sent to shops.</span>
              </div>
              <div className={styles.directoryHead}>
                <div>
                  <h2 id="directory-title">{category === 'all' ? 'All Local Service Providers' : CATEGORIES.find((item) => item.id === category)?.label}</h2>
                  <p>{filteredProviders.length} provider{filteredProviders.length === 1 ? '' : 's'} listed in this preview</p>
                </div>
                <div className={styles.savedTime}><Clock3 size={16} aria-hidden="true" /><span>Average wait saved: <strong>32 mins</strong></span></div>
              </div>

              {filteredProviders.length ? (
                <div className={styles.providerGrid}>
                  {filteredProviders.map((provider) => {
                    const Icon = CATEGORIES.find((item) => item.id === provider.category)?.Icon ?? Store;
                    return (
                      <article key={provider.id} className={styles.providerCard}>
                        <div className={styles.cardBanner} style={{ background: provider.gradient }}>
                          <span className={`${styles.status} ${styles[`status_${provider.tone}`]}`}><i />{provider.status}</span>
                          <span className={styles.rating}><Star size={13} fill="currentColor" aria-hidden="true" />{provider.rating}<small>({provider.reviews})</small></span>
                          <div className={styles.bannerBottom}><span>{provider.categoryLabel}</span><Icon size={24} aria-hidden="true" /></div>
                        </div>
                        <div className={styles.cardBody}>
                          <h3>{provider.name}</h3>
                          <p className={styles.location}><MapPin size={14} aria-hidden="true" />{provider.location}</p>
                          <ul className={styles.servicePreview}>
                            {provider.services.slice(0, 3).map((service) => <li key={service.id}><span>{service.name}</span><strong>{money(service.price)}</strong></li>)}
                          </ul>
                          <div className={styles.cardFooter}>
                            <span className={styles.waitSaved}><Zap size={14} aria-hidden="true" />{provider.waitSaved}</span>
                            <button type="button" className={styles.primaryButton} onClick={() => openBooking(provider)}>Book Appointment</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Search size={26} aria-hidden="true" />
                  <h3>No matching providers found</h3>
                  <p>Try a different search or reset your category filter.</p>
                  <button type="button" className={styles.primaryButton} onClick={() => { setCategory('all'); setQuery(''); }}>Show all providers</button>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className={styles.bookingsPage} aria-labelledby="bookings-title">
            <div className={styles.bookingPageHead}>
              <div><h1 id="bookings-title">My Bookings &amp; Queue Passes</h1><p>Show your digital queue pass when you arrive.</p></div>
              <button type="button" className={styles.primaryButton} onClick={() => setActiveTab('explore')}><ArrowLeft size={16} /> Explore services</button>
            </div>
            {!storageReady ? <p className={styles.loadingNote}>Loading your bookings…</p> : bookings.length === 0 ? (
              <div className={styles.emptyState}>
                <CalendarDays size={28} aria-hidden="true" />
                <h2>No bookings yet</h2>
                <p>Book a haircut, laundry drop-off, or printing slot to get your digital queue pass.</p>
                <button type="button" className={styles.primaryButton} onClick={() => setActiveTab('explore')}>Explore local services</button>
              </div>
            ) : (
              <div className={styles.bookingList}>
                {bookings.map((booking) => (
                  <article className={styles.bookingCard} key={booking.id}>
                    <div className={styles.bookingDetails}>
                      <div className={styles.bookingLabels}>
                        <span className={`${styles.bookingStatus} ${booking.status === 'Confirmed' ? styles.confirmed : styles.cancelled}`}>{booking.status}</span>
                        <span className={styles.passLabel}>Pass #{booking.id}</span><small>{booking.categoryLabel}</small>
                      </div>
                      <h2>{booking.providerName}</h2>
                      <p className={styles.location}><MapPin size={14} aria-hidden="true" />{booking.location}</p>
                      <p className={styles.bookingWhen}><CalendarDays size={16} aria-hidden="true" />{booking.dateLabel} at {booking.timeSlot}<strong>{money(booking.totalPrice)}</strong></p>
                      <div className={styles.bookingSummary}>
                        <p><strong>Services:</strong> {booking.services.map((service) => service.name).join(', ')}</p>
                        <p><strong>Booked for:</strong> {booking.customerName} ({booking.customerPhone})</p>
                        {booking.customerNote && <p><strong>Note:</strong> {booking.customerNote}</p>}
                      </div>
                    </div>
                    <div className={styles.bookingActions}>
                      <Ticket size={30} aria-hidden="true" />
                      <button type="button" className={styles.textButton} onClick={() => void copyBookingCode(booking.id)}><Copy size={14} />Copy #{booking.id}</button>
                      {booking.status === 'Confirmed' ? <button type="button" className={styles.cancelButton} onClick={() => setCancelId(booking.id)}>Cancel Booking</button> : <span className={styles.cancelledText}>Cancelled</span>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <div><strong>BookLocal</strong><span>·</span><span>Smart local appointment booking</span></div>
        <p>Queue passes for Cape Coast, UCC, Kotokuraba, Tantri &amp; Ola</p>
      </footer>

      {bookingProvider && (
        <Dialog titleId="booking-dialog-title" onClose={closeBooking} className={styles.bookingDialog}>
          <div className={styles.dialogHeader}>
            <div><p>{bookingProvider.categoryLabel}</p><h2 id="booking-dialog-title">{bookingProvider.name}</h2></div>
            <button type="button" className={styles.iconButton} onClick={closeBooking} aria-label="Close booking"><X size={20} /></button>
          </div>
          {step < 4 && (
            <div className={styles.stepBar} aria-label={`Step ${step} of 3`}>
              {['Services', 'Date & Time', 'Details'].map((label, index) => (
                <div key={label} className={`${styles.step} ${step >= index + 1 ? styles.stepCurrent : ''}`}>
                  <span>{step > index + 1 ? <Check size={13} /> : index + 1}</span>{label}
                </div>
              ))}
            </div>
          )}
          <div className={styles.dialogBody}>
            {step === 1 && (
              <>
                <h3>Select service(s)</h3><p className={styles.stepIntro}>Choose one or more services.</p>
                <div className={styles.serviceOptions}>
                  {bookingProvider.services.map((service) => {
                    const selected = selectedServices.includes(service.id);
                    return (
                      <button type="button" key={service.id} className={`${styles.serviceOption} ${selected ? styles.serviceOptionSelected : ''}`} aria-pressed={selected} onClick={() => toggleService(service.id)}>
                        <span className={`${styles.checkbox} ${selected ? styles.checkboxSelected : ''}`}>{selected && <Check size={14} />}</span>
                        <span className={styles.serviceOptionText}><strong>{service.name}</strong><small>Est. duration: {service.duration}</small></span>
                        <strong>{money(service.price)}</strong>
                      </button>
                    );
                  })}
                </div>
                <div className={styles.dialogFooter}>
                  <span>{selectedServices.length} selected<strong>Total: {money(bookingTotal)}</strong></span>
                  <button type="button" className={styles.primaryButton} disabled={!selectedServices.length} onClick={() => setStep(2)}>Choose date &amp; time <ArrowRight size={16} /></button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h3>Choose date</h3>
                <div className={styles.dateOptions}>
                  {dates.map((day, index) => <button key={day.fullLabel} type="button" className={dateIndex === index ? styles.dateSelected : ''} aria-pressed={dateIndex === index} onClick={() => { setDateIndex(index); setSelectedTime(''); }}>
                    <small>{day.dayName}</small><strong>{day.dateNum}</strong><small>{day.monthShort}</small>
                  </button>)}
                </div>
                <div className={styles.timeHeading}><h3>Select time slot</h3><span>Greyed slots are already booked</span></div>
                <div className={styles.timeOptions}>
                  {TIME_SLOTS.map((slot) => {
                    const available = availableTimes(bookingProvider).includes(slot);
                    return <button key={slot} type="button" disabled={!available} className={`${styles.timeOption} ${selectedTime === slot ? styles.timeSelected : ''}`} onClick={() => setSelectedTime(slot)}>{slot}</button>;
                  })}
                </div>
                <div className={styles.dialogFooter}>
                  <button type="button" className={styles.secondaryButton} onClick={() => setStep(1)}><ArrowLeft size={15} /> Back</button>
                  <button type="button" className={styles.primaryButton} disabled={!selectedTime} onClick={() => { setFormError(''); setStep(3); }}>Continue to details <ArrowRight size={16} /></button>
                </div>
              </>
            )}
            {step === 3 && selectedDay && (
              <>
                <div className={styles.summaryBox}><div><strong>{selectedDay.fullLabel} at {selectedTime}</strong><small>{selectedProviderServices.map((service) => service.name).join(', ')}</small></div><strong>{money(bookingTotal)}</strong></div>
                <div className={styles.formFields}>
                  <label>Full name <span>*</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="e.g., Ama Boateng" autoComplete="name" /></label>
                  <label>Phone number <span>*</span><input type="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="e.g., 024 123 4567" autoComplete="tel" /></label>
                  <label>Pre-arrival note <small>(Optional)</small><textarea rows={3} value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} placeholder={bookingProvider.notePlaceholder} /></label>
                  {formError && <p className={styles.formError} role="alert">{formError}</p>}
                </div>
                <div className={styles.dialogFooter}>
                  <button type="button" className={styles.secondaryButton} onClick={() => { setFormError(''); setStep(2); }}><ArrowLeft size={15} /> Back</button>
                  <button type="button" className={styles.primaryButton} onClick={confirmBooking}>Confirm &amp; get pass</button>
                </div>
              </>
            )}
            {step === 4 && createdBooking && (
              <div className={styles.confirmation}>
                <div className={styles.confirmIcon}><Check size={24} /></div>
                <h3>Appointment confirmed!</h3>
                <p>Show your digital queue pass when you arrive.</p>
                <div className={styles.digitalPass}>
                  <div className={styles.passHeader}><div><small>Digital queue pass</small><strong>#{createdBooking.id}</strong></div><button type="button" onClick={() => void copyBookingCode(createdBooking.id)}><Copy size={14} />Copy</button></div>
                  <div className={styles.passInfo}>
                    <Ticket size={38} aria-hidden="true" />
                    <div><strong>{createdBooking.providerName}</strong><span>{createdBooking.location}</span><b>{createdBooking.dateLabel} · {createdBooking.timeSlot}</b></div>
                  </div>
                  <div className={styles.passDetails}>
                    <p><span>Customer</span><strong>{createdBooking.customerName} · {createdBooking.customerPhone}</strong></p>
                    <p><span>Service(s)</span><strong>{createdBooking.services.map((service) => service.name).join(', ')}</strong></p>
                    {createdBooking.customerNote && <p><span>Note</span><strong>{createdBooking.customerNote}</strong></p>}
                    <p className={styles.payAtShop}><span>Pay at shop</span><strong>{money(createdBooking.totalPrice)}</strong></p>
                  </div>
                  <p className={styles.demoPassNote}>Demo pass code only — this preview does not generate a scannable QR code.</p>
                </div>
                <div className={styles.dialogFooter}>
                  <button type="button" className={styles.secondaryButton} onClick={closeBooking}>Done</button>
                  <button type="button" className={styles.primaryButton} onClick={() => { closeBooking(); setActiveTab('bookings'); }}>View my bookings <ArrowRight size={16} /></button>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      )}

      {cancelId && (
        <Dialog titleId="cancel-dialog-title" onClose={() => setCancelId(null)} className={styles.smallDialog}>
          <div className={styles.cancelContent}>
            <div className={styles.cancelIcon}><X size={22} /></div>
            <h2 id="cancel-dialog-title">Cancel appointment?</h2>
            <p>{cancelBookingDetails ? `Cancel your appointment at ${cancelBookingDetails.providerName} on ${cancelBookingDetails.dateLabel} (${cancelBookingDetails.timeSlot})?` : 'This booking will be cancelled.'}</p>
            <div className={styles.cancelActions}><button type="button" className={styles.secondaryButton} onClick={() => setCancelId(null)}>Keep booking</button><button type="button" className={styles.cancelButton} onClick={cancelBooking}>Yes, cancel</button></div>
          </div>
        </Dialog>
      )}

      {businessOpen && (
        <Dialog titleId="business-dialog-title" onClose={() => setBusinessOpen(false)} className={styles.businessDialog}>
          <div className={styles.businessHeader}><div><h2 id="business-dialog-title">Partner with BookLocal</h2><p>Accept advance bookings and manage customer queues</p></div><button type="button" onClick={() => setBusinessOpen(false)} aria-label="Close form"><X size={20} /></button></div>
          <form className={styles.businessForm} onSubmit={submitBusinessForm}>
            <label>Business name<input required name="businessName" placeholder="e.g., Royal Cuts or SwiftPrint Hub" /></label>
            <div className={styles.formRow}><label>Category<select name="category" defaultValue="Barbershop"><option>Barbershop</option><option>Beauty Salon</option><option>Laundry &amp; Dryclean</option><option>Printing Shop</option><option>Tailoring &amp; Repairs</option></select></label><label>Neighborhood<input required name="neighborhood" placeholder="e.g., UCC, Tantri" /></label></div>
            <label>Contact phone<input required type="tel" name="phone" placeholder="024 000 0000" /></label>
            <p className={styles.businessNote}><BadgeCheck size={16} /> Business application submission is a preview only and is not connected to a backend.</p>
            <button type="submit" className={styles.primaryButton}>Submit business application</button>
          </form>
        </Dialog>
      )}

      {toast && <div key={toast.id} className={`${styles.toast} ${styles[`toast_${toast.tone}`]}`} role="status">{toast.tone === 'success' ? <Check size={16} /> : <Clock3 size={16} />}{toast.message}</div>}
    </div>
  );
}
