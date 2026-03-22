'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  textClass?: string;
  variant?: 'white' | 'dark' | 'gradient' | 'red';
  hideText?: boolean;
  disableAnimation?: boolean;
  strokeWidth?: number;
  solid?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = 'h-8 w-auto', 
  textClass = '', 
  variant = 'white', 
  hideText = false,
  disableAnimation = false,
  strokeWidth = 13,
  solid = false
}) => {
  const getTextColor = () => {
    switch (variant) {
      case 'dark':
        return 'text-slate-900';
      case 'gradient':
        return 'bg-clip-text text-transparent bg-gradient-to-br from-[#f5496c] to-[#FF6B4A]';
      case 'red':
        return 'text-[#f5496c]';
      default:
        return 'text-white';
    }
  };

  const getLogoColor = () => {
    if (variant === 'white') return 'white';
    return '#f5496c';
  };

  // For white variant: white circle with branding color eyes/smile
  // For other variants: branding color circle with white eyes/smile
  const getFeatureColor = () => {
    if (variant === 'white') return '#f5496c';
    return 'white';
  };

  return (
    <div className={`flex items-center gap-[6px] select-none ${className}`}>
      {/* Smileey Icon */}
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        <circle cx="50" cy="50" r="45" fill={getLogoColor()} />
        <circle cx="35" cy="40" r="8" fill={getFeatureColor()} />
        <circle cx="65" cy="40" r="8" fill={getFeatureColor()} />
        <path d="M30 65 Q50 85 70 65" stroke={getFeatureColor()} strokeWidth="8" strokeLinecap="round" />
      </svg>
      
      {/* Text */}
      {!hideText && (
        <span 
          className={`
            font-display font-bold leading-none tracking-tight uppercase
            flex items-center
            ${getTextColor()}
            ${textClass || 'text-[20px]'} 
          `}
        >
          Smileey
        </span>
      )}
    </div>
  );
};

export default Logo;
