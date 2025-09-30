'use client';

import React from 'react';
import AudiencePanel from './AudiencePanel';
import IdentityPanel from './IdentityPanel';
import ContentPanel from './ContentPanel';
import SettingsPanel from './SettingsPanel';
import ReusableButton from '@/components/ui/ReusableButton';
import { Plus } from 'lucide-react';

interface MainSidebarContentProps {
  activeStep: string;
  onStepChange: (step: string) => void;
  audiences: any[];
  selectedAudience: any | null;
  onAudienceSelect: (id: string) => void;
  onCreateNewAudience: () => void;
  identities: any[];
  attachedIdentities?: any[];
  selectedIdentityDropdown: string | null;
  onIdentitySelect: (id: string) => void;
  onCreateNewIdentity: () => void;
  onContentClick: () => void; // kept for compatibility (no longer used)
  onNodeClick: (nodeId: string, nodeData: any) => void;
 
  audienceLoading?: boolean;
  audienceError?: string | null;
  campaignId: string;
}

const MainSidebarContent: React.FC<MainSidebarContentProps> = ({
  activeStep,
  audiences,
  selectedAudience,
  onAudienceSelect,
  onCreateNewAudience,
  identities,
  attachedIdentities,
  selectedIdentityDropdown,
  onIdentitySelect,
  onCreateNewIdentity,
  onContentClick,
  onNodeClick,
 
  audienceLoading,
  audienceError,
  campaignId,
}) => {
  const LaunchContent = () => (
    <div className="mt-4 space-y-3">
      <div className="text-center py-4">
        <div className="text-sm text-gray-600 mb-2">Campaign not ready to launch</div>
        <div className="text-xs text-gray-500">Complete all previous steps to launch</div>
      </div>
      <ReusableButton disabled variant="secondary" icon={Plus} className="w-full">
        Launch Campaign
      </ReusableButton>
    </div>
  );

  switch (activeStep) {
    case 'workflow':
      return (
        <div className="mt-4 space-y-4">
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Builder Guide</h3>
            <p className="text-sm text-gray-600">Learn how to create effective automation workflows</p>
          </div>
        </div>
      );
    case 'audience':
      return (
        <AudiencePanel
          audiences={audiences}
          selectedAudience={selectedAudience}
          onAudienceSelect={onAudienceSelect}
          onCreateNewAudience={onCreateNewAudience}
          audienceLoading={audienceLoading}
          audienceError={audienceError}
        />
      );
    case 'identity':
      return (
        <IdentityPanel
          identities={identities}
          selectedIdentityId={selectedIdentityDropdown}
          onIdentitySelect={onIdentitySelect}
          onCreateNewIdentity={onCreateNewIdentity}
          attachedIdentities={attachedIdentities}
        />
      );
    case 'content':
      return <ContentPanel campaignId={campaignId} />;
    case 'launch':
      return <LaunchContent />;
    case 'settings':
      return <SettingsPanel campaignId={campaignId} />;
    default:
      return (
        <div className="mt-4 space-y-4">
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Builder Guide</h3>
            <p className="text-sm text-gray-600">Learn how to create effective automation workflows</p>
          </div>
        </div>
      );
  }
};

export default MainSidebarContent;


