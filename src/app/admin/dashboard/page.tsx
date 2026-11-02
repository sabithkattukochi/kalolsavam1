'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  CalendarDays,
  UserCheck,
  CheckCircle2,
  Clock,
  Award,
  Trophy,
  ArrowRight,
  PlusCircle,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
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
} from 'recharts';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { formatPoints, formatDate } from '@/lib/utils';
import { AdminRole } from '@/types/database';

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<AdminRole>('SUPER_ADMIN');

  useEffect(() => {
    setMounted(true);
    const curr = dataStore.getCurrentAdmin();
    if (curr) setRole(curr.role);
  }, []);

  const handleRoleChange = (newRole: AdminRole) => {
    setRole(newRole);
    dataStore.loginAs(newRole);
  };

  if (!mounted) return null;

  const festival = dataStore.getActiveFestival();
  const students = dataStore.getStudents();
  const teams = dataStore.getTeams();
  const events = dataStore.getEvents();
  const registrations = dataStore.getRegistrations();
  const groupTeams = dataStore.getGroupTeams();
  const results = dataStore.getResults();
  const publishedResults = results.filter((r) => r.status === 'PUBLISHED');
  const completedEvents = events.filter((e) => e.status === 'COMPLETED');
  const upcomingEvents = events.filter((e) => e.status === 'SCHEDULED');
  const leaderboard = dataStore.getTeamLeaderboard();
  const auditLogs = dataStore.getAuditLogs().slice(0, 5);

  const totalPointsAwarded = results
    .filter((r) => r.status === 'PUBLISHED')
    .reduce((sum, r) => sum + (r.total_points || 0), 0);

  const chartData = leaderboard.map((t) => ({
    name: t.name,
    code: t.code,
    points: t.total_points,
    color: t.color,
  }));

  const stats = [
    {
      label: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      href: '/admin/students',
    },
    {
      label: 'Warrior Teams',
      value: teams.length,
      icon: Shield,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
      href: '/admin/teams',
    },
    {
      label: 'Total Events',
      value: events.length,
      icon: CalendarDays,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      href: '/admin/events',
    },
    {
      label: 'Total Enrollments',
      value: registrations.length + groupTeams.length,
      icon: UserCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      href: '/admin/enrollments',
    },
    {
      label: 'Completed Events',
      value: completedEvents.length,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      href: '/admin/events',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Clock,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      href: '/admin/schedules',
    },
    {
      label: 'Published Results',
      value: publishedResults.length,
      icon: Award,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      href: '/admin/results',
    },
    {
      label: 'Total Points Awarded',
      value: formatPoints(totalPointsAwarded),
      icon: Trophy,
      color: 'text-teal-300',
      bg: 'bg-teal-500/15 border-teal-500/30',
      href: '/admin/points',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole={role} onRoleChange={handleRoleChange} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Administrative Dashboard"
          description={`Operations command center for ${festival.name} (${festival.edition})`}
        />

        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-teal-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-white font-bold">Admin-Only Enrollment Active:</strong> Students do not possess self-registration accounts. All entries, transfers, and results are controlled through these admin modules.
              </p>
            </div>
            <Link
              href="/admin/enrollments"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
            >
              Enroll Participants
            </Link>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{s.label}</span>
                    <div className={`p-2 rounded-xl border ${s.bg}`}>
                      <Icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-teal-300 transition-colors">
                      {s.value}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Quick Administrative Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/admin/students?action=add"
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition-all group"
              >
                <PlusCircle className="w-5 h-5 text-teal-400 mb-1.5" />
                <span className="text-xs font-bold text-white block">Add Student</span>
                <span className="text-[10px] text-slate-400">Auto-ID generation</span>
              </Link>

              <Link
                href="/admin/enrollments"
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-left transition-all group"
              >
                <UserCheck className="w-5 h-5 text-rose-400 mb-1.5" />
                <span className="text-xs font-bold text-white block">Bulk Enrollment</span>
                <span className="text-[10px] text-slate-400">Assign participants</span>
              </Link>

              <Link
                href="/admin/results"
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <Award className="w-5 h-5 text-emerald-400 mb-1.5" />
                <span className="text-xs font-bold text-white block">Enter Scores</span>
                <span className="text-[10px] text-slate-400">Auto points calculation</span>
              </Link>

              <Link
                href="/admin/reports"
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-left transition-all group"
              >
                <FileSpreadsheet className="w-5 h-5 text-blue-400 mb-1.5" />
                <span className="text-xs font-bold text-white block">Download Reports</span>
                <span className="text-[10px] text-slate-400">PDF & Excel exports</span>
              </Link>
            </div>
          </div>

          {/* Charts & Standings Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Recharts Points Bar Chart */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Live Points Distribution</h3>
                  <p className="text-xs text-slate-400">Real-time team points from published event sheets</p>
                </div>
                <Link
                  href="/admin/points"
                  className="text-xs font-bold text-teal-400 hover:underline"
                >
                  Configure Rules
                </Link>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="code" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        borderColor: '#374151',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="points" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Team Standings Summary */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-white">Team Rank Table</h3>
                  <Link href="/admin/teams" className="text-xs font-bold text-teal-400 hover:underline">
                    Manage Teams
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {leaderboard.map((team) => (
                    <div
                      key={team.team_id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center font-black text-xs text-teal-400">
                          #{team.rank}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{team.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Gold: {team.first_count} • Silver: {team.second_count} • Bronze: {team.third_count}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-black text-teal-400">
                        {formatPoints(team.total_points)} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Calculated via Point Rules</span>
                <Link href="/leaderboard" target="_blank" className="text-teal-400 font-bold hover:underline">
                  Public Board →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity Audit Log */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Recent Admin Activity Audit</h3>
                <p className="text-xs text-slate-400">Automated log of administrative actions and results publishing</p>
              </div>
              <Link href="/admin/audit-logs" className="text-xs font-bold text-teal-400 hover:underline">
                View Full Log ({auditLogs.length})
              </Link>
            </div>

            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      {log.action}
                    </span>
                    <span className="text-slate-300">
                      <strong className="text-white">{log.admin_email}</strong> on {log.entity_type}
                    </span>
                  </div>
                  <span className="text-slate-400">{formatDate(log.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

