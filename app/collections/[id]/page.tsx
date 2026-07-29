'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Folder, ArrowLeft, Image as ImageIcon, Video, Upload, Trash2, Edit, Plus, Check, X, ShieldCheck
} from 'lucide-react';
import { MediaItem, CollectionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cleanOrGenerateTitle } from '@/lib/utils/captionHelper';
import { getPersistentCollections, savePersistentCollections, getPersistentUploadedMedia } from '@/lib/storage/localStorage';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [collection, setCollection] = useState<CollectionItem | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'PHOTOS' | 'VIDEOS'>('PHOTOS');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit Collection States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    setIsAdmin(localStorage.getItem('smr_admin_session') === 'authorized');

    async function loadCollectionData() {
      try {
        setLoading(true);
        const [colRes, mediaRes] = await Promise.all([
          fetch('/api/collections', { cache: 'no-store' }),
          fetch('/api/media', { cache: 'no-store' }),
        ]);

        const [colData, mediaData] = await Promise.all([
          colRes.json(),
          mediaRes.json(),
        ]);

        let cols: CollectionItem[] = colData.collections || [];
        const localCols = getPersistentCollections();
        if (localCols.length > 0) {
          const merged = [...cols, ...localCols.filter(lc => !cols.some(c => c.id === lc.id))];
          cols = merged;
        }

        const found = cols.find(c => c.id === id || c.slug === id);
        if (found) {
          setCollection(found);
          setEditName(found.name);
          setEditDesc(found.description || '');
          setEditPrice(found.price || 'FREE');
        }

        let allMedia: MediaItem[] = mediaData.media || [];
        const localUploaded = getPersistentUploadedMedia();
        if (localUploaded.length > 0) {
          const merged = [...allMedia, ...localUploaded.filter(l => !allMedia.some(i => i.id === l.id))];
          allMedia = merged;
        }

        if (found) {
          setMediaItems(allMedia.filter(m => m.collectionId === found.id));
        }
      } catch (err) {
        console.error('Failed to load collection details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCollectionData();
  }, [id]);

  const handleSaveEdit = async () => {
    if (!collection) return;
    const updated = {
      ...collection,
      name: editName,
      description: editDesc,
      price: editPrice,
    };
    setCollection(updated);

    const localCols = getPersistentCollections();
    const newCols = localCols.map(c => c.id === collection.id ? updated : c);
    savePersistentCollections(newCols);
    setIsEditing(false);
  };

  const handleDeleteCollection = async () => {
    if (!collection || !confirm('Are you sure you want to delete this collection pack?')) return;
    try {
      await fetch(`/api/collections?id=${collection.id}`, { method: 'DELETE' });
      const localCols = getPersistentCollections();
      const updated = localCols.filter(c => c.id !== collection.id);
      savePersistentCollections(updated);
      router.push('/collections');
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs font-mono text-zinc-500">Loading collection pack...</div>;
  }

  if (!collection) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <Card className="p-8 border border-zinc-800 bg-[#140f21]">
          <Folder className="w-10 h-10 text-violet-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Collection Not Found</h2>
          <p className="text-xs text-zinc-400">The requested occasion pack does not exist or has been removed.</p>
          <Link href="/collections" className="block mt-4">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">Return to Collections</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const photoItems = mediaItems.filter(m => m.type === 'IMAGE');
  const videoItems = mediaItems.filter(m => m.type === 'VIDEO');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Link href="/collections" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Collections</span>
      </Link>

      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 min-h-[380px] flex flex-col justify-end p-8">
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0917] via-[#0d0917]/75 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-violet-500/40 text-violet-400 text-xs">
              Occasion Collection Pack
            </Badge>
            <Badge variant="default" className={collection.isFree ? 'bg-emerald-500/80 text-white font-bold' : 'bg-amber-500/80 text-white font-bold'}>
              {collection.price}
            </Badge>
            {isAdmin && (
              <Badge variant="outline" className="border-red-500/40 text-red-400 text-xs font-mono">
                Admin Controls Enabled
              </Badge>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-violet-500/50">
              <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Collection Name" className="text-sm font-bold bg-white/5" />
              <Input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Collection Description" className="text-xs bg-white/5" />
              <Input value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="Price e.g. FREE or ₹99" className="text-xs w-36 bg-white/5" />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1 text-xs">
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="text-zinc-400 text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white">{collection.name}</h1>
              <p className="text-sm text-zinc-300 leading-relaxed">{collection.description}</p>
            </>
          )}

          {/* Admin Management Toolbar */}
          {isAdmin && !isEditing && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={`/admin/upload`}>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5 text-xs font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <Plus className="w-3.5 h-3.5" /> Upload Media to Collection
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="border-white/20 text-white hover:bg-white/10 gap-1.5 text-xs">
                <Edit className="w-3.5 h-3.5" /> Edit Details
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDeleteCollection} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 gap-1.5 text-xs">
                <Trash2 className="w-3.5 h-3.5" /> Delete Collection Pack
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('PHOTOS')}
          className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'PHOTOS' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photos ({photoItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('VIDEOS')}
          className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'VIDEOS' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Videos ({videoItems.length})</span>
        </button>
      </div>

      {/* Content Grid */}
      {activeTab === 'PHOTOS' ? (
        photoItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500 font-mono">
            No photo archives in this collection yet. Log into Admin Studio to add media!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photoItems.map((item) => (
              <Link key={item.id} href={`/media/${item.id}`} className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/50 shadow-lg transition-all bg-zinc-900">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs font-semibold text-white line-clamp-1">{cleanOrGenerateTitle(item.title)}</p>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        videoItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500 font-mono">
            No video archives in this collection yet. Log into Admin Studio to add media!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoItems.map((item) => (
              <Link key={item.id} href={`/media/${item.id}`} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/50 shadow-lg transition-all bg-zinc-900">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-white line-clamp-1">{cleanOrGenerateTitle(item.title)}</p>
                  <Badge variant="default" className="text-[9px] bg-red-600 text-white">VIDEO</Badge>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
