'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MainLayout from '../../../components/layout/MainLayout/MainLayout';
import {
  Target, Users, Briefcase, TrendingUp, Clock
} from 'lucide-react';

const CreateGTMGoal = () => {
  const [goalData, setGoalData] = useState({
    name: '',
    mainObjective: '',
    painPoint: '',
    valueProposition: '',
    targeting: '',
    status: 'Planning',
    duration: '',
    linkedCampaigns: [] as string[],
  });

  const [linkedCampaigns, setLinkedCampaigns] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  // Check if required fields are filled for AI generation
  const canGenerateAI = () => {
    return goalData.name.trim() !== '' && goalData.mainObjective.trim() !== '';
  };

  // AI Generation function
  const handleGenerateAI = async () => {
    if (!canGenerateAI()) {
      alert('Please fill in Goal Name and Main Objective before generating with AI.');
      return;
    }

    setIsModalOpen(false);
    setIsGenerating(true);

    // Simulate a 3 second API call
    setTimeout(() => {
      // Generate AI content based on existing Goal Name and Main Objective
      const enhancedData = {
        ...goalData, // Keep existing name and mainObjective
        painPoint: generatePainPoint(goalData.name, goalData.mainObjective),
        valueProposition: generateValueProposition(goalData.name, goalData.mainObjective),
        targeting: generateTargeting(goalData.name, goalData.mainObjective),
        duration: generateDuration(goalData.name, goalData.mainObjective),
        linkedCampaigns: generateLinkedCampaigns(goalData.name, goalData.mainObjective),
      };

      setGoalData(enhancedData);
      setLinkedCampaigns(enhancedData.linkedCampaigns.join(', '));
      setIsGenerating(false);
    }, 3000);
  };

  // Helper functions to generate contextual content based on goal name and objective
  const generatePainPoint = (name: string, objective: string) => {
    const lowerName = name.toLowerCase();
    const lowerObjective = objective.toLowerCase();
    
    if (lowerName.includes('ai') || lowerName.includes('analytics') || lowerObjective.includes('data')) {
      return 'Target organizations struggle with fragmented data systems, manual reporting processes, and lack of real-time insights. This leads to delayed decision-making, missed opportunities, and inefficient resource allocation costing companies millions annually.';
    } else if (lowerName.includes('enterprise') || lowerName.includes('saas')) {
      return 'Large enterprises face complex integration challenges, scalability issues with legacy systems, and difficulty in achieving consistent user adoption across departments. This results in low ROI on technology investments and operational inefficiencies.';
    } else if (lowerName.includes('security') || lowerName.includes('compliance')) {
      return 'Organizations are overwhelmed with increasing cyber threats, complex compliance requirements, and fragmented security tools. This creates security gaps, regulatory risks, and operational overhead that impact business continuity.';
    } else {
      return 'Target customers face operational inefficiencies, outdated processes, and lack of integrated solutions. This leads to increased costs, reduced productivity, and competitive disadvantages in their respective markets.';
    }
  };

  const generateValueProposition = (name: string, objective: string) => {
    const lowerName = name.toLowerCase();
    const lowerObjective = objective.toLowerCase();
    
    if (lowerName.includes('ai') || lowerName.includes('analytics') || lowerObjective.includes('data')) {
      return 'Our AI-powered solution provides real-time, automated insights from complex datasets, reducing time-to-insight by 80% and enabling data-driven decision making. Features include predictive analytics, natural language queries, and automated report generation.';
    } else if (lowerName.includes('enterprise') || lowerName.includes('saas')) {
      return 'Our enterprise-grade platform offers seamless integration, scalable architecture, and comprehensive user training. This results in 90% faster implementation, 60% cost reduction, and 95% user adoption rates across all departments.';
    } else if (lowerName.includes('security') || lowerName.includes('compliance')) {
      return 'Our integrated security platform provides end-to-end protection with automated compliance reporting, reducing security incidents by 90% and compliance costs by 60% while ensuring continuous business operations.';
    } else {
      return 'Our comprehensive solution streamlines operations, integrates seamlessly with existing systems, and provides measurable ROI. This results in 50% efficiency gains, 40% cost reduction, and improved competitive positioning.';
    }
  };

  const generateTargeting = (name: string, objective: string) => {
    const lowerName = name.toLowerCase();
    const lowerObjective = objective.toLowerCase();
    
    if (lowerName.includes('enterprise') || lowerObjective.includes('fortune 500')) {
      return 'Fortune 500 enterprises, Large multinational corporations (10,000+ employees), Government organizations, Healthcare systems, Financial services institutions';
    } else if (lowerName.includes('mid-market') || lowerName.includes('saas')) {
      return 'Mid-market SaaS companies (500-5000 employees), Growing technology companies, Professional services firms, E-commerce platforms, Software development companies';
    } else if (lowerName.includes('healthcare') || lowerObjective.includes('healthcare')) {
      return 'Healthcare systems, Hospital networks, Medical device companies, Pharmaceutical organizations, Telehealth platforms, Healthcare IT companies';
    } else {
      return 'Mid-market companies (100-1000 employees), Growing businesses, Technology-forward organizations, Service-based companies, Product companies';
    }
  };

  const generateDuration = (name: string, objective: string) => {
    const lowerObjective = objective.toLowerCase();
    
    if (lowerObjective.includes('12 months') || lowerObjective.includes('year')) {
      return '52';
    } else if (lowerObjective.includes('6 months') || lowerObjective.includes('quarter')) {
      return '24';
    } else if (lowerObjective.includes('3 months')) {
      return '12';
    } else {
      return '24'; // Default to 24 weeks (6 months)
    }
  };

  const generateLinkedCampaigns = (name: string, objective: string) => {
    const lowerName = name.toLowerCase();
    const lowerObjective = objective.toLowerCase();
    
    if (lowerName.includes('enterprise') || lowerObjective.includes('fortune 500')) {
      return ['Enterprise Outreach Q4', 'C-Level Executive Summit', 'Fortune 500 Direct Mail', 'Enterprise Webinar Series'];
    } else if (lowerName.includes('ai') || lowerName.includes('analytics')) {
      return ['AI Analytics Webinar Series', 'Data-Driven Decision Making', 'AI Platform Demo Campaign', 'Analytics Thought Leadership'];
    } else if (lowerName.includes('healthcare')) {
      return ['Healthcare Innovation Summit', 'Medical Technology Showcase', 'Healthcare IT Webinar', 'HIPAA Compliance Series'];
    } else {
      return ['Market Expansion Campaign', 'Product Launch Initiative', 'Customer Success Program', 'Industry Leadership Series'];
    }
  };

  // Helper function to render form fields
  const renderFormField = (id: string, label: string, type: string = 'text', options?: string[], placeholder?: string) => (
    <div className="form-field mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {type === 'select' && options ? (
        <select
          id={id}
          name={id}
          value={goalData[id as keyof typeof goalData] || ''}
          onChange={(e) => setGoalData({...goalData, [id]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          value={goalData[id as keyof typeof goalData] || ''}
          onChange={(e) => setGoalData({...goalData, [id]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={goalData[id as keyof typeof goalData] || ''}
          onChange={(e) => setGoalData({...goalData, [id]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Link href="/gtm-goals">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </Link>
      <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all duration-300">
        Save Goal
      </button>
    </div>
  );


  return (
    <MainLayout title="Create New GTM Goal" headerActions={headerActions}>
      {/* AI Prompt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate GTM Goal with AI</h3>
            <p className="text-gray-600 mb-4">
              Based on your Goal Name and Main Objective, our AI will generate a comprehensive strategy including pain points, value propositions, targeting, and campaign recommendations.
            </p>
            
            {/* Show current goal context */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Current Goal Context:</h4>
              <p className="text-sm text-gray-700 mb-1"><strong>Goal Name:</strong> {goalData.name || 'Not specified'}</p>
              <p className="text-sm text-gray-700"><strong>Main Objective:</strong> {goalData.mainObjective || 'Not specified'}</p>
            </div>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Optional: Add additional context or specific requirements for your GTM strategy..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAI}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="flex flex-row w-full gap-8">
          {/* Main Content Area - 70% */}
          <div className="flex-grow w-3/5">
            <div className="space-y-8">
              {/* Goal Details Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Goal Details</h2>
                </div>
                
                {renderFormField('name', 'Goal Name', 'text', undefined, 'Enter a descriptive name for your GTM goal')}
                
                {renderFormField('mainObjective', 'Main Objective', 'textarea', undefined, 'Describe the primary objective and desired outcomes of this GTM goal. Be specific about targets, timelines, and success metrics.')}
                
                {/* AI Generation Button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      if (canGenerateAI()) {
                        setIsModalOpen(true);
                      } else {
                        alert('Please fill in Goal Name and Main Objective before generating with AI.');
                      }
                    }}
                    className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                      canGenerateAI() 
                        ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    }`}
                    disabled={!canGenerateAI()}
                  >
                    ✨ Generate Strategy with AI
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {canGenerateAI() 
                      ? 'AI will generate pain points, value propositions, targeting, and campaigns based on your goal'
                      : 'Fill in Goal Name and Main Objective to enable AI generation'
                    }
                  </p>
                </div>
              </div>

              {/* Strategy Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Strategy</h2>
                </div>
                
                {renderFormField('painPoint', 'Pain Point', 'textarea', undefined, 'Describe the specific problem or challenge your target audience faces that this GTM goal addresses.')}
                
                {renderFormField('valueProposition', 'Value Proposition', 'textarea', undefined, 'Explain how your solution addresses the pain point and provides unique value to your target market.')}
              </div>

              {/* Execution Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Execution</h2>
                </div>
                
                {renderFormField('targeting', 'Targeting', 'text', undefined, 'e.g., Mid-market SaaS companies, Fortune 500 enterprises, Healthcare systems')}
                
                {/* Linked Campaigns */}
                <div className="form-field mb-6">
                  <label htmlFor="linkedCampaigns" className="block text-sm font-medium text-gray-700 mb-2">
                    Linked Campaigns (Optional)
                  </label>
                  <input
                    type="text"
                    id="linkedCampaigns"
                    name="linkedCampaigns"
                    value={linkedCampaigns}
                    onChange={(e) => setLinkedCampaigns(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter campaign names separated by commas"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple campaigns with commas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 30% */}
          <div className="w-2/5 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Goal Settings</h3>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="form-field">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={goalData.status}
                    onChange={(e) => setGoalData({...goalData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>

                {/* GTM Duration */}
                <div className="form-field">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    GTM Duration
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={goalData.duration}
                      onChange={(e) => setGoalData({...goalData, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
                      placeholder="24"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm">Weeks</span>
                    </div>
                  </div>
                </div>



                {/* Quick Stats */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Campaigns Linked:</span>
                      <span className="text-gray-900 font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Segments:</span>
                      <span className="text-gray-900 font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-blue-600 font-medium">{goalData.status}</span>
                    </div>
                  </div>
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
