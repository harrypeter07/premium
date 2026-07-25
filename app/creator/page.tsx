'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CREATOR_PROFILE } from '@/lib/data/mockData';
import { Camera, Video, Share2, MapPin, Eye, Users, Film, Send, CheckCircle, Sparkles, Edit, Upload, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreatorPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Smriti Shah',
    role: 'Haute Couture Model & Visual Storyteller',
    location: 'Mumbai · Paris · London',
    bio: 'Smriti Shah (@smriti.shans) is an international visual artist, fashion model, and storyteller. She curates high-resolution fine art imagery, editorial films, and exclusive behind-the-scenes archives.',
    coverUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  });

  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editCoverPreview, setEditCoverPreview] = useState('');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('smr_admin_session') === 'authorized');
    const saved = localStorage.getItem('smr_creator_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    let newCoverUrl = profile.coverUrl;
    let newAvatarUrl = profile.avatarUrl;

    try {
      if (editCoverFile) {
        const formData = new FormData();
        formData.append('file', editCoverFile);
        const res = await fetch('/api/media/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) newCoverUrl = data.url;
      }

      if (editAvatarFile) {
        const formData = new FormData();
        formData.append('file', editAvatarFile);
        const res = await fetch('/api/media/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) newAvatarUrl = data.url;
      }

      const updated = {
        ...profile,
        coverUrl: newCoverUrl,
        avatarUrl: newAvatarUrl,
      };

      setProfile(updated);
      localStorage.setItem('smr_creator_profile', JSON.stringify(updated));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Cover Header Stage */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 h-72 sm:h-96 shadow-2xl bg-zinc-950">
        <img src={editCoverPreview || profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070b] via-[#08070b]/40 to-transparent" />

        {/* Admin Cover Upload Button */}
        {isAdmin && isEditing && (
          <div className="absolute top-4 right-4 z-20">
            <label className="p-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-neon">
              <Upload className="w-4 h-4" />
              <span>Change Cover Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setEditCoverFile(e.target.files[0]);
                    setEditCoverPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Profile Bio Bar */}
      <div className="relative -mt-24 sm:-mt-32 z-10 px-4 sm:px-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left w-full sm:w-auto">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-1 bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-neon relative group">
            <img src={editAvatarPreview || profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover rounded-[22px]" />
            {isAdmin && isEditing && (
              <label className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[22px] flex flex-col items-center justify-center text-white text-xs cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 mb-1 text-violet-400" />
                <span className="font-bold">Change Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setEditAvatarFile(e.target.files[0]);
                      setEditAvatarPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-1 pb-2 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display font-black text-2xl sm:text-4xl text-white">{profile.name}</h1>
              <CheckCircle className="w-5 h-5 text-violet-400 fill-violet-400/20" />
            </div>
            <p className="text-sm font-semibold text-violet-400">{profile.role}</p>
            <p className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5" /> {profile.location}
            </p>
          </div>
        </div>

        {/* Admin Edit Controls */}
        <div className="flex items-center gap-3 pb-2">
          {isAdmin && (
            isEditing ? (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveProfile} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 text-xs">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save Profile
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="text-zinc-400 text-xs">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setIsEditing(true)} className="bg-violet-600 hover:bg-violet-500 text-white font-bold gap-1.5 text-xs shadow-neon">
                <Edit className="w-3.5 h-3.5" />
                Edit Profile &amp; Images
              </Button>
            )
          )}

          <a href="https://instagram.com/smriti.shans" target="_blank" rel="noreferrer" className="p-3 rounded-full glass-card hover:border-violet-500/50 text-white">
            <Camera className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Admin Inline Form Editor */}
      {isAdmin && isEditing && (
        <div className="p-6 rounded-3xl bg-[#140f21] border border-violet-500/40 space-y-4 shadow-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Edit className="w-4 h-4 text-violet-400" />
            Edit Profile Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400">Creator Name</label>
              <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="text-xs bg-white/5" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Title / Role</label>
              <Input value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} className="text-xs bg-white/5" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Location</label>
              <Input value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="text-xs bg-white/5" />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-400">Biography Story</label>
            <textarea rows={3} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="w-full text-xs rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-violet-500" />
          </div>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase">Total Views</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{CREATOR_PROFILE.stats.totalViews}</p>
        </div>
        <div className="p-6 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase">Followers</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{CREATOR_PROFILE.stats.totalFollowers}</p>
        </div>
        <div className="p-6 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase">Media Items</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{CREATOR_PROFILE.stats.totalMedia}</p>
        </div>
        <div className="p-6 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase">Monthly Reach</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{CREATOR_PROFILE.stats.monthlyReach}</p>
        </div>
      </div>

      {/* Press Kit & Sponsorship Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Biography */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span>Creative Direction &amp; Biography</span>
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {profile.bio}
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Available for haute couture campaigns, luxury brand ambassadorships, architectural commissions, and magazine cover stories.
          </p>
        </div>

        {/* Sponsorship Inquiry */}
        <div className="glass-panel p-8 rounded-3xl border border-violet-500/40 space-y-4 shadow-neon">
          <h2 className="font-display font-bold text-2xl text-white">Sponsorship &amp; Booking Inquiries</h2>
          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-violet-600/20 border border-violet-500/50 text-center text-white space-y-2">
              <CheckCircle className="w-8 h-8 text-violet-400 mx-auto" />
              <h3 className="font-bold text-base">Inquiry Submitted Successfully</h3>
              <p className="text-xs text-gray-300">Smriti Shah&apos;s management team will review your booking proposal and respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Your Name / Brand</label>
                <input required type="text" placeholder="e.g. Vogue Press Office" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Corporate Email</label>
                <input required type="email" placeholder="contact@brand.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Campaign Details &amp; Budget</label>
                <textarea required rows={4} placeholder="Describe campaign scope, dates, and sponsorship budget..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs shadow-neon hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>Submit Partnership Proposal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
