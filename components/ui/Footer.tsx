'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Video, Share2, Rss, Heart, Shield, ArrowUpRight, Mail } from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/data/mockData';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#130f1f] relative overflow-hidden text-gray-400">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-brand-purple/10 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Creator Bio Column */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-accent p-[1px] shadow-neon">
                <div className="w-full h-full bg-[#181326] rounded-[11px] flex items-center justify-center">
                  <span className="font-display font-black text-sm text-white">SS</span>
                </div>
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">SMRITI SHAH</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              High-resolution visual archives, haute couture editorial films, travel diaries, and minimal aesthetics by Smriti Shah (@smriti.shans).
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com/smriti.shans"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white hover:border-brand-purple/50 transition-all"
                aria-label="Instagram Profile"
              >
                <Camera className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:smritishans@gmail.com"
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white hover:border-brand-purple/50 transition-all"
                title="Email Smriti Shah"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com/smriti.shans"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white hover:border-brand-purple/50 transition-all"
                aria-label="Twitter Profile"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/feed.xml"
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-brand-purple transition-all"
                title="RSS Feed"
              >
                <Rss className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-[11px] uppercase font-bold tracking-widest text-white mb-3">Discovery</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/explore" className="hover:text-white transition-colors">Explore Feed</Link></li>
              <li><Link href="/videos" className="hover:text-white transition-colors">Video Vault</Link></li>
              <li><Link href="/images" className="hover:text-white transition-colors">Photo Galleries</Link></li>
              <li><Link href="/trending" className="hover:text-white transition-colors">Trending Now</Link></li>
              <li><Link href="/bookmarks" className="hover:text-white transition-colors">Saved Collections</Link></li>
              <li><Link href="/history" className="hover:text-white transition-colors">Watch History</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-[11px] uppercase font-bold tracking-widest text-white mb-3">Categories</h3>
            <ul className="space-y-2 text-xs">
              {CATEGORIES_LIST.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Legal Column */}
          <div>
            <h3 className="text-[11px] uppercase font-bold tracking-widest text-white mb-3">Information</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/creator" className="hover:text-white transition-colors flex items-center gap-1"><span>About Smriti Shah</span> <ArrowUpRight className="w-3 h-3 text-brand-purple" /></Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Sponsorships & Press</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1"><Shield className="w-3 h-3 text-brand-purple" /><span>Admin Portal</span></Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Smriti Shah Archives. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <span>Curated with</span>
            <Heart className="w-3 h-3 text-brand-accent fill-brand-accent inline" />
            <span>for ultra-fast media streaming</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
