'use client';

import React from 'react';
import AudienceCreationManager from '../../audience/AudienceCreationManager';
import Drawer from '@/components/ui/Drawer';
import NodeEditor from '../../NodeEditor';

interface SidebarOverlaysProps {
  currentView: string;
  onBackToMain: () => void;
  onAudienceCreationComplete: (audienceData?: any) => void;
 

}

const SidebarOverlays: React.FC<SidebarOverlaysProps> = ({
  currentView,
  onBackToMain,
  onAudienceCreationComplete,
 

}) => {
  if (currentView === 'audience-creation') {
    return (
      <AudienceCreationManager
        isOpen={true}
        onClose={onBackToMain}
        onComplete={onAudienceCreationComplete}
      />
    );
  }

 

  return null;
};

export default SidebarOverlays;


