'use client';

import React, { useEffect } from 'react';

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
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-4236633699270444';

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense block init:', e);
    }
  }, []);

  if (type === 'STICKY_ANCHOR') {
    return (
      <aside aria-label="Advertisement" className="fixed bottom-0 left-0 right-0 z-40 bg-[#120e1d]/90 backdrop-blur-xl border-t border-brand-purple/20 py-1 shadow-2xl flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-center items-center">
          {/* Dynamic Google AdSense Anchor / Sticky Ad unit */}
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '728px', height: '90px' }}
            data-ad-client={pubId}
            data-ad-slot={slotId}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </aside>
    );
  }

  if (type === 'BANNER') {
    return (
      <div className="w-full my-4 p-2 rounded-2xl glass-card border border-white/10 text-center relative overflow-hidden flex flex-col items-center">
        <span className="text-[9px] uppercase font-mono text-gray-500 mb-1">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={pubId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div className="masonry-item relative rounded-2xl overflow-hidden glass-card border border-brand-purple/20 p-4 shadow-neon flex flex-col items-center">
      <span className="text-[9px] uppercase font-mono text-gray-500 mb-1">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={pubId}
        data-ad-slot={slotId}
        data-ad-format="fluid"
        data-ad-layout-key="-gw-3+1f-3d+2z"
      />
    </div>
  );
}
