import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { SWRProvider } from '@/components/swr-provider';
import ConditionalHeader from '@/components/ConditionalHeader';
import MaintenanceCheck from '@/components/MaintenanceCheck';

import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DriveUK Pro',
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'DriveUK Pro - Driving School',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-background text-foreground">
        <SWRProvider>
          <MaintenanceCheck>
            <div className="flex flex-col min-h-screen">
              <ConditionalHeader />
              {children}
            </div>
          </MaintenanceCheck>
        </SWRProvider>
      </body>
    </html>
  );
}
