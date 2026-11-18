import { clearData, db, ensureUser, Timestamp } from './common.mjs';

export const CUSTOMER_COUNT = 20;
export const TARGET_DATE = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);

const bookingPolicy = {
  leadTimeMinutes: 0,
  cancelCutoffHours: 2,
  rescheduleCutoffHours: 2,
  pendingHoldMinutes: 30,
  defaultConcurrentSlots: 1,
};

export async function clearEmulatorData() {
  await clearData();
}

export async function seed() {
  await clearData();

  const providerRef = db.collection('providers').doc();
  const otherProviderRef = db.collection('providers').doc();

  const [owner, otherOwner] = await Promise.all([
    ensureUser('owner@walkin.test', { providerId: providerRef.id, role: 'owner' }),
    ensureUser('other-owner@walkin.test', { providerId: otherProviderRef.id, role: 'owner' }),
  ]);

  const customers = await Promise.all(
    Array.from({ length: CUSTOMER_COUNT }, (_, index) =>
      ensureUser(`customer${index}@walkin.test`, {})),
  );

  const now = Timestamp.now();
  await Promise.all([
    providerRef.set({
      ownerId: owner.uid,
      name: 'Demo WalkIn Provider',
      slug: 'demo-provider',
      description: 'Seeded provider for emulator verification.',
      timeZone: 'America/New_York',
      status: 'published',
      bookingPolicy,
      createdAt: now,
      updatedAt: now,
    }),
    otherProviderRef.set({
      ownerId: otherOwner.uid,
      name: 'Other Provider',
      slug: 'other-provider',
      description: 'Second provider used for access checks.',
      timeZone: 'America/New_York',
      status: 'published',
      bookingPolicy,
      createdAt: now,
      updatedAt: now,
    }),
  ]);

  const instantRef = providerRef.collection('services').doc();
  await instantRef.set({
    providerId: providerRef.id,
    name: 'Instant Service',
    description: 'Confirms immediately.',
    durationMinutes: 30,
    price: { amountCents: 2500, currency: 'USD' },
    confirmationMode: 'instant',
    capacityScope: 'provider',
    staffIds: ['__any__'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    active: true,
    createdAt: now,
    updatedAt: now,
  });

  const approvalRef = providerRef.collection('services').doc();
  await approvalRef.set({
    providerId: providerRef.id,
    name: 'Approval Service',
    description: 'Requires provider review.',
    durationMinutes: 30,
    price: { amountCents: 4000, currency: 'USD' },
    confirmationMode: 'approval',
    capacityScope: 'provider',
    staffIds: ['__any__'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    active: true,
    createdAt: now,
    updatedAt: now,
  });

  const staffRef = providerRef.collection('staff').doc();
  await staffRef.set({
    providerId: providerRef.id,
    name: 'Demo Staff',
    active: true,
    serviceIds: [instantRef.id, approvalRef.id],
    concurrentSlots: 1,
    createdAt: now,
    updatedAt: now,
  });

  const availabilityWrites = Array.from({ length: 7 }, (_, dayOfWeek) =>
    providerRef.collection('availability').doc().set({
      kind: 'weekly',
      dayOfWeek,
      startLocal: '09:00',
      endLocal: '17:00',
      createdAt: now,
      updatedAt: now,
    }));
  await Promise.all(availabilityWrites);

  return {
    providerId: providerRef.id,
    otherProviderId: otherProviderRef.id,
    instantServiceId: instantRef.id,
    approvalServiceId: approvalRef.id,
    staffId: staffRef.id,
    customerEmails: customers.map((customer) => customer.email),
    targetDate: TARGET_DATE,
  };
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/scripts/emulator/seed.mjs')) {
  seed()
    .then((result) => {
      console.log('Seeded emulator data:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
