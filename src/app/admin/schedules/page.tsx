'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Plus,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { FestivalSchedule, FestivalEvent } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function SchedulesManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [schedules, setSchedules] = useState<FestivalSchedule[]>([]);
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<FestivalSchedule | null>(null);

  const [formData, setFormData] = useState({
    venue: '',
    stage_number: '',
    date: '',
    start_time: '',
    end_time: '',
    status: 'ON_TIME' as 'ON_TIME' | 'DELAYED' | 'RESCHEDULED' | 'COMPLETED',
    notes: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshData = () => {
    setSchedules(dataStore.getSchedules());
    setEvents(dataStore.getEvents());
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const openEditModal = (sch: FestivalSchedule) => {
    setEditingSchedule(sch);
    setFormData({
      venue: sch.venue,
      stage_number: sch.stage_number || '',
      date: sch.date,
      start_time: sch.start_time,
      end_time: sch.end_time,
      status: sch.status,
      notes: sch.notes || '',
    });
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;

    try {
      dataStore.updateSchedule(editingSchedule.id, {
        venue: formData.venue,
        stage_number: formData.stage_number || null,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        status: formData.status,
        notes: formData.notes || null,
      });

      // Also create an announcement if status was delayed or rescheduled
      if (formData.status === 'DELAYED' || formData.status === 'RESCHEDULED') {
        dataStore.addAnnouncement({
          festival_id: festival.id,
          title: `Schedule Notice: ${editingSchedule.event?.name} is ${formData.status}`,
          content: `Notice for participants: ${editingSchedule.event?.name} scheduled at ${formData.venue} has been updated to ${formData.status}. New timing: ${formData.start_time} - ${formData.end_time}. Notes: ${formData.notes || 'Please report accordingly.'}`,
          category: 'SCHEDULE_CHANGE',
          is_pinned: false,
          is_published: true,
          published_at: new Date().toISOString(),
        });
      }

      setMessage({ type: 'success', text: 'Schedule and stage allotment updated successfully.' });
      setEditingSchedule(null);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  if (!mounted) return null;

  // Conflict detection logic: Flag if any two sessions share the same venue and date
  const conflictMap = new Map<string, boolean>();
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      const s1 = schedules[i];
      const s2 = schedules[j];
      if (s1.venue === s2.venue && s1.date === s2.date && s1.start_time === s2.start_time) {
        conflictMap.set(s1.id, true);
        conflictMap.set(s2.id, true);
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Schedule & Venue Planner"
          description="Manage real-time stage operations, timing allotments, delay notices, and conflict detection"
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

          {/* Conflict Alert Banner if any detected */}
          {conflictMap.size > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>
                <strong>Scheduling Conflict Detected:</strong> Multiple events have been assigned to identical venues with identical start times. Please review the highlighted sessions below.
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Master Stage Timetable</h2>
              <p className="text-xs text-slate-400">{schedules.length} stage allotments programmed</p>
            </div>
          </div>

          {/* Schedules Table */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Event Code</th>
                    <th className="py-3 px-4">Competition</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Timing</th>
                    <th className="py-3 px-4">Venue & Stage</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Operational Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {schedules.map((sch) => {
                    const isConflict = conflictMap.has(sch.id);
                    return (
                      <tr
                        key={sch.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isConflict ? 'bg-rose-500/10' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                          {sch.event?.code}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {sch.event?.name}
                          <span className="text-[10px] font-semibold text-rose-400 block">
                            {sch.event?.category?.name}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {formatDate(sch.date)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {sch.start_time} - {sch.end_time}
                        </td>
                        <td className="py-3.5 px-4 text-slate-200">
                          <strong>{sch.venue}</strong>
                          {sch.stage_number && (
                            <span className="text-slate-400 text-[11px] block">
                              {sch.stage_number}
                            </span>
                          )}
                          {isConflict && (
                            <span className="text-[9px] font-black text-rose-400 uppercase mt-0.5 block flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Overlapping Slot
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                              sch.status === 'COMPLETED'
                                ? 'bg-slate-800 text-slate-400 border-slate-700'
                                : sch.status === 'DELAYED'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                                : sch.status === 'RESCHEDULED'
                                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {sch.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 italic">
                          {sch.notes || '–'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openEditModal(sch)}
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-teal-400 hover:border-teal-500/40 transition-all inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* EDIT SCHEDULE MODAL */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">
                Update Schedule: {editingSchedule.event?.name}
              </h3>
              <button onClick={() => setEditingSchedule(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Venue / Location</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Stage / Room</label>
                  <input
                    type="text"
                    value={formData.stage_number}
                    onChange={(e) => setFormData({ ...formData, stage_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">End Time</label>
                  <input
                    type="text"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Operational Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold"
                >
                  <option value="ON_TIME">On Time (Normal)</option>
                  <option value="DELAYED">Delayed (Dispatches Notice)</option>
                  <option value="RESCHEDULED">Rescheduled (Dispatches Notice)</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Announcer Notes / Reasons</label>
                <input
                  type="text"
                  placeholder="e.g. Sound check in progress, 20 mins delay"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

