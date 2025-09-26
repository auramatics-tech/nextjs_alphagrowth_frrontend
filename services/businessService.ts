import { apiClient } from '../lib/apiClient';

export const businessService = {
  analyzeDomain: async (data: { domain: string; businessType: string }) => {
    const response = await apiClient.post('/pub/v1/onboarding/domain-detail', data);
    return response.data;
  },

  getBusinessInfo: async (data: { business_id: string }) => {
    const response = await apiClient.post('/pub/v1/onboarding/business-information', data);
    return response.data;
  },

  updateBusinessInfo: async (data: any) => {
    const response = await apiClient.post('/pub/v1/onboarding/update-business-information', data);
    return response.data;
  },

  createIcps: async (data: any) => {
    const response = await apiClient.post('/pub/v1/onboarding/create-icp', data);
    return response.data;
  },

  getIcps: async (businessId: string) => {
    const response = await apiClient.get('/pub/v1/onboarding/icps', {
      params: { businessId }
    });
    return response.data;
  },

  updateIcpSection: async (data: {
    businessId: string;
    icpId: string;
    section: string;
    sectionData: any;
  }) => {
    const response = await apiClient.post('/pub/v1/onboarding/update-icp', data);
    return response.data;
  },

  // NEW: Generate GTM pain point and value proposition
  generateGtmPainPoints: async (data: {
    businessId: string;
    icpId: string;
    goal_title: string;
    target_segment: string;
    channel_focus: string;
  }) => {
    const response = await apiClient.post('/pub/v1/onboarding/gtm-genrate-pin-point', data);
    return response.data;
  },

  // NEW: Create GTM Goal (skeleton; save wiring later)
  createGtmGoal: async (data: any) => {
    const response = await apiClient.post('/pub/v1/onboarding/create-gtm', data);
    return response.data;
  }
};
