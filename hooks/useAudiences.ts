import { useState, useCallback, useEffect } from 'react';
import { audienceService, Audience } from '../services/audienceService';
import { campaignService } from '../services/campaignService';

interface UseAudiencesOptions {
  campaignId?: string;
  autoFetch?: boolean;
}

interface UseAudiencesReturn {
  audiences: Audience[];
  selectedAudience: Audience | null;
  loading: boolean;
  error: string | null;
  fetchAudiences: () => Promise<void>;
  selectAudience: (audienceId: string) => Promise<boolean>;
  createAudience: (name: string, description?: string) => Promise<Audience | null>;
  refreshAudiences: () => Promise<void>;
  setSelectedAudience: (audience: Audience | null) => void;
  clearError: () => void;
  fetchCampaignFlow: () => Promise<void>;
}

export const useAudiences = (options: UseAudiencesOptions = {}): UseAudiencesReturn => {
  const { campaignId, autoFetch = true } = options;
  
  // State
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch audiences from API
  const fetchAudiences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedAudiences = await audienceService.getAudiences(campaignId);
      setAudiences(fetchedAudiences);
      
      // If we have a selected audience, make sure it's still in the list
      if (selectedAudience) {
        const stillExists = fetchedAudiences.find(a => a.id === selectedAudience.id);
        if (!stillExists) {
          setSelectedAudience(null);
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch audiences';
      setError(errorMessage);
      console.error('Error fetching audiences:', err);
    } finally {
      setLoading(false);
    }
  }, [campaignId, selectedAudience]);

  // Fetch campaign flow data (like frontend_old)
  const fetchCampaignFlow = useCallback(async () => {
    if (!campaignId) return;
    
    try {
      const data = await campaignService.getCampaignFlow(campaignId);
      
      // Check if there's a selected audience in the campaign flow data
      if (data?.data?.selectedAudience) {
        const selectedAudienceData = data.data.selectedAudience;
        setSelectedAudience(selectedAudienceData);
        console.log('Selected audience loaded from campaign flow:', selectedAudienceData);
      }
    } catch (err: any) {
      console.error('Error fetching campaign flow:', err);
    }
  }, [campaignId]);

  // Select audience for campaign
  const selectAudience = useCallback(async (audienceId: string): Promise<boolean> => {
    if (!campaignId) {
      console.error('Campaign ID is required to select audience');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call API to select audience (like frontend_old)
      const response = await audienceService.selectAudience(campaignId, audienceId);
      
      if (response.success) {
        // Find the selected audience in our list
        const audience = audiences.find(a => a.id === audienceId);
        if (audience) {
          setSelectedAudience(audience);
          console.log('Audience selected successfully!');
          
          // Fetch updated campaign flow data (like frontend_old)
          await fetchCampaignFlow();
          
          return true;
        } else {
          console.error('Selected audience not found');
          return false;
        }
      } else {
        console.error('Failed to select audience:', response.message);
        setError(response.message || 'Failed to select audience');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to select audience';
      setError(errorMessage);
      console.error('Error selecting audience:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [campaignId, audiences, fetchCampaignFlow]);

  // Create new audience
  const createAudience = useCallback(async (name: string, description?: string): Promise<Audience | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newAudience = await audienceService.createAudience({ name, description });
      
      // Add to our local list
      setAudiences(prev => [...prev, newAudience]);
      
      console.log('Audience created successfully!');
      return newAudience;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create audience';
      setError(errorMessage);
      console.error('Error creating audience:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh audiences (alias for fetchAudiences)
  const refreshAudiences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedAudiences = await audienceService.getAudiences(campaignId);
      setAudiences(fetchedAudiences);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch audiences';
      setError(errorMessage);
      console.error('Error fetching audiences:', err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  // Auto-fetch on mount and when campaignId changes
  useEffect(() => {
    if (autoFetch && campaignId) {
      // Inline fetchAudiences to avoid dependency issues
      const fetchAudiencesInline = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const fetchedAudiences = await audienceService.getAudiences(campaignId);
          setAudiences(fetchedAudiences);
        } catch (err: any) {
          const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch audiences';
          setError(errorMessage);
          console.error('Error fetching audiences:', err);
        } finally {
          setLoading(false);
        }
      };

      // Inline fetchCampaignFlow to avoid dependency issues
      const fetchCampaignFlowInline = async () => {
        try {
          const data = await campaignService.getCampaignFlow(campaignId);
          
          // Check if there's a selected audience in the campaign flow data
          if (data?.data?.selectedAudience) {
            const selectedAudienceData = data.data.selectedAudience;
            setSelectedAudience(selectedAudienceData);
            console.log('Selected audience loaded from campaign flow:', selectedAudienceData);
          }
        } catch (err: any) {
          console.error('Error fetching campaign flow:', err);
        }
      };

      fetchAudiencesInline();
      fetchCampaignFlowInline();
    }
  }, [autoFetch, campaignId]); // Remove selectedAudience from dependencies to prevent infinite loop

  return {
    audiences,
    selectedAudience,
    loading,
    error,
    fetchAudiences,
    selectAudience,
    createAudience,
    refreshAudiences,
    setSelectedAudience,
    clearError,
    fetchCampaignFlow
  };
};

export default useAudiences;
