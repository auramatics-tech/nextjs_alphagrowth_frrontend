import React from 'react';
import WorkflowGuide from './WorkflowGuide';
import AudiencePanel from './AudiencePanel';
import IdentityPanel from './IdentityPanel';
import ContentPanel from './ContentPanel';
import LaunchPanel from './LaunchPanel';
import SettingsPanel from './SettingsPanel';

interface SidebarContentProps {
  activeStep: string;
  audiences: any[];
  selectedAudience: string | null;
  onAudienceSelect: (id: string) => void;
  showAudiencePanel: boolean;
  showImportPeopleScreen: boolean;
  onCreateNewAudience: () => void;
  identities: any[];
  selectedIdentityDropdown: string | null;
  onIdentitySelect: (id: string) => void;
  onCreateNewIdentity: () => void;
  onContentClick: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  activeStep,
  audiences,
  selectedAudience,
  onAudienceSelect,
  showAudiencePanel,
  showImportPeopleScreen,
  onCreateNewAudience,
  identities,
  selectedIdentityDropdown,
  onIdentitySelect,
  onCreateNewIdentity,
  onContentClick,
}) => {
  const renderContent = () => {
    switch (activeStep) {
      case 'workflow':
        return <WorkflowGuide />;
      case 'audience':
        return (
          <AudiencePanel
            audiences={audiences}
            selectedAudience={selectedAudience}
            onSelect={onAudienceSelect}
            showAudiencePanel={showAudiencePanel}
            showImportPeopleScreen={showImportPeopleScreen}
            onCreateNew={onCreateNewAudience}
          />
        );
      case 'identity':
        return (
          <IdentityPanel
            identities={identities}
            selectedIdentityId={selectedIdentityDropdown}
            onSelect={onIdentitySelect}
            onCreateNew={onCreateNewIdentity}
          />
        );
      case 'content':
        return <ContentPanel onConfigure={onContentClick} />;
      case 'launch':
        return <LaunchPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <WorkflowGuide />;
    }
  };

  return <>{renderContent()}</>;
};

export default SidebarContent;

