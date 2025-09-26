'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MainLayout from '../../../components/layout/MainLayout/MainLayout';

const CreateICPPage = () => {
  const formSections = [
    'Roles & Responsibilities',
    'Goals & Objectives',
    'Company Details',
    'Buying Behavior',
    'Outreach Preferences',
    'Scoring Framework',
    'Conversion Path',
    'Intent Signals',
    'Revenue Metrics'
  ];

  const [activeSection, setActiveSection] = useState(formSections[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [icpData, setIcpData] = useState({
    // Roles & Responsibilities
    name: '',
    position: '',
    gender: '',
    ageRange: '',
    city: '',
    country: '',
    
    // Goals & Objectives
    responsibilities: '',
    urgentPainPoints: '',
    ownedKPIs: '',
    tacticalProblems: '',
    rootCause: '',
    businessImpact: '',
    dreamOutcome: '',
    socialMediaPlatforms: '',
    
    // Company Details
    companySize: '',
    industries: '',
    companyType: '',
    locations: '',
    revenueGrowth: '',
    b2bB2c: '',
    companyTargets: '',
    growthIndicators: '',
    competitivePosition: '',
    
    // Buying Behavior
    buyingProcessComplexity: '',
    purchaseAuthorityLevel: '',
    primaryEvaluationCriteria: '',
    secondaryEvaluationCriteria: '',
    decisionTimeline: '',
    budgetConsiderations: '',
    stakeholderInvolvement: '',
    riskTolerance: '',
    vendorPreferences: '',
    contractPreferences: '',
    
    // Outreach Preferences
    preferredCommunicationChannels: '',
    toolsTheyMightUse: '',
    suggestedToneOfVoice: '',
    touchpoints: '',
    messageResonance: '',
    timingOptimization: '',
    personalizationHooks: '',
    socialProofPreferences: '',
    alternatives: '',
    riskOfInaction: '',
    valuePropositionAlignment: '',
    freeResourceStrategy: '',
    toneOptimization: '',
    
    // Scoring Framework
    positiveIndicators: '',
    negativeSignals: '',
    intentWeights: '',
    firmographicMultipliers: '',
    timingFactors: '',
    
    // Conversion Path
    discoveryChannels: '',
    evaluationProcess: '',
    decisionTimeline: '',
    implementationPlanning: '',
    objectionPatterns: '',
    successValidation: '',
    
    // Intent Signals
    buyingTriggers: '',
    seasonalBuyingPatterns: '',
    competitiveDisplacementSignals: '',
    expansionTriggers: '',
    urgencyAccelerators: '',
    
    // Revenue Metrics
    lifetimeValuePredictors: '',
    upsellExpansionPotential: '',
    referralProbability: '',
    retentionRiskFactors: '',
    dealSizeInfluencers: ''
  });

  // AI Generation function
  const handleGenerate = () => {
    setIsModalOpen(false);
    setIsGenerating(true);

    // Simulate a 2.5 second API call
    setTimeout(() => {
      const mockData = {
        // Roles & Responsibilities
        name: 'Alex Johnson',
        position: 'VP of Operations',
        gender: 'Male',
        ageRange: '36-45',
        city: 'Austin',
        country: 'USA',
        
        // Goals & Objectives
        responsibilities: 'P&L for North American operations, long-term growth strategy, supply chain optimization, and team leadership across 5 regional offices.',
        urgentPainPoints: 'Logistics costs have increased by 18% year-over-year. Manual processes are causing 15% efficiency loss. Vendor management complexity is slowing down procurement by 30%.',
        ownedKPIs: 'Operating Margin (target: 15%), Supply Chain Efficiency (target: 95%), Employee Retention (target: 90%), Customer Satisfaction (target: 4.5/5), Cost per Unit (target: $2.50).',
        tacticalProblems: 'Inventory management across multiple warehouses, supplier coordination delays, manual reporting processes, outdated ERP integration issues.',
        rootCause: 'Legacy systems integration gaps, lack of real-time visibility, insufficient automation, fragmented data sources, limited cross-functional collaboration.',
        businessImpact: 'Revenue impact: $2.3M annual loss due to inefficiencies. Compliance risk: Potential audit findings worth $500K in penalties. Customer churn: 8% increase due to delivery delays.',
        dreamOutcome: 'Fully automated supply chain with real-time visibility, 95% efficiency rates, integrated AI-powered forecasting, seamless vendor partnerships, and predictive maintenance capabilities.',
        socialMediaPlatforms: 'LinkedIn (primary), Twitter (industry updates), YouTube (training content), Slack (team collaboration), Microsoft Teams (cross-functional communication).',
        
        // Company Details
        companySize: '201-1000',
        industries: 'Manufacturing, Logistics, Supply Chain Management, Industrial Automation, B2B Services',
        companyType: 'Enterprise',
        locations: 'Austin (HQ), Dallas, Houston, Phoenix, Denver, Seattle',
        revenueGrowth: 'Growing',
        b2bB2c: 'B2B',
        companyTargets: 'Expand to 3 new markets, increase operational efficiency by 25%, reduce costs by 15%, achieve 95% customer satisfaction, launch AI-powered analytics platform.',
        growthIndicators: '25% YoY revenue growth, 40% increase in new client acquisitions, 60% improvement in operational metrics, 80% employee satisfaction scores.',
        competitivePosition: 'Strong Competitor',
        
        // Buying Behavior
        buyingProcessComplexity: 'Complex',
        purchaseAuthorityLevel: 'C-Level',
        primaryEvaluationCriteria: 'ROI within 12 months, integration capabilities, scalability, vendor support quality, security compliance, implementation timeline.',
        secondaryEvaluationCriteria: 'User interface design, training requirements, customization options, data migration support, ongoing maintenance costs.',
        decisionTimeline: '3-6 months',
        budgetConsiderations: 'Budget range: $100K-$500K annually. Requires CFO approval for purchases over $250K. ROI must be demonstrated within 12 months.',
        stakeholderInvolvement: 'C-Level executives, IT department, operations team, finance team, legal compliance, end users, external consultants.',
        riskTolerance: 'Medium',
        vendorPreferences: 'Established vendors with proven track records, strong customer support, comprehensive documentation, security certifications, local presence preferred.',
        contractPreferences: 'Annual contracts with renewal options, service level agreements, data ownership clauses, termination conditions, pricing transparency.',
        
        // Outreach Preferences
        preferredCommunicationChannels: 'Email (primary), LinkedIn messages, phone calls for urgent matters, video calls for demos, in-person meetings for final decisions.',
        toolsTheyMightUse: 'Microsoft Teams, Slack, Zoom, Salesforce, HubSpot, LinkedIn Sales Navigator, Google Workspace, Confluence, Jira.',
        suggestedToneOfVoice: 'Professional yet approachable, data-driven with concrete examples, focused on business outcomes, collaborative and consultative.',
        touchpoints: 'Industry conferences, LinkedIn content, webinars, case studies, peer recommendations, analyst reports, trade publications.',
        messageResonance: 'Focus on operational efficiency, cost reduction, scalability, ROI metrics, competitive advantage, industry expertise.',
        timingOptimization: 'Best times: Tuesday-Thursday, 9-11 AM or 2-4 PM. Avoid: Monday mornings, Friday afternoons, end of quarter, holiday periods.',
        personalizationHooks: 'Reference their recent company expansion, mention industry challenges, highlight similar company success stories, reference their LinkedIn content.',
        socialProofPreferences: 'Case studies from similar companies, customer testimonials, industry awards, analyst recognition, peer recommendations.',
        alternatives: 'Competitor A: More expensive but better integration. Competitor B: Cheaper but limited scalability. Competitor C: Good features but poor support.',
        riskOfInaction: 'Continued operational inefficiencies, increased costs, competitive disadvantage, customer satisfaction decline, regulatory compliance risks.',
        valuePropositionAlignment: 'Direct alignment with cost reduction goals, operational efficiency improvements, scalability needs, and digital transformation initiatives.',
        freeResourceStrategy: 'Free trial periods, ROI calculators, industry benchmarking reports, implementation guides, best practice webinars.',
        toneOptimization: 'Executive-level communication, focus on strategic outcomes, data-driven arguments, collaborative approach, urgency without pressure.',
        
        // Scoring Framework
        positiveIndicators: 'Recent funding rounds, hiring sprees, technology investments, industry awards, leadership changes, expansion announcements, partnership announcements.',
        negativeSignals: 'Layoffs, budget cuts, leadership turnover, negative press, declining market share, regulatory issues, customer complaints.',
        intentWeights: 'Budget availability (40%), timeline urgency (25%), decision authority (20%), fit assessment (15%).',
        firmographicMultipliers: 'Company size (1.5x for 500+ employees), industry (1.3x for target verticals), growth stage (1.2x for growing companies).',
        timingFactors: 'End of quarter (1.3x), new fiscal year (1.4x), after funding (1.5x), competitive pressure (1.2x), regulatory changes (1.6x).',
        
        // Conversion Path
        discoveryChannels: 'LinkedIn outreach, content marketing, webinars, industry events, referrals, cold email, paid advertising, SEO content.',
        evaluationProcess: 'Initial discovery call, needs assessment, solution demonstration, pilot program, stakeholder meetings, proposal review, negotiation.',
        decisionTimeline: '3-6 months typical, can be accelerated to 1-2 months with proper urgency and executive sponsorship.',
        implementationPlanning: 'Phased rollout over 6-12 months, dedicated project manager, change management support, training programs, ongoing support.',
        objectionPatterns: 'Budget concerns, timeline constraints, integration complexity, change management challenges, ROI uncertainty, security concerns.',
        successValidation: 'KPI improvements, user adoption rates, cost savings achieved, efficiency gains, customer satisfaction scores, ROI metrics.',
        
        // Intent Signals
        buyingTriggers: 'New funding rounds, leadership changes, competitive pressure, regulatory changes, growth challenges, technology modernization needs.',
        seasonalBuyingPatterns: 'Q4 budget spending, Q1 planning periods, mid-year reviews, after earnings announcements, before fiscal year-end.',
        competitiveDisplacementSignals: 'Dissatisfaction with current vendor, contract renewals approaching, performance issues, cost concerns, feature limitations.',
        expansionTriggers: 'New market entry, product launches, team growth, geographic expansion, acquisition integration, digital transformation initiatives.',
        urgencyAccelerators: 'Regulatory deadlines, competitive threats, cost pressures, operational inefficiencies, customer demands, leadership mandates.',
        
        // Revenue Metrics
        lifetimeValuePredictors: 'Company size, growth rate, industry vertical, decision-making authority, budget flexibility, expansion potential, contract length.',
        upsellExpansionPotential: 'High potential for additional modules, enterprise features, professional services, training programs, consulting services.',
        referralProbability: 'Strong referral potential based on industry relationships, conference participation, and peer networking within target verticals.',
        retentionRiskFactors: 'Economic downturns, leadership changes, competitive pressure, integration challenges, budget constraints, strategic pivots.',
        dealSizeInfluencers: 'Company size, feature requirements, implementation complexity, contract length, payment terms, add-on services, multi-year commitments.'
      };

      setIcpData(mockData);
      setIsGenerating(false);
    }, 2500);
  };

  // Helper function to render form fields
  const renderFormField = (id: string, label: string, type: string = 'text', options?: string[]) => (
    <div className="form-field">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {type === 'select' && options ? (
        <select
          id={id}
          name={id}
          value={icpData[id as keyof typeof icpData] || ''}
          onChange={(e) => setIcpData({...icpData, [id]: e.target.value})}
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
          value={icpData[id as keyof typeof icpData] || ''}
          onChange={(e) => setIcpData({...icpData, [id]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={icpData[id as keyof typeof icpData] || ''}
          onChange={(e) => setIcpData({...icpData, [id]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Link href="/icp">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </Link>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        ✨ Generate with AI
      </button>
      <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all duration-300">
        Save ICP
      </button>
    </div>
  );

  return (
    <MainLayout title="Create New ICP" headerActions={headerActions}>
      {/* AI Prompt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate Profile with AI</h3>
            <p className="text-gray-600 mb-4">
              Describe your ideal customer profile and our AI will generate a comprehensive ICP for you.
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: A VP of Operations at a mid-size manufacturing company in Austin, Texas. They're struggling with supply chain inefficiencies and looking for automation solutions to reduce costs..."
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
                onClick={handleGenerate}
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
            <p className="text-xl font-semibold text-gray-700 mb-2">🤖 Our AI is building your profile...</p>
            <p className="text-gray-500">This will take just a moment</p>
          </div>
        </div>
      )}

      <div className="form-container flex flex-row w-full">
        <div className="form-sidebar w-1/4 flex-shrink-0 border-r border-gray-200 p-6">
          <div className="navigation-menu space-y-2">
            {formSections.map(section => (
              <button
                key={section}
                className={`nav-item w-full text-left px-4 py-3 text-sm rounded-lg border-none cursor-pointer transition-all duration-200 ${
                  activeSection === section 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
        <div className="form-content flex-grow p-8">
          {/* Roles & Responsibilities */}
          {activeSection === 'Roles & Responsibilities' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Roles & Responsibilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFormField('name', 'Name')}
                {renderFormField('position', 'Position')}
                {renderFormField('gender', 'Gender', 'select', ['Male', 'Female', 'Other', 'Prefer not to say'])}
                {renderFormField('ageRange', 'Age Range', 'select', ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'])}
                {renderFormField('city', 'City')}
                {renderFormField('country', 'Country')}
              </div>
            </div>
          )}

          {/* Goals & Objectives */}
          {activeSection === 'Goals & Objectives' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Goals & Objectives</h2>
              <div className="space-y-6">
                {renderFormField('responsibilities', 'Responsibilities (P&L / Strategy)', 'textarea')}
                {renderFormField('urgentPainPoints', 'Urgent Pain Points (Quantified)', 'textarea')}
                {renderFormField('ownedKPIs', 'Owned KPIs & Benchmarks', 'textarea')}
                {renderFormField('tacticalProblems', 'Tactical Problems', 'textarea')}
                {renderFormField('rootCause', 'Root Cause', 'textarea')}
                {renderFormField('businessImpact', 'Business Impact (Revenue/Compliance)', 'textarea')}
                {renderFormField('dreamOutcome', 'Dream Outcome (Future State)', 'textarea')}
                {renderFormField('socialMediaPlatforms', 'Social Media Platforms', 'textarea')}
              </div>
            </div>
          )}

          {/* Company Details */}
          {activeSection === 'Company Details' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFormField('companySize', 'Company Size', 'select', ['1-10', '11-50', '51-200', '201-1000', '1000+'])}
                {renderFormField('industries', 'Industries', 'textarea')}
                {renderFormField('companyType', 'Company Type', 'select', ['Startup', 'SMB', 'Enterprise', 'Non-profit', 'Government'])}
                {renderFormField('locations', 'Locations', 'textarea')}
                {renderFormField('revenueGrowth', 'Revenue Growth', 'select', ['Declining', 'Stable', 'Growing', 'Rapidly Growing'])}
                {renderFormField('b2bB2c', 'B2B / B2C', 'select', ['B2B', 'B2C', 'Both'])}
                {renderFormField('companyTargets', 'Company Targets', 'textarea')}
                {renderFormField('growthIndicators', 'Growth Indicators', 'textarea')}
                {renderFormField('competitivePosition', 'Competitive Position', 'select', ['Market Leader', 'Strong Competitor', 'Challenger', 'Niche Player'])}
              </div>
            </div>
          )}

          {/* Buying Behavior */}
          {activeSection === 'Buying Behavior' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Buying Behavior</h2>
              <div className="space-y-6">
                {renderFormField('buyingProcessComplexity', 'Buying Process Complexity', 'select', ['Simple', 'Moderate', 'Complex', 'Very Complex'])}
                {renderFormField('purchaseAuthorityLevel', 'Purchase Authority Level', 'select', ['Individual', 'Team Lead', 'Department Head', 'C-Level'])}
                {renderFormField('primaryEvaluationCriteria', 'Primary Evaluation Criteria', 'textarea')}
                {renderFormField('secondaryEvaluationCriteria', 'Secondary Evaluation Criteria', 'textarea')}
                {renderFormField('decisionTimeline', 'Decision Timeline', 'select', ['Immediate', '1-3 months', '3-6 months', '6-12 months', '12+ months'])}
                {renderFormField('budgetConsiderations', 'Budget Considerations', 'textarea')}
                {renderFormField('stakeholderInvolvement', 'Stakeholder Involvement', 'textarea')}
                {renderFormField('riskTolerance', 'Risk Tolerance', 'select', ['Low', 'Medium', 'High'])}
                {renderFormField('vendorPreferences', 'Vendor Preferences', 'textarea')}
                {renderFormField('contractPreferences', 'Contract Preferences', 'textarea')}
              </div>
            </div>
          )}

          {/* Outreach Preferences */}
          {activeSection === 'Outreach Preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Outreach Preferences</h2>
              <div className="space-y-6">
                {renderFormField('preferredCommunicationChannels', 'Preferred Communication Channels', 'textarea')}
                {renderFormField('toolsTheyMightUse', 'Tools They Might Use', 'textarea')}
                {renderFormField('suggestedToneOfVoice', 'Suggested Tone of Voice', 'textarea')}
                {renderFormField('touchpoints', 'Touchpoints', 'textarea')}
                {renderFormField('messageResonance', 'Message Resonance', 'textarea')}
                {renderFormField('timingOptimization', 'Timing Optimization', 'textarea')}
                {renderFormField('personalizationHooks', 'Personalization Hooks', 'textarea')}
                {renderFormField('socialProofPreferences', 'Social Proof Preferences', 'textarea')}
                {renderFormField('alternatives', 'Alternatives', 'textarea')}
                {renderFormField('riskOfInaction', 'Risk of Inaction', 'textarea')}
                {renderFormField('valuePropositionAlignment', 'Value Proposition Alignment', 'textarea')}
                {renderFormField('freeResourceStrategy', 'Free Resource Strategy', 'textarea')}
                {renderFormField('toneOptimization', 'Tone Optimization', 'textarea')}
              </div>
            </div>
          )}

          {/* Scoring Framework */}
          {activeSection === 'Scoring Framework' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Scoring Framework</h2>
              <div className="space-y-6">
                {renderFormField('positiveIndicators', 'Positive Indicators', 'textarea')}
                {renderFormField('negativeSignals', 'Negative Signals', 'textarea')}
                {renderFormField('intentWeights', 'Intent Weights', 'textarea')}
                {renderFormField('firmographicMultipliers', 'Firmographic Multipliers', 'textarea')}
                {renderFormField('timingFactors', 'Timing Factors', 'textarea')}
              </div>
            </div>
          )}

          {/* Conversion Path */}
          {activeSection === 'Conversion Path' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversion Path</h2>
              <div className="space-y-6">
                {renderFormField('discoveryChannels', 'Discovery Channels', 'textarea')}
                {renderFormField('evaluationProcess', 'Evaluation Process', 'textarea')}
                {renderFormField('decisionTimeline', 'Decision Timeline', 'textarea')}
                {renderFormField('implementationPlanning', 'Implementation Planning', 'textarea')}
                {renderFormField('objectionPatterns', 'Objection Patterns', 'textarea')}
                {renderFormField('successValidation', 'Success Validation', 'textarea')}
              </div>
            </div>
          )}

          {/* Intent Signals */}
          {activeSection === 'Intent Signals' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Intent Signals</h2>
              <div className="space-y-6">
                {renderFormField('buyingTriggers', 'Buying Triggers', 'textarea')}
                {renderFormField('seasonalBuyingPatterns', 'Seasonal Buying Patterns', 'textarea')}
                {renderFormField('competitiveDisplacementSignals', 'Competitive Displacement Signals', 'textarea')}
                {renderFormField('expansionTriggers', 'Expansion Triggers', 'textarea')}
                {renderFormField('urgencyAccelerators', 'Urgency Accelerators', 'textarea')}
              </div>
            </div>
          )}

          {/* Revenue Metrics */}
          {activeSection === 'Revenue Metrics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Metrics</h2>
              <div className="space-y-6">
                {renderFormField('lifetimeValuePredictors', 'Lifetime Value Predictors', 'textarea')}
                {renderFormField('upsellExpansionPotential', 'Upsell Expansion Potential', 'textarea')}
                {renderFormField('referralProbability', 'Referral Probability', 'textarea')}
                {renderFormField('retentionRiskFactors', 'Retention Risk Factors', 'textarea')}
                {renderFormField('dealSizeInfluencers', 'Deal Size Influencers', 'textarea')}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateICPPage;
