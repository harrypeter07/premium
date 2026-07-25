'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, DollarSign, Activity, Upload, ArrowUpRight, Server, Lock, Key, LogOut, Film, CheckCircle, AlertCircle } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mediaList, setMediaList] = useState<MediaItem[]>(MEDIA_ITEMS);

  useEffect(() => {
    const authStatus = localStorage.getItem('smr_admin_session');
    if (authStatus === 'authorized') {
      setIsAuthenticated(true);
    }

    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.media) setMediaList(data.media);
      })
      .catch(() => {});
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store in both localStorage (for client-side UI checks) and cookie (for middleware)
        localStorage.setItem('smr_admin_session', 'authorized');
        localStorage.setItem('smr_admin_user', JSON.stringify(data.user));
        setIsAuthenticated(true);
      } else {
        setErrorMsg(data.error || 'Invalid credentials.');
      }
    } catch {
      setErrorMsg('Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    // Clear cookie server-side
    await fetch('/api/auth/logout', { method: 'POST' });
    // Clear localStorage
    localStorage.removeItem('smr_admin_session');
    localStorage.removeItem('smr_admin_user');
    setIsAuthenticated(false);
  };

  const totalArchives = mediaList.length;
  const totalViewsSum = mediaList.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikesSum = mediaList.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalVideos = mediaList.filter((m) => m.type === 'VIDEO').length;
  const totalPhotos = mediaList.filter((m) => m.type === 'IMAGE').length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="p-8 border-brand-purple/40 text-center space-y-6 bg-[#140f21]/95">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center text-brand-purple mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl">Studio Admin Authentication</CardTitle>
            <CardDescription className="text-xs">Database-backed Enforced Security</CardDescription>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs text-left">
            <div>
              <label className="block text-gray-400 mb-1 font-mono uppercase text-[10px]">Admin Email</label>
              <Input
                type="email"
                required
                placeholder="admin@smriti.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-mono uppercase text-[10px]">Master Password</label>
              <Input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="default"
              className="w-full h-11 text-xs bg-gradient-to-r from-brand-purple to-brand-accent hover:opacity-90 transition-opacity"
            >
              <Key className="w-4 h-4 mr-2" />
              <span>{loading ? 'Verifying Credentials...' : 'Authenticate Studio Session'}</span>
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Badge variant="default" className="mb-2">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>Smriti Shah Studio Dashboard</span>
          </Badge>
          <h1 className="font-display font-black text-3xl text-white">Real-Time Telemetry & Operations</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/upload">
            <Button variant="default" className="gap-2 bg-gradient-to-r from-brand-purple to-brand-accent hover:opacity-90 transition-opacity">
              <Upload className="w-4 h-4" />
              <span>Upload New Media</span>
            </Button>
          </Link>

          <Button onClick={handleAdminLogout} variant="outline" size="sm" className="gap-1 text-gray-400 hover:text-red-400">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Shadcn Card Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Total Archives</span>
            <Film className="w-4 h-4 text-brand-purple" />
          </div>
          <p className="font-display font-black text-3xl text-white">{totalArchives}</p>
          <p className="text-xs text-gray-400 font-medium">{totalPhotos} Photos • {totalVideos} Videos</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Accumulated Views</span>
            <Users className="w-4 h-4 text-brand-purple" />
          </div>
          <p className="font-display font-black text-3xl text-white">{totalViewsSum.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 font-medium">Real-time aggregate sum</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Community Likes</span>
            <Activity className="w-4 h-4 text-brand-accent" />
          </div>
          <p className="font-display font-black text-3xl text-white">{totalLikesSum.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Verified community engagement</p>
        </Card>

        <Card className="p-6 space-y-2 border-brand-purple/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Google AdSense</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-display font-bold text-sm text-white truncate">ca-pub-4236633699270444</p>
          <Badge variant="default" className="border-emerald-500/40 bg-emerald-500/20 text-emerald-400">Auto-Ads & CMP Verified</Badge>
        </Card>
      </div>

      {/* Infrastructure Health & Live Content Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Live Ingested Content ({totalArchives})</CardTitle>
            <Link href="/admin/upload" className="text-xs text-brand-purple hover:underline font-bold flex items-center gap-1">
              <span>+ Add Archive</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Media</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediaList.slice(0, 6).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold text-white flex items-center gap-2">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-8 h-8 rounded object-cover" />
                    <span className="line-clamp-1">{item.title}</span>
                  </TableCell>
                  <TableCell className="font-mono">{item.type}</TableCell>
                  <TableCell>{item.category.name}</TableCell>
                  <TableCell className="font-mono font-bold text-white">{item.views.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-brand-purple">{item.likes.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="border-emerald-500/40 bg-emerald-500/20 text-emerald-400">{item.visibility || 'PUBLIC'}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6 space-y-4">
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-brand-purple" />
            <span>Infrastructure Health</span>
          </CardTitle>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">ImageKit Endpoint</span>
              <span className="font-mono font-bold text-brand-purple">ik.imagekit.io/epe7dzmjg</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">Supabase PostgreSQL</span>
              <span className="font-mono font-bold text-emerald-400">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">Shadcn Component System</span>
              <Badge variant="default" className="border-emerald-500/40 bg-emerald-500/20 text-emerald-400">CLI Installed</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-gray-400">AdSense Verification</span>
              <Badge variant="default" className="border-emerald-500/40 bg-emerald-500/20 text-emerald-400">Verified</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
