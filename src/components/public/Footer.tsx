import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Award, Heart, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-900/40">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">DHWANI 2026</span>
                <p className="text-xs text-teal-300 font-medium">Fine Arts & Cultural Festival</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Victoria State Arts & Science College&apos;s annual festival celebrating music, literature, visual arts, and dramatic performance.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Official College Administration System
            </div>
          </div>

          {/* Festival Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Competitions</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/categories#chithrolsavam" className="hover:text-teal-300 transition-colors">
                  Chithrolsavam (Fine & Visual Arts)
                </Link>
              </li>
              <li>
                <Link href="/categories#sahithyolsavam" className="hover:text-teal-300 transition-colors">
                  Sahithyolsavam (Literary Arts)
                </Link>
              </li>
              <li>
                <Link href="/categories#stage-events" className="hover:text-teal-300 transition-colors">
                  Stage Events (Dance, Music, Drama)
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-teal-300 transition-colors">
                  Stage Venues & Timings
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-teal-300 transition-colors">
                  Official Score Sheets
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/leaderboard" className="hover:text-teal-300 transition-colors">
                  Live Team Standings
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-teal-300 transition-colors">
                  Festival Notices & Bulletins
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-teal-300 transition-colors">
                  Official Media Gallery
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-teal-300 transition-colors">
                  Festival Archives & Past Editions
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-teal-300 hover:text-teal-200 flex items-center gap-1 font-semibold">
                  <Shield className="w-3.5 h-3.5" /> Staff & Judge Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Control Room */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Festival Helpdesk</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Central Control Room, Victoria College Campus, Palakkad - 678001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98471 11222 (General Helpdesk)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>artsfest@victoriacollege.edu</span>
              </div>
              <div className="p-3 mt-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <p className="font-semibold text-slate-300">Notice for Students:</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  All enrollments and submissions are strictly managed by assigned department coordinators.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Victoria State Arts & Science College. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Official Scoring Rules 2026</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for College Arts
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

