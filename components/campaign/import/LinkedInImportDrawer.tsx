"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Linkedin, Compass, Search } from 'lucide-react';

interface LinkedInImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const LinkedInImportDrawer: React.FC<LinkedInImportDrawerProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<number>(1);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete?.();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
        >
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-500" />
              </button>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Import from LinkedIn</h3>
                <p className="text-sm text-gray-600">Step {step} of 3</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Make your search</h2>
                  <p className="text-gray-600">Make your search on your preferred tool: LinkedIn Regular Search or Sales Navigator.</p>
                </div>

                <div className="space-y-3">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Compass size={20} className="text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Sales Navigator</span>
                    </div>
                  </motion.div>

                  <div className="flex items-center justify-center py-2">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-3 text-sm text-gray-500 bg-white">Or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
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

            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Copy the URL</h2>
                  <p className="text-gray-600">Once you found the leads to import, copy-paste the LinkedIn URL in AlphaGrowth.</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">linkedin.com/search/results/people/?keywords</div>
                    </div>
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
                      <div className="space-y-1">
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

            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Import Leads</h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed">Paste the URL here</div>
                  <button onClick={handleNext} className="w-full py-2 px-4 btn-primary rounded-lg font-medium">Import</button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Paste URL in AlphaGrowth & Import</h3>
                  <p className="text-sm text-gray-600">Paste the URL in AlphaGrowth and click on "Import" to import your leads and create your audience.</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <button onClick={handleBack} disabled={step === 1} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="flex items-center gap-2">
                {[1,2,3].map((s) => (
                  <div key={s} className={`w-2 h-2 rounded-full transition-all ${s === step ? 'btn-primary' : 'bg-gray-300'}`} />
                ))}
              </div>
              <button onClick={step === 3 ? onComplete : handleNext} className={`px-6 py-2 rounded-lg font-medium transition-all ${step === 3 ? 'bg-green-500 text-white hover:bg-green-600' : 'btn-primary'}`}>
                {step === 3 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LinkedInImportDrawer;





