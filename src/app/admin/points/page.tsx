'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Trophy,
  Award,
  Layers,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { PointRule, TeamLeaderboardItem } from '@/types/database';
import { formatPoints } from '@/lib/utils';

export default function PointsConfigurationPage() {
  const [mounted, setMounted] = useState(false);
  const [pointRule, setPointRule] = useState<PointRule | null>(null);
  const [leaderboard, setLeaderboard] = useState<TeamLeaderboardItem[]>([]);

  const [form, setForm] = useState({
    first_place_points: 5,
    second_place_points: 3,
    third_place_points: 1,
    grade_a_points: 5,
    grade_b_points: 3,
    grade_c_points: 1,
    group_multiplier: 2.0,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshData = () => {
    const rule = dataStore.getPointRule();
    setPointRule(rule);
    setForm({
      first_place_points: rule.first_place_points,
      second_place_points: rule.second_place_points,
      third_place_points: rule.third_place_points,
      grade_a_points: rule.grade_a_points,
      grade_b_points: rule.grade_b_points,
      grade_c_points: rule.grade_c_points,
      group_multiplier: rule.group_multiplier,
    });
    setLeaderboard(dataStore.getTeamLeaderboard());
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dataStore.updatePointRule(festival.id, {
        first_place_points: Number(form.first_place_points),
        second_place_points: Number(form.second_place_points),
        third_place_points: Number(form.third_place_points),
        grade_a_points: Number(form.grade_a_points),
        grade_b_points: Number(form.grade_b_points),
        grade_c_points: Number(form.grade_c_points),
        group_multiplier: Number(form.group_multiplier),
      });

      setMessage({
        type: 'success',
        text: 'Point engine updated successfully! All historical and active results have been automatically re-calculated across all leaderboards.',
      });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleResetDefaults = () => {
    setForm({
      first_place_points: 5,
      second_place_points: 3,
      third_place_points: 1,
      grade_a_points: 5,
      grade_b_points: 3,
      grade_c_points: 1,
      group_multiplier: 2.0,
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Point Engine & Scoring Formulas"
          description="Configure weightages for podium positions, letter grades, and group multipliers"
        />

        <main className="flex-1 p-6 md:p-8 space-y-8">
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

          {/* Engine Concept Info */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              Automated Dynamic Calculation Engine
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              In the Victoria College Kalolsavam system, points are awarded on a combined metric: Position Points (1st, 2nd, 3rd) plus Grade Points (A, B, C). For group competitions, the total score is multiplied by the configurable Group Multiplier. Saving changes below immediately triggers an atomic re-computation across all published results.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Editable Formulas Form */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                Edit Scoring Values
              </h3>

              <form onSubmit={handleSaveRules} className="space-y-6 text-xs">
                {/* Position Points */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                    Position Placement Points (Solo Individual)
                  </span>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">1st Place (Gold)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={form.first_place_points}
                        onChange={(e) => setForm({ ...form, first_place_points: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">2nd Place (Silver)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={form.second_place_points}
                        onChange={(e) => setForm({ ...form, second_place_points: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">3rd Place (Bronze)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={form.third_place_points}
                        onChange={(e) => setForm({ ...form, third_place_points: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Grade Points */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                    Letter Grade Points
                  </span>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">A Grade (80%+)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={form.grade_a_points}
                        onChange={(e) => setForm({ ...form, grade_a_points: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">B Grade (70-79%)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={form.grade_b_points}
                        onChange={(e) => setForm({ ...form, grade_b_points: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">C Grade (60-69%)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={form.grade_c_points}
                        onChange={(e) => setForm({ ...form, grade_c_points: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Group Multiplier */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-rose-400 uppercase tracking-wider">
                      Group Event Multiplier
                    </label>
                    <span className="text-[10px] text-slate-400">Default: 2.0x</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={form.group_multiplier}
                    onChange={(e) => setForm({ ...form, group_multiplier: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  <p className="text-[11px] text-slate-400">
                    Group events (Mime, Group Dance, Drama) will scale total position & grade points by this factor.
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Defaults
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black uppercase tracking-wider shadow-lg shadow-teal-500/20"
                  >
                    <Save className="w-4 h-4" />
                    Apply & Recalculate Scores
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Detailed Points Audit Breakdown */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-teal-400" />
                Live Recalculated Team Standings
              </h3>

              <div className="space-y-3">
                {leaderboard.map((team) => (
                  <div
                    key={team.team_id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-xs text-teal-400">
                          #{team.rank}
                        </span>
                        <strong className="text-white text-sm">{team.name}</strong>
                      </div>
                      <span className="text-lg font-black text-teal-400">
                        {formatPoints(team.total_points)} pts
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
                      <div>
                        1st: <strong className="text-teal-400">{team.first_count}</strong>
                      </div>
                      <div>
                        2nd: <strong className="text-slate-300">{team.second_count}</strong>
                      </div>
                      <div>
                        3rd: <strong className="text-amber-600">{team.third_count}</strong>
                      </div>
                      <div>
                        Grade A: <strong className="text-emerald-400">{team.grade_a_count}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

