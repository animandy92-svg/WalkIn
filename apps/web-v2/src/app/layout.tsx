import type { Metadata, Viewport } from 'next';
import { Archivo, Arimo } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import './globals.css';
import './pages.css';
import './dashboard.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const arimo = Arimo({
  subsets: ['latin'],
  variable: '--font-arimo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'WalkIn — open slots at campus shops',
    template: '%s · WalkIn',
  },
  description:
    'See open slots at campus barbers, salons, laundries and print shops, and book one before you walk in.',
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#1c5845',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GH" className={`${archivo.variable} ${arimo.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
