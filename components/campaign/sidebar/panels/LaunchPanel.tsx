'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Loader2, CheckCircle, X } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

interface LaunchPanelProps {
  campaignId?: string;
}

const LaunchPanel: React.FC<LaunchPanelProps> = ({ campaignId }) => {
  const router = useRouter();
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Handle Launch Button Click (Opens confirmation modal)
  const handleLaunchClick = () => {
    setShowLaunchModal(true);
    setError(null);
  };

  // ✅ Handle Confirm Launch (API call)
  const handleConfirmLaunch = async () => {
    if (!campaignId) return;

    setLaunching(true);
    setError(null);

    try {
      // ✅ Use same API as frontend_old
      await apiClient.post(`/pub/v1/campaigns/${campaignId}/status`, {
        status: 'active'
      });

      // Close launch modal and show success modal
      setShowLaunchModal(false);
      setShowSuccessModal(true);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push('/campaigns');
      }, 3000);
    } catch (err: any) {
      console.error('Error launching campaign:', err);
      setError(err.response?.data?.message || 'Failed to launch campaign. Please try again.');
    } finally {
      setLaunching(false);
    }
  };

  // ✅ Handle Cancel
  const handleCancel = () => {
    setShowLaunchModal(false);
    setError(null);
  };

  return (
    <>
      <div className="mt-4 space-y-4">
        {/* Launch Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-blue-50">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Launch Campaign</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">Ready to start your outreach?</p>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full flex items-center justify-center">
                <Rocket className="w-12 h-12 text-orange-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to launch your campaign?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Don&apos;t worry, you can still edit your messages later.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Launch Button */}
            <button
              onClick={handleLaunchClick}
              className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-shadow duration-300 flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Let&apos;s go 🤘
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 mt-4">
              Messages will start sending according to your schedule
            </p>
          </div>
        </div>
      </div>

      {/* Launch Confirmation Modal */}
      <AnimatePresence>
        {showLaunchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={handleCancel}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Icon */}
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full flex items-center justify-center">
                  <img 
                    src="/images/calender.png" 
                    alt="Calendar"
                    className="w-24 h-24"
                    onError={(e: any) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Fallback if image not found */}
                  <Rocket className="w-16 h-16 text-orange-500" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Launch?
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Your campaign is configured and ready to go. Once launched, 
                  messages will start sending according to your schedule. 
                  Are you sure you want to activate it?
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={launching}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmLaunch}
                    disabled={launching}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {launching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Launching...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        Yes, Launch Campaign
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
            >
              <div className="p-8 text-center">
                {/* Success Icon */}
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  🚀 Success! Your Campaign is Live!
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Your outreach sequence has started and will run based on your settings. 
                  You can monitor its progress and manage replies from your Campaign Dashboard.
                </p>

                {/* Auto-redirect message */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span>Redirecting to campaigns...</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LaunchPanel;
 