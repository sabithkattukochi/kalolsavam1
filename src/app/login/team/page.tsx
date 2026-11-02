'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  School,
  Sparkles,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Trophy,
  Users,
  Calendar,
  Award,
  LogOut,
  Printer,
  ChevronRight,
  Shield,
  ArrowLeft,
  GraduationCap,
  Scale,
} from 'lucide-react';
import { dataStore } from '@/lib/data-store';
import { Team, Student, EventRegistration, FestivalEvent, EventResult } from '@/types/database';

export default function TeamLoginPage() {
  const [teamCode, setTeamCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [teamStudents, setTeamStudents] = useState<Student[]>([]);
  const [teamRegistrations, setTeamRegistrations] = useState<EventRegistration[]>([]);
  const [activeTab, setActiveTab] = useState<'ROSTER' | 'SCHEDULE' | 'RESULTS'>('ROSTER');

  const festival = dataStore.getActiveFestival();
  const allTeams = dataStore.getTeams();
  const leaderboard = dataStore.getTeamLeaderboard();

  useEffect(() => {
    const current = dataStore.getCurrentTeam();
    if (current) {
      loadTeamData(current);
    }
  }, []);

  const loadTeamData = (team: Team) => {
    setActiveTeam(team);
    const students = dataStore.getStudents().filter((s) => s.team_id === team.id);
    setTeamStudents(students);
    const regs = dataStore.getRegistrations().filter((r) => r.team_id === team.id);
    setTeamRegistrations(regs);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      const res = dataStore.authenticateTeam(teamCode, password);
      if (res.success && res.team) {
        setSuccess(`Logged in successfully as ${res.team.name}!`);
        loadTeamData(res.team);
      } else {
        setError(res.error || 'Team authentication failed.');
      }
      setLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    dataStore.logoutTeam();
    setActiveTeam(null);
    setTeamStudents([]);
    setTeamRegistrations([]);
    setSuccess(null);
  };

  const autofillTeam = (code: string) => {
    setTeamCode(code);
    setPassword('ihrd@2026');
    setError(null);
  };

  // If logged in, show the comprehensive Team Management Portal
  if (activeTeam) {
    const teamRank = leaderboard.find((item) => item.team_id === activeTeam.id);
    const events = dataStore.getEvents();
    const results = dataStore.getResults().filter((r) => r.team_id === activeTeam.id);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Kalolsavam Home</span>
              </Link>
              <span className="text-slate-700">•</span>
              <span className="text-xs font-bold text-teal-400">School / Team Official Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" />
                <span>Print Official Roster</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Team Crest & Summary Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-teal-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl font-black text-2xl border-2 border-white/20"
                  style={{ backgroundColor: activeTeam.color }}
                >
                  {activeTeam.code}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                      Official Team Desk
                    </span>
                    <span className="text-xs text-slate-400">{festival.name} • {festival.edition}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {activeTeam.name}
                  </h1>
                  <p className="text-xs text-teal-200/80 italic mt-0.5">
                    &quot;{activeTeam.motto || 'Striving for cultural excellence and honor'}&quot;
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Team Captain: <span className="font-bold text-white">{activeTeam.captain_name || 'Designated Captain'}</span>
                  </p>
                </div>
              </div>

              {/* Score Badges */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Points</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {teamRank?.total_points || 0}
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Festival Rank</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    #{teamRank?.rank || '-'}
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Enrolled</div>
                  <div className="text-2xl font-black text-cyan-400 mt-1">
                    {teamStudents.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 space-x-4">
            <button
              onClick={() => setActiveTab('ROSTER')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'ROSTER'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Registered Participants ({teamStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('SCHEDULE')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'SCHEDULE'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Team Event Schedule
            </button>
            <button
              onClick={() => setActiveTab('RESULTS')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'RESULTS'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Declared Results & Medals ({results.length})
            </button>
          </div>

          {/* Tab 1: Participants & Chest Numbers */}
          {activeTab === 'ROSTER' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white">Official Participant Roster</span>
                <span>Students assigned under {activeTeam.name}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamStudents.map((student) => {
                  const studentRegs = teamRegistrations.filter((r) => r.student_id === student.id);
                  const firstReg = studentRegs[0];

                  return (
                    <div
                      key={student.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-black text-white">{student.full_name}</div>
                          <div className="text-[11px] text-teal-300 font-semibold">{student.student_id}</div>
                        </div>
                        {firstReg && (
                          <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black">
                            Chest #{firstReg.chest_number}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 space-y-0.5 pt-1 border-t border-slate-800/80">
                        <div>Dept: <span className="text-slate-200 font-semibold">{student.department}</span></div>
                        <div>Course: <span className="text-slate-300">{student.course} ({student.class_grade})</span></div>
                        <div>Registered in: <span className="text-teal-300 font-bold">{studentRegs.length} events</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Scheduled Events */}
          {activeTab === 'SCHEDULE' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => {
                  const regsInEvent = teamRegistrations.filter((r) => r.event_id === event.id);
                  if (regsInEvent.length === 0) return null;

                  return (
                    <div
                      key={event.id}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {event.code}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">{event.name}</h3>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          event.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {event.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                        <div>Venue: <span className="text-slate-200 font-medium">{event.venue}</span></div>
                        <div>Stage: <span className="text-teal-300 font-bold">{event.stage_number || 'Main Stage'}</span></div>
                        <div>Date: <span className="text-slate-200">{event.date}</span></div>
                        <div>Time: <span className="text-slate-200">{event.start_time}</span></div>
                      </div>

                      <div className="text-xs text-slate-300 pt-1">
                        <span className="font-bold text-teal-400">Team Participants: </span>
                        {regsInEvent.map((r) => r.student?.full_name || 'Enrolled Student').join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Results Won */}
          {activeTab === 'RESULTS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.map((result) => {
                  const ev = events.find((e) => e.id === result.event_id);
                  const st = teamStudents.find((s) => s.id === result.student_id);

                  return (
                    <div
                      key={result.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-emerald-400">{ev?.name}</div>
                        <div className="text-sm font-black text-white mt-0.5">{st?.full_name || 'Participant'}</div>
                        <div className="text-[11px] text-slate-400">
                          {result.position ? `Position #${result.position} • ` : ''}Points: {result.total_points} pts
                        </div>
                      </div>
                      <div className="text-center px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
                        <div className="text-xs font-black text-emerald-300">Grade {result.grade || 'A'}</div>
                        <div className="text-[10px] font-bold text-emerald-400">+{result.total_points} PTS</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Otherwise, render the Team Login Form
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-teal-500 selection:text-slate-950">
      {/* Ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 text-xs font-bold text-slate-400">
        <Link href="/login" className="flex items-center gap-1.5 hover:text-teal-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>All Login Portals</span>
        </Link>
        <Link href="/" className="hover:text-teal-300 transition-colors">
          Back to Portal Home
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-teal-950/40">
            <School className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[11px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              School / Team Official Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              School & Team Captain Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your House/Team code to access official rosters, stage schedules, and chest numbers
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-900/40 shadow-2xl backdrop-blur-md space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Team Code or Captain Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <School className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  placeholder="e.g. RUBY or EMERALD"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors uppercase tracking-wider font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Team Security Password</label>
                <span className="text-[10px] text-teal-400 font-bold">Default: ihrd@2026</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter team password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Team Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Quick Fill for 4 College Houses */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              1-Click Demo Teams (Password: <span className="text-teal-300 font-bold">ihrd@2026</span>)
            </div>

            <div className="grid grid-cols-2 gap-2">
              {allTeams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => autofillTeam(team.code)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center gap-2"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: team.color }}
                  />
                  <div className="truncate">
                    <div className="text-xs font-black text-white truncate">{team.name}</div>
                    <div className="text-[10px] text-teal-400 font-semibold">{team.code}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Other Portals Switcher */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2 text-xs">
          <p className="text-slate-400">Other Kalolsavam login portals:</p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-teal-400">
            <Link href="/login/admin" className="hover:text-teal-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin Portal
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/login/judge" className="hover:text-teal-300 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" /> Judge Scoring Login
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/login/student" className="hover:text-teal-300 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Student Hall Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

