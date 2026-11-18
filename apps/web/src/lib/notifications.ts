import { getMessaging, getToken } from 'firebase/messaging';
import { api } from './api';
import { app, firebaseConfig, useEmulators } from './firebase';

const TOKEN_KEY = 'walkin-fcm-token';

export function notificationsSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    !useEmulators &&
    'serviceWorker' in navigator &&
    'Notification' in window
  );
}

export function storedFcmToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearStoredFcmToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/** Call while the user is still signed in so the backend can delete the token. */
export async function disableNotifications(): Promise<void> {
  const token = storedFcmToken();
  if (!token) return;
  try {
    await api.removeFcmToken({ token });
  } catch {
    // The local token is still cleared; an expired callable token must not block sign-out.
  } finally {
    clearStoredFcmToken();
  }
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(firebaseConfig)) {
    if (value) params.set(key, value);
  }
  return navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params.toString()}`);
}

/** Must be called from a user gesture so the browser can show the permission prompt. */
export async function enableNotifications(): Promise<string> {
  if (!notificationsSupported()) {
    throw new Error('Push notifications are not supported in this environment.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    throw new Error('NEXT_PUBLIC_FIREBASE_VAPID_KEY is not configured.');
  }

  const registration = await registerServiceWorker();
  const token = await getToken(getMessaging(app), { vapidKey, serviceWorkerRegistration: registration });
  window.localStorage.setItem(TOKEN_KEY, token);
  return token;
}
