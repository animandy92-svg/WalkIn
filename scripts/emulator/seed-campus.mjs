// Campus demo seed for the local Firebase emulators (synthetic data only).
// Run from the repo root while `npm run emulators` is up: `npm run emulator:seed:campus`.
// It WIPES the emulator's Firestore first. Defaults target the dev emulator ports (firebase.json).
import { randomUUID } from 'node:crypto';
import { getStorage } from 'firebase-admin/storage';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';
process.env.FUNCTIONS_EMULATOR_URL ??= 'http://127.0.0.1:5001';
process.env.AUTH_EMULATOR_URL ??= 'http://127.0.0.1:9099';
process.env.STORAGE_EMULATOR_HOST ??= '127.0.0.1:9199';
process.env.GCLOUD_PROJECT ??= 'demo-walkin';

// common.mjs reads the env at import time, so load it after the defaults above.
const {
  PROJECT_ID, callFunction, db, ensureUser, signIn, Timestamp, closeAdmin,
} = await import('./common.mjs');

if (!PROJECT_ID.startsWith('demo-')) {
  throw new Error(`Refusing to seed "${PROJECT_ID}": the campus seed only runs against a demo-* emulator project.`);
}

const FIRESTORE_HOST = process.env.FIRESTORE_EMULATOR_HOST;
const STORAGE_HOST = (process.env.STORAGE_EMULATOR_HOST ?? '127.0.0.1:9199').replace('http://', '');
const BUCKET = `${PROJECT_ID}.appspot.com`;
const ZONE = 'Africa/Accra'; // UTC+0, so local HH:mm equals UTC HH:mm

const policy = (slots) => ({
  leadTimeMinutes: 30, cancelCutoffHours: 2, rescheduleCutoffHours: 2,
  pendingHoldMinutes: 720, defaultConcurrentSlots: slots,
});

// dayOfWeek convention (weekdayForDate): Sunday = 0, Monday = 1 ... Saturday = 6.
const MONSAT = [1, 2, 3, 4, 5, 6];

// ---------- Shop definitions ----------
const svc = (name, durationMinutes, ghs, o = {}) => ({
  name, durationMinutes, priceCents: ghs * 100, ...o,
});

