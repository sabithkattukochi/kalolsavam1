'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Info,
  X,
  Sparkles,
  Phone,
  FileText,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { FestivalEvent, Category, EventRegistration, GroupEventTeam } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function EventsPage() {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeModalEvent, setActiveModalEvent] = useState<FestivalEvent | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [groupTeams, setGroupTeams] = useState<GroupEventTeam[]>([]);

  const festival = dataStore.getActiveFestival();

  useEffect(() => {
    setMounted(true);
    setEvents(dataStore.getEvents());
    setCategories(dataStore.getCategories());
  }, []);

  const openEventModal = (ev: FestivalEvent) => {
    setActiveModalEvent(ev);
    if (ev.event_type === 'INDIVIDUAL') {
      setEventRegistrations(dataStore.getRegistrations(ev.id));
    } else {
      setGroupTeams(dataStore.getGroupTeams(ev.id));
    }
  };

  const closeEventModal = () => {
    setActiveModalEvent(null);
  };

  if (!mounted) return null;

  // Filter logic
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.description && ev.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || ev.category_id === selectedCategory;
    const matchesType = selectedType === 'ALL' || ev.event_type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || ev.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar festivalName={festival.name} festivalEdition={festival.edition} />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/20">
              Competition Catalog
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Festival Events
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Explore competitions, schedules, participant limits, venues, and official judging criteria.
            </p>
          </div>

          {/* Search & Filters Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search input */}
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by event title, code, venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Type Dropdown */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="INDIVIDUAL">Individual Solo</option>
                  <option value="GROUP">Group Competitions</option>
                </select>
              </div>
            </div>

            {/* Quick Status Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-semibold mr-2">Status Filter:</span>
              {['ALL', 'SCHEDULED', 'ONGOING', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all ${
                    selectedStatus === st
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Events Count Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-6 px-1">
            <span>Showing {filteredEvents.length} of {events.length} competitions</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-teal-400 hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => openEventModal(ev)}
                className="group p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Code & Type */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      {ev.code}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {ev.event_type}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                    {ev.name}
                  </h3>
                  <p className="text-xs text-rose-400 font-semibold mt-0.5">
                    {ev.category?.name}
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-3 leading-relaxed">
                    {ev.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {ev.start_time} - {ev.end_time}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        ev.status === 'COMPLETED'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : ev.status === 'ONGOING'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </span>
                    <span className="text-teal-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 space-y-3">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-base font-bold text-slate-300">No competitions found matching filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedType('ALL');
                  setSelectedStatus('ALL');
                }}
                className="px-4 py-2 text-xs font-bold text-teal-400 bg-teal-500/10 rounded-xl border border-teal-500/30"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          EVENT DETAIL MODAL
          ======================================================== */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {activeModalEvent.code}
                  </span>
                  <span className="text-xs font-bold text-rose-400">
                    {activeModalEvent.category?.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                    {activeModalEvent.event_type}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {activeModalEvent.name}
                </h2>
              </div>
              <button
                onClick={closeEventModal}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Event Description */}
              {activeModalEvent.description && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview</h4>
                  <p className="text-slate-300 leading-relaxed">{activeModalEvent.description}</p>
                </div>
              )}

              {/* Timing & Venue Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400" /> Date & Time
                  </span>
                  <p className="font-bold text-white text-sm">
                    {formatDate(activeModalEvent.date)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {activeModalEvent.start_time} – {activeModalEvent.end_time}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> Venue & Stage
                  </span>
                  <p className="font-bold text-white text-sm">
                    {activeModalEvent.venue}
                  </p>
                  <p className="text-xs text-slate-400">
                    {activeModalEvent.stage_number || 'General Stage'}
                  </p>
                </div>
              </div>

              {/* Coordinator Info */}
              {activeModalEvent.coordinator_name && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Event Coordinator
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {activeModalEvent.coordinator_name}
                    </p>
                  </div>
                  {activeModalEvent.coordinator_phone && (
                    <a
                      href={`tel:${activeModalEvent.coordinator_phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-teal-400"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {activeModalEvent.coordinator_phone}
                    </a>
                  )}
                </div>
              )}

              {/* Rules & Guidelines */}
              {activeModalEvent.rules && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Official Competition Rules
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {activeModalEvent.rules}
                  </p>
                </div>
              )}

              {/* Participants Roster (Public Safe View) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    Enrolled Participants ({activeModalEvent.event_type === 'INDIVIDUAL' ? eventRegistrations.length : groupTeams.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">Managed by Festival Admin</span>
                </div>

                {activeModalEvent.event_type === 'INDIVIDUAL' ? (
                  eventRegistrations.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No participants enrolled yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {eventRegistrations.map((reg) => (
                        <div
                          key={reg.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] font-black text-teal-400">
                              Chest #{reg.chest_number}
                            </span>
                            <p className="text-xs font-bold text-white truncate">
                              {reg.student?.full_name}
                            </p>
                          </div>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0"
                            style={{
                              borderColor: `${reg.team?.color}40`,
                              backgroundColor: `${reg.team?.color}15`,
                              color: reg.team?.color,
                            }}
                          >
                            {reg.team?.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  groupTeams.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No group squads enrolled yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {groupTeams.map((grp) => (
                        <div
                          key={grp.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] font-black text-teal-400">
                              Chest #{grp.chest_number}
                            </span>
                            <p className="text-xs font-bold text-white truncate">
                              {grp.group_name}
                            </p>
                          </div>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0"
                            style={{
                              borderColor: `${grp.team?.color}40`,
                              backgroundColor: `${grp.team?.color}15`,
                              color: grp.team?.color,
                            }}
                          >
                            {grp.team?.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Status: <strong className="text-white">{activeModalEvent.status}</strong>
              </span>
              <button
                onClick={closeEventModal}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

