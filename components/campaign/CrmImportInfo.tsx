'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Link, Star, Copy, Check } from 'lucide-react';

interface CrmImportInfoProps {
  onBack: () => void;
}

export default function CrmImportInfo({ onBack }: CrmImportInfoProps) {
  const [copied, setCopied] = useState(false);
  const supportEmail = 'support@alphagrowth.ai';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to options
      </button>

      {/* Main Content */}
      <div className="text-center space-y-6">
        {/* Main Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Link size={32} className="text-white" />
          </div>
        </div>

        {/* Primary Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Connect Any CRM, Database, or App
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
            At AlphaGrowth, we can build a custom integration to connect directly with your existing tools, ensuring a seamless workflow.
          </p>
        </div>

        {/* Pro Plan Highlight Box */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <Star size={16} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-orange-800">
              Pro Plan Exclusive
            </span>
          </div>
          <p className="text-orange-700 text-sm">
            Custom integrations are exclusively available for our Pro plan customers.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            To get started with a custom integration, please contact our support team.
          </p>
          
          {/* Email CTA */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-sm mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-medium">{supportEmail}</span>
              <button
                onClick={handleCopyEmail}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 mb-2">What to expect:</h4>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Free consultation on integration requirements</li>
            <li>• Custom API development and testing</li>
            <li>• Seamless data synchronization</li>
            <li>• Ongoing technical support</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

