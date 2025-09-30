import { apiClient } from '../lib/apiClient';

export interface AttachIdentityRequest {
  campaign_id: string;
  identity_id: string;
}

export interface CampaignIdentityResponse<T = any> {
  message?: string;
  data?: T;
  status?: boolean;
}

export const campaignIdentitiesService = {
  attachIdentity: async (payload: AttachIdentityRequest): Promise<CampaignIdentityResponse> => {
    try {
      const res = await apiClient.post('/pub/v1/campaign-identities/attach', payload);
      return res.data;
    } catch (error) {
      console.error('Error attaching identity:', error);
      throw error;
    }
  },
};

export default campaignIdentitiesService;


