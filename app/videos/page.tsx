'use client';

import React, { useState } from 'react';
import { Video, Flame, Eye, Heart, Share2, Bookmark, Sparkles } from 'lucide-react';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import VideoPlayer from '@/components/media/VideoPlayer';
import { getSavedBookmarks, toggleBookmarkStorage, getSavedLikes, toggleLikeStorage } from '@/lib/storage/localStorage';

export default function VideosPage() {
  const videoItems = MEDIA_ITEMS.filter((m) => m.type === 'VIDEO');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const currentVideo = videoItems[activeVideoIndex] || videoItems[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Video className="w-3.5 h-3.5" />
          <span>Cinematic Vault</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          Short-Form & Editorial Video Cuts
        </h1>
        <p className="text-sm text-gray-300">
          Powered by adaptive Cloudflare R2 streaming (1080p, 720p, 480p, 360p) with PiP and keyboard controls.
        </p>
      </div>

      {/* Main Video Spotlight Stage */}
      {currentVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Player Stage */}
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer
              key={currentVideo.id}
              url={currentVideo.url}
              thumbnailUrl={currentVideo.thumbnailUrl}
              title={currentVideo.title}
              mediaId={currentVideo.id}
              resolutions={currentVideo.resolutions}
              autoPlay={true}
            />

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-purple/20 border border-brand-purple/40 text-brand-purple">
                  {currentVideo.category.name}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {new Date(currentVideo.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="font-display font-bold text-xl text-white">{currentVideo.title}</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{currentVideo.description}</p>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span>Video Queue ({videoItems.length})</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {videoItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex gap-3 border ${
                    activeVideoIndex === idx
                      ? 'bg-brand-purple/20 border-brand-purple shadow-neon'
                      : 'glass-card border-white/10 hover:border-white/20'
                  }`}
                >
                  <img src={item.thumbnailUrl} alt={item.title} className="w-20 h-24 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs font-bold text-white line-clamp-2">{item.title}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{item.category.name}</p>
                    <span className="inline-block text-[10px] font-mono text-brand-purple">
                      {item.duration ? `${Math.round(item.duration)}s` : 'HD'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
