import React from 'react';
import ReusableSelect from '@/components/ui/ReusableSelect';
import ReusableButton from '@/components/ui/ReusableButton';
import { Plus } from 'lucide-react';

interface AudiencePanelProps {
  audiences: any[];
  selectedAudience: string | null;
  onSelect: (id: string) => void;
  showAudiencePanel: boolean;
  showImportPeopleScreen: boolean;
  onCreateNew: () => void;
}

const AudiencePanel: React.FC<AudiencePanelProps> = ({
  audiences,
  selectedAudience,
  onSelect,
  showAudiencePanel,
  showImportPeopleScreen,
  onCreateNew,
}) => (
  <div className="mt-4 space-y-3">
    <ReusableSelect
      options={audiences}
      value={selectedAudience}
      onChange={onSelect}
      placeholder="Select an audience"
      showCount={true}
    />

    {!selectedAudience && (
      <div className="text-center py-4">
        <div className="text-sm text-gray-600 mb-2">No audiences found</div>
        <div className="text-xs text-gray-500">Create your first audience</div>
      </div>
    )}

    {selectedAudience && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        {(() => {
          const audience = audiences.find((a: any) => a.id === selectedAudience);
          return audience ? (
            <div>
              <div className="font-medium text-blue-900 text-sm">{audience.name}</div>
              <div className="text-xs text-blue-700 mt-1">{audience.count} contacts</div>
              <div className="text-xs text-blue-600 mt-1">{audience.description}</div>
            </div>
          ) : null;
        })()}
      </div>
    )}

    {!showAudiencePanel && !showImportPeopleScreen && (
      <div className="pt-4 border-t border-gray-200">
        <ReusableButton onClick={onCreateNew} variant="secondary" icon={Plus} className="w-full">
          Create new audience
        </ReusableButton>
      </div>
    )}
  </div>
);

export default AudiencePanel;


