'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  Trophy,
  Image,
  Bell,
  Menu,
  X,
  Shield,
  Clock,
  Music,
  Palette,
  User,
  LogIn,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { dataStore } from '@/lib/data-store';
import { AdminProfile } from '@/types/database';

interface NavbarProps {
  festivalName?: string;
  festivalEdition?: string;
}

export function Navbar({ festivalName = 'DHWANI', festivalEdition = '2026' }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null);

  useEffect(() => {
    setCurrentAdmin(dataStore.getCurrentAdmin());
  }, [pathname]);

  const handleLogout = () => {
    dataStore.logout();
    setCurrentAdmin(null);
    setUserDropdownOpen(false);
    window.location.href = '/';
  };

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

            {/* Login 👤 ▾ Option (Reference: Kerala Kalolsavam Image 2) */}
            {currentAdmin ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-xs font-bold text-white transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-[1.5px]">
                    <img
                      src={currentAdmin.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={currentAdmin.full_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-teal-300 font-semibold">{currentAdmin.full_name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-800 text-left">
                      <p className="text-xs font-bold text-white truncate">{currentAdmin.full_name}</p>
                      <p className="text-[10px] text-teal-400 font-semibold uppercase">{currentAdmin.role.replace('_', ' ')}</p>
                    </div>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5 text-teal-400" />
                      Admin Console
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-700/80 hover:border-teal-500/50 rounded-xl transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>Login ▾</span>
              </Link>
            )}

            <Link
              href={currentAdmin ? '/admin/dashboard' : '/login'}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl shadow-md shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href={currentAdmin ? '/admin/dashboard' : '/login'}
              className="p-2 text-teal-400 bg-teal-500/10 rounded-lg border border-teal-500/20"
              title="Admin Portal"
            >
              <User className="w-4 h-4" />
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
              href={currentAdmin ? '/admin/dashboard' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg"
            >
              <Shield className="w-4 h-4" />
              {currentAdmin ? 'Admin Console' : 'Admin Login'}
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

