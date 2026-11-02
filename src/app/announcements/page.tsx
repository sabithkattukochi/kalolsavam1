'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, Calendar, Award, Info, Pin, Search } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { Announcement } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function AnnouncementsPage() {
  const [mounted, setMounted] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const festival = dataStore.getActiveFestival();

  useEffect(() => {
    setMounted(true);
    setAnnouncements(dataStore.getAnnouncements(undefined, true));
  }, []);

  if (!mounted) return null;

  const filtered = announcements.filter((a) => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar festivalName={festival.name} festivalEdition={festival.edition} />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/20">
              Notice Board
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Festival Bulletins</span>
              <Bell className="w-8 h-8 text-rose-400" />
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Official circulars, reporting times, emergency schedule updates, and result declaration alerts.
            </p>
          </div>

          {/* Filters */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold mr-2 uppercase">Filter:</span>
              {['ALL', 'GENERAL', 'SCHEDULE_CHANGE', 'RESULT_ALERT', 'URGENT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Notices Grid */}
          <div className="space-y-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                  item.is_pinned
                    ? 'bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/40 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          item.category === 'URGENT'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : item.category === 'RESULT_ALERT'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : item.category === 'SCHEDULE_CHANGE'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.category.replace('_', ' ')}
                      </span>
                      {item.is_pinned && (
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Pin className="w-3 h-3 text-amber-400 fill-amber-400" /> Pinned Notice
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0">
                    <span className="text-xs text-slate-400 font-semibold block">
                      {formatDate(item.published_at)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                      Official College Dispatch
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <Bell className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-300">No notices found matching current filters.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

