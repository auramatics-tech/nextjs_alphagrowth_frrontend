'use client';

import React, { useState, useCallback, useEffect } from 'react';

import { useParams } from 'next/navigation';

import CampaignSidebarManager from '@/components/campaign/sidebar/CampaignSidebarManager';
import ReactFlowWrapper from '@/components/campaign/ReactFlowWrapper';
import { campaignWorkflowService } from '@/services/campaignWorkflowService';

import {
  Plus, Loader2
} from 'lucide-react';

export default function WorkflowPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;

  const [shouldOpenNodeSelector, setShouldOpenNodeSelector] = useState(false);
  const [showNodeSelector, setShowNodeSelector] = useState(false);

  // ✅ CENTRALIZED STATE - Fetch campaign data once
  const [campaignData, setCampaignData] = useState<any>(null);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  // ✅ Fetch campaign flow data once on mount
  const fetchCampaignData = useCallback(async () => {
    if (!campaignId) return;
    
    setIsLoadingCampaign(true);
    setCampaignError(null);
    
    try {
      const response = await campaignWorkflowService.getCampaignFlow(campaignId);
      setCampaignData(response);
      console.log('Campaign data loaded:', response);
    } catch (error: any) {
      console.error('Error fetching campaign data:', error);
      setCampaignError(error.message || 'Failed to load campaign data');
    } finally {
      setIsLoadingCampaign(false);
    }
  }, [campaignId]);

  // ✅ Load data on mount
  useEffect(() => {
    fetchCampaignData();
  }, [fetchCampaignData]);

  // Handler for when node selector is opened
  const handleNodeSelectorOpened = () => {
    setShowNodeSelector(true)
  };
 




  return (
    <div className="min-h-screen bg-white relative">
      {/* Loading State */}
      {isLoadingCampaign && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <Loader2 size={24} className="text-orange-500 animate-spin" />
              <span className="text-gray-700 font-medium">Loading campaign...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {campaignError && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-6 max-w-md">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Campaign</h3>
            <p className="text-red-700 text-sm mb-4">{campaignError}</p>
            <button
              onClick={fetchCampaignData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

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
                disabled={isLoadingCampaign}
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
                campaignData={campaignData}
                onCampaignDataRefresh={fetchCampaignData}
              />
            </div>
          </div>
        </div>

        {/* Self-contained Sidebar Manager */}
        <CampaignSidebarManager
          campaignId={campaignId}
          campaignData={campaignData}
          onCampaignDataRefresh={fetchCampaignData}
        />
      </div>
    </div>
  );
}