const SHOPS = [
  {
    slug: 'sharp-lines', name: 'Sharp Lines Barbering Shop', vertical: 'barbershop', owner: 'barber@walkin.test',
    description: 'Fresh fades and clean line-ups for students, right by the hall.',
    line1: 'Hall 3 Junction', city: 'Hall 3 Junction', slots: 1, scope: 'staff', type: 'appointment', mode: 'instant',
    staff: ['Kojo', 'Yaw', 'Ebo'],
    hours: [[MONSAT, '08:00', '21:00'], [[0], '13:00', '19:00']],
    services: [svc('Haircut', 30, 35, { ba: 5 }), svc('Haircut + shave', 45, 50, { ba: 5 }), svc('Kids cut', 30, 25, { ba: 5 })],
  },
  {
    slug: 'gods-time-barbers', name: "God's Time Barbers", vertical: 'barbershop', owner: 'gods-time-barbers@walkin.test',
    description: 'Neat cuts and beard work with no long queues on market row.',
    line1: 'Night Market Row', city: 'Night Market Row', slots: 1, scope: 'staff', type: 'appointment', mode: 'instant',
    staff: ['Fiifi', 'Selasi'],
    hours: [[MONSAT, '08:00', '21:00'], [[0], '13:00', '19:00']],
    services: [svc('Haircut', 30, 35, { ba: 5 }), svc('Haircut + shave', 45, 50, { ba: 5 }), svc('Beard trim', 20, 20), svc('Kids cut', 30, 25, { ba: 5 })],
  },
  {
    slug: 'blessed-hands', name: 'Blessed Hands Beauty Salon', vertical: 'salon', owner: 'salon@walkin.test',
    description: 'Braids, wash and set, and nail care in a calm space behind the library.',
    line1: 'Behind the Main Library', city: 'Behind the Main Library', slots: 1, scope: 'staff', type: 'appointment', mode: 'instant',
    staff: ['Adwoa', 'Efua'],
    hours: [[MONSAT, '08:00', '20:00'], [[0], '13:00', '19:00']],
    services: [
      svc('Knotless braids', 180, 250, { mode: 'approval', ba: 10 }),
      svc('Wash & set', 60, 80, { ba: 5 }),
      svc('Manicure', 45, 60, { ba: 5 }),
      svc('Pedicure', 60, 70, { ba: 5 }),
    ],
  },
  {
    slug: 'adwoas-braids', name: "Adwoa's Braids & Nails", vertical: 'salon', owner: 'adwoas-braids@walkin.test',
    description: 'Cornrows, braids and quick nail appointments between lectures.',
    line1: 'Commercial Area, Shop 12', city: 'Commercial Area', slots: 1, scope: 'staff', type: 'appointment', mode: 'instant',
    staff: ['Akua', 'Dzifa'],
    hours: [[MONSAT, '08:00', '20:00'], [[0], '13:00', '19:00']],
    services: [
      svc('Knotless braids', 180, 250, { mode: 'approval', ba: 10 }),
      svc('Cornrows', 90, 120, { mode: 'approval', ba: 5 }),
      svc('Manicure', 45, 60, { ba: 5 }),
      svc('Pedicure', 60, 70, { ba: 5 }),
    ],
  },
  {
    slug: 'bubbles-wash-bay', name: 'Bubbles Wash Bay', vertical: 'laundry', owner: 'laundry@walkin.test',
    description: 'Drop off your laundry and pick it up clean the same week.',
    line1: 'Hall 5 Annex', city: 'Hall 5 Annex', slots: 4, scope: 'provider', type: 'drop_off', mode: 'instant',
    staff: ['Counter'],
    hours: [[MONSAT, '07:00', '18:00']],
    services: [svc('Wash & fold drop-off', 30, 45), svc('Dry cleaning drop-off', 30, 60), svc('Ironing only drop-off', 30, 30)],
  },
  {
    slug: 'nanas-dry-cleaners', name: "Nana's Dry Cleaners", vertical: 'laundry', owner: 'nanas-dry-cleaners@walkin.test',
    description: 'Careful dry cleaning and ironing for shirts, suits and kente.',
    line1: 'Bus Stop Junction', city: 'Bus Stop Junction', slots: 4, scope: 'provider', type: 'drop_off', mode: 'instant',
    staff: ['Counter'],
    hours: [[MONSAT, '07:00', '18:00']],
    services: [svc('Wash & fold drop-off', 30, 45), svc('Dry cleaning drop-off', 30, 60), svc('Ironing only drop-off', 30, 30)],
  },
  {
    slug: 'kopy-kiosk', name: 'Kopy Kiosk Printing & Binding', vertical: 'printing', owner: 'owner@walkin.test',
    description: 'Fast printing, copying and binding for assignments and projects.',
    line1: 'Science Block Road', city: 'Science Block Road', slots: 3, scope: 'provider', type: 'print_job', mode: 'approval',
    staff: ['Counter'],
    hours: [[[1, 2, 3, 4, 5], '07:30', '21:00'], [[6], '09:00', '17:00']],
    services: [svc('Print job — black & white', 30, 15), svc('Print job — colour', 30, 40), svc('Spiral binding', 30, 25), svc('Project thesis bind', 60, 120)],
  },
  {
    slug: 'deadline-print', name: 'Deadline Print Centre', vertical: 'printing', owner: 'deadline-print@walkin.test',
    description: 'Last-minute printing and thesis binding close to the lecture halls.',
    line1: 'Commercial Area, Shop 12', city: 'Commercial Area', slots: 3, scope: 'provider', type: 'print_job', mode: 'approval',
    staff: ['Counter'],
    hours: [[[1, 2, 3, 4, 5], '07:30', '21:00'], [[6], '09:00', '17:00']],
    services: [svc('Print job — black & white', 30, 15), svc('Print job — colour', 30, 40), svc('Spiral binding', 30, 25), svc('Project thesis bind', 60, 120)],
  },
  {
    slug: 'unity-tailoring', name: 'Unity Tailoring', vertical: 'general', owner: 'unity-tailoring@walkin.test',
    description: 'Alterations and tailoring for everyday wear and graduation outfits.',
    line1: 'Night Market Row', city: 'Night Market Row', slots: 1, scope: 'staff', type: 'appointment', mode: 'approval',
    staff: ['Auntie Esi'],
    hours: [[MONSAT, '09:00', '18:00']],
    services: [svc('Measurement & fitting', 30, 20, { ba: 5 }), svc('Alterations drop-off', 30, 30, { type: 'drop_off' })],
  },
];

