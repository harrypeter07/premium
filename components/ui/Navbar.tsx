'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, Compass, Video, Image as ImageIcon, User, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { getSavedBookmarks } from '@/lib/storage/localStorage';

export default function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      setBookmarkCount(getSavedBookmarks().length);
    };
    updateCount();
    window.addEventListener('smr_bookmarks_updated', updateCount);
    return () => window.removeEventListener('smr_bookmarks_updated', updateCount);
  }, []);

  // 5 Streamlined Essential Tabs
  const navLinks = [
    { name: 'Feed', href: '/', icon: Sparkles },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Videos', href: '/videos', icon: Video },
    { name: 'Photos', href: '/images', icon: ImageIcon },
    { name: 'Creator', href: '/creator', icon: User },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#120e1d]/90 backdrop-blur-xl border-b border-white/10 py-2.5 shadow-2xl'
          : 'bg-gradient-to-b from-[#120e1d]/95 via-[#120e1d]/60 to-transparent py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-accent p-[1px] shadow-neon">
            <div className="w-full h-full bg-[#181326] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-all">
              <span className="font-display font-black text-base text-white tracking-tighter">SS</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight leading-none group-hover:text-brand-purple transition-colors">
              SMRITI SHAH
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">
              Visual Portfolio
            </span>
          </div>
        </Link>

        {/* Streamlined Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 glass-panel px-3 py-1 rounded-full border border-white/10">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-brand-purple/35 to-brand-accent/35 rounded-full border border-brand-purple/50 shadow-neon"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-brand-purple' : ''}`} />
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card hover:border-brand-purple/40 text-gray-300 hover:text-white transition-all text-xs"
            aria-label="Search media"
          >
            <Search className="w-3.5 h-3.5 text-brand-purple" />
            <span className="hidden sm:inline font-medium text-[11px]">Search...</span>
            <kbd className="hidden lg:inline text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono">⌘K</kbd>
          </button>

          {/* Bookmarks Counter */}
          <Link
            href="/bookmarks"
            className="relative p-2 rounded-full glass-card hover:border-brand-purple/40 text-gray-300 hover:text-white transition-all"
            title="Saved Bookmarks"
          >
            <Bookmark className="w-4 h-4 text-brand-purple" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-accent text-white text-[9px] font-bold flex items-center justify-center shadow-lg">
                {bookmarkCount}
              </span>
            )}
          </Link>

          {/* Admin Dashboard Entry */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-accent text-white text-xs font-semibold hover:opacity-90 shadow-neon transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full glass-card text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-5 mt-2 shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-purple/30 to-brand-accent/30 border border-brand-purple/50 text-white'
                        : 'bg-white/5 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-brand-purple" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-semibold text-xs shadow-neon mt-1"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Studio Dashboard</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
