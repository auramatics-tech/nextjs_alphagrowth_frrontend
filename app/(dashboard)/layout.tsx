'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/MainLayout';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { usePageTitle } from '../../hooks';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pageTitle = usePageTitle();
  const router = useRouter();
  const { isAuthenticated, isLoading, token, user, status, error } = useAuth();

  // Initialize authentication on mount (similar to frontend_old PrivateRoute)
  useEffect(() => {
    // Debug authentication state
    console.log('Auth State Debug:', {
      token: token ? 'Present' : 'Missing',
      user: user ? 'Present' : 'Missing',
      isAuthenticated,
      isLoading,
      status,
      error
    });
    
    // If we have a token but no user data and status is idle, fetch profile
    if (token && !user && status === 'idle') {
      console.log('Initializing authentication - fetching profile...');
      // The fetchProfile will be called by the useAuth hook
    }
  }, [token, user, status, isAuthenticated, isLoading, error]);

  // Redirect to login if not authenticated (but wait for loading to complete)
  useEffect(() => {
    // Only redirect if we're not loading and definitely not authenticated
    if (!isLoading && !isAuthenticated && !token) {
      console.log("Not authenticated and no token, redirecting to login...");
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, token, router]);

  // Handle authentication errors
  useEffect(() => {
    if (error && !isLoading) {
      console.log("Authentication error, redirecting to login...", error);
      router.push('/login');
    }
  }, [error, isLoading, router]);

  // Show loading while checking authentication or fetching profile
  if (isLoading || (token && !user && status !== 'error')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF6B2C]"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  // Default header actions for all dashboard pages
  const headerActions = (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search for anything..." 
          className="w-64 h-10 pl-10 pr-4 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-orange-500" 
        />
      </div>
      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
        <Bell size={20} />
      </button>
      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
        <HelpCircle size={20} />
      </button>
    </div>
  );

  return (
    <MainLayout title={pageTitle} headerActions={headerActions}>
      {children}
    </MainLayout>
  );
}
