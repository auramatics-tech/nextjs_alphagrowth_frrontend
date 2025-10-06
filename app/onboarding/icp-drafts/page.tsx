'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, MapPin, Check, ChevronDown, Lock, ArrowRight, BrainCircuit, Edit3, Loader2, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/layout';
import { AccordionCard, AutoSizingTextarea, EditableField } from '../../../components/onboarding/icp';
import { businessService } from '../../../services/businessService';
import { IcpData, IcpGoalsObjectives, IcpCompanyDetail, IcpOutreach, IcpScoringFramework, IcpConversionPath, IcpIntentSignals, IcpRevenueMetrics, IcpBuyingBehavior } from '../../../types/icp.types';
import { parseIcpData, safeParseOrWrapInArray } from '../../../utils/icpParsing';

// --- Reusable Themed Components ---

const OnboardingStepper = ({ currentStep, totalSteps = 6 }: { currentStep: number; totalSteps?: number }) => (
    <div className="flex items-center gap-2">
        {[...Array(totalSteps)].map((_, i) => {
            const step = i + 1;
            const isCompleted = step < currentStep;
            const isActive = step === currentStep;
            return (
                <div key={i} className="flex items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCompleted ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white' : isActive ? 'border-2 border-[#FF6B2C] text-[#FF6B2C]' : 'bg-gray-200 text-gray-500'}`}>
                        {isCompleted ? <Check size={12} /> : step}
                    </div>
                    {i < totalSteps - 1 && <div className={`h-0.5 flex-1 rounded-full ${isCompleted ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF]' : 'bg-gray-200'}`}></div>}
                </div>
            );
        })}
    </div>
);

// Moved UI helpers to components/onboarding/icp

// --- Main Page Component ---
type ParsedIcpData = Omit<IcpData, 'goalsAndObjectives' | 'companyDetail' | 'outReach' | 'scoringFramework' | 'conversionPath' | 'intentSignals' | 'revenueMetrics' | 'buyingBehavior'> & {
    goalsAndObjectives: IcpGoalsObjectives;
    companyDetail: IcpCompanyDetail;
    outReach: IcpOutreach;
    scoringFramework: IcpScoringFramework;
    conversionPath: IcpConversionPath;
    intentSignals: IcpIntentSignals;
    revenueMetrics: IcpRevenueMetrics;
    buyingBehavior: IcpBuyingBehavior;
};

