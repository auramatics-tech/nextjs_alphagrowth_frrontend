'use client';

import React, { useCallback } from 'react';
import AlphaGrowthLogo from '../../common/AlphaGrowthLogo';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('_token');
      localStorage.removeItem('login-jwt');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing auth tokens:', error);
    } finally {
      router.push('/login');
    }
  }, [router]);

  return (
    <header className={`w-full bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <AlphaGrowthLogo />
          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;










