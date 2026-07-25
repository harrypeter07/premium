'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, Sparkles, Grid } from 'lucide-react';
import { CATEGORIES_LIST, MEDIA_ITEMS } from '@/lib/data/mockData';
import MasonryFeed from '@/components/feed/MasonryFeed';

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMedia = selectedCategory === 'all'
    ? MEDIA_ITEMS
    : MEDIA_ITEMS.filter((m) => m.category.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Visual Discovery</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          Explore Curated Archives
        </h1>
        <p className="text-sm text-gray-300">
          Discover high-resolution imagery, editorial video cuts, and behind-the-scenes moments across 10 specialized categories.
        </p>
      </div>

      {/* Category Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES_LIST.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug === selectedCategory ? 'all' : cat.slug)}
            className={`relative group rounded-2xl overflow-hidden aspect-[4/3] text-left p-3 flex flex-col justify-end transition-all border ${
              selectedCategory === cat.slug
                ? 'border-brand-purple ring-2 ring-brand-purple/50 shadow-neon'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <Image src={cat.coverImage} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10">
              <h3 className="font-bold text-xs text-white">{cat.name}</h3>
              <p className="text-[10px] text-gray-300 font-mono">{cat.count} Archives</p>
            </div>
          </button>
        ))}
      </div>

      {/* Explore Media Feed */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-display font-bold text-xl text-white">
            {selectedCategory === 'all' ? 'All Visual Archives' : `${selectedCategory.toUpperCase()} Feed`}
          </h2>
          {selectedCategory !== 'all' && (
            <button onClick={() => setSelectedCategory('all')} className="text-xs text-brand-purple hover:underline">
              Reset Filter
            </button>
          )}
        </div>

        <MasonryFeed items={filteredMedia} />
      </div>
    </div>
  );
}
