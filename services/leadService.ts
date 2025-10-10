import apiClient from '../lib/apiClient';
import { Person } from './peopleService';

export interface AddLeadsPayload {
  campaign_id: string;
  audience_name: string;
  leads: Partial<Person>[];
}

export interface AddLeadsResponse {
  success: boolean;
  message: string;
  data?: any;
}

const leadService = {
  /**
   * Add leads to a campaign with audience name
   */
  addLeadsToCampaign: async (payload: AddLeadsPayload): Promise<AddLeadsResponse> => {
    try {
      console.log('📤 Adding leads to campaign:', payload);
      
      const response = await apiClient.post('/pub/v1/leads/add-leads', payload);
      
      console.log('✅ Leads added successfully:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error adding leads to campaign:', error);
      throw new Error(error.response?.data?.message || 'Failed to add leads to campaign');
    }
  },

  /**
   * Get campaign leads
   */
  getCampaignLeads: async (campaignId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaign-identities/list/${campaignId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting campaign leads:', error);
      throw new Error(error.response?.data?.message || 'Failed to get campaign leads');
    }
  },

  /**
   * Delete lead from campaign
   */
  deleteLeadFromCampaign: async (campaignId: string, leadId: string): Promise<any> => {
    try {
      const response = await apiClient.delete(`/pub/v1/campaigns/${campaignId}/leads/${leadId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete lead');
    }
  },

  /**
   * Delete audience from campaign
   */
  deleteAudienceFromCampaign: async (campaignId: string, audienceId: string): Promise<any> => {
    try {
      const response = await apiClient.delete(`/pub/v1/campaigns/${campaignId}/audiences/${audienceId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting audience:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete audience');
    }
  }
};

export default leadService;

