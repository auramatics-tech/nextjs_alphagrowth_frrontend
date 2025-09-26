'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useRouter, useParams } from 'next/navigation';
import CampaignSettings from '@/components/campaign/CampaignSettings';
import CampaignRightSidebar from '@/components/campaign/CampaignRightSidebar';
import CSVImportModal from '@/components/campaign/CSVImportModal';
import ImportProgress from '@/components/campaign/ImportProgress';
import CrmImportInfo from '@/components/campaign/CrmImportInfo';
import Drawer from '@/components/ui/Drawer';
import AIPersonalisationEditor from '@/components/campaign/AIPersonalisationEditor';
import CustomContentEditor from '@/components/campaign/CustomContentEditor';
import NodeEditor from '@/components/campaign/NodeEditor';
import ReactFlowWrapper, { ReactFlowWrapperRef } from '@/components/campaign/ReactFlowWrapper';
import { useImport } from '@/contexts/ImportContext';
import ReusableSelect from '@/components/ui/ReusableSelect';
import ReusableButton from '@/components/ui/ReusableButton';
import ReusableForm from '@/components/ui/ReusableForm';
import {
  MessageSquare, Eye, ThumbsUp, Clipboard,
  User, Settings, Users, Send,
  BarChart3, Plus, X, Clock, Minus, MoreVertical, Loader2, CheckCircle,
  UserPlus, UserCheck, MessageCircle, Search, ChevronRight,
  CalendarDays, Linkedin, Compass, Bot, Edit3, Info, ArrowLeft, Maximize2, Minimize2
} from 'lucide-react';

// Constants moved to @/constants/campaign


