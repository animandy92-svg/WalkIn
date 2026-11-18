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

## Prerequisites

- Node.js 22 or newer (Node 24 is supported locally)
- npm 11 (npm workspaces are used; pnpm is not required)
- Firebase CLI 15 or newer (`npm install -g firebase-tools`)
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
```

Emulator ports: Auth 9099, Firestore 8080, Functions 5001, Storage 9199, Pub/Sub 8085, UI 4000.

## Implementation status

Milestone 0 (foundation) is in place:

- npm workspaces and shared schema package
- Firestore/Storage rules, composite indexes, Firebase emulator config
- Cloud Functions scaffold: availability engine, transactional booking, state transitions,
  provider configuration APIs, FCM helpers, scheduled expiry/reminders/completion
- Next.js and Flutter scaffolds

Milestones 1–6 (booking-core hardening, customer website, provider dashboard, Flutter screens,
notifications, and launch hardening) follow the plan in
`C:\Users\anima\.opencode\plan\walkin-implementation-plan.md`.

## Notes

- App Check is enforced on callable functions in deployed environments only; the emulator cannot
  enforce it.
- All booking writes go through Cloud Functions. Firestore rules deny client writes to bookings,
  slot locks, availability, and audit logs.
- Booking times are stored as UTC; display uses the provider's IANA time zone.
- The Flutter app needs `flutterfire configure --project=walkin-123` before it can run against a
  real Firebase project.
