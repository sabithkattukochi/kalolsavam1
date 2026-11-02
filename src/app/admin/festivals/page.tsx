'use client';

import React, { useState, useEffect, useRef } from 'react';
import { History, Plus, CheckCircle2, Sparkles, X, AlertCircle, Upload, Image as ImageIcon, Trash2, Camera, ExternalLink } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { Festival } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function FestivalEditionsPage() {
  const [mounted, setMounted] = useState(false);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    edition: '',
    year: 2027,
    theme: '',
    description: '',
    college_name: 'Victoria State Arts & Science College',
    banner_url: '',
    start_date: '',
    end_date: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerInputUrl, setBannerInputUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const refreshData = () => {
    setFestivals(dataStore.getFestivals());
  };

  const activeFestival = festivals.find((f) => f.is_current) || festivals[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size exceeds 5MB limit. Please choose a smaller image.' });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      try {
        if (activeFestival) {
          dataStore.updateFestival(activeFestival.id, { banner_url: dataUrl });
          setMessage({ type: 'success', text: 'Festival cover banner uploaded and updated successfully!' });
          refreshData();
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setMessage({ type: 'error', text: msg });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBannerUrl = () => {
    if (!bannerInputUrl.trim() || !activeFestival) return;
    try {
      dataStore.updateFestival(activeFestival.id, { banner_url: bannerInputUrl.trim() });
      setMessage({ type: 'success', text: 'Festival cover banner URL updated successfully!' });
      setBannerInputUrl('');
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update banner URL';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleSetPresetBanner = (url: string, name: string) => {
    if (!activeFestival) return;
    try {
      dataStore.updateFestival(activeFestival.id, { banner_url: url });
      setMessage({ type: 'success', text: `Preset banner "${name}" applied!` });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to apply preset';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleRemoveBanner = () => {
    if (!activeFestival) return;
    try {
      dataStore.updateFestival(activeFestival.id, { banner_url: null });
      setMessage({ type: 'success', text: 'Banner reset to default cultural artwork.' });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset banner';
      setMessage({ type: 'error', text: msg });
    }
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
    setFormData((prev) => ({
      ...prev,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    }));
  }, []);

  const handleSwitchActive = (id: string) => {
    dataStore.setActiveFestival(id);
    setMessage({ type: 'success', text: 'Active festival edition switched.' });
    refreshData();
  };

  const handleCreateFestival = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dataStore.addFestival({
        name: formData.name,
        edition: formData.edition,
        year: Number(formData.year),
        theme: formData.theme || null,
        description: formData.description || null,
        college_name: formData.college_name,
        banner_url: formData.banner_url || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: 'UPCOMING',
        is_current: false,
      });

      setMessage({ type: 'success', text: `New edition "${formData.name}" created successfully.` });
      setIsModalOpen(false);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Creation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Festival Editions & History"
          description="Manage multiple annual festival iterations, active active edition, and historical archives"
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

          {/* FESTIVAL COVER / BANNER MANAGEMENT CARD */}
          <div id="banner" className="p-6 rounded-3xl bg-slate-900/90 border border-teal-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Camera className="w-3 h-3" />
                  Website Header Banner
                </div>
                <h2 className="text-lg font-black text-white">Festival Cover & Banner Image</h2>
                <p className="text-xs text-slate-400">
                  Upload an official cover banner to display prominently across the website header for {activeFestival?.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {activeFestival?.banner_url && (
                  <button
                    onClick={handleRemoveBanner}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-bold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Reset Banner
                  </button>
                )}
                <a
                  href="/"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Preview on Site
                </a>
              </div>
            </div>

            {/* Banner Preview Area */}
            <div className="relative w-full h-40 sm:h-52 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
              {activeFestival?.banner_url ? (
                <img
                  src={activeFestival.banner_url}
                  alt="Festival Banner Preview"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-2">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white">Default Kerala Cultural Banner Active</p>
                  <p className="text-xs text-slate-400 max-w-sm mt-0.5">
                    Traditional Kathakali, Mohiniyattam, and Kalolsavam Malayalam calligraphy are displayed. Upload a custom banner below to replace it.
                  </p>
                </div>
              )}

              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
                {activeFestival?.name} • {activeFestival?.edition}
              </div>
            </div>

            {/* Upload Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Option 1: Direct File Upload */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-slate-200">Upload Image File</h4>
                </div>
                <p className="text-[11px] text-slate-400">
                  Select an image (PNG, JPG, WebP) from your computer. Recommended aspect ratio 16:9 or 21:9 (1920x480px).
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="banner-file-input"
                />

                <label
                  htmlFor="banner-file-input"
                  className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wider transition-all ${
                    isUploading
                      ? 'bg-slate-800 text-slate-400 cursor-wait'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-md shadow-teal-500/20'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {isUploading ? 'Processing Image...' : 'Choose File to Upload'}
                </label>
              </div>

              {/* Option 2: Image URL Input */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-slate-200">Or Paste Image URL</h4>
                </div>
                <p className="text-[11px] text-slate-400">
                  Provide an external web URL to any high-resolution banner image.
                </p>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    value={bannerInputUrl}
                    onChange={(e) => setBannerInputUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveBannerUrl}
                    disabled={!bannerInputUrl.trim()}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all"
                  >
                    Save URL
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Quick Cultural Art Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSetPresetBanner(
                      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1920&q=80',
                      'Kathakali Performing Arts'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all border border-slate-700"
                >
                  🎭 Kathakali & Classical Arts
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSetPresetBanner(
                      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1920&q=80',
                      'Traditional Temple & Cultural Stage'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all border border-slate-700"
                >
                  🎪 Cultural Stage & Lights
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSetPresetBanner(
                      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
                      'Celebration Night'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all border border-slate-700"
                >
                  ✨ Festive Celebration
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Festival Editions</h2>
              <p className="text-xs text-slate-400">Preserves distinct records, student registrations, and leaderboards</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              New Festival Edition
            </button>
          </div>

          <div className="space-y-4">
            {festivals.map((fest) => {
              const isCurrent = fest.is_current;
              return (
                <div
                  key={fest.id}
                  className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-teal-500/15 via-slate-900 to-slate-950 border-teal-500/50 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-teal-400 font-mono">
                        {fest.year} • {fest.edition}
                      </span>
                      {isCurrent ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                          Active Edition
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {fest.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-white">{fest.name}</h3>
                    {fest.theme && (
                      <p className="text-xs text-slate-300 italic font-serif">&ldquo;{fest.theme}&rdquo;</p>
                    )}

                    <p className="text-xs text-slate-400">
                      Duration: {formatDate(fest.start_date)} - {formatDate(fest.end_date)}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {isCurrent ? (
                      <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-4 py-2 rounded-xl border border-teal-500/30">
                        Currently Managing
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitchActive(fest.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
                      >
                        Set as Active
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* CREATE EDITION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">New Festival Edition</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFestival} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Festival Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DHWANI 2027"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 uppercase font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Edition</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 39th Edition"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Academic Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Theme Motto</label>
                  <input
                    type="text"
                    placeholder="e.g. Symphony of Youth"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Create Edition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

