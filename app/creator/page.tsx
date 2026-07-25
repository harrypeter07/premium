'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CREATOR_PROFILE } from '@/lib/data/mockData';
import { Camera, Video, Share2, MapPin, Eye, Users, Film, Send, CheckCircle, Sparkles } from 'lucide-react';

export default function CreatorPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Cover Header Stage */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 h-72 sm:h-96 shadow-2xl">
        <Image src={CREATOR_PROFILE.coverUrl} alt="Cover" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070b] via-[#08070b]/40 to-transparent" />
      </div>

      {/* Profile Bio Bar */}
      <div className="relative -mt-24 sm:-mt-32 z-10 px-4 sm:px-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-1 bg-gradient-to-tr from-brand-purple to-brand-accent shadow-neon relative">
            <Image src={CREATOR_PROFILE.avatarUrl} alt={CREATOR_PROFILE.name} fill className="object-cover rounded-[22px]" />
          </div>
          <div className="space-y-1 pb-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display font-black text-2xl sm:text-4xl text-white">{CREATOR_PROFILE.name}</h1>
              <CheckCircle className="w-5 h-5 text-brand-purple fill-brand-purple/20" />
            </div>
            <p className="text-sm font-semibold text-brand-purple">{CREATOR_PROFILE.role}</p>
            <p className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5" /> {CREATOR_PROFILE.location}
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 pb-2">
          <a href={CREATOR_PROFILE.socials.instagram} target="_blank" rel="noreferrer" className="p-3 rounded-full glass-card hover:border-brand-purple/50 text-white">
            <Camera className="w-4 h-4" />
          </a>
          <a href={CREATOR_PROFILE.socials.youtube} target="_blank" rel="noreferrer" className="p-3 rounded-full glass-card hover:border-brand-purple/50 text-white">
            <Video className="w-4 h-4" />
          </a>
          <a href={CREATOR_PROFILE.socials.twitter} target="_blank" rel="noreferrer" className="p-3 rounded-full glass-card hover:border-brand-purple/50 text-white">
            <Share2 className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase">Total Views</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{CREATOR_PROFILE.stats.totalViews}</p>
        </div>
        <div className="p-6 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase">Followers</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{CREATOR_PROFILE.stats.totalFollowers}</p>
        </div>
        <div className="p-6 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase">Media Items</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{CREATOR_PROFILE.stats.totalMedia}</p>
        </div>
        <div className="p-6 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase">Monthly Reach</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{CREATOR_PROFILE.stats.monthlyReach}</p>
        </div>
      </div>

      {/* Press Kit & Sponsorship Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Biography */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-purple" />
            <span>Creative Direction & Biography</span>
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Elena Vance is an international fashion model, photographer, and creative director based between Paris and New York. Having walked for leading fashion houses in Milan, Paris, and Tokyo, she curates this platform to showcase high-resolution fine art imagery, editorial films, and behind-the-scenes studio archives.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Available for haute couture campaigns, luxury brand ambassadorships, architectural commissions, and magazine cover stories.
          </p>
        </div>

        {/* Sponsorship Inquiry */}
        <div className="glass-panel p-8 rounded-3xl border border-brand-purple/40 space-y-4 shadow-neon">
          <h2 className="font-display font-bold text-2xl text-white">Sponsorship & Booking Inquiries</h2>
          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-brand-purple/20 border border-brand-purple/50 text-center text-white space-y-2">
              <CheckCircle className="w-8 h-8 text-brand-purple mx-auto" />
              <h3 className="font-bold text-base">Inquiry Submitted Successfully</h3>
              <p className="text-xs text-gray-300">Elena&apos;s management team will review your booking proposal and respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Your Name / Brand</label>
                <input required type="text" placeholder="e.g. Saint Laurent Press Office" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Corporate Email</label>
                <input required type="email" placeholder="contact@brand.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Campaign Details & Budget</label>
                <textarea required rows={4} placeholder="Describe campaign scope, dates, and sponsorship budget..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-bold text-xs shadow-neon hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>Submit Partnership Proposal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
