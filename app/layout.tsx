'use client';

import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import SearchModal from '@/components/ui/SearchModal';
import AdSenseSlot from '@/components/monetization/AdSenseSlot';
import Script from 'next/script';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const adsensePubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-4236633699270444';

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <title>Smriti Shah (@smriti.shans) | Visual Archives & High-Fashion Editorials</title>
        <meta name="description" content="High-resolution visual archives, haute couture editorial films, travel diaries, and minimal aesthetics by Smriti Shah (@smriti.shans)." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#120e1d" />

        {/* Official Google AdSense Script Snippet (Fetched dynamically from NEXT_PUBLIC_ADSENSE_PUB_ID) */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePubId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-[#120e1d] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-brand-purple selection:text-white">
        {/* Navigation Bar */}
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Main Content Stage */}
        <main className="flex-1 pt-16 sm:pt-20 pb-8">
          {children}
        </main>

        {/* Sticky Mobile Anchor Ad */}
        <AdSenseSlot type="STICKY_ANCHOR" />

        {/* Footer */}
        <Footer />

        {/* Global Instant Search Modal */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </body>
    </html>
  );
}
