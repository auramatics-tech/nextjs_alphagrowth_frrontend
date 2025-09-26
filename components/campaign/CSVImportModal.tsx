'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, MapPin, CheckCircle } from 'lucide-react';
import FileUpload from './FileUpload';
import FieldMapping from './FieldMapping';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (importData: any) => void;
}

interface ImportData {
  file: File | null;
  fieldMappings: Record<string, string>;
  previewData: any[];
}

export default function CSVImportModal({ isOpen, onClose, onImportComplete }: CSVImportModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [importData, setImportData] = useState<ImportData>({
    file: null,
    fieldMappings: {},
    previewData: []
  });

  const steps = [
    { id: 1, title: 'Upload CSV', icon: Upload },
    { id: 2, title: 'Map Fields', icon: MapPin },
    { id: 3, title: 'Review & Import', icon: CheckCircle }
  ];

  const handleFileUpload = (file: File, previewData: any[]) => {
    setImportData(prev => ({
      ...prev,
      file,
      previewData
    }));
    setCurrentStep(2);
  };

  const handleFieldMapping = (mappings: Record<string, string>) => {
    setImportData(prev => ({
      ...prev,
      fieldMappings: mappings
    }));
    // Don't automatically advance to step 3 - let user click "Review & Import" button
  };

  const handleImport = () => {
    // Trigger the background import process
    onImportComplete(importData);
    onClose();
    // Reset the modal state for next use
    setCurrentStep(1);
    setImportData({
      file: null,
      fieldMappings: {},
      previewData: []
    });
  };

  const canProceedToStep2 = importData.file !== null;
  const canProceedToStep3 = Object.keys(importData.fieldMappings).length > 0; // At least one field mapped
  const canImport = currentStep === 3 && canProceedToStep3; // Allow import if at least one field is mapped

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Import Leads from CSV</h2>
                <p className="text-gray-600 mt-1">Upload and map your contact data</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Stepper */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isActive 
                            ? 'bg-gradient-to-r from-orange-500 to-blue-500 border-transparent text-white' 
                            : isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle size={20} />
                          ) : (
                            <Icon size={20} />
                          )}
                        </div>
                        <span className={`ml-3 font-medium ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-4 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              
              {currentStep === 1 && (
                <FileUpload
                  onFileUpload={handleFileUpload}
                  currentFile={importData.file}
                />
              )}
              
              {currentStep === 2 && importData.file && (
                <FieldMapping
                  file={importData.file}
                  previewData={importData.previewData}
                  onFieldMapping={handleFieldMapping}
                  currentMappings={importData.fieldMappings}
                />
              )}
              
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Import</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">File:</span>
                        <span className="font-medium">{importData.file?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Records:</span>
                        <span className="font-medium">{importData.previewData.length} contacts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mapped Fields:</span>
                        <span className="font-medium">{Object.keys(importData.fieldMappings).length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Field Mappings</h4>
                    <div className="space-y-2">
                      {Object.entries(importData.fieldMappings).map(([csvField, dbField]) => (
                        <div key={csvField} className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                          <span className="text-gray-600">{csvField}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-gray-900">{dbField}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex items-center space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 3 && (
                  <button
                    onClick={() => {
                      if (currentStep === 1 && canProceedToStep2) {
                        setCurrentStep(2);
                      } else if (currentStep === 2 && canProceedToStep3) {
                        setCurrentStep(3);
                      }
                    }}
                    disabled={
                      (currentStep === 1 && !canProceedToStep2) || 
                      (currentStep === 2 && !canProceedToStep3)
                    }
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      (currentStep === 1 && canProceedToStep2) || 
                      (currentStep === 2 && canProceedToStep3)
                        ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white hover:from-orange-600 hover:to-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {currentStep === 1 ? 'Next' : 'Review & Import'}
                  </button>
                )}
                
                {currentStep === 3 && (
                  <button
                    onClick={handleImport}
                    disabled={!canImport}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      canImport
                        ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white hover:from-orange-600 hover:to-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Import {importData.previewData.length} Contacts
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
