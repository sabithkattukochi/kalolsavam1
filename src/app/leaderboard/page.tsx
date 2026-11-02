'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Crown,
  Sparkles,
  Award,
  Layers,
  BarChart3,
  Users,
  Star,
  Printer,
  Download,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { TeamLeaderboardItem, StudentLeaderboardItem, Category } from '@/types/database';
import { formatPoints } from '@/lib/utils';
import { triggerPrint, exportToCSV } from '@/lib/export-utils';

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false);
  const [teams, setTeams] = useState<TeamLeaderboardItem[]>([]);
  const [students, setStudents] = useState<StudentLeaderboardItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERALL' | 'CATEGORIES' | 'STUDENTS'>('OVERALL');

  const festival = dataStore.getActiveFestival();

  useEffect(() => {
    setMounted(true);
    const teamLeaderboard = dataStore.getTeamLeaderboard();
    const studentLeaderboard = dataStore.getStudentLeaderboard();
    const catList = dataStore.getCategories();

    setTeams(teamLeaderboard);
    setStudents(studentLeaderboard);
    setCategories(catList);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#e11d48', '#2563eb', '#10b981'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!mounted) return null;

  // Prepare chart data for team points
  const chartData = teams.map((t) => ({
    name: t.name,
    code: t.code,
    points: t.total_points,
    color: t.color,
    first: t.first_count,
    second: t.second_count,
    third: t.third_count,
  }));

  const handleExportCSV = () => {
    const rows = teams.map((t) => ({
      Rank: t.rank,
      Team: t.name,
      Code: t.code,
      'Total Points': t.total_points,
      '1st Places (Gold)': t.first_count,
      '2nd Places (Silver)': t.second_count,
      '3rd Places (Bronze)': t.third_count,
      'Grade A Count': t.grade_a_count,
      'Total Awards': t.total_awards,
    }));
    exportToCSV(`Dhwani_2026_Team_Leaderboard`, rows);
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
                Live Tabulation Standings
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight flex items-center gap-3">
                <span>Festival Leaderboard</span>
                <Trophy className="w-8 h-8 sm:w-12 h-12 text-teal-400" />
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Real-time official standings for {festival.name}. Points recalculated dynamically as results are certified.
              </p>
            </div>

            {/* Quick Actions (Print / Export) */}
            <div className="flex items-center gap-3 no-print">
              <button
                onClick={triggerPrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" />
                Print Standings
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Export Leaderboard
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 w-fit mb-10 no-print">
            <button
              onClick={() => setActiveTab('OVERALL')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'OVERALL'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" /> Overall Standings
            </button>
            <button
              onClick={() => setActiveTab('CATEGORIES')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'CATEGORIES'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> Category-wise Points
            </button>
            <button
              onClick={() => setActiveTab('STUDENTS')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'STUDENTS'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" /> Individual Champions
            </button>
          </div>

          {/* ========================================================
              TAB 1: OVERALL STANDINGS & PODIUM
              ======================================================== */}
          {activeTab === 'OVERALL' && (
            <div className="space-y-12">
              {/* Podium Ranking Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {teams.map((team) => {
                  const isFirst = team.rank === 1;
                  return (
                    <div
                      key={team.team_id}
                      className={`relative rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                        isFirst
                          ? 'bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-amber-500 shadow-2xl shadow-teal-950/40 ring-1 ring-teal-500/40'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      {isFirst && (
                        <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Leading Team
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner"
                            style={{ backgroundColor: `${team.color}25`, color: team.color }}
                          >
                            #{team.rank}
                          </span>
                          <span
                            className="text-xs font-black px-2.5 py-1 rounded-full border"
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

                        <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                          <span className="text-4xl font-black text-white tracking-tight">
                            {formatPoints(team.total_points)}
                          </span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                            Total Points
                          </span>
                        </div>

                        {/* Medals */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                            <span className="text-teal-400 font-bold block text-sm">{team.first_count}</span>
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

              {/* Graphical Points Comparison (Recharts) */}
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">
                      Team Points Comparison Chart
                    </h3>
                    <p className="text-xs text-slate-400">
                      Visual points distribution across all contesting team houses.
                    </p>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#090d16',
                          borderColor: '#374151',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="points" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Master Points Table */}
              <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-black text-white">Full Rankings Matrix</h3>
                  <span className="text-xs text-slate-400">Certified by Festival Committee</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-6">Rank</th>
                        <th className="py-3 px-6">Team Name</th>
                        <th className="py-3 px-6 text-center">1st (Gold)</th>
                        <th className="py-3 px-6 text-center">2nd (Silver)</th>
                        <th className="py-3 px-6 text-center">3rd (Bronze)</th>
                        <th className="py-3 px-6 text-center">A Grade</th>
                        <th className="py-3 px-6 text-center">Total Awards</th>
                        <th className="py-3 px-6 text-right">Aggregate Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {teams.map((t) => (
                        <tr key={t.team_id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6 font-black text-base text-teal-400">
                            #{t.rank}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <span
                                className="w-3.5 h-3.5 rounded-full"
                                style={{ backgroundColor: t.color }}
                              />
                              <div>
                                <span className="font-extrabold text-white text-sm">{t.name}</span>
                                <span className="text-xs text-slate-400 block font-serif italic">
                                  {t.captain_name ? `Capt: ${t.captain_name}` : ''}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-teal-400">{t.first_count}</td>
                          <td className="py-4 px-6 text-center font-bold text-slate-300">{t.second_count}</td>
                          <td className="py-4 px-6 text-center font-bold text-amber-600">{t.third_count}</td>
                          <td className="py-4 px-6 text-center font-bold text-emerald-400">{t.grade_a_count}</td>
                          <td className="py-4 px-6 text-center font-semibold text-slate-300">{t.total_awards}</td>
                          <td className="py-4 px-6 text-right font-black text-teal-400 text-lg">
                            {formatPoints(t.total_points)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: CATEGORY-WISE POINTS BREAKDOWN
              ======================================================== */}
          {activeTab === 'CATEGORIES' && (
            <div className="space-y-8">
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xl font-black text-white mb-2">Category Performance Breakdown</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Points accumulated by each team segregated under Chithrolsavam, Sahithyolsavam, and Stage Events.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-6">Team</th>
                        {categories.map((c) => (
                          <th key={c.id} className="py-3 px-6 text-center">
                            {c.name}
                          </th>
                        ))}
                        <th className="py-3 px-6 text-right">Total Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {teams.map((t) => (
                        <tr key={t.team_id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                            {t.name}
                          </td>
                          {categories.map((c) => (
                            <td key={c.id} className="py-4 px-6 text-center font-bold text-slate-200">
                              {formatPoints(t.category_points[c.id] || 0)} pts
                            </td>
                          ))}
                          <td className="py-4 px-6 text-right font-black text-teal-400 text-base">
                            {formatPoints(t.total_points)} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: TOP INDIVIDUAL PERFORMERS (Kalathilakam / Kalaprathibha)
              ======================================================== */}
          {activeTab === 'STUDENTS' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Individual Champion Standings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Highest individual point achievers competing for festival titles.
                  </p>
                </div>
              </div>

              {students.length === 0 ? (
                <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400">
                  No individual results calculated yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map((st, idx) => (
                    <div
                      key={st.student_id}
                      className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-sm">
                            #{idx + 1}
                          </span>
                          <span
                            className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                            style={{
                              borderColor: `${st.team_color}40`,
                              backgroundColor: `${st.team_color}15`,
                              color: st.team_color,
                            }}
                          >
                            {st.team_name}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-white">{st.full_name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {st.course} • {st.department}
                        </p>
                        <p className="text-[11px] text-slate-400">ID: {st.unique_id}</p>

                        <div className="my-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                          <span className="text-3xl font-black text-teal-400 block">
                            {formatPoints(st.total_points)}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Individual Points
                          </span>
                        </div>

                        {st.events_won.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Winning Events:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {st.events_won.map((ev, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                                >
                                  {ev}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>Gold: <strong className="text-teal-400">{st.first_count}</strong></span>
                        <span>Silver: <strong className="text-slate-300">{st.second_count}</strong></span>
                        <span>Bronze: <strong className="text-amber-600">{st.third_count}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

