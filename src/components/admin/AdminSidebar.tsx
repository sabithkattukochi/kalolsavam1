'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  Layers,
  CalendarDays,
  UserCheck,
  Calendar,
  Award,
  Sliders,
  Image,
  Bell,
  History,
  FileSpreadsheet,
  FileText,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { dataStore } from '@/lib/data-store';
import { AdminRole } from '@/types/database';

interface AdminSidebarProps {
  currentRole?: AdminRole;
  onRoleChange?: (role: AdminRole) => void;
}

export function AdminSidebar({ currentRole = 'SUPER_ADMIN', onRoleChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const activeFestival = dataStore.getActiveFestival();

  const navGroups = [
    {
      title: 'Core Administration',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Students', href: '/admin/students', icon: Users },
        { label: 'Teams & Groups', href: '/admin/teams', icon: Shield },
        { label: 'Categories', href: '/admin/categories', icon: Layers },
        { label: 'Events', href: '/admin/events', icon: CalendarDays },
      ],
    },
    {
      title: 'Operations & Scoring',
      items: [
        {
          label: 'Enrollments',
          href: '/admin/enrollments',
          icon: UserCheck,
          highlight: true,
          badge: 'Admin Only',
        },
        { label: 'Schedules & Venues', href: '/admin/schedules', icon: Calendar },
        { label: 'Results & Grading', href: '/admin/results', icon: Award, highlight: true },
        { label: 'Point Engine Rules', href: '/admin/points', icon: Sliders },
      ],
    },
    {
      title: 'Media & Communications',
      items: [
        { label: 'Gallery & Media', href: '/admin/gallery', icon: Image },
        { label: 'Announcements', href: '/admin/announcements', icon: Bell },
      ],
    },
    {
      title: 'System & Reports',
      items: [
        { label: 'Reports & Export', href: '/admin/reports', icon: FileSpreadsheet },
        { label: 'Festival Editions', href: '/admin/festivals', icon: History },
        { label: 'Audit Trail', href: '/admin/audit-logs', icon: FileText },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-slate-950 border-r border-cyan-900/30 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-950/40">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>KALOLSAVAM</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ADMIN
              </span>
            </h1>
            <p className="text-[11px] text-teal-200/70 font-medium">Control & Operations Console</p>
          </div>
        </Link>
      </div>

      {/* Active Festival Switcher Pill */}
      <div className="px-5 py-3.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Active Festival</p>
          <p className="text-xs font-bold text-white truncate">{activeFestival.name} ({activeFestival.edition})</p>
        </div>
        <Link
          href="/admin/festivals"
          className="text-[11px] text-slate-400 hover:text-teal-300 px-2 py-1 bg-slate-800 rounded border border-slate-700/60 transition-colors"
        >
          Change
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              {group.title}
            </h3>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/15 text-emerald-300 border border-emerald-500/35 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-teal-400'
                          : item.highlight
                          ? 'text-cyan-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Role Switcher & Bottom Bar */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3">
        {/* Role Selector */}
        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Role</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentRole.replace('_', ' ')}
            </span>
          </div>
          {onRoleChange && (
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as AdminRole)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
            >
              <option value="SUPER_ADMIN">Super Admin (All Modules)</option>
              <option value="EVENT_COORDINATOR">Event Coordinator (Events & Participants)</option>
              <option value="SCORE_MANAGER">Score Manager (Results & Grading)</option>
            </select>
          )}
        </div>

        {/* Public Website Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/60"
        >
          <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
          View Public Website
        </Link>
      </div>
    </aside>
  );
}

