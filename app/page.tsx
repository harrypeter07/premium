'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Crown, ArrowRight, ShieldCheck, Film, Image as ImageIcon } from 'lucide-react';
import { CREATOR_PROFILE } from '@/lib/data/mockData';
import { getRecommendedFeed } from '@/lib/recommendations';
import MasonryFeed from '@/components/feed/MasonryFeed';
import CategoryBar from '@/components/feed/CategoryBar';
import MembershipModal from '@/components/monetization/MembershipModal';
import { MediaItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPersistentUploadedMedia } from '@/lib/storage/localStorage';
import { cleanOrGenerateTitle } from '@/lib/utils/captionHelper';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        let items: MediaItem[] = data.media || [];
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

  const recommendedItems = getRecommendedFeed(mediaList, { recentCategorySlugs: [activeCategory] });
  const featuredItem = mediaList.find((m) => m.isPinned) || mediaList[0];
  const trendingItems = mediaList.filter((m) => m.isTrending).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
      {/* Creator Hero Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-5 sm:p-8 shadow-2xl bg-gradient-to-r from-[#140f21] via-[#1a142c] to-[#140f21]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-purple/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-accent/20 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Creator Details */}
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <Badge variant="default" className="gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Visual Portfolio</span>
            </Badge>

            <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Aesthetics, Haute Couture &amp; <span className="gradient-text">Cinematic Stories.</span>
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {CREATOR_PROFILE.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Button
                onClick={() => setIsMembershipOpen(true)}
                variant="default"
                className="bg-gradient-to-r from-brand-purple to-brand-accent hover:opacity-90 transition-opacity gap-2"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Join VIP Pass</span>
              </Button>

              <Link href="/creator">
                <Button variant="outline" className="gap-1.5">
                  <span>About Smriti Shah</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-purple" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Featured Hero Media Card */}
          {featuredItem && (
            <div className="w-full lg:w-72 shrink-0">
              <Link href={`/media/${featuredItem.id}`} className="block group relative rounded-2xl overflow-hidden border border-brand-purple/40 shadow-neon">
                <div className="relative aspect-[3/4] w-full bg-zinc-900">
                  <img
                    src={featuredItem.thumbnailUrl}
                    alt={featuredItem.title}
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120e1d]/90 via-[#120e1d]/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-brand-purple text-white shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Pinned Feature
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-left space-y-1">
                    <h3 className="font-display font-bold text-xs text-white line-clamp-1">
                      {cleanOrGenerateTitle(featuredItem.title)}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-2">
        <CategoryBar
          activeCategory={activeCategory}
          onSelectCategory={(slug) => setActiveCategory(slug)}
        />
      </div>

      {/* Empty State / Uploaded Media Grid / Skeleton Loader */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-[3/4] rounded-2xl bg-zinc-800/60 animate-pulse border border-zinc-800" />
          ))}
        </div>
      ) : mediaList.length === 0 ? (
        /* Empty State Card - Shadcn Style */
        <Card className="max-w-md mx-auto p-8 border-dashed border-white/20 text-center space-y-4 bg-[#140f21]/80">
          <div className="w-12 h-12 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mx-auto">
            <Film className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg">No Archives Published Yet</CardTitle>
            <CardDescription className="text-xs">
              This visual portfolio is ready. Log in to the Admin Studio dashboard to upload your first high-fashion editorial.
            </CardDescription>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="mt-2 gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-purple" />
              <span>Access Studio Login</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Trending Carousel Section */}
          {trendingItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-brand-accent" />
                  <h2 className="font-display font-bold text-lg text-white">Trending Archives</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {trendingItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/media/${item.id}`}
                    className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-brand-purple/50 transition-all bg-[#181326]"
                  >
                    <div className="relative aspect-[4/5] w-full">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#120e1d]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs font-semibold text-white line-clamp-1">{cleanOrGenerateTitle(item.title)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Main Recommendation Feed Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-white">Recommended For You</h2>
              <span className="text-xs text-gray-400 font-mono text-[11px]">AI Feed Scoring</span>
            </div>

            <MasonryFeed items={recommendedItems} />
          </div>
        </>
      )}

      {/* Membership Pass Modal */}
      <MembershipModal isOpen={isMembershipOpen} onClose={() => setIsMembershipOpen(false)} />
    </div>
  );
}
