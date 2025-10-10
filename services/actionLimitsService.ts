import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ActionLimit {
  id: string;
  identity_id: string;
  key: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export interface SetActionLimitRequest {
  identity_id: string;
  key: string;
  value: number;
}

export interface ActionLimitsResponse {
  message: string;
  data: ActionLimit[];
}

export interface SetActionLimitResponse {
  message: string;
  data: ActionLimit;
}

export const actionLimitsService = {
  // Get all action limits for an identity
  getActionLimits: async (identityId: string): Promise<ActionLimitsResponse> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaign-identities/identity_detail/${identityId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching action limits for identity ${identityId}:`, error);
      throw error;
    }
  },

  // Set/Update action limit for an identity
  setActionLimit: async (data: SetActionLimitRequest): Promise<SetActionLimitResponse> => {
    try {
      const response = await apiClient.post('/pub/v1/campaign-identities/set_limit', data);
      return response.data;
    } catch (error) {
      console.error(`Error setting action limit:`, error);
      throw error;
    }
  },

  // Update multiple action limits
  updateActionLimits: async (identityId: string, limits: Record<string, number>): Promise<void> => {
    try {
      const promises = Object.entries(limits).map(([key, value]) =>
        actionLimitsService.setActionLimit({
          identity_id: identityId,
          key,
          value
        })
      );
      await Promise.all(promises);
    } catch (error) {
      console.error(`Error updating action limits for identity ${identityId}:`, error);
      throw error;
    }
  }
};

export default actionLimitsService;

