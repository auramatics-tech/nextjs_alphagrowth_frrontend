import { apiClient } from '../lib/apiClient';

// --- Types ---
export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  gtmId: string;
  created_at: string;
  updated_at: string;
  campaignLeads: any[];
  // Additional fields for UI display
  leadsCompleted?: { current: number; total: number };
  replyRate?: number;
  meetingsBooked?: number;
  channels?: string[];
  lastActivity?: string;
}

export interface CreateCampaignRequest {
  name: string;
  gtm_name: string;
  objective: string;
  success_metric: string;
  target: string | number;
  audience: string;
  pain_point: string;
  value_prop: string;
  gtmId: string;
}

export interface CampaignFilters {
  status?: string;
  search?: string;
  gtmId?: string;
}

export interface CampaignStats {
  total: number;
  active: number;
  draft: number;
  completed: number;
  paused: number;
}

// --- Campaign Service ---
export const campaignService = {
  /**
   * Get list of campaigns
   */
  listCampaigns: async (filters?: CampaignFilters): Promise<Campaign[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.gtmId) params.append('gtmId', filters.gtmId);

      const response = await apiClient.get(`/pub/v1/campaigns?${params.toString()}`);
      
      // Transform backend data to match UI requirements
      return response.data.data?.map(transformCampaignData) || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  /**
   * Get campaign by ID
   */
  getCampaignDetail: async (id: string): Promise<Campaign> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaigns/${id}/detail`);
      return transformCampaignData(response.data.data);
    } catch (error) {
      console.error('Error fetching campaign detail:', error);
      throw error;
    }
  },

  /**
   * Create new campaign
   */
  createCampaign: async (data: CreateCampaignRequest): Promise<Campaign> => {
    try {
      const response = await apiClient.post('/pub/v1/campaigns', data);
      return transformCampaignData(response.data.data);
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  /**
   * Update campaign status
   */
  updateCampaignStatus: async (id: string, status: string): Promise<void> => {
    try {
      await apiClient.post(`/pub/v1/campaigns/${id}/status`, { status });
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  },

  /**
   * Delete campaign
   */
  deleteCampaign: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/pub/v1/campaigns/${id}`);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  /**
   * Save campaign workflow
   */
  saveCampaignFlow: async (campaignId: string, nodes: any[], edges: any[]): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/campaigns/save-flow', {
        campaignId,
        nodes,
        edges
      });
      return response.data;
    } catch (error) {
      console.error('Error saving campaign flow:', error);
      throw error;
    }
  },

  /**
   * Get campaign flow
   */
  getCampaignFlow: async (campaignId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaigns/get-flow/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign flow:', error);
      throw error;
    }
  },

  /**
   * Update campaign message creation type (ai | manual)
   */
  setMessageCreationType: async (campaignId: string, messageType: 'ai' | 'manual'): Promise<any> => {
    try {
      const response = await apiClient.put(`/pub/v1/campaigns/${campaignId}/message-type`, { messageType });
      return response.data;
    } catch (error) {
      console.error('Error setting message creation type:', error);
      throw error;
    }
  },

  /**
   * Get message content for a specific campaign node
   */
  getCampaignNodeMessageByNodeId: async (nodeId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaigns/nodes/message/${nodeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching node message:', error);
      throw error;
    }
  },

  /**
   * Create/Update campaign node message
   * payload must include: campaign_id, node_id, channel, message; plus subject/alternate_message for email
   */
  upsertCampaignNodeMessage: async (payload: any): Promise<any> => {
    try {
      // Backend expects { node_id, data: { ...fields } }
      const response = await apiClient.post('/pub/v1/campaigns/nodes/message', payload);
      return response.data;
    } catch (error) {
      console.error('Error saving node message:', error);
      throw error;
    }
  },

  /**
   * Generate campaign flow by AI
   */
  generateCampaignFlowByAI: async (campaignId: string): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/campaigns/get_flow_by_ai', {
        campaign_id: campaignId
      });
      return response.data;
    } catch (error) {
      console.error('Error generating campaign flow by AI:', error);
      throw error;
    }
  },

  /**
   * Get campaign statistics
   */
  getCampaignStats: async (): Promise<CampaignStats> => {
    try {
      const campaigns = await campaignService.listCampaigns();
      
      return {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'active').length,
        draft: campaigns.filter(c => c.status === 'draft').length,
        completed: campaigns.filter(c => c.status === 'completed').length,
        paused: campaigns.filter(c => c.status === 'paused').length,
      };
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      throw error;
    }
  }
};

