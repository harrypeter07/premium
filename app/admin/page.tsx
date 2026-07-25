'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Users, Activity, Upload, ArrowUpRight, Server,
  Lock, Key, LogOut, Film, CheckCircle, AlertCircle, ImageIcon, Video,
  Folder, Plus, Trash2, Tag
} from 'lucide-react';
import { MediaItem, CollectionItem } from '@/lib/types';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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
  const [collectionsList, setCollectionsList] = useState<CollectionItem[]>([]);

  // New Collection Form State
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
  const [colName, setColName] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colCover, setColCover] = useState('');
  const [colPrice, setColPrice] = useState('FREE');
  const [colIsFree, setColIsFree] = useState(true);
  const [colSubmitting, setColSubmitting] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('smr_admin_session');
    if (authStatus === 'authorized') {
      setClientCookie('smr_admin_session', 'authorized');
      setIsAuthenticated(true);
    }
    setAuthChecked(true);

    Promise.all([
      fetch('/api/media').then(r => r.json()),
      fetch('/api/collections').then(r => r.json()),
    ])
      .then(([mediaData, colData]) => {
        if (mediaData.media) setMediaList(mediaData.media);
        if (colData.collections) setCollectionsList(colData.collections);
      })
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

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName || !colCover) return;
    setColSubmitting(true);

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: colName,
          description: colDesc,
          coverImage: colCover,
          price: colIsFree ? 'FREE' : colPrice,
          isFree: colIsFree,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCollectionsList([data.collection, ...collectionsList]);
        setShowCreateCollectionModal(false);
        setColName('');
        setColDesc('');
        setColCover('');
        setColPrice('FREE');
        setColIsFree(true);
      }
    } catch (err) {
      console.error('Failed to create collection:', err);
    } finally {
      setColSubmitting(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      const res = await fetch(`/api/collections?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.collections) {
        setCollectionsList(data.collections);
      }
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  const totalArchives = mediaList.length;
  const totalViews = mediaList.reduce((a, m) => a + (m.views || 0), 0);
  const totalLikes = mediaList.reduce((a, m) => a + (m.likes || 0), 0);

  if (authChecked && !isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Studio Admin</h1>
            <p className="text-xs text-zinc-500">Smriti Shah Visual Portfolio</p>
          </div>

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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-zinc-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-zinc-400 font-medium">Admin Studio</span>
            <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400">Live</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">Dashboard &amp; Content Management</h1>
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

      {/* Collection / Occasion Pack CRUD Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-violet-400" />
              <span>Occasion Collections &amp; Packs ({collectionsList.length})</span>
            </h2>
            <p className="text-xs text-zinc-400">Organize photos &amp; videos into packs, set cover pictures and free/VIP prices.</p>
          </div>

          <Button
            onClick={() => setShowCreateCollectionModal(true)}
            size="sm"
            className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5 h-8 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Collection Pack</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionsList.map((col) => (
            <Card key={col.id} className="border border-zinc-800 bg-[#140f21] overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden">
                <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className={col.isFree ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}>
                    {col.price}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-1.5 flex-1">
                <h3 className="font-bold text-sm text-white">{col.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{col.description}</p>
              </CardContent>
              <CardFooter className="p-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500">ID: {col.id}</span>
                <Button
                  onClick={() => handleDeleteCollection(col.id)}
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Published Archives Table */}
      <Card className="border border-zinc-800">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Published Media Items ({totalArchives})</CardTitle>
            <Link href="/admin/upload">
              <Button variant="ghost" size="sm" className="h-7 text-[11px] text-violet-400 hover:text-violet-300 gap-1">
                + Upload New
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediaList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img src={item.thumbnailUrl} alt="" className="w-8 h-8 rounded object-cover" />
                      <span className="text-xs font-medium text-white line-clamp-1">{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{item.type}</TableCell>
                  <TableCell className="text-xs text-zinc-400">{item.category?.name || 'Fashion'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                      {item.visibility || 'PUBLIC'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Collection Modal */}
      {showCreateCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <Card className="w-full max-w-md border border-zinc-800 bg-[#140f21] p-6 space-y-4">
            <CardTitle className="text-lg text-white">Create New Collection Pack</CardTitle>
            <CardDescription className="text-xs text-zinc-400">Group archives into occasion folders for Explore page.</CardDescription>

            <form onSubmit={handleCreateCollection} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400">Collection Name *</label>
                <Input required value={colName} onChange={e => setColName(e.target.value)} placeholder="e.g. Diwali Bridal Special" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Cover Image URL *</label>
                <Input required value={colCover} onChange={e => setColCover(e.target.value)} placeholder="https://..." className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Description</label>
                <Input value={colDesc} onChange={e => setColDesc(e.target.value)} placeholder="Brief pack description..." className="h-9 text-xs" />
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input type="checkbox" checked={colIsFree} onChange={e => setColIsFree(e.target.checked)} className="accent-violet-500" />
                  Free Pack
                </label>
                {!colIsFree && (
                  <Input value={colPrice} onChange={e => setColPrice(e.target.value)} placeholder="Price e.g. $9.99" className="h-8 text-xs w-32" />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateCollectionModal(false)}>Cancel</Button>
                <Button type="submit" disabled={colSubmitting} size="sm" className="bg-violet-600 text-white">Save Collection</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
