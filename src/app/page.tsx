'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { AppView, UserProfile, UserMode } from '@/types';
import LandingPage from '@/components/LandingPage';
import IntroPage from '@/views/IntroPage';
import Auth from '@/views/Auth';
import Onboarding from '@/views/Onboarding';
import Dashboard from '@/views/Dashboard';
import Reflect from '@/views/Reflect';
import Heal from '@/views/Heal';
import Companion from '@/views/Companion';
import Navigation from '@/components/layout/Navigation';
import Logo from '@/components/ui/Logo';

export default function Home() {
  const userMode = UserMode.CHILD;
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [theme, setTheme] = useState('sunset');
  const [loading, setLoading] = useState(false);

  // Initialize on mount - this runs once on client
  useEffect(() => {
    setMounted(true);
    
    // Get initial view from localStorage (mock mode - no Firebase)
    const savedProfile = localStorage.getItem('divinity_user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as UserProfile;
        if (profile.onboardingComplete) {
          setCurrentView(AppView.DASHBOARD);
        }
      } catch (e) {
        console.error("Error parsing saved profile:", e);
      }
    }
  }, []);

  // Update nav visibility based on view
  useEffect(() => {
    if (currentView === AppView.DASHBOARD || currentView === AppView.REFLECT || currentView === AppView.HEAL) {
      setIsNavVisible(true);
    } else if (currentView === AppView.COMPANION) {
      setIsNavVisible(false);
    } else {
      setIsNavVisible(false);
    }
  }, [currentView]);

  const handleGetStarted = () => {
    // Check if user has already completed onboarding
    const savedProfile = localStorage.getItem('divinity_user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as UserProfile;
        if (profile.onboardingComplete) {
          setCurrentView(AppView.DASHBOARD);
          return;
        }
      } catch (e) {}
    }
    
    // Go to intro page first
    setCurrentView(AppView.INTRO);
  };

  const handleIntroContinue = () => {
    // Go to auth page after intro
    setCurrentView(AppView.AUTH);
  };

  const handleLoginSuccess = () => {
    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem('divinity_user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as UserProfile;
        if (profile.onboardingComplete) {
          setCurrentView(AppView.DASHBOARD);
          return;
        }
      } catch (e) {}
    }
    setCurrentView(AppView.ONBOARDING);
  };

  const handleOnboardingComplete = () => {
    setCurrentView(AppView.DASHBOARD);
  };

  const renderView = () => {
    if (!mounted || loading) {
      return (
        <div 
          className="flex flex-col items-center justify-center h-full w-full min-h-screen"
          style={{ background: 'linear-gradient(135deg, #f5496c 0%, #E8445F 50%, #D63D56 100%)' }}
        >
          <div className="animate-pulse">
            <Logo variant="white" className="h-16" />
          </div>
        </div>
      );
    }

    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage onGetStarted={handleGetStarted} />;
      case AppView.INTRO:
        return <IntroPage onContinue={handleIntroContinue} />;
      case AppView.AUTH:
        return <Auth onLogin={handleLoginSuccess} />;
      case AppView.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case AppView.DASHBOARD:
        return <Dashboard userMode={userMode} changeView={setCurrentView} setNavVisible={setIsNavVisible} />;
      case AppView.REFLECT:
        return <Reflect userMode={userMode} />;
      case AppView.HEAL:
        return <Heal userMode={userMode} setNavVisible={setIsNavVisible} />;
      case AppView.COMPANION:
        return <Companion userMode={userMode} changeView={setCurrentView} setNavVisible={setIsNavVisible} />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  const themeGradients: Record<string, string> = {
    sunset: 'linear-gradient(135deg, #f5496c 0%, #E8445F 50%, #D63D56 100%)',
    ocean: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #1D4ED8 100%)',
    garden: 'linear-gradient(135deg, #6EE7B7 0%, #10B981 50%, #047857 100%)',
    lavender: 'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 50%, #6D28D9 100%)'
  };

  // Landing page has its own background
  if (currentView === AppView.LANDING && mounted) {
    return (
      <main className="min-h-screen">
        {renderView()}
      </main>
    );
  }

  // Intro page has its own dark background
  if (currentView === AppView.INTRO && mounted) {
    return (
      <main className="min-h-screen h-screen">
        {renderView()}
      </main>
    );
  }

  // Auth page has its own glass background
  if (currentView === AppView.AUTH && mounted) {
    return (
      <main className="min-h-screen h-screen">
        {renderView()}
      </main>
    );
  }

  // Onboarding page has its own glass background
  if (currentView === AppView.ONBOARDING && mounted) {
    return (
      <main className="min-h-screen h-screen">
        {renderView()}
      </main>
    );
  }

  // App views with gradient background
  return (
    <main 
      className="relative min-h-[100dvh] w-full font-sans overflow-hidden text-slate-800 selection:bg-orange-200 transition-all duration-1000 ease-in-out antialiased"
      style={{
        background: themeGradients[theme] || themeGradients.sunset
      }}
    >
      {/* Premium Grain Texture & Background Effects */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay bg-noise" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)] border-x border-white/5 h-screen">
        {renderView()}
      </div>

      {isNavVisible && (
        <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}
    </main>
  );
}
