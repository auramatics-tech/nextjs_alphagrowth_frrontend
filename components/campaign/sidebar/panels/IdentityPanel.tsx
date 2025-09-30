'use client';

import React, { useCallback, useState } from 'react';
import ReusableSelect from '@/components/ui/ReusableSelect';
import ReusableButton from '@/components/ui/ReusableButton';
import { Plus } from 'lucide-react';
import campaignService from '@/services/campaignService';
import { useParams } from 'next/navigation';
import useIdentities from '@/hooks/useIdentities';

interface IdentityPanelProps {




}

const IdentityPanel: React.FC<IdentityPanelProps> = ({




}) => {
  const params = useParams();
  const campaignId = params.campaignId as string;
  const { identities, selectIdentity, attachIdentityToCampaign } = useIdentities({ autoFetch: true, linkedInOnly: true, campaignId });


  const [selectedIdentityDropdown, setSelectedIdentityDropdown] = useState<string | null>(null);


  const [attachedIdentities, setAttachedIdentities] = useState<any[]>([]);
  const loadAttachedIdentities = useCallback(async () => {
    try {
      const data = await campaignService.getCampaignFlow(campaignId);
      const items = data?.data?.identities || [];
      setAttachedIdentities(items);
    } catch (e) {
      // noop
    }
  }, [campaignId]);

  React.useEffect(() => {
    loadAttachedIdentities();
  }, [loadAttachedIdentities]);

  const handleIdentitySelect = useCallback(async (id: string) => {

    // Attach to campaign like frontend_old
    const ok = await attachIdentityToCampaign(id);
    if (ok) {
      // refresh campaign identities list
      loadAttachedIdentities();
    }
  }, [selectIdentity, attachIdentityToCampaign]);

  return (
    <div className="mt-4 space-y-3">
      <ReusableSelect
        options={identities}
        value={selectedIdentityDropdown}
        onChange={handleIdentitySelect}
        placeholder="Select an identity"
        showEmail={true}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      {identities.length == 0 && (
        <div className="text-center py-4">
          <div className="text-sm text-gray-600 mb-2">No identities found</div>
          <div className="text-xs text-gray-500">Create your first identity</div>
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


    </div>
  );
};

export default IdentityPanel;


