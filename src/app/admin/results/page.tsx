'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  Sparkles,
  Shield,
  Eye,
  FileCheck,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import {
  FestivalEvent,
  EventResult,
  EventRegistration,
  GroupEventTeam,
  GradeType,
} from '@/types/database';
import { getPositionBadge, getGradeBadge, formatPoints } from '@/lib/utils';
import { triggerPrint } from '@/lib/export-utils';

function ResultsManagementContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get('eventId');

  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [results, setResults] = useState<EventResult[]>([]);

  // Event participants/groups
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [groupTeams, setGroupTeams] = useState<GroupEventTeam[]>([]);

  // Score Entry Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<EventResult | null>(null);

  const [formData, setFormData] = useState<{
    target_id: string; // registration_id or group_team_id
    position: 'NONE' | '1' | '2' | '3';
    grade: 'NONE' | 'A' | 'B' | 'C' | 'PARTICIPATION';
    remarks: string;
    status: 'DRAFT' | 'PUBLISHED';
  }>({
    target_id: '',
    position: 'NONE',
    grade: 'A',
    remarks: '',
    status: 'PUBLISHED',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();
  const pointRule = dataStore.getPointRule();

  const refreshEventData = (eventId: string) => {
    setResults(dataStore.getResults(eventId));
    setRegistrations(dataStore.getRegistrations(eventId));
    setGroupTeams(dataStore.getGroupTeams(eventId));
  };

  useEffect(() => {
    setMounted(true);
    const evs = dataStore.getEvents();
    setEvents(evs);
    const defaultId = initialEventId || (evs.length > 0 ? evs[0].id : '');
    setSelectedEventId(defaultId);
    if (defaultId) refreshEventData(defaultId);
  }, [initialEventId]);

  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    refreshEventData(id);
    setMessage(null);
  };

  const openAddModal = () => {
    setEditingResult(null);
    setFormData({
      target_id: '',
      position: '1',
      grade: 'A',
      remarks: '',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r: EventResult) => {
    setEditingResult(r);
    setFormData({
      target_id: r.registration_id || r.group_team_id || '',
      position: r.position ? (String(r.position) as any) : 'NONE',
      grade: (r.grade || 'NONE') as any,
      remarks: r.remarks || '',
      status: r.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent || !formData.target_id) return;

    try {
      const pos = formData.position === 'NONE' ? null : (Number(formData.position) as 1 | 2 | 3);
      const grd = formData.grade === 'NONE' ? null : (formData.grade as GradeType);

      if (activeEvent.event_type === 'INDIVIDUAL') {
        const reg = registrations.find((r) => r.id === formData.target_id);
        if (!reg) throw new Error('Participant not found.');

        dataStore.saveResult(festival.id, activeEvent.id, {
          registration_id: reg.id,
          student_id: reg.student_id,
          team_id: reg.team_id,
          position: pos,
          grade: grd,
          remarks: formData.remarks || null,
          status: formData.status,
        });
      } else {
        const grp = groupTeams.find((g) => g.id === formData.target_id);
        if (!grp) throw new Error('Group squad not found.');

        dataStore.saveResult(festival.id, activeEvent.id, {
          group_team_id: grp.id,
          team_id: grp.team_id,
          position: pos,
          grade: grd,
          remarks: formData.remarks || null,
          status: formData.status,
        });
      }

      setMessage({
        type: 'success',
        text: `Result saved as ${formData.status}. Team points recalculated automatically.`,
      });
      setIsModalOpen(false);
      refreshEventData(activeEvent.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteResult = (id: string) => {
    if (!confirm('Are you sure you want to remove this result? Points will be deducted immediately.')) return;
    try {
      dataStore.deleteResult(id);
      setMessage({ type: 'success', text: 'Result removed and standings updated.' });
      if (activeEvent) refreshEventData(activeEvent.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleTogglePublish = (r: EventResult) => {
    try {
      const newStatus = r.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      dataStore.saveResult(festival.id, r.event_id, {
        registration_id: r.registration_id,
        group_team_id: r.group_team_id,
        student_id: r.student_id,
        team_id: r.team_id,
        position: r.position,
        grade: r.grade,
        remarks: r.remarks,
        status: newStatus,
      });
      setMessage({
        type: 'success',
        text: `Result switched to ${newStatus}.`,
      });
      if (activeEvent) refreshEventData(activeEvent.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status update failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SCORE_MANAGER" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Results & Grading Center"
          description="Award official podium positions, grades, and auto-calculate team & individual points"
        />

        <main className="flex-1 p-6 md:p-8 space-y-6">
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

          {/* Point Rules Summary Badge */}
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-wrap items-center justify-between gap-4 text-xs text-teal-200">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <strong>Active Point Scoring Scheme:</strong> 1st: {pointRule.first_place_points} pts | 2nd: {pointRule.second_place_points} pts | 3rd: {pointRule.third_place_points} pts | Grade A: {pointRule.grade_a_points} pts | Grade B: {pointRule.grade_b_points} pts | Group Multiplier: {pointRule.group_multiplier}x
              </div>
            </div>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950">
              Automatic Engine Active
            </span>
          </div>

          {/* Event Selector & Controls */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 max-w-md space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Competition for Score Entry:
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => handleSelectEvent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    [{ev.code}] {ev.name} ({ev.event_type}) - {ev.category?.name}
                  </option>
                ))}
              </select>
            </div>

            {activeEvent && (
              <div className="flex items-center gap-3">
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Award Score / Grade
                </button>

                <button
                  onClick={triggerPrint}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-400" />
                  Print Score Sheet
                </button>
              </div>
            )}
          </div>

          {/* Results Table */}
          {activeEvent && (
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  Score Sheet: {activeEvent.name} ({activeEvent.code})
                </span>
                <span className="text-slate-400">
                  {results.length} results recorded ({results.filter((r) => r.status === 'PUBLISHED').length} published)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Position</th>
                      <th className="py-3 px-4">Participant / Squad</th>
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4 text-center">Breakdown</th>
                      <th className="py-3 px-4 text-right">Total Points</th>
                      <th className="py-3 px-4">Publication</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {results.map((res) => {
                      const posBadge = getPositionBadge(res.position);
                      const grdBadge = getGradeBadge(res.grade);
                      const isPublished = res.status === 'PUBLISHED';

                      return (
                        <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            {posBadge ? (
                              <div className="flex items-center gap-1.5 font-extrabold text-white">
                                <span className="text-base">{posBadge.icon}</span>
                                <span>{posBadge.label}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 font-semibold">–</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white text-sm">
                            {res.student?.full_name || res.group_team?.group_name || 'Participant'}
                            {res.student?.student_id && (
                              <span className="text-[10px] text-slate-400 block font-mono">
                                ID: {res.student.student_id}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                              style={{
                                borderColor: `${res.team?.color}40`,
                                backgroundColor: `${res.team?.color}15`,
                                color: res.team?.color,
                              }}
                            >
                              {res.team?.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {grdBadge ? (
                              <span className={`px-2 py-0.5 rounded text-[11px] ${grdBadge.className}`}>
                                {grdBadge.label}
                              </span>
                            ) : (
                              <span className="text-slate-500">–</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-400 text-[11px]">
                            Pos: {res.position_points} + Grd: {res.grade_points}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-teal-400 text-sm">
                            +{formatPoints(res.total_points)}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleTogglePublish(res)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border transition-colors ${
                                isPublished
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:bg-amber-500/25'
                              }`}
                            >
                              {res.status}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(res)}
                                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-blue-400"
                                title="Edit Result"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteResult(res.id)}
                                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400"
                                title="Delete Result"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {results.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No scores recorded yet for this competition. Click &ldquo;Award Score / Grade&rdquo; to enter judge valuations.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* SCORE ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">
                {editingResult ? 'Update Result & Grade' : 'Award Score & Position'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">
                  {activeEvent?.event_type === 'INDIVIDUAL' ? 'Select Participant' : 'Select Group Squad'}
                </label>
                <select
                  required
                  disabled={!!editingResult}
                  value={formData.target_id}
                  onChange={(e) => setFormData({ ...formData, target_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 font-bold disabled:opacity-60"
                >
                  <option value="">-- Choose enrolled entry --</option>
                  {activeEvent?.event_type === 'INDIVIDUAL'
                    ? registrations.map((r) => (
                        <option key={r.id} value={r.id}>
                          [Chest #{r.chest_number}] {r.student?.full_name} ({r.team?.name})
                        </option>
                      ))
                    : groupTeams.map((g) => (
                        <option key={g.id} value={g.id}>
                          [Chest #{g.chest_number}] {g.group_name} ({g.team?.name})
                        </option>
                      ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Position Award</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold"
                  >
                    <option value="NONE">No Position (Grade Only)</option>
                    <option value="1">1st Place (Gold)</option>
                    <option value="2">2nd Place (Silver)</option>
                    <option value="3">3rd Place (Bronze)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Letter Grade</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold"
                  >
                    <option value="A">A Grade (+{pointRule.grade_a_points} pts)</option>
                    <option value="B">B Grade (+{pointRule.grade_b_points} pts)</option>
                    <option value="C">C Grade (+{pointRule.grade_c_points} pts)</option>
                    <option value="PARTICIPATION">Participation Certificate</option>
                    <option value="NONE">None</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Publication Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold"
                >
                  <option value="PUBLISHED">Published (Immediately updates Live Leaderboard)</option>
                  <option value="DRAFT">Draft (Save for review, does not affect public board)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Judge Remarks / Evaluation Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Outstanding choreography and expression"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.target_id}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsManagementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading Results...</div>}>
      <ResultsManagementContent />
    </Suspense>
  );
}

