import { apiClient } from '../lib/apiClient';

export interface ImportLeadRequest {
  identity_id: string;
  audience_name: string;
  import_type: string;
  campaign_id: any;
  count?: number;
  linkedin_search_url?: string;
  post_url?: string;
  event_url?: string;
}

export interface ImportLeadResponse {
  success: boolean;
  data?: {
    request_id?: string;
    leads?: any[];
  };
  message?: string;
}

export const leadsImportService = {
  /**
   * Import leads using the lead scraper (matches frontend_old)
   */
  importLeadScrapper: async (request: ImportLeadRequest): Promise<ImportLeadResponse> => {
    try {
      const response = await apiClient.post('/pub/v1/leads/import-lead-scrapper', request);
      return response.data;
    } catch (error) {
      console.error('Error importing leads:', error);
      throw error;
    }
  },

  /**
   * Get lead import status
   */
  getLeadImportStatus: async (importId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/v1/lead-import-status/${importId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting lead import status:', error);
      throw error;
    }
  },

  /**
   * Get scraping progress
   */
  getScrapingProgress: async (requestId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/pub/v1/leads/scraping-progress/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting scraping progress:', error);
      throw error;
    }
  }
};
