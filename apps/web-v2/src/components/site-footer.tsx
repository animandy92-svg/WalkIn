import Link from 'next/link';
import { Wordmark } from './site-header';

export function SiteFooter() {
  return (
    <footer className="site-footer on-felt">
      <div className="wrap site-footer__inner">
        <div className="stack-2">
          <Wordmark />
          <p className="on-felt-2" style={{ maxWidth: '46ch', fontSize: 'var(--fs-sm)' }}>
            Open slots at campus shops, booked before you walk in. This is a preview build: every shop,
            person and price on it is demo data.
          </p>
        </div>
        <nav className="site-footer__links" aria-label="Footer">
          <Link href="/">The board</Link>
          <Link href="/bookings">My bookings</Link>
          <Link href="/sign-in?next=/dashboard">Shop dashboard</Link>
        </nav>
      </div>
    </footer>
  );
}
