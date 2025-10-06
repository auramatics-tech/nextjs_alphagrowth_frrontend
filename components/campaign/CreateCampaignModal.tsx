'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { campaignService, CreateCampaignRequest } from '../../services/campaignService';
import { gtmService, GTMGoal } from '../../services/gtmService';

// Types
export interface CampaignFormData {
  name: string;
  gtmId: string;
  gtm_name: string;
  objective: string;
  success_metric: string;
  target: number;
  audience: string;
  pain_point: string;
  value_prop: string;
}

export interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (campaign: any) => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    gtmId: '',
    gtm_name: '',
    objective: '',
    success_metric: '',
    target: 0,
    audience: '',
    pain_point: '',
    value_prop: ''
  });

  const [gtmStrategies, setGtmStrategies] = useState<GTMGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [gtmLoading, setGtmLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load GTM strategies when modal opens
  const loadGtmStrategies = useCallback(async () => {
    try {
      setGtmLoading(true);
      setError(null);
      console.log('Loading GTM strategies...');
      const strategies = await gtmService.getGTMStrategies();
      console.log('GTM strategies loaded:', strategies);
      setGtmStrategies(strategies.gtmStrategies);
    } catch (err: any) {
      console.error('Error loading GTM strategies:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load GTM strategies';
      setError(errorMessage);
    } finally {
      setGtmLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadGtmStrategies();
    }
  }, [isOpen, loadGtmStrategies]);

  // Handle form input changes
  const handleInputChange = (field: keyof CampaignFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle GTM selection
  const handleGtmSelect = (gtmId: string) => {
    const selectedGtm = gtmStrategies.find(gtm => gtm.id === gtmId);
    if (selectedGtm) {
      // Parse objectives from GTM strategy
      let parsedObjectives: string[] = [];
      try {
        if (selectedGtm.mainObjectives) {
          parsedObjectives = typeof selectedGtm.mainObjectives === 'string'
            ? (() => {
                try {
                  const parsed = JSON.parse(selectedGtm.mainObjectives);
                  return Object.values(parsed);
                } catch {
                  return [selectedGtm.mainObjectives];
                }
              })()
            : Object.values(selectedGtm.mainObjectives);
        }
      } catch (e) {
        console.warn("Failed to parse mainObjectives", e);
      }

      setFormData(prev => ({
        ...prev,
        gtmId: selectedGtm.id,
        gtm_name: selectedGtm.gtmName,
        objective: selectedGtm.mainObjectives || '',
        success_metric: 'Lead Generation', // Default success metric
        target: parseInt(selectedGtm.targetCount || '0') || 0,
        audience: 'Confirmed ICP', // Default as in frontend_old
        pain_point: selectedGtm.keyCustomerPainPoint || '',
        value_prop: selectedGtm.coreValueProposition || ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.gtmId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const campaignData: CreateCampaignRequest = {
        name: formData.name,
        gtmId: formData.gtmId,
        gtm_name: formData.gtm_name,
        objective: formData.objective,
        success_metric: formData.success_metric,
        target: formData.target,
        audience: formData.audience,
        pain_point: formData.pain_point,
        value_prop: formData.value_prop
      };

      const newCampaign = await campaignService.createCampaign(campaignData);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess(newCampaign);
        handleClose();
      }, 1500);

    } catch (err: any) {
      console.error('Error creating campaign:', err);
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        gtmId: '',
        gtm_name: '',
        objective: '',
        success_metric: '',
        target: 0,
        audience: '',
        pain_point: '',
        value_prop: ''
      });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Campaign Created Successfully!</h3>
                  <p className="text-gray-600">Redirecting to campaign workflow...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Campaign Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter campaign name"
                      required
                    />
                  </div>

                  {/* GTM Strategy Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GTM Strategy *
                    </label>
                    {gtmLoading ? (
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-orange-500" />
                        <span className="text-gray-600">Loading GTM strategies...</span>
                      </div>
                    ) : error ? (
                      <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500" />
                        <span className="text-red-600">{error}</span>
                        <button
                          onClick={loadGtmStrategies}
                          className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <select
                        value={formData.gtmId}
                        onChange={(e) => handleGtmSelect(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="">Select a GTM Strategy</option>
                        {gtmStrategies.map((gtm) => (
                          <option key={gtm.id} value={gtm.id}>
                            {gtm.gtmName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Objective */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objective
                    </label>
                    <input
                      type="text"
                      value={formData.objective}
                      onChange={(e) => handleInputChange('objective', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Generate qualified leads"
                    />
                  </div>

                  {/* Success Metric */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Success Metric
                    </label>
                    <select
                      value={formData.success_metric}
                      onChange={(e) => handleInputChange('success_metric', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select success metric</option>
                      <option value="Meetings Booked">Meetings Booked</option>
                      <option value="Replies Received">Replies Received</option>
                      <option value="Connections Made">Connections Made</option>
                      <option value="Leads Generated">Leads Generated</option>
                    </select>
                  </div>

                  {/* Target */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Number
                    </label>
                    <input
                      type="number"
                      value={formData.target}
                      onChange={(e) => handleInputChange('target', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 100"
                      min="0"
                    />
                  </div>

                  {/* Audience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={formData.audience}
                      onChange={(e) => handleInputChange('audience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Enterprise decision makers"
                    />
                  </div>

                  {/* Pain Point */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pain Point
                    </label>
                    <textarea
                      value={formData.pain_point}
                      onChange={(e) => handleInputChange('pain_point', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Describe the pain point your solution addresses"
                      rows={3}
                    />
                  </div>

                  {/* Value Proposition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value Proposition
                    </label>
                    <textarea
                      value={formData.value_prop}
                      onChange={(e) => handleInputChange('value_prop', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Describe your unique value proposition"
                      rows={3}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                      <AlertCircle size={20} className="text-red-500" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Campaign'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCampaignModal;
