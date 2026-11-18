import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';

export const region = process.env.FIREBASE_REGION ?? 'us-central1';
export const inEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

// App Check cannot be enforced by the emulator, so it is enabled for deployed code only.
export const enforceAppCheck = !inEmulator;

setGlobalOptions({
  region,
  maxInstances: 20,
});

if (getApps().length === 0) {
  initializeApp();
}

export const db = getFirestore();
// Configuration writes omit optional fields; Firestore must not reject undefined values.
db.settings({ ignoreUndefinedProperties: true });

// Contended slot locks need more than Firestore's default 5 attempts. With 20
// concurrent bookings the losing transactions must retry until they can read
// the committed lock and return SLOT_UNAVAILABLE instead of surfacing ABORTED.
export const TRANSACTION_OPTIONS = { maxAttempts: 30 } as const;
export const auth = getAuth();

/** Messaging is resolved lazily so pure unit tests can import domain modules. */
export function messages() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return import('firebase-admin/messaging').then((module) => module.getMessaging());
}
