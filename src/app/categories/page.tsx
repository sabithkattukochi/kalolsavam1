'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Palette, BookOpen, Music, Layers, ArrowRight, Sparkles, Calendar, Users } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { Category, FestivalEvent } from '@/types/database';

export default function CategoriesPage() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const festival = dataStore.getActiveFestival();

  useEffect(() => {
    setMounted(true);
    setCategories(dataStore.getCategories());
    setEvents(dataStore.getEvents());
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar festivalName={festival.name} festivalEdition={festival.edition} />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20">
              Competition Arenas
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Event Categories
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Dhwani 2026 hosts competitions divided into distinct creative domains: visual arts, literary expressions, and live stage spectacles.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="space-y-12">
            {categories.map((cat, idx) => {
              const catEvents = events.filter((e) => e.category_id === cat.id);
              const icons = [Palette, BookOpen, Music, Layers];
              const Icon = icons[idx % icons.length];

              return (
                <div
                  key={cat.id}
                  id={cat.slug}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 md:p-10 transition-all hover:border-slate-700/80 scroll-mt-28"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Cover & Icon */}
                    <div className="lg:col-span-5 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden">
                      <img
                        src={cat.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-teal-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950 text-xs font-black uppercase tracking-wider">
                          {catEvents.length} Competitions
                        </span>
                      </div>
                    </div>

                    {/* Details & Event List */}
                    <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h2 className="text-3xl font-black text-white tracking-tight">{cat.name}</h2>
                          <span className="text-xs text-slate-400 font-bold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                            Category #{cat.display_order}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      {/* Event Previews */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Featured Competitions in this Category:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {catEvents.slice(0, 4).map((ev) => (
                            <Link
                              key={ev.id}
                              href={`/events?id=${ev.id}`}
                              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 transition-all flex items-center justify-between group"
                            >
                              <div className="min-w-0">
                                <span className="text-[10px] font-black text-teal-400 block">{ev.code}</span>
                                <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors truncate block">
                                  {ev.name}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                {ev.event_type}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <Link
                          href={`/events?category=${cat.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                        >
                          Explore All {cat.name} Events
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <span className="text-xs text-slate-400">
                          {catEvents.filter((e) => e.status === 'COMPLETED').length} Finished / {catEvents.length} Total
                        </span>
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

