'use client';

import React from 'react';
import { AppView } from '@/types';
import { Home, Scan, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none font-sans">
      {/* Premium Floating White Background Bar */}
      <div className="w-full bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 px-12 flex justify-between items-center pointer-events-auto rounded-t-[32px]">

        {/* HOME BUTTON */}
        <button
          onClick={() => onChangeView(AppView.DASHBOARD)}
          className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform flex-1"
        >
          <div className={`transition-all duration-300 ${currentView === AppView.DASHBOARD ? 'text-[#f5496c] scale-110' : 'text-slate-300'}`}>
            <Home size={26} strokeWidth={2.5} />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${currentView === AppView.DASHBOARD ? 'text-[#f5496c]' : 'text-slate-400'}`}>
            Home
          </span>
        </button>

        {/* CENTER ACTION BUTTON - AI CHAT ICON */}
        <button
          onClick={() => onChangeView(AppView.COMPANION)}
          className="-mt-12 group relative active:scale-90 transition-transform outline-none flex-1 flex justify-center"
        >
          <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-tr from-[#f5496c] to-[#E8445F] p-1 shadow-2xl shadow-[#f5496c]/50">
             <div className="w-full h-full rounded-full border-[3px] border-white/90 flex items-center justify-center bg-transparent">
                <MessageCircle size={28} className="text-white" strokeWidth={2.5} fill="white" fillOpacity="0.2" />
             </div>
          </div>
        </button>

        {/* SCAN BUTTON */}
        <button
          onClick={() => onChangeView(AppView.HEAL)}
          className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform flex-1"
        >
          <div className={`transition-all duration-300 ${currentView === AppView.HEAL ? 'text-[#f5496c] scale-110' : 'text-slate-300'}`}>
            <Scan size={26} strokeWidth={2.5} />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${currentView === AppView.HEAL ? 'text-[#f5496c]' : 'text-slate-400'}`}>
            Scan
          </span>
        </button>

      </div>
    </div>
  );
};

export default Navigation;
