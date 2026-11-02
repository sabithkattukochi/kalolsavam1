'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale,
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
  Award,
  LogOut,
  Shield,
  ArrowLeft,
  School,
  GraduationCap,
  Save,
  Check,
} from 'lucide-react';
import { dataStore } from '@/lib/data-store';
import { JudgeProfile, FestivalEvent, EventRegistration, GradeType } from '@/types/database';

export default function JudgeLoginPage() {
  const [judgeId, setJudgeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeJudge, setActiveJudge] = useState<JudgeProfile | null>(null);
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [contestants, setContestants] = useState<EventRegistration[]>([]);

  // Scoring state
  const [selectedContestant, setSelectedContestant] = useState<string>('');
  const [scoreTech, setScoreTech] = useState<number>(35);
  const [scoreArt, setScoreArt] = useState<number>(27);
  const [scorePres, setScorePres] = useState<number>(25);
  const [scoreSavedMessage, setScoreSavedMessage] = useState<string | null>(null);

  const judgesList = dataStore.getJudges();

  useEffect(() => {
    const current = dataStore.getCurrentJudge();
    if (current) {
      loadJudgeData(current);
    }
  }, []);

  const loadJudgeData = (judge: JudgeProfile) => {
    setActiveJudge(judge);
    const allEvents = dataStore.getEvents();
    setEvents(allEvents);
    if (allEvents.length > 0) {
      setSelectedEventId(allEvents[0].id);
      loadContestants(allEvents[0].id);
    }
  };

  const loadContestants = (eventId: string) => {
    const regs = dataStore.getRegistrations().filter((r) => r.event_id === eventId);
    setContestants(regs);
    if (regs.length > 0) {
      setSelectedContestant(regs[0].id);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    loadContestants(eventId);
    setScoreSavedMessage(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      const res = dataStore.authenticateJudge(judgeId, password);
      if (res.success && res.judge) {
        setSuccess(`Authenticated as ${res.judge.full_name}!`);
        loadJudgeData(res.judge);
      } else {
        setError(res.error || 'Judge authentication failed.');
      }
      setLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    dataStore.logoutJudge();
    setActiveJudge(null);
    setEvents([]);
    setContestants([]);
    setSuccess(null);
  };

  const autofillJudge = (code: string) => {
    setJudgeId(code);
    setPassword('ihrd@2026');
    setError(null);
  };

  // Submit score for contestant
  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    const total = scoreTech + scoreArt + scorePres;
    let grade: GradeType = 'C';
    if (total >= 70) grade = 'A';
    else if (total >= 60) grade = 'B';

    const reg = contestants.find((c) => c.id === selectedContestant);
    if (!reg) return;

    // Save result to dataStore
    const festival = dataStore.getActiveFestival();
    dataStore.saveResult(festival.id, selectedEventId, {
      student_id: reg.student_id,
      team_id: reg.team_id,
      registration_id: reg.id,
      position: total >= 80 ? 1 : total >= 70 ? 2 : 3,
      grade,
      remarks: `Evaluated by ${activeJudge?.full_name}: Technique ${scoreTech}, Art ${scoreArt}, Pres ${scorePres} (Total: ${total}/100)`,
      status: 'PUBLISHED',
    });

    setScoreSavedMessage(`Official score submitted for Chest #${reg.chest_number} (${reg.student?.full_name}): ${total}/100 [Grade ${grade}]`);
  };

  const totalScore = scoreTech + scoreArt + scorePres;
  let currentGrade: GradeType = 'C';
  if (totalScore >= 70) currentGrade = 'A';
  else if (totalScore >= 60) currentGrade = 'B';

  // If authenticated as a Judge: render the scoring console
  if (activeJudge) {
    const selectedEvent = events.find((e) => e.id === selectedEventId);
    const selectedReg = contestants.find((c) => c.id === selectedContestant);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Kalolsavam Home</span>
              </Link>
              <span className="text-slate-700">•</span>
              <span className="text-xs font-bold text-teal-400">Jury & Evaluation Console</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Judge Identity Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-teal-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-500/30">
                    Official Stage Jury
                  </span>
                  <span className="text-xs font-bold text-amber-400">{activeJudge.judge_code}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {activeJudge.full_name}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assigned Domain: <span className="text-slate-200 font-semibold">{activeJudge.assigned_category}</span>
                </p>
                <p className="text-xs text-teal-300 font-medium mt-0.5">
                  Stage / Venue: {activeJudge.assigned_venue}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Security Status</div>
              <div className="text-xs font-black text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Scoring Authenticated
              </div>
            </div>
          </div>

          {/* Scoring Console */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event & Contestants Selection */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">1. Select Competition Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => handleEventChange(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.code} - {ev.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent && (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 text-slate-400">
                  <div>Venue: <span className="text-white font-semibold">{selectedEvent.venue}</span></div>
                  <div>Stage: <span className="text-teal-400 font-bold">{selectedEvent.stage_number || 'Main Stage'}</span></div>
                  <div>Rules: <span className="text-slate-300">{selectedEvent.rules || 'Standard rules apply'}</span></div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                  <span>2. Select Contestant ({contestants.length})</span>
                  <span className="text-[11px] text-teal-400">By Chest #</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {contestants.map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => {
                        setSelectedContestant(reg.id);
                        setScoreSavedMessage(null);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedContestant === reg.id
                          ? 'bg-teal-500/20 border-teal-500/50 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black text-white">{reg.student?.full_name}</div>
                        <div className="text-[10px] text-teal-300 font-semibold">{reg.team?.name}</div>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black">
                        #{reg.chest_number}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Marks Entry Slate */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-teal-500/30 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white">Live Marks & Evaluation Slate</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scoring contestant: <span className="text-teal-300 font-bold">{selectedReg?.student?.full_name || 'Select contestant'}</span> (Chest #{selectedReg?.chest_number || '-'})
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">{totalScore} <span className="text-xs text-slate-400">/ 100</span></div>
                  <div className="text-xs font-black text-amber-300">Grade {currentGrade}</div>
                </div>
              </div>

              {scoreSavedMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{scoreSavedMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitScore} className="space-y-5">
                {/* Criterion 1 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">1. Technical Accuracy & Mastery (Max 40)</span>
                    <span className="text-teal-400 font-black text-sm">{scoreTech} / 40</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={scoreTech}
                    onChange={(e) => setScoreTech(parseInt(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Basic (10)</span>
                    <span>Proficient (25)</span>
                    <span>Flawless (40)</span>
                  </div>
                </div>

                {/* Criterion 2 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">2. Artistic Expression & Creativity (Max 30)</span>
                    <span className="text-teal-400 font-black text-sm">{scoreArt} / 30</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={scoreArt}
                    onChange={(e) => setScoreArt(parseInt(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Average (5)</span>
                    <span>Expressive (18)</span>
                    <span>Masterful (30)</span>
                  </div>
                </div>

                {/* Criterion 3 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">3. Presentation, Rhythm & Attire (Max 30)</span>
                    <span className="text-teal-400 font-black text-sm">{scorePres} / 30</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={scorePres}
                    onChange={(e) => setScorePres(parseInt(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Modest (5)</span>
                    <span>Strong (18)</span>
                    <span>Exceptional (30)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedReg}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Submit Official Jury Score ({totalScore} Pts)</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render Judge Login Form
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
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-teal-950/40">
            <Scale className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[11px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Stage Jury & Tabulators
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Judge & Evaluation Console Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized stage jury access for scoring contestants and submitting official grades
            </p>
          </div>
        </div>

        {/* Login Card */}
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
              <label className="text-xs font-bold text-slate-300">Judge Code or Official Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={judgeId}
                  onChange={(e) => setJudgeId(e.target.value)}
                  placeholder="e.g. JUDGE-01 or judge1@fest.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors uppercase font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Jury Access PIN / Password</label>
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
                  placeholder="Enter jury security pin"
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
                  <span>Open Evaluation Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick autofill for 3 Judges */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              1-Click Demo Judges (PIN: <span className="text-teal-300 font-bold">ihrd@2026</span>)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {judgesList.map((judge) => (
                <button
                  key={judge.id}
                  type="button"
                  onClick={() => autofillJudge(judge.judge_code)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
                >
                  <div className="text-xs font-black text-white truncate">{judge.judge_code}</div>
                  <div className="text-[10px] text-teal-400 font-semibold truncate">{judge.full_name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Other Portals Switcher */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2 text-xs">
          <p className="text-slate-400">Looking for other Kalolsavam portals?</p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-teal-400">
            <Link href="/login/admin" className="hover:text-teal-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin Portal
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/login/team" className="hover:text-teal-300 flex items-center gap-1">
              <School className="w-3.5 h-3.5" /> School / Team Login
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