const CUSTOMERS = ['ama', 'kofi', 'esi', 'yaw', 'abena', 'kwame', 'akosua', 'kojo'].map((n) => `${n}@walkin.test`);

// ---------- Helpers ----------
const dayKey = (offset) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);

async function wipeFirestore() {
  const res = await fetch(`http://${FIRESTORE_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Firestore wipe failed: ${res.status}`);
}

const pdfBody = (title) => {
  const text = `BT /F1 18 Tf 72 720 Td (${title.replace(/[()\\]/g, '')}) Tj ET`;
  return `%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length ${text.length}>>stream\n${text}\nendstream endobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n`;
};

let storageWorks = true;
async function uploadPdf(uid, name) {
  const dlToken = randomUUID(); // download token lets the URL resolve without auth (rules restrict raw reads)
  const path = `printJobs/${uid}/${randomUUID()}/${name}.pdf`;
  const url = `http://${STORAGE_HOST}/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${dlToken}`;
  if (storageWorks) {
    try {
      process.env.STORAGE_EMULATOR_HOST = `http://${STORAGE_HOST}`;
      await getStorage().bucket(BUCKET).file(path).save(Buffer.from(pdfBody(name)), {
        contentType: 'application/pdf', resumable: false, metadata: { metadata: { firebaseStorageDownloadTokens: dlToken } },
      });
      const check = await fetch(url);
      if (check.ok) return { url, stored: true };
      storageWorks = false;
    } catch (error) {
      storageWorks = false;
      console.warn('Storage upload failed, falling back to example.com URLs:', error.message);
    }
  }
  return { url: `https://example.com/demo/${name}.pdf`, stored: false };
}

// ---------- Main ----------
const ctx = { shops: {}, tokens: {}, uploads: { stored: 0, fallback: 0 }, created: [], failures: [] };

async function token(email) {
  return (ctx.tokens[email] ??= await signIn(email));
}

async function seedShops() {
  const now = Timestamp.now();
  for (const shop of SHOPS) {
    const ref = db.collection('providers').doc();
    const owner = await ensureUser(shop.owner, { providerId: ref.id, role: 'owner' });
    await ref.set({
      ownerId: owner.uid, name: shop.name, slug: shop.slug, description: shop.description,
      timeZone: ZONE, status: 'published', vertical: shop.vertical,
      address: { line1: shop.line1, city: shop.city, country: 'GH' },
      bookingPolicy: policy(shop.slots), createdAt: now, updatedAt: now,
    });
    const staffRefs = shop.staff.map(() => ref.collection('staff').doc());
    const serviceRefs = shop.services.map(() => ref.collection('services').doc());
    const staffIdsForService = shop.scope === 'provider' ? ['__any__'] : staffRefs.map((r) => r.id);
    await Promise.all([
      ...staffRefs.map((s, i) => s.set({
        providerId: ref.id, name: shop.staff[i], active: true,
        serviceIds: serviceRefs.map((r) => r.id), concurrentSlots: 1, createdAt: now, updatedAt: now,
      })),
      ...serviceRefs.map((s, i) => {
        const d = shop.services[i];
        return s.set({
          providerId: ref.id, name: d.name, description: `${d.name} (${d.durationMinutes} min).`,
          durationMinutes: d.durationMinutes, price: { amountCents: d.priceCents, currency: 'GHS' },
          confirmationMode: d.mode ?? shop.mode, capacityScope: shop.scope, staffIds: staffIdsForService,
          bufferBeforeMinutes: d.bb ?? 0, bufferAfterMinutes: d.ba ?? 0, active: true,
          serviceType: d.type ?? shop.type, createdAt: now, updatedAt: now,
        });
      }),
      ...shop.hours.flatMap(([days, startLocal, endLocal]) => days.map((dayOfWeek) =>
        ref.collection('availability').doc().set({ kind: 'weekly', dayOfWeek, startLocal, endLocal, createdAt: now, updatedAt: now }))),
    ]);
    ctx.shops[shop.slug] = {
      id: ref.id, def: shop,
      services: Object.fromEntries(shop.services.map((d, i) => [d.name, serviceRefs[i].id])),
      staff: Object.fromEntries(shop.staff.map((n, i) => [n, staffRefs[i].id])),
    };
  }
}

