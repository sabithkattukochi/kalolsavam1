'use client';

import React, { useState, useEffect } from 'react';
import { History, Plus, CheckCircle2, Sparkles, X, AlertCircle } from 'lucide-react';
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

  const refreshData = () => {
    setFestivals(dataStore.getFestivals());
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

