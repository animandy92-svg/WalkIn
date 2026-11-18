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
import { doc, setDoc } from 'firebase/firestore';
import { getBytes, ref, uploadBytes } from 'firebase/storage';

const currentDir = dirname(fileURLToPath(import.meta.url));
const firestoreRulesPath = resolve(currentDir, '../../firestore.rules');
const storageRulesPath = resolve(currentDir, '../../storage.rules');
const projectId = process.env.GCLOUD_PROJECT ?? 'demo-walkin';
const bookingId = 'print-booking-1';
const filePath = `printJobs/customer-1/${bookingId}/document.pdf`;

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: process.env.FIRESTORE_EMULATOR_HOST?.split(':')[0] ?? '127.0.0.1',
      port: Number(process.env.FIRESTORE_EMULATOR_HOST?.split(':')[1] ?? 8180),
      rules: readFileSync(firestoreRulesPath, 'utf8'),
    },
    storage: {
      host: process.env.FIREBASE_STORAGE_EMULATOR_HOST?.split(':')[0] ?? '127.0.0.1',
      port: Number(process.env.FIREBASE_STORAGE_EMULATOR_HOST?.split(':')[1] ?? 9399),
      rules: readFileSync(storageRulesPath, 'utf8'),
    },
  });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), `bookings/${bookingId}`), {
      customerId: 'customer-1',
      providerId: 'provider-1',
      status: 'confirmed',
    });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test('print-job files are readable only by their customer and booking provider', async () => {
  const customerStorage = testEnv.authenticatedContext('customer-1').storage();
  const customerFile = ref(customerStorage, filePath);
  await assertSucceeds(uploadBytes(customerFile, new Uint8Array([37, 80, 68, 70]), {
    contentType: 'application/pdf',
  }));
  await assertSucceeds(getBytes(customerFile));

  const providerStorage = testEnv.authenticatedContext('provider-staff-1', {
    providerId: 'provider-1',
    role: 'staff',
  }).storage();
  await assertSucceeds(getBytes(ref(providerStorage, filePath)));

  const otherCustomerStorage = testEnv.authenticatedContext('customer-2').storage();
  await assertFails(getBytes(ref(otherCustomerStorage, filePath)));

  const otherProviderStorage = testEnv.authenticatedContext('provider-staff-2', {
    providerId: 'provider-2',
    role: 'owner',
  }).storage();
  await assertFails(getBytes(ref(otherProviderStorage, filePath)));

  await assertFails(getBytes(ref(testEnv.unauthenticatedContext().storage(), filePath)));
});

test('customers cannot write print files into another customer’s folder', async () => {
  const otherCustomerFile = ref(
    testEnv.authenticatedContext('customer-2').storage(),
    filePath,
  );
  await assertFails(uploadBytes(otherCustomerFile, new Uint8Array([37, 80, 68, 70]), {
    contentType: 'application/pdf',
  }));
});