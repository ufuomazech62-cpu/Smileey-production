'use client';

import React, { useState, useEffect } from 'react';
import { UserMode, AvatarConfig, UserProfile } from '@/types';
import { Trophy } from 'lucide-react';

interface ReflectProps {
  userMode: UserMode;
}

const Reflect: React.FC<ReflectProps> = ({ userMode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('divinity_user_profile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) { return null; }
    }
    return null;
  });
  
  const [wins, setWins] = useState<{id: string; icon: string; label: string; xp: number; timestamp?: {seconds: number}}[]>(() => {
    const savedWins = localStorage.getItem('divinity_user_wins');
    if (savedWins) {
      try {
        return JSON.parse(savedWins);
      } catch (e) { return []; }
    }
    return [];
  });

  const stats = {
    level: profile?.level || 1,
    xp: profile?.xp || 0,
    nextLevelXp: Math.pow((profile?.level || 1), 2) * 50,
    streak: profile?.streak || 0,
    totalWins: profile?.totalWins || 0
  };

  const currentLevelMinXp = Math.pow((stats.level - 1), 2) * 50;
  const xpInCurrentLevel = stats.xp - currentLevelMinXp;
  const xpNeededForNextLevel = stats.nextLevelXp - currentLevelMinXp;
  const progressPercent = Math.min(Math.max((xpInCurrentLevel / xpNeededForNextLevel) * 100, 0), 100);

  const avatarConfig: AvatarConfig = profile?.avatarConfig || {
    color: 'purple',
    accessory: 'none',
    mood: 'happy'
  };

  // Get avatar color
  const getAvatarColor = () => {
    switch (avatarConfig.color) {
      case 'blue': return '#60A5FA';
      case 'pink': return '#F472B6';
      case 'green': return '#34D399';
      case 'orange': return '#FBBF24';
      default: return '#A78BFA';
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar font-sans bg-transparent">
      
      {/* HEADER */}
      <div className="pt-10 pb-4 px-8 flex justify-between items-center w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-extrabold text-white/70 uppercase tracking-[0.25em]">Your Journey</span>
          </div>
          <h2 className="text-[32px] font-extrabold text-white tracking-tight leading-tight">Growing</h2>
        </div>
      </div>

      {/* AVATAR STAGE */}
      <div className="relative h-[280px] flex items-center justify-center mb-2">
        <div className="absolute w-56 h-56 bg-white/10 rounded-full blur-[70px]" />
        
        <div 
          className="relative z-10 transition-transform duration-700 ease-out" 
          style={{ transform: `scale(${Math.min(1.3, 1 + (stats.level * 0.012))})` }}
        >
          {/* Simple Avatar Circle */}
          <div 
            className="w-52 h-52 rounded-full flex items-center justify-center shadow-2xl"
            style={{ backgroundColor: getAvatarColor() }}
          >
            <span className="text-6xl">
              {avatarConfig.mood === 'happy' && '😊'}
              {avatarConfig.mood === 'sad' && '😢'}
              {avatarConfig.mood === 'calm' && '😌'}
              {avatarConfig.mood === 'excited' && '🤩'}
              {avatarConfig.mood === 'tired' && '😴'}
              {avatarConfig.mood === 'neutral' && '😐'}
            </span>
          </div>
          
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-2xl border border-pink-50 flex items-center gap-1.5 whitespace-nowrap">
             <span className="text-[15px] font-black text-slate-800 tracking-tight">Level {stats.level}</span>
          </div>
        </div>
      </div>

      {/* GROWTH AREA */}
      <div className="px-6 space-y-4 pb-32">
        
        {/* PROGRESS CARD */}
        <div className="bg-white/95 backdrop-blur-3xl rounded-[34px] p-7 shadow-xl border border-white/40">
           <div className="flex justify-between items-end mb-4">
              <span className="text-[14px] font-bold text-slate-800 tracking-tight">
                {progressPercent > 80 ? 'Almost there!' : `So close to Level ${stats.level + 1}`}
              </span>
           </div>
           
           <div className="h-5 bg-slate-100/80 rounded-full p-1 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#FF9B6A] to-[#EC4899] rounded-full relative transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              >
                 <div className="absolute top-0 left-0 w-full h-[35%] bg-white/25 rounded-full" />
              </div>
           </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/90 backdrop-blur-2xl rounded-[30px] p-6 border border-white/50 shadow-md flex flex-col items-center justify-center text-center active:scale-95 transition-transform">
              <div className="text-[26px] mb-2">🎯</div>
              <h4 className="text-[16px] font-black text-slate-800 leading-tight">{stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Streak</p>
           </div>

           <div className="bg-white/90 backdrop-blur-2xl rounded-[30px] p-6 border border-white/50 shadow-md flex flex-col items-center justify-center text-center active:scale-95 transition-transform">
              <div className="text-[26px] mb-2">✨</div>
              <h4 className="text-[16px] font-black text-slate-800 leading-tight">{stats.totalWins} {stats.totalWins === 1 ? 'Win' : 'Wins'}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Growth</p>
           </div>
        </div>

        {/* RECENT WINS */}
        <div className="bg-white/95 backdrop-blur-3xl rounded-[34px] p-7 shadow-xl border border-white/40">
           <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-[#EC4899] shadow-sm">
                <Trophy size={18} strokeWidth={2.5} />
              </div>
              <h3 className="text-[18px] font-black text-slate-800 tracking-tight">Recent Wins</h3>
           </div>
           
           <div className="space-y-3.5">
              {wins.length > 0 ? (
                wins.slice(0, 5).map((win, i) => {
                  const date = win.timestamp?.seconds ? new Date(win.timestamp.seconds * 1000) : new Date();
                  const dateString = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  
                  return (
                    <div key={win.id || i} className="flex items-center gap-4 p-4 rounded-[24px] bg-slate-50/50 border border-slate-100/50 active:bg-slate-100 transition-all">
                       <div className="text-[22px] drop-shadow-sm">{win.icon}</div>
                       <div className="flex-1">
                          <h5 className="text-[14px] font-bold text-slate-800 leading-tight">{win.label}</h5>
                          <p className="text-[11px] text-slate-400 font-medium">{dateString}</p>
                       </div>
                       <div className="px-2.5 py-1 rounded-full bg-pink-100/50 text-pink-600 text-[10px] font-black">
                          +{win.xp}
                       </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <p className="text-slate-400 font-bold text-[13px]">No wins yet. Let's grow together!</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Reflect;
