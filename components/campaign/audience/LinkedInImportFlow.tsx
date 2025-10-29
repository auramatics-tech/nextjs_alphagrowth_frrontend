'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Compass, Search, Users, CheckCircle } from 'lucide-react';
import { LinkedInLead } from '@/services/linkedinService';
import { useIdentities } from '@/hooks/useIdentities';
import { leadsImportService, ImportLeadRequest } from '@/services/leadsImportService';
import { LINKEDIN_IMPORT_METHODS, getImportMethodsByCategory, getImportMethodConfig } from '@/constants/linkedinImportMethods';
import ImportMethodCard from './ImportMethodCard';
import ImportForm from './ImportForm';

interface LinkedInImportFlowProps {
  step: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: (leads?: LinkedInLead[]) => void;
  campaignId?: string;
}

const LinkedInImportFlow: React.FC<LinkedInImportFlowProps> = ({
  step,
  onBack,
  onNext,
  onComplete,
  campaignId
}) => {
 
   
 
  const [searchURL, setSearchURL] = useState('');
  const [audienceName, setAudienceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  
  // Identity management
  const {
    identities,
    selectedIdentity,
    selectIdentity,
  } = useIdentities({ autoFetch: true, linkedInOnly: true });

 

 

   

  const handleImport = useCallback(async () => {
    if (!selectedIdentity || !audienceName || (selectedMethod !== 'followed_company' && !searchURL)) {
      return;
    }

    setLoading(true);
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
        console.log('Import successful:', response);
        onComplete(response.data?.leads || []);
      } else {
        console.error('Import failed:', response.message);
      }
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedIdentity, searchURL, audienceName, selectedMethod, campaignId, onComplete]);


  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Import People Who...</h2>
              <p className="text-gray-600">
                Choose how you want to find and import leads from LinkedIn.
              </p>
            </div>

            <div className="space-y-4">
              {/* Import People Who... Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Import People Who...</h3>
                {getImportMethodsByCategory('people_who').map((method, index) => (
                  <ImportMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedMethod === method.id}
                    onSelect={setSelectedMethod}
                    delay={0.1 * (index + 1)}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center py-2">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-3 text-sm text-gray-500 bg-white">Or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Import from LinkedIn Search Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Import from LinkedIn Search</h3>
                {getImportMethodsByCategory('search').map((method, index) => (
                  <ImportMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedMethod === method.id}
                    onSelect={setSelectedMethod}
                    delay={0.1 * (index + 5)} // Start after people_who methods
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Copy the URL</h2>
              <p className="text-gray-600">
                Once you found the leads to import, copy-paste the LinkedIn URL in AlphaGrowth.
              </p>
            </div>

            {/* Simulated LinkedIn Browser */}
            <div className="bg-gray-100 rounded-lg p-4 space-y-4">
              <div className="bg-white rounded-lg p-4 space-y-3">
                {/* Browser Header */}
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                    linkedin.com/search/results/people/?keywords
                  </div>
                </div>

                {/* LinkedIn Interface */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Linkedin size={20} className="text-blue-600" />
                    <div className="flex-1 h-8 bg-gray-100 rounded flex items-center px-3">
                      <Search size={16} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Results</div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ImportForm
              selectedMethod={selectedMethod}
              methodConfig={getImportMethodConfig(selectedMethod)}
              selectedIdentity={selectedIdentity}
              identities={identities}
              onIdentitySelect={selectIdentity}
              searchURL={searchURL}
              onSearchURLChange={setSearchURL}
              audienceName={audienceName}
              onAudienceNameChange={setAudienceName}
              onImport={handleImport}
              loading={loading}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="p-6">
        {renderStepContent()}
        
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
