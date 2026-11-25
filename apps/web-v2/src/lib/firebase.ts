import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

// Placeholders keep static prerendering possible before .env.local is filled in.
// Real deployments must provide every NEXT_PUBLIC_FIREBASE_* value.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'demo-web-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'demo-walkin.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'demo-walkin',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'demo-walkin.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:000000000000:web:0000000000000000000000',
};

export const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

if (!useEmulators && typeof window !== 'undefined') {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }
}

export const auth = getAuth(app);
export const storage = getStorage(app);
export const functionsRegion = process.env.NEXT_PUBLIC_FUNCTIONS_REGION ?? 'us-central1';
export const functions = getFunctions(app, functionsRegion);

let emulatorsConnected = false;

function connectEmulators(): void {
  if (emulatorsConnected || !useEmulators) return;
  emulatorsConnected = true;
  connectAuthEmulator(
    auth,
    process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL ?? 'http://127.0.0.1:9099',
    { disableWarnings: true },
  );
  connectFunctionsEmulator(
    functions,
    process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST ?? '127.0.0.1',
    Number(process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT ?? 5001),
  );
  connectStorageEmulator(
    storage,
    process.env.NEXT_PUBLIC_STORAGE_EMULATOR_HOST ?? '127.0.0.1',
    Number(process.env.NEXT_PUBLIC_STORAGE_EMULATOR_PORT ?? 9199),
  );
}

connectEmulators();
