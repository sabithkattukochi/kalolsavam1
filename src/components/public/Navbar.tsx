'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, Trophy, Image, Bell, Menu, X, Shield, Clock, Music, Palette } from 'lucide-react';

interface NavbarProps {
  festivalName?: string;
  festivalEdition?: string;
}

export function Navbar({ festivalName = 'DHWANI', festivalEdition = '2026' }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Events', href: '/events' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Results', href: '/results' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Announcements', href: '/announcements' },
    { name: 'History', href: '/history' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyan-900/40 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 p-[2px] transition-transform group-hover:scale-105 shadow-lg shadow-teal-900/40">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  {festivalName}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
                  {festivalEdition}
                </span>
              </div>
              <p className="text-[11px] text-teal-200/70 font-medium tracking-wide">
                College Arts Festival • Victoria College
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'text-teal-300 bg-teal-500/15 shadow-sm border border-teal-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              Live Scores
            </Link>

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl shadow-md shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="p-2 text-teal-400 bg-teal-500/10 rounded-lg border border-teal-500/20"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800/80">
            <Link
              href="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 rounded-lg"
            >
              <Trophy className="w-4 h-4 text-cyan-400" />
              Live Leaderboard
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'text-teal-300 bg-teal-500/15 border border-teal-500/30' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

