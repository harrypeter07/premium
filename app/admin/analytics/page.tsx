'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_ANALYTICS_SUMMARY } from '@/lib/data/mockData';
import { Activity, ArrowLeft, BarChart3, PieChart, Globe, Smartphone, Clock, Eye } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const stats = MOCK_ANALYTICS_SUMMARY;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Studio Dashboard</span>
      </Link>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Real-time Analytics Engine</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Deep Performance Telemetry</h1>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2">
          <span className="text-xs text-gray-400 font-mono uppercase">Avg Watch Completion</span>
          <p className="font-display font-black text-3xl text-white">78.5%</p>
          <p className="text-xs text-emerald-400 font-medium">+4.2% higher completion rate</p>
        </div>
        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2">
          <span className="text-xs text-gray-400 font-mono uppercase">Average Watch Time</span>
          <p className="font-display font-black text-3xl text-white">{stats.avgWatchTime}</p>
          <p className="text-xs text-gray-400">Video session retention</p>
        </div>
        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2">
          <span className="text-xs text-gray-400 font-mono uppercase">Scroll Depth Index</span>
          <p className="font-display font-black text-3xl text-white">{stats.scrollDepth}%</p>
          <p className="text-xs text-gray-400">Feed engagement depth</p>
        </div>
      </div>

      {/* Devices & Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-purple" />
            <span>Device Breakdown</span>
          </h2>
          <div className="space-y-3">
            {stats.deviceBreakdown.map((d) => (
              <div key={d.device} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{d.device}</span>
                  <span className="font-mono font-bold text-white">{d.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-purple to-brand-accent" style={{ width: `${d.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-purple" />
            <span>Geographic Footprint</span>
          </h2>
          <div className="space-y-2">
            {stats.topCountries.map((c) => (
              <div key={c.country} className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-xs text-gray-300">
                <span className="flex items-center gap-2"><span>{c.flag}</span><span>{c.country}</span></span>
                <span className="font-mono font-bold text-white">{c.visitors.toLocaleString()} visitors</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
