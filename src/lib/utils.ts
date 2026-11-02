import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPoints(pts: number | undefined | null): string {
  if (pts === undefined || pts === null) return '0';
  return Number.isInteger(pts) ? pts.toString() : pts.toFixed(1);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}

export function getPositionBadge(pos: 1 | 2 | 3 | null | undefined) {
  if (pos === 1) {
    return {
      label: '1st Place',
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      badge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold',
      icon: '🥇',
    };
  }
  if (pos === 2) {
    return {
      label: '2nd Place',
      bg: 'bg-slate-300/20 text-slate-200 border-slate-300/40',
      badge: 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-bold',
      icon: '🥈',
    };
  }
  if (pos === 3) {
    return {
      label: '3rd Place',
      bg: 'bg-amber-700/20 text-amber-200 border-amber-700/40',
      badge: 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 font-bold',
      icon: '🥉',
    };
  }
  return null;
}

export function getGradeBadge(grade: 'A' | 'B' | 'C' | 'PARTICIPATION' | null | undefined) {
  if (grade === 'A') {
    return {
      label: 'A Grade',
      className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold',
    };
  }
  if (grade === 'B') {
    return {
      label: 'B Grade',
      className: 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-semibold',
    };
  }
  if (grade === 'C') {
    return {
      label: 'C Grade',
      className: 'bg-purple-500/20 text-purple-400 border border-purple-500/40 font-semibold',
    };
  }
  if (grade === 'PARTICIPATION') {
    return {
      label: 'Participation',
      className: 'bg-slate-500/20 text-slate-300 border border-slate-500/40 font-medium',
    };
  }
  return null;
}

