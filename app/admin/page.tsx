'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_ANALYTICS_SUMMARY, MEDIA_ITEMS } from '@/lib/data/mockData';
import { ShieldCheck, Users, DollarSign, Activity, Upload, ArrowUpRight, Server, Lock, Key, LogOut } from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('smr_admin_session');
    if (authStatus === 'authorized') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode.trim() !== '') {
      localStorage.setItem('smr_admin_session', 'authorized');
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Admin Passcode. Use "admin123" for instant studio access.');
    }
  };

  const handleQuickDemoAccess = () => {
    localStorage.setItem('smr_admin_session', 'authorized');
    setIsAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('smr_admin_session');
    setIsAuthenticated(false);
  };

  const stats = MOCK_ANALYTICS_SUMMARY;

  // Unauthenticated Admin Portal Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="glass-panel p-8 rounded-3xl border border-brand-purple/40 shadow-neon text-center space-y-6 text-white relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center text-brand-purple mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl text-white">Studio Admin Access</h1>
            <p className="text-xs text-gray-300">Enter master studio passcode to access management tools.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs text-left">
            <div>
              <label className="block text-gray-400 mb-1 font-mono uppercase text-[10px]">Studio Passcode</label>
              <input
                type="password"
                placeholder="Enter passcode (e.g. admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple"
              />
              {errorMsg && <p className="text-red-400 text-[11px] mt-1">{errorMsg}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-bold text-xs shadow-neon hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Authorize Admin Session</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/10">
            <button
              onClick={handleQuickDemoAccess}
              className="w-full py-2.5 rounded-xl glass-card hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-xs transition-all"
            >
              ⚡ Instant 1-Click Studio Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Smriti Shah Studio Control Center</span>
          </div>
          <h1 className="font-display font-black text-3xl text-white">Platform Analytics & Operations</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/upload"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-bold text-xs shadow-neon hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Media</span>
          </Link>

          <button
            onClick={handleAdminLogout}
            className="p-2.5 rounded-xl glass-card text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-all"
            title="Lock Session / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Realtime & Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Realtime Active */}
        <div className="p-6 rounded-2xl glass-card border border-brand-purple/40 shadow-neon space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Live Active Visitors</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="font-display font-black text-4xl text-white">{stats.realtimeVisitors}</p>
          <p className="text-xs text-emerald-400 font-medium">Currently browsing feed</p>
        </div>

        {/* Monthly Traffic */}
        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Monthly Visitors</span>
            <Users className="w-4 h-4 text-brand-purple" />
          </div>
          <p className="font-display font-black text-3xl text-white">{stats.monthlyVisitors.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Unique monthly reach</p>
        </div>

        {/* AdSense Revenue */}
        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Est. AdSense Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-display font-black text-3xl text-white">${stats.adRevenue.totalEarnings.toLocaleString()}</p>
          <p className="text-xs text-gray-400">RPM: ${stats.adRevenue.rpm} • CTR: {stats.adRevenue.ctr}%</p>
        </div>

        {/* Avg Session Duration */}
        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Avg Session Duration</span>
            <Activity className="w-4 h-4 text-brand-purple" />
          </div>
          <p className="font-display font-black text-3xl text-white">{stats.avgSessionDuration}</p>
          <p className="text-xs text-gray-400">Pages/Session: {stats.pagesPerSession}</p>
        </div>
      </div>

      {/* Analytics Breakdown & Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Traffic Sources & Top Countries */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <h2 className="font-display font-bold text-xl text-white">Audience Distribution & Traffic Channels</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase">Acquisition Channels</h3>
              <div className="space-y-2">
                {stats.trafficSources.map((src) => (
                  <div key={src.source} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span>{src.source}</span>
                      <span className="font-mono font-bold text-white">{src.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-purple to-brand-accent" style={{ width: `${src.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase">Top Geographic Regions</h3>
              <div className="space-y-2">
                {stats.topCountries.map((c) => (
                  <div key={c.country} className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs text-gray-300">
                    <span className="flex items-center gap-2"><span>{c.flag}</span><span>{c.country}</span></span>
                    <span className="font-mono font-bold text-white">{c.visitors.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure & Edge Health */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-brand-purple" />
            <span>Infrastructure Health</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">CDN Cache Hit Ratio</span>
              <span className="font-mono font-bold text-emerald-400">{stats.systemHealth.cdnCacheHitRatio}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">API Gateway Latency</span>
              <span className="font-mono font-bold text-white">{stats.systemHealth.apiLatencyMs}ms</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">PostgreSQL Latency</span>
              <span className="font-mono font-bold text-white">{stats.systemHealth.dbLatencyMs}ms</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">Upstash Redis Hit Rate</span>
              <span className="font-mono font-bold text-emerald-400">{stats.systemHealth.redisHitRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">Cloudflare R2 Storage</span>
              <span className="font-mono font-bold text-white">{stats.systemHealth.storageUsedGb} GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Media Table Link */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-white">Top Performing Visual Content</h2>
          <Link href="/admin/media" className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1">
            <span>Manage All Media ({MEDIA_ITEMS.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="text-[10px] uppercase font-mono text-gray-500 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Likes</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MEDIA_ITEMS.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-8 h-8 rounded object-cover" />
                    <span className="line-clamp-1">{item.title}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">{item.type}</td>
                  <td className="py-3 px-4">{item.category.name}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{item.views.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-brand-purple">{item.likes.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      PUBLIC
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
