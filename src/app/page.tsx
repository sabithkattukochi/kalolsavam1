'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Shield,
  Zap,
  Crown,
  Bell,
  Clock,
  MapPin,
  ChevronRight,
  Palette,
  BookOpen,
  Music,
  Award,
  Users,
  Eye,
  Camera,
} from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { getPositionBadge, getGradeBadge, formatPoints, formatDate } from '@/lib/utils';
import { TeamLeaderboardItem, FestivalEvent, Announcement, EventResult, GalleryMedia } from '@/types/database';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [festival, setFestival] = useState(dataStore.getActiveFestival());
  const [leaderboard, setLeaderboard] = useState<TeamLeaderboardItem[]>([]);
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentResults, setRecentResults] = useState<EventResult[]>([]);
  const [featuredMedia, setFeaturedMedia] = useState<GalleryMedia[]>([]);

  useEffect(() => {
    setMounted(true);
    setFestival(dataStore.getActiveFestival());
    setLeaderboard(dataStore.getTeamLeaderboard());
    setEvents(dataStore.getEvents().slice(0, 4));
    setAnnouncements(dataStore.getAnnouncements().slice(0, 3));
    setRecentResults(dataStore.getResults(undefined, true).slice(0, 4));
    setFeaturedMedia(dataStore.getMedia().filter((m) => m.is_featured).slice(0, 4));
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  const teams = dataStore.getTeams();
  const studentsCount = dataStore.getStudents().length;
  const eventsCount = dataStore.getEvents().length;
  const categories = dataStore.getCategories();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar festivalName={festival.name} festivalEdition={festival.edition} />

      <main className="flex-1">
        {/* ========================================================
            HERO SECTION
            ======================================================== */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-slate-800/80">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-500/15 via-amber-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-bold text-amber-300 shadow-lg shadow-amber-950/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{festival.edition} • {festival.college_name}</span>
              </div>

              {/* Title & Theme */}
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white uppercase drop-shadow-sm">
                  {festival.name}
                </h1>
                <p className="text-lg sm:text-2xl font-serif italic text-amber-200/90 font-medium">
                  &ldquo;{festival.theme}&rdquo;
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {festival.description}
              </p>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/leaderboard"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  Live Leaderboard
                </Link>

                <Link
                  href="/events"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide border border-slate-700/80 transition-all hover:border-slate-600"
                >
                  Explore Events
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/schedule"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-bold text-sm border border-slate-800 transition-all"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Festival Schedule
                </Link>
              </div>

              {/* Quick Stat Counter */}
              <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-3xl font-black text-white">{teams.length}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Warrior Teams</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-3xl font-black text-amber-400">{eventsCount}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Cultural Events</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-3xl font-black text-rose-400">{categories.length}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Fest Categories</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-3xl font-black text-emerald-400">{studentsCount}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Enrolled Artists</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            LIVE TEAM LEADERBOARD HIGHLIGHT
            ======================================================== */}
        <section className="py-20 border-b border-slate-800/80 bg-slate-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black uppercase tracking-wider mb-2">
                  <Trophy className="w-3.5 h-3.5" />
                  Real-Time Standings
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Team Leaderboard
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Updated automatically as certified results are submitted and published by festival judges.
                </p>
              </div>

              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 group"
              >
                <span>View Full Score Matrix & Breakdown</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Podium Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leaderboard.map((team, idx) => {
                const isFirst = idx === 0;
                return (
                  <div
                    key={team.team_id}
                    className={`relative rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                      isFirst
                        ? 'bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-950 border-amber-500/50 shadow-2xl shadow-amber-950/30 ring-1 ring-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isFirst && (
                      <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-md">
                        Current Leader
                      </div>
                    )}

                    <div>
                      {/* Rank & Team Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner"
                          style={{ backgroundColor: `${team.color}25`, color: team.color }}
                        >
                          #{team.rank}
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-black tracking-wider border"
                          style={{
                            borderColor: `${team.color}40`,
                            backgroundColor: `${team.color}15`,
                            color: team.color,
                          }}
                        >
                          {team.code}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-white tracking-tight">{team.name}</h3>
                      {team.motto && (
                        <p className="text-xs text-slate-400 italic line-clamp-1 mt-1 font-serif">
                          &ldquo;{team.motto}&rdquo;
                        </p>
                      )}

                      {/* Points Tally */}
                      <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-4xl font-black text-white tracking-tight">
                          {formatPoints(team.total_points)}
                        </span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                          Total Points
                        </span>
                      </div>

                      {/* Medals Tally */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-amber-400 font-bold block text-sm">{team.first_count}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">1st (Gold)</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-slate-300 font-bold block text-sm">{team.second_count}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">2nd (Silver)</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-amber-600 font-bold block text-sm">{team.third_count}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">3rd (Bronze)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Total Awards: <strong className="text-white">{team.total_awards}</strong></span>
                      <span className="text-emerald-400 font-semibold">Grade A: {team.grade_a_count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            FESTIVAL CATEGORIES (Chithrolsavam, Sahithyolsavam, Stage)
            ======================================================== */}
        <section className="py-20 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                Pillars of Dhwani
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Event Categories
              </h2>
              <p className="text-sm text-slate-400">
                Over 45 competitions structured under three signature creative verticals, with custom rules and expert adjudicators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat, idx) => {
                const icons = [Palette, BookOpen, Music];
                const IconComponent = icons[idx % icons.length];
                const gradients = [
                  'from-rose-500 to-orange-500',
                  'from-blue-500 to-indigo-600',
                  'from-amber-400 to-rose-500',
                ];
                const grad = gradients[idx % gradients.length];

                return (
                  <div
                    key={cat.id}
                    className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Category Cover Image */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={cat.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white">
                        <IconComponent className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-amber-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                        <Link
                          href={`/events?category=${cat.id}`}
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300"
                        >
                          View Events <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <span className="text-[11px] font-semibold text-slate-400">
                          Order #{cat.display_order}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            RECENT RESULTS & UPCOMING SCHEDULE SPLIT SECTION
            ======================================================== */}
        <section className="py-20 border-b border-slate-800/80 bg-slate-950/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Recent Results */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Just Announced
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                      Recent Certified Results
                    </h3>
                  </div>
                  <Link
                    href="/results"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    All Results <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentResults.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
                      Judges are currently compiling result sheets. Check back shortly.
                    </div>
                  ) : (
                    recentResults.map((res) => {
                      const posBadge = getPositionBadge(res.position);
                      const grdBadge = getGradeBadge(res.grade);
                      return (
                        <div
                          key={res.id}
                          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {posBadge ? (
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${posBadge.badge} shrink-0`}>
                                {posBadge.icon}
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400 shrink-0">
                                –
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">
                                {res.student?.full_name || res.group_team?.group_name || 'Participant'}
                              </h4>
                              <p className="text-xs text-slate-400 truncate">
                                {res.event?.name} • <span style={{ color: res.team?.color }}>{res.team?.name}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-extrabold text-amber-400">
                              +{res.total_points} pts
                            </span>
                            {grdBadge && (
                              <span className={`block text-[10px] px-1.5 py-0.5 rounded mt-0.5 ${grdBadge.className}`}>
                                {grdBadge.label}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Upcoming Schedule */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Live Schedule
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                      Upcoming Competitions
                    </h3>
                  </div>
                  <Link
                    href="/schedule"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    View Timetable <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {ev.code}
                          </span>
                          <span className="text-[10px] font-bold text-amber-400">
                            {ev.category?.name}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{ev.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {ev.start_time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ev.venue}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border ${
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            ANNOUNCEMENTS & NOTICE BOARD
            ======================================================== */}
        <section className="py-20 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  Notice Board
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                  Festival Bulletins & Alerts
                </h2>
              </div>
              <Link
                href="/announcements"
                className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                All Announcements <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between ${
                    ann.is_pinned
                      ? 'bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          ann.category === 'URGENT'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : ann.category === 'RESULT_ALERT'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        }`}
                      >
                        {ann.category.replace('_', ' ')}
                      </span>
                      {ann.is_pinned && (
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                          📌 Pinned Notice
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium pt-4 mt-4 border-t border-slate-800/80">
                    Posted on {formatDate(ann.published_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            FEATURED GALLERY MEDIA
            ======================================================== */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Visual Chronicle
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Festival Moments
                </h2>
              </div>
              <Link
                href="/gallery"
                className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Browse Full Gallery & Albums <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMedia.map((m) => (
                <div
                  key={m.id}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 h-64"
                >
                  <img
                    src={m.media_url}
                    alt={m.caption || 'Festival highlight'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-xs">
                    <p className="font-bold text-white line-clamp-2">{m.caption}</p>
                    <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mt-1 block">
                      Featured Photograph
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
