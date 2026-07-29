'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Upload, Sparkles, CheckCircle, ArrowLeft, AlertCircle, Loader2, Image as ImageIcon, Video, Folder, Layers, Crown } from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/data/mockData';
import { CollectionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { savePersistentUploadedMedia, getPersistentCollections } from '@/lib/storage/localStorage';

type MediaType = 'IMAGE' | 'VIDEO';
type Visibility = 'PUBLIC' | 'PRIVATE' | 'DRAFT';

export default function AdminUploadPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Multi-select state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('fashion');
  const [collectionId, setCollectionId] = useState('');
  const [collectionsList, setCollectionsList] = useState<CollectionItem[]>([]);
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Premium state
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState('$9.99');

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadStep, setUploadStep] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('smr_admin_session');
    setIsAdmin(session === 'authorized');
    setAuthChecked(true);

    fetch('/api/collections')
      .then(r => r.json())
      .then(d => {
        let cols: CollectionItem[] = d.collections || [];
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    if (files.length === 1) {
      setTitle(files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    } else {
      setTitle('');
    }
    setErrorMsg('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) { setErrorMsg('Please select at least one file to upload.'); return; }

    setUploading(true);
    setErrorMsg('');
    setSuccess(false);
    setPublishedCount(0);

    const uploadedResults: any[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadStep(`Uploading ${i + 1} of ${selectedFiles.length}: ${file.name}...`);

        // STEP 1: Upload to ImageKit CDN
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(`ImageKit upload failed for ${file.name}: ${uploadData.error || uploadRes.statusText}`);
        }

        const imageKitUrl = uploadData.url;
        const thumbnailUrl = uploadData.thumbnailUrl || uploadData.url;
        const isVideo = file.type.startsWith('video/');

        const itemTitle = selectedFiles.length === 1 && title.trim()
          ? title.trim()
          : file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        // STEP 2: Save metadata to feed store
        const metaRes = await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: itemTitle,
            description: description.trim(),
            type: isVideo ? 'VIDEO' : 'IMAGE',
            url: imageKitUrl,
            thumbnailUrl,
            categorySlug,
            collectionId: collectionId || undefined,
            visibility,
            isFeatured,
            isPinned: isPinned && i === 0,
            tags: ['SmritiShah', categorySlug, isVideo ? 'CinematicVideo' : 'Photography'],
            isPremium,
            price: isPremium ? price : 'FREE',
          }),
        });

        const metaData = await metaRes.json();

        if (!metaRes.ok) {
          throw new Error(`Failed to publish ${file.name}: ${metaData.error || metaRes.statusText}`);
        }

        if (metaData.media) {
          uploadedResults.push(metaData.media);
        }

        setPublishedCount(i + 1);
      }

      if (uploadedResults.length > 0) {
        savePersistentUploadedMedia(uploadedResults);
      }

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
    setSelectedFiles([]);
    setPreviewUrls([]);
    setTitle('');
    setDescription('');
    setCategorySlug('fashion');
    setCollectionId('');
    setVisibility('PUBLIC');
    setIsFeatured(false);
    setIsPinned(false);
    setIsPremium(false);
    setPrice('$9.99');
    setSuccess(false);
    setPublishedCount(0);
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
          Bulk Media Ingestion
        </Badge>
      </div>

      <div>
        <h1 className="font-black text-2xl sm:text-3xl text-white">Multi-Select Bulk Upload</h1>
        <p className="text-zinc-400 text-sm mt-1">Select multiple images &amp; videos at once. Files are hosted on ImageKit CDN and saved permanently to your live feed.</p>
      </div>

      {success ? (
        <Card className="p-0 border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Upload Task Completed</h2>
            <p className="text-sm text-zinc-300 max-w-sm mx-auto">Successfully uploaded and published <strong className="text-emerald-400">{publishedCount}</strong> media files directly into Smriti&apos;s live visuals portfolio feed.</p>
            <div className="flex justify-center gap-3 pt-4">
              <Button onClick={resetForm} className="bg-violet-600 hover:bg-violet-500 text-white font-bold">Upload More Files</Button>
              <Link href="/admin"><Button variant="outline">Back to Studio</Button></Link>
            </div>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-all min-h-[220px] ${
              dragActive
                ? 'border-violet-500 bg-violet-600/10 shadow-[0_0_30px_rgba(124,58,237,0.25)]'
                : 'border-zinc-800 bg-[#140f21] hover:border-zinc-700'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {previewUrls.length > 0 ? (
              <div className="space-y-3 w-full">
                <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto p-1">
                  {previewUrls.map((url, idx) => (
                    <img key={idx} src={url} alt={`Preview ${idx}`} className="w-16 h-16 object-cover rounded-lg border border-zinc-700 shadow-md" />
                  ))}
                </div>
                <p className="text-xs text-zinc-400">{selectedFiles.length} file(s) ready · Click or drop to replace</p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Select or drop multiple images &amp; videos here</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Supports bulk uploading</p>
                </div>
              </>
            )}
          </div>

          <Card className="border border-zinc-800">
            <CardContent className="p-6 space-y-4 bg-[#140f21]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium">
                    {selectedFiles.length > 1 ? 'Title Pattern (Optional - Auto generated per file if empty)' : 'Title (Optional - Auto generated if empty)'}
                  </label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Leave empty for auto-generated captions"
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

              {/* Assign to Collection Dropdown */}
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

              {/* Premium / Paid content toggles */}
              <div className="p-4 rounded-2xl bg-violet-600/5 border border-violet-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-white font-bold">
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={e => setIsPremium(e.target.checked)}
                      className="accent-violet-500 w-4 h-4"
                    />
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Paid / Premium Locked Content</span>
                  </label>
                  <Badge variant="outline" className={isPremium ? 'border-amber-500/40 text-amber-400' : 'text-zinc-500'}>
                    {isPremium ? 'PREMIUM LOCK ENABLED' : 'FREE ACCESS'}
                  </Badge>
                </div>

                {isPremium && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] text-zinc-400 uppercase tracking-wide font-medium">Unlock Price (Label)</label>
                    <Input
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      placeholder="e.g. $9.99 or VIP Access"
                      className="h-9 text-xs w-48 bg-white/5 border-white/10"
                    />
                    <p className="text-[10px] text-zinc-500">Paid images will be beautifully blurred to normal visitors with a button to unlock.</p>
                  </div>
                )}
              </div>

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

              <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-white/5">
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
                  Pin first item to top hero
                </label>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-end gap-2 bg-[#140f21]">
              <Button type="button" variant="ghost" onClick={resetForm} disabled={uploading}>Reset Form</Button>
              <Button
                type="submit"
                disabled={uploading || selectedFiles.length === 0}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white font-bold gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadStep || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Start Bulk Ingestion ({selectedFiles.length} files)</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
