import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import GDPRConsentBanner from '@/components/ui/gdpr-banner';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smriti Shah (@smriti.shans) | Visual Archives & High-Fashion Editorials',
  description: 'High-resolution visual archives, haute couture editorial films, travel diaries, and minimal aesthetics by Smriti Shah (@smriti.shans).',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#120e1d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Favicon Icon Link */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-[#120e1d] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-brand-purple selection:text-white">
        <TooltipProvider>
          {/* Automatic Client Analytics Tracker */}
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Stage */}
          <main className="flex-1 pt-16 sm:pt-20 pb-8">
            {children}
          </main>

          {/* Adsterra Global Popunder (Loads after interactivity) */}
          <Script
            src="https://pl30595675.effectivecpmnetwork.com/19/65/40/196540cfdbb2eec6ba55744cc20886e7.js"
            strategy="afterInteractive"
          />

          {/* Adsterra Global Social Bar (Lazy loaded) */}
          <Script
            src="https://pl30595678.effectivecpmnetwork.com/4e/8e/8c/4e8e8ceff1a7bc1a376b6fc7e377ccb7.js"
            strategy="lazyOnload"
          />

          {/* GDPR Cookie Consent Banner */}
          <GDPRConsentBanner />

          {/* Footer */}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