export default function IcpDraftsPage() {
    const router = useRouter();
    const businessId = typeof window !== 'undefined' ? localStorage.getItem('businessId') : null;
    
    // Dynamic ICP data from API
    const [icpData, setIcpData] = useState<ParsedIcpData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Multiple form states per section (like frontend_old)
    const [formData, setFormData] = useState({
        rolesResponsibilites: {} as any,
        goalsAndObjectives: {} as any,
        companyDetail: {} as any,
        outReach: {} as any,
        scoringFramework: {} as any,
        conversionPath: {} as any,
        intentSignals: {} as any,
        revenueMetrics: {} as any,
        buyingBehavior: {} as any,
        businessId: businessId,
        icpId: '',
        type: ''
    });

    // Load ICP data from API on mount
    useEffect(() => {
        if (!businessId) {
            router.push('/onboarding/business-overview');
            return;
        }
        loadIcpData();
    }, [businessId, router]);

    const loadIcpData = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await businessService.getIcps(businessId!);
            if (response.error) {
                setError(response.error);
                return;
            }
            
            // Check if response has icps array (API returns icps, not icp)
            if (!response.icps || !Array.isArray(response.icps) || response.icps.length === 0) {
                setError('No ICP data found');
                return;
            }

            // Get the first ICP from the array
            const firstIcp = response.icps[0];
            
            // Parse the complex ICP data
            const parsedData = parseIcpData(firstIcp);
            setIcpData(parsedData);
            
            // Set ICP ID for updates
            setFormData(prev => ({
                ...prev,
                icpId: firstIcp.id
            }));

        } catch (err: any) {
            setError('Failed to load ICP data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle section editing (like frontend_old)
    const handleSectionEdit = (type: string) => {
        if (!icpData) return;
        console.log('[ICP Drafts] Edit clicked → type:', type);
        console.log('[ICP Drafts] icpData snapshot before edit:', icpData);
        
        setFormData(prev => ({
            ...prev,
            icpId: icpData.id,
            type: type
        }));

        // Load section data into form
        if (type === 'rolesResponsibilites') {
            setFormData(prev => ({
                ...prev,
                rolesResponsibilites: {
                    target_job_titles: icpData.position || '',
                    name: icpData.name || '',
                    gender: icpData.gender || '',
                    ageRange: icpData.ageRange || '',
                    location_city: icpData.location_city || '',
                    location_country: icpData.location_country || ''
                }
            }));
        } else if (type === 'goalsAndObjectives') {
            const parsed = typeof icpData.goalsAndObjectives === 'string' 
                ? JSON.parse(icpData.goalsAndObjectives) 
                : icpData.goalsAndObjectives || {};
            
            setFormData(prev => ({
                ...prev,
                goalsAndObjectives: {
                    goals_obj_responsibilities: parsed.goals_obj_responsibilities || '',
                    goals_obj_pain_points: parsed.goals_obj_pain_points || '',
                    goals_obj_metric_affected: parsed.goals_obj_metric_affected || '',
                    goals_obj_tactical_problem: parsed.goals_obj_tactical_problem || '',
                    goals_obj_root_cause: parsed.goals_obj_root_cause || '',
                    goals_obj_business_impact: parsed.goals_obj_business_impact || '',
                    goals_obj_dream_outcome: parsed.goals_obj_dream_outcome || '',
                    goals_obj_social_media: safeParseOrWrapInArray(parsed.goals_obj_social_media).join(', ')
                }
            }));
        } else if (type === 'companyDetail') {
            const parsed = typeof icpData.companyDetail === 'string' 
                ? JSON.parse(icpData.companyDetail) 
                : icpData.companyDetail || {};
            
            setFormData(prev => ({
                ...prev,
                companyDetail: {
                    company_size: parsed.company_size || '',
                    industries: safeParseOrWrapInArray(parsed.industries).join(', '),
                    company_type: parsed.company_type || '',
                    locations: parsed.locations || '',
                    company_revenue_growth: parsed.company_revenue_growth || '',
                    company_location_city: parsed.company_location_city || '',
                    company_location_country: parsed.company_location_country || '',
                    company_b2b_b2c: parsed.company_b2b_b2c || '',
                    company_targets: safeParseOrWrapInArray(parsed.company_targets).join(', '),
                    company_growth_indicators: safeParseOrWrapInArray(parsed.company_growth_indicators).join(', '),
                    company_competitive_position: parsed.company_competitive_position || ''
                }
            }));
        }
        // Immediately submit this section (frontend_old behavior)
        submitSection(type);
    };

    // Save section changes to API
    // Build section payload from current icpData when formData for that section is empty
    const buildSectionDataFromIcp = (type: string) => {
        if (!icpData) return {};
        switch (type) {
            case 'rolesResponsibilites':
                return {
                    target_job_titles: icpData.position || '',
                    name: icpData.name || '',
                    gender: icpData.gender || '',
                    ageRange: icpData.ageRange || '',
                    location_city: icpData.location_city || '',
                    location_country: icpData.location_country || ''
                };
            case 'goalsAndObjectives':
                return {
                    goals_obj_responsibilities: (icpData as any).goalsAndObjectives?.goals_obj_responsibilities || '',
                    goals_obj_pain_points: (icpData as any).goalsAndObjectives?.goals_obj_pain_points || '',
                    goals_obj_metric_affected: (icpData as any).goalsAndObjectives?.goals_obj_metric_affected || '',
                    goals_obj_tactical_problem: (icpData as any).goalsAndObjectives?.goals_obj_tactical_problem || '',
                    goals_obj_root_cause: (icpData as any).goalsAndObjectives?.goals_obj_root_cause || '',
                    goals_obj_business_impact: (icpData as any).goalsAndObjectives?.goals_obj_business_impact || '',
                    goals_obj_dream_outcome: (icpData as any).goalsAndObjectives?.goals_obj_dream_outcome || '',
                    goals_obj_social_media: (icpData as any).goalsAndObjectives?.goals_obj_social_media || []
                };
            case 'companyDetail':
                return {
                    company_size: (icpData as any).companyDetail?.company_size || '',
                    industries: (icpData as any).companyDetail?.industries || [],
                    company_type: (icpData as any).companyDetail?.company_type || '',
                    locations: (icpData as any).companyDetail?.locations || '',
                    company_revenue_growth: (icpData as any).companyDetail?.company_revenue_growth || '',
                    company_location_city: (icpData as any).companyDetail?.company_location_city || '',
                    company_location_country: (icpData as any).companyDetail?.company_location_country || '',
                    company_b2b_b2c: (icpData as any).companyDetail?.company_b2b_b2c || '',
                    company_targets: (icpData as any).companyDetail?.company_targets || [],
                    company_growth_indicators: (icpData as any).companyDetail?.company_growth_indicators || [],
                    company_competitive_position: (icpData as any).companyDetail?.company_competitive_position || ''
                };
            case 'outReach':
                return {
                    preferred_communication_channels: (icpData as any).outReach?.preferred_communication_channels || '',
                    tools_they_might_use: (icpData as any).outReach?.tools_they_might_use || '',
                    suggested_tone_of_voice: (icpData as any).outReach?.suggested_tone_of_voice || '',
                    out_touchpoints: (icpData as any).outReach?.out_touchpoints || [],
                    out_message_resonance: (icpData as any).outReach?.out_message_resonance || [],
                    out_timing_optimization: (icpData as any).outReach?.out_timing_optimization || '',
                    out_personalization_hooks: (icpData as any).outReach?.out_personalization_hooks || [],
                    out_social_proof_preferences: (icpData as any).outReach?.out_social_proof_preferences || [],
                    out_alternatives: (icpData as any).outReach?.out_alternatives || '',
                    out_risk_of_inaction: (icpData as any).outReach?.out_risk_of_inaction || [],
                    out_value_proposition_alignment: (icpData as any).outReach?.out_value_proposition_alignment || [],
                    out_free_resource_strategy: (icpData as any).outReach?.out_free_resource_strategy || '',
                    out_tone_optimization: (icpData as any).outReach?.out_tone_optimization || []
                };
            case 'scoringFramework':
                return {
                    scoring_positive_indicators: (icpData as any).scoringFramework?.scoring_positive_indicators || [],
                    scoring_negative_signals: (icpData as any).scoringFramework?.scoring_negative_signals || [],
                    scoring_intent_weights: (icpData as any).scoringFramework?.scoring_intent_weights || [],
                    scoring_firmographic_multipliers: (icpData as any).scoringFramework?.scoring_firmographic_multipliers || [],
                    scoring_timing_factors: (icpData as any).scoringFramework?.scoring_timing_factors || []
                };
            case 'conversionPath':
                return {
                    path_discovery_channels: (icpData as any).conversionPath?.path_discovery_channels || [],
                    path_evaluation_process: (icpData as any).conversionPath?.path_evaluation_process || [],
                    path_decision_timeline: (icpData as any).conversionPath?.path_decision_timeline || [],
                    path_implementation_planning: (icpData as any).conversionPath?.path_implementation_planning || [],
                    path_objection_patterns: (icpData as any).conversionPath?.path_objection_patterns || [],
                    path_success_validation: (icpData as any).conversionPath?.path_success_validation || []
                };
            case 'intentSignals':
                return {
                    buying_triggers: (icpData as any).intentSignals?.buying_triggers || [],
                    seasonal_buying_patterns: (icpData as any).intentSignals?.seasonal_buying_patterns || [],
                    competitive_displacement_signals: (icpData as any).intentSignals?.competitive_displacement_signals || [],
                    expansion_triggers: (icpData as any).intentSignals?.expansion_triggers || [],
                    urgency_accelerators: (icpData as any).intentSignals?.urgency_accelerators || []
                };
            case 'revenueMetrics':
                return {
                    lifetime_value_predictors: (icpData as any).revenueMetrics?.lifetime_value_predictors || [],
                    upsell_expansion_potential: (icpData as any).revenueMetrics?.upsell_expansion_potential || [],
                    referral_probability: (icpData as any).revenueMetrics?.referral_probability || [],
                    retention_risk_factors: (icpData as any).revenueMetrics?.retention_risk_factors || [],
                    deal_size_influencers: (icpData as any).revenueMetrics?.deal_size_influencers || []
                };
            case 'buyingBehavior':
                return {
                    buying_process_complexity: (icpData as any).buyingBehavior?.buying_process_complexity || [],
                    purchase_authority_level: (icpData as any).buyingBehavior?.purchase_authority_level || [],
                    evaluation_criteria_primary: (icpData as any).buyingBehavior?.evaluation_criteria_primary || [],
                    evaluation_criteria_secondary: (icpData as any).buyingBehavior?.evaluation_criteria_secondary || [],
                    decision_timeline: (icpData as any).buyingBehavior?.decision_timeline || [],
                    budget_considerations: (icpData as any).buyingBehavior?.budget_considerations || [],
                    stakeholder_involvement: (icpData as any).buyingBehavior?.stakeholder_involvement || [],
                    risk_tolerance: (icpData as any).buyingBehavior?.risk_tolerance || [],
                    vendor_preferences: (icpData as any).buyingBehavior?.vendor_preferences || [],
                    contract_preferences: (icpData as any).buyingBehavior?.contract_preferences || []
                };
            default:
                return {};
        }
    };

    const submitSection = async (type: string) => {
        try {
            setSaving(true);
            setError('');

            // Always derive from current icpData snapshot to keep it simple and reliable
            const derivedSectionData = buildSectionDataFromIcp(type);

            console.log('[ICP Drafts] Derived sectionData:', derivedSectionData);

            const payload = {
                businessId: businessId as string,
                icpId: icpData?.id || formData.icpId,
                section: type,
                sectionData: derivedSectionData
            };

            console.log('[ICP Drafts] Submitting payload (structured):', payload);
            const response = await businessService.updateIcpSection(payload);
            console.log('[ICP Drafts] API response:', response);
            if (response.error) {
                setError(response.error);
                return;
            }

            // Reload data to get updated ICP
            await loadIcpData();
            
        } catch (err: any) {
            setError('Failed to save changes');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Keep old handler (used for field-level updates)
    const handleSaveSection = async () => submitSection(formData.type);

    // Handle form field changes
    const handleFieldChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [formData.type]: {
                ...prev[formData.type as keyof typeof formData],
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#FF6B2C]" />
                    <p className="mt-4 text-gray-600">Loading your ICP data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={loadIcpData} className="px-4 py-2 bg-[#FF6B2C] text-white rounded">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!icpData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">No ICP data available</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Header />
            <div className="flex-1 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        
                        {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-semibold text-[#1E1E1E]">Review Your AI-Drafted ICP</h1>
                        <p className="mt-4 max-w-3xl mx-auto text-base text-gray-500">Confirm or edit the details below. This profile will be linked to your campaigns to generate highly relevant, personalized content.</p>
                        <div className="mt-6 max-w-md mx-auto"><OnboardingStepper currentStep={4} totalSteps={6}/></div>
                    </div>
                    
                        {/* AI Context Box */}
                    <div className="mt-8 p-4 bg-blue-50 border-l-4 border-[#3AA3FF] rounded-r-lg flex items-start gap-3">
                        <BrainCircuit size={24} className="text-[#3AA3FF] mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900">For the Best AI Results</h3>
                            <p className="text-sm text-blue-800">The more accurate this profile is, the better our AI can personalize outreach, suggest talking points, and find high-intent prospects for you.</p>
                        </div>
                    </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-600 text-sm flex items-center gap-1">
                                    <AlertCircle size={16} />
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Persona Summary Card */}
                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-6 grid md:grid-cols-2 gap-6">
                         <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User size={40} className="text-gray-400" />
                                </div>
                            <div>
                                    <input 
                                        type="text" 
                                        value={icpData.name} 
                                        onChange={e => setIcpData({...icpData, name: e.target.value})} 
                                        className="text-xl font-bold text-[#1E1E1E] bg-transparent focus:outline-none focus:ring-1 focus:ring-[#FF6B2C] rounded-md px-1 -ml-1" 
                                    />
                                    <input 
                                        type="text" 
                                        value={icpData.position} 
                                        onChange={e => setIcpData({...icpData, position: e.target.value})} 
                                        className="text-base text-gray-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#FF6B2C] rounded-md px-1 -ml-1 w-full mt-1" 
                                    />
                            </div>
                        </div>
                        <div className="border-t md:border-t-0 md:border-l border-gray-200 pl-0 md:pl-6 pt-6 md:pt-0">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Edit3 size={14}/> Key Insights (Editable)
                                </h3>
                             <div className="mt-2 space-y-2">
                                 <div>
                                        <strong className="font-semibold text-gray-800 text-sm">Location:</strong>
                                        <span className="text-sm text-gray-600 ml-2">
                                            {icpData.location_city}, {icpData.location_country}
                                        </span>
                                </div>
                                 <div>
                                        <strong className="font-semibold text-gray-800 text-sm">Age Range:</strong>
                                        <span className="text-sm text-gray-600 ml-2">{icpData.ageRange}</span>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* ICP Sections */}
                        <div className="mt-8 space-y-4">
                            
                            {/* Roles & Responsibilities */}
                            <AccordionCard title="Roles & Responsibilities" defaultOpen={true}>
                                <div className="grid grid-cols-2 gap-4">
                                    <EditableField 
                                        label="Name" 
                                        value={icpData.name} 
                                        onChange={(e) => { 
                                            console.log('[ICP Drafts] Change Name →', e.target.value);
                                            setIcpData({...icpData, name: e.target.value});
                                            handleFieldChange('name', e.target.value);
                                        }} 
                                    />
                                    <EditableField 
                                        label="Position" 
                                        value={icpData.position} 
                                        onChange={(e) => { 
                                            console.log('[ICP Drafts] Change Position →', e.target.value);
                                            setIcpData({...icpData, position: e.target.value});
                                            handleFieldChange('target_job_titles', e.target.value);
                                        }} 
                                    />
                                    <EditableField 
                                        label="Gender" 
                                        value={icpData.gender} 
                                        onChange={(e) => { 
                                            console.log('[ICP Drafts] Change Gender →', e.target.value);
                                            setIcpData({...icpData, gender: e.target.value});
                                            handleFieldChange('gender', e.target.value);
                                        }} 
                                    />
                                    <EditableField 
                                        label="Age Range" 
                                        value={icpData.ageRange} 
                                        onChange={(e) => { 
                                            console.log('[ICP Drafts] Change Age Range →', e.target.value);
                                            setIcpData({...icpData, ageRange: e.target.value});
                                            handleFieldChange('ageRange', e.target.value);
                                        }} 
                                    />
                                    <EditableField 
                                        label="City" 
                                        value={icpData.location_city} 
                                        onChange={(e) => { 
                                            console.log('[ICP Drafts] Change City →', e.target.value);
                                            setIcpData({...icpData, location_city: e.target.value});
                                            handleFieldChange('location_city', e.target.value);
                                        }} 
                                    />
                                    <EditableField 
                                        label="Country" 
                                        value={icpData.location_country} 
                                        onChange={(e) => { 
                                            console.log('[ICP Drafts] Change Country →', e.target.value);
                                            setIcpData({...icpData, location_country: e.target.value});
                                            handleFieldChange('location_country', e.target.value);
                                        }} 
                                    />
                              </div>
                                <button 
                                    onClick={() => handleSectionEdit('rolesResponsibilites')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                            {/* Goals & Objectives */}
                            <AccordionCard title="Goals & Objectives" defaultOpen={true}>
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Responsibilities (P&L / Strategy)" 
                                        value={icpData.goalsAndObjectives.goals_obj_responsibilities} 
                                        onChange={(e) => setIcpData({...icpData, goalsAndObjectives: {...icpData.goalsAndObjectives, goals_obj_responsibilities: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Urgent Pain Points (Quantified)" 
                                        value={icpData.goalsAndObjectives.goals_obj_pain_points} 
                                        onChange={(e) => setIcpData({...icpData, goalsAndObjectives: {...icpData.goalsAndObjectives, goals_obj_pain_points: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Owned KPIs & Benchmarks" 
                                        value={icpData.goalsAndObjectives.goals_obj_metric_affected} 
                                        onChange={(e) => setIcpData({...icpData, goalsAndObjectives: {...icpData.goalsAndObjectives, goals_obj_metric_affected: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Tactical Problems" 
                                        value={icpData.goalsAndObjectives.goals_obj_tactical_problem} 
                                        onChange={(e) => setIcpData({...icpData, goalsAndObjectives: {...icpData.goalsAndObjectives, goals_obj_tactical_problem: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Root Cause" 
                                        value={icpData.goalsAndObjectives.goals_obj_root_cause} 
                                        onChange={(e) => setIcpData({...icpData, goalsAndObjectives: {...icpData.goalsAndObjectives, goals_obj_root_cause: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Business Impact (Revenue/Compliance)" 
                                        value={icpData.goalsAndObjectives.goals_obj_business_impact} 
                                        onChange={(e) => setIcpData({...icpData, goalsAndObjectives: {...icpData.goalsAndObjectives, goals_obj_business_impact: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Dream Outcome (Future State)" 
                                        value={icpData.goalsAndObjectives.goals_obj_dream_outcome} 
                                        onChange={(e) => setIcpData({...icpData, goalsAndObjectives: {...icpData.goalsAndObjectives, goals_obj_dream_outcome: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Social Media Platforms" 
                                        value={Array.isArray(icpData.goalsAndObjectives.goals_obj_social_media) ? icpData.goalsAndObjectives.goals_obj_social_media.join(', ') : icpData.goalsAndObjectives.goals_obj_social_media} 
                                        onChange={(e) => setIcpData({...icpData, goalsAndObjectives: {...icpData.goalsAndObjectives, goals_obj_social_media: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleSectionEdit('goalsAndObjectives')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                            {/* Company Details */}
                            <AccordionCard title="Company Details" defaultOpen={true}>
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Company Size" 
                                        value={icpData.companyDetail.company_size} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, company_size: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Industries" 
                                        value={Array.isArray(icpData.companyDetail.industries) ? icpData.companyDetail.industries.join(', ') : icpData.companyDetail.industries} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, industries: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Company Type" 
                                        value={icpData.companyDetail.company_type} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, company_type: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Locations" 
                                        value={icpData.companyDetail.locations} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, locations: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Revenue Growth" 
                                        value={icpData.companyDetail.company_revenue_growth} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, company_revenue_growth: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="B2B/B2C" 
                                        value={icpData.companyDetail.company_b2b_b2c} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, company_b2b_b2c: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Company Targets" 
                                        value={Array.isArray(icpData.companyDetail.company_targets) ? icpData.companyDetail.company_targets.join(', ') : icpData.companyDetail.company_targets} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, company_targets: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Growth Indicators" 
                                        value={Array.isArray(icpData.companyDetail.company_growth_indicators) ? icpData.companyDetail.company_growth_indicators.join(', ') : icpData.companyDetail.company_growth_indicators} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, company_growth_indicators: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Competitive Position" 
                                        value={icpData.companyDetail.company_competitive_position} 
                                        onChange={(e) => setIcpData({...icpData, companyDetail: {...icpData.companyDetail, company_competitive_position: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleSectionEdit('companyDetail')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                            {/* Outreach Preferences */}
                            <AccordionCard title="Outreach Preferences">
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Preferred Communication Channels" 
                                        value={icpData.outReach.preferred_communication_channels} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, preferred_communication_channels: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Tools They Might Use" 
                                        value={icpData.outReach.tools_they_might_use} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, tools_they_might_use: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Suggested Tone of Voice" 
                                        value={icpData.outReach.suggested_tone_of_voice} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, suggested_tone_of_voice: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Touchpoints" 
                                        value={Array.isArray(icpData.outReach.out_touchpoints) ? icpData.outReach.out_touchpoints.join(', ') : icpData.outReach.out_touchpoints} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_touchpoints: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Message Resonance" 
                                        value={Array.isArray(icpData.outReach.out_message_resonance) ? icpData.outReach.out_message_resonance.join(', ') : icpData.outReach.out_message_resonance} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_message_resonance: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Timing Optimization" 
                                        value={icpData.outReach.out_timing_optimization} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_timing_optimization: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Personalization Hooks" 
                                        value={Array.isArray(icpData.outReach.out_personalization_hooks) ? icpData.outReach.out_personalization_hooks.join(', ') : icpData.outReach.out_personalization_hooks} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_personalization_hooks: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Social Proof Preferences" 
                                        value={Array.isArray(icpData.outReach.out_social_proof_preferences) ? icpData.outReach.out_social_proof_preferences.join(', ') : icpData.outReach.out_social_proof_preferences} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_social_proof_preferences: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Alternatives" 
                                        value={icpData.outReach.out_alternatives} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_alternatives: e.target.value}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Risk of Inaction" 
                                        value={Array.isArray(icpData.outReach.out_risk_of_inaction) ? icpData.outReach.out_risk_of_inaction.join(', ') : icpData.outReach.out_risk_of_inaction} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_risk_of_inaction: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Value Proposition Alignment" 
                                        value={Array.isArray(icpData.outReach.out_value_proposition_alignment) ? icpData.outReach.out_value_proposition_alignment.join(', ') : icpData.outReach.out_value_proposition_alignment} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_value_proposition_alignment: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Free Resource Strategy" 
                                        value={icpData.outReach.out_free_resource_strategy} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_free_resource_strategy: e.target.value}})} 
                                    />
                                    <EditableField 
                                        label="Tone Optimization" 
                                        value={Array.isArray(icpData.outReach.out_tone_optimization) ? icpData.outReach.out_tone_optimization.join(', ') : icpData.outReach.out_tone_optimization} 
                                        onChange={(e) => setIcpData({...icpData, outReach: {...icpData.outReach, out_tone_optimization: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleSectionEdit('outReach')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                            {/* Scoring Framework */}
                            <AccordionCard title="Scoring Framework">
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Positive Indicators" 
                                        value={Array.isArray(icpData.scoringFramework.scoring_positive_indicators) ? icpData.scoringFramework.scoring_positive_indicators.join(', ') : icpData.scoringFramework.scoring_positive_indicators} 
                                        onChange={(e) => setIcpData({...icpData, scoringFramework: {...icpData.scoringFramework, scoring_positive_indicators: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Negative Signals" 
                                        value={Array.isArray(icpData.scoringFramework.scoring_negative_signals) ? icpData.scoringFramework.scoring_negative_signals.join(', ') : icpData.scoringFramework.scoring_negative_signals} 
                                        onChange={(e) => setIcpData({...icpData, scoringFramework: {...icpData.scoringFramework, scoring_negative_signals: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Intent Weights" 
                                        value={Array.isArray(icpData.scoringFramework.scoring_intent_weights) ? icpData.scoringFramework.scoring_intent_weights.join(', ') : icpData.scoringFramework.scoring_intent_weights} 
                                        onChange={(e) => setIcpData({...icpData, scoringFramework: {...icpData.scoringFramework, scoring_intent_weights: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Firmographic Multipliers" 
                                        value={Array.isArray(icpData.scoringFramework.scoring_firmographic_multipliers) ? icpData.scoringFramework.scoring_firmographic_multipliers.join(', ') : icpData.scoringFramework.scoring_firmographic_multipliers} 
                                        onChange={(e) => setIcpData({...icpData, scoringFramework: {...icpData.scoringFramework, scoring_firmographic_multipliers: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Timing Factors" 
                                        value={Array.isArray(icpData.scoringFramework.scoring_timing_factors) ? icpData.scoringFramework.scoring_timing_factors.join(', ') : icpData.scoringFramework.scoring_timing_factors} 
                                        onChange={(e) => setIcpData({...icpData, scoringFramework: {...icpData.scoringFramework, scoring_timing_factors: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleSectionEdit('scoringFramework')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                            {/* Conversion Path */}
                            <AccordionCard title="Conversion Path">
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Discovery Channels" 
                                        value={Array.isArray(icpData.conversionPath.path_discovery_channels) ? icpData.conversionPath.path_discovery_channels.join(', ') : icpData.conversionPath.path_discovery_channels} 
                                        onChange={(e) => setIcpData({...icpData, conversionPath: {...icpData.conversionPath, path_discovery_channels: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Evaluation Process" 
                                        value={Array.isArray(icpData.conversionPath.path_evaluation_process) ? icpData.conversionPath.path_evaluation_process.join(', ') : icpData.conversionPath.path_evaluation_process} 
                                        onChange={(e) => setIcpData({...icpData, conversionPath: {...icpData.conversionPath, path_evaluation_process: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Decision Timeline" 
                                        value={Array.isArray(icpData.conversionPath.path_decision_timeline) ? icpData.conversionPath.path_decision_timeline.join(', ') : icpData.conversionPath.path_decision_timeline} 
                                        onChange={(e) => setIcpData({...icpData, conversionPath: {...icpData.conversionPath, path_decision_timeline: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Implementation Planning" 
                                        value={Array.isArray(icpData.conversionPath.path_implementation_planning) ? icpData.conversionPath.path_implementation_planning.join(', ') : icpData.conversionPath.path_implementation_planning} 
                                        onChange={(e) => setIcpData({...icpData, conversionPath: {...icpData.conversionPath, path_implementation_planning: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Objection Patterns" 
                                        value={Array.isArray(icpData.conversionPath.path_objection_patterns) ? icpData.conversionPath.path_objection_patterns.join(', ') : icpData.conversionPath.path_objection_patterns} 
                                        onChange={(e) => setIcpData({...icpData, conversionPath: {...icpData.conversionPath, path_objection_patterns: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Success Validation" 
                                        value={Array.isArray(icpData.conversionPath.path_success_validation) ? icpData.conversionPath.path_success_validation.join(', ') : icpData.conversionPath.path_success_validation} 
                                        onChange={(e) => setIcpData({...icpData, conversionPath: {...icpData.conversionPath, path_success_validation: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleSectionEdit('conversionPath')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                            {/* Intent Signals */}
                            <AccordionCard title="Intent Signals">
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Buying Triggers" 
                                        value={Array.isArray(icpData.intentSignals.buying_triggers) ? icpData.intentSignals.buying_triggers.join(', ') : icpData.intentSignals.buying_triggers} 
                                        onChange={(e) => setIcpData({...icpData, intentSignals: {...icpData.intentSignals, buying_triggers: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Seasonal Buying Patterns" 
                                        value={Array.isArray(icpData.intentSignals.seasonal_buying_patterns) ? icpData.intentSignals.seasonal_buying_patterns.join(', ') : icpData.intentSignals.seasonal_buying_patterns} 
                                        onChange={(e) => setIcpData({...icpData, intentSignals: {...icpData.intentSignals, seasonal_buying_patterns: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Competitive Displacement Signals" 
                                        value={Array.isArray(icpData.intentSignals.competitive_displacement_signals) ? icpData.intentSignals.competitive_displacement_signals.join(', ') : icpData.intentSignals.competitive_displacement_signals} 
                                        onChange={(e) => setIcpData({...icpData, intentSignals: {...icpData.intentSignals, competitive_displacement_signals: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Expansion Triggers" 
                                        value={Array.isArray(icpData.intentSignals.expansion_triggers) ? icpData.intentSignals.expansion_triggers.join(', ') : icpData.intentSignals.expansion_triggers} 
                                        onChange={(e) => setIcpData({...icpData, intentSignals: {...icpData.intentSignals, expansion_triggers: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Urgency Accelerators" 
                                        value={Array.isArray(icpData.intentSignals.urgency_accelerators) ? icpData.intentSignals.urgency_accelerators.join(', ') : icpData.intentSignals.urgency_accelerators} 
                                        onChange={(e) => setIcpData({...icpData, intentSignals: {...icpData.intentSignals, urgency_accelerators: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleSectionEdit('intentSignals')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                            {/* Revenue Metrics */}
                            <AccordionCard title="Revenue Metrics">
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Lifetime Value Predictors" 
                                        value={Array.isArray(icpData.revenueMetrics.lifetime_value_predictors) ? icpData.revenueMetrics.lifetime_value_predictors.join(', ') : icpData.revenueMetrics.lifetime_value_predictors} 
                                        onChange={(e) => setIcpData({...icpData, revenueMetrics: {...icpData.revenueMetrics, lifetime_value_predictors: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Upsell Expansion Potential" 
                                        value={Array.isArray(icpData.revenueMetrics.upsell_expansion_potential) ? icpData.revenueMetrics.upsell_expansion_potential.join(', ') : icpData.revenueMetrics.upsell_expansion_potential} 
                                        onChange={(e) => setIcpData({...icpData, revenueMetrics: {...icpData.revenueMetrics, upsell_expansion_potential: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Referral Probability" 
                                        value={Array.isArray(icpData.revenueMetrics.referral_probability) ? icpData.revenueMetrics.referral_probability.join(', ') : icpData.revenueMetrics.referral_probability} 
                                        onChange={(e) => setIcpData({...icpData, revenueMetrics: {...icpData.revenueMetrics, referral_probability: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Retention Risk Factors" 
                                        value={Array.isArray(icpData.revenueMetrics.retention_risk_factors) ? icpData.revenueMetrics.retention_risk_factors.join(', ') : icpData.revenueMetrics.retention_risk_factors} 
                                        onChange={(e) => setIcpData({...icpData, revenueMetrics: {...icpData.revenueMetrics, retention_risk_factors: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Deal Size Influencers" 
                                        value={Array.isArray(icpData.revenueMetrics.deal_size_influencers) ? icpData.revenueMetrics.deal_size_influencers.join(', ') : icpData.revenueMetrics.deal_size_influencers} 
                                        onChange={(e) => setIcpData({...icpData, revenueMetrics: {...icpData.revenueMetrics, deal_size_influencers: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                    </div>
                                <button 
                                    onClick={() => handleSectionEdit('revenueMetrics')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                            {/* Buying Behavior */}
                            <AccordionCard title="Buying Behavior">
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Buying Process Complexity" 
                                        value={Array.isArray(icpData.buyingBehavior.buying_process_complexity) ? icpData.buyingBehavior.buying_process_complexity.join(', ') : icpData.buyingBehavior.buying_process_complexity} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, buying_process_complexity: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Purchase Authority Level" 
                                        value={Array.isArray(icpData.buyingBehavior.purchase_authority_level) ? icpData.buyingBehavior.purchase_authority_level.join(', ') : icpData.buyingBehavior.purchase_authority_level} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, purchase_authority_level: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Primary Evaluation Criteria" 
                                        value={Array.isArray(icpData.buyingBehavior.evaluation_criteria_primary) ? icpData.buyingBehavior.evaluation_criteria_primary.join(', ') : icpData.buyingBehavior.evaluation_criteria_primary} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, evaluation_criteria_primary: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Secondary Evaluation Criteria" 
                                        value={Array.isArray(icpData.buyingBehavior.evaluation_criteria_secondary) ? icpData.buyingBehavior.evaluation_criteria_secondary.join(', ') : icpData.buyingBehavior.evaluation_criteria_secondary} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, evaluation_criteria_secondary: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Decision Timeline" 
                                        value={Array.isArray(icpData.buyingBehavior.decision_timeline) ? icpData.buyingBehavior.decision_timeline.join(', ') : icpData.buyingBehavior.decision_timeline} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, decision_timeline: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Budget Considerations" 
                                        value={Array.isArray(icpData.buyingBehavior.budget_considerations) ? icpData.buyingBehavior.budget_considerations.join(', ') : icpData.buyingBehavior.budget_considerations} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, budget_considerations: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Stakeholder Involvement" 
                                        value={Array.isArray(icpData.buyingBehavior.stakeholder_involvement) ? icpData.buyingBehavior.stakeholder_involvement.join(', ') : icpData.buyingBehavior.stakeholder_involvement} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, stakeholder_involvement: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Risk Tolerance" 
                                        value={Array.isArray(icpData.buyingBehavior.risk_tolerance) ? icpData.buyingBehavior.risk_tolerance.join(', ') : icpData.buyingBehavior.risk_tolerance} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, risk_tolerance: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Vendor Preferences" 
                                        value={Array.isArray(icpData.buyingBehavior.vendor_preferences) ? icpData.buyingBehavior.vendor_preferences.join(', ') : icpData.buyingBehavior.vendor_preferences} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, vendor_preferences: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    <EditableField 
                                        label="Contract Preferences" 
                                        value={Array.isArray(icpData.buyingBehavior.contract_preferences) ? icpData.buyingBehavior.contract_preferences.join(', ') : icpData.buyingBehavior.contract_preferences} 
                                        onChange={(e) => setIcpData({...icpData, buyingBehavior: {...icpData.buyingBehavior, contract_preferences: e.target.value.split(',').map(s => s.trim()).filter(s => s)}})} 
                                        isTextarea={true}
                                    />
                                    </div>
                                <button 
                                    onClick={() => handleSectionEdit('buyingBehavior')}
                                    className="mt-4 px-4 py-2 bg-[#FF6B2C] text-white rounded"
                                >
                                    Edit Section
                                </button>
                            </AccordionCard>

                    </div>

                        {/* Locked Teaser */}
                    <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-100 text-gray-500 p-4 flex items-center justify-center gap-3 text-sm">
                        <Lock size={16} /> You can create and manage multiple personas in your ICP Library after onboarding.
                    </div>

                        {/* Save Button removed – submit occurs on Edit click */}

                        {/* CTA Row */}
                    <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                        <button onClick={() => window.history.back()} className="text-sm font-semibold text-gray-600 hover:text-gray-800">Back</button>
                        <div className="w-full sm:w-auto">
                                <button onClick={() => { try { if (typeof window !== 'undefined' && icpData?.id) { localStorage.setItem('icpId', icpData.id); } } catch(e){}; router.push('/onboarding/gtm-goal'); }} className="h-12 w-full sm:w-auto px-8 flex items-center justify-center gap-2 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2C] transition-opacity">
                                Confirm ICP & Continue <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                </motion.div>
            </div>
            </div>
        </div>
    );
}