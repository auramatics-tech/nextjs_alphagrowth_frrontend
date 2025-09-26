'use client';

import { usePathname } from 'next/navigation';

export const usePageTitle = () => {
  const pathname = usePathname();
  
  const getTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/campaigns':
        return 'Campaigns';
      case '/login':
        return 'Sign In';
      case '/signup':
        return 'Sign Up';
      default:
        return 'Dashboard';
    }
  };

  return getTitle();
};
