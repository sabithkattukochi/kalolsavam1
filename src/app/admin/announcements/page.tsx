'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Pin,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { Announcement, AnnouncementCategory } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function AnnouncementsManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    category: AnnouncementCategory;
    is_pinned: boolean;
    is_published: boolean;
  }>({
    title: '',
    content: '',
    category: 'GENERAL',
    is_pinned: false,
    is_published: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshData = () => {
    setAnnouncements(dataStore.getAnnouncements(undefined, false));
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const openAddModal = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      content: '',
      category: 'GENERAL',
      is_pinned: false,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setFormData({
      title: ann.title,
      content: ann.content,
      category: ann.category,
      is_pinned: ann.is_pinned,
      is_published: ann.is_published,
    });
    setIsModalOpen(true);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        dataStore.updateAnnouncement(editingAnnouncement.id, {
          title: formData.title,
          content: formData.content,
          category: formData.category,
          is_pinned: formData.is_pinned,
          is_published: formData.is_published,
        });
        setMessage({ type: 'success', text: 'Announcement updated.' });
      } else {
        dataStore.addAnnouncement({
          festival_id: festival.id,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          is_pinned: formData.is_pinned,
          is_published: formData.is_published,
          published_at: new Date().toISOString(),
        });
        setMessage({ type: 'success', text: 'New announcement broadcasted.' });
      }
      setIsModalOpen(false);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      dataStore.deleteAnnouncement(id);
      setMessage({ type: 'success', text: 'Announcement deleted.' });
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
          title="Announcements & Bulletins"
          description="Broadcast festival updates, urgent venue shifts, and official dispatches"
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
              <h2 className="text-xl font-extrabold text-white">Notice Board Broadcasts</h2>
              <p className="text-xs text-slate-400">Total {announcements.length} notices posted</p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              New Notice
            </button>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all ${
                  ann.is_pinned
                    ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        ann.category === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : ann.category === 'RESULT_ALERT'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {ann.category.replace('_', ' ')}
                    </span>
                    {ann.is_pinned && (
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-amber-400" /> Pinned
                      </span>
                    )}
                    <span className="text-xs text-slate-400">• {formatDate(ann.published_at)}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{ann.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{ann.content}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(ann)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-blue-400"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">
                {editingAnnouncement ? 'Edit Announcement' : 'Broadcast Announcement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Update for Classical Dance"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category Tag</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold"
                  >
                    <option value="GENERAL">General Notice</option>
                    <option value="SCHEDULE_CHANGE">Schedule Shift / Venue Update</option>
                    <option value="RESULT_ALERT">Result Announcement</option>
                    <option value="URGENT">Urgent Control Notice</option>
                  </select>
                </div>

                <div className="space-y-1 flex items-end pb-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.is_pinned}
                      onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span>Pin to Top of Notice Board</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Notice Content & Instructions</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed circular content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200"
                />
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
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

