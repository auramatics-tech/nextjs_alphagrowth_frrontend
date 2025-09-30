import { apiClient } from '../lib/apiClient';

export interface LinkedInCredentials {
  email: string;
  password: string;
  location: string;
}

export interface LinkedInConnectionResponse {
  success: boolean;
  data: {
    id: string;
    status: string;
  };
  message?: string;
}

export interface LinkedInLeadSearchParams {
  search_url?: string;
  search_type?: 'regular' | 'sales_navigator';
  keywords?: string;
  location?: string;
  industry?: string;
  company_size?: string;
  seniority_level?: string;
  current_company?: string;
  past_company?: string;
  school?: string;
  profile_language?: string;
  connection_degree?: string;
  include_former?: boolean;
  page?: number;
  limit?: number;
}

export interface LinkedInLead {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  headline?: string;
  linkedin_url?: string;
  linkedin_uid?: string;
  profile_url?: string;
  pro_email?: string;
  perso_email?: string;
  job?: string;
  website?: string;
  industry?: string;
  twitter?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  email_status?: string;
  phone?: string;
  organization?: {
    name?: string;
    linkedin_uid?: string;
    industry?: string;
    founded_year?: number;
    alexa_ranking?: number;
  };
}

export interface LinkedInSearchResponse {
  success: boolean;
  data: {
    leads: LinkedInLead[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
  };
  message?: string;
}

export const linkedinService = {
  /**
   * Save LinkedIn credentials for connection
   */
  saveCredentials: async (credentials: LinkedInCredentials, identityId: string): Promise<LinkedInConnectionResponse> => {
    try {
      const response = await apiClient.post('/pub/v1/linkedin-connections/save-credentials', {
        data: credentials,
        type: 'LINKEDIN',
        identity_id: identityId
      });
      return response.data;
    } catch (error) {
      console.error('Error saving LinkedIn credentials:', error);
      throw error;
    }
  },

  /**
   * Search LinkedIn leads
   */
  searchLeads: async (params: LinkedInLeadSearchParams): Promise<LinkedInSearchResponse> => {
    try {
      const response = await apiClient.post('/pub/v1/people/search-people', params);
      return response.data;
    } catch (error) {
      console.error('Error searching LinkedIn leads:', error);
      throw error;
    }
  },

  /**
   * Get LinkedIn connection status
   */
  getConnectionStatus: async (connectionId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/pub/v1/linkedin-connections/${connectionId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error getting LinkedIn connection status:', error);
      throw error;
    }
  },

  /**
   * Get available LinkedIn identities
   */
  getLinkedInIdentities: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/pub/v1/identities?type=LINKEDIN');
      return response.data.data || [];
    } catch (error) {
      console.error('Error getting LinkedIn identities:', error);
      throw error;
    }
  }
};
