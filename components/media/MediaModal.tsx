'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Bookmark, Eye, Download, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import VideoPlayer from './VideoPlayer';
import { getSavedBookmarks, toggleBookmarkStorage, getSavedLikes, toggleLikeStorage, addToWatchHistory } from '@/lib/storage/localStorage';
import { MEDIA_ITEMS } from '@/lib/data/mockData';

interface MediaModalProps {
  media: MediaItem | null;
  onClose: () => void;
  onSelectMedia?: (media: MediaItem) => void;
}

export default function MediaModal({ media, onClose }: MediaModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<string[]>([
    'Absolute perfection! The lighting in this shoot is divine. ✨',
    'Where is this outfit from? Looking stunning as always! 🔥',
    'The color grading on this 35mm film shot is unreal.',
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (media) {
      setIsBookmarked(getSavedBookmarks().includes(media.id));
      setIsLiked(getSavedLikes().includes(media.id));
      setLikesCount(media.likes);
      addToWatchHistory(media.id);
    }
  }, [media]);

  if (!media) return null;

  const handleBookmark = () => {
    const saved = toggleBookmarkStorage(media.id);
    setIsBookmarked(saved);
  };

  const handleLike = () => {
    const liked = toggleLikeStorage(media.id);
    setIsLiked(liked);
    setLikesCount(prev => (liked ? prev + 1 : prev - 1));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([newComment, ...comments]);
    setNewComment('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-[#0d0917]/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#181326] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row my-auto"
        >
          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full glass-panel border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Media Stage - Deep Violet (No Pure Black) */}
          <div className="lg:w-2/3 bg-[#120e1d] flex items-center justify-center relative min-h-[320px] lg:min-h-[550px] border-b lg:border-b-0 lg:border-r border-white/10">
            {media.type === 'VIDEO' ? (
              <div className="w-full h-full flex items-center justify-center p-2">
                <VideoPlayer
                  url={media.url}
                  thumbnailUrl={media.thumbnailUrl}
                  title={media.title}
                  mediaId={media.id}
                  resolutions={media.resolutions}
                  autoPlay={true}
                />
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[380px] max-h-[70vh] flex items-center justify-center p-4">
                <Image
                  src={media.url}
                  alt={media.altText || media.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>

          {/* Right Sidebar Details */}
          <div className="lg:w-1/3 p-5 flex flex-col justify-between overflow-y-auto max-h-[85vh] lg:max-h-full space-y-4">
            <div>
              {/* Category Pill & Visibility */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-purple/20 border border-brand-purple/40 text-brand-purple">
                  {media.category.name}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {new Date(media.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Media Title & Description */}
              <h2 className="font-display font-bold text-lg text-white mb-1.5 leading-snug">
                {media.title}
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3">
                {media.description}
              </p>

              {/* Engagement Stats Bar */}
              <div className="flex items-center gap-4 py-2.5 border-y border-white/10 text-xs text-gray-300">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1.5 hover:text-brand-accent transition-colors font-medium"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'text-brand-accent fill-brand-accent' : ''}`} />
                  <span>{likesCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className="flex items-center gap-1.5 hover:text-brand-purple transition-colors font-medium"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-brand-purple fill-brand-purple' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <span className="flex items-center gap-1 text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{media.views.toLocaleString()}</span>
                </span>
              </div>

              {/* Tag Cloud */}
              <div className="mt-3 flex flex-wrap gap-1">
                {media.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-gray-400 hover:text-white glass-card px-2 py-0.5 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Affiliate Product Showcase if available */}
              {media.affiliateProducts && media.affiliateProducts.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-purple" />
                    <span>Featured Items</span>
                  </h4>
                  <div className="space-y-1.5">
                    {media.affiliateProducts.map((prod) => (
                      <a
                        key={prod.id}
                        href={prod.affiliateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-xl glass-card hover:border-brand-purple/50 transition-all group"
                      >
                        <img src={prod.imageUrl} alt={prod.title} className="w-9 h-9 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{prod.title}</p>
                          <p className="text-[10px] text-gray-400">{prod.brand} • <span className="text-brand-purple font-bold">{prod.price}</span></p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Comments */}
              <div className="mt-4 space-y-2">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-brand-purple" />
                  <span>Comments ({comments.length})</span>
                </h4>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-brand-purple text-white font-semibold text-xs rounded-xl hover:bg-brand-accent transition-colors">
                    Post
                  </button>
                </form>

                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {comments.map((c, i) => (
                    <div key={i} className="p-2 rounded-xl bg-white/5 text-[11px] text-gray-300">
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Action */}
            <div className="pt-3 border-t border-white/10">
              <a
                href={media.url}
                target="_blank"
                rel="noreferrer"
                download
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl glass-card hover:bg-white/10 text-white font-semibold text-xs transition-all"
              >
                <Download className="w-4 h-4 text-brand-purple" />
                <span>Download Resolution</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
