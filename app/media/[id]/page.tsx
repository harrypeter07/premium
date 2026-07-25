'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import VideoPlayer from '@/components/media/VideoPlayer';
import MasonryFeed from '@/components/feed/MasonryFeed';
import { Heart, Bookmark, Eye, Share2, Download, Sparkles, ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';
import { getSavedBookmarks, toggleBookmarkStorage, getSavedLikes, toggleLikeStorage, addToWatchHistory } from '@/lib/storage/localStorage';
import { generateMediaJsonLd } from '@/lib/seo';

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const media = MEDIA_ITEMS.find((m) => m.id === id) || MEDIA_ITEMS[0];

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(media.likes);

  useEffect(() => {
    if (media) {
      setIsBookmarked(getSavedBookmarks().includes(media.id));
      setIsLiked(getSavedLikes().includes(media.id));
      setLikesCount(media.likes);
      addToWatchHistory(media.id);
    }
  }, [media]);

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
              title={media.title}
              mediaId={media.id}
              resolutions={media.resolutions}
              autoPlay={true}
            />
          ) : (
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl">
              <Image src={media.url} alt={media.altText || media.title} fill className="object-cover" priority />
            </div>
          )}

          {/* Details Card */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-purple/20 border border-brand-purple/40 text-brand-purple">
                {media.category.name}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Published {new Date(media.publishedAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">{media.title}</h1>
            <p className="text-sm text-gray-300 leading-relaxed">{media.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {media.tags.map((tag) => (
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

            {/* Affiliate Showcase */}
            {media.affiliateProducts && media.affiliateProducts.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Featured Runway Apparel</span>
                </h3>
                {media.affiliateProducts.map((prod) => (
                  <a
                    key={prod.id}
                    href={prod.affiliateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl glass-card hover:border-brand-purple/50 transition-all group"
                  >
                    <img src={prod.imageUrl} alt={prod.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{prod.title}</p>
                      <p className="text-[11px] text-gray-400">{prod.brand} • <span className="text-brand-purple font-bold">{prod.price}</span></p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            )}

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
      <div className="space-y-6 pt-8 border-t border-white/10">
        <h2 className="font-display font-bold text-2xl text-white">More From {media.category.name}</h2>
        <MasonryFeed items={MEDIA_ITEMS.filter((m) => m.id !== media.id && m.category.slug === media.category.slug)} />
      </div>
    </div>
  );
}
