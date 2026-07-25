import React from 'react';
import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import AdSenseSlot from '@/components/monetization/AdSenseSlot';
import GDPRConsentBanner from '@/components/ui/gdpr-banner';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smriti Shah (@smriti.shans) | Visual Archives & High-Fashion Editorials',
  description: 'High-resolution visual archives, haute couture editorial films, travel diaries, and minimal aesthetics by Smriti Shah (@smriti.shans).',
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
        {/* Literal Hardcoded Google AdSense Site Verification Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-4236633699270444" />

        {/* Literal Hardcoded Google AdSense Auto-Ads Script Snippet */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4236633699270444"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#120e1d] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-brand-purple selection:text-white">
        <TooltipProvider>
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Stage */}
          <main className="flex-1 pt-16 sm:pt-20 pb-8">
            {children}
          </main>

          {/* Sticky Mobile Anchor Ad */}
          <AdSenseSlot type="STICKY_ANCHOR" />

          {/* GDPR Cookie Consent Banner */}
          <GDPRConsentBanner />

          {/* Footer */}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
