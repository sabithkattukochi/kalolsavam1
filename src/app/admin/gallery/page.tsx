'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Star,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { GalleryAlbum, GalleryMedia } from '@/types/database';

export default function GalleryManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [media, setMedia] = useState<GalleryMedia[]>([]);

  // Modals
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const [albumForm, setAlbumForm] = useState({
    title: '',
    description: '',
    cover_image_url: '',
  });

  const [mediaForm, setMediaForm] = useState<{
    album_id: string;
    media_type: 'IMAGE' | 'VIDEO';
    media_url: string;
    caption: string;
    is_featured: boolean;
  }>({
    album_id: '',
    media_type: 'IMAGE',
    media_url: '',
    caption: '',
    is_featured: false,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshData = () => {
    const albList = dataStore.getAlbums(undefined, false);
    setAlbums(albList);
    setMedia(dataStore.getMedia(undefined, false));
    if (albList.length > 0 && !mediaForm.album_id) {
      setMediaForm((prev) => ({ ...prev, album_id: albList[0].id }));
    }
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dataStore.addAlbum({
        festival_id: festival.id,
        event_id: null,
        title: albumForm.title,
        description: albumForm.description || null,
        cover_image_url: albumForm.cover_image_url || null,
        is_published: true,
      });
      setMessage({ type: 'success', text: `Album "${albumForm.title}" created.` });
      setIsAlbumModalOpen(false);
      setAlbumForm({ title: '', description: '', cover_image_url: '' });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dataStore.addMedia({
        album_id: mediaForm.album_id,
        festival_id: festival.id,
        media_type: mediaForm.media_type,
        media_url: mediaForm.media_url,
        thumbnail_url: null,
        caption: mediaForm.caption || null,
        is_featured: mediaForm.is_featured,
        is_published: true,
        sort_order: media.length + 1,
      });
      setMessage({ type: 'success', text: 'Media item added to gallery.' });
      setIsMediaModalOpen(false);
      setMediaForm({
        album_id: albums[0]?.id || '',
        media_type: 'IMAGE',
        media_url: '',
        caption: '',
        is_featured: false,
      });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteMedia = (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      dataStore.deleteMedia(id);
      setMessage({ type: 'success', text: 'Media item deleted.' });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Gallery & Media Manager"
          description="Curate photo albums, video feeds, and featured cultural moments"
        />

        <main className="flex-1 p-6 md:p-8 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{message.text}</span>
              </div>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Media Collection</h2>
              <p className="text-xs text-slate-400">{albums.length} albums • {media.length} items</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAlbumModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4 text-teal-400" /> Create Album
              </button>

              <button
                onClick={() => setIsMediaModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <Camera className="w-4 h-4" /> Upload Media
              </button>
            </div>
          </div>

          {/* Media Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div className="relative h-48 w-full">
                  <img
                    src={item.media_url}
                    alt={item.caption || 'Media item'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {item.is_featured && (
                      <span className="p-1 rounded-md bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950" title="Featured Media">
                        <Star className="w-3.5 h-3.5 fill-slate-950" />
                      </span>
                    )}
                    <span className="p-1 rounded-md bg-slate-950/80 text-white text-[10px] font-bold border border-white/10">
                      {item.media_type}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs font-bold text-white line-clamp-2">
                    {item.caption || 'Untitled photo exhibit'}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      {albums.find((a) => a.id === item.album_id)?.title || 'General'}
                    </span>
                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* CREATE ALBUM MODAL */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Create Gallery Album</h3>
              <button onClick={() => setIsAlbumModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Album Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bharatanatyam Stage 1 Highlights"
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={albumForm.cover_image_url}
                  onChange={(e) => setAlbumForm({ ...albumForm, cover_image_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief context about this photo album..."
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD MEDIA MODAL */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Add Photo or Video</h3>
              <button onClick={() => setIsMediaModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Select Album</label>
                <select
                  required
                  value={mediaForm.album_id}
                  onChange={(e) => setMediaForm({ ...mediaForm, album_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Media Type</label>
                  <select
                    value={mediaForm.media_type}
                    onChange={(e) => setMediaForm({ ...mediaForm, media_type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="IMAGE">Photograph</option>
                    <option value="VIDEO">Video / Reel</option>
                  </select>
                </div>

                <div className="space-y-1 flex items-end pb-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300">
                    <input
                      type="checkbox"
                      checked={mediaForm.is_featured}
                      onChange={(e) => setMediaForm({ ...mediaForm, is_featured: e.target.checked })}
                      className="rounded text-teal-400 focus:ring-teal-500"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Media URL (Storage/Unsplash/CDN)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={mediaForm.media_url}
                  onChange={(e) => setMediaForm({ ...mediaForm, media_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Caption / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Dramatic mime piece performed by Emerald team"
                  value={mediaForm.caption}
                  onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

