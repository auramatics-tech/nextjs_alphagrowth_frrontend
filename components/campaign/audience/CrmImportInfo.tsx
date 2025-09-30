'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';

interface CrmImportInfoProps {
  onBack: () => void;
}

const CrmImportInfo: React.FC<CrmImportInfoProps> = ({ onBack }) => {
  const crmFeatures = [
    {
      title: 'Salesforce Integration',
      description: 'Direct sync with your Salesforce contacts and leads',
      status: 'available'
    },
    {
      title: 'HubSpot Integration',
      description: 'Import contacts from HubSpot CRM seamlessly',
      status: 'available'
    },
    {
      title: 'Pipedrive Integration',
      description: 'Connect your Pipedrive pipeline to AlphaGrowth',
      status: 'coming-soon'
    },
    {
      title: 'Custom CRM API',
      description: 'Connect any CRM with our flexible API integration',
      status: 'available'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'coming-soon':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'coming-soon':
        return 'Coming Soon';
      default:
        return 'Unavailable';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="font-medium">Back</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">CRM Integration</h2>
        <p className="text-gray-600">
          Connect your CRM system to automatically import and sync contacts with AlphaGrowth.
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        {crmFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feature.status)}`}>
                    {getStatusText(feature.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              {feature.status === 'available' && (
                <button className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <ExternalLink size={16} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-blue-900">Why Use CRM Integration?</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-blue-800">Automatic contact synchronization</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-blue-800">Real-time data updates</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-blue-800">Eliminate manual data entry</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-blue-800">Maintain data consistency across platforms</span>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-600">
          Need help setting up your CRM integration?
        </p>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default CrmImportInfo;
