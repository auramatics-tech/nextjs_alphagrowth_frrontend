'use client';

import React, { useState, useCallback, useEffect } from 'react';

import { useParams } from 'next/navigation';

import CampaignSidebarManager from '@/components/campaign/sidebar/CampaignSidebarManager';
import ReactFlowWrapper from '@/components/campaign/ReactFlowWrapper';


import {
  Plus, Loader2
} from 'lucide-react';

export default function WorkflowPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;


  const [shouldOpenNodeSelector, setShouldOpenNodeSelector] = useState(false);
  const [showNodeSelector, setShowNodeSelector] = useState(false);

 

  // Handler for when node selector is opened
  const handleNodeSelectorOpened = () => {

    setShowNodeSelector(true)
  };
 




  return (
    <div className="min-h-screen bg-white relative">



      {/* Main Content */}
      <div className="flex h-screen">
        {/* Main Workflow Area */}
        <div className="flex flex-1">
          {/* Workflow Canvas */}
          <div className="flex-1 transition-all duration-300 relative">
            {/* Add New Step Button - Floating */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleNodeSelectorOpened}
                disabled={false} // Allow adding root nodes - they will be validated in the handler
                className="bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add a new workflow step. All nodes must be connected except the first one."
              >
                <Plus size={16} /> Add New Step
              </button>
            </div>

            {/* React Flow Canvas */}
            <div
              className="bg-white overflow-hidden"
              style={{
                height: '100vh',
                width: '100%',
                position: 'relative'
              }}
            >
              <ReactFlowWrapper
                setShowNodeSelector={setShowNodeSelector}
                showNodeSelector={showNodeSelector}
                campaignId={campaignId}
           
              />
            </div>
          </div>
        </div>

        {/* Self-contained Sidebar Manager */}
        <CampaignSidebarManager
          campaignId={campaignId}



        />
      </div>
    </div>
  );
}

