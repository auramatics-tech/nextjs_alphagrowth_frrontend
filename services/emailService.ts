import { apiClient } from '../lib/apiClient';

// Types
export interface GmailOAuthRequest {
  identity_id: string;
}

export interface GmailOAuthResponse {
  success: boolean;
  auth_url?: string;
  message?: string;
}

export interface EmailSignoutRequest {
  type: 'GMAIL' | 'SMTP' | 'OUTLOOK';
}

export interface EmailConnectionStatus {
  provider: 'GMAIL' | 'SMTP' | 'OUTLOOK';
  status: 'connected' | 'disconnected' | 'requested';
  provider_type?: string;
  provider_data?: any;
  connected_at?: string;
}

export const emailService = {
  // Initiate Gmail OAuth flow
  initiateGmailOAuth: async (identityId: string): Promise<GmailOAuthResponse> => {
    const response = await apiClient.post('/pub/v1/identities/auth', {
      identity_id: identityId,
      provider: 'GMAIL'
    });
    return response.data;
  },

  // Handle Gmail OAuth callback
  handleGmailCallback: async (code: string, identityId: string) => {
    const response = await apiClient.post('/pub/v1/identities/oauth2callback', {
      code,
      identity_id: identityId
    });
    return response.data;
  },

  // Sign out from email provider
  signoutEmail: async (identityId: string, type: string) => {
    const response = await apiClient.post(`/pub/v1/linkedin-connections/signout/${identityId}`, {
      type: type.toUpperCase()
    });
    return response.data;
  },

  // Get email connection status
  getEmailConnectionStatus: async (identityId: string): Promise<EmailConnectionStatus> => {
    const response = await apiClient.get(`/pub/v1/identities/email-status/${identityId}`);
    return response.data;
  },

  // Test SMTP connection
  testSmtpConnection: async (credentials: any) => {
    const response = await apiClient.post('/pub/v1/identities/test-smtp', credentials);
    return response.data;
  }
};





