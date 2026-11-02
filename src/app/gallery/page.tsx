'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Image as ImageIcon, Video, Filter, X, Sparkles, ZoomIn, Eye } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { dataStore } from '@/lib/data-store';
import { GalleryAlbum, GalleryMedia } from '@/types/database';

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [lightboxItem, setLightboxItem] = useState<GalleryMedia | null>(null);

  const festival = dataStore.getActiveFestival();

  useEffect(() => {
    setMounted(true);
    setAlbums(dataStore.getAlbums(undefined, true));
    setMedia(dataStore.getMedia(undefined, true));
  }, []);

  if (!mounted) return null;

  const filteredMedia = media.filter((m) => {
    const matchesAlbum = selectedAlbum === 'ALL' || m.album_id === selectedAlbum;
    const matchesType = selectedType === 'ALL' || m.media_type === selectedType;
    return matchesAlbum && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar festivalName={festival.name} festivalEdition={festival.edition} />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/20">
              Media Archive
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Festival Gallery</span>
              <Camera className="w-8 h-8 text-rose-400" />
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              High-resolution moments capturing stage spectacles, literary deliberations, and fine arts exhibits from {festival.name}.
            </p>
          </div>

          {/* Album & Type Filter Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Albums:</span>
              <button
                onClick={() => setSelectedAlbum('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedAlbum === 'ALL'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Media ({media.length})
              </button>
              {albums.map((alb) => (
                <button
                  key={alb.id}
                  onClick={() => setSelectedAlbum(alb.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedAlbum === alb.id
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {alb.title} ({alb.media_count || 0})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold mr-2">Type:</span>
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  selectedType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('IMAGE')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                  selectedType === 'IMAGE' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photographs
              </button>
              <button
                onClick={() => setSelectedType('VIDEO')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                  selectedType === 'VIDEO' ? 'bg-slate-800 text-rose-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Videos & Reels
              </button>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer h-72 shadow-lg"
              >
                <img
                  src={item.media_url}
                  alt={item.caption || 'Festival Photograph'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4 text-teal-400" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-xs">
                  {item.caption && (
                    <p className="font-bold text-white line-clamp-2 leading-snug">{item.caption}</p>
                  )}
                  <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider mt-1 block">
                    {item.media_type === 'VIDEO' ? 'Video Highlight' : 'Photo Exhibit'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-300">No media available for the chosen album filter.</p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={lightboxItem.media_url}
                alt={lightboxItem.caption || 'Enlarged media'}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-slate-950 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-base">{lightboxItem.caption || 'Festival Photograph'}</p>
                <p className="text-xs text-teal-400 font-semibold uppercase mt-0.5">
                  Official Archive • {festival.name}
                </p>
              </div>
              <a
                href={lightboxItem.media_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                Open Full Resolution
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

