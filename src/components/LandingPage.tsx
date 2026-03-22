'use client';

import React from 'react';

const SmileeyLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#f5496c" />
    <circle cx="35" cy="40" r="8" fill="white" />
    <circle cx="65" cy="40" r="8" fill="white" />
    <path d="M30 65 Q50 85 70 65" stroke="white" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/dfbh21zqc/video/upload/5936527-uhd_2160_3840_24fps_jncvyy.mp4"
      />

      {/* Header */}
      <nav className="absolute top-0 left-0 w-full p-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <SmileeyLogo />
          <span className="text-2xl font-display font-bold tracking-tight uppercase">Smileey</span>
        </div>
        <div className="flex items-center gap-8 text-sm uppercase tracking-tighter">
        </div>
      </nav>

      {/* Bottom Widget */}
      <div className="absolute bottom-8 left-8 md:left-16 z-10 p-6 rounded-xl border border-white/12 backdrop-blur-[40px] backdrop-saturate-[180%] bg-white/5 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <h3 className="text-base font-display font-bold mb-4 text-white">Scan your face. Get a personalized routine and product matches for your skin and hair type.</h3>
        <button
          onClick={onGetStarted}
          className="px-6 py-3 font-bold uppercase tracking-tighter bg-[#f5496c] text-white"
          style={{
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
