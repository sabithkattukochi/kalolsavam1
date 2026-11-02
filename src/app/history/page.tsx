'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Award, Calendar, Trophy, Sparkles, Star, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { Festival } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [festivals, setFestivals] = useState<Festival[]>([]);

  useEffect(() => {
    setMounted(true);
    setFestivals(dataStore.getFestivals());
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20">
              Legacy & Archives
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Festival History</span>
              <History className="w-8 h-8 text-teal-400" />
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Explore past editions of the Victoria College Arts Festival, celebrating three decades of collegiate artistic heritage, champions, and milestones.
            </p>
          </div>

          {/* Festival Editions Timeline / Cards */}
          <div className="space-y-12">
            {festivals.map((fest) => {
              const isCurrent = fest.is_current;
              return (
                <div
                  key={fest.id}
                  className={`rounded-3xl p-8 md:p-10 border transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-teal-500/10 via-slate-900 to-slate-950 border-teal-500/40 shadow-2xl'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Banner Image */}
                    <div className="lg:col-span-5 relative h-64 w-full rounded-2xl overflow-hidden">
                      <img
                        src={fest.banner_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'}
                        alt={fest.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                            isCurrent
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {fest.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-7 space-y-4">
                      <div>
                        <span className="text-xs font-extrabold text-teal-400">
                          {fest.year} • {fest.edition}
                        </span>
                        <h2 className="text-3xl font-black text-white tracking-tight mt-1">
                          {fest.name}
                        </h2>
                        {fest.theme && (
                          <p className="text-base font-serif italic text-teal-200/90 mt-1">
                            &ldquo;{fest.theme}&rdquo;
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {fest.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(fest.start_date)} – {formatDate(fest.end_date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-teal-400" />
                          {fest.college_name}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
                        {isCurrent ? (
                          <Link
                            href="/leaderboard"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                          >
                            Explore Live Edition <ChevronRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
                            Archived Past Edition
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

