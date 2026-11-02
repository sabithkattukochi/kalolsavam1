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
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[2px] transition-transform group-hover:scale-105 shadow-lg shadow-rose-900/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {festivalName}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 tracking-wider">
                  {festivalEdition}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
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
                      ? 'text-amber-400 bg-amber-500/10 shadow-sm border border-amber-500/20'
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
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Live Scores
            </Link>

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="p-2 text-amber-400 bg-amber-500/10 rounded-lg border border-amber-500/20"
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
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-lg"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Live Leaderboard
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg"
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
                    isActive ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-300 hover:bg-slate-900'
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

