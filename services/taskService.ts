import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL:   process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface Task {
  id: string;
  status: 'OPENED' | 'WORKING' | 'CLOSED';
  task_notes: string;
  opened_at: string;
  working_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
  lead: {
    id: string;
    first_name: string;
    last_name: string;
    company_name: string;
    pro_email: string;
    profile_url?: string;
  };
  campaign: {
    id: string;
    name: string;
    status: string;
  };
  node?: {
    id: string;
    label: string;
    type: string;
    node_type: string;
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task[];
}

export interface SingleTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

// Get user's tasks with campaign and lead details
export const getUserTasks = async (): Promise<TaskResponse> => {
  const response = await api.get('/pub/v1/tasks/user-tasks');
  return response.data;
};

// Get task by ID
export const getTaskById = async (taskId: string): Promise<SingleTaskResponse> => {
  const response = await api.get(`/pub/v1/tasks/${taskId}`);
  return response.data;
};

// Update task status
export const updateTaskStatus = async (taskId: string, status: 'OPENED' | 'WORKING' | 'CLOSED'): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(`/pub/v1/tasks/${taskId}/status`, { status });
  return response.data;
};

// Update task notes
export const updateTaskNotes = async (taskId: string, notes: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(`/pub/v1/tasks/${taskId}/notes`, { notes });
  return response.data;
};

// Delete task
export const deleteTask = async (taskId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/pub/v1/tasks/${taskId}`);
  return response.data;
};

// Get tasks by campaign
export const getTasksByCampaign = async (campaignId: string): Promise<TaskResponse> => {
  const response = await api.get(`/pub/v1/tasks/campaign/${campaignId}`);
  return response.data;
};

// Get tasks by lead
export const getTasksByLead = async (leadId: string): Promise<TaskResponse> => {
  const response = await api.get(`/pub/v1/tasks/lead/${leadId}`);
  return response.data;
};

