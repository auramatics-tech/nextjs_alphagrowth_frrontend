'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';
import { CAMPAIGN_STEPS } from '@/constants/campaign';
import { useAudiences } from '@/hooks/useAudiences';
import MainSidebarContent from './panels/MainSidebarContent';
import SidebarOverlays from './views/SidebarOverlays';
import { useIdentities } from '@/hooks/useIdentities';
import { campaignService } from '@/services/campaignService';



interface CampaignSidebarManagerProps {
  campaignId: string;
}

type SidebarView = 'main' | 'audience-creation' | 'content-slider' | 'ai-editor' | 'custom-editor' | 'node-editor';

const CampaignSidebarManager: React.FC<CampaignSidebarManagerProps> = ({
  campaignId,
}) => {
 
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Campaign steps state
  const [activeStep, setActiveStep] = useState('workflow');

  // Sidebar view state
  const [currentView, setCurrentView] = useState<SidebarView>('main');

  // Audience state - using dynamic API data
  const {
    audiences,
    selectedAudience,
    loading: audienceLoading,
    error: audienceError,
    selectAudience: selectAudienceAPI,
    refreshAudiences,


  } = useAudiences({ campaignId, autoFetch: true });
 
  const { identities, selectIdentity, attachIdentityToCampaign } = useIdentities({ autoFetch: true, linkedInOnly: true, campaignId });
  const [selectedIdentityDropdown, setSelectedIdentityDropdown] = useState<string | null>(null);
  const [attachedIdentities, setAttachedIdentities] = useState<any[]>([]);
 
  const loadAttachedIdentities = useCallback(async () => {
    try {
      const data = await campaignService.getCampaignFlow(campaignId);
      const items = data?.data?.identities || [];
      setAttachedIdentities(items);
    } catch (e) {
      // noop
    }
  }, [campaignId]);

  React.useEffect(() => {
    loadAttachedIdentities();
  }, [loadAttachedIdentities]);


  const [selectedNodeForEdit, setSelectedNodeForEdit] = useState<any>(null);




  // Audience handlers
  const handleAudienceSelect = useCallback(async (id: string) => {
    const success = await selectAudienceAPI(id);
    if (success) {
      
      console.log('Audience selection completed successfully');
    }
  }, [selectAudienceAPI]);

  const handleCreateNewAudience = useCallback(() => {
    setCurrentView('audience-creation');
  }, []);

  const handleAudienceCreationComplete = useCallback(async (audienceData?: any) => {
    console.log('Audience created:', audienceData);
    setCurrentView('main');
    // Refresh audience list to include the new audience
    await refreshAudiences();
  }, [refreshAudiences]);

  // Identity handlers
  const handleIdentitySelect = useCallback(async (id: string) => {
    setSelectedIdentityDropdown(id);
    selectIdentity(id);
    // Attach to campaign like frontend_old
    const ok = await attachIdentityToCampaign(id);
    if (ok) {
      // refresh campaign identities list
      loadAttachedIdentities();
    }
  }, [selectIdentity, attachIdentityToCampaign, loadAttachedIdentities]);

  const handleCreateNewIdentity = useCallback(() => {
    console.log('Create new identity');
  }, []);

  // Content handlers
  const handleContentClick = useCallback(() => {
    setCurrentView('content-slider');
  }, []);





  // Node handlers
  const handleNodeClick = useCallback((nodeId: string, nodeData: any) => {
    setSelectedNodeForEdit({
      id: nodeId,
      type: nodeData.type,
      label: nodeData.label,
      subtitle: nodeData.subtitle,
      iconType: nodeData.iconType
    });
    setCurrentView('node-editor');

  }, []);

useEffect(()=>{
console.log("currentView---",currentView);

},[currentView])

  // View navigation
  const handleBackToMain = useCallback(() => {
    setCurrentView('main');
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setCurrentView('main');
    setSelectedNodeForEdit(null);
  }, []);



  return (
    <>
      {/* Main Sidebar */}
      <div className={`bg-white border-l border-gray-200 transition-all duration-300 flex-shrink-0 ${isFocusMode ? 'w-0 overflow-hidden' : 'w-80'
        }`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Campaign</h3>
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            >
              {isFocusMode ? (
                <Minimize2 size={18} className="text-gray-600" />
              ) : (
                <Maximize2 size={18} className="text-gray-600" />
              )}
            </button>
          </div>

          {/* Campaign Steps */}
          <div className="space-y-0">
            {CAMPAIGN_STEPS.map((step, index) => {
              const IconComponent: any = (step as any).icon;
              const isLast = index === CAMPAIGN_STEPS.length - 1;
              const isActive = activeStep === step.id;

              return (
                <div key={step.id} className="relative">
                  {/* Step Header - Clickable */}
                  <button
                    onClick={() => setActiveStep(isActive ? '' : step.id)}
                    className={`w-full flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 ${isActive
                      ? 'bg-orange-50 rounded-lg ml-1'
                      : (step.status as any) === 'completed'
                        ? 'opacity-75'
                        : ''
                      }`}
                  >
                    {/* Step Indicator */}
                    <div className="relative flex-shrink-0">
                      {/* Connecting Line */}
                      {!isLast && (
                        <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${(step.status as any) === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                          }`}></div>
                      )}

                      {/* Step Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${(step.status as any) === 'completed'
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'btn-primary'
                          : 'bg-white border-2 border-gray-200 text-gray-400'
                        }`}>
                        {(step.status as any) === 'completed' ? (
                          <CheckCircle size={16} className="text-white" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className={`font-semibold text-sm ${isActive
                        ? 'text-gray-900'
                        : (step.status as any) === 'completed'
                          ? 'text-green-700'
                          : 'text-gray-700'
                        }`}>
                        {step.name}
                      </div>
                      <div className={`text-xs ${isActive
                        ? 'text-gray-600'
                        : (step.status as any) === 'completed'
                          ? 'text-green-600'
                          : 'text-gray-400'
                        }`}>
                        {step.description}
                      </div>
                    </div>

                    {/* Step Icon */}
                    <div className="flex-shrink-0">
                      {IconComponent ? (
                        <IconComponent size={18} className={step.color} />
                      ) : null}
                    </div>

                    {/* Chevron Indicator */}
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={{ rotate: isActive ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400"
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    </div>
                  </button>

                  {/* Step Content - Accordion */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <MainSidebarContent
                            activeStep={activeStep}
                            onStepChange={setActiveStep}
                            audiences={audiences}
                            selectedAudience={selectedAudience}
                            onAudienceSelect={handleAudienceSelect}
                            onCreateNewAudience={handleCreateNewAudience}
                            identities={identities}
                            attachedIdentities={attachedIdentities}
                            selectedIdentityDropdown={selectedIdentityDropdown}
                            onIdentitySelect={handleIdentitySelect}
                            onCreateNewIdentity={handleCreateNewIdentity}
                            onContentClick={handleContentClick}
                            onNodeClick={handleNodeClick}

                            audienceLoading={audienceLoading}
                            audienceError={audienceError}
                            campaignId={campaignId}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>





        {/* Floating Focus Mode Toggle (when sidebar is hidden) */}
        {isFocusMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsFocusMode(false)}
            className="fixed top-4 right-4 z-50 p-3 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
            title="Exit Focus Mode"
          >
            <Minimize2 size={20} className="text-gray-600" />
          </motion.button>
        )}
      </div>

      {/* Overlay Views */}
      <SidebarOverlays
        currentView={currentView}
        onBackToMain={handleBackToMain}
        onAudienceCreationComplete={handleAudienceCreationComplete}
        selectedNodeForEdit={selectedNodeForEdit}
        onCloseDrawer={handleCloseDrawer}

      />
    </>
  );
};






export default CampaignSidebarManager;
