import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('_token');
    if (token) {
      config.headers['login-jwt'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface GTMGoal {
  id: string;
  gtmName: string;
  mainObjectives: string;
  targetCount: string;
  keyCustomerPainPoint: string;
  coreValueProposition: string;
  gtmDuration: string;
  created_at?: string;
  updated_at?: string;
  lastActivity?: string;
}

export interface GTMListResponse {
  success: boolean;
  data: GTMGoal[];
  message?: string;
}

export interface GTMDetailResponse {
  success: boolean;
  data: GTMGoal;
  message?: string;
}

export interface CreateGTMRequest {
  gtmName: string;
  mainObjectives: string;
  targetCount: string;
  keyCustomerPainPoint: string;
  coreValueProposition: string;
  gtmDuration: string;
}

// API Functions
export const gtmService = {
  // Get GTM list
  async getGTMList(): Promise<GTMListResponse> {
    try {
      const response = await apiClient.get('/pub/v1/gtm/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching GTM list:', error);
      throw error;
    }
  },

  // Get GTM by ID
  async getGTMById(gtmId: string): Promise<GTMDetailResponse> {
    try {
      const response = await apiClient.get(`/pub/v1/gtm/list/${gtmId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching GTM by ID:', error);
      throw error;
    }
  },

  // Update GTM
  async updateGTM(gtmData: any): Promise<any> {
    try {
      const response = await apiClient.post('/pub/v1/onboarding/update-gtm', gtmData);
      return response.data;
    } catch (error) {
      console.error('Error updating GTM:', error);
      throw error;
    }
  },

  // Get GTM strategies (from onboarding endpoint)
  async getGTMStrategies(): Promise<any> {
    try {
      const token = localStorage.getItem('_token');
      const response = await apiClient.get('/pub/v1/onboarding/gtm-strategies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching GTM strategies:', error);
      throw error;
    }
  },

  // Create new GTM goal
  async createGTMGoal(gtmData: CreateGTMRequest): Promise<any> {
    try {
      const response = await apiClient.post('/pub/v1/gtm/create', gtmData);
      return response.data;
    } catch (error) {
      console.error('Error creating GTM goal:', error);
      throw error;
    }
  },

  // Delete GTM goal
  async deleteGTMGoal(gtmId: string): Promise<any> {
    try {
      const response = await apiClient.delete(`/pub/v1/gtm/${gtmId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting GTM goal:', error);
      throw error;
    }
  }
};