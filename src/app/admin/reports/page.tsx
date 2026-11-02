'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { exportToExcel, exportToCSV, triggerPrint } from '@/lib/export-utils';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Users,
  Shield,
  CalendarDays,
  Award,
  Crown,
  RefreshCw,
} from 'lucide-react';
import { EventRegistration, GroupEventTeam } from '@/types/database';

type ReportType =
  | 'STUDENT_ROSTER'
  | 'TEAM_ROSTERS'
  | 'EVENT_CALL_SHEETS'
  | 'CERTIFIED_RESULTS'
  | 'TEAM_LEADERBOARD'
  | 'STUDENT_HONORS';

export default function AdminReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('TEAM_LEADERBOARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('ALL');
  const [, setRefreshKey] = useState(0);

  const activeFestival = dataStore.getActiveFestival();
  const teams = dataStore.getTeams();
  const events = dataStore.getEvents();
  const categories = dataStore.getCategories();
  const students = dataStore.getStudents();
  const results = dataStore.getResults(undefined, false);
  const teamLeaderboard = dataStore.getTeamLeaderboard();
  const studentLeaderboard = dataStore.getStudentLeaderboard();

  // Re-render helper
  const refresh = () => setRefreshKey((k) => k + 1);

  // Generate Report Data based on active tab
  const getReportData = (): Record<string, unknown>[] => {
    switch (activeReport) {
      case 'STUDENT_ROSTER': {
        return students
          .filter((s) => {
            const matchesSearch =
              s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.course.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTeam = selectedTeamId === 'ALL' || s.team_id === selectedTeamId;
            return matchesSearch && matchesTeam;
          })
          .map((s) => ({
            'Student ID': s.student_id,
            'Full Name': s.full_name,
            Team: s.team?.name || 'Unassigned',
            Course: s.course,
            Department: s.department,
            'Class / Grade': s.class_grade,
            Gender: s.gender || 'N/A',
            Phone: s.phone || 'N/A',
            Email: s.email || 'N/A',
          }));
      }

      case 'TEAM_ROSTERS': {
        return teamLeaderboard.map((t) => {
          const row: Record<string, unknown> = {
            Rank: t.rank,
            Team: t.name,
            Code: t.code,
            Captain: t.captain_name || 'N/A',
            'Total Points': t.total_points,
            '1st Places': t.first_count,
            '2nd Places': t.second_count,
            '3rd Places': t.third_count,
          };
          categories.forEach((cat) => {
            row[`${cat.name} Pts`] = t.category_points[cat.id] || 0;
          });
          return row;
        });
      }

      case 'EVENT_CALL_SHEETS': {
        const evs =
          selectedEventId === 'ALL' ? events : events.filter((e) => e.id === selectedEventId);

        const rows: Record<string, unknown>[] = [];
        evs.forEach((ev) => {
          if (ev.event_type === 'INDIVIDUAL') {
            const regs: EventRegistration[] = dataStore.getRegistrations(ev.id);
            regs.forEach((reg) => {
              if (selectedTeamId !== 'ALL' && reg.team_id !== selectedTeamId) return;
              if (
                searchQuery &&
                !reg.student?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !reg.student?.student_id.toLowerCase().includes(searchQuery.toLowerCase())
              )
                return;

              rows.push({
                'Event Name': ev.name,
                Category: ev.category?.name || 'General',
                'Event Code': ev.code,
                Type: ev.event_type,
                Venue: ev.venue,
                Date: ev.date,
                Time: `${ev.start_time} - ${ev.end_time}`,
                'Chest No': reg.chest_number || 'N/A',
                'Student ID': reg.student?.student_id || '',
                'Student Name': reg.student?.full_name || '',
                Team: reg.team?.name || '',
                Attendance: '[  ] Present',
              });
            });
          } else {
            const groupTeams: GroupEventTeam[] = dataStore.getGroupTeams(ev.id);
            groupTeams.forEach((gt) => {
              if (selectedTeamId !== 'ALL' && gt.team_id !== selectedTeamId) return;
              if (searchQuery && !gt.group_name.toLowerCase().includes(searchQuery.toLowerCase()))
                return;

              const memberNames = (gt.members || []).map((m) => m.student?.full_name).join(', ');
              rows.push({
                'Event Name': ev.name,
                Category: ev.category?.name || 'General',
                'Event Code': ev.code,
                Type: ev.event_type,
                Venue: ev.venue,
                Date: ev.date,
                Time: `${ev.start_time} - ${ev.end_time}`,
                'Chest No': gt.chest_number || 'N/A',
                'Squad Name': gt.group_name,
                Team: gt.team?.name || '',
                Members: memberNames || 'No members',
                Attendance: '[  ] Present',
              });
            });
          }
        });
        return rows;
      }

      case 'CERTIFIED_RESULTS': {
        return results
          .filter((r) => {
            const matchesSearch =
              r.event?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (r.student?.full_name &&
                r.student.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (r.group_team?.group_name &&
                r.group_team.group_name.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesEvent = selectedEventId === 'ALL' || r.event_id === selectedEventId;
            const matchesTeam = selectedTeamId === 'ALL' || r.team_id === selectedTeamId;
            return matchesSearch && matchesEvent && matchesTeam;
          })
          .map((r) => ({
            'Event Code': r.event?.code,
            'Event Name': r.event?.name,
            Category: r.event?.category?.name,
            Position: r.position || 'Participation',
            Grade: r.grade || 'No Grade',
            'Points Awarded': r.total_points,
            'Winner Name / Squad':
              r.student?.full_name || r.group_team?.group_name || 'Anonymous Participant',
            'Student ID / Chest': r.student?.student_id || r.group_team?.chest_number || 'N/A',
            Team: r.team?.name || 'Independent',
            Status: r.status,
            'Published Date': new Date(r.updated_at).toLocaleDateString(),
          }));
      }

      case 'TEAM_LEADERBOARD': {
        return teamLeaderboard.map((item) => {
          const row: Record<string, unknown> = {
            Rank: item.rank,
            Team: item.name,
            Code: item.code,
            'Total Points': item.total_points,
            'First Places': item.first_count,
            'Second Places': item.second_count,
            'Third Places': item.third_count,
          };
          categories.forEach((cat) => {
            row[`${cat.name} Pts`] = item.category_points[cat.id] || 0;
          });
          return row;
        });
      }

      case 'STUDENT_HONORS': {
        return studentLeaderboard.map((s) => ({
          Rank: s.rank || 1,
          'Student ID': s.unique_id,
          'Student Name': s.full_name,
          Team: s.team_name,
          Course: s.course,
          'Total Points': s.total_points,
          '1st Place Count': s.first_count,
          '2nd Place Count': s.second_count,
          '3rd Place Count': s.third_count,
          'Events Competed': s.events_won.length,
        }));
      }

      default:
        return [];
    }
  };

  const reportRows = getReportData();

  const handleExportExcel = () => {
    const filename = `${activeFestival.name.replace(/\s+/g, '_')}_${activeReport}_${new Date().toISOString().split('T')[0]}`;
    exportToExcel(filename, reportRows, activeReport);
  };

  const handleExportCSV = () => {
    const filename = `${activeFestival.name.replace(/\s+/g, '_')}_${activeReport}_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(filename, reportRows);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Reports & Export Center" />

        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FileSpreadsheet className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-black text-white">Festival Reports & Data Export</h1>
              </div>
              <p className="text-xs text-slate-400">
                Generate, preview, print, and export official spreadsheets, event call sheets, and certified result booklets.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportExcel}
                disabled={reportRows.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Excel (.xlsx)
              </button>
              <button
                onClick={handleExportCSV}
                disabled={reportRows.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={triggerPrint}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Call Sheet
              </button>
            </div>
          </div>

          {/* Report Type Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              {
                id: 'TEAM_LEADERBOARD',
                label: 'Team Leaderboard',
                icon: Shield,
                desc: 'House standings & points matrix',
              },
              {
                id: 'STUDENT_HONORS',
                label: 'Student Honors',
                icon: Crown,
                desc: 'Kalaprathibha & individual ranks',
              },
              {
                id: 'CERTIFIED_RESULTS',
                label: 'Official Results',
                icon: Award,
                desc: 'Published positions & points',
              },
              {
                id: 'EVENT_CALL_SHEETS',
                label: 'Event Call Sheets',
                icon: CalendarDays,
                desc: 'Participant desk attendance lists',
              },
              {
                id: 'STUDENT_ROSTER',
                label: 'Student Directory',
                icon: Users,
                desc: 'All registered institutional students',
              },
              {
                id: 'TEAM_ROSTERS',
                label: 'House Summaries',
                icon: Shield,
                desc: 'Captaincy & category statistics',
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeReport === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id as ReportType)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-2 ${
                      isActive ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-xs font-black truncate">{tab.label}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{tab.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across report data..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Event Filter if relevant */}
            {(activeReport === 'EVENT_CALL_SHEETS' || activeReport === 'CERTIFIED_RESULTS') && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">Event:</span>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="ALL">All Events ({events.length})</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.code} - {e.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Team Filter */}
            {activeReport !== 'TEAM_LEADERBOARD' && activeReport !== 'TEAM_ROSTERS' && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">Team:</span>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="ALL">All Teams</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={refresh}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg border border-slate-700/60 ml-auto cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live Preview Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>Report Preview: {activeReport.replace(/_/g, ' ')}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {reportRows.length} entries
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Showing generated record set for {activeFestival.name} ({activeFestival.edition})
                </p>
              </div>
            </div>

            {reportRows.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p className="text-xs font-bold">No records found matching the specified report criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-950 sticky top-0 text-[10px] font-black uppercase text-slate-400 border-b border-slate-800 tracking-wider">
                    <tr>
                      {Object.keys(reportRows[0]).map((header) => (
                        <th key={header} className="py-3 px-4 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reportRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-800/40 transition-colors odd:bg-slate-900/20"
                      >
                        {Object.values(row).map((val, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="py-2.5 px-4 whitespace-nowrap font-medium text-slate-300"
                          >
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Printable Call Sheet Template (Hidden on screen, visible during Print) */}
          <div className="hidden print:block text-black bg-white p-8">
            <div className="text-center border-b pb-4 mb-6">
              <h1 className="text-2xl font-black">{activeFestival.college_name}</h1>
              <h2 className="text-xl font-bold uppercase tracking-wider text-rose-700">
                {activeFestival.name} - {activeFestival.edition}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Official Master Report: {activeReport}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Official Festival Tabulation Record | Controlled Administrative Document
              </p>
            </div>

            <table className="w-full text-xs border border-collapse border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  {reportRows.length > 0 &&
                    Object.keys(reportRows[0]).map((k) => (
                      <th key={k} className="border border-gray-400 p-2 text-left font-bold">
                        {k}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {reportRows.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} className="border border-gray-400 p-2">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-12 flex justify-between items-center text-xs pt-8 border-t border-gray-300">
              <div>
                <p className="font-bold">Prepared By:</p>
                <p className="text-gray-500">Arts Festival Tabulation Committee</p>
              </div>
              <div className="text-center">
                <p className="font-bold">Verified By:</p>
                <p className="text-gray-500">Event Chief Coordinator</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Approved By:</p>
                <p className="text-gray-500">Principal / Festival Patron</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}