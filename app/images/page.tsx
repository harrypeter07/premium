'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import MasonryFeed from '@/components/feed/MasonryFeed';

export default function PhotosPage() {
  const photoItems = MEDIA_ITEMS.filter((m) => m.type === 'IMAGE');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>35mm & Fine Art Photography</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          High-Resolution Photo Archives
        </h1>
        <p className="text-sm text-gray-300">
          Unsplash & Behance inspired minimal aesthetic photography galleries, analog film grain, and high-fashion editorials.
        </p>
      </div>

      <MasonryFeed items={photoItems} />
    </div>
  );
}
