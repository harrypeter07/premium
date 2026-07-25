'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Crown, Play, ArrowRight, Heart, Eye } from 'lucide-react';
import { MEDIA_ITEMS, CREATOR_PROFILE } from '@/lib/data/mockData';
import { getRecommendedFeed } from '@/lib/recommendations';
import MasonryFeed from '@/components/feed/MasonryFeed';
import CategoryBar from '@/components/feed/CategoryBar';
import MembershipModal from '@/components/monetization/MembershipModal';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);

  const recommendedItems = getRecommendedFeed(MEDIA_ITEMS, { recentCategorySlugs: [activeCategory] });
  const featuredItem = MEDIA_ITEMS.find((m) => m.isPinned) || MEDIA_ITEMS[0];
  const trendingItems = MEDIA_ITEMS.filter((m) => m.isTrending).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
      {/* Creator Hero Showcase Banner - Compact Padding & Rich Deep Violet */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-5 sm:p-8 shadow-2xl bg-gradient-to-r from-[#140f21] via-[#1a142c] to-[#140f21]">
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-purple/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-accent/20 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Creator Details */}
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Visual Portfolio</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Aesthetics, Haute Couture & <span className="gradient-text">Cinematic Stories.</span>
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {CREATOR_PROFILE.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => setIsMembershipOpen(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-accent text-white font-bold text-xs shadow-neon hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Join VIP Pass</span>
              </button>

              <Link
                href="/creator"
                className="px-5 py-2.5 rounded-full glass-card hover:bg-white/10 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <span>About Smriti Shah</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-purple" />
              </Link>
            </div>
          </div>

          {/* Featured Hero Media Card */}
          <div className="w-full lg:w-72 shrink-0">
            <Link href={`/media/${featuredItem.id}`} className="block group relative rounded-2xl overflow-hidden glass-card border border-brand-purple/40 shadow-neon">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={featuredItem.thumbnailUrl}
                  alt={featuredItem.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120e1d]/90 via-[#120e1d]/20 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-brand-purple text-white shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Pinned Feature
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-left space-y-1">
                  <h3 className="font-display font-bold text-xs text-white line-clamp-1">{featuredItem.title}</h3>
                  <p className="text-[10px] text-gray-300 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-brand-purple" /> {featuredItem.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-brand-accent" /> {featuredItem.likes.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-2">
        <CategoryBar
          activeCategory={activeCategory}
          onSelectCategory={(slug) => setActiveCategory(slug)}
        />
      </div>

      {/* Trending Carousel Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-brand-accent" />
            <h2 className="font-display font-bold text-lg text-white">Trending Archives</h2>
          </div>
          <Link href="/trending" className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {trendingItems.map((item) => (
            <Link
              key={item.id}
              href={`/media/${item.id}`}
              className="group relative rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-brand-purple/50 transition-all"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120e1d]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.type === 'VIDEO' && (
                  <span className="absolute top-2 right-2 p-1.5 rounded-full bg-[#120e1d]/80 text-white backdrop-blur">
                    <Play className="w-3 h-3 fill-white" />
                  </span>
                )}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-semibold text-white line-clamp-1">{item.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Recommendation Feed Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-white">Recommended For You</h2>
          <span className="text-xs text-gray-400 font-mono text-[11px]">AI Feed Scoring</span>
        </div>

        <MasonryFeed items={recommendedItems} />
      </div>

      {/* Membership Pass Modal */}
      <MembershipModal isOpen={isMembershipOpen} onClose={() => setIsMembershipOpen(false)} />
    </div>
  );
}
