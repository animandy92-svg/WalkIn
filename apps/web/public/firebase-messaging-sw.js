/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js');

const params = new URL(self.location.href).searchParams;
const firebaseConfig = {
  apiKey: params.get('apiKey') || '',
  authDomain: params.get('authDomain') || '',
  projectId: params.get('projectId') || '',
  storageBucket: params.get('storageBucket') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || '',
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || 'WalkIn';
    const options = {
      body: payload.notification?.body || '',
      icon: '/icons/walkin-icon.svg',
      data: payload.data || {},
    };
    self.registration.showNotification(title, options);
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const bookingId = event.notification.data?.bookingId;
    const path = event.notification.data?.url ||
      (bookingId ? `/bookings?bookingId=${encodeURIComponent(bookingId)}` : '/bookings');
    const target = new URL(path, self.location.origin).href;
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        const existing = clients.find((client) => client.url === target);
        if (existing) return existing.focus();
        return self.clients.openWindow(target);
      }),
    );
  });
}