export default function WorkflowPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;
  const router = useRouter();
  const { importState, startImport, updateProgress, completeImport, failImport, resetImport } = useImport();

  // Main state
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState<{ name: string } | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // React Flow ref for adding root nodes
  const reactFlowRef = useRef<ReactFlowWrapperRef>(null);

  // CSV Import Modal state
  const [isCSVImportModalOpen, setIsCSVImportModalOpen] = useState(false);

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

  // Content slider state
  const [showContentSlider, setShowContentSlider] = useState(false);
  const [selectedContentMode, setSelectedContentMode] = useState<'ai' | 'custom' | null>(null);

  // AI Editor drawer state
  const [showAiEditorDrawer, setShowAiEditorDrawer] = useState(false);

  // Custom Content Editor drawer state
  const [showCustomEditorDrawer, setShowCustomEditorDrawer] = useState(false);

  // Node Editor drawer state
  const [showNodeEditorDrawer, setShowNodeEditorDrawer] = useState(false);
  const [selectedNodeForEdit, setSelectedNodeForEdit] = useState<any>(null);

  // React Flow state
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);


  // Audience creation panel state
  const [showAudiencePanel, setShowAudiencePanel] = useState(false);
  const [audiencePanelView, setAudiencePanelView] = useState<'options' | 'crm-info'>('options');

  // LinkedIn import flow state
  const [showLinkedInImport, setShowLinkedInImport] = useState(false);
  const [linkedInImportStep, setLinkedInImportStep] = useState(1);

  // Import People screen state
  const [showImportPeopleScreen, setShowImportPeopleScreen] = useState(false);
  const [activeImportView, setActiveImportView] = useState<'main' | 'comment' | 'followers' | 'event' | 'like' | 'basic-search' | 'sales-navigator' | 'sales-navigator-list'>('main');




  // Duration change handler
  const handleDurationChange = useCallback((nodeId: string, durationInDays: number) => {
    // You can add additional logic here if needed
  }, []);

  const handleContentModeSelect = useCallback((mode: 'ai' | 'custom') => {
    setSelectedContentMode(mode);
  }, []);

  const handleContentContinue = useCallback(() => {
    if (selectedContentMode) {
      setShowContentSlider(false);

      // Handle AI mode - open drawer instead of navigating
      if (selectedContentMode === 'ai') {
        setShowAiEditorDrawer(true);
      } else if (selectedContentMode === 'custom') {
        // Open custom content editor drawer
        setShowCustomEditorDrawer(true);
      }
    }
  }, [selectedContentMode]);

  const handleCloseContentSlider = useCallback(() => {
    setShowContentSlider(false);
    setSelectedContentMode(null);
  }, []);

  // React Flow handlers
  const handleNodeClick = useCallback((nodeId: string, nodeData: any) => {
    // Open node editor drawer
    setSelectedNodeForEdit({
      id: nodeId,
      type: nodeData.type,
      label: nodeData.label,
      subtitle: nodeData.subtitle,
      iconType: nodeData.iconType
    });
    setShowNodeEditorDrawer(true);
  }, []);

  // Handle node save
  const handleNodeSave = useCallback((nodeId: string, updatedData: any) => {
    // Here you would typically update the node in your workflow tree
    // TODO: Implement actual node update logic
  }, []);



  // Content components for each step
  const WorkflowContent = () => (
    <div className="mt-4 space-y-4">
      {/* Workflow Builder Header */}
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Builder Guide</h3>
        <p className="text-sm text-gray-600">Learn how to create effective automation workflows</p>
      </div>

      {/* Workflow Builder Tips & Rules */}
      <div className="space-y-4">
        {/* Quick Start Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <h3 className="font-semibold text-blue-900">Getting Started</h3>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Click "Add New Step" button to start building your workflow</p>
            <p>• Drag action cards from the canvas to connect nodes</p>
            <p>• Use the "+" buttons on nodes to add sequential steps</p>
          </div>
        </div>

        {/* Connection Rules */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <h3 className="font-semibold text-green-900">Connection Rules</h3>
          </div>
          <div className="text-sm text-green-800 space-y-1">
            <p>• All nodes must be connected (except the first one)</p>
            <p>• Use conditional nodes to create Yes/No branches</p>
            <p>• Each branch can have its own sequence of actions</p>
          </div>
        </div>

        {/* Duration Management */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <h3 className="font-semibold text-orange-900">Timing Control</h3>
          </div>
          <div className="text-sm text-orange-800 space-y-1">
            <p>• Click the edit icon on any node to set execution duration</p>
            <p>• Set delays between actions to avoid spam detection</p>
            <p>• Use wait nodes for longer delays between sequences</p>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">4</span>
            </div>
            <h3 className="font-semibold text-purple-900">Best Practices</h3>
          </div>
          <div className="text-sm text-purple-800 space-y-1">
            <p>• Start with profile visits before sending connection requests</p>
            <p>• Add delays between actions to appear more natural</p>
            <p>• Use conditions to personalize your outreach</p>
          </div>
        </div>
      </div>
    </div>
  );

  const AudienceContent = () => (
    <div className="mt-4 space-y-3">
      {/* Audience Selector */}
      <ReusableSelect
        options={audiences}
        value={selectedAudience}
        onChange={handleAudienceSelect}
        placeholder="Select an audience"
        showCount={true}
      />

      {/* No audiences message */}
      {!selectedAudience && (
        <div className="text-center py-4">
          <div className="text-sm text-gray-600 mb-2">No audiences found</div>
          <div className="text-xs text-gray-500">Create your first audience</div>
        </div>
      )}

      {/* Selected audience info */}
      {selectedAudience && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          {(() => {
            const audience = audiences.find(a => a.id === selectedAudience);
            return audience ? (
              <div>
                <div className="font-medium text-blue-900 text-sm">{audience.name}</div>
                <div className="text-xs text-blue-700 mt-1">{audience.count} contacts</div>
                <div className="text-xs text-blue-600 mt-1">{audience.description}</div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Create new audience button */}
      {!showAudiencePanel && !showImportPeopleScreen && (
        <div className="pt-4 border-t border-gray-200">
          <ReusableButton
            onClick={handleCreateNewAudience}
            variant="secondary"
            icon={Plus}
            className="w-full"
          >
            Create new audience
          </ReusableButton>
        </div>
      )}
    </div>
  );

  const IdentityContent = () => (
    <div className="mt-4 space-y-3">
      {/* Identity Selector */}
      <ReusableSelect
        options={identities}
        value={selectedIdentityDropdown}
        onChange={handleIdentitySelect}
        placeholder="Select an identity"
        showEmail={true}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      {/* No identities message */}
      {!selectedIdentityDropdown && (
        <div className="text-center py-4">
          <div className="text-sm text-gray-600 mb-2">No identities found</div>
          <div className="text-xs text-gray-500">Create your first identity</div>
        </div>
      )}

      {/* Selected identity info */}
      {selectedIdentityDropdown && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          {(() => {
            const identity = identities.find(i => i.id === selectedIdentityDropdown);
            return identity ? (
              <div>
                <div className="font-medium text-green-900 text-sm">{identity.name}</div>
                <div className="text-xs text-green-700 mt-1">{identity.email}</div>
                <div className="text-xs text-green-600 mt-1 capitalize">{identity.status}</div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Create new identity button */}
      <ReusableButton
        onClick={handleCreateNewIdentity}
        variant="secondary"
        icon={Plus}
        className="w-full"
      >
        Create new identity
      </ReusableButton>
    </div>
  );

  const ContentContent = () => (
    <div className="mt-4 space-y-3">
      <div className="text-center py-4">
        <div className="text-sm text-gray-600 mb-2">Content not configured</div>
        <div className="text-xs text-gray-500">Click to configure content and messages</div>
      </div>
      <ReusableButton
        onClick={handleContentClick}
        variant="secondary"
        icon={MessageSquare}
        className="w-full"
      >
        Configure Content
      </ReusableButton>
    </div>
  );

  const LaunchContent = () => (
    <div className="mt-4 space-y-3">
      <div className="text-center py-4">
        <div className="text-sm text-gray-600 mb-2">Campaign not ready to launch</div>
        <div className="text-xs text-gray-500">Complete all previous steps to launch</div>
      </div>
      <ReusableButton
        disabled
        variant="secondary"
        icon={Send}
        className="w-full"
      >
        Launch Campaign
      </ReusableButton>
    </div>
  );

  const SettingsContent = () => (
    <CampaignSettings
      onSave={(settings: any) => {
        // Handle settings save logic here
      }}
    />
  );

  // Handler for adding root nodes
  const handleAddRootNode = () => {
    if (reactFlowRef.current) {
      reactFlowRef.current.openNodeSelectorForRoot();
    }
  };

  // Initialize data
  useEffect(() => {
    setLoading(false);
    setCampaignData({ name: 'Test Campaign' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Content Slider Panel */}
      <AnimatePresence>
        {showContentSlider && (
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
                <h3 className="text-lg font-bold text-gray-900">Content</h3>
                <p className="text-sm text-gray-600">Choose how you want to generate and edit messages</p>
              </div>
              <button

                onClick={handleCloseContentSlider}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >

                <X size={20} className="text-gray-500" />
              </button>

            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Global Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      This choice applies to all channels and steps.
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      You can switch later, but it will delete existing content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Mode Cards */}
              <div className="space-y-4">
                {/* AI Personalisation Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`relative bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${selectedContentMode === 'ai'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => handleContentModeSelect('ai')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Bot size={20} className="text-orange-600" />
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-gray-900">AI Personalisation</h3>
                        <p className="text-sm text-gray-600">Auto-generate one message per channel from LinkedIn profile data.</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedContentMode === 'ai'
                        ? 'border-orange-500 btn-primary'
                        : 'border-gray-300'
                      }`}>
                      {selectedContentMode === 'ai' && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm">Key Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Auto-scrapes profile, bio, company, activity (already implemented)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Generates 1 draft per channel (editable)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Plain text output (no variables)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>LinkedIn: images not supported</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Email: AI output is plain text (you can add images later in editor steps)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Uses GTM form preferences (tone, CTA, length)</span>
                      </li>
                    </ul>
                  </div>


                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Best for:</span> Speed and scale with minimal manual setup
                    </p>
                  </div>
                </motion.div>

                {/* Custom Content Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`relative bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${selectedContentMode === 'custom'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => handleContentModeSelect('custom')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Edit3 size={20} className="text-blue-600" />
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Custom Content</h3>
                        <p className="text-sm text-gray-600">Write your own messages with variable-driven personalization.</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedContentMode === 'custom'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                      }`}>
                      {selectedContentMode === 'custom' && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm">Key Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Rich text editor per channel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Variables available (e.g., {`{{firstName}}`}, {`{{companyName}}`}, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Email: links + image upload</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>LinkedIn: images disabled; character limits enforced</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Voice: plain text only</span>
                      </li>
                    </ul>
                  </div>


                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Best for:</span> Full control and tailored messaging
                    </p>
                  </div>

                  {/* Continue Button */}
                  <div className="mt-4">
                    <button
                      disabled={selectedContentMode !== 'custom'}
                      onClick={handleContentContinue}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${selectedContentMode === 'custom'
                          ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer opacity-100'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Continue Button */}
              {selectedContentMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <button
                    className="w-full py-3 btn-primary rounded-lg font-medium"
                    onClick={handleContentContinue}
                  >
                    Continue with {selectedContentMode === 'ai' ? 'AI Personalisation' : 'Custom Content'}
                  </button>
                </motion.div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

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
              {audiencePanelView === 'options' ? (
                /* Import Options */
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

                  {/* Import from CRM */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleCrmImportClick}
                    className="relative bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="w-6 h-6 bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center">CRM</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-gray-900">Import from CRM</h3>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">ULTIMATE</span>
                          </div>
                          <p className="text-sm text-gray-600">Import contacts from your CRM system</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                /* CRM Import Info */
                <CrmImportInfo onBack={handleBackToOptions} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LinkedIn Import Flow Panel */}
      <AnimatePresence>
        {showLinkedInImport && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
          >
            {/* Panel Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLinkedInImportBack}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-500" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Import from LinkedIn</h3>
                  <p className="text-sm text-gray-600">Step {linkedInImportStep} of 3</p>
                </div>
              </div>
              <button
                onClick={handleLinkedInImportClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {linkedInImportStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Step 1: Make your search */}
                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Make your search</h2>
                    <p className="text-gray-600">
                      Make your search on your preferred tool: LinkedIn Regular Search or Sales Navigator.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Sales Navigator Option */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Compass size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">Sales Navigator</span>
                      </div>
                    </motion.div>

                    {/* Or Divider */}
                    <div className="flex items-center justify-center py-2">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="px-3 text-sm text-gray-500 bg-white">Or</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* LinkedIn Regular Search Option */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Linkedin size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">LinkedIn Regular Search</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {linkedInImportStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Step 2: Copy the URL */}
                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Copy the URL</h2>
                    <p className="text-gray-600">
                      Once you found the leads to import, copy-paste the LinkedIn URL in AlphaGrowth.
                    </p>
                  </div>

                  {/* Simulated LinkedIn Browser */}
                  <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      {/* Browser Header */}
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                          linkedin.com/search/results/people/?keywords
                        </div>
                      </div>

                      {/* LinkedIn Interface */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Linkedin size={20} className="text-blue-600" />
                          <div className="flex-1 h-8 bg-gray-100 rounded flex items-center px-3">
                            <Search size={16} className="text-gray-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-6 bg-gray-200 rounded"></div>
                          <div className="h-6 bg-gray-200 rounded"></div>
                          <div className="h-6 bg-gray-200 rounded"></div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Results</div>
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {linkedInImportStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Step 3: Import Leads */}
                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Import Leads</h2>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed">
                      Paste the URL here
                    </div>
                    <button
                      onClick={handleLinkedInImportNext}
                      className="w-full py-2 px-4 btn-primary rounded-lg font-medium"
                    >
                      Import
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Paste URL in AlphaGrowth & Import</h3>
                    <p className="text-sm text-gray-600">
                      Paste the URL in AlphaGrowth and click on "Import" to import your leads and create your audience.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleLinkedInImportBack}
                  disabled={linkedInImportStep === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${linkedInImportStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all ${step === linkedInImportStep
                          ? 'btn-primary'
                          : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={linkedInImportStep === 3 ? handleImportPeopleComplete : handleLinkedInImportNext}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${linkedInImportStep === 3
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'btn-primary'
                    }`}
                >
                  {linkedInImportStep === 3 ? 'Complete' : 'Next'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import People Screen */}
      <AnimatePresence>
        {showImportPeopleScreen && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
          >
            {/* Panel Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleImportPeopleBack}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-500" />
                </button>
                <h3 className="text-lg font-bold text-gray-900">Import People Who...</h3>
              </div>
              <button
                onClick={handleImportPeopleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeImportView === 'main' ? (
                <>
                  {/* Import People Who... Section */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Import People Who...</h2>

                    <div className="space-y-3">
                      {/* Commented a Post */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                        onClick={() => handleImportOptionClick('comment')}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MessageCircle size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Commented a Post</span>
                      </motion.div>

                      {/* My Followers */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                        onClick={() => handleImportOptionClick('followers')}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <UserPlus size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">My Followers</span>
                      </motion.div>

                      {/* Attended An Event */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                        onClick={() => handleImportOptionClick('event')}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CalendarDays size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Attended An Event</span>
                      </motion.div>

                      {/* Liked A Post */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                        onClick={() => handleImportOptionClick('like')}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ThumbsUp size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Liked A Post</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Import from a LinkedIn Search Section */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Import from a LinkedIn Search</h2>

                    <div className="space-y-3">
                      {/* LinkedIn Basic Search */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                        onClick={() => handleImportOptionClick('basic-search')}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Linkedin size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">LinkedIn Basic Search</span>
                      </motion.div>

                      {/* LinkedIn Sales Navigator */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                        onClick={() => handleImportOptionClick('sales-navigator')}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Compass size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">LinkedIn Sales Navigator</span>
                      </motion.div>

                      {/* Sales Navigator List */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                        onClick={() => handleImportOptionClick('sales-navigator-list')}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Compass size={20} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Sales Navigator List</span>
                      </motion.div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Individual Import Forms */}
                  {activeImportView === 'comment' && (
                    <div className="space-y-6">
                      {/* Back Button */}
                      <button
                        onClick={handleImportBackToMain}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="font-medium">Back</span>
                      </button>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900">People who Commented a Post</h2>

                      {/* LinkedIn Post URL */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Paste the LinkedIn Post URL here
                        </label>
                        <input
                          type="url"
                          placeholder="Paste the LinkedIn Post URL here"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>1. Click on the 3 dots near to the Post <span className="font-bold">...</span></p>
                          <p>2. On the menu, select "<span className="font-bold">Copy link to the post</span>"</p>
                          <p>3. Paste the link here</p>
                        </div>
                      </div>

                      {/* Create New Audience */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
                        <input
                          type="text"
                          placeholder="Enter audience name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Identity */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Identity</h3>
                        <div className="relative">
                          <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option>Select Identity</option>
                            {identities.map((identity) => (
                              <option key={identity.id} value={identity.id}>
                                {identity.name} ({identity.email})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}
                      <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
                        Import
                      </button>
                    </div>
                  )}

                  {activeImportView === 'followers' && (
                    <div className="space-y-6">
                      {/* Back Button */}
                      <button
                        onClick={handleImportBackToMain}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="font-medium">Back</span>
                      </button>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900">My Followers</h2>

                      {/* Instructions */}
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>1. This will scrape followers of your LinkedIn identity</p>
                        <p>2. Paste your LinkedIn profile URL below</p>
                        <p>3. Select your identity and enter audience name</p>
                        <p>4. Click import to get your followers</p>
                      </div>

                      {/* LinkedIn Profile URL */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Paste your LinkedIn Profile URL here
                        </label>
                        <input
                          type="url"
                          placeholder="Paste your LinkedIn Profile URL here"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="text-sm text-gray-600">
                          Example: https://www.linkedin.com/in/your-profile-name
                        </div>
                      </div>

                      {/* Create New Audience */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
                        <input
                          type="text"
                          placeholder="Enter audience name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Identity */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Identity</h3>
                        <div className="relative">
                          <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option>Select Identity</option>
                            {identities.map((identity) => (
                              <option key={identity.id} value={identity.id}>
                                {identity.name} ({identity.email})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}
                      <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
                        Import
                      </button>
                    </div>
                  )}

                  {activeImportView === 'event' && (
                    <div className="space-y-6">
                      {/* Back Button */}
                      <button
                        onClick={handleImportBackToMain}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="font-medium">Back</span>
                      </button>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900">Event Attendees</h2>

                      {/* Instructions */}
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>1. Go to LinkedIn event page</p>
                        <p>2. Copy the event URL from browser</p>
                        <p>3. Paste the URL here to get attendees</p>
                      </div>

                      {/* LinkedIn Event URL */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Paste LinkedIn event URL here
                        </label>
                        <input
                          type="url"
                          placeholder="Paste LinkedIn event URL here"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Create New Audience */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
                        <input
                          type="text"
                          placeholder="Enter audience name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Identity */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Identity</h3>
                        <div className="relative">
                          <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option>Select Identity</option>
                            {identities.map((identity) => (
                              <option key={identity.id} value={identity.id}>
                                {identity.name} ({identity.email})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}
                      <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
                        Import
                      </button>
                    </div>
                  )}

                  {activeImportView === 'like' && (
                    <div className="space-y-6">
                      {/* Back Button */}
                      <button
                        onClick={handleImportBackToMain}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="font-medium">Back</span>
                      </button>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900">People who Liked a Post</h2>

                      {/* LinkedIn Post URL */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Paste the LinkedIn Post URL here
                        </label>
                        <input
                          type="url"
                          placeholder="Paste the LinkedIn Post URL here"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>1. Click on the 3 dots near to the Post <span className="font-bold">...</span></p>
                          <p>2. On the menu, select "<span className="font-bold">Copy link to the post</span>"</p>
                          <p>3. Paste the link here</p>
                        </div>
                      </div>

                      {/* Create New Audience */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
                        <input
                          type="text"
                          placeholder="Enter audience name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Identity */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Identity</h3>
                        <div className="relative">
                          <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option>Select Identity</option>
                            {identities.map((identity) => (
                              <option key={identity.id} value={identity.id}>
                                {identity.name} ({identity.email})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}
                      <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
                        Import
                      </button>
                    </div>
                  )}

                  {activeImportView === 'basic-search' && (
                    <div className="space-y-6">
                      {/* Back Button */}
                      <button
                        onClick={handleImportBackToMain}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="font-medium">Back</span>
                      </button>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900">LinkedIn Basic Search</h2>

                      {/* LinkedIn Search URL */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Paste the LinkedIn Search URL here
                        </label>
                        <input
                          type="url"
                          placeholder="Paste the LinkedIn Search URL here"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="text-sm text-orange-600">
                          Eg: https://www.linkedin.com/search/results/people
                        </div>
                      </div>

                      {/* Create New Audience */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
                        <input
                          type="text"
                          placeholder="Enter audience name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Identity */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Identity</h3>
                        <div className="relative">
                          <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option>Select Identity</option>
                            {identities.map((identity) => (
                              <option key={identity.id} value={identity.id}>
                                {identity.name} ({identity.email})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}
                      <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
                        Import
                      </button>
                    </div>
                  )}

                  {activeImportView === 'sales-navigator' && (
                    <div className="space-y-6">
                      {/* Back Button */}
                      <button
                        onClick={handleImportBackToMain}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="font-medium">Back</span>
                      </button>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900">LinkedIn Sales Navigator</h2>

                      {/* LinkedIn Search URL */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Paste the LinkedIn Sales Navigator URL here
                        </label>
                        <input
                          type="url"
                          placeholder="Paste the LinkedIn Sales Navigator URL here"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Create New Audience */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
                        <input
                          type="text"
                          placeholder="Enter audience name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Identity */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Identity</h3>
                        <div className="relative">
                          <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option>Select Identity</option>
                            {identities.map((identity) => (
                              <option key={identity.id} value={identity.id}>
                                {identity.name} ({identity.email})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}
                      <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
                        Import
                      </button>
                    </div>
                  )}

                  {activeImportView === 'sales-navigator-list' && (
                    <div className="space-y-6">
                      {/* Back Button */}
                      <button
                        onClick={handleImportBackToMain}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="font-medium">Back</span>
                      </button>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900">Sales Navigator List</h2>

                      {/* LinkedIn List URL */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Paste the Sales Navigator List URL here
                        </label>
                        <input
                          type="url"
                          placeholder="Paste the Sales Navigator List URL here"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Create New Audience */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
                        <input
                          type="text"
                          placeholder="Enter audience name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Identity */}
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900">Identity</h3>
                        <div className="relative">
                          <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option>Select Identity</option>
                            {identities.map((identity) => (
                              <option key={identity.id} value={identity.id}>
                                {identity.name} ({identity.email})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}
                      <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
                        Import
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex h-screen transition-all duration-300 ${showContentSlider || showAudiencePanel || showLinkedInImport || showImportPeopleScreen ? 'mr-96' : 'mr-0'}`}>

        {/* Main Workflow Area */}
        <div className="flex flex-1">
          {/* Workflow Canvas */}
          <div className={`flex-1 transition-all duration-300 relative ${isFocusMode ? 'px-12' : ''}`}>
            {/* Add New Step Button - Floating */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleAddRootNode}
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
                ref={reactFlowRef}
                campaignId={campaignId}
                onNodeClick={handleNodeClick}
                setSelectedNodeId={setSelectedNode}
                onDurationChange={handleDurationChange}
              />
            </div>
          </div>
        </div>


        {/* Right Sidebar */}
        <CampaignRightSidebar campaignId={campaignId} />
      </div>
    </div>
  );
}

