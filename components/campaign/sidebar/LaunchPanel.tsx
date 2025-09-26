import React from 'react';
import ReusableButton from '@/components/ui/ReusableButton';
import { Send } from 'lucide-react';

const LaunchPanel = () => (
  <div className="mt-4 space-y-3">
    <div className="text-center py-4">
      <div className="text-sm text-gray-600 mb-2">Campaign not ready to launch</div>
      <div className="text-xs text-gray-500">Complete all previous steps to launch</div>
    </div>
    <ReusableButton disabled variant="secondary" icon={Send} className="w-full">
      Launch Campaign
    </ReusableButton>
  </div>
);

export default LaunchPanel;



