'use client';

import React from 'react';
import ReusableSelect from '@/components/ui/ReusableSelect';
import ReusableButton from '@/components/ui/ReusableButton';
import { Plus } from 'lucide-react';

interface AudiencePanelProps {
  audiences: any[];
  selectedAudience: any | null;
  onAudienceSelect: (id: string) => void;
  onCreateNewAudience: () => void;
  audienceLoading?: boolean;
  audienceError?: string | null;
}

const AudiencePanel: React.FC<AudiencePanelProps> = ({
  audiences,
  selectedAudience,
  onAudienceSelect,
  onCreateNewAudience,
  audienceLoading,
  audienceError,
}) => {
  return (
    <div className="mt-4 space-y-3">
      {/* Loading State */}
      {audienceLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">Loading audiences...</div>
        </div>
      )}

      {/* Error State */}
      {audienceError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-sm text-red-800">{audienceError}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-red-600 underline mt-1"
          >
            Retry
          </button>
        </div>
      )}

      {/* Audience Selector */}
      {!audienceLoading && !audienceError && (
        <ReusableSelect
          options={audiences.map((audience) => ({
            id: audience.id,
            name: audience.name || audience.audience_name,
            count: audience.leadCount || audience.audienceLeads?.length || 0,
            description: audience.description || '',
          }))}
          value={selectedAudience?.id || null}
          onChange={onAudienceSelect}
          placeholder="Select an audience"
          showCount={true}
        />
      )}

      {/* No audiences message */}
      {!audienceLoading && !audienceError && !selectedAudience && audiences.length === 0 && (
        <div className="text-center py-4">
          <div className="text-sm text-gray-600 mb-2">No audiences found</div>
          <div className="text-xs text-gray-500">Create your first audience</div>
        </div>
      )}

      {/* Selected audience info */}
      {!audienceLoading && !audienceError && selectedAudience && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div>
            <div className="font-medium text-blue-900 text-sm">
              {selectedAudience.name || selectedAudience.audience_name}
            </div>
            <div className="text-xs text-blue-700 mt-1">
              {selectedAudience.leadCount || selectedAudience.audienceLeads?.length || 0} contacts
            </div>
            {selectedAudience.description && (
              <div className="text-xs text-blue-600 mt-1">{selectedAudience.description}</div>
            )}
          </div>
        </div>
      )}

      {/* Create new audience button */}
      <div className="pt-4 border-t border-gray-200">
        <ReusableButton
          onClick={onCreateNewAudience}
          variant="secondary"
          icon={Plus}
          className="w-full"
          disabled={audienceLoading}
        >
          {audienceLoading ? 'Loading...' : 'Create new audience'}
        </ReusableButton>
      </div>
    </div>
  );
};

export default AudiencePanel;


