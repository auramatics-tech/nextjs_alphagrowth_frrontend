'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B2C] mx-auto mb-4"></div>
        <p className="text-gray-600">Authenticating...</p>
      </div>
    </div>
  )
}) => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || error) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;





