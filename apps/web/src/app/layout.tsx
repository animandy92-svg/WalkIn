import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth-provider';
import { ProviderAccessProvider } from '@/components/provider-access';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: 'WalkIn',
  description: 'Book local services and manage your appointments.',
  manifest: '/manifest.json',
  icons: { icon: '/icons/walkin-icon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProviderAccessProvider>
            <SiteHeader />
            <main>{children}</main>
          </ProviderAccessProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
