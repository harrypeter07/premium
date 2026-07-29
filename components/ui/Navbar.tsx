'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Folder, Video, User, ShieldCheck, Search, Bookmark } from 'lucide-react';
import { getSavedBookmarks } from '@/lib/storage/localStorage';
import { Button } from '@/components/ui/button';

export default function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
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
    { name: 'Feed', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'Videos', href: '/videos' },
    { name: 'Creator', href: '/creator' },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'border-b border-white/8 bg-[#0d0917]/95 backdrop-blur-2xl shadow-lg'
          : 'bg-[#0d0917]/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">

        {/* Brand & Small Nav Links Row */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <span className="font-black text-xs text-white tracking-tighter">SS</span>
            </div>
            <span className="hidden xs:inline-block font-black text-xs text-white tracking-tight leading-none group-hover:text-violet-300 transition-colors">
              SMRITI SHAH
            </span>
          </Link>

          <div className="w-px h-4 bg-white/10 hidden xxs:block" />

          {/* Simple Row of Navigation Text Links directly visible everywhere */}
          <nav className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors duration-150 shrink-0 ${
                    active
                      ? 'text-violet-400 font-extrabold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Instagram direct profile link */}
          <a
            href="https://instagram.com/smriti.shans"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-fuchsia-400 hover:bg-white/5 transition-colors"
            title="Follow Smriti Shah on Instagram (@smriti.shans)"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSearch}
            className="h-8 w-8 text-zinc-400 hover:text-white"
            title="Search portfolio"
          >
            <Search className="w-4 h-4" />
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

          {/* Admin Studio Quick Button */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                size="sm"
                className="h-8 gap-1 text-[10px] bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white border-0 shadow-lg font-black uppercase tracking-wider px-2.5"
              >
                <ShieldCheck className="w-3 h-3" />
                <span className="hidden xs:inline">Studio</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
