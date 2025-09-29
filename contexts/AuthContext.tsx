'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, UserProfile, AuthState } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const token = authService.getToken();
      if (!token) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Validate token by fetching user profile
      const user = await authService.getMyProfile();
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Authentication initialization failed:', error);
      
      // Clear invalid token
      authService.removeToken();
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Authentication failed',
      });
    }
  };

  const login = async (token: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Store token
      authService.setToken(token);
      
      // Fetch user profile
      const user = await authService.getMyProfile();
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Clear token on failure
      authService.removeToken();
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Login failed',
      });
      
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      if (!authState.isAuthenticated) return;
      
      const user = await authService.getMyProfile();
      setAuthState(prev => ({ ...prev, user, error: null }));
    } catch (error: any) {
      console.error('Profile refresh failed:', error);
      setAuthState(prev => ({ ...prev, error: error.message }));
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;





