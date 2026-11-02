'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Search,
  List,
  CalendarDays,
  User,
  Phone,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { FestivalSchedule, Category } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false);
  const [schedules, setSchedules] = useState<FestivalSchedule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedVenue, setSelectedVenue] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'TIMELINE'>('LIST');

  const festival = dataStore.getActiveFestival();

  useEffect(() => {
    setMounted(true);
    setSchedules(dataStore.getSchedules());
    setCategories(dataStore.getCategories());
  }, []);

  if (!mounted) return null;

  // Extract unique dates and venues
  const uniqueDates = Array.from(new Set(schedules.map((s) => s.date))).sort();
  const uniqueVenues = Array.from(new Set(schedules.map((s) => s.venue))).sort();

  // Filter schedules
  const filtered = schedules.filter((s) => {
    const matchesDate = selectedDate === 'ALL' || s.date === selectedDate;
    const matchesCategory =
      selectedCategory === 'ALL' || s.event?.category_id === selectedCategory;
    const matchesVenue = selectedVenue === 'ALL' || s.venue === selectedVenue;
    return matchesDate && matchesCategory && matchesVenue;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar festivalName={festival.name} festivalEdition={festival.edition} />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Timetable & Venues
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Festival Schedule
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Track event schedules, stage allotments, coordinators, and real-time operational status across all festival days.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-8 space-y-4">
            {/* Date Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Festival Day:</span>
              <button
                onClick={() => setSelectedDate('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDate === 'ALL'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Days
              </button>
              {uniqueDates.map((d, index) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDate === d
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Day {index + 1} ({formatDate(d)})
                </button>
              ))}
            </div>

            {/* Dropdown Filters & View Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="ALL">All Venues & Stages</option>
                  {uniqueVenues.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    viewMode === 'LIST'
                      ? 'bg-slate-800 text-amber-300 border-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> List View
                </button>
                <button
                  onClick={() => setViewMode('TIMELINE')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    viewMode === 'TIMELINE'
                      ? 'bg-slate-800 text-amber-300 border-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" /> Timeline View
                </button>
              </div>
            </div>
          </div>

          {/* Schedule List View */}
          {viewMode === 'LIST' ? (
            <div className="space-y-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-5">
                    {/* Time Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0 w-28">
                      <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-xs font-bold text-white block">{item.start_time}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.end_time}</span>
                    </div>

                    {/* Event & Category Info */}
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {item.event?.code}
                        </span>
                        <span className="text-xs font-bold text-rose-400">
                          {item.event?.category?.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          • {item.event?.event_type}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {item.event?.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          {item.venue} {item.stage_number ? `(${item.stage_number})` : ''}
                        </span>
                        {item.event?.coordinator_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {item.event.coordinator_name}
                          </span>
                        )}
                        <span>Date: {formatDate(item.date)}</span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-amber-200/80 italic mt-1">
                          Notice: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center md:flex-col items-end justify-between gap-3 shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                        item.status === 'COMPLETED'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : item.status === 'DELAYED'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : item.status === 'RESCHEDULED'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>

                    <Link
                      href={`/events?id=${item.event_id}`}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      Event Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Timeline View */
            <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
              {filtered.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400 group-hover:scale-125 transition-transform" />

                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.start_time} - {item.end_time}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{formatDate(item.date)}</span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          item.status === 'COMPLETED'
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{item.event?.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {item.venue} {item.stage_number ? `• ${item.stage_number}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-300">No scheduled sessions found for chosen filters.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

