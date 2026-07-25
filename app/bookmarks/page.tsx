'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import { getSavedBookmarks } from '@/lib/storage/localStorage';
import MasonryFeed from '@/components/feed/MasonryFeed';

export default function BookmarksPage() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    setBookmarkedIds(getSavedBookmarks());
  }, []);

  const bookmarkedMedia = MEDIA_ITEMS.filter((m) => bookmarkedIds.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Collection</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          Your Bookmarked Archives
        </h1>
        <p className="text-sm text-gray-300">
          Personal saved high-res photography and video cut collections.
        </p>
      </div>

      {bookmarkedMedia.length > 0 ? (
        <MasonryFeed items={bookmarkedMedia} />
      ) : (
        <div className="text-center py-24 glass-panel rounded-3xl border border-white/10 space-y-3">
          <Bookmark className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="font-bold text-lg text-white">No Saved Bookmarks Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click the bookmark icon on any photo or video card across the feed to save items to your personal collection.
          </p>
        </div>
      )}
    </div>
  );
}
