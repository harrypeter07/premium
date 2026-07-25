'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Folder, Image as ImageIcon, Video, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { MediaItem, CollectionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cleanOrGenerateTitle } from '@/lib/utils/captionHelper';
import { getPersistentCollections } from '@/lib/storage/localStorage';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const colRes = await fetch('/api/collections', { cache: 'no-store' });
        const colData = await colRes.json();

        let cols: CollectionItem[] = colData.collections || [];
        const localCols = getPersistentCollections();
        if (localCols.length > 0) {
          const merged = [...cols, ...localCols.filter(lc => !cols.some(c => c.id === lc.id))];
          cols = merged;
        }
        setCollections(cols);
      } catch (err) {
        console.error('Error fetching collections data:', err);
        const localCols = getPersistentCollections();
        if (localCols.length > 0) setCollections(localCols);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <Badge variant="outline" className="gap-2 border-violet-500/40 text-violet-400 py-1 px-3 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
          <Folder className="w-3.5 h-3.5" />
          <span>Exclusive Collection Vaults</span>
        </Badge>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Curated Occasion Collections &amp; Packs
        </h1>
        <p className="text-sm text-gray-300">
          Browse themed occasion folders, haute couture editorial archives, and specialized VIP photo &amp; video packs.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-zinc-500">Loading collection folders...</div>
      ) : collections.length === 0 ? (
        <Card className="p-12 text-center border border-white/10 bg-[#140f21] space-y-4 max-w-md mx-auto">
          <Folder className="w-12 h-12 text-violet-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Collections Available Yet</h2>
          <p className="text-xs text-zinc-400">Log into the Admin Studio dashboard to create your first occasion collection folder.</p>
          <Link href="/admin">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white font-bold">Open Admin Studio</Button>
          </Link>
        </Card>
      ) : (
        /* Longer Vertical Aspect Ratio Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-violet-500/60 shadow-xl hover:shadow-[0_0_35px_rgba(124,58,237,0.35)] transition-all bg-zinc-950 min-h-[420px] aspect-[3/4] flex flex-col justify-end p-6"
            >
              {/* Full Card Cover Image */}
              <img
                src={col.coverImage}
                alt={col.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Full Card Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0917] via-[#0d0917]/60 to-transparent" />

              {/* Top Price Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant="default"
                  className={col.isFree ? 'bg-emerald-500/80 text-white backdrop-blur-md border border-emerald-400/50 shadow-md font-bold' : 'bg-amber-500/80 text-white backdrop-blur-md border border-amber-400/50 shadow-md font-bold'}
                >
                  {col.price || (col.isFree ? 'FREE' : 'VIP')}
                </Badge>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xl text-white group-hover:text-violet-300 transition-colors drop-shadow-md">
                    {col.name}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                </div>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed drop-shadow">
                  {col.description}
                </p>
                <div className="pt-2 text-[11px] text-violet-400 font-bold flex items-center gap-1">
                  <span>Open Collection Folder</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
