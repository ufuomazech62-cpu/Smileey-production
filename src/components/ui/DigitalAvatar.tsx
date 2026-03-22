'use client';

// DigitalAvatar component - animated avatar with accessories
import React, { useState, useEffect, useRef } from 'react';
import { AvatarConfig } from '@/types';

interface DigitalAvatarProps {
  config: AvatarConfig;
  className?: string;
  onInteract?: () => void;
  mini?: boolean; // New prop for efficient small rendering
  forceAnimate?: boolean; // New prop to enable animations even in mini mode
}

const DigitalAvatar: React.FC<DigitalAvatarProps> = ({ config, className = '', onInteract, mini = false, forceAnimate = false }) => {
  const { color, mood, accessory } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Live State
  const [facePos, setFacePos] = useState({ x: 0, y: 0 });
  const [idleOffset, setIdleOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSquished, setIsSquished] = useState(false);
  const [reactionMood, setReactionMood] = useState<string | null>(null);

  const shouldAnimate = !mini || forceAnimate;

  // 1. Autonomous Blinking Engine
  useEffect(() => {
    if (!shouldAnimate) return; 

    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Blink duration
      // Randomize next blink (between 2s and 6s)
      const nextBlink = Math.random() * 4000 + 2000;
      setTimeout(blinkLoop, nextBlink);
    };
    const timeoutId = setTimeout(blinkLoop, 2000);
    return () => clearTimeout(timeoutId);
  }, [shouldAnimate]);

  // 2. Autonomous Idle Engine (Looking Around)
  useEffect(() => {
    if (!shouldAnimate) return;

    const lookAroundLoop = () => {
      if (!isHovering) {
        // Randomize gaze direction slightly to simulate "thinking" or "observing"
        const rX = (Math.random() - 0.5) * 15; // -7.5 to 7.5
        const rY = (Math.random() - 0.5) * 8;  // -4 to 4
        setIdleOffset({ x: rX, y: rY });
      }
      
      const nextMove = Math.random() * 3000 + 1500;
      setTimeout(lookAroundLoop, nextMove);
    };
    const timeoutId = setTimeout(lookAroundLoop, 1000);
    return () => clearTimeout(timeoutId);
  }, [isHovering, shouldAnimate]);

  // 3. Face Tracking (Parallax Effect)
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if ((mini && !forceAnimate) || !containerRef.current) return;
    setIsHovering(true);
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    // Calculate normalized position (-1 to 1)
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((clientY - rect.top) / rect.height) * 2 - 1;

    // Limit the range for subtle movement
    setFacePos({ x: x * 20, y: y * 15 });
  };

  const handleLeave = () => {
    if (mini && !forceAnimate) return;
    setIsHovering(false);
    // We don't reset facePos immediately, we let the Idle Engine take over gently
    setFacePos({ x: 0, y: 0 });
  };

  // 4. Tactile Interaction (Poke)
  const handleTap = () => {
    if (mini && !forceAnimate) return;

    // Physics Squish
    setIsSquished(true);
    setTimeout(() => setIsSquished(false), 200);

    // Emotional Reaction
    setReactionMood('excited');
    setTimeout(() => setReactionMood(null), 1500);

    if (onInteract) onInteract();
  };

  // Determine active Face Position (Mouse vs Idle)
  const currentX = isHovering ? facePos.x : idleOffset.x;
  const currentY = isHovering ? facePos.y : idleOffset.y;

  // Resolve current display mood (Reaction > Configured)
  const displayMood = reactionMood || mood;

  // Color Mapping for 3D Clay Effect - PURPLE DEFAULT
  const getColorStyles = () => {
    switch (color) {
      case 'blue': return { base: '#60A5FA', shadow: '#2563EB', light: '#93C5FD' };
      case 'pink': return { base: '#F472B6', shadow: '#DB2777', light: '#FBCFE8' };
      case 'green': return { base: '#34D399', shadow: '#059669', light: '#6EE7B7' };
      case 'orange': return { base: '#FBBF24', shadow: '#D97706', light: '#FDE68A' };
      // Defaulting to Purple
      default: return { base: '#A78BFA', shadow: '#7C3AED', light: '#C4B5FD' };
    }
  };

  const c = getColorStyles();
  const sizeClasses = mini ? 'w-full h-full' : 'w-64 h-64';

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
      onClick={handleTap}
      className={`
        relative ${sizeClasses} cursor-pointer select-none
        transition-transform duration-200 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isSquished ? 'scale-90' : 'scale-100'}
        ${className}
      `}
      style={{
        perspective: '1000px', // Adds depth for 3D effect
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm overflow-visible">
        <defs>
          <radialGradient id={`bodyGrad-${color}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={c.light} />
            <stop offset="100%" stopColor={c.base} />
          </radialGradient>
          
          {/* REALISTIC MATERIALS */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="silverGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="birthdayGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="33%" stopColor="#34D399" />
            <stop offset="66%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
             <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
             <stop offset="40%" stopColor="white" stopOpacity="0.1"/>
             <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>

          {/* Advanced Clay Filter - Simplified for mini unless animated */}
          {(!mini || forceAnimate) && (
            <filter id="clay-glow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
              <feOffset dx="0" dy="4" result="offsetBlur" />
              <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".9" specularExponent="25" lightingColor="#ffffff" result="specOut">
                <fePointLight x="-5000" y="-10000" z="20000" />
              </feSpecularLighting>
              <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
              <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
            </filter>
          )}

          <filter id="glassShadow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
             <feOffset dx="1" dy="2" result="offsetblur"/>
             <feComponentTransfer>
               <feFuncA type="linear" slope="0.3"/>
             </feComponentTransfer>
             <feMerge> 
               <feMergeNode/>
               <feMergeNode in="SourceGraphic"/> 
             </feMerge>
          </filter>
        </defs>

        {/* --- BODY GROUP --- */}
        <g className={shouldAnimate ? "animate-breathe" : ""}>
            {/* Ears (Back) */}
            <circle cx="40" cy="50" r="35" fill={`url(#bodyGrad-${color})`} />
            <circle cx="160" cy="50" r="35" fill={`url(#bodyGrad-${color})`} />
            <circle cx="40" cy="50" r="15" fill={c.shadow} opacity="0.3" />
            <circle cx="160" cy="50" r="15" fill={c.shadow} opacity="0.3" />

            {/* Main Head Shape */}
            <rect x="20" y="40" width="160" height="140" rx="70" ry="70" fill={`url(#bodyGrad-${color})`} filter={(!mini || forceAnimate) ? "url(#clay-glow)" : ""} />

            {/* --- FACE GROUP --- */}
            <g 
              style={{ 
                transform: `translate(${100 + currentX}px, ${110 + currentY}px)`,
                transition: isHovering ? 'transform 0.1s ease-out' : 'transform 1s ease-in-out'
              }}
            >
              
              {/* EYES LAYER */}
              <g>
                {/* Left Eye */}
                <g transform="translate(-40, -15)">
                   {isBlinking ? (
                      <path d="M-12 0 L12 0" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
                   ) : (
                      <>
                        {(displayMood === 'happy' || displayMood === 'excited') && (
                          <path d="M-15 0 Q0 -15 15 0" stroke="#374151" strokeWidth="6" fill="none" strokeLinecap="round" />
                        )}
                        {(displayMood === 'sad' || displayMood === 'tired') && (
                          <path d="M-15 0 Q0 10 15 0" stroke="#374151" strokeWidth="6" fill="none" strokeLinecap="round" />
                        )}
                        {(displayMood === 'calm' || displayMood === 'neutral') && (
                          <>
                            <circle r="7" fill="#374151" />
                            {!mini && <circle cx="2" cy="-2" r="2.5" fill="white" />} {/* Reflection */}
                          </>
                        )}
                      </>
                   )}
                </g>

                {/* Right Eye */}
                <g transform="translate(40, -15)">
                   {isBlinking ? (
                      <path d="M-12 0 L12 0" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
                   ) : (
                      <>
                        {(displayMood === 'happy' || displayMood === 'excited') && (
                          <path d="M-15 0 Q0 -15 15 0" stroke="#374151" strokeWidth="6" fill="none" strokeLinecap="round" />
                        )}
                        {(displayMood === 'sad' || displayMood === 'tired') && (
                          <path d="M-15 0 Q0 10 15 0" stroke="#374151" strokeWidth="6" fill="none" strokeLinecap="round" />
                        )}
                        {(displayMood === 'calm' || displayMood === 'neutral') && (
                          <>
                            <circle r="7" fill="#374151" />
                            {!mini && <circle cx="2" cy="-2" r="2.5" fill="white" />}
                          </>
                        )}
                      </>
                   )}
                </g>
              </g>

              {/* CHEEKS */}
              <g opacity="0.6">
                <circle cx="-50" cy="10" r="10" fill="#F472B6" />
                <circle cx="50" cy="10" r="10" fill="#F472B6" />
              </g>

              {/* MOUTH LAYER */}
              <g transform="translate(0, 15)">
                {displayMood === 'happy' && <path d="M-18 0 Q0 18 18 0" stroke="#374151" strokeWidth="5" fill="none" strokeLinecap="round" />}
                {displayMood === 'excited' && <path d="M-15 0 Q0 20 15 0 Z" fill="#374151" />}
                {displayMood === 'sad' && <path d="M-15 10 Q0 -5 15 10" stroke="#374151" strokeWidth="5" fill="none" strokeLinecap="round" />}
                {displayMood === 'tired' && <ellipse cx="0" cy="5" rx="8" ry="10" fill="#374151" />}
                {displayMood === 'calm' && <circle cx="0" cy="5" r="5" fill="#374151" />}
                {displayMood === 'neutral' && <path d="M-10 5 L10 5" stroke="#374151" strokeWidth="5" strokeLinecap="round" />}
              </g>

              {/* Realistic Glasses (Attached to Face) */}
              {accessory === 'glasses' && (
                <g transform="translate(0, -15)">
                   <g filter="url(#glassShadow)">
                     {/* Frame Left */}
                     <path d="M-75 -5 L-35 -5 L-35 15 A 15 15 0 0 1 -75 15 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
                     {/* Frame Right */}
                     <path d="M75 -5 L35 -5 L35 15 A 15 15 0 0 0 75 15 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
                     {/* Bridge */}
                     <path d="M-35 0 Q0 -8 35 0" stroke="#0F172A" strokeWidth="3" fill="none" />
                     {/* Lenses Reflection */}
                     <path d="M-72 -2 L-38 -2 L-38 12 A 12 12 0 0 1 -72 12 Z" fill="url(#glassReflection)" />
                     <path d="M72 -2 L38 -2 L38 12 A 12 12 0 0 0 72 12 Z" fill="url(#glassReflection)" />
                   </g>
                </g>
              )}
            </g>

            {/* STATIC ACCESSORIES */}

            {/* Realistic Headphones */}
            {accessory === 'headphones' && (
                <g pointerEvents="none">
                  {/* Headband */}
                  <path d="M30 60 Q30 0 100 0 Q170 0 170 60" stroke="#334155" strokeWidth="16" fill="none" strokeLinecap="round" />
                  <path d="M30 60 Q30 0 100 0 Q170 0 170 60" stroke="url(#silverGrad)" strokeWidth="12" fill="none" strokeLinecap="round" />
                  
                  {/* Ear Cups */}
                  <g transform="translate(15, 45)">
                     <rect x="0" y="0" width="30" height="50" rx="10" fill="#1E293B" />
                     <rect x="5" y="5" width="20" height="40" rx="6" fill="#475569" />
                     <rect x="0" y="0" width="30" height="50" rx="10" fill="url(#silverGrad)" opacity="0.3" />
                  </g>
                  <g transform="translate(155, 45)">
                     <rect x="0" y="0" width="30" height="50" rx="10" fill="#1E293B" />
                     <rect x="5" y="5" width="20" height="40" rx="6" fill="#475569" />
                     <rect x="0" y="0" width="30" height="50" rx="10" fill="url(#silverGrad)" opacity="0.3" />
                  </g>
                </g>
            )}

            {/* Realistic King Crown */}
            {accessory === 'crown' && (
                <g transform="translate(50, -10)">
                  <path d="M0 45 L15 15 L35 45 L50 5 L65 45 L85 15 L100 45 L100 60 L0 60 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
                  {/* Jewels */}
                  <circle cx="50" cy="45" r="5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
                  <circle cx="15" cy="45" r="3" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1" />
                  <circle cx="85" cy="45" r="3" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1" />
                  <circle cx="50" cy="5" r="3" fill="#F59E0B" />
                </g>
            )}

            {/* Realistic Birthday Crown */}
            {accessory === 'birthday' && (
               <g transform="translate(50, -15)">
                  <path d="M0 50 L15 10 L30 50 L50 0 L70 50 L85 10 L100 50 L95 65 L5 65 Z" fill="url(#birthdayGrad)" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="50" cy="0" r="6" fill="#F472B6" />
                  <circle cx="15" cy="10" r="4" fill="#34D399" />
                  <circle cx="85" cy="10" r="4" fill="#60A5FA" />
                  {/* Confetti details */}
                  <circle cx="50" cy="30" r="3" fill="white" opacity="0.6" />
                  <circle cx="25" cy="40" r="3" fill="white" opacity="0.6" />
                  <circle cx="75" cy="40" r="3" fill="white" opacity="0.6" />
               </g>
            )}

        </g>
      </svg>
    </div>
  );
};

export default DigitalAvatar;
