'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Eye, Play, Share2, Trash2 } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { getSavedBookmarks, toggleBookmarkStorage, getSavedLikes, toggleLikeStorage, getPersistentUploadedMedia, savePersistentUploadedMedia } from '@/lib/storage/localStorage';
import { getCloudflareImageUrl } from '@/lib/media/cloudflare';

interface MediaCardProps {
  media: MediaItem;
  onSelect?: (media: MediaItem) => void;
  priority?: boolean;
}

export default function MediaCard({ media, onSelect, priority = false }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(media.likes);
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsBookmarked(getSavedBookmarks().includes(media.id));
    setIsLiked(getSavedLikes().includes(media.id));
    setIsAdmin(localStorage.getItem('smr_admin_session') === 'authorized');
  }, [media.id]);

  if (isDeleted) return null;

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const saved = toggleBookmarkStorage(media.id);
    setIsBookmarked(saved);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const liked = toggleLikeStorage(media.id);
    setIsLiked(liked);
    setLikesCount(prev => (liked ? prev + 1 : prev - 1));
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      await fetch(`/api/media?id=${media.id}`, { method: 'DELETE' });
      const current = getPersistentUploadedMedia();
      const updated = current.filter(m => m.id !== media.id && m.url !== media.url);
      localStorage.setItem('smr_uploaded_media', JSON.stringify(updated));
      setIsDeleted(true);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: media.title,
        text: media.description,
        url: `${window.location.origin}/media/${media.id}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/media/${media.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const formattedUrl = getCloudflareImageUrl(media.thumbnailUrl, 800);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect && onSelect(media)}
      className="masonry-item relative group cursor-pointer rounded-2xl overflow-hidden glass-card border border-white/10 shadow-lg hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] transition-all"
    >
      {/* Media Container */}
      <div className="relative w-full overflow-hidden bg-dark-card" style={{ aspectRatio: media.width && media.height ? `${media.width}/${media.height}` : '4/5' }}>
        {media.type === 'VIDEO' && isHovered ? (
          <video
            src={media.url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 scale-105"
          />
        ) : (
          <img
            src={formattedUrl}
            alt={media.altText || media.title}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Gradient Blur Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-base/90 via-dark-base/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase glass-panel text-white border border-white/10 shadow-sm flex items-center gap-1">
            {media.type === 'VIDEO' && <Play className="w-3 h-3 fill-violet-400 text-violet-400" />}
            {media.category?.name || 'Fashion'}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Admin Delete Button */}
            {mounted && isAdmin && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white border border-red-400/50 shadow-md transition-all"
                title="Delete Post (Admin)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full glass-panel border border-white/10 transition-all ${
                mounted && isBookmarked ? 'text-violet-400 bg-white/20' : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}
              title="Save to bookmarks"
            >
              <Bookmark className={`w-3.5 h-3.5 ${mounted && isBookmarked ? 'fill-violet-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hover Bottom Action & Metadata Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-display font-semibold text-sm text-white line-clamp-2 drop-shadow-md mb-2">
            {media.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-300 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px]">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                {media.views.toLocaleString()}
              </span>
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-[11px] hover:text-red-400 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${mounted && isLiked ? 'text-red-400 fill-red-400' : 'text-gray-400'}`} />
                {likesCount.toLocaleString()}
              </button>
            </div>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
