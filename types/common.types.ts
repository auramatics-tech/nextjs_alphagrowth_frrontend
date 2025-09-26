export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface BusinessProfile {
  industry: string[];
  valueProposition: string;
  services: string;
  website?: string;
  businessType: 'B2B' | 'B2C';
}

export interface ICP {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  goals: string[];
  painPoints: string[];
  demographics: Record<string, any>;
  technographics: Record<string, any>;
  revenueMetrics: Record<string, any>;
  intentSignals: Record<string, any>;
  buyingBehavior: Record<string, any>;
  outreach: Record<string, any>;
  psychographics: Record<string, any>;
}

export interface GTMGoal {
  id: string;
  name: string;
  objective: string;
  targetIcp: string;
  kpis: Array<{
    type: string;
    value: number;
  }>;
  duration: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'linkedin' | 'voice' | 'task';
  createdAt: string;
  updatedAt: string;
}






