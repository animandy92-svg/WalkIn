import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rulesPath = resolve(currentDir, '../../firestore.rules');
const projectId = process.env.GCLOUD_PROJECT ?? 'demo-walkin';

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: process.env.FIRESTORE_EMULATOR_HOST?.split(':')[0] ?? '127.0.0.1',
      port: Number(process.env.FIRESTORE_EMULATOR_HOST?.split(':')[1] ?? 8080),
      rules: readFileSync(rulesPath, 'utf8'),
    },
  });
});

after(async () => {
  await testEnv?.cleanup();
});

async function seedFixtures() {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await Promise.all([
      setDoc(doc(db, 'providers/p1'), {
        ownerId: 'owner1',
        name: 'Published Provider',
        slug: 'published',
        status: 'published',
      }),
      setDoc(doc(db, 'providers/p2'), {
        ownerId: 'owner2',
        name: 'Draft Provider',
        slug: 'draft',
        status: 'draft',
      }),
      setDoc(doc(db, 'providers/p1/staff/s1'), { active: true, name: 'Staff One' }),
      setDoc(doc(db, 'providers/p2/staff/s2'), { active: true, name: 'Staff Two' }),
      setDoc(doc(db, 'bookings/b1'), {
        customerId: 'customer1',
        providerId: 'p1',
        status: 'confirmed',
      }),
      setDoc(doc(db, 'users/customer1'), {
        uid: 'customer1',
        displayName: 'Customer One',
        email: 'customer1@walkin.test',
        fcmTokens: {},
        createdAt: 'seed-created',
      }),
    ]);
  });
}

function contextFor(uid, claims = {}) {
  return testEnv.authenticatedContext(uid, claims);
}

test('unauthenticated clients cannot read protected documents', async () => {
  await seedFixtures();
  const unauthenticated = testEnv.unauthenticatedContext();

  await assertSucceeds(getDoc(doc(unauthenticated.firestore(), 'providers/p1')));
  await assertFails(getDoc(doc(unauthenticated.firestore(), 'providers/p2')));
  await assertFails(getDoc(doc(unauthenticated.firestore(), 'bookings/b1')));
  await assertFails(getDoc(doc(unauthenticated.firestore(), 'users/customer1')));
});

test('customers see published providers and their own bookings only', async () => {
  await seedFixtures();
  const customer = contextFor('customer1');
  const otherCustomer = contextFor('customer2');

  await assertSucceeds(getDoc(doc(customer.firestore(), 'providers/p1')));
  await assertFails(getDoc(doc(customer.firestore(), 'providers/p2')));
  await assertSucceeds(getDoc(doc(customer.firestore(), 'bookings/b1')));
  await assertFails(getDoc(doc(otherCustomer.firestore(), 'bookings/b1')));
});

test('provider staff cannot read another provider’s private data', async () => {
  await seedFixtures();
  const owner1 = contextFor('owner1', { providerId: 'p1', role: 'owner' });
  const owner2 = contextFor('owner2', { providerId: 'p2', role: 'owner' });
  const admin = contextFor('admin1', { role: 'admin' });

  await assertSucceeds(getDoc(doc(owner1.firestore(), 'providers/p1/staff/s1')));
  await assertFails(getDoc(doc(owner1.firestore(), 'providers/p2/staff/s2')));
  await assertSucceeds(getDoc(doc(owner2.firestore(), 'providers/p2/staff/s2')));
  await assertSucceeds(getDoc(doc(admin.firestore(), 'providers/p2/staff/s2')));
  await assertSucceeds(getDoc(doc(admin.firestore(), 'bookings/b1')));
});

test('clients cannot write backend-owned collections', async () => {
  await seedFixtures();
  const customer = contextFor('customer1');
  const writes = [
    doc(customer.firestore(), 'providers/p1'),
    doc(customer.firestore(), 'providers/p1/services/s1'),
    doc(customer.firestore(), 'providers/p1/availability/r1'),
    doc(customer.firestore(), 'providers/p1/slotLocks/l1'),
    doc(customer.firestore(), 'bookings/b1'),
    doc(customer.firestore(), 'idempotencyKeys/k1'),
    doc(customer.firestore(), 'auditLogs/a1'),
    doc(customer.firestore(), 'notificationLogs/n1'),
  ];

  for (const ref of writes) {
    await assertFails(setDoc(ref, { touchedBy: 'customer1' }));
  }
});

test('users can manage their own profile but not roles or other users', async () => {
  await seedFixtures();
  const customer = contextFor('customer1');

  await assertSucceeds(setDoc(doc(customer.firestore(), 'users/customer1'), {
    uid: 'customer1',
    displayName: 'Customer One',
    email: 'customer1@walkin.test',
    fcmTokens: {},
    createdAt: 'seed-created',
  }));
  await assertFails(setDoc(doc(customer.firestore(), 'users/customer1'), {
    uid: 'customer1',
    role: 'admin',
  }));
  await assertFails(setDoc(doc(customer.firestore(), 'users/customer2'), {
    uid: 'customer2',
  }));
  await assertFails(setDoc(doc(customer.firestore(), 'users/customer1/private/x'), {
    value: 1,
  }));
});

test('admins can read audit and notification logs while customers cannot', async () => {
  await seedFixtures();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await Promise.all([
      setDoc(doc(db, 'auditLogs/a1'), { action: 'booking.created' }),
      setDoc(doc(db, 'notificationLogs/n1'), { window: '24h', status: 'sent' }),
    ]);
  });

  const admin = contextFor('admin1', { role: 'admin' });
  const customer = contextFor('customer1');

  await assertSucceeds(getDoc(doc(admin.firestore(), 'auditLogs/a1')));
  await assertSucceeds(getDoc(doc(admin.firestore(), 'notificationLogs/n1')));
  await assertFails(getDoc(doc(customer.firestore(), 'auditLogs/a1')));
  await assertFails(getDoc(doc(customer.firestore(), 'notificationLogs/n1')));

  const logs = await getDoc(doc(admin.firestore(), 'auditLogs/a1'));
  assert.equal(logs.data()?.action, 'booking.created');
});
