'use client';

import React, { useEffect } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdSenseSlotProps {
  type?: 'NATIVE_CARD' | 'BANNER' | 'STICKY_ANCHOR';
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

export default function AdSenseSlot({
  type = 'NATIVE_CARD',
  slotId = '1234567890',
  format = 'auto',
}: AdSenseSlotProps) {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-1234567890123456';

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      }
    } catch {
      // AdSense script fallback
    }
  }, []);

  if (type === 'STICKY_ANCHOR') {
    return (
      <aside aria-label="Advertisement" className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0a14]/90 backdrop-blur-xl border-t border-brand-purple/30 p-2.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3 max-w-7xl mx-auto w-full px-4 justify-between">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-bold bg-white/10 text-gray-400">Sponsored</span>
            <p className="text-xs text-white font-medium line-clamp-1">Luxury Couture & Fragrance Special Edition • 20% Off Code: ELENA20</p>
          </div>
          <a
            href="https://example.com/sponsored"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-accent text-white text-xs font-semibold shadow-neon hover:opacity-90 transition-all flex items-center gap-1 shrink-0"
          >
            <span>Shop Now</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    );
  }

  if (type === 'BANNER') {
    return (
      <div className="w-full my-6 p-4 rounded-2xl glass-card border border-white/10 text-center relative overflow-hidden">
        <div className="flex items-center justify-between text-[10px] uppercase font-mono text-gray-500 mb-2">
          <span>Advertisement</span>
          <span>Google AdSense</span>
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={pubId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        <div className="p-6 bg-gradient-to-r from-brand-purple/10 via-brand-accent/10 to-brand-purple/10 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Featured Partner</span>
            <h4 className="text-sm font-bold text-white">Haute Couture Eyewear Collection 2026</h4>
            <p className="text-xs text-gray-400">Handcrafted Italian acetate frames designed for timeless elegance.</p>
          </div>
          <a
            href="https://example.com/ad-partner"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors shrink-0"
          >
            Explore Partner
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="masonry-item relative rounded-2xl overflow-hidden glass-card border border-brand-purple/30 p-5 shadow-neon text-white flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between text-[10px] font-mono text-brand-purple uppercase tracking-widest">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-purple" />
          Sponsored Spotlight
        </span>
        <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400">Ad</span>
      </div>

      <div className="space-y-2">
        <h4 className="font-display font-bold text-base text-white">
          Leica M11 Monochrom Archive Edition
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          60MP BSI CMOS Sensor crafted exclusively for black and white fine art photography. Experience pure light and shadow.
        </p>
      </div>

      <a
        href="https://example.com/leica"
        target="_blank"
        rel="noreferrer"
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-semibold text-xs text-center shadow-neon hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
      >
        <span>Discover Leica M11</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
