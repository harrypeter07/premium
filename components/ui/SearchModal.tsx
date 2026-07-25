'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Sparkles, Video, Image as ImageIcon, Flame, Clock } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { MEDIA_ITEMS, CATEGORIES_LIST } from '@/lib/data/mockData';
import MediaCard from '../media/MediaCard';
import MediaModal from '../media/MediaModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'oldest' | 'trending'>('popular');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let results = MEDIA_ITEMS.filter((item) => {
    const matchesQuery =
      query === '' ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category.slug === selectedCategory;
    const matchesType = selectedType === 'ALL' || item.type === selectedType;

    return matchesQuery && matchesCategory && matchesType;
  });

  // Sorting
  if (sortBy === 'popular') results.sort((a, b) => b.views - a.views);
  else if (sortBy === 'newest') results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  else if (sortBy === 'oldest') results.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  else if (sortBy === 'trending') results.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto pt-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative w-full max-w-4xl bg-dark-surface border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 my-auto text-white"
        >
          {/* Search Header Bar */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <Search className="w-5 h-5 text-brand-purple shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by keywords, tags (#Paris, #Vogue, #Leica), or aesthetics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-base sm:text-lg text-white placeholder-gray-500 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 rounded-full text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full glass-card hover:bg-white/20 text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Instant Multi-Facet Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Format Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-mono">Format:</span>
              {(['ALL', 'IMAGE', 'VIDEO'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    selectedType === t ? 'bg-brand-purple text-white shadow-neon' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Category Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-mono">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:border-brand-purple"
              >
                <option value="all">All Categories</option>
                {CATEGORIES_LIST.map((c) => (
                  <option key={c.id} value={c.slug} className="bg-dark-surface">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-mono">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'oldest' | 'trending')}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:border-brand-purple"
              >
                <option value="popular" className="bg-dark-surface">Most Popular</option>
                <option value="newest" className="bg-dark-surface">Newest First</option>
                <option value="oldest" className="bg-dark-surface">Oldest First</option>
                <option value="trending" className="bg-dark-surface">Trending Velocity</option>
              </select>
            </div>
          </div>

          {/* Results Counter */}
          <div className="text-xs text-gray-400 flex items-center justify-between pt-1">
            <span>Found <strong className="text-white">{results.length}</strong> matching archives</span>
            {query && <span className="text-brand-purple">Showing search for &quot;{query}&quot;</span>}
          </div>

          {/* Search Results Grid */}
          <div className="max-h-[55vh] overflow-y-auto pr-1">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((media) => (
                  <MediaCard key={media.id} media={media} onSelect={(m) => setSelectedMedia(m)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 space-y-2">
                <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-semibold">No visual archives match your search filters.</p>
                <p className="text-xs">Try searching for &quot;Paris&quot;, &quot;Runway&quot;, or reset filters.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Media Detail Modal from Search */}
        <MediaModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      </div>
    </AnimatePresence>
  );
}