/** Book through the callable at the first open slot at/after `time` (HH:mm, local == UTC) on today + day. */
async function book({ who, slug, service, day, time, note, verticalData, upload, tag }) {
  const shop = ctx.shops[slug];
  const serviceId = shop.services[service];
  if (!serviceId) throw new Error(`No service ${service} at ${slug}`);
  const tok = await token(who);
  const date = dayKey(day);
  const { slots } = await callFunction('getAvailability', { providerId: shop.id, serviceId, date }, tok);
  const target = Date.parse(`${date}T${time}:00Z`);
  const slot = slots.find((s) => Date.parse(s.startUtc) >= target);
  if (!slot) { ctx.failures.push(`no slot ${slug} ${service} ${date} ${time}`); return null; }
  let vd = verticalData;
  if (upload) {
    const uid = (await db.collection('users').where('email', '==', who).get()).docs[0].id;
    const up = await uploadPdf(uid, upload);
    ctx.uploads[up.stored ? 'stored' : 'fallback']++;
    vd = { printJob: { ...verticalData.printJob, fileUrls: [up.url] } };
  }
  try {
    const { booking } = await callFunction('createBooking', {
      providerId: shop.id, serviceId, ...(slot.staffId ? { staffId: slot.staffId } : {}),
      startUtc: slot.startUtc, idempotencyKey: randomUUID(), source: 'web',
      ...(note ? { note } : {}), ...(vd ? { verticalData: vd } : {}),
    }, tok);
    const rec = { booking, slug, who, tag };
    ctx.created.push(rec);
    return rec;
  } catch (error) {
    ctx.failures.push(`createBooking ${slug} ${service} ${date} ${time}: ${error.code ?? ''} ${error.message}`);
    return null;
  }
}

const print = (colorMode, paperSize, finish, copies, notes) => ({ printJob: { colorMode, paperSize, finish, copies, notes } });
const laundry = (serviceCategory, bagCount, estimatedWeightKg, specialInstructions) => ({
  laundryJob: { serviceCategory, bagCount, estimatedWeightKg, ...(specialInstructions ? { specialInstructions } : {}) },
});

const BW = 'Print job — black & white';
const COL = 'Print job — colour';

