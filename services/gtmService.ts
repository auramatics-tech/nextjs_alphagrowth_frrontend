import { apiClient } from '../lib/apiClient';

// --- Types ---
export interface GTMStrategy {
  id: string;
  gtmName: string;
  mainObjectives?: string | object;
  keyCustomerPainPoint?: string;
  coreValueProposition?: string;
  targetCount?: string;
  goals?: string | object;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGTMRequest {
  gtmName: string;
  mainObjectives: string[];
  keyCustomerPainPoint: string;
  coreValueProposition: string;
  targetCount: string;
  goals: Array<{ goal: string; target: number }>;
}

// --- API Functions ---
export const gtmService = {
  /**
   * Get all GTM strategies
   */
  async getStrategies(): Promise<GTMStrategy[]> {
    try {
      // Use the same API endpoint as the old frontend
      const response = await apiClient.get('/pub/v1/onboarding/gtm-strategies');
      return response.data?.gtmStrategies || [];
    } catch (error) {
      console.error('Error fetching GTM strategies:', error);
      throw new Error('Failed to fetch GTM strategies');
    }
  },

  /**
   * Get all GTM strategies (alias for compatibility)
   */
  async getGTMStrategies(): Promise<GTMStrategy[]> {
    return this.getStrategies();
  },

  /**
   * Get a specific GTM strategy by ID
   */
  async getStrategyById(id: string): Promise<GTMStrategy> {
    try {
      const response = await apiClient.get(`/pub/v1/gtm-strategies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching GTM strategy:', error);
      throw new Error('Failed to fetch GTM strategy');
    }
  },

  /**
   * Create a new GTM strategy
   */
  async createStrategy(data: CreateGTMRequest): Promise<GTMStrategy> {
    try {
      const response = await apiClient.post('/pub/v1/gtm-strategies', data);
      return response.data;
    } catch (error) {
      console.error('Error creating GTM strategy:', error);
      throw new Error('Failed to create GTM strategy');
    }
  },

  /**
   * Update an existing GTM strategy
   */
  async updateStrategy(id: string, data: Partial<CreateGTMRequest>): Promise<GTMStrategy> {
    try {
      const response = await apiClient.put(`/pub/v1/gtm-strategies/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating GTM strategy:', error);
      throw new Error('Failed to update GTM strategy');
    }
  },

  /**
   * Delete a GTM strategy
   */
  async deleteStrategy(id: string): Promise<void> {
    try {
      await apiClient.delete(`/pub/v1/gtm-strategies/${id}`);
    } catch (error) {
      console.error('Error deleting GTM strategy:', error);
      throw new Error('Failed to delete GTM strategy');
    }
  }
};

// --- Utility Functions ---
export const parseGTMObjectives = (objectives: string | object | undefined): string[] => {
  if (!objectives) return [];
  
  if (typeof objectives === 'string') {
    try {
      const parsed = JSON.parse(objectives);
      return Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch {
      return [objectives];
    }
  }
  
  return Object.values(objectives);
};

export const parseGTMGoals = (goals: string | object | undefined): Array<{ goal: string; target: number }> => {
  if (!goals) return [];
  
  if (typeof goals === 'string') {
    try {
      return JSON.parse(goals);
    } catch {
      return [];
    }
  }
  
  return Array.isArray(goals) ? goals : [];
};
