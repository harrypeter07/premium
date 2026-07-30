'use client';

import React, { useState } from 'react';
import { MediaItem } from '@/lib/types';
import MediaCard from '../media/MediaCard';
import AdsterraAd from '../monetization/AdsterraAd';
import MediaModal from '../media/MediaModal';
import { Sparkles, Video, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MasonryFeedProps {
  items: MediaItem[];
  showAdSlots?: boolean;
}

export default function MasonryFeed({ items, showAdSlots = true }: MasonryFeedProps) {
  const [selectedFormat, setSelectedFormat] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const filteredItems = items.filter((item) => {
    if (selectedFormat === 'ALL') return true;
    return item.type === selectedFormat;
  });

  const displayedItems = filteredItems.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Format Filter Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFormat('ALL')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
              selectedFormat === 'ALL'
                ? 'bg-white text-black font-bold shadow-md'
                : 'glass-panel text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Content ({items.length})</span>
          </button>

          <button
            onClick={() => setSelectedFormat('IMAGE')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
              selectedFormat === 'IMAGE'
                ? 'bg-white text-black font-bold shadow-md'
                : 'glass-panel text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos ({items.filter(i => i.type === 'IMAGE').length})</span>
          </button>

          <button
            onClick={() => setSelectedFormat('VIDEO')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
              selectedFormat === 'VIDEO'
                ? 'bg-white text-black font-bold shadow-md'
                : 'glass-panel text-gray-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({items.filter(i => i.type === 'VIDEO').length})</span>
          </button>
        </div>

        <span className="hidden sm:inline text-gray-500 font-mono text-[11px]">
          Showing {displayedItems.length} of {filteredItems.length} items
        </span>
      </div>

      {/* Masonry Grid */}
      <div className="masonry-grid">
        {displayedItems.map((media, idx) => (
          <React.Fragment key={media.id}>
            <MediaCard
              media={media}
              onSelect={(m) => setSelectedMedia(m)}
              priority={idx < 4}
            />
            {/* Inject Native Ad Card every 6 items */}
            {showAdSlots && idx === 5 && (
              <AdsterraAd type="BANNER_160X300" />
            )}

            {/* Inject Sponsored high-ctr Smartlink card at 9th slot */}
            {showAdSlots && idx === 8 && (
              <a
                href="https://www.effectivecpmnetwork.com/pmy0m7z1?key=c500f35b0bd9d507d1a7a844a05847fe"
                target="_blank"
                rel="noopener noreferrer"
                className="masonry-item relative group rounded-2xl overflow-hidden border border-fuchsia-500/20 hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all cursor-pointer block bg-[#181326]"
              >
                <div className="relative aspect-[4/5] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
                    alt="Premium Sponsored Aesthetic Archive"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120e1d]/90 via-transparent to-transparent opacity-90" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-fuchsia-600 text-white shadow-md">
                    SPONSORED
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <p className="text-xs font-semibold text-white">Unlock Exclusive Creative Presets & Fashion Archives</p>
                  </div>
                </div>
              </a>
            )}

            {/* Inject Banner Ad Card at 14th slot */}
            {showAdSlots && idx === 13 && (
              <AdsterraAd type="BANNER_320X50" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Infinite Scroll / Load More Trigger */}
      {visibleCount < filteredItems.length && (
        <div className="pt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3.5 rounded-full glass-panel hover:border-brand-purple/50 text-white font-semibold text-xs transition-all shadow-neon flex items-center gap-2 mx-auto"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                <span>Loading Archives...</span>
              </>
            ) : (
              <span>Load More Archives</span>
            )}
          </button>
        </div>
      )}

      {/* Media Detail Modal */}
      <MediaModal
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onSelectMedia={(m) => setSelectedMedia(m)}
      />
    </div>
  );
}