async function seedBookings() {
  const plan = [
    // Barbers: Sharp Lines (3 staff; 11:00 today is saturated to create a visible gap)
    { who: 'kofi@walkin.test', slug: 'sharp-lines', service: 'Haircut', day: 0, time: '10:00', note: 'Low fade please' },
    { who: 'yaw@walkin.test', slug: 'sharp-lines', service: 'Haircut', day: 0, time: '11:00' },
    { who: 'kwame@walkin.test', slug: 'sharp-lines', service: 'Haircut', day: 0, time: '11:00', note: 'Same as last time' },
    { who: 'kojo@walkin.test', slug: 'sharp-lines', service: 'Haircut', day: 0, time: '11:00' },
    { who: 'esi@walkin.test', slug: 'sharp-lines', service: 'Kids cut', day: 0, time: '12:00', note: 'For my little brother' },
    { who: 'akosua@walkin.test', slug: 'sharp-lines', service: 'Haircut + shave', day: 0, time: '16:00' },
    { who: 'abena@walkin.test', slug: 'sharp-lines', service: 'Haircut', day: 0, time: '17:00' },
    { who: 'ama@walkin.test', slug: 'sharp-lines', service: 'Haircut', day: 1, time: '11:00', note: 'Taper, not too short', tag: 'ama-barber' },
    { who: 'kofi@walkin.test', slug: 'sharp-lines', service: 'Haircut + shave', day: 1, time: '11:00' },
    { who: 'yaw@walkin.test', slug: 'sharp-lines', service: 'Haircut', day: 1, time: '17:30' },
    { who: 'kwame@walkin.test', slug: 'sharp-lines', service: 'Haircut', day: 2, time: '10:30' },
    // Barbers: God's Time
    { who: 'kojo@walkin.test', slug: 'gods-time-barbers', service: 'Haircut', day: 0, time: '10:00' },
    { who: 'abena@walkin.test', slug: 'gods-time-barbers', service: 'Beard trim', day: 0, time: '16:30' },
    { who: 'yaw@walkin.test', slug: 'gods-time-barbers', service: 'Haircut + shave', day: 1, time: '12:00' },
    { who: 'esi@walkin.test', slug: 'gods-time-barbers', service: 'Haircut', day: 2, time: '18:00' },
    // Salons
    { who: 'esi@walkin.test', slug: 'blessed-hands', service: 'Wash & set', day: 0, time: '10:00' },
    { who: 'abena@walkin.test', slug: 'blessed-hands', service: 'Manicure', day: 0, time: '11:00', note: 'Short square nails' },
    { who: 'akosua@walkin.test', slug: 'blessed-hands', service: 'Knotless braids', day: 1, time: '10:00', note: 'Medium length, black' },
    { who: 'ama@walkin.test', slug: 'blessed-hands', service: 'Pedicure', day: 1, time: '16:00' },
    { who: 'kofi@walkin.test', slug: 'blessed-hands', service: 'Wash & set', day: 2, time: '17:00' },
    { who: 'ama@walkin.test', slug: 'adwoas-braids', service: 'Cornrows', day: 2, time: '10:00', note: 'Straight back' },
    { who: 'esi@walkin.test', slug: 'adwoas-braids', service: 'Manicure', day: 0, time: '17:00' },
    { who: 'abena@walkin.test', slug: 'adwoas-braids', service: 'Knotless braids', day: 1, time: '11:00', note: 'Please text before starting' },
    { who: 'akosua@walkin.test', slug: 'adwoas-braids', service: 'Pedicure', day: 1, time: '17:00' },
    // Laundry (capacity 4 per window)
    { who: 'ama@walkin.test', slug: 'bubbles-wash-bay', service: 'Wash & fold drop-off', day: 0, time: '09:00', note: 'Will drop it off before lectures', verticalData: laundry('wash_and_fold', 2, 5, 'Wash colours separately'), tag: 'ama-laundry' },
    { who: 'kofi@walkin.test', slug: 'bubbles-wash-bay', service: 'Wash & fold drop-off', day: 0, time: '09:00', verticalData: laundry('wash_and_fold', 1, 3) },
    { who: 'kwame@walkin.test', slug: 'bubbles-wash-bay', service: 'Ironing only drop-off', day: 0, time: '09:00', verticalData: laundry('ironing_only', 1, 2, 'Starch the white shirts') },
    { who: 'yaw@walkin.test', slug: 'bubbles-wash-bay', service: 'Wash & fold drop-off', day: 1, time: '08:00', verticalData: laundry('wash_and_fold', 3, 7, 'Fragile fabrics in the blue bag') },
    { who: 'abena@walkin.test', slug: 'bubbles-wash-bay', service: 'Dry cleaning drop-off', day: 1, time: '12:00', verticalData: laundry('dry_cleaning', 1, 2, 'Graduation suit, handle with care') },
    { who: 'esi@walkin.test', slug: 'nanas-dry-cleaners', service: 'Dry cleaning drop-off', day: 0, time: '10:00', verticalData: laundry('dry_cleaning', 1, 2) },
    { who: 'akosua@walkin.test', slug: 'nanas-dry-cleaners', service: 'Ironing only drop-off', day: 1, time: '10:00', verticalData: laundry('ironing_only', 2, 3) },
    { who: 'kojo@walkin.test', slug: 'nanas-dry-cleaners', service: 'Wash & fold drop-off', day: 2, time: '09:00', verticalData: laundry('wash_and_fold', 2, 6) },
    // Printing: Kopy Kiosk (approval; 4 get confirmed, the rest stay pending)
    { who: 'kofi@walkin.test', slug: 'kopy-kiosk', service: BW, day: 0, time: '08:00', note: 'Please staple', upload: 'lab-report', verticalData: print('black_and_white', 'A4', 'stapled', 2, 'Lab report — needed by 10am'), tag: 'kopy-confirm' },
    { who: 'esi@walkin.test', slug: 'kopy-kiosk', service: COL, day: 0, time: '09:00', upload: 'poster-draft', verticalData: print('color', 'A3', 'none', 1, 'Group poster presentation'), tag: 'kopy-confirm' },
    { who: 'yaw@walkin.test', slug: 'kopy-kiosk', service: 'Spiral binding', day: 0, time: '12:00', upload: 'case-study', verticalData: print('black_and_white', 'A4', 'spiral_bound', 1, 'Case study — due 4pm'), tag: 'kopy-confirm' },
    { who: 'abena@walkin.test', slug: 'kopy-kiosk', service: BW, day: 1, time: '09:00', upload: 'assignment-1', verticalData: print('black_and_white', 'A4', 'none', 3, 'Assignment 1'), tag: 'kopy-confirm' },
    { who: 'ama@walkin.test', slug: 'kopy-kiosk', service: BW, day: 1, time: '10:00', note: 'Will pick up after lecture', upload: 'assignment-2', verticalData: print('black_and_white', 'A4', 'stapled', 1, 'Assignment 2 — due 4pm'), tag: 'ama-print' },
    { who: 'kwame@walkin.test', slug: 'kopy-kiosk', service: 'Project thesis bind', day: 1, time: '11:00', upload: 'thesis-final', verticalData: print('black_and_white', 'A4', 'spiral_bound', 2, 'Final year thesis, two copies') },
    { who: 'akosua@walkin.test', slug: 'kopy-kiosk', service: COL, day: 1, time: '14:00', upload: 'lookbook', verticalData: print('color', 'A4', 'laminated', 1, 'Portfolio pages, laminate please') },
    { who: 'kojo@walkin.test', slug: 'kopy-kiosk', service: BW, day: 0, time: '16:00', upload: 'tutorial-sheet', verticalData: print('black_and_white', 'A4', 'none', 5, 'Tutorial sheets for study group') },
    { who: 'esi@walkin.test', slug: 'kopy-kiosk', service: 'Spiral binding', day: 2, time: '09:00', upload: 'seminar-notes', verticalData: print('black_and_white', 'A4', 'spiral_bound', 1, 'Seminar notes') },
    // Printing: Deadline Print Centre
    { who: 'kojo@walkin.test', slug: 'deadline-print', service: COL, day: 0, time: '11:00', upload: 'slides-handout', verticalData: print('color', 'A4', 'none', 10, 'Presentation handouts'), tag: 'deadline-reject' },
    { who: 'yaw@walkin.test', slug: 'deadline-print', service: BW, day: 0, time: '14:00', upload: 'quiz-prep', verticalData: print('black_and_white', 'A4', 'stapled', 2, 'Quiz prep — due 4pm') },
    { who: 'kwame@walkin.test', slug: 'deadline-print', service: 'Project thesis bind', day: 1, time: '10:00', upload: 'project-report', verticalData: print('black_and_white', 'A4', 'spiral_bound', 3, 'Project report, three copies') },
    // Tailoring
    { who: 'abena@walkin.test', slug: 'unity-tailoring', service: 'Measurement & fitting', day: 1, time: '10:00', note: 'Kaba and slit for graduation' },
    { who: 'ama@walkin.test', slug: 'unity-tailoring', service: 'Alterations drop-off', day: 2, time: '11:00', note: 'Take in the waist' },
  ];
  for (const item of plan) await book(item);

  // Owner responses
  const kopyToken = await token('owner@walkin.test');
  for (const rec of ctx.created.filter((r) => r.tag === 'kopy-confirm')) {
    const { booking } = await callFunction('respondToBooking', { bookingId: rec.booking.id, action: 'confirm' }, kopyToken);
    rec.booking = booking;
  }
  const dl = ctx.created.find((r) => r.tag === 'deadline-reject');
  if (dl) {
    const { booking } = await callFunction('respondToBooking', { bookingId: dl.booking.id, action: 'reject' }, await token('deadline-print@walkin.test'));
    dl.booking = booking;
  }
}

