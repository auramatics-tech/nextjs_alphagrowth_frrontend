'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MainLayout from '../../../../components/layout/MainLayout/MainLayout';
import { gtmService, GTMGoal } from '../../../../services/gtmService';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

// Types
interface GTMFormData {
  name: string;
  objective: string;
  success_metric: string;
  goalCount: string;
  target: string;
  pain_point: string;
  value_prop: string;
  gtmDuration: string;
}

const GTMEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState<GTMFormData>({
    name: '',
    objective: '',
    success_metric: 'deals_won',
    goalCount: '',
    target: '',
    pain_point: '',
    value_prop: '',
    gtmDuration: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadGTMData = useCallback(async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await gtmService.getGTMById(id);
      
      if (response.success) {
        const data = response.data;
        
        // Parse goals safely
        let parsedGoals = [];
        try {
          parsedGoals = typeof data.goals === 'string' ? JSON.parse(data.goals) : data.goals;
        } catch (e) {
          console.warn('Failed to parse goals:', e);
          parsedGoals = [];
        }
        
        // Update form state with fetched data
        setForm({
          name: data.gtmName || '',
          objective: data.mainObjectives || '',
          success_metric: parsedGoals[0]?.goal || 'deals_won',
          goalCount: parsedGoals[0]?.count || '',
          target: data.targetCount || '',
          pain_point: data.keyCustomerPainPoint || '',
          value_prop: data.coreValueProposition || '',
          gtmDuration: data.gtmDuration || ''
        });
        
        console.log('✅ GTM data loaded successfully:', data);
      } else {
        setError(response.message || 'Failed to load GTM data');
        toast.error('Failed to load GTM data');
      }
    } catch (error) {
      console.error('Error loading GTM data:', error);
      setError('Failed to load GTM data. Please try again.');
      toast.error('Failed to load GTM data');
    } finally {
      setInitialLoading(false);
    }
  }, [id]);

  // Load GTM data on component mount
  useEffect(() => {
    if (id) {
      loadGTMData();
    }
  }, [id, loadGTMData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setError(null);

    // Create the payload structure with `updateData`
    const requestData = {
      gtmId: id,
      updateData: {
        gtmName: form.name,
        mainObjectives: form.objective,
        targetCount: Number(form.target),
        goals: [
          {
            goal: form.success_metric,
            count: Number(form.goalCount)
          }
        ],
        gtmDuration: Number(form.gtmDuration),
        keyCustomerPainPoint: form.pain_point,
        coreValueProposition: form.value_prop,
      }
    };

    try {
      const response = await gtmService.updateGTM(requestData);
      console.log("API Response:", response);
      
      if (response?.gtm?.id || response?.success) {
        toast.success("GTM updated successfully!");
        router.push("/gtm-goals");
      } else {
        setError("GTM update completed but response was unexpected. Please check the GTM list.");
        toast.error("GTM update completed but response was unexpected.");
        // Still navigate in case it worked
        setTimeout(() => router.push("/gtm-goals"), 2000);
      }
    } catch (err: any) {
      console.error("GTM Update Error:", err);
      setError(`Failed to update GTM: ${err.response?.data?.message || err.message}`);
      toast.error(`Failed to update GTM: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/gtm-goals");
  };

  if (initialLoading) {
    return (
      <MainLayout title="Edit GTM Goal">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <span className="ml-2 text-gray-600">Loading GTM data...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit GTM Goal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Create New GTM Goal / Edit Goal- <span className="text-yellow-500">Q4 demo</span>
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-red-800">Error:</strong> {error}
                </div>
                <button
                  type="button"
                  onClick={loadGTMData}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GTM Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">
                GTM Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Q3 Demo Drive for FinTech"
                value={form.name}
                onChange={handleInputChange}
                required
                className="w-full h-16 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Main Objective */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">
                My main objective is
              </label>
              <input
                type="text"
                name="objective"
                placeholder="Get 10 qualified demos"
                value={form.objective}
                onChange={handleInputChange}
                required
                className="w-full h-16 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Success Metric */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">
                How will you measure success for this goal?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    value={form.success_metric}
                    onChange={handleInputChange}
                    name="success_metric"
                    className="w-full h-16 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  >
                    <option value="deals_won">Deals Won</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    name="goalCount"
                    min="1"
                    value={form.goalCount}
                    onChange={handleInputChange}
                    placeholder="Count"
                    className="w-full h-16 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">
                Target audience for this goal
              </label>
              <input
                type="number"
                name="target"
                min="1"
                value={form.target}
                onChange={handleInputChange}
                placeholder="Number of targets"
                className="w-full h-16 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Pain Point */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">
                Key customer pain point we address
              </label>
              <textarea
                name="pain_point"
                value={form.pain_point}
                onChange={handleInputChange}
                placeholder="Difficulty managing compliance reporting"
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 resize-vertical"
              />
            </div>

            {/* Value Proposition */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">
                Our core value proposition (1–2 sentences)
              </label>
              <textarea
                name="value_prop"
                value={form.value_prop}
                onChange={handleInputChange}
                placeholder="Our solution provides..."
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 resize-vertical"
              />
            </div>

            {/* GTM Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">
                Desired GTM Duration
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="gtmDuration"
                  placeholder="Enter GTM Duration"
                  value={form.gtmDuration}
                  onChange={handleInputChange}
                  className="flex-1 h-16 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                />
                <span className="px-4 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg flex items-center text-gray-700 font-medium">
                  in Weeks
                </span>
              </div>
            </div>

            {/* AI Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                **💡 AI superpower:**
              </p>
              <p className="text-sm text-gray-700 mt-1">
                providing the pain point and value prop here helps our ai generate much more relevant and effective outreach message suggestions for your campaigns later!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Goal'
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default GTMEditPage;
