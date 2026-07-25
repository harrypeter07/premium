'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import MasonryFeed from '@/components/feed/MasonryFeed';

export default function TrendingPage() {
  const trendingItems = MEDIA_ITEMS.filter((m) => m.isTrending || m.views > 90000);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/50 text-brand-accent text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5" />
          <span>Real-time Velocity</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          Trending Visual Content
        </h1>
        <p className="text-sm text-gray-300">
          Archives receiving peak traffic velocity, shares, and engagement across social channels today.
        </p>
      </div>

      <MasonryFeed items={trendingItems} />
    </div>
  );
}