// Campaign-level Settings (Engagement Rules)
export interface CampaignSettings {
  start?: { mode: 'immediate' | 'scheduled'; at?: string };
  engagement?: {
    linkedin?: { invitesPerDay?: number; messagesPerDay?: number; maxPending?: number };
    email?: { emailsPerDay?: number; perMinute?: number };
  };
  emailTracking?: { open?: boolean; click?: boolean; reply?: boolean };
}

export const campaignSettingsService = {
  getCampaignSettings: async (campaignId: string): Promise<CampaignSettings> => {
    try {
      const res = await apiClient.get(`/pub/v1/campaigns/${campaignId}/settings`);
      return res.data?.data || {};
    } catch (e) {
      // Fallback: try campaign detail if settings endpoint unavailable
      try {
        const detail = await apiClient.get(`/pub/v1/campaigns/${campaignId}/detail`);
        const d = detail.data?.data || {};
        return {
          start: { mode: d.start_date || 'immediate', at: d.custom_start_date },
          engagement: d.engagement,
          emailTracking: { open: d.open_tracking, click: d.click_tracking, reply: d.reply_tracking },
        };
      } catch (err) {
        console.error('Error fetching campaign settings:', err);
        return {};
      }
    }
  },

  updateCampaignStart: async (
    campaignId: string,
    payload: { mode: 'immediate' | 'scheduled'; at?: string }
  ): Promise<any> => {
    const res = await apiClient.post(`/pub/v1/campaigns/${campaignId}/start`, payload);
    return res.data;
  },

  updateCampaignEngagement: async (
    campaignId: string,
    payload: {
      linkedin?: { invitesPerDay?: number; messagesPerDay?: number; maxPending?: number };
      email?: { emailsPerDay?: number; perMinute?: number };
    }
  ): Promise<any> => {
    const res = await apiClient.post(`/pub/v1/campaigns/${campaignId}/engagement`, payload);
    return res.data;
  },

  updateCampaignEmailTracking: async (
    campaignId: string,
    payload: { open?: boolean; click?: boolean; reply?: boolean }
  ): Promise<any> => {
    const res = await apiClient.post(`/pub/v1/campaigns/${campaignId}/email-tracking`, payload);
    return res.data;
  },
};

// --- Helper Functions ---

/**
 * Transform backend campaign data to match UI requirements
 */
function transformCampaignData(backendCampaign: any): Campaign {
  const campaignLeads = backendCampaign.campaignLeads || [];
  
  return {
    id: backendCampaign.id,
    name: backendCampaign.name,
    status: backendCampaign.status || 'draft',
    gtmId: backendCampaign.gtmId,
    created_at: backendCampaign.created_at,
    updated_at: backendCampaign.updated_at,
    campaignLeads,
    
    // UI-specific fields
    leadsCompleted: {
      current: campaignLeads.length,
      total: backendCampaign.totalLeads || campaignLeads.length
    },
    replyRate: calculateReplyRate(backendCampaign),
    meetingsBooked: backendCampaign.meetingsBooked || 0,
    channels: extractChannels(backendCampaign),
    lastActivity: backendCampaign.updated_at
  };
}

/**
 * Calculate reply rate from campaign data
 */
function calculateReplyRate(campaign: any): number {
  // This is a placeholder calculation
  // You might need to implement actual reply rate calculation based on your data structure
  if (campaign.campaignLeads && campaign.campaignLeads.length > 0) {
    const repliedLeads = campaign.campaignLeads.filter((lead: any) => lead.hasReplied).length;
    return Math.round((repliedLeads / campaign.campaignLeads.length) * 100);
  }
  return 0;
}

/**
 * Extract channels from campaign data
 */
function extractChannels(campaign: any): string[] {
  const channels = [];
  
  // Check if campaign has LinkedIn connections
  if (campaign.linkedinConnections && campaign.linkedinConnections.length > 0) {
    channels.push('LinkedIn');
  }
  
  // Check if campaign has email connections
  if (campaign.emailConnections && campaign.emailConnections.length > 0) {
    channels.push('Email');
  }
  
  // Check if campaign has phone connections
  if (campaign.phoneConnections && campaign.phoneConnections.length > 0) {
    channels.push('Voice');
  }
  
  return channels.length > 0 ? channels : ['LinkedIn']; // Default to LinkedIn if no channels found
}

export default campaignService;
