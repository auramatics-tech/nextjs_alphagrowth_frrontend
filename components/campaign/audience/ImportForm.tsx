'use client';

import React from 'react';
import { ImportMethodConfig } from '@/constants/linkedinImportMethods';
import { Identity } from '@/services/identityService';

interface ImportFormProps {
  selectedMethod: string;
  methodConfig: ImportMethodConfig | undefined;
  selectedIdentity: Identity | null;
  identities: Identity[];
  onIdentitySelect: (identityId: string) => void;
  searchURL: string;
  onSearchURLChange: (url: string) => void;
  audienceName: string;
  onAudienceNameChange: (name: string) => void;
  onImport: () => void;
  loading: boolean;
}

const ImportForm: React.FC<ImportFormProps> = ({
 
  methodConfig,
  selectedIdentity,
  identities,
  onIdentitySelect,
  searchURL,
  onSearchURLChange,
  audienceName,
  onAudienceNameChange,
  onImport,
  loading
}) => {
  if (!methodConfig) return null;

  const isImportDisabled = !selectedIdentity || 
    !audienceName || 
    (methodConfig.requiresUrl && !searchURL) || 
    loading;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{methodConfig.title}</h2>
        <p className="text-gray-600">{methodConfig.description}</p>
      </div>

      <div className="space-y-4">
        {/* Identity Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Identity
          </label>
          <select
            value={selectedIdentity?.id || ''}
            onChange={(e) => onIdentitySelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Identity</option>
            {identities.map((identity) => (
              <option key={identity.id} value={identity.id}>
                {identity.name}
              </option>
            ))}
          </select>
        </div>

        {/* Method-specific URL Input */}
        {methodConfig.requiresUrl && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {methodConfig.urlFieldLabel}
            </label>
            <textarea
              placeholder={methodConfig.urlPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
              value={searchURL}
              onChange={(e) => onSearchURLChange(e.target.value)}
            />
            <div className="text-sm text-gray-500">
              {methodConfig.urlExample}
            </div>
          </div>
        )}

        {/* Method-specific Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-2">
            {methodConfig.instructions.map((instruction, index) => (
              <div key={index} className="text-sm text-blue-800">
                {index + 1}. {instruction}
              </div>
            ))}
          </div>
        </div>

        {/* Audience Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Create New Audience
          </label>
          <input
            type="text"
            placeholder="Enter audience name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={audienceName}
            onChange={(e) => onAudienceNameChange(e.target.value)}
          />
        </div>

        {/* Import Button */}
        <button
          onClick={onImport}
          disabled={isImportDisabled}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Importing...' : 'Import'}
        </button>
      </div>
    </div>
  );
};

export default ImportForm;
