import { useState, useCallback } from 'react';
import { Campaign } from '../services/campaignService';

interface UseCreateCampaignModalReturn {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  isCreating: boolean;
  setIsCreating: (creating: boolean) => void;
  onSuccess?: (campaign: Campaign) => void;
  setOnSuccess: (callback: (campaign: Campaign) => void) => void;
}

/**
 * Custom hook for managing the Create Campaign Modal state
 * Provides centralized state management for the modal
 */
export function useCreateCampaignModal(): UseCreateCampaignModalReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [onSuccess, setOnSuccess] = useState<((campaign: Campaign) => void) | undefined>(undefined);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (!isCreating) {
      setIsModalOpen(false);
      setIsCreating(false);
    }
  }, [isCreating]);

  return {
    isModalOpen,
    openModal,
    closeModal,
    isCreating,
    setIsCreating,
    onSuccess,
    setOnSuccess
  };
}
