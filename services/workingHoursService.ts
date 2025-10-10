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

export interface WorkingHour {
  id: string;
  identity_id: string;
  day_of_week: string;
  is_active: boolean;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface IdentityInfo {
  id: string;
  name: string;
  time_zone: string;
}

export interface WorkingHoursResponse {
  success: boolean;
  message: string;
  data: {
    identity: IdentityInfo;
    workingHours: WorkingHour[];
  };
}

export interface SaveWorkingHoursRequest {
  timeZone: string;
  workingHours: Array<{
    day_of_week: string;
    is_active: boolean;
    start_time: string;
    end_time: string;
  }>;
}

export interface SaveWorkingHoursResponse {
  success: boolean;
  message: string;
}

export const workingHoursService = {
  // Get working hours for an identity
  getWorkingHours: async (identityId: string): Promise<WorkingHoursResponse> => {
    try {
      const response = await apiClient.get(`/pub/v1/identities/working_hours/${identityId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching working hours for identity ${identityId}:`, error);
      throw error;
    }
  },

  // Save working hours for an identity
  saveWorkingHours: async (identityId: string, data: SaveWorkingHoursRequest): Promise<SaveWorkingHoursResponse> => {
    try {
      const response = await apiClient.post(`/pub/v1/identities/working_hours/${identityId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error saving working hours for identity ${identityId}:`, error);
      throw error;
    }
  }
};

export default workingHoursService;

