'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Sparkles,
  Shield,
  Trophy,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { dataStore } from '@/lib/data-store';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const currentAdmin = dataStore.getCurrentAdmin();
  const activeFestival = dataStore.getActiveFestival();

  return (
    <header className="sticky top-0 z-20 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
          <span>{activeFestival.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-amber-400">{title}</span>
        </div>
        <h1 className="text-xl font-extrabold text-white tracking-tight">{title}</h1>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Links */}
        <Link
          href="/leaderboard"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          Live Leaderboard
        </Link>

        {/* Current Admin Badge */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 p-[2px]">
            <img
              src={currentAdmin?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentAdmin?.full_name || 'Admin'}
              className="w-full h-full object-cover rounded-full bg-slate-900"
            />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">
              {currentAdmin?.full_name || 'Festival Controller'}
            </p>
            <p className="text-[10px] text-amber-400 font-semibold tracking-wide">
              {currentAdmin?.role.replace('_', ' ') || 'SUPER ADMIN'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

