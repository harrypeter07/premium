'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Folder, Video, Image as ImageIcon, X, ArrowUpRight } from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/data/mockData';
import { MediaItem, CollectionItem } from '@/lib/types';
import MasonryFeed from '@/components/feed/MasonryFeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cleanOrGenerateTitle } from '@/lib/utils/captionHelper';

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [activeCollection, setActiveCollection] = useState<CollectionItem | null>(null);
  const [collectionTab, setCollectionTab] = useState<'PHOTOS' | 'VIDEOS'>('PHOTOS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExploreData() {
      try {
        setLoading(true);
        const [mediaRes, colRes] = await Promise.all([
          fetch('/api/media', { cache: 'no-store' }),
          fetch('/api/collections', { cache: 'no-store' }),
        ]);

        const [mediaData, colData] = await Promise.all([
          mediaRes.json(),
          colRes.json(),
        ]);

        if (mediaData.media) setMediaList(mediaData.media);
        if (colData.collections) setCollections(colData.collections);
      } catch (err) {
        console.error('Error fetching explore data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadExploreData();
  }, []);

  const filteredMedia = selectedCategory === 'all'
    ? mediaList
    : mediaList.filter((m) => m.category.slug === selectedCategory);

  const collectionItems = activeCollection
    ? mediaList.filter((m) => m.collectionId === activeCollection.id)
    : [];

  const collectionPhotos = collectionItems.filter((m) => m.type === 'IMAGE');
  const collectionVideos = collectionItems.filter((m) => m.type === 'VIDEO');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="gap-2 border-violet-500/40 text-violet-400 py-1 px-3 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
          <Compass className="w-3.5 h-3.5" />
          <span>Visual Discovery &amp; Collections</span>
        </Badge>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Explore Curated Archives &amp; Packs
        </h1>
        <p className="text-sm text-gray-300">
          Discover high-resolution editorial imagery, exclusive video cuts, and organized occasion folders by Smriti Shah.
        </p>
      </div>

      {/* Occasion / Collection Folders Section — Render ONLY if collections.length > 0 */}
      {collections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-violet-400" />
              <h2 className="font-bold text-lg text-white">Featured Occasion Collections &amp; Packs</h2>
            </div>
            <span className="text-xs text-zinc-500 font-mono">{collections.length} Folders</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((col) => (
              <Card
                key={col.id}
                onClick={() => setActiveCollection(col)}
                className="group cursor-pointer border border-white/10 hover:border-violet-500/50 shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] transition-all overflow-hidden bg-[#140f21]"
              >
                <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden border-b border-white/10">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140f21] via-transparent to-transparent" />

                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="default"
                      className={col.isFree ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}
                    >
                      {col.price || (col.isFree ? 'FREE' : 'VIP')}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors">
                      {col.name}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400" />
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="space-y-4 pt-2">
        <h2 className="font-bold text-lg text-white">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug === selectedCategory ? 'all' : cat.slug)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-violet-600/20 border-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                  : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
              }`}
            >
              <p className="font-bold text-xs">{cat.name}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{cat.slug}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Explore Media Feed */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-bold text-xl text-white">
            {selectedCategory === 'all' ? 'All Visual Archives' : `${selectedCategory.toUpperCase()} Feed`}
          </h2>
          {selectedCategory !== 'all' && (
            <button onClick={() => setSelectedCategory('all')} className="text-xs text-violet-400 hover:underline">
              Reset Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">Loading collection archives...</div>
        ) : (
          <MasonryFeed items={filteredMedia} />
        )}
      </div>

      {/* Opened Collection View Modal */}
      {activeCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0917]/90 backdrop-blur-xl animate-in fade-in">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col border border-violet-500/40 shadow-[0_0_35px_rgba(124,58,237,0.3)] bg-[#140f21] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-violet-500/40 text-violet-400 text-[10px]">
                    Collection Pack
                  </Badge>
                  <Badge variant="default" className={activeCollection.isFree ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}>
                    {activeCollection.price}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-white">{activeCollection.name}</h2>
                <p className="text-xs text-zinc-400 max-w-xl">{activeCollection.description}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveCollection(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Separate Videos vs Photos Tabs */}
            <div className="px-6 pt-4 border-b border-white/10 flex items-center gap-3">
              <button
                onClick={() => setCollectionTab('PHOTOS')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  collectionTab === 'PHOTOS' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photos ({collectionPhotos.length})</span>
              </button>

              <button
                onClick={() => setCollectionTab('VIDEOS')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  collectionTab === 'VIDEOS' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Videos ({collectionVideos.length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {collectionTab === 'PHOTOS' ? (
                collectionPhotos.length === 0 ? (
                  <div className="py-16 text-center text-xs text-zinc-500 font-mono">
                    No photo items in this collection yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {collectionPhotos.map((item) => (
                      <Link key={item.id} href={`/media/${item.id}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all bg-zinc-900">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs font-semibold text-white line-clamp-1">
                            {cleanOrGenerateTitle(item.title)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              ) : (
                collectionVideos.length === 0 ? (
                  <div className="py-16 text-center text-xs text-zinc-500 font-mono">
                    No video items in this collection yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {collectionVideos.map((item) => (
                      <Link key={item.id} href={`/media/${item.id}`} className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-red-500/50 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all bg-zinc-900">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <p className="text-xs font-semibold text-white line-clamp-1">
                            {cleanOrGenerateTitle(item.title)}
                          </p>
                          <Badge variant="default" className="text-[9px] bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">VIDEO</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
