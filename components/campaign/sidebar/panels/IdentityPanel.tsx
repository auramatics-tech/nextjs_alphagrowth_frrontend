'use client';

import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import ReusableSelect from '@/components/ui/ReusableSelect';
import ReusableButton from '@/components/ui/ReusableButton';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { identityService } from '@/services/identityService';
import toast from 'react-hot-toast';

interface IdentityPanelProps {
  campaignData?: any; // ✅ Receive campaign data from parent
  onCampaignDataRefresh?: () => Promise<void>; // ✅ Callback to refresh
}

const IdentityPanel: React.FC<IdentityPanelProps> = ({
  campaignData, // ✅ Receive from parent
  onCampaignDataRefresh, // ✅ Callback to refresh
}) => {
  const params = useParams();
  const campaignId = params.campaignId as string;

  // ✅ Simple state for identities - no custom hook
  const [identities, setIdentities] = useState<any[]>([]);
  const [selectedIdentityDropdown, setSelectedIdentityDropdown] = useState<string | null>(null);

  // ✅ Get attached identities directly from campaignData prop
  const attachedIdentities = campaignData?.identities || campaignData?.data?.identities || [];

  // ✅ Fetch identities using identityService
  const fetchIdentities = useCallback(async () => {
    if (!campaignId) return;

    try {
      // ✅ Use identityService method for LinkedIn identities
      const linkedInIdentities = await identityService.getLinkedInIdentities();
      setIdentities(linkedInIdentities);
    } catch (error) {
      console.error('Error fetching identities:', error);
    }
  }, [campaignId]);

  // ✅ Fetch identities on mount
  useEffect(() => {
    fetchIdentities();
  }, [fetchIdentities]);

  // ✅ Attach identity to campaign handler
  const handleIdentitySelect = useCallback(async (id: string) => {
    if (!campaignId) return;

    try {
      // ✅ Use identityService method to attach identity
      const response = await identityService.attachIdentityToCampaign(campaignId, id);
      console.log('Identity attached successfully:', response);
      
      // ✅ Refresh parent campaign data to get updated identities
      if (onCampaignDataRefresh) {
        await onCampaignDataRefresh();
      }
    } catch (error:any) {
      console.error('Error attaching identity to campaign:', error);
      if(error?.response?.data?.error){
        toast.error(error?.response?.data?.error)
      }
    }
  }, [campaignId, onCampaignDataRefresh]);

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

      {identities.length === 0 && (
        <div className="text-center py-4 space-y-2">
          <div className="text-sm text-gray-600">No identities found</div>
          <div className="text-xs text-gray-500">Create your first identity</div>
          <Link
            href={`/identities?campaignId=${campaignId}`}
            className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-600"
          >
           Create new identity
          </Link>
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


