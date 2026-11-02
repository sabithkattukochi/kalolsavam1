'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Search,
  Filter,
  Printer,
  Sparkles,
  Download,
  Award,
  ChevronDown,
  User,
  Users,
} from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { EventResult, Category, FestivalEvent } from '@/types/database';
import { getPositionBadge, getGradeBadge, formatPoints, formatDate } from '@/lib/utils';
import { triggerPrint, exportToCSV } from '@/lib/export-utils';

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<EventResult[]>([]);
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const festival = dataStore.getActiveFestival();

  useEffect(() => {
    setMounted(true);
    setResults(dataStore.getResults(undefined, true)); // only published!
    setEvents(dataStore.getEvents());
    setCategories(dataStore.getCategories());
  }, []);

  if (!mounted) return null;

  // Group results by event
  const eventsWithResults = events.filter((ev) => {
    const evResults = results.filter((r) => r.event_id === ev.id);
    const hasPublished = evResults.length > 0;
    const matchesCategory =
      selectedCategory === 'ALL' || ev.category_id === selectedCategory;
    const matchesSearch =
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.code.toLowerCase().includes(searchQuery.toLowerCase());
    return hasPublished && matchesCategory && matchesSearch;
  });

  const handleExportCSV = () => {
    const rows = results.map((r) => ({
      'Event Code': r.event?.code || '',
      'Event Name': r.event?.name || '',
      'Category': r.event?.category?.name || '',
      'Position': r.position ? `${r.position}` : 'N/A',
      'Grade': r.grade || 'N/A',
      'Participant / Squad': r.student?.full_name || r.group_team?.group_name || 'N/A',
      'Student ID': r.student?.student_id || 'N/A',
      'Team': r.team?.name || '',
      'Position Points': r.position_points,
      'Grade Points': r.grade_points,
      'Total Points Awarded': r.total_points,
      'Remarks': r.remarks || '',
    }));
    exportToCSV(`Dhwani_2026_Official_Results`, rows);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar festivalName={festival.name} festivalEdition={festival.edition} />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20">
                Official Score Tabulation
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Published Results
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Certified positions, letter grades, and team points verified by the tabulation control board.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 no-print">
              <button
                onClick={triggerPrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" />
                Print Score Sheet
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filter Toolbar (hidden during print) */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-10 space-y-4 no-print">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter published results by event title or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

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
            </div>
          </div>

          {/* Results by Event */}
          <div className="space-y-10">
            {eventsWithResults.map((ev) => {
              const evResults = results
                .filter((r) => r.event_id === ev.id)
                .sort((a, b) => {
                  const posA = a.position || 99;
                  const posB = b.position || 99;
                  return posA - posB;
                });

              return (
                <div
                  key={ev.id}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl"
                >
                  {/* Event Bar Header */}
                  <div className="p-6 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {ev.code}
                        </span>
                        <span className="text-xs font-bold text-rose-400">
                          {ev.category?.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          • {ev.event_type}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {ev.name}
                      </h3>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-4">
                      <span>Venue: <strong className="text-slate-200">{ev.venue}</strong></span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                        Certified
                      </span>
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-black uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-6">Position</th>
                          <th className="py-3 px-6">Participant / Group</th>
                          <th className="py-3 px-6">Team</th>
                          <th className="py-3 px-6">Grade</th>
                          <th className="py-3 px-6 text-right">Points</th>
                          <th className="py-3 px-6">Judges Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {evResults.map((res) => {
                          const posBadge = getPositionBadge(res.position);
                          const grdBadge = getGradeBadge(res.grade);

                          return (
                            <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                              {/* Position */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                {posBadge ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">{posBadge.icon}</span>
                                    <span className="font-extrabold text-white text-xs">{posBadge.label}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 font-semibold">–</span>
                                )}
                              </td>

                              {/* Participant / Squad */}
                              <td className="py-4 px-6">
                                <div className="font-bold text-white text-sm">
                                  {res.student?.full_name || res.group_team?.group_name || 'Participant'}
                                </div>
                                <div className="text-xs text-slate-400 flex items-center gap-2">
                                  {res.student?.student_id && (
                                    <span>ID: {res.student.student_id}</span>
                                  )}
                                  {res.student?.course && (
                                    <span>• {res.student.course}</span>
                                  )}
                                </div>
                              </td>

                              {/* Team */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                                  style={{
                                    borderColor: `${res.team?.color}40`,
                                    backgroundColor: `${res.team?.color}15`,
                                    color: res.team?.color,
                                  }}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: res.team?.color }}
                                  />
                                  {res.team?.name}
                                </span>
                              </td>

                              {/* Grade */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                {grdBadge ? (
                                  <span className={`px-2.5 py-1 rounded-md text-xs ${grdBadge.className}`}>
                                    {grdBadge.label}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-400">–</span>
                                )}
                              </td>

                              {/* Points */}
                              <td className="py-4 px-6 whitespace-nowrap text-right font-black text-teal-400 text-base">
                                +{formatPoints(res.total_points)}
                              </td>

                              {/* Remarks */}
                              <td className="py-4 px-6 text-xs text-slate-400 italic">
                                {res.remarks || '–'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {eventsWithResults.length === 0 && (
            <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-300">No results found matching selected criteria.</p>
              <p className="text-xs text-slate-400 mt-1">Official results are updated as soon as judges submit signed tabulations.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

