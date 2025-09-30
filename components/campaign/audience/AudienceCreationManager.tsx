'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AudienceImportOptions from './AudienceImportOptions';
import LinkedInImportFlow from './LinkedInImportFlow';
import ImportPeopleScreen from './ImportPeopleScreen';
import CrmImportInfo from './CrmImportInfo';
import CSVImportModal from '../CSVImportModal';
import { useImport } from '@/contexts/ImportContext';

export type AudienceCreationView = 
  | 'options' 
  | 'linkedin-import' 
  | 'import-people' 
  | 'crm-info' 
  | 'csv-import';

interface AudienceCreationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (audienceData?: any) => void;
  campaignId?: string;
}

const AudienceCreationManager: React.FC<AudienceCreationManagerProps> = ({
  isOpen,
  onClose,
  onComplete,
  campaignId
}) => {
  const [currentView, setCurrentView] = useState<AudienceCreationView>('options');
  const [linkedInStep, setLinkedInStep] = useState(1);
  const [activeImportView, setActiveImportView] = useState<'main' | 'comment' | 'followers' | 'event' | 'like' | 'basic-search' | 'sales-navigator' | 'sales-navigator-list'>('main');
  const [isCSVImportModalOpen, setIsCSVImportModalOpen] = useState(false);
  
  const { importState, startImport, updateProgress, completeImport, failImport, resetImport } = useImport();

  // CSV Import handler
  const handleCSVImportComplete = useCallback(async (importData: any) => {
    const { file, fieldMappings, previewData } = importData;

    try {
      startImport(previewData.length);
      for (let i = 0; i <= previewData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(i);
      }
      completeImport();
      setTimeout(() => resetImport(), 5000);
    } catch (error) {
      failImport('Failed to import contacts. Please try again.');
    }
  }, [startImport, updateProgress, completeImport, failImport, resetImport]);

  // Navigation handlers
  const handleViewChange = useCallback((view: AudienceCreationView) => {
    setCurrentView(view);
  }, []);

  const handleLinkedInImport = useCallback(() => {
    setCurrentView('linkedin-import');
    setLinkedInStep(1);
  }, []);

  const handleImportPeople = useCallback(() => {
    setCurrentView('import-people');
    setActiveImportView('main');
  }, []);

  const handleCrmImport = useCallback(() => {
    setCurrentView('crm-info');
  }, []);

  const handleCSVImport = useCallback(() => {
    setIsCSVImportModalOpen(true);
  }, []);

  const handleDatabaseImport = useCallback(() => {
    window.open('http://localhost:3001/people-database', '_blank');
  }, []);

  const handleBackToOptions = useCallback(() => {
    setCurrentView('options');
  }, []);

  const handleLinkedInBack = useCallback(() => {
    if (linkedInStep > 1) {
      setLinkedInStep(linkedInStep - 1);
    } else {
      setCurrentView('options');
    }
  }, [linkedInStep]);

  const handleLinkedInNext = useCallback(() => {
    if (linkedInStep < 3) {
      setLinkedInStep(linkedInStep + 1);
    } else {
      onComplete?.();
      onClose();
    }
  }, [linkedInStep, onComplete, onClose]);

  const handleLinkedInComplete = useCallback((leads?: any[]) => {
    console.log('LinkedIn import completed with leads:', leads);
    if (leads && leads.length > 0) {
      console.log(`Imported ${leads.length} leads from LinkedIn`);
      // You might want to create an audience with these leads
    }
    onComplete?.();
    onClose();
  }, [onComplete, onClose]);

  const handleImportPeopleBack = useCallback(() => {
    if (activeImportView === 'main') {
      setCurrentView('options');
    } else {
      setActiveImportView('main');
    }
  }, [activeImportView]);

  const handleImportPeopleClose = useCallback(() => {
    setCurrentView('options');
  }, []);

  const handleImportOptionClick = useCallback((option: string) => {
    setActiveImportView(option as any);
  }, []);

  const handleImportBackToMain = useCallback(() => {
    setActiveImportView('main');
  }, []);

  const handleImportPeopleComplete = useCallback(() => {
    onComplete?.();
    onClose();
  }, [onComplete, onClose]);

  const handleClose = useCallback(() => {
    setCurrentView('options');
    setLinkedInStep(1);
    setActiveImportView('main');
    onClose();
  }, [onClose]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'options':
        return (
          <AudienceImportOptions
            onLinkedInImport={handleLinkedInImport}
            onImportPeople={handleImportPeople}
            onCrmImport={handleCrmImport}
            onCSVImport={handleCSVImport}
            onDatabaseImport={handleDatabaseImport}
          />
        );
      
      case 'linkedin-import':
        return (
          <LinkedInImportFlow
            step={linkedInStep}
            onBack={handleLinkedInBack}
            onNext={handleLinkedInNext}
            onComplete={handleLinkedInComplete}
            campaignId={campaignId}
          />
        );
      
      case 'import-people':
        return (
          <ImportPeopleScreen
            activeView={activeImportView}
            onViewChange={handleImportOptionClick}
            onBack={handleImportPeopleBack}
            onClose={handleImportPeopleClose}
            onComplete={handleImportPeopleComplete}
          />
        );
      
      case 'crm-info':
        return (
          <CrmImportInfo
            onBack={handleBackToOptions}
          />
        );
      
      default:
        return null;
    }
  };

  const getPanelTitle = () => {
    switch (currentView) {
      case 'linkedin-import':
        return 'Import from LinkedIn';
      case 'import-people':
        return 'Import People Who...';
      case 'crm-info':
        return 'CRM Import Information';
      default:
        return 'Create New Audience';
    }
  };

  const getPanelSubtitle = () => {
    switch (currentView) {
      case 'linkedin-import':
        return `Step ${linkedInStep} of 3`;
      case 'import-people':
        return 'Choose your import method';
      case 'crm-info':
        return 'Learn about CRM integration';
      default:
        return 'Choose how you want to import your audience';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
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
              <h3 className="text-lg font-bold text-gray-900">{getPanelTitle()}</h3>
              <p className="text-sm text-gray-600">{getPanelSubtitle()}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {renderCurrentView()}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVImportModalOpen}
        onClose={() => setIsCSVImportModalOpen(false)}
        onImportComplete={handleCSVImportComplete}
      />
    </>
  );
};

export default AudienceCreationManager;
