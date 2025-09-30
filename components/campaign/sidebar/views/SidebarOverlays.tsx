'use client';

import React from 'react';
import AudienceCreationManager from '../../audience/AudienceCreationManager';
import Drawer from '@/components/ui/Drawer';
import NodeEditor from '../../NodeEditor';

interface SidebarOverlaysProps {
  currentView: string;
  onBackToMain: () => void;
  onAudienceCreationComplete: (audienceData?: any) => void;
  selectedNodeForEdit: any;
  onCloseDrawer: () => void;

}

const SidebarOverlays: React.FC<SidebarOverlaysProps> = ({
  currentView,
  onBackToMain,
  onAudienceCreationComplete,
  selectedNodeForEdit,
  onCloseDrawer,

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

  if (currentView === 'node-editor') {
    return (
      <Drawer isOpen={true} onClose={onCloseDrawer} title="Node Editor">
        <NodeEditor nodeData={selectedNodeForEdit} onClose={onCloseDrawer} />
      </Drawer>
    );
  }

  return null;
};

export default SidebarOverlays;


