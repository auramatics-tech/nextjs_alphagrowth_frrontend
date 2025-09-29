import React from 'react';
import ReusableSelect from '@/components/ui/ReusableSelect';
import ReusableButton from '@/components/ui/ReusableButton';
import { Plus } from 'lucide-react';

interface IdentityPanelProps {
  identities: any[];
  selectedIdentityId: string | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

const IdentityPanel: React.FC<IdentityPanelProps> = ({ identities, selectedIdentityId, onSelect, onCreateNew }) => (
  <div className="mt-4 space-y-3">
    <ReusableSelect
      options={identities}
      value={selectedIdentityId}
      onChange={onSelect}
      placeholder="Select an identity"
      showEmail={true}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
    />

    {!selectedIdentityId && (
      <div className="text-center py-4">
        <div className="text-sm text-gray-600 mb-2">No identities found</div>
        <div className="text-xs text-gray-500">Create your first identity</div>
      </div>
    )}

    {selectedIdentityId && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        {(() => {
          const identity = identities.find((i: any) => i.id === selectedIdentityId);
          return identity ? (
            <div>
              <div className="font-medium text-green-900 text-sm">{identity.name}</div>
              <div className="text-xs text-green-700 mt-1">{identity.email}</div>
              <div className="text-xs text-green-600 mt-1 capitalize">{identity.status}</div>
            </div>
          ) : null;
        })()}
      </div>
    )}

    <ReusableButton onClick={onCreateNew} variant="secondary" icon={Plus} className="w-full">
      Create new identity
    </ReusableButton>
  </div>
);

export default IdentityPanel;





