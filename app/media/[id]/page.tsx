'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MediaItem } from '@/lib/types';
import VideoPlayer from '@/components/media/VideoPlayer';
import MasonryFeed from '@/components/feed/MasonryFeed';
import { Heart, Bookmark, Share2, Download, Sparkles, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { getSavedBookmarks, toggleBookmarkStorage, getSavedLikes, toggleLikeStorage, addToWatchHistory } from '@/lib/storage/localStorage';
import { generateMediaJsonLd } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cleanOrGenerateTitle, cleanOrGenerateDescription } from '@/lib/utils/captionHelper';

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.media) setMediaList(data.media);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const media = mediaList.find((m) => m.id === id);

  useEffect(() => {
    if (media) {
      setIsBookmarked(getSavedBookmarks().includes(media.id));
      setIsLiked(getSavedLikes().includes(media.id));
      setLikesCount(media.likes || 0);
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
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl">
              <img src={media.url} alt={displayTitle} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Details Card */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-purple/20 border border-brand-purple/40 text-brand-purple">
                {media.category?.name || 'Fashion'}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Published {new Date(media.publishedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">{displayTitle}</h1>
            <p className="text-sm text-gray-300 leading-relaxed">{displayDescription}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(media.tags || ['SmritiShah']).map((tag) => (
                <span key={tag} className="text-xs text-gray-400 glass-card px-3 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
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
    </div>
  );
}
