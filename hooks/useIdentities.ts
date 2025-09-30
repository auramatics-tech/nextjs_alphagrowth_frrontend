import { useState, useCallback, useEffect } from 'react';
import { identityService, Identity } from '../services/identityService';
import { campaignIdentitiesService } from '../services/campaignIdentitiesService';

interface UseIdentitiesOptions {
  autoFetch?: boolean;
  linkedInOnly?: boolean;
  campaignId?: string;
}

interface UseIdentitiesReturn {
  identities: Identity[];
  selectedIdentity: Identity | null;
  loading: boolean;
  error: string | null;
  fetchIdentities: () => Promise<void>;
  selectIdentity: (id: string) => void;
  createIdentity: (name: string, email?: string) => Promise<Identity | null>;
  refreshIdentities: () => Promise<void>;
  setSelectedIdentity: (identity: Identity | null) => void;
  clearError: () => void;
  attachIdentityToCampaign: (identityId: string) => Promise<boolean>;
}

export const useIdentities = (options: UseIdentitiesOptions = {}): UseIdentitiesReturn => {
  const { autoFetch = true, linkedInOnly = false, campaignId } = options;
  
  // State
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch identities
  const fetchIdentities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedIdentities = linkedInOnly 
        ? await identityService.getLinkedInIdentities()
        : await identityService.getIdentities();
      
      setIdentities(fetchedIdentities);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch identities';
      setError(errorMessage);
      console.error('Error fetching identities:', err);
    } finally {
      setLoading(false);
    }
  }, [linkedInOnly]);

  // Select identity
  const selectIdentity = useCallback((id: string) => {
    const identity = identities.find(i => i.id === id);
    if (identity) {
      setSelectedIdentity(identity);
    }
  }, [identities]);

  // Create identity
  const createIdentity = useCallback(async (name: string, email?: string): Promise<Identity | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newIdentity = await identityService.createIdentity({ name, email });
      
      // Add to our local list
      setIdentities(prev => [...prev, newIdentity]);
      
      console.log('Identity created successfully!');
      return newIdentity;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create identity';
      setError(errorMessage);
      console.error('Error creating identity:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh identities (alias for fetchIdentities)
  const refreshIdentities = useCallback(async () => {
    await fetchIdentities();
  }, [fetchIdentities]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Attach identity to a campaign (mirrors frontend_old behavior)
  const attachIdentityToCampaign = useCallback(async (identityId: string): Promise<boolean> => {
    if (!campaignId) return false;
    try {
      setLoading(true);
      setError(null);
      const res = await campaignIdentitiesService.attachIdentity({
        campaign_id: campaignId,
        identity_id: identityId,
      });
      return true;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to attach identity to campaign';
      setError(errorMessage);
      console.error('Error attaching identity:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchIdentities();
    }
  }, [autoFetch, fetchIdentities]);

  return {
    identities,
    selectedIdentity,
    loading,
    error,
    fetchIdentities,
    selectIdentity,
    createIdentity,
    refreshIdentities,
    setSelectedIdentity,
    clearError,
    attachIdentityToCampaign
  };
};

export default useIdentities;
