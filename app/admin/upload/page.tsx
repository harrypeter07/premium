'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, Sparkles, Image as ImageIcon, Video, CheckCircle, ArrowLeft, Tag, Calendar, Eye, Lock } from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/data/mockData';

export default function AdminUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    try {
      // Ingest image through ImageKit endpoint domain or local preview
      const targetUrl = previewUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80';

      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type: mediaType,
          url: targetUrl,
          thumbnailUrl: targetUrl,
          categorySlug,
          tags,
          visibility,
          isFeatured,
          isPinned,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Failed to submit media upload:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Studio Dashboard</span>
      </Link>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Upload className="w-3.5 h-3.5" />
          <span>Dynamic Media Ingestion</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Upload Media to Live Feed</h1>
      </div>

      {success ? (
        <div className="glass-panel p-10 rounded-3xl border border-brand-purple/50 text-center space-y-4 shadow-neon">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="font-display font-bold text-2xl text-white">Archive Published to Live Website!</h2>
          <p className="text-sm text-gray-300 max-w-md mx-auto">
            Your uploaded archive has been published directly to the live feed and is now visible on the homepage, explore, and photo/video vaults.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => { setSuccess(false); setSelectedFile(null); setPreviewUrl(''); }} className="px-6 py-2.5 rounded-full bg-brand-purple text-white font-bold text-xs shadow-neon">
              Upload Another Media Item
            </button>
            <Link href="/" className="px-6 py-2.5 rounded-full glass-card text-white font-bold text-xs hover:bg-white/10">
              View on Live Website
            </Link>
          </div>
        </div>
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
                <p className="text-xs text-gray-400">ImageKit & Cloudflare CDN auto-optimization enabled</p>
              </div>
            )}
          </div>

          {/* Metadata Form Grid */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Metadata & SEO Configuration</h3>
              <button type="button" onClick={handleAutoTagAI} className="px-3 py-1.5 rounded-xl bg-brand-purple/20 border border-brand-purple/40 text-brand-purple font-semibold hover:bg-brand-purple/30 transition-all flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate AI Caption & Tags</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Archive Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mumbai Fashion Week Runway" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className="w-full bg-[#181326] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple">
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter archive story..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple" />
            </div>

            {/* Visibility & Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-gray-400 mb-1">Visibility</label>
                <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE' | 'DRAFT')} className="w-full bg-[#181326] border border-white/10 rounded-xl px-4 py-2.5 text-white">
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
              <label className="block text-gray-400 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-white/10 text-gray-300 font-mono">#{t}</span>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={uploading || !selectedFile} className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-bold text-sm shadow-neon hover:opacity-90 transition-all disabled:opacity-50">
            {uploading ? 'Processing & Ingesting Media...' : 'Publish Archive to Live Website'}
          </button>
        </form>
      )}
    </div>
  );
}
