import React from 'react';

interface LogoProps {
  className?: string;
  textClass?: string;
  variant?: 'white' | 'dark' | 'gradient';
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
        return 'bg-clip-text text-transparent bg-gradient-to-br from-[#FF9B6A] to-[#EC4899]';
      default:
        return 'text-white';
    }
  };

  return (
    <div className={`flex items-center gap-[3px] select-none ${className}`}>
      {/* Icon */}
      <img 
        src="https://res.cloudinary.com/dfbh21zqc/image/upload/Adobe_Express_-_file_zkv8s4.png" 
        alt="Divinity Logo" 
        className="h-full w-auto object-contain block"
      />
      
      {/* Text */}
      {!hideText && (
        <span 
          className={`
            font-sans font-medium leading-none tracking-tight
            flex items-center
            ${getTextColor()}
            ${textClass || 'text-[20px]'} 
          `}
        >
          Divinity
        </span>
      )}
    </div>
  );
};

export default Logo;
