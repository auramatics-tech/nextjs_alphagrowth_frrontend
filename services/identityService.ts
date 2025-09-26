import { apiClient } from '../lib/apiClient';

// Types
export interface Identity {
  id: string;
  name: string;
  company_name?: string; // Optional since API doesn't return this
  email?: string; // Optional since API doesn't return this
  image?: string;
  user_id?: string;
  linkedin_sign?: 'loggedin' | 'disconnected' | 'requested';
  email_detail?: {
    connection_status?: 'loggedin' | 'requested' | 'disconnected';
    status?: number;
    provider_type?: string;
    provider?: string;
    type?: string;
    data?: any;
  };
  phone_detail?: {
    connection_status: 'verified' | 'unverified';
    status: number;
  };
  created_at?: string;
  updated_at?: string;
  user?: {
    name: string;
  };
}

export interface CreateIdentityRequest {
  name: string;
  company_name: string;
  email: string;
}

export interface CreateIdentityResponse {
  success: boolean;
  data?: Identity;
  message?: string;
  error?: string;
}

export interface IdentitiesListResponse {
  status: boolean;
  data?: Identity[];
  message?: string;
  error?: string;
}

export interface SignoutRequest {
  type: 'LINKEDIN' | 'GMAIL' | 'SMTP' | 'OUTLOOK';
}

export interface LinkedInConnectionRequest {
  identity_id: string;
  data: {
    email: string;
    password: string;
    location: string;
  };
  type: 'LINKEDIN';
}

export interface VerificationRequest {
  code: string;
  type: 'email' | 'capcha';
  connection_id: string;
}

export interface GoogleOAuthRequest {
  code: string;
  identity_id: string;
}

export interface SmtpCredentialsRequest {
  identity_id: string;
  data: {
    email: string;
    password: string;
    sender_full_name: string;
    smtp: {
      host: string;
      password: string;
      port: number;
    };
    imap: {
      host: string;
      password: string;
      port: number;
    };
  };
  type: 'SMTP/IMAP';
}

export const identityService = {
  // Get all identities
  getIdentities: async (): Promise<IdentitiesListResponse> => {
    const response = await apiClient.get('/pub/v1/identities/list');
    return response.data;
  },

  // Create new identity
  createIdentity: async (data: CreateIdentityRequest): Promise<CreateIdentityResponse> => {
    const response = await apiClient.post('/pub/v1/identities/create', data);
    return response.data;
  },

  // Sign out from channel
  signout: async (identityId: string, data: SignoutRequest) => {
    const response = await apiClient.post(`/pub/v1/linkedin-connections/signout/${identityId}`, data);
    return response.data;
  },

  // LinkedIn connection
  connectLinkedIn: async (data: LinkedInConnectionRequest) => {
    const response = await apiClient.post('/pub/v1/linkedin-connections/save-credentials', data);
    return response.data;
  },

  // Google OAuth callback
  googleOAuth: async (data: GoogleOAuthRequest) => {
    const response = await apiClient.post('/pub/v1/identities/oauth2callback', data);
    return response.data;
  },

  // SMTP credentials
  saveSmtpCredentials: async (data: SmtpCredentialsRequest) => {
    const response = await apiClient.post('/pub/v1/linkedin-connections/save-credentials', data);
    return response.data;
  },

  // LinkedIn audio captcha verification
  verifyLinkedInCaptcha: async (data: any) => {
    const response = await apiClient.post('/pub/v1/linkedin-connections/verify', data);
    return response.data;
  },

  // Check connection status
  checkConnectionStatus: async (connectionStatusId: string) => {
    const response = await apiClient.get(`/pub/v1/linkedin-connections/check-connection-status/${connectionStatusId}`);
    return response.data;
  }
};
