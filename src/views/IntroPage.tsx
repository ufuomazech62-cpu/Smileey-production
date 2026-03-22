'use client';

import React from 'react';

interface IntroPageProps {
  onContinue: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onContinue }) => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/dfbh21zqc/video/upload/5937425-uhd_2160_3840_24fps_hxm5wq.mp4"
      />

      {/* Bottom Widget */}
      <div className="absolute bottom-8 left-8 right-8 md:left-16 md:right-auto md:max-w-md z-10 p-6 rounded-xl bg-[#f5496c] shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
        
        <div className="relative">
          <h3 className="text-base font-display font-bold mb-4 text-white leading-relaxed">
            Your AI Beauty Companion – Scan your face, get a personalized routine and product matches for your skin and hair type.
          </h3>
          <button
            onClick={onContinue}
            className="px-6 py-3 font-bold uppercase tracking-tighter bg-white text-[#f5496c]"
            style={{
              clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}
          >
            Yes, let's cook
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
