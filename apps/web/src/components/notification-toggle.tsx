'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { auth } from '@/lib/firebase';
import {
  clearStoredFcmToken,
  enableNotifications,
  notificationsSupported,
  storedFcmToken,
} from '@/lib/notifications';

export function NotificationToggle() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(notificationsSupported());
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setEnabled(Boolean(storedFcmToken()));
        return;
      }
      clearStoredFcmToken();
      setEnabled(false);
    });
  }, []);

  if (!supported) return null;

  async function handleClick() {
    setBusy(true);
    setError('');
    try {
      const token = await enableNotifications();
      await api.registerFcmToken({ token, platform: 'web' });
      setEnabled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to enable notifications.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="notification-toggle">
      <button type="button" className="link-button" onClick={() => void handleClick()} disabled={busy || enabled}>
        {enabled ? 'Notifications on' : 'Enable notifications'}
      </button>
      {error && <small role="alert">{error}</small>}
    </span>
  );
}
