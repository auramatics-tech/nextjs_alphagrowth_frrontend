'use client';

import React from 'react';
import AudiencePanel from './AudiencePanel';
import IdentityPanel from './IdentityPanel';
import ContentPanel from './ContentPanel';
import SettingsPanel from './SettingsPanel';

import LaunchPanel from './LaunchPanel';

interface MainSidebarContentProps {
  activeStep: string;
  onStepChange: (step: string) => void;
  audiences: any[];
  selectedAudience: any | null;
  onAudienceSelect: (id: string) => void;
  onCreateNewAudience: () => void;
  audienceLoading?: boolean;
  audienceError?: string | null;
  campaignId: string;
  campaignData?: any; // ✅ Receive campaign data
  onCampaignDataRefresh?: () => Promise<void>; // ✅ Callback to refresh
}

const MainSidebarContent: React.FC<MainSidebarContentProps> = ({
  activeStep,
  audiences,
  selectedAudience,
  onAudienceSelect,
  onCreateNewAudience,
  audienceLoading,
  audienceError,
  campaignId,
  campaignData, // ✅ Receive from parent
  onCampaignDataRefresh, // ✅ Callback to refresh
}) => {


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
        campaignId={campaignId}
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
          campaignData={campaignData}
          onCampaignDataRefresh={onCampaignDataRefresh}
        />
      );
    case 'content':
      return <ContentPanel campaignId={campaignId} campaignData={campaignData} />;
    case 'launch':
      return <LaunchPanel campaignId={campaignId} />;
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


