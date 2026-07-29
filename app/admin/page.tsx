'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Users, Activity, Upload, ArrowUpRight, Server,
  Lock, Key, LogOut, Film, CheckCircle, AlertCircle, ImageIcon, Video,
  Folder, Plus, Trash2, Tag, Loader2, Sparkles, BarChart3
} from 'lucide-react';
import { MediaItem, CollectionItem } from '@/lib/types';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getPersistentCollections, savePersistentCollections } from '@/lib/storage/localStorage';

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
  const [colCoverFile, setColCoverFile] = useState<File | null>(null);
  const [colCoverPreview, setColCoverPreview] = useState('');
  const [colPrice, setColPrice] = useState('FREE');
  const [colIsFree, setColIsFree] = useState(true);
  const [colSubmitting, setColSubmitting] = useState(false);
  const [colUploadStep, setColUploadStep] = useState('');

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
        let cols: CollectionItem[] = colData.collections || [];
        const localCols = getPersistentCollections();
        if (localCols.length > 0) {
          const merged = [...cols, ...localCols.filter(lc => !cols.some(c => c.id === lc.id))];
          cols = merged;
        }
        setCollectionsList(cols);
      })
      .catch(() => {
        const localCols = getPersistentCollections();
        if (localCols.length > 0) setCollectionsList(localCols);
      });
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

  const handleColCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setColCoverFile(file);
      setColCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName || !colCoverFile) return;
    setColSubmitting(true);

    try {
      setColUploadStep('Uploading cover image to ImageKit CDN...');
      const formData = new FormData();
      formData.append('file', colCoverFile);

      const uploadRes = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Failed to upload cover image.');
      }

      const coverImageUrl = uploadData.url;

      setColUploadStep('Saving collection folder...');
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: colName,
          description: colDesc,
          coverImage: coverImageUrl,
          price: colIsFree ? 'FREE' : colPrice,
          isFree: colIsFree,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const updatedList = [data.collection, ...collectionsList];
        setCollectionsList(updatedList);
        savePersistentCollections(updatedList);
        setShowCreateCollectionModal(false);
        setColName('');
        setColDesc('');
        setColCoverFile(null);
        setColCoverPreview('');
        setColPrice('FREE');
        setColIsFree(true);
      }
    } catch (err) {
      console.error('Failed to create collection:', err);
    } finally {
      setColSubmitting(false);
      setColUploadStep('');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      const res = await fetch(`/api/collections?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      const updated = collectionsList.filter(c => c.id !== id);
      setCollectionsList(updated);
      savePersistentCollections(updated);
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  const totalArchives = mediaList.length;

  if (authChecked && !isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/50 shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Studio Admin</h1>
            <p className="text-xs text-zinc-500">Smriti Shah Visual Portfolio</p>
          </div>

          <Card className="border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.05)] bg-[#140f21]">
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
                    className="h-10 border-white/10 focus:border-violet-500"
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
                    className="h-10 border-white/10 focus:border-violet-500"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white font-bold gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-white/10">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-zinc-400 font-medium">Admin Studio</span>
            <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Live</Badge>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboard &amp; Content Management</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent Live Analytics Navigation Button */}
          <Link href="/admin/analytics">
            <Button variant="outline" className="gap-1.5 border-violet-500/40 text-violet-300 hover:bg-violet-600/20 h-9 font-bold shadow-[0_0_15px_rgba(124,58,237,0.25)]">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              Live Analytics &amp; Telemetry
            </Button>
          </Link>
          <Link href="/admin/upload">
            <Button className="gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white h-9 font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Upload className="w-4 h-4" />
              Upload Media
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="h-9 text-zinc-400 hover:text-red-400 gap-1.5 border border-red-500/20 hover:border-red-500/60 hover:bg-red-500/10"
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
            <p className="text-xs text-zinc-400">Organize archives into occasion folders, set cover pictures and free/VIP prices.</p>
          </div>

          <Button
            onClick={() => setShowCreateCollectionModal(true)}
            size="sm"
            className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5 h-8 text-xs font-semibold shadow-[0_0_15px_rgba(124,58,237,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Collection Pack</span>
          </Button>
        </div>

        {/* Full-Bleed Cover Image Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collectionsList.map((col) => (
            <div
              key={col.id}
              className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/50 shadow-[0_0_20px_rgba(255,255,255,0.04)] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all bg-zinc-900 min-h-[340px] flex flex-col justify-end p-5"
            >
              {/* Full Card Cover Image */}
              <img
                src={col.coverImage}
                alt={col.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Full Card Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0917] via-[#0d0917]/65 to-transparent" />

              {/* Top Price Badge */}
              <div className="absolute top-3 right-3 z-10">
                <Badge
                  variant="default"
                  className={col.isFree ? 'bg-emerald-500/80 text-white backdrop-blur-md border border-emerald-400/50 shadow-md font-bold' : 'bg-amber-500/80 text-white backdrop-blur-md border border-amber-400/50 shadow-md font-bold'}
                >
                  {col.price}
                </Badge>
              </div>

              {/* Bottom Details Overlay */}
              <div className="relative z-10 space-y-2">
                <h3 className="font-black text-lg text-white group-hover:text-violet-300 transition-colors drop-shadow-md">{col.name}</h3>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed drop-shadow">{col.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-white/15">
                  <span className="text-[10px] font-mono text-zinc-400">ID: {col.id}</span>
                  <Button
                    onClick={() => handleDeleteCollection(col.id)}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-red-300 hover:text-red-100 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Published Archives Table */}
      <Card className="border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
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
              <TableRow className="border-white/10">
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediaList.map((item) => (
                <TableRow key={item.id} className="border-white/5">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img src={item.thumbnailUrl} alt="" className="w-8 h-8 rounded object-cover border border-white/10" />
                      <span className="text-xs font-medium text-white line-clamp-1">{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{item.type}</TableCell>
                  <TableCell className="text-xs text-zinc-400">{item.category?.name || 'Fashion'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      {item.visibility || 'PUBLIC'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Collection Upload Modal */}
      {showCreateCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <Card className="w-full max-w-md border border-violet-500/40 shadow-[0_0_35px_rgba(124,58,237,0.3)] bg-[#140f21] p-6 space-y-4">
            <div className="space-y-1">
              <Badge variant="outline" className="border-violet-500/40 text-violet-400 text-[10px]">
                Collection Creation
              </Badge>
              <CardTitle className="text-lg text-white">Create New Collection Pack</CardTitle>
              <CardDescription className="text-xs text-zinc-400">Upload a cover image directly and configure pack details.</CardDescription>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-4">
              {/* Cover Image Upload & Preview Zone */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Collection Cover Image *</label>
                <div className="relative border-2 border-dashed border-violet-500/40 hover:border-violet-400 rounded-2xl p-4 text-center bg-violet-600/5 hover:bg-violet-600/10 transition-all cursor-pointer">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleColCoverFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {colCoverPreview ? (
                    <div className="space-y-2">
                      <img src={colCoverPreview} alt="Cover Preview" className="w-full h-36 object-cover rounded-xl border border-violet-500/50 shadow-[0_0_15px_rgba(124,58,237,0.3)]" />
                      <p className="text-[11px] text-emerald-400 font-semibold">Cover image selected · Click to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-3">
                      <Upload className="w-8 h-8 text-violet-400 mx-auto" />
                      <p className="text-xs font-semibold text-white">Click or drop cover image here</p>
                      <p className="text-[10px] text-zinc-400">Directly hosted on ImageKit CDN</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400">Collection Name *</label>
                <Input required value={colName} onChange={e => setColName(e.target.value)} placeholder="e.g. Diwali Bridal Special" className="h-9 text-xs border-white/10 focus:border-violet-500" />
              </div>

              <div>
                <label className="text-xs text-zinc-400">Description</label>
                <Input value={colDesc} onChange={e => setColDesc(e.target.value)} placeholder="Brief pack description..." className="h-9 text-xs border-white/10 focus:border-violet-500" />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input type="checkbox" checked={colIsFree} onChange={e => setColIsFree(e.target.checked)} className="accent-violet-500" />
                  Free Pack
                </label>
                {!colIsFree && (
                  <Input value={colPrice} onChange={e => setColPrice(e.target.value)} placeholder="Price e.g. $9.99" className="h-8 text-xs w-32 border-white/10" />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateCollectionModal(false)}>Cancel</Button>
                <Button type="submit" disabled={colSubmitting || !colCoverFile} size="sm" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white font-bold gap-2 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  {colSubmitting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" />{colUploadStep || 'Uploading...'}</>
                  ) : (
                    'Create Collection'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
