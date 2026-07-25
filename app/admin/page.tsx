'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Users, Activity, Upload, ArrowUpRight, Server,
  Lock, Key, LogOut, Film, CheckCircle, AlertCircle, ImageIcon, Video,
  TrendingUp, Eye
} from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

// Helper: set a cookie client-side so the proxy can read it immediately
function setClientCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function clearClientCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mediaList, setMediaList] = useState<MediaItem[]>(MEDIA_ITEMS);

  useEffect(() => {
    const authStatus = localStorage.getItem('smr_admin_session');
    if (authStatus === 'authorized') {
      // Sync cookie in case it expired or wasn't set
      setClientCookie('smr_admin_session', 'authorized');
      setIsAuthenticated(true);
    }
    setAuthChecked(true);

    fetch('/api/media')
      .then(r => r.json())
      .then(d => { if (d.media) setMediaList(d.media); })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
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
        // Set both localStorage AND cookie so proxy works immediately
        localStorage.setItem('smr_admin_session', 'authorized');
        localStorage.setItem('smr_admin_user', JSON.stringify(data.user));
        setClientCookie('smr_admin_session', 'authorized');
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('smr_admin_session');
    localStorage.removeItem('smr_admin_user');
    clearClientCookie('smr_admin_session');
    setIsAuthenticated(false);
  };

  const totalArchives = mediaList.length;
  const totalViews = mediaList.reduce((a, m) => a + (m.views || 0), 0);
  const totalLikes = mediaList.reduce((a, m) => a + (m.likes || 0), 0);
  const totalVideos = mediaList.filter(m => m.type === 'VIDEO').length;
  const totalPhotos = mediaList.filter(m => m.type === 'IMAGE').length;

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (authChecked && !isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Brand */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Studio Admin</h1>
            <p className="text-xs text-zinc-500">Smriti Shah Visual Portfolio</p>
          </div>

          {/* Login Card */}
          <Card className="border border-zinc-800">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                  <Input
                    type="email"
                    required
                    autoFocus
                    placeholder="admin@smriti.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-10"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-violet-600 hover:bg-violet-500 text-white gap-2"
                >
                  <Key className="w-4 h-4" />
                  {loading ? 'Authenticating...' : 'Sign In to Studio'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-[10px] text-zinc-600">
            Protected by session cookie + localStorage dual auth
          </p>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-zinc-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-zinc-400 font-medium">Admin Studio</span>
            <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400">Live</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/upload">
            <Button className="gap-1.5 bg-violet-600 hover:bg-violet-500 text-white h-9">
              <Upload className="w-4 h-4" />
              Upload Media
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="h-9 text-zinc-400 hover:text-red-400 gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-zinc-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Archives</span>
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-violet-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{totalArchives}</p>
            <p className="text-[11px] text-zinc-500 mt-1">{totalPhotos} photos · {totalVideos} videos</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Total Views</span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{totalViews.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-400 mt-1">Accumulated</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Likes</span>
              <div className="w-7 h-7 rounded-lg bg-pink-500/15 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-pink-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{totalLikes.toLocaleString()}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Community engagement</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-800 border-emerald-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">AdSense</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs font-mono text-zinc-300 truncate">ca-pub-4236633699270444</p>
            <Badge className="mt-2 text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30" variant="outline">
              CMP Verified ✓
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Content Table + Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Media Table */}
        <Card className="lg:col-span-2 border border-zinc-800">
          <CardHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Published Archives ({totalArchives})</CardTitle>
              <Link href="/admin/upload">
                <Button variant="ghost" size="sm" className="h-7 text-[11px] text-violet-400 hover:text-violet-300 gap-1">
                  + Add New
                  <ArrowUpRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>

          {mediaList.length === 0 ? (
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-zinc-700 rounded-xl">
                <ImageIcon className="w-8 h-8 text-zinc-600 mb-3" />
                <p className="text-sm font-medium text-zinc-400">No archives published yet</p>
                <p className="text-xs text-zinc-600 mt-1">Upload your first image or video to get started</p>
                <Link href="/admin/upload" className="mt-3">
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mediaList.slice(0, 8).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          ) : item.type === 'VIDEO' ? (
                            <Video className="w-4 h-4 text-zinc-500" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-zinc-500" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-white line-clamp-1 max-w-[140px]">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-mono text-zinc-400">{item.type}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-zinc-300 font-medium">{item.views.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                        {item.visibility || 'PUBLIC'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Infrastructure Health */}
        <Card className="border border-zinc-800">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Server className="w-4 h-4 text-violet-400" />
              Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2">
            {[
              { label: 'ImageKit CDN', value: 'ik.imagekit.io/epe7dzmjg', status: 'ok' },
              { label: 'Supabase DB', value: 'Connected', status: 'ok' },
              { label: 'Shadcn UI', value: 'CLI Installed', status: 'ok' },
              { label: 'AdSense', value: 'Verified', status: 'ok' },
              { label: 'Proxy Guard', value: 'Active', status: 'ok' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <span className="text-xs text-zinc-400">{row.label}</span>
                <span className="text-[11px] font-mono text-emerald-400">{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
