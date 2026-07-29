'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Eye, Play, Share2, Trash2, Lock, Crown } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { getSavedBookmarks, toggleBookmarkStorage, getSavedLikes, toggleLikeStorage, getPersistentUploadedMedia } from '@/lib/storage/localStorage';
import { getCloudflareImageUrl } from '@/lib/media/cloudflare';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MembershipModal from '@/components/monetization/MembershipModal';

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
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  
  // Premium lock and price state
  const [localIsPremium, setLocalIsPremium] = useState(media.isPremium);
  const [localPrice, setLocalPrice] = useState(media.price || 'FREE');
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsBookmarked(getSavedBookmarks().includes(media.id));
    setIsLiked(getSavedLikes().includes(media.id));
    setIsAdmin(localStorage.getItem('smr_admin_session') === 'authorized');
    setLocalIsPremium(media.isPremium);
    setLocalPrice(media.price || 'FREE');
  }, [media.id, media]);

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

    if (liked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
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

  const handleTogglePremium = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const targetPremium = !localIsPremium;
    let targetPrice = localPrice;

    if (targetPremium) {
      const inputPrice = prompt("Enter unlock price for this premium post:", "$9.99");
      if (inputPrice === null) return; // Cancelled
      targetPrice = inputPrice.trim() || '$9.99';
    } else {
      targetPrice = 'FREE';
    }

    // Optimistic UI update
    setLocalIsPremium(targetPremium);
    setLocalPrice(targetPrice);

    try {
      const res = await fetch('/api/media/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: media.url,
          isPremium: targetPremium,
          price: targetPrice,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setLocalIsPremium(!targetPremium);
        setLocalPrice(localPrice);
        alert('Failed to update premium status');
      }
    } catch (err) {
      setLocalIsPremium(!targetPremium);
      setLocalPrice(localPrice);
      console.error(err);
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

  const handlePremiumClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Log PREMIUM_UNLOCK_CLICK in Analytics database
    try {
      const visitorId = localStorage.getItem('smr_visitor_id') || 'anon';
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PREMIUM_UNLOCK_CLICK',
          path: window.location.pathname,
          visitorId,
          mediaId: media.id,
        }),
      });
    } catch (err) {
      console.error('Failed to track interested premium click:', err);
    }

    setIsMembershipOpen(true);
  };

  const isLocked = localIsPremium && !isAdmin;
  const formattedUrl = getCloudflareImageUrl(media.thumbnailUrl, 800);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={isLocked ? {} : { y: -6 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          if (isLocked) {
            handlePremiumClick(e);
          } else if (onSelect) {
            onSelect(media);
          }
        }}
        className={`masonry-item relative group rounded-2xl overflow-hidden glass-card border border-white/10 shadow-lg transition-all ${
          isLocked
            ? 'border-amber-500/30 hover:border-amber-500/50'
            : 'hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] cursor-pointer'
        }`}
      >
        {/* Heart Burst Animated Overlay */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0, y: 0 }}
              animate={{ scale: 1.4, opacity: 1, y: -40 }}
              exit={{ scale: 1.8, opacity: 0, y: -70 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            >
              <div className="p-4 rounded-full bg-red-600/30 backdrop-blur-md border border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.8)]">
                <Heart className="w-16 h-16 text-red-500 fill-red-500 drop-shadow-2xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Container */}
        <div className="relative w-full overflow-hidden bg-dark-card" style={{ aspectRatio: media.width && media.height ? `${media.width}/${media.height}` : '4/5' }}>
          <div className={`w-full h-full transition-all duration-700 ${isLocked ? 'blur-[10px] scale-105 pointer-events-none brightness-[0.55] contrast-[1.05]' : ''}`}>
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
          </div>

          {/* Premium Locked Overlay Stage */}
          {isLocked && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse">
                <Crown className="w-7 h-7 text-amber-400" />
              </div>
              
              <div className="space-y-1">
                <Badge className="bg-amber-500 text-black font-black text-[10px] tracking-widest uppercase">
                  Premium Locked
                </Badge>
                <h4 className="text-white font-bold text-sm line-clamp-1">{media.title}</h4>
                <p className="text-xs text-amber-300 font-semibold">{localPrice} to Unlock</p>
              </div>

              <Button
                onClick={handlePremiumClick}
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs px-4 h-9 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all rounded-xl"
              >
                Buy Premium to Unlock
              </Button>
            </div>
          )}

          {/* Gradient Blur Overlay */}
          {!isLocked && (
            <div className="absolute inset-0 bg-gradient-to-t from-dark-base/90 via-dark-base/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}

          {/* Top Badges & Actions */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase glass-panel text-white border border-white/10 shadow-sm flex items-center gap-1">
              {media.type === 'VIDEO' && <Play className="w-3 h-3 fill-violet-400 text-violet-400" />}
              {media.category?.name || 'Fashion'}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Admin Toggle Premium Button */}
              {mounted && isAdmin && (
                <button
                  onClick={handleTogglePremium}
                  className={`p-2 rounded-full border transition-all ${
                    localIsPremium 
                      ? 'bg-amber-500/25 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.35)]' 
                      : 'glass-panel border-white/10 text-white/60 hover:text-amber-400 hover:border-amber-500/30'
                  }`}
                  title={localIsPremium ? "Make Free (Admin)" : "Make Premium (Admin)"}
                >
                  <Crown className="w-3.5 h-3.5" />
                </button>
              )}

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

              {!isLocked && (
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full glass-panel border border-white/10 transition-all ${
                    mounted && isBookmarked ? 'text-violet-400 bg-white/20' : 'text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                  title="Save to bookmarks"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${mounted && isBookmarked ? 'fill-violet-400' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Hover Bottom Action & Metadata Overlay */}
          {!isLocked && (
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
                    className="flex items-center gap-1 text-[11px] hover:text-red-400 transition-colors group/like"
                  >
                    <Heart className={`w-3.5 h-3.5 transition-transform group-hover/like:scale-125 ${mounted && isLiked ? 'text-red-400 fill-red-400' : 'text-gray-400'}`} />
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
          )}
        </div>
      </motion.div>

      {/* Membership Pass Modal */}
      <MembershipModal isOpen={isMembershipOpen} onClose={() => setIsMembershipOpen(false)} />
    </>
  );
}
