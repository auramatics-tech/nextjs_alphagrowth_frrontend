"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, Minimize2, Maximize2, X, Linkedin } from 'lucide-react';
import { useImport } from '@/contexts/ImportContext';
import SidebarContent from '@/components/campaign/sidebar/SidebarContent';
import CSVImportModal from '@/components/campaign/CSVImportModal';
import ImportProgress from '@/components/campaign/ImportProgress';
import Drawer from '@/components/ui/Drawer';
import AIPersonalisationEditor from '@/components/campaign/AIPersonalisationEditor';
import CustomContentEditor from '@/components/campaign/CustomContentEditor';
import NodeEditor from '@/components/campaign/NodeEditor';
import { MOCK_AUDIENCES, MOCK_IDENTITIES, CAMPAIGN_STEPS } from '@/constants/campaign';

interface CampaignRightSidebarProps {
  campaignId: string;
}

const CampaignRightSidebar: React.FC<CampaignRightSidebarProps> = ({ campaignId }) => {
  // Focus mode state
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // Campaign steps state
  const [activeStep, setActiveStep] = useState('workflow');
  
  // Audience state
  const [audiences] = useState(MOCK_AUDIENCES);
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [showAudiencePanel, setShowAudiencePanel] = useState(false);
  const [showImportPeopleScreen, setShowImportPeopleScreen] = useState(false);
  
  // Identity state
  const [identities] = useState(MOCK_IDENTITIES);
  const [selectedIdentityDropdown, setSelectedIdentityDropdown] = useState<string | null>(null);
  
  // Modal and drawer states
  const [isCSVImportModalOpen, setIsCSVImportModalOpen] = useState(false);
  const [showAiEditorDrawer, setShowAiEditorDrawer] = useState(false);
  const [showCustomEditorDrawer, setShowCustomEditorDrawer] = useState(false);
  const [showNodeEditorDrawer, setShowNodeEditorDrawer] = useState(false);
  const [selectedNodeForEdit, setSelectedNodeForEdit] = useState<any>(null);
  
  // Import context
  const { importState, startImport, updateProgress, completeImport, failImport, resetImport } = useImport();

  // CSV Import handler
  const handleCSVImportComplete = useCallback(async (importData: any) => {
    const { file, fieldMappings, previewData } = importData;
    
    try {
      // Start the import process
      startImport(previewData.length);
      
      // Simulate the import process with progress updates
      for (let i = 0; i <= previewData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
        updateProgress(i);
      }
      
      // Complete the import
      completeImport();
      
      // Reset after a delay
      setTimeout(() => {
        resetImport();
      }, 5000);
      
    } catch (error) {
      failImport('Failed to import contacts. Please try again.');
    }
  }, [startImport, updateProgress, completeImport, failImport, resetImport]);

  // Audience handlers
  const handleAudienceSelect = useCallback((id: string) => {
    setSelectedAudience(id);
  }, []);

  const handleCreateNewAudience = useCallback(() => {
    setShowAudiencePanel(true);
  }, []);

  const handleCloseAudiencePanel = useCallback(() => {
    setShowAudiencePanel(false);
  }, []);

  const handleImportFromDatabase = useCallback(() => {
    window.open('http://localhost:3001/people-database', '_blank');
  }, []);

  const handleImportFromLinkedIn = useCallback(() => {
    setShowAudiencePanel(false);
    setShowLinkedInImport(true);
  }, []);

  // Identity handlers
  const handleIdentitySelect = useCallback((id: string) => {
    setSelectedIdentityDropdown(id);
  }, []);

  const handleCreateNewIdentity = useCallback(() => {
    // Handle create new identity
  }, []);

  // Content handlers
  const handleContentClick = useCallback(() => {
    setShowAiEditorDrawer(true);
  }, []);

  // Node handlers
  const handleNodeSave = useCallback((nodeId: string, updatedData: any) => {
    // Handle node save
  }, []);

  return (
    <>
      {/* Right Sidebar */}
      <div className={`bg-white border-l border-gray-200 transition-all duration-300 flex-shrink-0 ${isFocusMode ? 'w-0 overflow-hidden' : 'w-80'}`}>
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
                    className={`w-full flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 ${
                      isActive 
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
                        <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                          (step.status as any) === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                      
                      {/* Step Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        (step.status as any) === 'completed'
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
                      <div className={`font-semibold text-sm ${
                        isActive 
                          ? 'text-gray-900' 
                          : (step.status as any) === 'completed'
                          ? 'text-green-700'
                          : 'text-gray-700'
                      }`}>
                        {step.name}
                      </div>
                      <div className={`text-xs ${
                        isActive 
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
                          <SidebarContent
                            activeStep={activeStep}
                            audiences={audiences}
                            selectedAudience={selectedAudience}
                            onAudienceSelect={handleAudienceSelect}
                            showAudiencePanel={showAudiencePanel}
                            showImportPeopleScreen={showImportPeopleScreen}
                            onCreateNewAudience={handleCreateNewAudience}
                            identities={identities}
                            selectedIdentityDropdown={selectedIdentityDropdown}
                            onIdentitySelect={handleIdentitySelect}
                            onCreateNewIdentity={handleCreateNewIdentity}
                            onContentClick={handleContentClick}
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

        {/* CSV Import Modal */}
        <CSVImportModal
          isOpen={isCSVImportModalOpen}
          onClose={() => setIsCSVImportModalOpen(false)}
          onImportComplete={handleCSVImportComplete}
        />

        {/* Import Progress Indicator */}
        <ImportProgress
          isVisible={importState.isImporting || importState.status === 'completed' || importState.status === 'failed'}
          status={importState.status}
          totalLeads={importState.totalLeads}
          importedLeads={importState.importedLeads}
          onClose={resetImport}
          errorMessage={importState.errorMessage}
        />

        {/* AI Editor Drawer */}
        <Drawer
          isOpen={showAiEditorDrawer}
          onClose={() => setShowAiEditorDrawer(false)}
          title="AI Personalisation Editor"
        >
          <AIPersonalisationEditor />
        </Drawer>

        {/* Custom Content Editor Drawer */}
        <Drawer
          isOpen={showCustomEditorDrawer}
          onClose={() => setShowCustomEditorDrawer(false)}
          title="Custom Content Editor"
        >
          <CustomContentEditor />
        </Drawer>

        {/* Node Editor Drawer */}
        <Drawer
          isOpen={showNodeEditorDrawer}
          onClose={() => setShowNodeEditorDrawer(false)}
          title="Node Editor"
        >
          <NodeEditor
            nodeData={selectedNodeForEdit}
            onClose={() => setShowNodeEditorDrawer(false)}
            onSave={handleNodeSave}
          />
        </Drawer>

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

      {/* Audience Creation Panel */}
      <AnimatePresence>
        {showAudiencePanel && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
          >
            {/* Panel Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Create New Audience</h3>
                <p className="text-sm text-gray-600">Choose how you want to import your audience</p>
              </div>
              <button
                onClick={handleCloseAudiencePanel}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-3">
                {/* Import from Database */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors group"
                  onClick={handleImportFromDatabase}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">AG</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">Import from AlphaGrowth Database</h3>
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">new</span>
                        </div>
                        <p className="text-sm text-gray-600">Import contacts from your existing database</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </motion.div>

                {/* Import from LinkedIn */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors group"
                  onClick={handleImportFromLinkedIn}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Linkedin size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Import from LinkedIn</h3>
                        <p className="text-sm text-gray-600">Import contacts from LinkedIn Sales Navigator</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </motion.div>

                {/* Import from CSV */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsCSVImportModalOpen(true)}
                  className="relative bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center">csv</div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Import from CSV</h3>
                        <p className="text-sm text-gray-600">Upload a CSV file with your contacts</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CampaignRightSidebar;
