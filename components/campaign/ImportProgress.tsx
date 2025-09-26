'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react';

interface ImportProgressProps {
  isVisible: boolean;
  status: 'in-progress' | 'completed' | 'failed';
  totalLeads: number;
  importedLeads: number;
  onClose: () => void;
  errorMessage?: string;
}

export default function ImportProgress({
  isVisible,
  status,
  totalLeads,
  importedLeads,
  onClose,
  errorMessage
}: ImportProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (totalLeads > 0) {
      setProgress((importedLeads / totalLeads) * 100);
    }
  }, [importedLeads, totalLeads]);

  useEffect(() => {
    // Auto-hide completed imports after 3 seconds
    if (status === 'completed' && isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, isVisible, onClose]);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={24} className="text-green-500" />;
      case 'failed':
        return <AlertCircle size={24} className="text-red-500" />;
      default:
        return (
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        );
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Import Complete';
      case 'failed':
        return 'Import Failed';
      default:
        return 'Importing Leads...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-4 left-4 z-50 w-80 ${getStatusColor()} border rounded-lg shadow-lg`}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <h4 className="font-semibold text-gray-900">{getStatusText()}</h4>
                  {status === 'in-progress' && (
                    <p className="text-sm text-gray-600">
                      {importedLeads} of {totalLeads} contacts imported
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Progress Bar */}
            {status === 'in-progress' && (
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {status === 'completed' && (
              <div className="text-sm text-green-700">
                <p>Successfully imported {totalLeads} contacts to your database.</p>
                <p className="mt-1">They are now available for campaigns and outreach.</p>
              </div>
            )}

            {status === 'failed' && (
              <div className="text-sm text-red-700">
                <p>Failed to import contacts. {errorMessage}</p>
                <p className="mt-1">Please check your file format and try again.</p>
              </div>
            )}

            {/* Action Buttons */}
            {status === 'completed' && (
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => window.location.href = '/people-database'}
                  className="flex-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  View Contacts
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {status === 'failed' && (
              <div className="mt-3">
                <button
                  onClick={onClose}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Auto-hide indicator for completed imports */}
          {status === 'completed' && (
            <div className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-lg">
              <motion.div
                className="h-full bg-green-600"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

