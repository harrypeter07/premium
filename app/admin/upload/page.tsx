'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Upload, Sparkles, CheckCircle, ArrowLeft, AlertCircle, Loader2, Image as ImageIcon, Video, Folder } from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/data/mockData';
import { CollectionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type MediaType = 'IMAGE' | 'VIDEO';
type Visibility = 'PUBLIC' | 'PRIVATE' | 'DRAFT';

export default function AdminUploadPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('fashion');
  const [collectionId, setCollectionId] = useState('');
  const [collectionsList, setCollectionsList] = useState<CollectionItem[]>([]);
  const [mediaType, setMediaType] = useState<MediaType>('IMAGE');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [publishedItem, setPublishedItem] = useState<{ id: string; url: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadStep, setUploadStep] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('smr_admin_session');
    setIsAdmin(session === 'authorized');
    setAuthChecked(true);

    fetch('/api/collections')
      .then(r => r.json())
      .then(d => { if (d.collections) setCollectionsList(d.collections); })
      .catch(() => {});
  }, []);

  if (authChecked && !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Card className="p-8 border border-red-500/30 bg-red-500/5">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <CardTitle className="text-lg mb-2">Access Denied</CardTitle>
          <CardDescription>You must be logged in as admin to access this page.</CardDescription>
          <Link href="/admin" className="block mt-4">
            <Button className="w-full bg-violet-600 hover:bg-violet-500">Go to Admin Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    setMediaType(file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE');
    setErrorMsg('');
    setSuccess(false);
    console.log('[Upload] File selected:', file.name, file.type, `${(file.size / 1024 / 1024).toFixed(2)}MB`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) { setErrorMsg('Please select a file first.'); return; }

    setUploading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      // STEP 1: Upload to ImageKit
      setUploadStep('Uploading to ImageKit CDN...');
      console.log('[Upload] Step 1: Starting ImageKit upload for', selectedFile.name);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(`ImageKit upload failed: ${uploadData.error || uploadRes.statusText}`);
      }

      const imageKitUrl = uploadData.url;
      const thumbnailUrl = uploadData.thumbnailUrl || uploadData.url;

      // STEP 2: Save metadata to feed store
      setUploadStep('Publishing to live feed...');

      const metaRes = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          type: mediaType,
          url: imageKitUrl,
          thumbnailUrl,
          categorySlug,
          collectionId: collectionId || undefined,
          visibility,
          isFeatured,
          isPinned,
          tags: ['SmritiShah', categorySlug, mediaType === 'VIDEO' ? 'CinematicVideo' : 'Photography'],
        }),
      });

      const metaData = await metaRes.json();

      if (!metaRes.ok) {
        throw new Error(`Failed to publish: ${metaData.error || metaRes.statusText}`);
      }

      setPublishedItem({ id: metaData.media?.id || '', url: imageKitUrl });
      setSuccess(true);
      setUploadStep('');

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected upload error';
      console.error('[Upload] FAILED:', message);
      setErrorMsg(message);
      setUploadStep('');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setTitle('');
    setDescription('');
    setCategorySlug('fashion');
    setCollectionId('');
    setVisibility('PUBLIC');
    setIsFeatured(false);
    setIsPinned(false);
    setSuccess(false);
    setPublishedItem(null);
    setErrorMsg('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-12">
      {/* Top bar */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="gap-1.5 text-zinc-400 hover:text-white -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>
        <Badge variant="outline" className="gap-1.5 text-xs border-violet-500/40 text-violet-400">
          <Upload className="w-3 h-3" />
          Media Ingestion
        </Badge>
      </div>

      <div>
        <h1 className="font-black text-2xl sm:text-3xl text-white">Upload Archive</h1>
        <p className="text-zinc-400 text-sm mt-1">Images &amp; videos are hosted on ImageKit CDN, then published to your live feed.</p>
      </div>

      {success && publishedItem ? (
        /* ─── Success State ─── */
        <Card className="p-0 border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Published Successfully!</h2>
              <p className="text-xs text-zinc-400 mt-1">Your archive is now live on the website feed.</p>
            </div>
            <div className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-1 break-all">
              {publishedItem.url}
            </div>
          </div>
          <CardFooter className="p-3 gap-2 justify-center border-t border-emerald-500/20 bg-transparent">
            <Button onClick={resetForm} size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">
              Upload Another
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-zinc-700">
                View Live Site
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ─── Publish button at TOP ─── */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-zinc-700/60 bg-zinc-900/50">
            <div className="text-xs text-zinc-400">
              {selectedFile ? (
                <span className="text-white font-medium">{selectedFile.name} <span className="text-zinc-500">· {(selectedFile.size / 1024 / 1024).toFixed(1)}MB</span></span>
              ) : (
                'No file selected'
              )}
            </div>
            <Button
              type="submit"
              disabled={uploading || !selectedFile}
              className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 gap-2"
            >
              {uploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{uploadStep || 'Publishing...'}</>
              ) : (
                <><Upload className="w-4 h-4" />Publish</>
              )}
            </Button>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ─── File Drop Zone ─── */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
              dragActive ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-500'
            }`}
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="flex items-center gap-4">
                {mediaType === 'IMAGE' ? (
                  <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-600" />
                ) : (
                  <div className="w-20 h-20 rounded-lg border border-zinc-600 bg-zinc-800 flex items-center justify-center">
                    <Video className="w-8 h-8 text-violet-400" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{selectedFile?.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{mediaType} · Click to change</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Drop image or video here</p>
                  <p className="text-xs text-zinc-500 mt-0.5">or click to browse files</p>
                </div>
              </>
            )}
          </div>

          {/* ─── Compact Metadata Form ─── */}
          <Card className="border border-zinc-800">
            <CardContent className="p-4 space-y-3">
              {/* Row 1: Title + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium">Title (Optional - Auto generated if empty)</label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Leave empty for auto-generated caption"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium">Category</label>
                  <select
                    value={categorySlug}
                    onChange={e => setCategorySlug(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {CATEGORIES_LIST.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Collection / Folder Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium flex items-center gap-1">
                  <Folder className="w-3 h-3 text-violet-400" />
                  Assign to Collection Folder / Occasion Pack
                </label>
                <select
                  value={collectionId}
                  onChange={e => setCollectionId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">No Collection (General Feed)</option>
                  {collectionsList.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.price})</option>
                  ))}
                </select>
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Leave empty for auto-generated editorial story..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              {/* Row 4: Visibility + Flags */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium">Visibility</label>
                  <select
                    value={visibility}
                    onChange={e => setVisibility(e.target.value as Visibility)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE (VIP Only)</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300 mt-4">
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-violet-500 w-3.5 h-3.5" />
                  Feature on homepage
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300 mt-4">
                  <input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} className="accent-violet-500 w-3.5 h-3.5" />
                  Pin to top hero
                </label>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
