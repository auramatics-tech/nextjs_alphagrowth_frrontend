import React from 'react';

const AlphaGrowthLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L30 16L16 30L2 16L16 2Z" fill="black"/>
    <path d="M16 6L26 16L16 26L6 16L16 6Z" fill="white"/>
    <path d="M16 10L22 16L16 22L10 16L16 10Z" fill="black"/>
    <path d="M16 12L20 16L16 20L12 16L16 12Z" fill="white"/>
  </svg>
);

export const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <AlphaGrowthLogo />
            <span className="text-xl font-semibold text-gray-900">AlphaGrowth</span>
          </div>
        </div>
      </div>
    </header>
  );
};
