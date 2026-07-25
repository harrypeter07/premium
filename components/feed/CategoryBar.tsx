'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CATEGORIES_LIST } from '@/lib/data/mockData';
import { Sparkles, Flame, Grid } from 'lucide-react';

interface CategoryBarProps {
  activeCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

export default function CategoryBar({ activeCategory = 'all', onSelectCategory }: CategoryBarProps) {
  const allCategories = [
    { id: 'cat-all', name: 'All Archives', slug: 'all' },
    ...CATEGORIES_LIST.map(c => ({ id: c.id, name: c.name, slug: c.slug })),
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-2 flex items-center gap-2">
      {allCategories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
            className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white glass-panel hover:border-white/20'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryIndicator"
                className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-accent rounded-full shadow-neon"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            {cat.slug === 'all' && <Sparkles className="w-3.5 h-3.5 relative z-10 text-white" />}
            {cat.slug === 'trending' && <Flame className="w-3.5 h-3.5 relative z-10 text-white" />}
            <span className="relative z-10">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
