'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { Festival } from '@/types/database';

interface FestivalBannerProps {
  festival: Festival;
  showAdminAction?: boolean;
}

export function FestivalBanner({ festival, showAdminAction = true }: FestivalBannerProps) {
  const bannerImage = festival.banner_url;

  return (
    <div className="relative w-full bg-slate-950 overflow-hidden border-b border-cyan-900/40 select-none">
      {/* Banner Container */}
      <div className="relative w-full h-32 sm:h-40 md:h-52 lg:h-64 overflow-hidden bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt={`${festival.name} Cover Banner`}
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
          />
        ) : (
          /* Default Kerala Kalolsavam Cultural Banner Artwork */
          <div className="w-full h-full relative flex items-center justify-between px-6 md:px-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950">
            {/* Cultural Silhouettes & Decorative Circles */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-400 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left Decorative Art Motifs */}
            <div className="hidden sm:flex items-center gap-4 text-emerald-400/80 z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center p-2 text-center backdrop-blur-sm">
                <span className="text-2xl md:text-3xl">🎭</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 mt-1">Kathakali</span>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex flex-col items-center justify-center p-2 text-center backdrop-blur-sm">
                <span className="text-2xl md:text-3xl">🥁</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-300 mt-1">Chenda</span>
              </div>
            </div>

            {/* Center: Official Festival Calligraphy & Title */}
            <div className="text-center z-10 max-w-xl mx-auto space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{festival.college_name}</span>
              </div>

              {/* Malayalam Cultural Script Reference */}
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 drop-shadow-md">
                കലോത്സവം {festival.year}
              </div>

              <h2 className="text-base sm:text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                {festival.name} • {festival.edition}
              </h2>

              {festival.theme && (
                <p className="text-xs sm:text-sm text-teal-200/80 font-serif italic line-clamp-1">
                  &ldquo;{festival.theme}&rdquo;
                </p>
              )}
            </div>

            {/* Right Decorative Dance Motifs */}
            <div className="hidden sm:flex items-center gap-4 text-cyan-400/80 z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center p-2 text-center backdrop-blur-sm">
                <span className="text-2xl md:text-3xl">💃</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-300 mt-1">Mohiniyattam</span>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex flex-col items-center justify-center p-2 text-center backdrop-blur-sm">
                <span className="text-2xl md:text-3xl">🎨</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-300 mt-1">Chithrolsavam</span>
              </div>
            </div>
          </div>
        )}

        {/* Ambient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20 pointer-events-none" />

        {/* Quick Admin "Upload / Change Banner" pill */}
        {showAdminAction && (
          <Link
            href="/admin/festivals"
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 backdrop-blur-md shadow-lg transition-all hover:scale-105"
            title="Upload or Change Festival Banner Image"
          >
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>Upload Banner</span>
          </Link>
        )}
      </div>
    </div>
  );
}

