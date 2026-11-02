'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  UserCheck,
  Search,
  Plus,
  Users,
  Printer,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
  Layers,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { FestivalEvent, Student, EventRegistration, GroupEventTeam, Team } from '@/types/database';
import { exportToCSV, triggerPrint } from '@/lib/export-utils';

export default function EnrollmentManagementPage() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get('eventId');

  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // Individual registrations & group teams for the active event
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [groupTeams, setGroupTeams] = useState<GroupEventTeam[]>([]);

  // Search & Filters
  const [participantSearch, setParticipantSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('ALL');

  // Single Enroll Modal
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [customChestNumber, setCustomChestNumber] = useState('');

  // Bulk Enroll Modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkSelectedStudentIds, setBulkSelectedStudentIds] = useState<string[]>([]);
  const [studentSearchInModal, setStudentSearchInModal] = useState('');

  // Group Squad Creator Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupTeamId, setGroupTeamId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupChestNumber, setGroupChestNumber] = useState('');
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshEventData = (eventId: string) => {
    const regs = dataStore.getRegistrations(eventId);
    const grps = dataStore.getGroupTeams(eventId);
    setRegistrations(regs);
    setGroupTeams(grps);
  };

  useEffect(() => {
    setMounted(true);
    const evs = dataStore.getEvents();
    const studs = dataStore.getStudents();
    const tms = dataStore.getTeams();

    setEvents(evs);
    setStudents(studs);
    setTeams(tms);

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

  // --- Handlers: Individual Enroll ---
  const handleSingleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent || !selectedStudentId) return;

    try {
      dataStore.enrollStudent(
        festival.id,
        activeEvent.id,
        selectedStudentId,
        customChestNumber.trim() || undefined
      );
      setMessage({ type: 'success', text: 'Student enrolled successfully.' });
      setIsSingleModalOpen(false);
      setSelectedStudentId('');
      setCustomChestNumber('');
      refreshEventData(activeEvent.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Enrollment failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  // --- Handlers: Bulk Enroll ---
  const handleBulkEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent || bulkSelectedStudentIds.length === 0) return;

    try {
      const res = dataStore.bulkEnrollStudents(festival.id, activeEvent.id, bulkSelectedStudentIds);
      setMessage({
        type: 'success',
        text: `Bulk enrollment complete: ${res.enrolled} enrolled, ${res.duplicates} duplicates skipped.`,
      });
      setIsBulkModalOpen(false);
      setBulkSelectedStudentIds([]);
      refreshEventData(activeEvent.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bulk enrollment failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  // --- Handlers: Group Squad Register ---
  const handleCreateGroupSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent || !groupTeamId || !groupName || groupMemberIds.length === 0) {
      setMessage({ type: 'error', text: 'Please complete all squad fields and select members.' });
      return;
    }

    try {
      dataStore.createGroupTeam(
        festival.id,
        activeEvent.id,
        groupTeamId,
        groupName,
        groupChestNumber || `G-${groupTeams.length + 10}`,
        groupMemberIds
      );
      setMessage({ type: 'success', text: `Group squad "${groupName}" registered with ${groupMemberIds.length} members.` });
      setIsGroupModalOpen(false);
      setGroupName('');
      setGroupChestNumber('');
      setGroupMemberIds([]);
      refreshEventData(activeEvent.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Group registration failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleRemoveRegistration = (id: string) => {
    if (!confirm('Are you sure you want to remove this participant registration?')) return;
    try {
      dataStore.removeRegistration(id);
      setMessage({ type: 'success', text: 'Participant removed from event.' });
      if (activeEvent) refreshEventData(activeEvent.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Removal failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteGroupSquad = (id: string) => {
    if (!confirm('Are you sure you want to delete this group squad?')) return;
    try {
      dataStore.deleteGroupTeam(id);
      setMessage({ type: 'success', text: 'Group squad deleted.' });
      if (activeEvent) refreshEventData(activeEvent.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleExportCallSheet = () => {
    if (!activeEvent) return;

    if (activeEvent.event_type === 'INDIVIDUAL') {
      const rows = registrations.map((r) => ({
        'Chest #': r.chest_number,
        'Student ID': r.student?.student_id || '',
        'Participant Name': r.student?.full_name || '',
        'Team': r.team?.name || '',
        'Course': r.student?.course || '',
        'Department': r.student?.department || '',
        'Status': r.status,
      }));
      exportToCSV(`${activeEvent.code}_Participant_CallSheet`, rows);
    } else {
      const rows = groupTeams.map((g) => ({
        'Chest #': g.chest_number,
        'Group Squad Name': g.group_name,
        'Team': g.team?.name || '',
        'Member Count': g.members?.length || 0,
        'Members': g.members?.map((m) => m.student?.full_name).join(', ') || '',
      }));
      exportToCSV(`${activeEvent.code}_Group_Squad_CallSheet`, rows);
    }
  };

  if (!mounted) return null;

  // Filter participants
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.student?.full_name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      r.student?.student_id.toLowerCase().includes(participantSearch.toLowerCase()) ||
      r.chest_number.includes(participantSearch);
    const matchesTeam = teamFilter === 'ALL' || r.team_id === teamFilter;
    return matchesSearch && matchesTeam;
  });

  const filteredGroups = groupTeams.filter((g) => {
    const matchesSearch =
      g.group_name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      g.chest_number.includes(participantSearch);
    const matchesTeam = teamFilter === 'ALL' || g.team_id === teamFilter;
    return matchesSearch && matchesTeam;
  });

  // Students eligible for enrollment (filter out already registered)
  const registeredStudentIds = new Set(registrations.map((r) => r.student_id));
  const availableStudents = students.filter((s) => !registeredStudentIds.has(s.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Participant Enrollment Center"
          description="Strict admin-controlled participant registration, squad creation, and official call sheets"
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

          {/* Top Info Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Zero Self-Registration Policy:</strong> Only credentialed admins can enroll students into events. Duplicate entries are automatically blocked.
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Admin Protected
            </span>
          </div>

          {/* Event Selector & Actions Toolbar */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 max-w-md space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Competition / Event:
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => handleSelectEvent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      [{ev.code}] {ev.name} ({ev.event_type}) - {ev.category?.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeEvent && (
                <div className="flex flex-wrap items-center gap-2.5">
                  {activeEvent.event_type === 'INDIVIDUAL' ? (
                    <>
                      <button
                        onClick={() => setIsSingleModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                      >
                        <UserPlus className="w-4 h-4" />
                        Enroll Student
                      </button>

                      <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
                      >
                        <Users className="w-4 h-4 text-amber-400" />
                        Bulk Enroll
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setGroupTeamId(teams[0]?.id || '');
                        setIsGroupModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    >
                      <Users className="w-4 h-4" />
                      Create Group Squad
                    </button>
                  )}

                  <button
                    onClick={triggerPrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    Print Call Sheet
                  </button>

                  <button
                    onClick={handleExportCallSheet}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    Export
                  </button>
                </div>
              )}
            </div>

            {/* Event Summary Bar */}
            {activeEvent && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
                <div className="flex items-center gap-4">
                  <span>Type: <strong className="text-white uppercase">{activeEvent.event_type}</strong></span>
                  <span>Venue: <strong className="text-white">{activeEvent.venue}</strong></span>
                  <span>Time: <strong className="text-white">{activeEvent.start_time} - {activeEvent.end_time}</strong></span>
                </div>
                <div>
                  Enrolled: <strong className="text-amber-400 font-bold text-sm">
                    {activeEvent.event_type === 'INDIVIDUAL' ? registrations.length : groupTeams.length}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Participant Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search enrolled participants or chest #..."
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <span className="text-slate-400 font-semibold">Filter by Team:</span>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Teams</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Participants Table (Individual Events) */}
          {activeEvent && activeEvent.event_type === 'INDIVIDUAL' && (
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Chest #</th>
                      <th className="py-3 px-4">Student ID</th>
                      <th className="py-3 px-4">Participant Name</th>
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-4">Course & Class</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-amber-400 text-sm">
                          #{reg.chest_number}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {reg.student?.student_id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white text-sm">
                          {reg.student?.full_name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                            style={{
                              borderColor: `${reg.team?.color}40`,
                              backgroundColor: `${reg.team?.color}15`,
                              color: reg.team?.color,
                            }}
                          >
                            {reg.team?.name}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {reg.student?.class_grade} • {reg.student?.course}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleRemoveRegistration(reg.id)}
                            title="Remove Registration"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRegistrations.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No participants enrolled in this competition yet. Click &ldquo;Enroll Student&rdquo; or &ldquo;Bulk Enroll&rdquo; to add participants.
                </div>
              )}
            </div>
          )}

          {/* Group Squads Table (Group Events) */}
          {activeEvent && activeEvent.event_type === 'GROUP' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGroups.map((grp) => (
                  <div
                    key={grp.id}
                    className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-400 text-sm px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                          Chest #{grp.chest_number}
                        </span>
                        <h4 className="text-base font-black text-white">{grp.group_name}</h4>
                      </div>

                      <button
                        onClick={() => handleDeleteGroupSquad(grp.id)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400"
                        title="Delete Squad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="px-2.5 py-0.5 rounded-full font-bold border"
                        style={{
                          borderColor: `${grp.team?.color}40`,
                          backgroundColor: `${grp.team?.color}15`,
                          color: grp.team?.color,
                        }}
                      >
                        {grp.team?.name}
                      </span>
                      <span className="text-slate-400">
                        {grp.members?.length || 0} Participating Members
                      </span>
                    </div>

                    {/* Members List */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Squad Performers:
                      </span>
                      {grp.members?.map((m) => (
                        <div
                          key={m.id}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono text-amber-400 text-[11px] mr-2">
                              {m.student?.student_id}
                            </span>
                            <span className="font-bold text-white">{m.student?.full_name}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {filteredGroups.length === 0 && (
                <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                  No group squads registered for this event yet. Click &ldquo;Create Group Squad&rdquo; to assemble and register teams.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          SINGLE STUDENT ENROLL MODAL
          ======================================================== */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Enroll Participant</h3>
              <button onClick={() => setIsSingleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSingleEnroll} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Target Competition</label>
                <input
                  type="text"
                  disabled
                  value={`${activeEvent?.code} - ${activeEvent?.name}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 opacity-70 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Select Existing Student</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 font-medium"
                >
                  <option value="">-- Choose verified student --</option>
                  {availableStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      [{st.student_id}] {st.full_name} ({st.team?.name}) - {st.course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Chest Number (Optional override)</label>
                <input
                  type="text"
                  placeholder="Leave empty for auto-numbering (e.g. 105)"
                  value={customChestNumber}
                  onChange={(e) => setCustomChestNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudentId}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          BULK STUDENT ENROLL MODAL
          ======================================================== */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white">Bulk Participant Enrollment</h3>
                <p className="text-[11px] text-slate-400">Select multiple students to enroll simultaneously into {activeEvent?.name}</p>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter students by name, course..."
                value={studentSearchInModal}
                onChange={(e) => setStudentSearchInModal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200"
              />
            </div>

            {/* Selection List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 border border-slate-800 rounded-2xl p-2 bg-slate-950">
              {availableStudents
                .filter((s) => s.full_name.toLowerCase().includes(studentSearchInModal.toLowerCase()))
                .map((s) => {
                  const isChecked = bulkSelectedStudentIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-500/50 text-white'
                          : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkSelectedStudentIds([...bulkSelectedStudentIds, s.id]);
                            } else {
                              setBulkSelectedStudentIds(bulkSelectedStudentIds.filter((id) => id !== s.id));
                            }
                          }}
                          className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                        />
                        <div>
                          <span className="font-mono text-amber-400 mr-2">[{s.student_id}]</span>
                          <span className="font-bold">{s.full_name}</span>
                          <span className="text-[11px] text-slate-400 block">{s.course} • {s.department}</span>
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: `${s.team?.color}40`,
                          backgroundColor: `${s.team?.color}15`,
                          color: s.team?.color,
                        }}
                      >
                        {s.team?.code}
                      </span>
                    </label>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Selected: <strong className="text-amber-400">{bulkSelectedStudentIds.length}</strong> students
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkEnroll}
                  disabled={bulkSelectedStudentIds.length === 0}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  Enroll Selected ({bulkSelectedStudentIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          GROUP SQUAD CREATOR MODAL
          ======================================================== */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Create Group Squad</h3>
              <button onClick={() => setIsGroupModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSquad} className="space-y-3.5 text-xs flex-1 flex flex-col min-h-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Representing Team</label>
                  <select
                    required
                    value={groupTeamId}
                    onChange={(e) => {
                      setGroupTeamId(e.target.value);
                      setGroupMemberIds([]);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Squad Chest #</label>
                  <input
                    type="text"
                    placeholder="e.g. G-201"
                    value={groupChestNumber}
                    onChange={(e) => setGroupChestNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Group Squad Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phoenix Classical Mime Guild"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="space-y-1 flex-1 flex flex-col min-h-0">
                <label className="font-bold text-slate-300">
                  Select Members from Team ({groupMemberIds.length} chosen):
                </label>
                <div className="flex-1 overflow-y-auto space-y-1 border border-slate-800 rounded-xl p-2 bg-slate-950">
                  {students
                    .filter((s) => s.team_id === groupTeamId)
                    .map((s) => {
                      const isChecked = groupMemberIds.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGroupMemberIds([...groupMemberIds, s.id]);
                              } else {
                                setGroupMemberIds(groupMemberIds.filter((id) => id !== s.id));
                              }
                            }}
                          />
                          <span>{s.full_name} ({s.student_id}) - {s.course}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Group Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

