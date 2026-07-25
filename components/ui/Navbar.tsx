'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles, Compass, Video, Image as ImageIcon, User,
  ShieldCheck, Menu, X, Search, Bookmark
} from 'lucide-react';
import { getSavedBookmarks } from '@/lib/storage/localStorage';
import { Button } from '@/components/ui/button';

export default function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsAdmin(localStorage.getItem('smr_admin_session') === 'authorized');
    check();
    const iv = setInterval(check, 1500);
    window.addEventListener('storage', check);
    return () => { clearInterval(iv); window.removeEventListener('storage', check); };
  }, []);

  useEffect(() => {
    const upd = () => setBookmarkCount(getSavedBookmarks().length);
    upd();
    window.addEventListener('smr_bookmarks_updated', upd);
    return () => window.removeEventListener('smr_bookmarks_updated', upd);
  }, []);

  const navLinks = [
    { name: 'Feed', href: '/', icon: Sparkles },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Videos', href: '/videos', icon: Video },
    { name: 'Photos', href: '/images', icon: ImageIcon },
    { name: 'Creator', href: '/creator', icon: User },
    ...(isAdmin ? [{ name: 'Admin Studio', href: '/admin', icon: ShieldCheck }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'border-b border-white/8 bg-[#0d0917]/95 backdrop-blur-2xl shadow-lg'
          : 'bg-[#0d0917]/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-6">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg">
            <span className="font-black text-xs text-white tracking-tighter">SS</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-black text-sm text-white tracking-tight leading-none group-hover:text-violet-300 transition-colors">SMRITI SHAH</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mt-0.5">Visual Portfolio</p>
          </div>
        </Link>

        <div className="w-px h-5 bg-white/10 hidden md:block" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide rounded-md transition-all duration-150 ${
                  active
                    ? 'text-white bg-white/8'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-violet-400' : ''}`} />
                {link.name}
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSearch}
            className="h-8 gap-2 text-zinc-400 hover:text-white text-xs hidden sm:flex border border-white/8 bg-white/3"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="text-[9px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-zinc-500">⌘K</kbd>
          </Button>

          {/* Bookmarks */}
          <Link href="/bookmarks">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white relative">
              <Bookmark className="w-4 h-4" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-violet-500 text-white text-[8px] font-bold flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Admin button — explicitly displays "Admin Studio" for authenticated admin */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white border-0 shadow-lg font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Studio</span>
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-8 w-8 text-zinc-400"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden overflow-hidden border-t border-white/8 bg-[#0d0917]/98"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? 'bg-violet-600/20 text-white border-l-2 border-violet-500'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-violet-400' : ''}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
