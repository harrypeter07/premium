'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import { getWatchHistory, clearWatchHistory } from '@/lib/storage/localStorage';
import MasonryFeed from '@/components/feed/MasonryFeed';

export default function HistoryPage() {
  const [historyIds, setHistoryIds] = useState<string[]>([]);

  useEffect(() => {
    const list = getWatchHistory().map((h) => h.mediaId);
    setHistoryIds(list);
  }, []);

  const historyMedia = MEDIA_ITEMS.filter((m) => historyIds.includes(m.id));

  const handleClear = () => {
    clearWatchHistory();
    setHistoryIds([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Viewed</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Watch & View History</h1>
        </div>

        {historyMedia.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-full glass-card hover:bg-red-500/20 hover:border-red-500/50 text-red-400 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {historyMedia.length > 0 ? (
        <MasonryFeed items={historyMedia} />
      ) : (
        <div className="text-center py-24 glass-panel rounded-3xl border border-white/10 space-y-3">
          <Clock className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="font-bold text-lg text-white">Your History is Empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Items you inspect or watch will automatically appear in your recent history timeline.
          </p>
        </div>
      )}
    </div>
  );
}
