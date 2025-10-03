'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Check, AlertTriangle, Sparkles, BrainCircuit, Info, Loader2, PlusCircle, X, Star, GitBranch, BarChartHorizontal
} from 'lucide-react';
import { Header } from '../../../components/layout';
import { businessService } from '../../../services/businessService';

// --- Reusable Themed Components & Hooks ---

const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const Toast = ({ message, show }: { message: string; show: boolean }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1E1E1E] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50"
            >
                <Check size={16} className="text-green-500" />
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

const OnboardingStepper = ({ currentStep, totalSteps = 6 }: { currentStep: number; totalSteps?: number }) => (
    <div className="flex items-center">
        {[...Array(totalSteps)].map((_, i) => {
            const step = i + 1;
            const isCompleted = step < currentStep;
            const isActive = step === currentStep;
            return (
                <React.Fragment key={i}>
                    <div className="flex items-center flex-col">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCompleted ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white' : isActive ? 'border-2 border-[#FF6B2C] text-[#FF6B2C]' : 'bg-gray-200 text-gray-500'}`}>
                            {isCompleted ? <Check size={16} /> : step}
                        </div>
                    </div>
                    {i < totalSteps - 1 && <div className={`h-0.5 flex-1 rounded-full ${isCompleted ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF]' : 'bg-gray-200'}`}></div>}
                </React.Fragment>
            );
        })}
    </div>
);


// --- Mock Data ---
const MOCK_ICP = {
    id: '',
    name: '',
    title: '',
    companySize: '',
    avatarUrl: `https://placehold.co/40x40/E2E8F0/4A5568?text=ICP`
};

const KPI_OPTIONS = ['Demos Booked', 'Replies', 'Opportunities', 'Pipeline $', 'Meetings Set'];

type Kpi = {
  id: number;
  type: string;
  value: string;
};

// --- Main Page Component ---
export default function GtmGoalPage() {
    // Form State (single source of truth)
    const [form, setForm] = useState({
        gtmName: '',
        objective: '',
        duration: '',
        painPoint: '',
        valueProposition: ''
    });
    const [kpis, setKpis] = useState<Kpi[]>([{ id: 1, type: 'Demos Booked', value: '' }]);
    
    // UI State
    const [isFormValid, setIsFormValid] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [aiPreview, setAiPreview] = useState({ painPoint: '', valueProp: '' });
    const [genError, setGenError] = useState<string | null>(null);

    const debouncedObjective = useDebounce(form.objective, 500);
    const debouncedPrimaryKpi = useDebounce(kpis[0], 500);

    useEffect(() => {
        const allKpisValid = kpis.every(kpi => {
            const kpiNum = Number(kpi.value);
            return kpi.type.trim() !== '' && kpi.value.trim() !== '' && !isNaN(kpiNum) && kpiNum > 0;
        });
        const isValid =
            form.gtmName.trim() !== '' &&
            form.objective.trim() !== '' &&
            form.painPoint.trim() !== '' &&
            form.valueProposition.trim() !== '' &&
            form.duration.trim() !== '' &&
            allKpisValid;
        setIsFormValid(isValid);
    }, [form, kpis]);

    useEffect(() => {
        if (form.objective.trim() && (kpis[0]?.value || '').trim()) {
            setIsPreviewLoading(true);
            const timer = setTimeout(() => {
                setAiPreview({
                    painPoint: `Leaders struggle to consolidate real-time analytics across their teams, leading to slow decisions and missed pipeline targets.`,
                    valueProp: `AlphaGrowth personalizes multichannel outreach to book ${kpis[0].value} ${kpis[0].type} aligned to your ICP's core priority: proving ROI.`
                });
                setIsPreviewLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [debouncedObjective, debouncedPrimaryKpi]);

    const handleKpiChange = (id: number, field: 'type' | 'value', newValue: string) => {
        setKpis(currentKpis => currentKpis.map(kpi => kpi.id === id ? { ...kpi, [field]: newValue } : kpi));
    };
    // NEW: Generate main pain point & value proposition from AI (like frontend_old)
    const handleGenerate = async () => {
        setGenError(null);
        setIsPreviewLoading(true);
        try {
            const win = typeof window !== 'undefined' ? window : undefined;
            let businessId = win ? localStorage.getItem('businessId') : null;
            let icpId = win ? localStorage.getItem('icpId') : null;
            console.log('[GTM] generate: initial ids', { businessId, icpId });

            if (!businessId) throw new Error('Missing businessId. Please complete business setup first.');

            // Auto-recover icpId like old app: fetch first ICP and cache
            if (!icpId) {
                try {
                    const icpsRes = await businessService.getIcps(businessId);
                    const first = icpsRes?.icps && Array.isArray(icpsRes.icps) ? icpsRes.icps[0] : null;
                    if (first?.id) {
                        icpId = first.id;
                        localStorage.setItem('icpId', icpId);
                        console.log('[GTM] generate: recovered icpId from API', icpId);
                    } else {
                        throw new Error('No ICP found for this business. Please create your ICP first.');
                    }
                } catch (recoverErr) {
                    throw recoverErr;
                }
            }

            const res = await businessService.generateGtmPainPoints({
                businessId,
                icpId,
                goal_title: form.gtmName,
                target_segment: MOCK_ICP.title, // replace with real segment when available
                channel_focus: 'LinkedIn'
            });
            console.log('[GTM] generate: api response', res);

            const pain = res?.pain_point || res?.pain || res?.data?.pain_point || '';
            const value = res?.value_proposition || res?.valueProp || res?.data?.value_proposition || '';
            console.log('[GTM] generate: parsed', { pain, value });
            setAiPreview({ painPoint: pain, valueProp: value });
            // Optionally prefill user fields if empty
            if (!form.painPoint && pain) setForm(prev => ({ ...prev, painPoint: pain }));
            if (!form.valueProposition && value) setForm(prev => ({ ...prev, valueProposition: value }));
        } catch (e: any) {
            console.error('[GTM] generate: error', e);
            setGenError(e.response?.data?.message || e.message || 'Failed to generate');
        } finally {
            setIsPreviewLoading(false);
        }
    };
    const addKpi = () => {
        const availableKpi = KPI_OPTIONS.find(opt => !kpis.some(k => k.type === opt)) || 'Replies';
        setKpis(currentKpis => [...currentKpis, { id: Date.now(), type: availableKpi, value: '' }]);
    };
    const removeKpi = (id: number) => {
        setKpis(currentKpis => currentKpis.filter(kpi => kpi.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        // console.log("GTM Goal Saved:", { gtmName, objective, selectedIcp, kpis, duration });
        setShowToast(true);
        setTimeout(() => { window.location.href = '/onboarding/success'; }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Header />
            <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-left mb-8">
                    <p className="font-semibold text-[#FF6B2C]">Step 5 · Strategy</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] mt-1">Set Your GTM Goal</h1>
                    <p className="mt-2 text-base text-gray-500">This goal is your AI&apos;s &quot;North Star&quot;—it powers all content generation and personalization to ensure every touchpoint is aligned with your strategy.</p>
                     <div className="mt-6 max-w-lg"><OnboardingStepper currentStep={5} totalSteps={6}/></div>
                </div>

                <div className="grid md:grid-cols-12 md:gap-8">
                    {/* --- Left Form Panel --- */}
                    <motion.div className="md:col-span-7 w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="gtmName" className="block text-sm font-medium text-gray-700 mb-1">GTM Name*</label>
                                <input id="gtmName" type="text" value={form.gtmName} onChange={e => setForm(prev => ({ ...prev, gtmName: e.target.value }))} placeholder="Q4 DataOps Expansion" className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]" />
                            </div>
                            <div>
                                <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1">Main Objective*</label>
                                <textarea id="objective" value={form.objective} onChange={e => setForm(prev => ({ ...prev, objective: e.target.value }))} rows={4} placeholder="Book 30 demos with enterprise BI leaders in NA…" className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] resize-none" />
                            </div>
                            {/* Target Audience (ICP) removed as requested */}
                            
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Key Performance Indicators (KPIs)*</label>
                                {kpis.map((kpi, index) => (
                                    <div key={kpi.id} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-6"><select value={kpi.type} onChange={e => handleKpiChange(kpi.id, 'type', e.target.value)} className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] h-12"><option>Demos Booked</option><option>Replies</option><option>Opportunities</option><option>Pipeline $</option><option>Meetings Set</option></select></div>
                                        <div className="col-span-5"><input type="number" value={kpi.value} onChange={e => handleKpiChange(kpi.id, 'value', e.target.value)} min="1" className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] h-12" /></div>
                                        <div className="col-span-1">{kpis.length > 1 && <button type="button" onClick={() => removeKpi(kpi.id)} className="text-gray-400 hover:text-red-500"><X size={18}/></button>}</div>
                                    </div>
                                ))}
                                <button type="button" onClick={addKpi} className="flex items-center gap-1 text-sm font-semibold text-[#FF6B2C] hover:text-orange-700"><PlusCircle size={16} /> Add another KPI</button>
                            </div>

                            {/* Generate Button (placed above the two textareas, like old) */}
                            <div className="flex items-center justify-end">
                                <button type="button" onClick={handleGenerate} className="flex items-center gap-2 h-12 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-blue-500 hover:opacity-90">
                                    Generate Main Pain Point and Core value Proposition from AI
                                </button>
                            </div>
                            {genError && <p className="text-red-600 text-sm">{genError}</p>}

                            {/* NEW: Required pain point */}
                            <div>
                                <label htmlFor="painPoint" className="block text-sm font-medium text-gray-700 mb-1">What&apos;s the main pain point this GTM Goal (and your product/service) solves for this specific ICP? <span className="text-red-500">*</span></label>
                                <textarea id="painPoint" value={form.painPoint} onChange={e => setForm(prev => ({ ...prev, painPoint: e.target.value }))} rows={4} placeholder="Describe the pain point" className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] resize-none" />
                            </div>

                            {/* NEW: Required value proposition */}
                            <div>
                                <label htmlFor="valueProposition" className="block text-sm font-medium text-gray-700 mb-1">What&apos;s your core value proposition for this ICP related to this goal? <span className="text-red-500">*</span></label>
                                <textarea id="valueProposition" value={form.valueProposition} onChange={e => setForm(prev => ({ ...prev, valueProposition: e.target.value }))} rows={4} placeholder="Describe your value proposition" className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] resize-none" />
                            </div>

                            {/* NEW: Desired GTM Duration */}
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Desired GTM Duration <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-9">
                                        <input id="duration" type="number" min="1" value={form.duration} onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="Enter GTM Duration" className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] h-12" />
                                    </div>
                                    <div className="col-span-3">
                                        <div className="h-12 px-3 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-600 text-sm">in Weeks</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between gap-4">
                                <button type="button" onClick={() => window.history.back()} className="text-sm font-semibold text-gray-600 hover:text-gray-800">Back</button>
                                <button type="submit" disabled={!isFormValid} className="h-12 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                                    Save Goal & Continue <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* --- Right Informative Panel --- */}
                    <aside className="md:col-span-5 mt-8 md:mt-0">
                         <motion.div className="sticky top-8 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            {/* --- AI PREVIEW CARD (NOW ON TOP) --- */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-[#1E1E1E] flex items-center gap-2"><BrainCircuit size={20} className="text-[#3AA3FF]" /> AI Preview</h2>
                                <p className="text-xs text-gray-500 mt-1">Updates live as you type</p>
                                <AnimatePresence mode="wait">
                                    {isPreviewLoading ? (
                                        <motion.div key="loader" className="mt-4 text-center py-10" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                            <div className="flex justify-center items-center gap-1 text-sm text-gray-400"><Loader2 size={14} className="animate-spin" /> Generating...</div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="content" className="mt-4 space-y-4" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                            <div>
                                                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700"><AlertTriangle size={14} className="text-red-500" />Suggested Pain Point</h3>
                                                <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{aiPreview.painPoint || "..."}</p>
                                            </div>
                                            <div>
                                                 <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700"><Sparkles size={14} className="text-green-500" />Suggested Value Proposition</h3>
                                                 <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{aiPreview.valueProp || "..."}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {/* --- WHY THIS MATTERS CARD (NOW BELOW) --- */}
                             <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-[#1E1E1E] flex items-center gap-2"><Info size={20} className="text-[#3AA3FF]" /> Why This Matters</h2>
                                <div className="mt-4 space-y-4 text-sm text-gray-600">
                                    <div className="flex items-start gap-3">
                                        <Star size={16} className="text-orange-500 mt-1 flex-shrink-0"/>
                                        <p><strong>Your GTM Goal is your AI&apos;s North Star.</strong> It provides the strategic direction to ensure every email, LinkedIn message, and task is perfectly aligned with your main objective.</p>
                                    </div>
                                     <div className="flex items-start gap-3">
                                        <GitBranch size={16} className="text-orange-500 mt-1 flex-shrink-0"/>
                                        <p><strong>Run Multiple Campaigns, One Strategy.</strong> A single GTM Goal can have many campaigns under it, allowing you to test tactics while maintaining strategic oversight.</p>
                                    </div>
                                </div>
                            </div>
                         </motion.div>
                    </aside>
                </div>
            </div>
            </div>
             <Toast message="GTM goal saved!" show={showToast} />
        </div>
    );
}
