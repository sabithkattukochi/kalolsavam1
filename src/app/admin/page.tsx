'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Sparkles, Lock, ArrowRight, UserCheck, Award, Eye } from 'lucide-react';
import { dataStore } from '@/lib/data-store';
import { AdminRole } from '@/types/database';

export default function AdminLoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER_ADMIN');
  const [email, setEmail] = useState('admin@fest.org');
  const [password, setPassword] = useState('victoria@2026');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'SUPER_ADMIN' as AdminRole,
      title: 'Super Admin',
      email: 'admin@fest.org',
      desc: 'Full access to all modules, team configurations, points engine, and admin permissions.',
      icon: Shield,
      color: 'from-amber-500 to-yellow-600',
    },
    {
      id: 'EVENT_COORDINATOR' as AdminRole,
      title: 'Event Coordinator',
      email: 'coordinator@fest.org',
      desc: 'Manage assigned events, venues, participant rosters, and operational schedules.',
      icon: UserCheck,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'SCORE_MANAGER' as AdminRole,
      title: 'Score Manager',
      email: 'scores@fest.org',
      desc: 'Enter and certify event results, grades, and supervise points tabulation.',
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const handleRoleSelect = (r: typeof roles[0]) => {
    setSelectedRole(r.id);
    setEmail(r.email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      dataStore.loginAs(selectedRole);
      router.push('/admin/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-amber-500/15 via-rose-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-xl space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-rose-950/40">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Victoria College Cultural Board
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              Festival Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
              Restricted access for college festival controllers, coordinators, and scoring officers.
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
          {/* Role Selection Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Operating Role:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-extrabold text-white block">{r.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Authorized Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Security Password</label>
                <span className="text-[10px] text-amber-400">Pre-authenticated</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  Authenticating Session...
                </>
              ) : (
                <>
                  Enter Admin Console <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Role info snippet */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400">
            <strong className="text-slate-200 font-semibold block mb-0.5">
              Role Scope: {roles.find((r) => r.id === selectedRole)?.title}
            </strong>
            <p className="text-[11px] leading-relaxed">
              {roles.find((r) => r.id === selectedRole)?.desc}
            </p>
          </div>
        </div>

        {/* Public Website Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Public Festival Website
          </Link>
        </div>
      </div>
    </div>
  );
}

