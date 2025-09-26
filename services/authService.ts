import { apiClient } from '../lib/apiClient';
import Cookies from 'js-cookie';

// --- Types ---
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  status?: number;
  created_at: string;
  updated_at: string;
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
      return response.data;
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
      return response.data;
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
      return response.data.data || response.data;
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
      return response.data.data || response.data;
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
    return localStorage.getItem('_token') || Cookies.get('_token');
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