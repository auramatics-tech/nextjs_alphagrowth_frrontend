import { apiClient } from '../lib/apiClient';
import type { 
  KPIData, 
  SalesFunnelData, 
  ChannelData, 
  TaskData, 
  GTMStrategy, 
  Campaign, 
  DashboardFilters 
} from '../types/dashboard';

export const dashboardService = {
  // Get Dashboard KPIs
  async getKPIs(userId: string, filters: DashboardFilters = { gtmIds: [], campaignIds: [] }): Promise<KPIData> {
    try {
      const requestData = { 
        userId,
        gtmIds: filters.gtmIds || [],
        campaignIds: filters.campaignIds || []
      };
      
      const response = await apiClient.post('/pub/v1/dashboard/kpis', requestData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      throw new Error('Failed to fetch KPI data');
    }
  },

  // Get Sales Funnel Data
  async getSalesFunnel(userId: string, filters: DashboardFilters = { gtmIds: [], campaignIds: [] }): Promise<SalesFunnelData> {
    try {
      const requestData = { 
        userId,
        gtmIds: filters.gtmIds || [],
        campaignIds: filters.campaignIds || []
      };
      
      const response = await apiClient.post('/pub/v1/dashboard/sales-funnel', requestData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching sales funnel data:', error);
      throw new Error('Failed to fetch sales funnel data');
    }
  },

  // Get Dashboard Tasks
  async getTasks(userId: string, filters: DashboardFilters = { gtmIds: [], campaignIds: [] }): Promise<TaskData[]> {
    try {
      const requestData = { 
        userId,
        gtmIds: filters.gtmIds || [],
        campaignIds: filters.campaignIds || []
      };
      
      const response = await apiClient.post('/pub/v1/dashboard/tasks', requestData);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching tasks data:', error);
      throw new Error('Failed to fetch tasks data');
    }
  },

  // Get Channels Performance Data
  async getChannelsData(userId: string, filters: DashboardFilters = { gtmIds: [], campaignIds: [] }): Promise<ChannelData[]> {
    try {
      const requestData = { 
        userId,
        gtmIds: filters.gtmIds || [],
        campaignIds: filters.campaignIds || []
      };
      
      const response = await apiClient.post('/pub/v1/dashboard/channels', requestData);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching channels data:', error);
      throw new Error('Failed to fetch channels data');
    }
  },

  // Get GTM Strategies
  async getGTMStrategies(userId: string): Promise<GTMStrategy[]> {
    try {
      const response = await apiClient.get('/pub/v1/onboarding/gtm-strategies');
      return response.data?.gtmStrategies || [];
    } catch (error) {
      console.error('Error fetching GTM strategies:', error);
      throw new Error('Failed to fetch GTM strategies');
    }
  },

  // Get Campaigns
  async getCampaigns(userId: string): Promise<Campaign[]> {
    try {
      const response = await apiClient.get('/pub/v1/campaigns');
      return response.data?.campaigns || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw new Error('Failed to fetch campaigns');
    }
  }
};
