import { apiClient } from '../lib/apiClient';

// --- Types ---
export interface Audience {
  id: string;
  audience_name: string;
  name?: string;
  description?: string;
  audienceLeads?: any[];
  leadCount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAudienceRequest {
  name: string;
  description?: string;
}

export interface SelectAudienceRequest {
  campaignId: string;
  audienceId: string;
}

// --- Audience Service ---
export const audienceService = {
  /**
   * Get list of audiences
   */
  getAudiences: async (campaignId?: string): Promise<Audience[]> => {
    try {
      let url = '/pub/v1/audience/list';
      
      // Add campaign_id as query parameter if provided
      if (campaignId) {
        url += `?campaign_id=${campaignId}`;
      }
      
      const response = await apiClient.get(url);
      
      // Transform backend data to match UI requirements
      return response.data.data?.map(transformAudienceData) || [];
    } catch (error) {
      console.error('Error fetching audiences:', error);
      throw error;
    }
  },

  /**
   * Select audience for campaign
   */
  selectAudience: async (campaignId: string, audienceId: string): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/audience/select', {
        campaignId,
        audienceId
      });
      return response.data;
    } catch (error) {
      console.error('Error selecting audience:', error);
      throw error;
    }
  },

  /**
   * Get selected audience for campaign
   */
  getSelectedAudience: async (campaignId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/pub/v1/audience/selected/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching selected audience:', error);
      throw error;
    }
  },

  /**
   * Create new audience
   */
  createAudience: async (data: CreateAudienceRequest): Promise<Audience> => {
    try {
      const response = await apiClient.post('/pub/v1/audience', {
        audience_name: data.name,
        description: data.description
      });
      return transformAudienceData(response.data.data);
    } catch (error) {
      console.error('Error creating audience:', error);
      throw error;
    }
  },

  /**
   * Get audience by ID
   */
  getAudienceById: async (audienceId: string): Promise<Audience> => {
    try {
      const response = await apiClient.get(`/pub/v1/audience/${audienceId}`);
      return transformAudienceData(response.data.data);
    } catch (error) {
      console.error('Error fetching audience by ID:', error);
      throw error;
    }
  },

  /**
   * Update audience
   */
  updateAudience: async (audienceId: string, data: Partial<CreateAudienceRequest>): Promise<Audience> => {
    try {
      const response = await apiClient.put(`/pub/v1/audience/${audienceId}`, {
        audience_name: data.name,
        description: data.description
      });
      return transformAudienceData(response.data.data);
    } catch (error) {
      console.error('Error updating audience:', error);
      throw error;
    }
  },

  /**
   * Delete audience
   */
  deleteAudience: async (audienceId: string): Promise<void> => {
    try {
      await apiClient.delete(`/pub/v1/audience/${audienceId}`);
    } catch (error) {
      console.error('Error deleting audience:', error);
      throw error;
    }
  }
};

// --- Helper Functions ---

/**
 * Transform backend audience data to match UI requirements
 */
function transformAudienceData(backendAudience: any): Audience {
  return {
    id: backendAudience.id,
    audience_name: backendAudience.audience_name || backendAudience.name || 'Unnamed Audience',
    name: backendAudience.audience_name || backendAudience.name || 'Unnamed Audience',
    description: backendAudience.description || '',
    audienceLeads: backendAudience.audienceLeads || [],
    leadCount: backendAudience.audienceLeads?.length || backendAudience.leadCount || 0,
    created_at: backendAudience.created_at,
    updated_at: backendAudience.updated_at
  };
}

export default audienceService;
