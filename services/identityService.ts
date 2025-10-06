import { apiClient } from '../lib/apiClient';

export interface Identity {
  id: string;
  name: string;
  email?: string;
  status?: string;
  linkedin_sign?: string;
  identity_requests?: Array<{
    id: string;
    type: string;
    connection_status: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface CreateIdentityRequest {
  name: string;
  email?: string;
}

export interface UpdateIdentityRequest {
  name?: string;
  email?: string;
}

export interface SmtpCredentialsRequest {
  identity_id: string;
  data: {
    smtp_server: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    imap_server?: string;
    imap_port?: number;
  };
  type: 'SMTP/IMAP';
}

export const identityService = {
  /**
   * Get all identities
   */
  getIdentities: async (): Promise<Identity[]> => {
    try {
      const response = await apiClient.get('/pub/v1/identities/list');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching identities:', error);
      throw error;
    }
  },

  /**
   * Get LinkedIn identities only
   */
  getLinkedInIdentities: async (): Promise<Identity[]> => {
    try {
      const response = await apiClient.get('/pub/v1/identities/list?type=LINKEDIN');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching LinkedIn identities:', error);
      throw error;
    }
  },

  /**
   * Get identity by ID
   */
  getIdentityById: async (id: string): Promise<Identity> => {
    try {
      const response = await apiClient.get(`/pub/v1/identities/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching identity with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new identity
   */
  createIdentity: async (data: CreateIdentityRequest): Promise<Identity> => {
    try {
      const response = await apiClient.post('/pub/v1/identities', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating identity:', error);
      throw error;
    }
  },

  /**
   * Update an existing identity
   */
  updateIdentity: async (id: string, data: UpdateIdentityRequest): Promise<Identity> => {
    try {
      const response = await apiClient.put(`/pub/v1/identities/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating identity with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an identity
   */
  deleteIdentity: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/pub/v1/identities/${id}`);
    } catch (error) {
      console.error(`Error deleting identity with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Check if identity has LinkedIn connection
   */
  hasLinkedInConnection: (identity: Identity): boolean => {
    return identity.identity_requests?.some(req => 
      req.connection_status === "loggedin" && 
      req.type === "linkedin"
    ) || false;
  },

  /**
   * Attach identity to campaign
   */
  attachIdentityToCampaign: async (campaignId: string, identityId: string): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/campaign-identities/attach', {
        campaign_id: campaignId,
        identity_id: identityId
      });
      return response.data;
    } catch (error) {
      console.error('Error attaching identity to campaign:', error);
      throw error;
    }
  },

  /**
   * Save SMTP credentials for an identity
   */
  saveSmtpCredentials: async (data: SmtpCredentialsRequest): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/identities/smtp', data);
      return response.data;
    } catch (error) {
      console.error('Error saving SMTP credentials:', error);
      throw error;
    }
  },

  /**
   * Connect LinkedIn for an identity
   */
  connectLinkedIn: async (data: { identity_id: string; data: any; type: string }): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/identities/linkedin', data);
      return response.data;
    } catch (error) {
      console.error('Error connecting LinkedIn:', error);
      throw error;
    }
  },

  /**
   * Check connection status for an identity
   */
  checkConnectionStatus: async (connectionStatusId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/pub/v1/identities/connection-status/${connectionStatusId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking connection status:', error);
      throw error;
    }
  },

  /**
   * Verify LinkedIn captcha
   */
  verifyLinkedInCaptcha: async (data: { code: string; type: string; connection_id: string }): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/identities/verify-captcha', data);
      return response.data;
    } catch (error) {
      console.error('Error verifying LinkedIn captcha:', error);
      throw error;
    }
  }
};