'use client';

import React, { useState, useEffect } from 'react';
import { Video, Eye, Heart, Share2, Bookmark, Sparkles } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import VideoPlayer from '@/components/media/VideoPlayer';
import { getSavedBookmarks, toggleBookmarkStorage, getSavedLikes, toggleLikeStorage, getPersistentUploadedMedia } from '@/lib/storage/localStorage';
import { Badge } from '@/components/ui/badge';
import { cleanOrGenerateTitle } from '@/lib/utils/captionHelper';

export default function VideosPage() {
  const [videoItems, setVideoItems] = useState<MediaItem[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        let items: MediaItem[] = data.media || [];
        const localUploaded = getPersistentUploadedMedia();
        if (localUploaded.length > 0) {
          const merged = [...items, ...localUploaded.filter(l => !items.some(i => i.id === l.id))];
          items = merged;
        }
        const vids = items.filter(m => m.type === 'VIDEO');
        setVideoItems(vids);
      })
      .catch(() => {
        const localUploaded = getPersistentUploadedMedia();
        const vids = localUploaded.filter((m: any) => m.type === 'VIDEO');
        setVideoItems(vids);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentVideo = videoItems[activeVideoIndex] || videoItems[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <Badge variant="outline" className="gap-2 border-violet-500/40 text-violet-400 py-1 px-3 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
          <Video className="w-3.5 h-3.5" />
          <span>Cinematic Video Vault</span>
        </Badge>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          Short-Form &amp; Editorial Video Cuts
        </h1>
        <p className="text-sm text-gray-300">
          High-definition editorial video films, backstage movement clips, and cinematic stories by Smriti Shah.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-zinc-500">Loading video vault...</div>
      ) : videoItems.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-500">
          No video uploads found yet. Upload videos in Admin Studio to feature them here!
        </div>
      ) : (
        currentVideo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Player Stage */}
            <div className="lg:col-span-2 space-y-4">
              <VideoPlayer
                key={currentVideo.id}
                url={currentVideo.url}
                thumbnailUrl={currentVideo.thumbnailUrl}
                title={cleanOrGenerateTitle(currentVideo.title)}
                mediaId={currentVideo.id}
                resolutions={currentVideo.resolutions}
                autoPlay={true}
              />

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-violet-500/40 text-violet-400 text-xs">
                    {currentVideo.category?.name || 'Fashion Video'}
                  </Badge>
                  <span className="text-xs text-gray-400 font-mono">
                    Published {new Date(currentVideo.publishedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="font-display font-bold text-xl text-white">{cleanOrGenerateTitle(currentVideo.title)}</h2>
                <p className="text-sm text-gray-300 leading-relaxed">{currentVideo.description}</p>
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Video Queue ({videoItems.length})</span>
              </h3>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {videoItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveVideoIndex(idx)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex gap-3 border ${
                      activeVideoIndex === idx
                        ? 'bg-violet-600/20 border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                        : 'glass-card border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img src={item.thumbnailUrl} alt={item.title} className="w-20 h-24 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-bold text-white line-clamp-2">{cleanOrGenerateTitle(item.title)}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{item.category?.name || 'Fashion'}</p>
                      <span className="inline-block text-[10px] font-mono text-violet-400 font-semibold">
                        HD Cinematic
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
