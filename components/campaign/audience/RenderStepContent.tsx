import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Search } from 'lucide-react';

import { Identity } from '@/services/identityService';
import { getImportMethodsByCategory, getImportMethodConfig } from '@/constants/linkedinImportMethods';

import ImportMethodCard from './ImportMethodCard';
import ImportForm from './ImportForm';

export interface ImportProgressProps {
  requestId?: string;
  status?: string;
  percentage: number;
  message?: string;
  scrapedCount?: number;
  totalCount?: number;
}

interface RenderStepContentProps {
  step: number;
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  selectedIdentity: Identity | null;
  identities: Identity[];
  onIdentitySelect: (id: string) => void;
  searchURL: string;
  onSearchURLChange: (value: string) => void;
  audienceName: string;
  onAudienceNameChange: (value: string) => void;
  onImport: () => void | Promise<void>;
  loading: boolean;
  importProgress: ImportProgressProps | null;
  isPolling: boolean;
}

const RenderStepContent: React.FC<RenderStepContentProps> = ({
  step,
  selectedMethod,
  onSelectMethod,
  selectedIdentity,
  identities,
  onIdentitySelect,
  searchURL,
  onSearchURLChange,
  audienceName,
  onAudienceNameChange,
  onImport,
  loading,
  importProgress,
  isPolling
}) => {
  const shouldShowProgress = Boolean(importProgress && (isPolling || importProgress.status));
  const progressPercentage = Math.min(Math.max(importProgress?.percentage ?? 0, 0), 100);
  const progressStatus = importProgress?.status || (isPolling ? 'processing' : undefined);

  const getProgressColor = () => {
    if (progressStatus === 'completed') return 'bg-green-500';
    if (progressStatus === 'failed') return 'bg-red-500';
    return 'bg-blue-500';
  };

  const getProgressLabel = () => {
    if (progressStatus === 'completed') return 'Import completed';
    if (progressStatus === 'failed') return 'Import failed';
    return 'Import in progress';
  };
  switch (step) {
    case 1:
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Import People Who...</h2>
            <p className="text-gray-600">Choose how you want to find and import leads from LinkedIn.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Import People Who...</h3>
              {getImportMethodsByCategory('people_who').map((method, index) => (
                <ImportMethodCard
                  key={method.id}
                  method={method}
                  isSelected={selectedMethod === method.id}
                  onSelect={onSelectMethod}
                  delay={0.1 * (index + 1)}
                />
              ))}
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-500 bg-white">Or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Import from LinkedIn Search</h3>
              {getImportMethodsByCategory('search').map((method, index) => (
                <ImportMethodCard
                  key={method.id}
                  method={method}
                  isSelected={selectedMethod === method.id}
                  onSelect={onSelectMethod}
                  delay={0.1 * (index + 5)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      );

    case 2:
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Copy the URL</h2>
            <p className="text-gray-600">Once you found the leads to import, copy-paste the LinkedIn URL in AlphaGrowth.</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 space-y-4">
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                  linkedin.com/search/results/people/?keywords
                </div>
              </div>

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <ImportForm
            selectedMethod={selectedMethod}
            methodConfig={getImportMethodConfig(selectedMethod)}
            selectedIdentity={selectedIdentity}
            identities={identities}
            onIdentitySelect={onIdentitySelect}
            searchURL={searchURL}
            onSearchURLChange={onSearchURLChange}
            audienceName={audienceName}
            onAudienceNameChange={onAudienceNameChange}
            onImport={onImport}
            loading={loading}
          />
          {shouldShowProgress && (
            <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span>{getProgressLabel()}</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {importProgress?.scrapedCount !== undefined && (
                <div className="text-xs text-gray-500">
                  {importProgress.scrapedCount}/{importProgress.totalCount ?? '—'} leads processed
                </div>
              )}
              <div className="text-sm text-gray-600">
                {importProgress?.message ||
                  (progressStatus === 'completed'
                    ? 'Scraping completed successfully.'
                    : 'Hang tight while we import your leads.')}
              </div>
              {importProgress?.requestId && (
                <div className="text-xs text-gray-400">
                  Request ID: <span className="font-mono">{importProgress.requestId}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      );

    default:
      return null;
  }
};

export default RenderStepContent;