import React from 'react';
import AlphaGrowthLogo from '../../common/AlphaGrowthLogo';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`w-full bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <AlphaGrowthLogo />
        </div>
      </div>
    </header>
  );
};

export default Header;








