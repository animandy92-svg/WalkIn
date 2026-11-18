# WalkIn

One Firebase backend serving three clients:

- **Website** — Next.js customer booking flow (milestone 2)
- **Provider dashboard** — Next.js, same app, separate route group (milestone 3)
- **Mobile app** — Flutter for iOS and Android (milestone 4)

The backend uses Firebase Authentication, Cloud Firestore, Cloud Functions, Cloud Storage,
Firebase Cloud Messaging, and Firebase App Check.

## Repository layout

```
apps/web/         Next.js website and provider dashboard
apps/mobile/      Flutter customer app
functions/        TypeScript Cloud Functions and scheduled jobs
packages/shared/  Zod schemas, TypeScript types, generated JSON Schema
firebase.json     Firebase CLI and emulator configuration
firestore.rules   Security rules
storage.rules     Storage rules
docs/             Architecture decisions and API contracts
```

## Firebase project

The configured project is `walkin-123` (`.firebaserc`). The emulator uses a separate demo project
(`demo-walkin`) so local work cannot touch production data.

For real deployments, confirm the project is on the Blaze plan and that Auth providers, App Check,
and the desired Cloud Functions region (`us-central1` by default) are configured.

### Deploy the web app with Firebase App Hosting

The Next.js app is configured as the `walkin-web` App Hosting backend, with `apps/web` as its
monorepo root. App Hosting requires the Firebase project to use the Blaze plan. Once the project
is upgraded and the backend is created in Firebase Console (Hosting & Serverless → App Hosting),
select `apps/web` as its root directory and `us-central1` as its primary region. Then deploy from
the repository root:

```powershell
npm run deploy:web
```

The deploy command targets App Hosting only; it does not deploy Firestore rules, Storage rules, or
Cloud Functions. Set any required web runtime variables in the App Hosting backend settings or
`apps/web/apphosting.yaml` before deploying.

## Prerequisites

- Node.js 22 or newer (Node 24 is supported locally)
- npm 11 (npm workspaces are used; pnpm is not required)
- Firebase CLI 15 or newer (`npm install -g firebase-tools`)
- Java 11+ for the Firestore emulator (not needed for builds or unit tests). On this machine a JDK is available at `C:\Program Files\Android\Android Studio\jbr`; set `JAVA_HOME` to that path before starting emulators.
- Flutter SDK 3.22+ for `apps/mobile` (not required for web/backend work)

## Setup

```powershell
npm install
Copy-Item .env.example .env
Copy-Item apps\web\.env.example apps\web\.env.local
Copy-Item functions\.env.example functions\.env
```

Fill in the Firebase web app config in `apps/web/.env.local`. Register an App Check debug token if
you want to exercise App Check-protected endpoints locally; enforcement is automatically disabled
while running in the Functions emulator.

## Commands

```powershell
npm run build          # shared schemas, functions bundle, Next.js app
npm run typecheck      # TypeScript checks across workspaces
npm test               # shared + functions unit tests
npm run schema:generate # regenerate JSON Schema for Dart clients
npm run emulators      # Auth, Firestore, Functions, Storage, Pub/Sub, Emulator UI
npm run dev:web        # Next.js dev server
npm run test:rules     # Firestore rules tests (emulators must be running)
npm run test:emulator  # backend + rules emulator integration tests
npm run schema:check   # verify generated JSON Schema is current
npm run monitoring:setup # create log metrics, alert policies and email channel
```

Emulator ports: Auth 9099, Firestore 8080, Functions 5001, Storage 9199, Pub/Sub 8085, UI 4000.

### Emulator verification gate

With the emulators running, seed a demo provider and run the integration tests:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
npm run emulators:test       # in one terminal; Auth, Firestore, Functions only, UI disabled
npm run emulator:seed        # optional; the test seeds automatically
npm run test:emulator
```

The emulator UI, Storage, and Pub/Sub downloads are not required for this gate, so `emulators:test`
uses `firebase.test.json` to start only the three emulators the tests need. The launcher in
`scripts/emulator/start.mjs` raises `FUNCTIONS_DISCOVERY_TIMEOUT` to 60s because loading
`firebase-admin` and `firebase-functions` on this machine takes ~11s, longer than the Functions
emulator's default 10s discovery window. The integration tests create a provider with instant and
approval services, then verify that 20 parallel bookings for one single-capacity slot produce
exactly one booking, that idempotency keys are honoured, and that only the owning provider's staff
can review a pending booking. The same gate now also verifies booking audit records and the
Firestore rules (unauthenticated reads, customer/provider/admin access, cross-provider denial,
backend-only writes, user profile restrictions, and audit/notification log access). The seed script
**clears all data in the demo project** before writing fixtures.

### Flutter emulator integration test

The Flutter customer flow has an emulator-backed integration test in
`apps/mobile/integration_test/booking_flow_test.dart`. It requires a running Android emulator or
iOS simulator because the Firebase plugins need real platform channels:

```powershell
npm run emulators:test
npm run emulator:seed
cd apps\mobile
C:\Users\anima\flutter-sdk\bin\flutter.bat test integration_test
# Android emulator only, when emulators are not on localhost:
C:\Users\anima\flutter-sdk\bin\flutter.bat test integration_test --dart-define=WALKIN_EMULATOR_HOST=10.0.2.2
```

### Notifications and monitoring

The web app registers FCM tokens after an explicit **Enable notifications** click in the header.
Set `NEXT_PUBLIC_FIREBASE_VAPID_KEY` and deploy `apps/web/public/firebase-messaging-sw.js` with the
site. Background notification clicks open `/bookings?bookingId=...`. App Check is initialized for
deployed builds when `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set; emulator mode skips App Check.

For production alerting, set `ALERT_EMAIL` (or an existing `MONITORING_NOTIFICATION_CHANNEL`) and
run `npm run monitoring:setup`. This creates logs-based metrics for push failures, unhandled
callable errors, and scheduled-job errors, then attaches alert policies to the email channel.

## Implementation status

Milestones 0–5 are in place:

- npm workspaces and shared schema package
- Firestore/Storage rules, composite indexes, Firebase emulator config
- Cloud Functions: availability engine, transactional booking, state transitions, customer read
  APIs, provider configuration APIs, provider dashboard read API, FCM helpers, scheduled
  expiry/reminders/completion
- Next.js customer site: sign-in, provider list, provider/service pages, availability picker,
  booking, and my-bookings with cancel/reschedule
- Next.js provider dashboard: overview, day/week calendar, pending approval queue (confirm/reject),
  services, hours/availability, staff, and profile/policy settings editors
- Flutter customer app: explore, provider detail, availability, booking, bookings, notifications,
  FCM token registration, and booking deep links
- Booking integrity hardening: hold expiry re-checks, lock release ordering, idempotent reminders,
  failure propagation, audit records, and security-rule coverage
- Web push notifications and App Check initialization for deployed callables
- Monitoring setup for push, callable, and scheduler failures

The original scope is in `C:\Users\anima\.opencode\plan\walkin-implementation-plan.md`.

## Notes

- App Check is enforced on callable functions in deployed environments only; the emulator cannot
  enforce it.
- All booking writes go through Cloud Functions. Firestore rules deny client writes to bookings,
  slot locks, availability, and audit logs.
- Booking times are stored as UTC; display uses the provider's IANA time zone.
- The Flutter app needs `flutterfire configure --project=walkin-123` before it can run against a
  real Firebase project.
