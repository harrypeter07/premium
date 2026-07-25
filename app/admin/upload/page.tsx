'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, Sparkles, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AdminUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Metadata Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('fashion');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE' | 'DRAFT'>('PUBLIC');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<string[]>(['StudioUpload', 'SmritiShah', 'HighFashion']);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (file.type.includes('video')) setMediaType('VIDEO');
    else setMediaType('IMAGE');
  };

  const handleAutoTagAI = () => {
    setTags(['SmritiShah', 'HighFashion', 'ParisEditorial', 'LuxuryAesthetics', 'ImageKitCDN']);
    setDescription('High-resolution visual study captured under studio lighting, featuring custom silk tailoring and minimal composition by Smriti Shah.');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setErrorMsg('');

    try {
      // 1. Upload file to ImageKit via API upload route
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const uploadRes = await fetch('/api/media/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Failed to upload image to ImageKit CDN storage.');
      }

      const imageKitUrl = uploadData.url;
      const thumbnailKitUrl = uploadData.thumbnailUrl;

      // 2. Ingest the permanent ImageKit URL into the database
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type: mediaType,
          url: imageKitUrl,
          thumbnailUrl: thumbnailKitUrl,
          categorySlug,
          tags,
          visibility,
          isFeatured,
          isPinned,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to publish media metadata.');
      }
    } catch (err: unknown) {
      console.error('Failed to submit media upload:', err);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link href="/admin">
        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studio Dashboard</span>
        </Button>
      </Link>

      <div className="space-y-1">
        <Badge variant="default" className="gap-2">
          <Upload className="w-3.5 h-3.5" />
          <span>Dynamic Media Ingestion</span>
        </Badge>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Upload Media to Live Feed</h1>
      </div>

      {success ? (
        <Card className="p-10 border-brand-purple/50 text-center space-y-4 shadow-neon bg-[#140f21]/90">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <CardTitle className="text-2xl">Archive Published to Live Website!</CardTitle>
          <CardDescription className="text-sm max-w-md mx-auto text-gray-300">
            Your uploaded archive has been successfully hosted on ImageKit and published directly to the live feed.
          </CardDescription>
          <div className="flex justify-center gap-3 pt-2">
            <Button onClick={() => { setSuccess(false); setSelectedFile(null); setPreviewUrl(''); }} variant="default" className="bg-gradient-to-r from-brand-purple to-brand-accent hover:opacity-90 transition-opacity">
              Upload Another Media Item
            </Button>
            <Link href="/">
              <Button variant="outline">
                View on Live Website
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Drag & Drop File Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative p-8 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer ${
              dragActive ? 'border-brand-purple bg-brand-purple/10' : 'border-white/20 glass-card hover:border-white/40'
            }`}
          >
            <input type="file" onChange={handleFileChange} accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer" />
            {selectedFile ? (
              <div className="space-y-3">
                {previewUrl && mediaType === 'IMAGE' && (
                  <img src={previewUrl} alt="Preview" className="w-28 h-28 object-cover rounded-2xl mx-auto shadow-neon border border-brand-purple/50" />
                )}
                <CheckCircle className="w-8 h-8 text-brand-purple mx-auto" />
                <p className="font-bold text-white text-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {mediaType}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 text-brand-purple mx-auto" />
                <p className="font-bold text-white text-sm">Drag and drop high-res images or videos here</p>
                <p className="text-xs text-gray-400">ImageKit CDN auto-optimization enabled</p>
              </div>
            )}
          </div>

          {/* Metadata Form Grid */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Metadata & SEO Configuration</CardTitle>
              <Button type="button" onClick={handleAutoTagAI} variant="outline" size="sm" className="gap-1.5 text-brand-purple">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate AI Caption & Tags</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 text-xs">Archive Title</label>
                <Input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mumbai Fashion Week Runway" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-xs">Category</label>
                <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className="w-full h-10 bg-[#181326] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-purple">
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 text-xs">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter archive story..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple" />
            </div>

            {/* Visibility & Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Visibility</label>
                <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE' | 'DRAFT')} className="w-full h-10 bg-[#181326] border border-white/10 rounded-xl px-4 py-2 text-white">
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="PRIVATE">PRIVATE (Members Only)</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-brand-purple" />
                <label htmlFor="featured" className="text-gray-300">Feature on Homepage</label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="pinned" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="accent-brand-purple" />
                <label htmlFor="pinned" className="text-gray-300">Pin to Top Hero</label>
              </div>
            </div>

            {/* Tags Cloud */}
            <div>
              <label className="block text-gray-400 mb-1 text-xs">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-white/10 text-gray-300 font-mono text-[10px]">#{t}</span>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </Card>

          <Button type="submit" disabled={uploading || !selectedFile} variant="default" className="w-full h-12 text-xs bg-gradient-to-r from-brand-purple to-brand-accent hover:opacity-90 transition-opacity">
            {uploading ? 'Uploading & Host Media on ImageKit CDN...' : 'Publish Archive to Live Website'}
          </Button>
        </form>
      )}
    </div>
  );
}
