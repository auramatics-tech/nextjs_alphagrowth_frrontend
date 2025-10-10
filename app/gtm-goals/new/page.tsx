'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MainLayout from '../../../components/layout/MainLayout/MainLayout';
import {
  Sparkles, PlusCircle, X, AlertTriangle
} from 'lucide-react';
import { businessService } from '../../../services/businessService';

type Kpi = {
  id: number;
  goal: string;
  count: number;
};

type Business = {
  id: string;
  companyName: string;
  icps?: ICP[];
};

type ICP = {
  id: string;
  name: string;
  title: string;
};

const KPI_OPTIONS = [
  'Meetings Booked',
  'Leads Generated',
  'No. of Replies',
  'Deals Won',
  'Trials / Signup',
  'Revenue Generated',
  'Email Open Rate',
  'Connection Request Accepted',
  'Click-Through Rate (CTR) (%)',
  'Custom Metric'
];

const CreateGTMGoal = () => {
  const router = useRouter();
  const [goalData, setGoalData] = useState({
    gtmName: '',
    mainObjectives: '',
    keyCustomerPainPoint: '',
    coreValueProposition: '',
    gtmDuration: '',
  });

  // New state for API integrations
  const [kpis, setKpis] = useState<Kpi[]>([{ id: 1, goal: 'Meetings Booked', count: 1 }]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allIcps, setAllIcps] = useState<ICP[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [selectedIcpId, setSelectedIcpId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch businesses and ICPs on mount
  useEffect(() => {
    const fetchBusinessesAndIcps = async () => {
      try {
        const win = typeof window !== 'undefined' ? window : undefined;
        const businessId = win ? localStorage.getItem('businessId') : null;
        
        if (businessId) {
          // Set default selected business if available
          setSelectedBusinessId(businessId);
        }

        // Fetch all businesses and their ICPs
        const data = await businessService.getBusinessInfo({ business_id: '' });
        console.log('[GTM Goals] Fetched businesses:', data);
        
        if (data?.businesses && Array.isArray(data.businesses)) {
          setBusinesses(data.businesses);
          
          // Flatten all ICPs from all businesses
          const flattenedIcps = data.businesses.flatMap((b: Business) => b.icps || []);
          setAllIcps(flattenedIcps);
          
          // If we have a default business ID, set the first ICP from that business
          if (businessId) {
            const defaultBusiness = data.businesses.find((b: Business) => b.id === businessId);
            if (defaultBusiness?.icps && defaultBusiness.icps.length > 0) {
              setSelectedIcpId(defaultBusiness.icps[0].id);
            }
          }
        }
      } catch (err) {
        console.error('[GTM Goals] Failed to fetch businesses:', err);
        setError('Failed to load business information');
      }
    };

    fetchBusinessesAndIcps();
  }, []);

  // KPI Management
  const handleKpiChange = (id: number, field: 'goal' | 'count', value: string | number) => {
    setKpis(currentKpis => 
      currentKpis.map(kpi => 
        kpi.id === id ? { ...kpi, [field]: field === 'count' ? Number(value) : value } : kpi
      )
    );
  };

  const addKpi = () => {
    if (kpis.length < KPI_OPTIONS.length) {
      const availableKpi = KPI_OPTIONS.find(opt => !kpis.some(k => k.goal === opt)) || 'Meetings Booked';
      setKpis(currentKpis => [...currentKpis, { id: Date.now(), goal: availableKpi, count: 1 }]);
    }
  };

  const removeKpi = (id: number) => {
    if (kpis.length > 1) {
      setKpis(currentKpis => currentKpis.filter(kpi => kpi.id !== id));
    }
  };

  // Check if required fields are filled for AI generation
  const canGenerateAI = () => {
    return goalData.gtmName.trim() !== '' && goalData.mainObjectives.trim() !== '';
  };

  // AI Generation function - Now calls real API
  const handleGenerateAI = async () => {
    if (!canGenerateAI()) {
      alert('Please fill in Goal Name and Main Objective before generating with AI.');
      return;
    }

    setIsModalOpen(false);
    setIsGenerating(true);
    setError(null);

    try {
      const win = typeof window !== 'undefined' ? window : undefined;
      let businessId = selectedBusinessId || (win ? localStorage.getItem('businessId') : null);
      let icpId = selectedIcpId || (win ? localStorage.getItem('icpId') : null);

      if (!businessId) {
        throw new Error('Please select a business first');
      }

      // Auto-recover icpId if missing
      if (!icpId && allIcps.length > 0) {
        icpId = allIcps[0].id;
        setSelectedIcpId(icpId);
      }

      if (!icpId) {
        throw new Error('Please select or create an ICP first');
      }

      const response = await businessService.generateGtmPainPoints({
        businessId,
        icpId,
        goal_title: goalData.gtmName,
        target_segment: 'General Market',
        channel_focus: 'LinkedIn'
      });

      console.log('[GTM Goals] AI generation response:', response);

      const painPoint = response?.pain_point || response?.pain || response?.data?.pain_point || '';
      const valueProp = response?.value_proposition || response?.valueProp || response?.data?.value_proposition || '';

      if (painPoint || valueProp) {
        setGoalData(prev => ({
          ...prev,
          keyCustomerPainPoint: painPoint || prev.keyCustomerPainPoint,
          coreValueProposition: valueProp || prev.coreValueProposition
        }));
      }

      setIsGenerating(false);
    } catch (err: any) {
      console.error('[GTM Goals] AI generation error:', err);
      setError(err.message || 'Failed to generate AI content');
      setIsGenerating(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const win = typeof window !== 'undefined' ? window : undefined;
      const domain = win ? localStorage.getItem('businessDomain') : null;
      
      if (!selectedBusinessId) {
        throw new Error('Please select a business');
      }

      if (!selectedIcpId) {
        throw new Error('Please select an ICP');
      }

      if (!goalData.gtmName.trim()) {
        throw new Error('Please enter a GTM name');
      }

      if (!goalData.mainObjectives.trim()) {
        throw new Error('Please enter a main objective');
      }

      if (kpis.length === 0 || !kpis.every(kpi => kpi.goal && kpi.count > 0)) {
        throw new Error('Please add at least one valid KPI');
      }

      // Format goals like frontend_old
      const formattedGoals = kpis.map(kpi => ({
        goal: kpi.goal,
        count: kpi.count
      }));

      const gtmData = {
        businessId: selectedBusinessId,
        targetAudienceICPId: selectedIcpId,
        domain: domain || '',
        gtmName: goalData.gtmName,
        mainObjectives: goalData.mainObjectives,
        goals: JSON.stringify(formattedGoals),
        keyCustomerPainPoint: goalData.keyCustomerPainPoint,
        coreValueProposition: goalData.coreValueProposition,
        gtmDuration: goalData.gtmDuration || '24',
      };

      console.log('[GTM Goals] Submitting data:', gtmData);

      const response = await businessService.createGtmGoal(gtmData);
      console.log('[GTM Goals] Save response:', response);

      if (response?.message === "GTM strategy created successfully" || response?.success) {
        // Navigate back to GTM goals list or to campaign setup
        const campaignId = response?.campaign?.id;
        if (campaignId) {
          router.push(`/campaigns/${campaignId}/new/workflow`);
        } else {
          router.push('/gtm-goals');
        }
    } else {
        throw new Error(response?.message || 'Failed to create GTM goal');
      }
    } catch (err: any) {
      console.error('[GTM Goals] Submit error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save GTM goal');
      setIsSubmitting(false);
    }
  };


  const headerActions = (
    <div className="flex items-center space-x-3">
      <Link href="/gtm-goals">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </Link>
      <button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Saving...
          </>
        ) : (
          'Save Goal'
        )}
      </button>
    </div>
  );


  return (
    <MainLayout title="Create New GTM Goal" headerActions={headerActions}>
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700 mb-2">🤖 AI is crafting your GTM goal...</p>
            <p className="text-gray-500">This will take just a moment</p>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="space-y-6">
              {/* GTM Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GTM Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gtmName"
                  value={goalData.gtmName}
                  onChange={(e) => setGoalData({...goalData, gtmName: e.target.value})}
                  placeholder="Q3 Demo Drive for FinTech"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Main Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  My main objective is <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="mainObjectives"
                  value={goalData.mainObjectives}
                  onChange={(e) => setGoalData({...goalData, mainObjectives: e.target.value})}
                  placeholder="Successfully launch our new analytics feature to small marketing agencies and generate 20 qualified demo requests within the next 90 days"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>
              {/* KPIs Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    How will you measure success for this goal? <span className="text-red-500">*</span>
                  </label>
                  {kpis.length < KPI_OPTIONS.length && (
                    <button
                      type="button"
                      onClick={addKpi}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      + Add
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {kpis.map((kpi, index) => (
                    <div key={kpi.id} className="flex gap-2 items-center">
                      <select
                        value={kpi.goal}
                        onChange={(e) => handleKpiChange(kpi.id, 'goal', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {KPI_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={kpi.count}
                        onChange={(e) => handleKpiChange(kpi.id, 'count', e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Count"
                      />
                      {kpis.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeKpi(kpi.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Business <span className="text-red-500">*</span>
                </label>
                <select
                  name="businessId"
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select business</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.companyName.replace(/^https?:\/\//, '')}
                    </option>
                  ))}
                </select>
              </div>

              {/* ICP Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your ICP <span className="text-red-500">*</span>
                </label>
                <select
                  name="targetAudienceICPId"
                  value={selectedIcpId}
                  onChange={(e) => setSelectedIcpId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select ICP</option>
                  {allIcps.map((icp) => (
                    <option key={icp.id} value={icp.id}>
                      {icp.name} - {icp.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Generation Button */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={!canGenerateAI() || isGenerating}
                  className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 ${
                    canGenerateAI() && !isGenerating
                      ? 'text-white bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 shadow-md hover:shadow-lg' 
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={16} />
                  Generate Main Pain Point and Core value Proposition from AI
                </button>
              </div>

              {/* Pain Point */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key customer pain point we address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="keyCustomerPainPoint"
                  value={goalData.keyCustomerPainPoint}
                  onChange={(e) => setGoalData({...goalData, keyCustomerPainPoint: e.target.value})}
                  placeholder="Difficulty managing compliance reporting"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Value Proposition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Our core value proposition (1–2 sentences) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="coreValueProposition"
                  value={goalData.coreValueProposition}
                  onChange={(e) => setGoalData({...goalData, coreValueProposition: e.target.value})}
                  placeholder="We automate compliance reporting, saving teams hours and reducing risk."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* GTM Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired GTM Duration <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="gtmDuration"
                    value={goalData.gtmDuration}
                    onChange={(e) => setGoalData({...goalData, gtmDuration: e.target.value})}
                    placeholder="Enter GTM Duration"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg flex items-center text-sm text-gray-600">
                    in Weeks
                  </div>
                </div>
              </div>

              {/* AI Note */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
                <Sparkles size={20} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="text-purple-700">💡 AI Superpower:</strong> Providing the Pain Point and Value Prop here helps our AI generate much more relevant and effective outreach message suggestions for your campaigns later!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default CreateGTMGoal;
