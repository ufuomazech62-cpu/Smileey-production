'use client';

import React from 'react';
import { Scan, Trophy, Sparkles } from 'lucide-react';
import { AppView } from '@/types';

interface QuickActionsProps {
  changeView: (view: AppView) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ changeView }) => {
  return (
    <div className="mb-2 w-full font-sans">
      <div className="grid grid-cols-3 gap-3 px-6 pb-2 w-full">
          
          {/* CARD 1: Face Scan */}
          <button 
            onClick={() => changeView(AppView.HEAL)}
            className="relative w-full h-[160px] rounded-[28px] overflow-hidden shadow-sm shadow-orange-100/30 transition-transform active:scale-95 outline-none flex flex-col"
          >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5496c] to-[#E8445F]" /> 
              <div className="absolute inset-0 opacity-[0.08] bg-noise mix-blend-overlay" />
              
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Scan size={16} strokeWidth={2.5} />
              </div>
              
              <div className="absolute top-[60px] left-4 text-white text-left">
                 <div className="text-[14px] font-medium leading-tight tracking-tight">Face</div>
                 <div className="text-[14px] font-medium leading-tight tracking-tight">Scan</div>
              </div>

              <div className="absolute bottom-4 left-3 right-3">
                 <div className="w-full py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white font-medium text-[10px] flex items-center justify-center tracking-[0.1em] uppercase">
                    Scan
                 </div>
              </div>
          </button>

          {/* CARD 2: AI Chat */}
          <button 
            onClick={() => changeView(AppView.COMPANION)}
            className="relative w-full h-[160px] rounded-[28px] overflow-hidden shadow-sm shadow-pink-100/30 transition-transform active:scale-95 outline-none flex flex-col"
          >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5496c] to-[#D63D56]" />
              <div className="absolute inset-0 opacity-[0.08] bg-noise mix-blend-overlay" />
              
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Sparkles size={16} strokeWidth={2.5} fill="white" fillOpacity="0.3" />
              </div>

              <div className="absolute top-[60px] left-4 text-white text-left">
                 <div className="text-[14px] font-medium leading-tight tracking-tight">AI</div>
                 <div className="text-[14px] font-medium leading-tight tracking-tight">Chat</div>
              </div>

              <div className="absolute bottom-4 left-3 right-3">
                 <div className="w-full py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white font-medium text-[10px] flex items-center justify-center tracking-[0.1em] uppercase">
                    CHAT
                 </div>
              </div>
          </button>

          {/* CARD 3: My Progress */}
          <button 
            onClick={() => changeView(AppView.REFLECT)}
            className="relative w-full h-[160px] rounded-[28px] overflow-hidden shadow-sm shadow-orange-50 transition-transform active:scale-95 outline-none flex flex-col"
          >
              <div className="absolute inset-0 bg-gradient-to-br from-[#E8445F] to-[#f5496c]" />
              <div className="absolute inset-0 opacity-[0.08] bg-noise mix-blend-overlay" />
              
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Trophy size={15} strokeWidth={2.5} />
              </div>
              
              <div className="absolute top-[60px] left-4 text-white text-left">
                 <div className="text-[14px] font-medium leading-tight tracking-tight">My</div>
                 <div className="text-[14px] font-medium leading-tight tracking-tight">Progress</div>
              </div>

              <div className="absolute bottom-4 left-3 right-3">
                 <div className="w-full py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white font-medium text-[10px] flex items-center justify-center tracking-[0.1em] uppercase">
                    View
                 </div>
              </div>
          </button>

      </div>
    </div>
  );
};

export default QuickActions;
