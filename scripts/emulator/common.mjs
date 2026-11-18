import { deleteApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export const PROJECT_ID = process.env.GCLOUD_PROJECT ?? 'demo-walkin';
export const FUNCTIONS_URL = process.env.FUNCTIONS_EMULATOR_URL ?? 'http://127.0.0.1:5101';
export const AUTH_URL = process.env.AUTH_EMULATOR_URL ?? 'http://127.0.0.1:9198';
export const REGION = process.env.FIREBASE_REGION ?? 'us-central1';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8180';
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9198';
process.env.GCLOUD_PROJECT = PROJECT_ID;

if (getApps().length === 0) {
  initializeApp({ projectId: PROJECT_ID });
}

export const adminAuth = getAuth();
export const db = getFirestore();
export { Timestamp };

export async function closeAdmin() {
  await Promise.all(getApps().map((app) => deleteApp(app)));
}

export async function clearData() {
  const collections = [
    'providers', 'bookings', 'slotLocks', 'idempotencyKeys', 'notificationLogs', 'auditLogs',
  ];
  for (const name of collections) {
    const snapshot = await db.collection(name).get();
    if (snapshot.empty) continue;
    const batch = db.batch();
    for (const doc of snapshot.docs) batch.delete(doc.ref);
    await batch.commit();
  }
}

export async function ensureUser(email, claims = {}) {
  const password = 'password123';
  let user;

  try {
    user = await adminAuth.getUserByEmail(email);
  } catch (error) {
    if (error?.code !== 'auth/user-not-found') throw error;
    user = await adminAuth.createUser({
      email,
      password,
      displayName: email.split('@')[0],
      emailVerified: true,
    });
  }

  await adminAuth.setCustomUserClaims(user.uid, claims);
  await db.collection('users').doc(user.uid).set({
    uid: user.uid,
    displayName: email.split('@')[0],
    email,
    fcmTokens: {},
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    ...claims,
  }, { merge: true });

  return user;
}

export async function signIn(email, password = 'password123') {
  const response = await fetch(
    `${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      signal: AbortSignal.timeout(30_000),
    },
  );
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Unable to sign in ${email}: ${body?.error?.message ?? response.status}`);
  }
  return body.idToken;
}

export async function callFunction(name, data, idToken) {
  const url = `${FUNCTIONS_URL}/${PROJECT_ID}/${REGION}/${name}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(idToken ? { authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify({ data }),
    signal: AbortSignal.timeout(180_000),
  });
  const body = await response.json();

  if (body?.error) {
    const error = new Error(body.error.message ?? 'Callable request failed');
    error.code = body.error.details?.code ?? body.error.status;
    error.status = body.error.status;
    error.raw = body.error;
    throw error;
  }

  return body.result;
}

/** Invoke a v2 scheduled function through its emulator HTTP endpoint. */
export async function runScheduled(name) {
  // v2 scheduled functions are deployed as HTTP functions with an emulator
  // instance suffix (e.g. expirePendingHolds-0).
  for (const functionName of [name, `${name}-0`]) {
    const url = `${FUNCTIONS_URL}/${PROJECT_ID}/${REGION}/${functionName}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-cloudscheduler-jobname': name,
        'x-cloudscheduler-scheduletime': new Date().toISOString(),
      },
      body: '{}',
      signal: AbortSignal.timeout(180_000),
    });
    if (response.ok) return;
    if (response.status !== 404) {
      throw new Error(`Scheduled function ${functionName} failed: ${response.status} ${await response.text()}`);
    }
  }
  throw new Error(`Scheduled function ${name} was not found in the emulator`);
}