async function seedPast(amaUid) {
  const shop = ctx.shops['sharp-lines'];
  const serviceId = shop.services['Haircut'];
  const staffId = shop.staff['Kojo'];
  const mk = (daysAgo, hh, status, extra, timeline) => {
    const ref = db.collection('bookings').doc();
    const start = Date.parse(`${dayKey(-daysAgo)}T${hh}:00Z`);
    const created = Timestamp.fromMillis(start - 3 * 86_400_000);
    return ref.set({
      id: ref.id, providerId: shop.id, serviceId, staffId, customerId: amaUid,
      startUtc: Timestamp.fromMillis(start), endUtc: Timestamp.fromMillis(start + 30 * 60_000),
      providerTimeZone: ZONE, slotKeys: [], status, confirmationMode: 'instant',
      priceSnapshot: { amountCents: 3500, currency: 'GHS', serviceName: 'Haircut', durationMinutes: 30 },
      holdExpiresAt: null, source: 'web', idempotencyKey: randomUUID(),
      timeline: [{ status: 'created', at: created, actor: amaUid }, ...timeline(start)],
      createdAt: created, updatedAt: Timestamp.fromMillis(start + 30 * 60_000), ...extra,
    });
  };
  await mk(4, '14:00', 'completed', { customerNote: 'Usual cut' }, (s) => [
    { status: 'confirmed', at: Timestamp.fromMillis(s - 3 * 86_400_000), actor: 'system' },
    { status: 'completed', at: Timestamp.fromMillis(s + 30 * 60_000), actor: 'barber@walkin.test' },
  ]);
  const cancelAt = Timestamp.fromMillis(Date.parse(`${dayKey(-7)}T09:00:00Z`));
  await mk(7, '17:00', 'cancelled', { cancelledAt: cancelAt, cancellationReason: 'Clashed with a lecture' }, (s) => [
    { status: 'confirmed', at: Timestamp.fromMillis(s - 3 * 86_400_000), actor: 'system' },
    { status: 'cancelled', at: cancelAt, actor: amaUid },
  ]);
}

