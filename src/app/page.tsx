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
  ChevronLeft,
  Palette,
  BookOpen,
  Music,
  Award,
  Users,
  Eye,
  Camera,
  Search,
  Radio,
  Building2,
  GraduationCap,
  Star,
} from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { FestivalBanner } from '@/components/public/FestivalBanner';
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
  const [resultCarouselIndex, setResultCarouselIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    setFestival(dataStore.getActiveFestival());
    setLeaderboard(dataStore.getTeamLeaderboard());
    setEvents(dataStore.getEvents().slice(0, 4));
    setAnnouncements(dataStore.getAnnouncements().slice(0, 3));
    setRecentResults(dataStore.getResults(undefined, true));
    setFeaturedMedia(dataStore.getMedia().filter((m) => m.is_featured).slice(0, 4));
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Sparkles className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  const teams = dataStore.getTeams();
  const studentsCount = dataStore.getStudents().length;
  const eventsCount = dataStore.getEvents().length;
  const categories = dataStore.getCategories();

  const handleNextResult = () => {
    if (recentResults.length === 0) return;
    setResultCarouselIndex((prev) => (prev + 1) % recentResults.length);
  };

  const handlePrevResult = () => {
    if (recentResults.length === 0) return;
    setResultCarouselIndex((prev) => (prev - 1 + recentResults.length) % recentResults.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950">
      {/* 1. TOP OFFICIAL FESTIVAL COVER / BANNER (Reference: Kerala Kalolsavam Header) */}
      <FestivalBanner festival={festival} showAdminAction={true} />

      {/* 2. MAIN NAVIGATION */}
      <Navbar festivalName={festival.name} festivalEdition={festival.edition} />

      {/* 3. QUICK ACTION SUB-BAR (Reference: Kerala Kalolsavam Stage Status, Venues & Item Search) */}
      <div className="w-full bg-slate-950/90 border-b border-cyan-900/40 px-4 py-2.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/schedule"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Status of Stages</span>
            </Link>
            <Link
              href="/schedule"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Venues</span>
            </Link>
            <Link
              href="/results"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
            >
              <Award className="w-3.5 h-3.5 text-teal-400" />
              <span>Results</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leading Teams</span>
            </Link>
            <Link
              href="/schedule"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Program Schedule</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 transition-all shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>Login Portals ▾</span>
            </Link>
          </div>

          {/* Quick Item Code Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem('search') as HTMLInputElement;
              if (input?.value.trim()) {
                window.location.href = `/events?search=${encodeURIComponent(input.value.trim())}`;
              }
            }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Item Code / Event..."
                className="w-48 sm:w-60 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 p-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all"
                title="Search Event"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <main className="flex-1">
        {/* ========================================================
            HERO SECTION
            ======================================================== */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-slate-800/80">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-xs font-bold text-teal-300 shadow-lg shadow-teal-950/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{festival.edition} • {festival.college_name}</span>
              </div>

              {/* Title & Theme */}
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white uppercase drop-shadow-sm">
                  {festival.name}
                </h1>
                <p className="text-lg sm:text-2xl font-serif italic text-teal-200/90 font-medium">
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
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all"
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
                  <Calendar className="w-4 h-4 text-teal-400" />
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
                  <p className="text-3xl font-black text-teal-400">{eventsCount}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Cultural Events</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-3xl font-black text-cyan-400">{categories.length}</p>
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
            LIVE TEAM LEADERBOARD & PODIUM (Reference: Kerala Kalolsavam LEADING DISTRICTS)
            ======================================================== */}
        <section className="py-20 border-b border-cyan-900/40 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Kerala Kalolsavam Leading Districts Title */}
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-widest text-amber-300 uppercase drop-shadow-md">
                LEADING TEAMS
              </h2>
              <p className="text-xs sm:text-sm text-teal-200/80 font-medium">
                Official Real-Time Championship Standings & Points Tally
              </p>
            </div>

            {/* Reference 3D Trophy Podium Grid (Center Elevated #1, Left #2, Right #3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto mb-10">
              {/* #2 PODIUM CARD (Left) */}
              {leaderboard[1] && (
                <div className="order-2 md:order-1 rounded-3xl p-6 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-xl text-center space-y-4 hover:border-slate-600 transition-all">
                  <div className="w-10 h-10 rounded-full bg-slate-700/60 border border-slate-500/40 text-slate-200 font-black text-sm flex items-center justify-center mx-auto shadow-sm">
                    2
                  </div>
                  <div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                      style={{
                        borderColor: `${leaderboard[1].color}50`,
                        backgroundColor: `${leaderboard[1].color}20`,
                        color: leaderboard[1].color,
                      }}
                    >
                      {leaderboard[1].code}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1.5">{leaderboard[1].name}</h3>
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-100 block">
                      {formatPoints(leaderboard[1].total_points)}
                    </span>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mt-0.5 block">
                      POINTS
                    </span>
                  </div>
                </div>
              )}

              {/* #1 PODIUM CARD (Center Elevated with Golden Trophy) */}
              {leaderboard[0] && (
                <div className="order-1 md:order-2 rounded-3xl p-7 bg-gradient-to-b from-teal-500/20 via-slate-900 to-slate-950 border-2 border-amber-400/60 shadow-2xl shadow-amber-500/20 text-center space-y-4 transform md:-translate-y-4 ring-1 ring-amber-400/30 relative">
                  {/* Glowing 3D Golden Trophy Artwork */}
                  <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-xl animate-pulse pointer-events-none" />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-[2px] shadow-lg shadow-amber-500/40 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-amber-400 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />
                      </div>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center mx-auto shadow-md">
                    1
                  </div>

                  <div>
                    <span
                      className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm"
                      style={{
                        borderColor: `${leaderboard[0].color}50`,
                        backgroundColor: `${leaderboard[0].color}25`,
                        color: leaderboard[0].color,
                      }}
                    >
                      {leaderboard[0].code} • Current Leader
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">
                      {leaderboard[0].name}
                    </h3>
                  </div>

                  <div className="pt-2">
                    <span className="text-4xl sm:text-5xl font-black text-amber-300 block tracking-tight drop-shadow-sm">
                      {formatPoints(leaderboard[0].total_points)}
                    </span>
                    <span className="text-xs font-black tracking-widest text-amber-400 uppercase mt-0.5 block">
                      POINTS
                    </span>
                  </div>
                </div>
              )}

              {/* #3 PODIUM CARD (Right) */}
              {leaderboard[2] && (
                <div className="order-3 md:order-3 rounded-3xl p-6 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-xl text-center space-y-4 hover:border-slate-600 transition-all">
                  <div className="w-10 h-10 rounded-full bg-amber-800/60 border border-amber-600/40 text-amber-200 font-black text-sm flex items-center justify-center mx-auto shadow-sm">
                    3
                  </div>
                  <div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                      style={{
                        borderColor: `${leaderboard[2].color}50`,
                        backgroundColor: `${leaderboard[2].color}20`,
                        color: leaderboard[2].color,
                      }}
                    >
                      {leaderboard[2].code}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1.5">{leaderboard[2].name}</h3>
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-100 block">
                      {formatPoints(leaderboard[2].total_points)}
                    </span>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mt-0.5 block">
                      POINTS
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* View Detailed Standings Link (Matching Image 2) */}
            <div className="text-center pt-2">
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-xs font-black uppercase tracking-widest text-teal-300 hover:text-white transition-all shadow-lg shadow-teal-950/40 group"
              >
                <span>VIEW DETAILED STANDINGS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-teal-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            FESTIVAL CATEGORIES (Chithrolsavam, Sahithyolsavam, Stage)
            ======================================================== */}
        <section className="py-20 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
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
                        <IconComponent className="w-5 h-5 text-teal-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-teal-300 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                        <Link
                          href={`/events?category=${cat.id}`}
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 hover:text-teal-300"
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
            LATEST RESULTS – PARTICIPANTS (Reference: Kerala Kalolsavam Image 1)
            ======================================================== */}
        <section className="py-16 border-b border-cyan-900/40 bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wider text-white uppercase">
                  LATEST RESULTS – PARTICIPANTS
                </h2>
                <p className="text-xs text-teal-300/80 font-medium mt-0.5">
                  Certified event winners & participant certificates
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevResult}
                  className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                  aria-label="Previous result"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextResult}
                  className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                  aria-label="Next result"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {recentResults.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
                No certified participant results published yet. Check back soon.
              </div>
            ) : (
              (() => {
                const currentRes = recentResults[resultCarouselIndex] || recentResults[0];
                const samplePhotos = [
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                ];
                const photoUrl = samplePhotos[resultCarouselIndex % samplePhotos.length];
                const teamName = currentRes.team?.name || 'Independent';

                return (
                  <div className="rounded-3xl bg-slate-900/90 border border-cyan-900/40 overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch">
                    {/* Participant Photo with District/Team Ribbon (Image 1 reference) */}
                    <div className="relative w-full md:w-56 h-64 md:h-auto shrink-0 bg-slate-950 flex flex-col justify-end overflow-hidden">
                      <img
                        src={photoUrl}
                        alt={currentRes.student?.full_name || 'Participant'}
                        className="absolute inset-0 w-full h-full object-cover object-top filter contrast-[1.05]"
                      />
                      <div className="relative z-10 w-full bg-slate-950/90 border-t border-cyan-500/30 text-center py-2 px-3 backdrop-blur-md">
                        <span
                          className="text-xs font-black tracking-widest uppercase block truncate"
                          style={{ color: currentRes.team?.color || '#38bdf8' }}
                        >
                          {teamName}
                        </span>
                      </div>
                    </div>

                    {/* Participant Details (Image 1 reference) */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Event Pill: e.g. 601 • CHITHRA RACHANA - PENCIL */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-[11px] font-black uppercase tracking-wider text-teal-300">
                          <span>{currentRes.event?.code || 'EV-01'}</span>
                          <span>•</span>
                          <span>{currentRes.event?.name}</span>
                        </div>

                        {/* Student Name */}
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                          {currentRes.student?.full_name || currentRes.group_team?.group_name || 'Participant Name'}
                        </h3>

                        {/* Grade Badge: GRADE A */}
                        <div>
                          <span className="inline-block px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                            GRADE {currentRes.grade || 'A'}
                          </span>
                        </div>
                      </div>

                      {/* Institution / College Line */}
                      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                          <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
                          <span>
                            {festival.college_name} • {currentRes.student?.course || currentRes.student?.department || 'Department of Fine Arts'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-teal-300">
                            +{currentRes.total_points} Points Awarded
                          </span>
                          <Link
                            href="/results"
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
                          >
                            View Result Sheet →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
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
                    <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                      Just Announced
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                      Recent Certified Results
                    </h3>
                  </div>
                  <Link
                    href="/results"
                    className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
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
                            <span className="text-sm font-extrabold text-teal-400">
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
                          <span className="text-[10px] font-bold text-teal-400">
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
                className="text-sm font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
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
                      ? 'bg-gradient-to-br from-teal-500/10 via-slate-900 to-slate-950 border-teal-500/40'
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
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        }`}
                      >
                        {ann.category.replace('_', ' ')}
                      </span>
                      {ann.is_pinned && (
                        <span className="text-[10px] font-bold text-teal-400 flex items-center gap-1">
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
                <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                  Visual Chronicle
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Festival Moments
                </h2>
              </div>
              <Link
                href="/gallery"
                className="text-sm font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
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
                    <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider mt-1 block">
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
