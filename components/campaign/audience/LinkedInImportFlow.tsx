'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

import { LinkedInLead } from '@/services/linkedinService';
import { useIdentities } from '@/hooks/useIdentities';
import { leadsImportService, ImportLeadRequest } from '@/services/leadsImportService';

import RenderStepContent, { ImportProgressProps } from './RenderStepContent';

const POLLING_INTERVAL = 5000;

interface LinkedInImportFlowProps {
  step: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: (leads?: LinkedInLead[]) => void;
  campaignId?: string;
}

const LinkedInImportFlow: React.FC<LinkedInImportFlowProps> = ({ step, onBack, onNext, onComplete, campaignId }) => {
  const [searchURL, setSearchURL] = useState('');
  const [audienceName, setAudienceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [importProgress, setImportProgress] = useState<ImportProgressProps | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Identity management
  const { identities, selectedIdentity, selectIdentity } = useIdentities({ autoFetch: true, linkedInOnly: true });

  const clearPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const fetchScrapingProgress = useCallback(
    async (requestId: string) => {
      try {
        const progressResponse = await leadsImportService.getScrapingProgress(requestId);
        const progressData = progressResponse?.data;

        if (!progressResponse?.success || !progressData) {
          return;
        }

        const percentage =
          typeof progressData.percentage === 'number'
            ? progressData.percentage
            : progressData.totalCount
              ? Math.round((progressData.scrapedCount / progressData.totalCount) * 100)
              : 0;

        setImportProgress({
          requestId,
          status: progressData.status,
          percentage,
          message: progressData.message || progressResponse.message,
          scrapedCount: progressData.scrapedCount,
          totalCount: progressData.totalCount
        });

        if (progressData.status === 'completed') {
          clearPolling();
          onComplete(progressData.results || []);
        } else if (progressData.status === 'failed') {
          clearPolling();
        }
      } catch (error) {
        console.error('Error fetching scraping progress:', error);
        setImportProgress((prev) => ({
          requestId,
          status: 'failed',
          percentage: prev?.percentage ?? 0,
          message: 'Unable to fetch progress. Please try again.',
          scrapedCount: prev?.scrapedCount,
          totalCount: prev?.totalCount
        }));
        clearPolling();
      }
    },
    [clearPolling, onComplete]
  );

  const startProgressPolling = useCallback(
    (requestId: string, status?: string, message?: string) => {
      setImportProgress({
        requestId,
        status: status || 'processing',
        percentage: 0,
        message: message || 'Scraping in progress...',
        scrapedCount: 0,
        totalCount: undefined
      });
      setIsPolling(true);
      fetchScrapingProgress(requestId);
      pollingIntervalRef.current = setInterval(() => fetchScrapingProgress(requestId), POLLING_INTERVAL);
    },
    [fetchScrapingProgress]
  );

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, [clearPolling]);

  const handleImport = useCallback(async () => {
    if (!selectedIdentity || !audienceName || (selectedMethod !== 'followed_company' && !searchURL)) {
      return;
    }

    setLoading(true);
    clearPolling();
    setImportProgress(null);
    try {
      // Prepare import data based on import type (matches frontend_old)
      const importData: ImportLeadRequest = {
        identity_id: selectedIdentity.id,
        audience_name: audienceName,
        import_type: selectedMethod,
        campaign_id: campaignId || '', // This should be passed as prop
        count: 50 // Default count, could be made configurable
      };

      // Add appropriate URL field based on import type (matches frontend_old)
      if (selectedMethod === 'basic_search') {
        importData.linkedin_search_url = searchURL;
      } else if (['commented_post', 'liked_post'].includes(selectedMethod)) {
        importData.post_url = searchURL;
      } else if (selectedMethod === 'attended_event') {
        importData.event_url = searchURL;
      }
      // followed_company doesn't need URL

      // Call the correct import API (matches frontend_old)
      const response = await leadsImportService.importLeadScrapper(importData);

      if (response.success) {
        const responseData = response as Record<string, any>;
        if (Array.isArray(response.data?.leads) && response.data.leads.length > 0) {
          onComplete(response.data.leads);
        } else {
          const requestId =
            responseData.requestId ??
            responseData.data?.requestId ??
            response.data?.request_id;
          const responseStatus = responseData.status ?? responseData.data?.status;
          const responseMessage = response.message ?? responseData.data?.message;
          if (requestId) {
            startProgressPolling(requestId, responseStatus, responseMessage);
          } else {
            setImportProgress({
              status: 'failed',
              percentage: 0,
              message: responseMessage || 'Unable to start scraping. Please try again.'
            });
          }
        }
      } else {
        console.error('Import failed:', response.message);
        setImportProgress({
          status: 'failed',
          percentage: 0,
          message: response.message || 'Import failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportProgress({
        status: 'failed',
        percentage: 0,
        message: 'Import failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }, [selectedIdentity, searchURL, audienceName, selectedMethod, campaignId, onComplete, startProgressPolling, clearPolling]);


  return (
    <>
      <div className="p-6">
        <RenderStepContent
          step={step}
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
          selectedIdentity={selectedIdentity}
          identities={identities}
          onIdentitySelect={selectIdentity}
          searchURL={searchURL}
          onSearchURLChange={setSearchURL}
          audienceName={audienceName}
          onAudienceNameChange={setAudienceName}
          onImport={handleImport}
          loading={loading || isPolling}
          importProgress={importProgress}
          isPolling={isPolling}
        />
        
        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4 mt-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                step === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-all ${
                    s === step ? 'btn-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={step === 3 ? () => onComplete() : onNext}
              disabled={step === 1 && !selectedMethod}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                step === 3
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'btn-primary'
              } ${step === 1 && !selectedMethod ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {step === 3 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default LinkedInImportFlow;
