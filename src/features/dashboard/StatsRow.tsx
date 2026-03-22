'use client';

import React from 'react';

interface StatsRowProps {
  streak: number;
  minutes: number;
}

const StatsRow: React.FC<StatsRowProps> = () => {
  return (
    <div className="px-6 mb-2 mt-1 pointer-events-auto font-sans">
      <div className="w-full flex items-center gap-5 bg-white rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none">
        
        <div className="relative flex-shrink-0">
          <div className="w-13 h-13 rounded-2xl bg-orange-50/40 flex items-center justify-center relative overflow-hidden">
            <svg 
              viewBox="0 0 24 24" 
              className="w-10 h-10 relative z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="wellness-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFB084" />
                  <stop offset="100%" stopColor="#FF6EAE" />
                </linearGradient>
              </defs>
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill="url(#wellness-grad)" 
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[17px] font-medium text-slate-800 leading-[1.3] tracking-tight">
            The smartest way to care for your <span className="text-orange-500">skin</span> and hair
          </p>
        </div>

      </div>
    </div>
  );
};

export default StatsRow;