async function verify() {
  const out = {};
  const ama = await token('ama@walkin.test');
  const list = await callFunction('listPublishedProviders', {}, ama);
  out.listPublishedProviders = list.providers.length;
  const kk = ctx.shops['kopy-kiosk'];
  const details = await callFunction('getProviderDetails', { slug: 'kopy-kiosk' }, ama);
  out.kopyServices = details.services.map((s) => `${s.name} ${s.price.amountCents / 100} ${s.price.currency}`);
  const sl = ctx.shops['sharp-lines'];
  const av = await callFunction('getAvailability', { providerId: sl.id, serviceId: sl.services['Haircut'], date: dayKey(0) }, ama);
  out.sharpLinesHaircutToday = {
    openSlotEntries: av.slots.length,
    entriesAt11_00: av.slots.filter((s) => s.startUtc.includes('T11:00')).length,
    entriesAt10_00: av.slots.filter((s) => s.startUtc.includes('T10:00')).length,
    sample: av.slots.slice(0, 3).map((s) => s.localLabel),
  };
  const mine = await callFunction('getMyBookings', {}, ama);
  out.amaBookings = mine.bookings.map((b) => `${b.priceSnapshot.serviceName} ${b.startUtc} ${b.status}`);
  const dash = await callFunction('getProviderDashboard', { providerId: kk.id }, await token('owner@walkin.test'));
  out.kopyDashboard = dash.bookings.reduce((m, b) => ((m[b.status] = (m[b.status] ?? 0) + 1), m), {});
  return out;
}

async function main() {
  console.log('Wiping Firestore...');
  await wipeFirestore();
  await seedShops();
  const custUsers = [];
  for (const email of CUSTOMERS) custUsers.push(await ensureUser(email, {}));
  const amaUid = custUsers[0].uid;
  await seedBookings();
  await seedPast(amaUid);

  const snap = await db.collection('bookings').get();
  const bySlug = {};
  const idToSlug = Object.fromEntries(Object.entries(ctx.shops).map(([s, v]) => [v.id, s]));
  for (const d of snap.docs) {
    const b = d.data();
    const slug = idToSlug[b.providerId];
    bySlug[slug] ??= {};
    bySlug[slug][b.status] = (bySlug[slug][b.status] ?? 0) + 1;
  }
  const verification = await verify();
  console.log(JSON.stringify({
    shops: SHOPS.map((s) => ({ slug: s.slug, owner: s.owner, providerId: ctx.shops[s.slug].id })),
    customers: CUSTOMERS,
    password: 'password123',
    totalBookings: snap.size,
    bookingsByStatusPerShop: bySlug,
    printUploads: ctx.uploads,
    failures: ctx.failures,
    verification,
  }, null, 2));
}

main().then(() => closeAdmin()).catch((e) => { console.error(e); process.exitCode = 1; closeAdmin(); });
