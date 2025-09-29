import { apiClient } from '../lib/apiClient';

// --- Types ---
export interface FlowData {
  nodes: any[];
  edges: any[];
  selectedAudience?: any;
  campaignData?: any;
}

export interface MessageData {
  id: string;
  content: string;
  audio_file?: string;
  message_type?: string;
  variables?: any;
}

export interface AiMessage {
  id: string;
  lead_id: string;
  lead: any;
  content: string;
  message_type: string;
  node_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NodeUpdateData {
  position_x?: number;
  position_y?: number;
  wait_time?: number;
  content?: string;
  audio_file?: string;
  message_type?: string;
  variables?: any;
}

export interface SaveFlowData {
  campaignId: string;
  nodes: any[];
  edges: any[];
}

// --- Campaign Workflow Service ---
export const campaignWorkflowService = {
  /**
   * Get campaign flow data
   */
  getCampaignFlow: async (campaignId: string): Promise<FlowData> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaigns/get-flow/${campaignId}`);
      return response.data.data || { nodes: [], edges: [] };
    } catch (error) {
      console.error('Error fetching campaign flow:', error);
      throw error;
    }
  },

  /**
   * Save campaign flow
   */
  saveCampaignFlow: async (data: SaveFlowData): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/campaigns/save-flow', {
        campaignId: data.campaignId,
        nodes: data.nodes,
        edges: data.edges
      });
      return response.data;
    } catch (error) {
      console.error('Error saving campaign flow:', error);
      throw error;
    }
  },

  /**
   * Update node data
   */
  updateNode: async (nodeId: string, data: NodeUpdateData): Promise<any> => {
    try {
      const response = await apiClient.put(`/pub/v1/campaigns/update_node/${nodeId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating node:', error);
      throw error;
    }
  },

  /**
   * Delete node
   */
  deleteNode: async (nodeId: string): Promise<any> => {
    try {
      const response = await apiClient.delete(`/pub/v1/campaigns/delete_node/${nodeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting node:', error);
      throw error;
    }
  },

  /**
   * Duplicate node
   */
  duplicateNode: async (nodeId: string, data?: any): Promise<any> => {
    try {
      const response = await apiClient.post(`/pub/v1/campaigns/duplicate_node/${nodeId}`, data || {});
      return response.data;
    } catch (error) {
      console.error('Error duplicating node:', error);
      throw error;
    }
  },

  /**
   * Replace node
   */
  replaceNode: async (nodeId: string, data: any): Promise<any> => {
    try {
      const response = await apiClient.put(`/pub/v1/campaigns/replace_node/${nodeId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error replacing node:', error);
      throw error;
    }
  },

  /**
   * Get node message content
   */
  getNodeMessage: async (nodeId: string): Promise<MessageData> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaigns/nodes/message/${nodeId}`);
      return response.data.data || { id: nodeId, content: '', message_type: 'text' };
    } catch (error) {
      console.error('Error fetching node message:', error);
      throw error;
    }
  },

  /**
   * Save node message content
   */
  saveNodeMessage: async (nodeId: string, content: string, messageType: string = 'text', variables?: any): Promise<any> => {
    try {
      const response = await apiClient.post('/pub/v1/campaigns/nodes/message', {
        node_id: nodeId,
        content: content,
        message_type: messageType,
        variables: variables || {}
      });
      return response.data;
    } catch (error) {
      console.error('Error saving node message:', error);
      throw error;
    }
  },

  /**
   * Upload audio file for node
   */
  uploadAudioFile: async (nodeId: string, audioFile: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioFile);
      formData.append('node_id', nodeId);

      const response = await apiClient.post('/pub/v1/campaigns/upload-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading audio file:', error);
      throw error;
    }
  },

  /**
   * Get campaign AI messages
   */
  getCampaignAiMessages: async (campaignId: string): Promise<AiMessage[]> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaigns/${campaignId}/ai-messages`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching AI messages:', error);
      throw error;
    }
  },

  /**
   * Update AI message
   */
  updateAiMessage: async (messageId: string, content: string): Promise<any> => {
    try {
      const response = await apiClient.put(`/pub/v1/campaigns/ai-messages/${messageId}`, {
        content: content
      });
      return response.data;
    } catch (error) {
      console.error('Error updating AI message:', error);
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
      console.error('Error generating AI flow:', error);
      throw error;
    }
  },

  /**
   * Update campaign status
   */
  updateCampaignStatus: async (campaignId: string, status: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/pub/v1/campaigns/${campaignId}/status`, {
        status: status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  },

  /**
   * Get campaign details
   */
  getCampaignDetails: async (campaignId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/pub/v1/campaigns/${campaignId}/detail`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      throw error;
    }
  }
};

export default campaignWorkflowService;





