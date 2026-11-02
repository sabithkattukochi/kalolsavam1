'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  LogIn,
  KeyRound,
  School,
  Scale,
  GraduationCap,
  ExternalLink,
  QrCode,
  Calendar,
  Award,
} from 'lucide-react';
import { dataStore } from '@/lib/data-store';
import { AdminRole, GradeType } from '@/types/database';

type PortalType = 'ADMIN' | 'TEAM' | 'JUDGE' | 'STUDENT';

function LoginHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPortalParam = searchParams.get('portal')?.toUpperCase();

  const [activePortal, setActivePortal] = useState<PortalType>('ADMIN');

  // Admin login state
  const [adminMode, setAdminMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('ihrd@2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<AdminRole>('EVENT_COORDINATOR');
  const [regPassword, setRegPassword] = useState('ihrd@2026');

  // Team login state
  const [teamCode, setTeamCode] = useState('RUBY');
  const [teamPassword, setTeamPassword] = useState('ihrd@2026');
  const [showTeamPassword, setShowTeamPassword] = useState(false);

  // Judge login state
  const [judgeId, setJudgeId] = useState('JUDGE-01');
  const [judgePassword, setJudgePassword] = useState('ihrd@2026');
  const [showJudgePassword, setShowJudgePassword] = useState(false);

  // Student login state
  const [studentChest, setStudentChest] = useState('101');
  const [studentPin, setStudentPin] = useState('ihrd@2026');
  const [showStudentPin, setShowStudentPin] = useState(false);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const festival = dataStore.getActiveFestival();
  const allTeams = dataStore.getTeams();
  const judges = dataStore.getJudges();

  useEffect(() => {
    if (initialPortalParam === 'TEAM' || initialPortalParam === 'SCHOOL') {
      setActivePortal('TEAM');
    } else if (initialPortalParam === 'JUDGE') {
      setActivePortal('JUDGE');
    } else if (initialPortalParam === 'STUDENT' || initialPortalParam === 'PARTICIPANT') {
      setActivePortal('STUDENT');
    } else if (initialPortalParam === 'ADMIN') {
      setActivePortal('ADMIN');
    }
  }, [initialPortalParam]);

  const handlePortalSwitch = (portal: PortalType) => {
    setActivePortal(portal);
    setError(null);
    setSuccess(null);
  };

  // 1. Handle Admin Login
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      const res = dataStore.authenticate(adminEmail, adminPassword);
      if (res.success && res.admin) {
        setSuccess(`Welcome back, ${res.admin.full_name}! Entering Admin Console...`);
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 600);
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
        setLoading(false);
      }
    }, 350);
  };

  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const newAdmin = dataStore.createAdmin({
        full_name: regName,
        email: regEmail,
        role: regRole,
      });
      setSuccess(`Officer account created for ${newAdmin.full_name}! Redirecting...`);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setError(msg);
      setLoading(false);
    }
  };

  // 2. Handle Team Login
  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      const res = dataStore.authenticateTeam(teamCode, teamPassword);
      if (res.success && res.team) {
        setSuccess(`Logged in as ${res.team.name}! Redirecting to Team Desk...`);
        setTimeout(() => {
          router.push('/login/team');
        }, 500);
      } else {
        setError(res.error || 'Team authentication failed.');
        setLoading(false);
      }
    }, 350);
  };

  // 3. Handle Judge Login
  const handleJudgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      const res = dataStore.authenticateJudge(judgeId, judgePassword);
      if (res.success && res.judge) {
        setSuccess(`Authenticated as ${res.judge.full_name}! Redirecting to Jury Console...`);
        setTimeout(() => {
          router.push('/login/judge');
        }, 500);
      } else {
        setError(res.error || 'Judge authentication failed.');
        setLoading(false);
      }
    }, 350);
  };

  // 4. Handle Student Login
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      const res = dataStore.authenticateStudent(studentChest, studentPin);
      if (res.success && res.student) {
        setSuccess(`Verified participant: ${res.student.full_name}! Redirecting to Hall Ticket...`);
        setTimeout(() => {
          router.push('/login/student');
        }, 500);
      } else {
        setError(res.error || 'Participant record not found. Check Chest # or Student ID.');
        setLoading(false);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden selection:bg-teal-500 selection:text-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Breadcrumb */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 text-xs font-bold text-slate-400">
        <Link href="/" className="hover:text-teal-300 transition-colors flex items-center gap-1.5">
          <span>← Back to Kalolsavam Main Portal</span>
        </Link>
        <span className="text-teal-400 font-bold uppercase tracking-wider">
          {festival.college_name}
        </span>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Official Kalolsavam Authentication Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Select Your Access Portal
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Choose your designated role to sign in with authorized credentials (Default security password: <strong className="text-teal-300 font-mono">ihrd@2026</strong>)
          </p>
        </div>

        {/* 4 Portal Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Admin */}
          <button
            type="button"
            onClick={() => handlePortalSwitch('ADMIN')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activePortal === 'ADMIN'
                ? 'bg-slate-900 border-teal-400 shadow-xl shadow-teal-500/10 ring-1 ring-teal-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              {activePortal === 'ADMIN' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <div className="text-sm font-black text-white">Admin & Officers</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Convener, Event Coordinators, Score Managers
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-teal-400">
              <span>Admin Console</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 2: Team */}
          <button
            type="button"
            onClick={() => handlePortalSwitch('TEAM')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activePortal === 'TEAM'
                ? 'bg-slate-900 border-teal-400 shadow-xl shadow-teal-500/10 ring-1 ring-teal-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              {activePortal === 'TEAM' && (
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              )}
            </div>
            <div className="text-sm font-black text-white">School / Team</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Team Captains, Department Heads, House Managers
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-teal-400">
              <span>Team Roster</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 3: Judge */}
          <button
            type="button"
            onClick={() => handlePortalSwitch('JUDGE')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activePortal === 'JUDGE'
                ? 'bg-slate-900 border-teal-400 shadow-xl shadow-teal-500/10 ring-1 ring-teal-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              {activePortal === 'JUDGE' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
            <div className="text-sm font-black text-white">Judge & Jury</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Stage Evaluation Jury, Score Tabulators
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-teal-400">
              <span>Scoring Slate</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 4: Student */}
          <button
            type="button"
            onClick={() => handlePortalSwitch('STUDENT')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activePortal === 'STUDENT'
                ? 'bg-slate-900 border-teal-400 shadow-xl shadow-teal-500/10 ring-1 ring-teal-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              {activePortal === 'STUDENT' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <div className="text-sm font-black text-white">Student / Participant</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Admit Card, Chest Number, Schedule & Certificate
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-teal-400">
              <span>Hall Ticket</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* Selected Portal Form Card */}
        <div className="max-w-xl mx-auto p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 shadow-2xl backdrop-blur-md space-y-5">
          {/* Header of Active Tab */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                {activePortal === 'ADMIN' && 'Officer Authentication'}
                {activePortal === 'TEAM' && 'House / School Desk'}
                {activePortal === 'JUDGE' && 'Stage Evaluation Jury'}
                {activePortal === 'STUDENT' && 'Contestant Verification'}
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                {activePortal === 'ADMIN' && 'Admin & Officer Login'}
                {activePortal === 'TEAM' && 'School & Team Captain Portal'}
                {activePortal === 'JUDGE' && 'Stage Judge & Tabulator Login'}
                {activePortal === 'STUDENT' && 'Participant Admit Card Login'}
              </h2>
            </div>
            <Link
              href={
                activePortal === 'ADMIN'
                  ? '/login/admin'
                  : activePortal === 'TEAM'
                  ? '/login/team'
                  : activePortal === 'JUDGE'
                  ? '/login/judge'
                  : '/login/student'
              }
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-teal-300 transition-colors"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feedback Notices */}
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

          {/* PORTAL 1: ADMIN LOGIN */}
          {activePortal === 'ADMIN' && (
            <div className="space-y-4">
              <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAdminMode('LOGIN')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    adminMode === 'LOGIN' ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400'
                  }`}
                >
                  Admin Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAdminMode('REGISTER')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    adminMode === 'REGISTER' ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400'
                  }`}
                >
                  New Officer Signup
                </button>
              </div>

              {adminMode === 'LOGIN' ? (
                <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Authorized Email</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="e.g. admin@fest.org"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-300">Password</span>
                      <span className="text-teal-400 font-bold">ihrd@2026</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Enter Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 1-click autofills */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEmail('admin@fest.org');
                        setAdminPassword('ihrd@2026');
                      }}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-[11px]"
                    >
                      <div className="text-emerald-400 font-black">Super Admin</div>
                      <div className="text-slate-500 text-[10px]">admin@fest.org</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEmail('coordinator@fest.org');
                        setAdminPassword('ihrd@2026');
                      }}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-[11px]"
                    >
                      <div className="text-teal-400 font-black">Coordinator</div>
                      <div className="text-slate-500 text-[10px]">coord@fest.org</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEmail('scores@fest.org');
                        setAdminPassword('ihrd@2026');
                      }}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-[11px]"
                    >
                      <div className="text-cyan-400 font-black">Score Officer</div>
                      <div className="text-slate-500 text-[10px]">scores@fest.org</div>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAdminRegister} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Prof. Rajesh K."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rajesh@college.edu"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Role</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as AdminRole)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="EVENT_COORDINATOR">Event Coordinator</option>
                      <option value="SCORE_MANAGER">Score Officer</option>
                      <option value="SUPER_ADMIN">Festival Convener / Super Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider"
                  >
                    Create Officer Account
                  </button>
                </form>
              )}
            </div>
          )}

          {/* PORTAL 2: TEAM LOGIN */}
          {activePortal === 'TEAM' && (
            <form onSubmit={handleTeamSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Team Code or Captain Name</label>
                <input
                  type="text"
                  required
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  placeholder="e.g. RUBY or EMERALD"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white uppercase font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Team Security Password</span>
                  <span className="text-teal-400 font-bold">ihrd@2026</span>
                </div>
                <div className="relative">
                  <input
                    type={showTeamPassword ? 'text' : 'password'}
                    required
                    value={teamPassword}
                    onChange={(e) => setTeamPassword(e.target.value)}
                    className="w-full px-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTeamPassword(!showTeamPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                  >
                    {showTeamPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center justify-center gap-2"
              >
                <span>Access Team Roster & Chest Numbers</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                {allTeams.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTeamCode(t.code);
                      setTeamPassword('ihrd@2026');
                    }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center gap-2 text-xs"
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="text-white font-bold truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* PORTAL 3: JUDGE LOGIN */}
          {activePortal === 'JUDGE' && (
            <form onSubmit={handleJudgeSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Judge Code or Official Email</label>
                <input
                  type="text"
                  required
                  value={judgeId}
                  onChange={(e) => setJudgeId(e.target.value)}
                  placeholder="e.g. JUDGE-01 or judge1@fest.org"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white uppercase font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Jury Security PIN</span>
                  <span className="text-teal-400 font-bold">ihrd@2026</span>
                </div>
                <div className="relative">
                  <input
                    type={showJudgePassword ? 'text' : 'password'}
                    required
                    value={judgePassword}
                    onChange={(e) => setJudgePassword(e.target.value)}
                    className="w-full px-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowJudgePassword(!showJudgePassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                  >
                    {showJudgePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center justify-center gap-2"
              >
                <span>Open Stage Scoring Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                {judges.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => {
                      setJudgeId(j.judge_code);
                      setJudgePassword('ihrd@2026');
                    }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs"
                  >
                    <div className="text-cyan-400 font-bold">{j.judge_code}</div>
                    <div className="text-slate-400 text-[10px] truncate">{j.full_name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* PORTAL 4: STUDENT LOGIN */}
          {activePortal === 'STUDENT' && (
            <form onSubmit={handleStudentSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Chest Number or Student ID</label>
                <input
                  type="text"
                  required
                  value={studentChest}
                  onChange={(e) => setStudentChest(e.target.value)}
                  placeholder="e.g. 101 or AF2026-001"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white uppercase font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Verification PIN / DOB</span>
                  <span className="text-teal-400 font-bold">ihrd@2026</span>
                </div>
                <div className="relative">
                  <input
                    type={showStudentPin ? 'text' : 'password'}
                    value={studentPin}
                    onChange={(e) => setStudentPin(e.target.value)}
                    className="w-full px-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPin(!showStudentPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                  >
                    {showStudentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center justify-center gap-2"
              >
                <span>View Official Hall Ticket & Score Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setStudentChest('101');
                    setStudentPin('ihrd@2026');
                  }}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center text-xs"
                >
                  <div className="text-amber-400 font-bold">Chest #101</div>
                  <div className="text-slate-500 text-[10px]">Aarav K.</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentChest('102');
                    setStudentPin('ihrd@2026');
                  }}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center text-xs"
                >
                  <div className="text-amber-400 font-bold">Chest #102</div>
                  <div className="text-slate-500 text-[10px]">Fathima N.</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentChest('201');
                    setStudentPin('ihrd@2026');
                  }}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center text-xs"
                >
                  <div className="text-amber-400 font-bold">Chest #201</div>
                  <div className="text-slate-500 text-[10px]">Kavya P.</div>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-teal-400 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginHubContent />
    </Suspense>
  );
}
