import React from 'react';
import ReusableButton from '@/components/ui/ReusableButton';
import { MessageSquare } from 'lucide-react';

interface ContentPanelProps {
  onConfigure: () => void;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ onConfigure }) => (
  <div className="mt-4 space-y-3">
    <div className="text-center py-4">
      <div className="text-sm text-gray-600 mb-2">Content not configured</div>
      <div className="text-xs text-gray-500">Click to configure content and messages</div>
    </div>
    <ReusableButton onClick={onConfigure} variant="secondary" icon={MessageSquare} className="w-full">
      Configure Content
    </ReusableButton>
  </div>
);

export default ContentPanel;


