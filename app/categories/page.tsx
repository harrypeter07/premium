'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, ArrowRight } from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/data/mockData';

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Grid className="w-3.5 h-3.5" />
          <span>Curated Index</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          All Archive Categories
        </h1>
        <p className="text-sm text-gray-300">
          Browse through specialized collections of fashion, travel, studio BTS, beauty, and exclusive art.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_LIST.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-brand-purple/50 p-6 flex flex-col justify-end min-h-[260px] transition-all shadow-lg hover:shadow-neon"
          >
            <Image src={cat.coverImage} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/10 text-gray-300">
                {cat.count} Items
              </span>
              <h2 className="font-display font-bold text-2xl text-white">{cat.name}</h2>
              <p className="text-xs text-gray-300 line-clamp-2">{cat.description}</p>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-brand-purple group-hover:translate-x-1 transition-transform">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
