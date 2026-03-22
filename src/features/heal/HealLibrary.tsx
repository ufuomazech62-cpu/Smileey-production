'use client';

import React, { useState } from 'react';
import { Search, BarChart3, Pause, Play, Music as MusicIcon, MoreVertical, Trash2 } from 'lucide-react';
import { SoundTrack } from '@/types';

interface HealLibraryProps {
  tracks: SoundTrack[];
  activeTrack: SoundTrack | null;
  isPlaying: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onPlayTrack: (track: SoundTrack) => void;
  onTogglePlay: (e?: React.MouseEvent) => void;
  onOpenPlayer: () => void;
  onDeleteTrack: (id: string) => void;
}

// Reuse SVG definitions for consistency
const ZenStonesGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
    <ellipse cx="50" cy="80" rx="35" ry="12" fillOpacity="0.8" />
    <ellipse cx="50" cy="62" rx="25" ry="10" fillOpacity="0.9" />
    <ellipse cx="50" cy="46" rx="15" ry="8" fillOpacity="1" />
  </svg>
);

const ReadingGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
    <path d="M50 20C40 15 25 15 10 20V85C10 85 25 80 50 85C75 80 90 85 90 85V20C90 20 75 15 50 20Z" fillOpacity="0.8" />
  </svg>
);

const SleepGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
    <path d="M70 15C60 15 50 25 50 40C50 65 65 75 80 75C60 90 30 75 30 45C30 25 50 10 70 15Z" fillOpacity="0.9" />
  </svg>
);

const HealLibrary: React.FC<HealLibraryProps> = ({ 
  tracks, activeTrack, isPlaying, searchQuery, setSearchQuery, onPlayTrack, onTogglePlay, onOpenPlayer, onDeleteTrack 
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getCategoryGraphic = (category: string) => {
    switch (category) {
      case 'Meditation': return <ZenStonesGraphic />;
      case 'Sleep': return <SleepGraphic />;
      case 'Reading': return <ReadingGraphic />;
      default: return <MusicIcon size={24} />;
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Remove this sound from your library?')) {
      onDeleteTrack(id);
    }
    setActiveMenuId(null);
  };

  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col relative w-full overflow-hidden font-sans">
        {/* HEADER */}
        <div className="pt-8 pb-3 px-6 z-20">
          <h2 className="text-[20px] font-bold text-white tracking-[-0.03em] mb-3 leading-tight">Sound Healing</h2>
          
          <div className="relative w-full">
             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/70">
               <Search size={16} strokeWidth={3} />
             </div>
             <input 
               type="text" 
               placeholder="Search..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/15 backdrop-blur-3xl border border-white/20 text-white font-semibold placeholder-white/50 outline-none shadow-lg tracking-tight text-[14px]"
             />
          </div>
        </div>

        {/* CONTENT */}
        <div 
          className="flex-1 w-full bg-white rounded-t-[28px] overflow-y-auto no-scrollbar pt-5 pb-24 px-4 shadow-[0_-10px_50px_rgba(0,0,0,0.05)]"
          onClick={() => setActiveMenuId(null)}
        >
            <div className="flex items-center justify-between px-2 mb-3">
               <h4 className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.12em]">Vibrations</h4>
               {/* Updated branding: Uses app brand gradient for badge */}
               <span className="text-[9px] font-bold text-white bg-gradient-to-r from-[#FF9B6A] to-[#EC4899] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                 {filteredTracks.length} Sounds
               </span>
            </div>

            <div className="space-y-1">
              {filteredTracks.map((track) => {
                const isCurrent = activeTrack?.id === track.id;
                return (
                  <div key={track.id} className="relative group">
                    <div
                      className={`
                        w-full flex items-center gap-4 p-3 rounded-[24px] transition-all border relative
                        ${isCurrent && isPlaying ? 'bg-pink-50/50 border-pink-100' : 'bg-transparent border-transparent active:bg-pink-50/30 hover:bg-pink-50/30'}
                      `}
                    >
                      {/* Icon Container - Fixed Size */}
                      <div 
                        onClick={() => onPlayTrack(track)}
                        className={`w-12 h-12 rounded-[18px] ${track.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm p-2.5 cursor-pointer active:scale-95 transition-transform`}
                      >
                        {isCurrent && isPlaying ? <BarChart3 size={20} className="animate-pulse" /> : getCategoryGraphic(track.category)}
                      </div>
                      
                      <div 
                        onClick={() => onPlayTrack(track)}
                        className="flex-1 text-left min-w-0 pr-6 cursor-pointer"
                      >
                        <h5 className={`font-bold text-[15px] tracking-tight truncate ${isCurrent ? 'text-[#EC4899]' : 'text-slate-800'}`}>
                          {track.title}
                        </h5>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide opacity-80">{track.duration} • {track.category}</span>
                      </div>

                      {/* Integrated Playback Control */}
                      {isCurrent && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm flex-shrink-0 z-10 active:scale-90 mr-8 ${isPlaying ? 'bg-[#EC4899] text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                        </button>
                      )}
                    </div>

                    {/* Menu Trigger */}
                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${activeMenuId === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                       <button 
                         onClick={(e) => toggleMenu(e, track.id)}
                         className="p-2 text-slate-300 hover:text-slate-500 rounded-full"
                       >
                         <MoreVertical size={18} />
                       </button>
                    </div>

                    {/* Menu */}
                    {activeMenuId === track.id && (
                      <div className="absolute right-0 top-12 bg-white shadow-xl rounded-2xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200 min-w-[150px]">
                         <button 
                            onClick={(e) => handleDelete(e, track.id)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-rose-500 hover:bg-rose-50 transition-colors w-full text-left"
                         >
                            <Trash2 size={16} />
                            <span className="text-[13px] font-bold whitespace-nowrap">Delete Sound</span>
                         </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </div>
      </div>
  );
};

export default HealLibrary;
