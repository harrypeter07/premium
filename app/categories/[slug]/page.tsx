'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CATEGORIES_LIST, MEDIA_ITEMS } from '@/lib/data/mockData';
import MasonryFeed from '@/components/feed/MasonryFeed';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = CATEGORIES_LIST.find((c) => c.slug === slug);
  const media = MEDIA_ITEMS.filter((m) => m.category.slug === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Link href="/categories" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Categories</span>
      </Link>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Category Archive</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          {category ? category.name : slug?.toUpperCase()} Archives
        </h1>
        <p className="text-sm text-gray-300">
          {category?.description || 'Curated high-resolution media archives.'}
        </p>
      </div>

      <MasonryFeed items={media.length > 0 ? media : MEDIA_ITEMS} />
    </div>
  );
}
