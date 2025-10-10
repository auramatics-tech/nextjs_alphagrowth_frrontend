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
export interface ICP {
  id: string;
  name: string;
  title: string;
  location_city: string;
  location_country: string;
  business?: {
    companyName: string;
    industry: string;
  };
  company_targets: string;
  tech_stack_current: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICPListResponse {
  success: boolean;
  data: ICP[];
  message?: string;
}

export interface CreateICPRequest {
  name: string;
  title: string;
  location_city: string;
  location_country: string;
  business: {
    companyName: string;
    industry: string;
  };
  company_targets: string;
  tech_stack_current: string;
}

// API Functions
export const icpService = {
  // Get ICP list
  async getICPList(): Promise<ICPListResponse> {
    try {
      const response = await apiClient.get('/pub/v1/icp/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching ICP list:', error);
      throw error;
    }
  },

  // Create new ICP
  async createICP(icpData: CreateICPRequest): Promise<any> {
    try {
      const response = await apiClient.post('/pub/v1/icp/add', icpData);
      return response.data;
    } catch (error) {
      console.error('Error creating ICP:', error);
      throw error;
    }
  },

  // Update ICP
  async updateICP(id: string, icpData: Partial<CreateICPRequest>): Promise<any> {
    try {
      const response = await apiClient.put(`/pub/v1/icp/${id}`, icpData);
      return response.data;
    } catch (error) {
      console.error('Error updating ICP:', error);
      throw error;
    }
  },

  // Delete ICP
  async deleteICP(id: string): Promise<any> {
    try {
      const response = await apiClient.delete(`/pub/v1/icp/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting ICP:', error);
      throw error;
    }
  },

  // Get ICP by ID
  async getICPById(id: string): Promise<ICP> {
    try {
      const response = await apiClient.get(`/pub/v1/icp/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ICP:', error);
      throw error;
    }
  },

  // Get ICP detail for editing (from onboarding endpoint)
  async getICPDetail(icpId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/pub/v1/onboarding/icp-detail?icpId=${icpId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ICP detail:', error);
      throw error;
    }
  },

  // Update ICP (from onboarding endpoint)
  async updateICPOnboarding(icpData: any): Promise<any> {
    try {
      const response = await apiClient.post('/pub/v1/onboarding/update-icp', icpData);
      return response.data;
    } catch (error) {
      console.error('Error updating ICP:', error);
      throw error;
    }
  },

  // Create ICP (from onboarding endpoint)
  async createICPOnboarding(icpData: any): Promise<any> {
    try {
      const response = await apiClient.post('/pub/v1/onboarding/create-icp', icpData);
      return response.data;
    } catch (error) {
      console.error('Error creating ICP:', error);
      throw error;
    }
  },

  // Get ICPs (from onboarding endpoint)
  async getICPsOnboarding(params?: any): Promise<any> {
    try {
      const response = await apiClient.get('/pub/v1/onboarding/icps', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching ICPs:', error);
      throw error;
    }
  }
};
