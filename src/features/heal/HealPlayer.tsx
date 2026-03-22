'use client';

import React, { useState } from 'react';
import { ChevronDown, SkipBack, Play, Pause, SkipForward, MessageSquareQuote, Music as MusicIcon } from 'lucide-react';
import { SoundTrack } from '@/types';

interface HealPlayerProps {
  activeTrack: SoundTrack;
  isPlaying: boolean;
  progress: number;
  onClose: () => void;
  onTogglePlay: (e?: React.MouseEvent) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ZenStonesGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" fill="currentColor">
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      <ellipse cx="50" cy="80" rx="35" ry="12" fillOpacity="0.8" />
      <ellipse cx="50" cy="62" rx="25" ry="10" fillOpacity="0.9" />
      <ellipse cx="50" cy="46" rx="15" ry="8" fillOpacity="1" />
    </g>
  </svg>
);

const ReadingGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" fill="currentColor">
    <path d="M50 20C40 15 25 15 10 20V85C10 85 25 80 50 85C75 80 90 85 90 85V20C90 20 75 15 50 20Z" fillOpacity="0.8" />
    <path d="M50 85V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M15 30 H40" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
    <path d="M15 40 H40" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
    <path d="M15 50 H40" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
    <path d="M60 30 H85" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
    <path d="M60 40 H85" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
  </svg>
);

const SleepGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" fill="currentColor">
    <path d="M70 15C60 15 50 25 50 40C50 65 65 75 80 75C60 90 30 75 30 45C30 25 50 10 70 15Z" fillOpacity="0.9" />
    <circle cx="20" cy="30" r="2" fill="white" fillOpacity="0.8" />
    <circle cx="40" cy="15" r="3" fill="white" fillOpacity="0.6" />
    <circle cx="25" cy="60" r="2" fill="white" fillOpacity="0.7" />
  </svg>
);

const HealPlayer: React.FC<HealPlayerProps> = ({ 
  activeTrack, isPlaying, progress, onClose, onTogglePlay, onNext, onPrev 
}) => {
  const [showLyrics, setShowLyrics] = useState(false);

  const getLyrics = () => {
    if (activeTrack.category === 'Meditation') {
      return [
        "Find your center...", "Breathe deeply.", "Feel the ground beneath you.", "Release the tension.",
        "You are present.", "You are grounded.", "Let thoughts float by.", "Peace is within you.",
        "Stay in this moment.", "Just be."
      ];
    } else if (activeTrack.category === 'Sleep') {
      return [
        "Close your eyes...", "Let the day fade away.", "Heavy eyelids.", "Soft breathing.",
        "Drifting on clouds.", "Safe and warm.", "Resting your mind.", "Quiet the noise.",
        "Sleep comes gently.", "Goodnight."
      ];
    } else {
      return [
        "Open your mind...", "Words flowing.", "Focus on the page.", "Absorb the knowledge.",
        "Imagination awakes.", "Clear thoughts.", "Steady rhythm.", "Deep understanding.",
        "Learning grows.", "Turn the page."
      ];
    }
  };

  const lyrics = getLyrics();

  const getBackgroundClass = () => {
    if (activeTrack.category === 'Sleep') return 'bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-indigo-100';
    if (activeTrack.category === 'Reading') return 'bg-gradient-to-b from-[#ECFCCB] via-[#D9F99D] to-[#BEF264] text-emerald-900';
    return 'bg-gradient-to-b from-[#E0E7FF] via-[#C7D2FE] to-[#A5B4FC] text-indigo-900';
  };

  const getGraphic = () => {
    switch(activeTrack.category) {
      case 'Meditation': return <ZenStonesGraphic />;
      case 'Reading': return <ReadingGraphic />;
      case 'Sleep': return <SleepGraphic />;
      default: return <MusicIcon size={80} />;
    }
  };

  const bgClass = getBackgroundClass();
  const isDark = activeTrack.category === 'Sleep';

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col font-sans transition-colors duration-700 pb-safe ${bgClass}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-40 animate-float ${isDark ? 'bg-indigo-500' : 'bg-white'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-30 animate-float ${isDark ? 'bg-purple-500' : 'bg-white'}`} style={{ animationDelay: '-2s' }} />
      </div>

      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 z-30 pt-8">
        <button 
          onClick={onClose}
          className={`w-10 h-10 backdrop-blur-md border rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white/40 border-white/40 text-slate-800'}`}
        >
          <ChevronDown size={22} strokeWidth={2.5} />
        </button>
        <button 
          onClick={() => setShowLyrics(!showLyrics)}
          className={`w-10 h-10 backdrop-blur-md border rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 
            ${showLyrics 
              ? (isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') 
              : (isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white/40 border-white/40 text-slate-800')}
          `}
        >
          <MessageSquareQuote size={20} strokeWidth={2.5} fill={showLyrics ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative z-10 overflow-y-auto no-scrollbar">
        {showLyrics ? (
          <div className="px-8 py-4 text-center space-y-8 pt-10 pb-20">
            {lyrics.map((line, i) => (
              <p 
                key={i} 
                className={`text-[24px] font-bold leading-tight transition-all duration-500 ${isDark ? 'text-white' : 'text-slate-900'} ${i === 1 || i === 2 ? 'opacity-100 scale-100 blur-none' : 'opacity-40 scale-95 blur-[1px]'}`}
              >
                {line}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center py-8">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6 flex items-center justify-center flex-shrink-0">
              <div className={`absolute inset-0 rounded-full blur-[60px] animate-pulse ${isDark ? 'bg-indigo-500/30' : 'bg-white/60'}`} />
              <div className={`relative z-10 w-full h-full transition-transform duration-[6000ms] ease-in-out ${isPlaying ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-full h-full ${isDark ? 'text-indigo-200' : 'text-indigo-600'} drop-shadow-2xl`}>
                  {getGraphic()}
                </div>
              </div>
            </div>
            <div className="space-y-2 max-w-xs mx-auto flex-shrink-0">
              <h2 className={`text-[28px] sm:text-[32px] font-bold leading-tight tracking-tight px-2 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeTrack.title}
              </h2>
              <p className={`font-bold text-[13px] uppercase tracking-[0.2em] ${isDark ? 'text-indigo-200' : 'text-slate-500'}`}>
                {activeTrack.category} • {activeTrack.duration}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={`rounded-t-[40px] px-8 pt-10 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.1)] flex-shrink-0 z-30 relative ${isDark ? 'bg-slate-900' : 'bg-white/80 backdrop-blur-xl'}`}>
        <div className="mb-8">
          <div className={`h-2 rounded-full overflow-hidden w-full p-[2px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isDark ? 'bg-indigo-400' : 'bg-slate-800'}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={`flex justify-between mt-3 text-[11px] font-black uppercase tracking-[0.1em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>{Math.floor(progress * 0.6)}s</span>
            <span>{activeTrack.duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-10">
          <button onClick={onPrev} className={`transition-colors active:scale-90 p-2 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
            <SkipBack size={32} fill="currentColor" />
          </button>
          <button 
            onClick={onTogglePlay}
            className={`w-20 h-20 rounded-[30px] flex items-center justify-center active:scale-95 transition-all transform shadow-xl ${isDark ? 'bg-indigo-500 text-white shadow-indigo-500/30' : 'bg-slate-900 text-white shadow-slate-900/30'}`}
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={onNext} className={`transition-colors active:scale-90 p-2 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
            <SkipForward size={32} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealPlayer;
