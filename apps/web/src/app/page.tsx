export default function HomePage() {
  return (
    <main>
      <h1>WalkIn</h1>
      <p>
        Foundation is ready. The customer booking flow and provider dashboard are
        built on the next milestones.
      </p>
      <h2>Backend</h2>
      <ul>
        <li>Firestore security rules and indexes</li>
        <li>Cloud Functions with transactional booking and slot locks</li>
        <li>Emulator configuration for Auth, Firestore, Functions, Storage, and Pub/Sub</li>
      </ul>
      <h2>Local development</h2>
      <p>
        Copy <code>.env.example</code> to <code>.env</code> and{' '}
        <code>apps/web/.env.example</code> to <code>apps/web/.env.local</code>, then run{' '}
        <code>npm run emulators</code> and <code>npm run dev:web</code>.
      </p>
    </main>
  );
}
