'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Users,
  Trophy,
  Flame,
  Zap,
  Crown,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { Team, Student } from '@/types/database';
import { formatPoints } from '@/lib/utils';

export default function TeamsManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTeamRoster, setSelectedTeamRoster] = useState<Team | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    color: '#e11d48',
    bg_gradient: 'from-rose-500 to-red-700',
    badge_icon: 'Flame',
    motto: '',
    captain_name: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshData = () => {
    setTeams(dataStore.getTeams());
    setStudents(dataStore.getStudents());
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const openAddModal = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      code: '',
      color: '#e11d48',
      bg_gradient: 'from-rose-500 to-red-700',
      badge_icon: 'Flame',
      motto: '',
      captain_name: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Team) => {
    setEditingTeam(t);
    setFormData({
      name: t.name,
      code: t.code,
      color: t.color,
      bg_gradient: t.bg_gradient,
      badge_icon: t.badge_icon,
      motto: t.motto || '',
      captain_name: t.captain_name || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        dataStore.updateTeam(editingTeam.id, {
          name: formData.name,
          code: formData.code.toUpperCase(),
          color: formData.color,
          bg_gradient: formData.bg_gradient,
          badge_icon: formData.badge_icon,
          motto: formData.motto || null,
          captain_name: formData.captain_name || null,
        });
        setMessage({ type: 'success', text: `Team ${formData.name} updated successfully.` });
      } else {
        dataStore.addTeam({
          festival_id: festival.id,
          name: formData.name,
          code: formData.code.toUpperCase(),
          color: formData.color,
          bg_gradient: formData.bg_gradient,
          badge_icon: formData.badge_icon,
          motto: formData.motto || null,
          captain_name: formData.captain_name || null,
        });
        setMessage({ type: 'success', text: `Team ${formData.name} registered.` });
      }
      setIsModalOpen(false);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteTeam = (t: Team) => {
    if (!confirm(`Are you sure you want to delete team ${t.name}?`)) return;
    try {
      dataStore.deleteTeam(t.id);
      setMessage({ type: 'success', text: `Team ${t.name} removed.` });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  if (!mounted) return null;

  const leaderboard = dataStore.getTeamLeaderboard();
  const getTeamStats = (tId: string) => leaderboard.find((l) => l.team_id === tId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Team & House Management"
          description="Manage festival competing team banners, captains, color palettes, and squad rosters"
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

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Active Competing Teams</h2>
              <p className="text-xs text-slate-400">{teams.length} teams configured for {festival.name}</p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Team
            </button>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((t) => {
              const members = students.filter((s) => s.team_id === t.id);
              const stats = getTeamStats(t.id);

              return (
                <div
                  key={t.id}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between transition-all hover:border-slate-700 space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner"
                        style={{ backgroundColor: `${t.color}25`, color: t.color }}
                      >
                        <Shield className="w-6 h-6" />
                      </div>
                      <span
                        className="text-xs font-black px-2.5 py-1 rounded-full border"
                        style={{
                          borderColor: `${t.color}40`,
                          backgroundColor: `${t.color}15`,
                          color: t.color,
                        }}
                      >
                        {t.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white">{t.name}</h3>
                      {t.motto && (
                        <p className="text-xs text-slate-400 italic line-clamp-1 mt-0.5 font-serif">
                          &ldquo;{t.motto}&rdquo;
                        </p>
                      )}
                      {t.captain_name && (
                        <p className="text-xs text-teal-400 font-semibold mt-1">
                          Captain: {t.captain_name}
                        </p>
                      )}
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-xl font-black text-white block">
                          {members.length}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Members
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-xl font-black text-teal-400 block">
                          {formatPoints(stats?.total_points || 0)}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Points
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <button
                      onClick={() => setSelectedTeamRoster(t)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-teal-400" />
                      View Members ({members.length})
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-400 text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(t)}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 transition-all"
                        title="Delete Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ========================================================
          CREATE / EDIT TEAM MODAL
          ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">
                {editingTeam ? 'Edit Team House' : 'Create New Team'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Team Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruby Phoenix"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Team Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RUBY"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 uppercase font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Team Captain Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aadhavan Nair"
                  value={formData.captain_name}
                  onChange={(e) => setFormData({ ...formData, captain_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Team Motto / Battle Cry</label>
                <input
                  type="text"
                  placeholder="e.g. Ignite the Stage, Conquer the Realm"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ROSTER MODAL
          ======================================================== */}
      {selectedTeamRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTeamRoster.color }} />
                <h3 className="text-base font-extrabold text-white">
                  {selectedTeamRoster.name} Roster
                </h3>
              </div>
              <button onClick={() => setSelectedTeamRoster(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {students
                .filter((s) => s.team_id === selectedTeamRoster.id)
                .map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-teal-400 font-bold mr-2">{st.student_id}</span>
                      <strong className="text-white font-bold">{st.full_name}</strong>
                      <span className="text-slate-400 ml-2">{st.course} ({st.class_grade})</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{st.department}</span>
                  </div>
                ))}

              {students.filter((s) => s.team_id === selectedTeamRoster.id).length === 0 && (
                <p className="text-center py-8 text-xs text-slate-400">No students assigned to this team yet.</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTeamRoster(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

