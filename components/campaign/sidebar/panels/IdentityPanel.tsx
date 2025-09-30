'use client';

import React from 'react';
import ReusableSelect from '@/components/ui/ReusableSelect';
import ReusableButton from '@/components/ui/ReusableButton';
import { Plus } from 'lucide-react';

interface IdentityPanelProps {
  identities: any[];
  selectedIdentityId: string | null;
  onIdentitySelect: (id: string) => void;
  onCreateNewIdentity: () => void;
  attachedIdentities?: any[];
}

const IdentityPanel: React.FC<IdentityPanelProps> = ({
  identities,
  selectedIdentityId,
  onIdentitySelect,
  onCreateNewIdentity,
  attachedIdentities,
}) => {
  return (
    <div className="mt-4 space-y-3">
      <ReusableSelect
        options={identities}
        value={selectedIdentityId}
        onChange={onIdentitySelect}
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

      {attachedIdentities && attachedIdentities.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-semibold text-gray-700 mb-2">Campaign Identities</div>
          <div className="space-y-2">
            {attachedIdentities.map((ci: any) => {
              const idObj = ci.identity || ci;
              return (
                <div key={ci.id || idObj.id} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                  <img
                    src={idObj.image || '/images/default-avatar.png'}
                    onError={(e: any) => (e.currentTarget.src = '/images/default-avatar.png')}
                    alt={idObj.name || 'Identity'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-900 truncate">{idObj.name || 'Unknown Identity'}</div>
                    {idObj.company_name && (
                      <div className="text-[10px] text-gray-500 truncate">{idObj.company_name}</div>
                    )}
                  </div>
                  <span className="ml-auto inline-block w-2 h-2 rounded-full bg-green-500" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ReusableButton
        onClick={onCreateNewIdentity}
        variant="secondary"
        icon={Plus}
        className="w-full"
      >
        Create new identity
      </ReusableButton>
    </div>
  );
};

export default IdentityPanel;


