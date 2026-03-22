'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserMode, AppView, UserProfile } from '@/types';
import StatsRow from '@/features/dashboard/StatsRow';
import QuickActions from '@/features/dashboard/QuickActions';
import RecommendedFeed from '@/features/dashboard/RecommendedFeed';
import Sidebar from '@/features/dashboard/Sidebar';
import Logo from '@/components/ui/Logo';
import { getCurrentUser } from '@/services/authService';

interface DashboardProps {
  userMode: UserMode;
  changeView: (view: AppView) => void;
  setNavVisible: (visible: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ changeView, setNavVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize all profile data from localStorage
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('divinity_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved) as UserProfile;
      } catch (e) { return null; }
    }
    return null;
  });

  const userName = profileData?.name || '';
  const streak = profileData?.streak || 0;
  const minutes = profileData?.xp ? Math.floor(profileData.xp / 5) : 0;

  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  });
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const TOP_BAR_HEIGHT = 100; 
  const EXPANDED_TOP_SPACING = 32; 
  const SHEET_OFFSET = 215; 

  useEffect(() => {
    setNavVisible(!isSidebarOpen);
  }, [isSidebarOpen, setNavVisible]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isHandle = target.closest('.drag-handle') || target.closest('.sheet-header');
    if (!isHandle && isOpen && contentRef.current && contentRef.current.scrollTop > 0) return;

    if (sheetRef.current) {
      const style = window.getComputedStyle(sheetRef.current);
      const matrix = new (window as any).WebKitCSSMatrix(style.transform);
      dragInfo.current.currentTranslate = matrix.m42;
      sheetRef.current.style.transition = 'none';
    }

    dragInfo.current.isDragging = true;
    dragInfo.current.startY = e.touches[0].clientY;
    dragInfo.current.startTime = Date.now();
  };

  const dragInfo = useRef({
    startY: 0,
    currentTranslate: isOpen ? 0 : SHEET_OFFSET,
    startTime: 0,
    isDragging: false
  });

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragInfo.current.isDragging || !sheetRef.current) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragInfo.current.startY;
    let newTranslate = dragInfo.current.currentTranslate + deltaY;
    
    if (newTranslate < 0) {
      const overshoot = -newTranslate;
      newTranslate = -(15 * Math.log10(1 + overshoot/15)); 
    }
    if (newTranslate > SHEET_OFFSET) {
      const overshoot = newTranslate - SHEET_OFFSET;
      newTranslate = SHEET_OFFSET + (15 * Math.log10(1 + overshoot/15));
    }

    sheetRef.current.style.transform = `translateY(${newTranslate}px)`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragInfo.current.isDragging || !sheetRef.current) return;
    dragInfo.current.isDragging = false;
    
    const currentY = e.changedTouches[0].clientY;
    const totalDelta = currentY - dragInfo.current.startY;
    const deltaTime = Date.now() - dragInfo.current.startTime;
    const velocity = Math.abs(totalDelta / deltaTime);

    const style = window.getComputedStyle(sheetRef.current);
    const matrix = new (window as any).WebKitCSSMatrix(style.transform);
    const currentTranslate = matrix.m42;

    const velocityThreshold = 0.4;
    let nextOpenState = isOpen;

    if (velocity > velocityThreshold) {
      if (totalDelta > 0) nextOpenState = false;
      else nextOpenState = true;
    } else {
      if (currentTranslate < (SHEET_OFFSET / 2)) nextOpenState = true;
      else nextOpenState = false;
    }

    setIsOpen(nextOpenState);
    sheetRef.current.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
    sheetRef.current.style.transform = nextOpenState ? 'translateY(0px)' : `translateY(${SHEET_OFFSET}px)`;
  };

  const handleSignOut = () => {
    localStorage.removeItem('divinity_user_profile');
    changeView(AppView.AUTH);
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-transparent font-sans">
      
      <div className="absolute top-0 left-0 w-full h-[40%] overflow-hidden">
        <div 
          className="relative w-full px-6 flex justify-between items-center"
          style={{ height: `${TOP_BAR_HEIGHT}px` }}
        >
            <div className="-ml-2">
              <Logo variant="white" className="h-10" />
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-sm active:scale-95 transition-transform"
            >
               <div className="flex flex-col gap-[3px] items-end">
                  <div className="w-4 h-[2px] bg-current rounded-full" />
                  <div className="w-2.5 h-[2px] bg-current rounded-full" />
                  <div className="w-4 h-[2px] bg-current rounded-full" />
               </div>
            </button>
        </div>

        <div className="px-10 mt-14 transition-all duration-700 animate-in fade-in slide-in-from-top-4">
           <h1 className="text-white flex flex-col">
             <span className="block font-medium text-[20px] tracking-[0.05em] uppercase leading-none opacity-80 mb-2">{greeting}</span>
             <span className="block font-bold text-[40px] leading-[0.85] -ml-1 tracking-[-0.04em] drop-shadow-md truncate max-w-[90%]">{userName || 'Friend'}</span>
           </h1>
        </div>
      </div>

      <div 
        ref={sheetRef}
        className="absolute left-0 right-0 bottom-0 z-40 bg-white rounded-t-[32px] shadow-[0_-12px_40px_rgba(0,0,0,0.06)] flex flex-col will-change-transform"
        style={{ 
            height: `calc(100% - ${EXPANDED_TOP_SPACING}px)`, 
            transform: isOpen ? 'translateY(0px)' : `translateY(${SHEET_OFFSET}px)`,
            transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)'
        }}
      >
          <div 
            className="drag-handle w-full flex flex-col items-center pt-4 pb-2 bg-white cursor-pointer rounded-t-[32px] flex-shrink-0 z-50 select-none"
            style={{ touchAction: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          >
             <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          <div 
            ref={contentRef}
            className={`flex-1 w-full relative bg-white no-scrollbar overflow-y-auto overscroll-none`}
            onScroll={(e) => {
              const target = e.target as HTMLDivElement;
              if (target.scrollTop > 10 && !isOpen) {
                setIsOpen(true);
              }
            }}
          >
            <div className="pb-32 flex flex-col gap-5 pt-2">
                <StatsRow streak={streak} minutes={minutes} />
                <QuickActions changeView={changeView} />
                <RecommendedFeed />
            </div>
          </div>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default Dashboard;
