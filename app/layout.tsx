'use client';

import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import SearchModal from '@/components/ui/SearchModal';
import AdSenseSlot from '@/components/monetization/AdSenseSlot';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <title>Smriti Shah (@smriti.shans) | Visual Archives & High-Fashion Editorials</title>
        <meta name="description" content="High-resolution visual archives, haute couture editorial films, travel diaries, and minimal aesthetics by Smriti Shah (@smriti.shans)." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#120e1d" />
      </head>
      <body className="bg-[#120e1d] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-brand-purple selection:text-white">
        {/* Navigation Bar */}
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Main Content Stage with Compact Padding */}
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
