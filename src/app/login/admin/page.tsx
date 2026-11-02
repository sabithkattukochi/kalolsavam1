'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  ArrowLeft,
} from 'lucide-react';
import { dataStore } from '@/lib/data-store';
import { AdminRole } from '@/types/database';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<AdminRole>('EVENT_COORDINATOR');
  const [regPassword, setRegPassword] = useState('ihrd@2026');

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const festival = dataStore.getActiveFestival();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      const res = dataStore.authenticate(loginEmail, loginPassword);
      if (res.success && res.admin) {
        setSuccess(`Welcome back, ${res.admin.full_name}! Redirecting to Admin Console...`);
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 600);
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
        setLoading(false);
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
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
      setSuccess(`Officer account created for ${newAdmin.full_name}! Logging in...`);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setError(msg);
      setLoading(false);
    }
  };

  const autofillCredentials = (email: string, pass: string) => {
    setMode('LOGIN');
    setLoginEmail(email);
    setLoginPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-teal-500 selection:text-slate-950">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

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
          <Link href="/" className="inline-block group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-teal-950/40 group-hover:scale-105 transition-transform">
              <Shield className="w-7 h-7 text-slate-950" />
            </div>
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Administrative Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Festival Officers & Admin Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized access for Central Convener, Event Coordinators, and Scoring Officers
            </p>
          </div>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              mode === 'LOGIN'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('REGISTER');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              mode === 'REGISTER'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            New Officer / Signup
          </button>
        </div>

        {/* Main Card */}
        <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-900/40 shadow-2xl backdrop-blur-md space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {mode === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Authorized Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. admin@fest.org"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Security Password</label>
                  <span className="text-[10px] text-teal-400 font-bold">Default: ihrd@2026</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter security password"
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
                    <span>Enter Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Prof. Rajesh K."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Officer Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="rajesh@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Committee Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                >
                  <option value="EVENT_COORDINATOR">Event Coordinator (Stages & Events)</option>
                  <option value="SCORE_MANAGER">Score Officer (Tabulation & Results)</option>
                  <option value="SUPER_ADMIN">Festival Convener / Super Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Set Security Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
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
                    <UserPlus className="w-4 h-4" />
                    <span>Create Officer Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold flex items-center gap-1.5 text-slate-300">
                <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                1-Click Official Logins (Password: <span className="text-teal-300 font-bold">ihrd@2026</span>)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => autofillCredentials('admin@fest.org', 'ihrd@2026')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-black">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">admin@fest.org</div>
              </button>

              <button
                type="button"
                onClick={() => autofillCredentials('coordinator@fest.org', 'ihrd@2026')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-teal-400 text-[11px] font-black">
                  <User className="w-3.5 h-3.5" />
                  <span>Coordinator</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">coordinator@fest.org</div>
              </button>

              <button
                type="button"
                onClick={() => autofillCredentials('scores@fest.org', 'ihrd@2026')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-black">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Score Officer</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">scores@fest.org</div>
              </button>
            </div>
          </div>
        </div>

        {/* Link to other login portals */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2 text-xs">
          <p className="text-slate-400">Looking for other Kalolsavam access portals?</p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-teal-400">
            <Link href="/login/team" className="hover:text-teal-300 flex items-center gap-1">
              <School className="w-3.5 h-3.5" /> School / Team Login
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

