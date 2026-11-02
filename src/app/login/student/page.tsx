'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
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
  Calendar,
  Award,
  LogOut,
  Printer,
  Shield,
  ArrowLeft,
  School,
  Scale,
  QrCode,
  MapPin,
  Clock,
  Check,
} from 'lucide-react';
import { dataStore } from '@/lib/data-store';
import { Student, EventRegistration, FestivalEvent, EventResult } from '@/types/database';

export default function StudentLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('ihrd@2026');
  const [showPin, setShowPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [studentResults, setStudentResults] = useState<EventResult[]>([]);

  const festival = dataStore.getActiveFestival();

  useEffect(() => {
    const current = dataStore.getCurrentStudent();
    if (current) {
      loadStudentData(current);
    }
  }, []);

  const loadStudentData = (student: Student) => {
    setActiveStudent(student);
    const regs = dataStore.getRegistrations().filter((r) => r.student_id === student.id);
    setRegistrations(regs);
    const res = dataStore.getResults().filter((r) => r.student_id === student.id);
    setStudentResults(res);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      const res = dataStore.authenticateStudent(identifier, pin);
      if (res.success && res.student) {
        setSuccess(`Participant record located: ${res.student.full_name}!`);
        loadStudentData(res.student);
      } else {
        setError(res.error || 'Participant record not found. Please verify Chest Number or Student ID.');
      }
      setLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    dataStore.logoutStudent();
    setActiveStudent(null);
    setRegistrations([]);
    setStudentResults([]);
    setSuccess(null);
  };

  const autofillChest = (chestOrId: string) => {
    setIdentifier(chestOrId);
    setPin('ihrd@2026');
    setError(null);
  };

  // If student record authenticated: Render official Kerala Kalolsavam Hall Ticket
  if (activeStudent) {
    const events = dataStore.getEvents();
    const primaryReg = registrations[0];
    const team = dataStore.getTeams().find((t) => t.id === activeStudent.team_id);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Kalolsavam Home</span>
              </Link>
              <span className="text-slate-700">•</span>
              <span className="text-xs font-bold text-teal-400">Participant Hall Ticket & Score Card</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" />
                <span>Print Official Hall Ticket</span>
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

          {/* OFFICIAL ADMIT CARD / HALL TICKET */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border-2 border-teal-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Kerala Kalolsavam Hall Ticket Header */}
            <div className="text-center pb-5 border-b-2 border-dashed border-slate-800 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
                Official Contestant Identity Card • Admit Card
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                {festival.name} • {festival.edition}
              </h2>
              <p className="text-xs text-teal-300 font-semibold">
                {festival.college_name} • Arts Festival Committee
              </p>
            </div>

            {/* Main Participant Profile Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                {/* Photo / Avatar */}
                <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-500 p-[2px] shadow-xl shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] overflow-hidden flex items-center justify-center">
                    <img
                      src={`https://images.unsplash.com/photo-${1534528741775 + parseInt(activeStudent.student_id.slice(-2) || '1') * 100}?auto=format&fit=crop&w=300&q=80`}
                      alt={activeStudent.full_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <User className="w-12 h-12 text-teal-400 absolute" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    {activeStudent.full_name}
                  </h1>
                  <div className="text-xs text-teal-300 font-bold">
                    Student ID: {activeStudent.student_id}
                  </div>
                  <div className="text-xs text-slate-300">
                    {activeStudent.course} • {activeStudent.class_grade}
                  </div>
                  <div className="text-xs text-slate-400">
                    Department: <span className="text-white font-semibold">{activeStudent.department}</span>
                  </div>
                  {team && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-white mt-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }} />
                      <span>{team.name} ({team.code})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chest Number & Security QR */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-amber-500/40 text-center shrink-0 min-w-44 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Official Chest Number
                </span>
                <span className="text-4xl font-black text-amber-300 tracking-tight my-1">
                  #{primaryReg ? primaryReg.chest_number : '101'}
                </span>
                <div className="p-2 bg-white rounded-lg mt-2">
                  <QrCode className="w-16 h-16 text-slate-950" />
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-mono">
                  VERIFIED • {festival.year}
                </span>
              </div>
            </div>

            {/* Registered Events & Stage Timetable */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Scheduled Competitions & Stage Entry</span>
              </h3>

              <div className="space-y-2.5">
                {registrations.map((reg) => {
                  const ev = events.find((e) => e.id === reg.event_id);
                  if (!ev) return null;

                  return (
                    <div
                      key={reg.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {ev.code}
                          </span>
                          <span className="text-sm font-black text-white">{ev.name}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                          <span className="flex items-center gap-1 text-teal-300 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-teal-400" />
                            {ev.stage_number || 'Stage 1'} ({ev.venue})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            {ev.start_time} - {ev.end_time}
                          </span>
                          <span>Date: <strong className="text-slate-200">{ev.date}</strong></span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                          Chest #{reg.chest_number} • Confirmed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Declared Results & Merit Certificate */}
            {studentResults.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Declared Performance & Merit Grade</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studentResults.map((result) => {
                    const ev = events.find((e) => e.id === result.event_id);

                    return (
                      <div
                        key={result.id}
                        className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-emerald-400">{ev?.name}</div>
                          <div className="text-sm font-black text-white mt-0.5">
                            Grade {result.grade} Certificate
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {result.position ? `Position #${result.position} • ` : ''}Total Points: {result.total_points}
                          </div>
                        </div>

                        <div className="text-center p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
                          <div className="text-lg font-black text-emerald-300">Grade {result.grade || 'A'}</div>
                          <div className="text-[10px] font-black text-emerald-400">+{result.total_points} PTS</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render Student Verification Login Form
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-teal-500 selection:text-slate-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Top Bar Navigation */}
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
            <GraduationCap className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[11px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Contestant Self-Service Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Participant Hall Ticket Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your Chest Number or Student ID to view and download your official Kalolsavam Admit Card and Score Card
            </p>
          </div>
        </div>

        {/* Form Card */}
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
              <label className="text-xs font-bold text-slate-300">Chest Number or Student ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 101 or AF2026-001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors uppercase font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Verification PIN / DOB</label>
                <span className="text-[10px] text-teal-400 font-bold">Default: ihrd@2026</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter verification pin (ihrd@2026)"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  <span>View Official Hall Ticket</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick autofill sample contestants */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              1-Click Demo Contestants (PIN: <span className="text-teal-300 font-bold">ihrd@2026</span>)
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => autofillChest('101')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-colors"
              >
                <div className="text-xs font-black text-amber-300">Chest #101</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Aarav K.</div>
              </button>

              <button
                type="button"
                onClick={() => autofillChest('102')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-colors"
              >
                <div className="text-xs font-black text-amber-300">Chest #102</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Fathima N.</div>
              </button>

              <button
                type="button"
                onClick={() => autofillChest('201')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-colors"
              >
                <div className="text-xs font-black text-amber-300">Chest #201</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Kavya P.</div>
              </button>
            </div>
          </div>
        </div>

        {/* Other Portals Switcher */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2 text-xs">
          <p className="text-slate-400">Other Kalolsavam portals:</p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-teal-400">
            <Link href="/login/admin" className="hover:text-teal-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin Portal
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/login/team" className="hover:text-teal-300 flex items-center gap-1">
              <School className="w-3.5 h-3.5" /> School / Team Login
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/login/judge" className="hover:text-teal-300 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" /> Judge Scoring Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

