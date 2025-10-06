import { apiClient } from '../lib/apiClient';
import Cookies from 'js-cookie';

// --- Types ---
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  status?: number;
  createdAt: string;
  updatedAt: string;
  // Add other user fields as needed
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  // Add other signup fields as needed
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  data?: {
    user: UserProfile;
    token: string;
  };
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// --- Auth Service ---
export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/pub/v1/onboarding/login', credentials);
      const data = response.data;
      
      // Transform snake_case to camelCase
      if (data.user) {
        data.user = {
          ...data.user,
          role: (data.user.role as 'admin' | 'user') || 'user',
          createdAt: data.user.created_at || data.user.createdAt || new Date().toISOString(),
          updatedAt: data.user.updated_at || data.user.updatedAt || new Date().toISOString()
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * Signup user
   */
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/pub/v1/onboarding/register', data);
      const responseData = response.data;
      
      // Transform snake_case to camelCase
      if (responseData.user) {
        responseData.user = {
          ...responseData.user,
          role: (responseData.user.role as 'admin' | 'user') || 'user',
          createdAt: responseData.user.created_at || responseData.user.createdAt || new Date().toISOString(),
          updatedAt: responseData.user.updated_at || responseData.user.updatedAt || new Date().toISOString()
        };
      }
      
      return responseData;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  /**
   * Get user profile (my_profile API) - used by Redux
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get('/pub/v1/auth/my-profile');
      const data = response.data.data || response.data;
      
      // Transform snake_case to camelCase
      return {
        ...data,
        role: (data.role as 'admin' | 'user') || 'user',
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        updatedAt: data.updated_at || data.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Get user profile (my_profile API) - alternative method
   */
  getMyProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get('/pub/v1/auth/my-profile');
      const data = response.data.data || response.data;
      
      // Transform snake_case to camelCase
      return {
        ...data,
        role: (data.role as 'admin' | 'user') || 'user',
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        updatedAt: data.updated_at || data.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('_token') || Cookies.get('_token');
    return !!token;
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('_token') || Cookies.get('_token') || null;
  },

  /**
   * Store authentication token
   */
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('_token', token);
  },

  /**
   * Remove authentication token
   */
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('_token');
    Cookies.remove('_token');
  },

  /**
   * Logout user
   */
  logout: (): void => {
    authService.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  /**
   * Validate token by calling my_profile API
   */
  validateToken: async (): Promise<UserProfile | null> => {
    try {
      if (!authService.isAuthenticated()) {
        return null;
      }
      return await authService.getMyProfile();
    } catch (error) {
      console.error('Token validation failed:', error);
      authService.removeToken();
      return null;
    }
  }
};

export default authService;