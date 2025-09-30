'use client';

import React, { useState, useCallback } from 'react';
import ReusableButton from '@/components/ui/ReusableButton';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Drawer from '@/components/ui/Drawer';
import AIPersonalisationEditor from '@/components/campaign/AIPersonalisationEditor';
import CustomContentEditor from '@/components/campaign/CustomContentEditor';
import { campaignService } from '@/services/campaignService';

interface ContentPanelProps {
  campaignId: string;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ campaignId }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'ai' | 'manual' | null>(null);
  const [isAIEditorOpen, setIsAIEditorOpen] = useState(false);
  const [isCustomEditorOpen, setIsCustomEditorOpen] = useState(false);

  const openSelector = useCallback(() => setIsSelectorOpen(true), []);
  const closeSelector = useCallback(() => setIsSelectorOpen(false), []);

  const handleContinue = useCallback(async () => {
    if (!selectedMode) return;
    try {
      await campaignService.setMessageCreationType(
        campaignId,
        selectedMode === 'ai' ? 'ai' : 'manual'
      );
      closeSelector();
      if (selectedMode === 'ai') setIsAIEditorOpen(true);
      else setIsCustomEditorOpen(true);
    } catch (e) {
    
    }
  }, [selectedMode, campaignId, closeSelector]);

  return (
    <>
      <div className="mt-4 space-y-3">
        <div className="text-center py-4">
          <div className="text-sm text-gray-600 mb-2">Content not configured</div>
          <div className="text-xs text-gray-500">Click to configure content and messages</div>
        </div>
        <ReusableButton
          onClick={openSelector}
          variant="secondary"
          icon={Plus}
          className="w-full"
        >
          Configure Content
        </ReusableButton>
      </div>

      {/* Content Selector Panel */}
      <AnimatePresence>
        {isSelectorOpen && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
          >
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Content</h3>
                <p className="text-sm text-gray-600">Choose how you want to generate and edit messages</p>
              </div>
              <button onClick={closeSelector} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">This choice applies to all channels and steps.</p>
                      <p className="text-sm text-blue-700 mt-1">You can switch later, but it will delete existing content.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedMode('ai')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedMode === 'ai' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 text-lg">🤖</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI Personalisation</h3>
                        <p className="text-sm text-gray-600">Auto-generate personalized messages</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedMode('manual')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedMode === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-lg">✏️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Custom Content</h3>
                        <p className="text-sm text-gray-600">Write your own messages with variables</p>
                      </div>
                    </div>
                  </button>

                  {selectedMode && (
                    <button onClick={handleContinue} className="w-full py-3 btn-primary rounded-lg font-medium">
                      Continue with {selectedMode === 'ai' ? 'AI Personalisation' : 'Custom Content'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Editor Drawer */}
      <Drawer isOpen={isAIEditorOpen} onClose={() => setIsAIEditorOpen(false)} title="AI Personalisation Editor">
        <AIPersonalisationEditor campaignId={campaignId} />
      </Drawer>

      {/* Custom Content Editor Drawer */}
      <Drawer isOpen={isCustomEditorOpen} onClose={() => setIsCustomEditorOpen(false)} title="Custom Content Editor">
        <CustomContentEditor campaignId={campaignId} />
      </Drawer>
    </>
  );
};

export default ContentPanel;


