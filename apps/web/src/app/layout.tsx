import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WalkIn',
  description: 'Book local services and manage your appointments.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
