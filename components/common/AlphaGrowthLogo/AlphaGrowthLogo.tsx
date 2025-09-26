import React from 'react';

interface AlphaGrowthLogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showText?: boolean;
  className?: string;
  isCollapsed?: boolean;
}

const AlphaGrowthLogo: React.FC<AlphaGrowthLogoProps> = ({
  size = 'md',
  color = 'text-[#1E1E1E]',
  showText = true,
  className = '',
  isCollapsed = false,
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg className={`${sizeClasses[size]} ${color}`} viewBox="0 0 100 87" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          {[
            { x: 37.5, y: 0 },
            { x: 25, y: 21.75 },
            { x: 50, y: 21.75 },
            { x: 12.5, y: 43.5 },
            { x: 37.5, y: 43.5 },
            { x: 62.5, y: 43.5 },
            { x: 0, y: 65.25 },
            { x: 25, y: 65.25 },
            { x: 50, y: 65.25 },
            { x: 75, y: 65.25 },
          ].map((pos, i) => (
            <path key={i} d="M 12.5, 0 L 25, 21.75 H 0 Z" transform={`translate(${pos.x} ${pos.y})`} />
          ))}
        </g>
      </svg>
      {showText && !isCollapsed && (
        <span className={`font-bold ${textSizeClasses[size]} ${color}`}>
          AlphaGrowth
        </span>
      )}
    </div>
  );
};

export default AlphaGrowthLogo;







