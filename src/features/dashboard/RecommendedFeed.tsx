'use client';

import React from 'react';
import { ChevronRight, Play } from 'lucide-react';

const RecommendedFeed: React.FC = () => {
  return (
    <div className="px-6 mb-10 pointer-events-auto font-sans">
      <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[20px] font-medium text-slate-900 tracking-tight">Recommended</h2>
          <button className="text-[#EC4899] text-[14px] font-bold flex items-center gap-0.5 opacity-90 hover:opacity-100 transition-opacity">
            More <ChevronRight size={14} strokeWidth={3} />
          </button>
      </div>
      
      {/* Recommendation Card 1 */}
      <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex items-center justify-between gap-5 mb-4 active:scale-[0.98] transition-all">
          <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-800 text-[16px] leading-[1.4] mb-4 line-clamp-2 tracking-tight">
                5D Journey: Spoken Affirmations for Self-Love
              </h4>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full border border-slate-100 text-slate-500 text-[11px] font-medium bg-slate-50 tracking-tight">
                  12 Min
                </span>
                <span className="px-3 py-1 rounded-full border border-pink-100/30 text-[#EC4899] text-[11px] font-bold bg-pink-50/40 tracking-tight">
                  Guided
                </span>
              </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Play size={18} fill="white" className="text-white ml-0.5" />
          </div>
      </div>

      {/* Recommendation Card 2 */}
      <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex items-center justify-between gap-5 active:scale-[0.98] transition-all">
          <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-800 text-[16px] leading-[1.4] mb-4 line-clamp-2 tracking-tight">
                532Hz Love Frequency: Deep Emotional Healing
              </h4>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full border border-slate-100 text-slate-500 text-[11px] font-medium bg-slate-50 tracking-tight">
                  15 Min
                </span>
                <span className="px-3 py-1 rounded-full border border-pink-100/30 text-[#EC4899] text-[11px] font-bold bg-pink-50/40 tracking-tight">
                  Healing
                </span>
              </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Play size={18} fill="white" className="text-white ml-0.5" />
          </div>
      </div>

    </div>
  );
};

export default RecommendedFeed;
