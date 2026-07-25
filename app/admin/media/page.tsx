'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import { ShieldCheck, ArrowLeft, Pin, Star, Trash2, Eye, Heart } from 'lucide-react';

export default function AdminMediaManagerPage() {
  const [items, setItems] = useState(MEDIA_ITEMS);

  const togglePin = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
  };

  const toggleFeatured = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFeatured: !item.isFeatured } : item))
    );
  };

  const deleteMedia = (id: string) => {
    if (confirm('Are you sure you want to delete this media archive?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Studio Dashboard</span>
      </Link>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Archive Management</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Media Manager ({items.length})</h1>
        </div>

        <Link href="/admin/upload" className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-neon">
          Upload New Asset
        </Link>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="text-[10px] uppercase font-mono text-gray-500 border-b border-white/10">
            <tr>
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Views</th>
              <th className="py-3 px-4">Likes</th>
              <th className="py-3 px-4">Pinned</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5">
                <td className="py-3 px-4">
                  <img src={item.thumbnailUrl} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                </td>
                <td className="py-3 px-4 font-bold text-white max-w-xs truncate">{item.title}</td>
                <td className="py-3 px-4 font-mono">{item.type}</td>
                <td className="py-3 px-4">{item.category.name}</td>
                <td className="py-3 px-4 font-mono font-bold text-white">{item.views.toLocaleString()}</td>
                <td className="py-3 px-4 font-mono text-brand-purple">{item.likes.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <button onClick={() => togglePin(item.id)} className={`p-1.5 rounded-lg ${item.isPinned ? 'bg-brand-purple text-white' : 'text-gray-500 hover:text-white'}`}>
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => toggleFeatured(item.id)} className={`p-1.5 rounded-lg ${item.isFeatured ? 'bg-brand-accent text-white' : 'text-gray-500 hover:text-white'}`}>
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => deleteMedia(item.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
