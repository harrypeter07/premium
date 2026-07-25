'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MediaItem } from '@/lib/types';
import VideoPlayer from '@/components/media/VideoPlayer';
import MasonryFeed from '@/components/feed/MasonryFeed';
import {
  Heart, Bookmark, Share2, Download, Sparkles, ArrowLeft,
  MessageSquare, Star, Maximize2, X, Send, AlertCircle, Eye, User
} from 'lucide-react';
import {
  getSavedBookmarks, toggleBookmarkStorage, getSavedLikes, toggleLikeStorage,
  addToWatchHistory, getCommentsForMedia, addCommentForMedia, CommentItem,
  getRatingForMedia, setRatingForMedia, getPersistentUploadedMedia
} from '@/lib/storage/localStorage';
import { generateMediaJsonLd } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cleanOrGenerateTitle, cleanOrGenerateDescription } from '@/lib/utils/captionHelper';

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive states
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        let items: MediaItem[] = data.media || [];
        // Combine with persistent local storage uploads to guarantee items are never lost on redeploys!
        const localUploaded = getPersistentUploadedMedia();
        if (localUploaded.length > 0) {
          const merged = [...items, ...localUploaded.filter(l => !items.some(i => i.id === l.id))];
          items = merged;
        }
        setMediaList(items);
      })
      .catch(() => {
        const localUploaded = getPersistentUploadedMedia();
        if (localUploaded.length > 0) setMediaList(localUploaded);
      })
      .finally(() => setLoading(false));
  }, []);

  const media = mediaList.find((m) => m.id === id);

  useEffect(() => {
    if (media) {
      setIsBookmarked(getSavedBookmarks().includes(media.id));
      setIsLiked(getSavedLikes().includes(media.id));
      setLikesCount(media.likes || 0);
      setRating(getRatingForMedia(media.id));
      setComments(getCommentsForMedia(media.id));
      addToWatchHistory(media.id);
    }
  }, [media]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-zinc-500">
        Loading visual archive...
      </div>
    );
  }

  if (!media) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Card className="p-8 border border-zinc-800 bg-[#140f21]">
          <AlertCircle className="w-10 h-10 text-violet-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Archive Not Found</h2>
          <p className="text-xs text-zinc-400">The requested media item does not exist or has been removed.</p>
          <Link href="/" className="block mt-4">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">Return to Feed</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleBookmark = () => {
    const saved = toggleBookmarkStorage(media.id);
    setIsBookmarked(saved);
  };

  const handleLike = () => {
    const liked = toggleLikeStorage(media.id);
    setIsLiked(liked);
    setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
  };

  const handleRate = (stars: number) => {
    setRating(stars);
    setRatingForMedia(media.id, stars);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = addCommentForMedia(media.id, commentAuthor || 'Guest Fan', commentText);
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: media.title,
        text: media.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const jsonLdData = generateMediaJsonLd(media);
  const displayTitle = cleanOrGenerateTitle(media.title);
  const displayDescription = cleanOrGenerateDescription(media.description);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Inject SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Feed</span>
      </button>

      {/* Main Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Media Stage */}
        <div className="lg:col-span-2 space-y-6">
          {media.type === 'VIDEO' ? (
            <VideoPlayer
              url={media.url}
              thumbnailUrl={media.thumbnailUrl}
              title={displayTitle}
              mediaId={media.id}
              resolutions={media.resolutions}
              autoPlay={true}
            />
          ) : (
            <div className="relative group w-full aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl bg-zinc-950">
              <img
                src={media.url}
                alt={displayTitle}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsFullscreen(true)}
              />
              {/* Fullscreen Button Overlay */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 opacity-90 hover:opacity-100 transition-all shadow-2xl flex items-center gap-2 text-xs font-semibold"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Fullscreen</span>
              </button>
            </div>
          )}

          {/* Details & Description Card */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-violet-500/40 text-violet-400 text-xs">
                {media.category?.name || 'Fashion Editorial'}
              </Badge>
              <span className="text-xs text-gray-400 font-mono">
                Published {new Date(media.publishedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">{displayTitle}</h1>
            <p className="text-sm text-gray-300 leading-relaxed">{displayDescription}</p>

            {/* 5-Star Rating System */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-zinc-400">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRate(star)} className="focus:outline-none transition-transform hover:scale-110">
                    <Star className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`} />
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">{rating}.0 / 5.0</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(media.tags || ['SmritiShah', 'Editorial']).map((tag) => (
                <span key={tag} className="text-xs text-gray-400 glass-card px-3 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Comments Section */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                <h3 className="font-bold text-lg text-white">Comments ({comments.length})</h3>
              </div>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="text-xs bg-white/5 border-white/10"
                />
                <Input
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment on this visual archive..."
                  className="sm:col-span-2 text-xs bg-white/5 border-white/10"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5 h-8 text-xs">
                  <Send className="w-3.5 h-3.5" />
                  Post Comment
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {comments.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono text-center py-4">
                  No comments yet. Be the first to comment on this archive!
                </p>
              ) : (
                comments.map((comm) => (
                  <div key={comm.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-violet-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-violet-400" />
                        {comm.userName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(comm.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed pl-5">{comm.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between text-xs">
              <button onClick={handleLike} className="flex items-center gap-2 text-white font-semibold hover:text-brand-accent transition-colors">
                <Heart className={`w-5 h-5 ${isLiked ? 'text-brand-accent fill-brand-accent' : 'text-gray-400'}`} />
                <span>{likesCount.toLocaleString()} Likes</span>
              </button>

              <button onClick={handleBookmark} className="flex items-center gap-2 text-white font-semibold hover:text-brand-purple transition-colors">
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-brand-purple fill-brand-purple' : 'text-gray-400'}`} />
                <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>

              <button onClick={handleShare} className="p-2.5 rounded-full glass-card text-gray-300 hover:text-white">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <a
              href={media.url}
              target="_blank"
              rel="noreferrer"
              download
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-bold text-xs text-center shadow-neon hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Resolution</span>
            </a>
          </div>
        </div>
      </div>

      {/* Recommended Related Archives */}
      {mediaList.length > 1 && (
        <div className="space-y-6 pt-8 border-t border-white/10">
          <h2 className="font-display font-bold text-2xl text-white">More Archives</h2>
          <MasonryFeed items={mediaList.filter((m) => m.id !== media.id)} />
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && media.type === 'IMAGE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <img
              src={media.url}
              alt={displayTitle}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-sm font-semibold text-white mt-4 text-center">{displayTitle}</p>
          </div>
        </div>
      )}
    </div>
  );
}
