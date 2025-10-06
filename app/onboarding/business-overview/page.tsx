'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Building2, User, X, Check, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/layout';
import { OnboardingStepper } from '../../../features/onboarding/components';
import { ROUTES } from '../../../utils';
import { businessService } from '../../../services/businessService';
import { BusinessAnalysisResponse } from '../../../types/business.types';

// --- Reusable Themed Components ---
const BusinessTypeCard = ({ icon: Icon, title, description, isSelected, onClick, disabled }: any) => (
    <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        onClick={onClick}
        disabled={disabled}
        className={`w-full p-4 text-left border rounded-xl transition-all duration-200 relative group ${
            isSelected 
                ? 'border-[#FF6B2C] bg-orange-50 ring-2 ring-orange-200' 
                : 'border-gray-200 bg-white hover:border-gray-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
        <div className="flex items-start gap-4">
            <Icon size={24} className={isSelected ? 'text-[#FF6B2C]' : 'text-gray-500'} />
            <div>
                <p className={`font-semibold ${isSelected ? 'text-orange-900' : 'text-gray-800'}`}>{title}</p>
                <p className={`text-sm ${isSelected ? 'text-orange-800' : 'text-gray-500'}`}>{description}</p>
            </div>
        </div>
        <AnimatePresence>
            {isSelected && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute top-3 right-3 w-5 h-5 bg-[#FF6B2C] text-white rounded-full flex items-center justify-center"
                >
                    <Check size={12} />
                </motion.div>
            )}
        </AnimatePresence>
    </button>
);

// --- Main Page Component ---
export default function BusinessOnboardingPage() {
    const router = useRouter();
    const [website, setWebsite] = useState('');
    const [businessType, setBusinessType] = useState<'B2B' | 'B2C' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const loadingMessages = [
        "Detecting industry, categories & keywords…",
        "Extracting value propositions & benefits…",
        "Listing core products/services…",
    ];

    const derivedDomain = website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const isFormValid = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(website) && businessType;

    useEffect(() => {
        let loadingInterval: NodeJS.Timeout;
        if (isLoading) {
            loadingInterval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % loadingMessages.length);
            }, 2500);
            return () => {
                clearInterval(loadingInterval);
            };
        }
    }, [isLoading, loadingMessages.length]);

    const handleAnalyze = async () => {
        if (!isFormValid) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response: BusinessAnalysisResponse = await businessService.analyzeDomain({
                domain: website,
                businessType: businessType!
            });
            
            if (response.error) {
                setError(response.error);
            } else if (response.business && response.business.id) {
                // Store business data in localStorage (matching frontend_old)
                localStorage.setItem('businessId', response.business.id);
                localStorage.setItem('businessDomain', website);
                
                const prompt = response.aiResponse?.prompt || "No prompt available";
                localStorage.setItem('businessPrompt', prompt);
                
                if (response.business.industry) {
                    localStorage.setItem('businessIndustry', response.business.industry);
                }
                
                // Redirect to business-profile
                router.push(ROUTES.ONBOARDING.BUSINESS_PROFILE);
            } else {
                setError('Could not fetch Business Detail. Please connect with administrator');
            }
        } catch (err: any) {
            setError('Could not complete the request');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white text-gray-800">
            <Header />

            <main className="flex-grow grid lg:grid-cols-2">
                {/* --- Left Panel --- */}
                <div className="hidden lg:flex flex-col justify-center items-center p-12 relative bg-[#F5F5F5]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative w-full max-w-sm h-72"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-blue-100 rounded-3xl transform rotate-6"></div>
                        <div className="absolute inset-0 bg-white shadow-xl rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-4">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-2xl font-semibold text-[#1E1E1E]">AI-Powered Analysis</h3>
                            <p className="text-sm text-[#2E2E2E] mt-2">We analyze your site to find your best-fit customers and messaging angles.</p>
                        </div>
                    </motion.div>
                </div>

                {/* --- Right Panel --- */}
                <div className="flex items-center justify-center bg-white p-6 md:p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="w-full max-w-lg"
                    >
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
                                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#FF6B2C]" />
                                    <h2 className="mt-6 text-2xl font-semibold text-[#1E1E1E]">Analyzing your website...</h2>
                                    <div className="h-20 mt-4 text-[#2E2E2E]">
                                        <AnimatePresence mode="wait">
                                            <motion.p key={loadingStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                {loadingMessages[loadingStep]}
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4">This is a quick demo. No data is sent.</p>
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="text-left mb-8">
                                        <p className="text-sm font-semibold text-[#FF6B2C]">Step 2 · Overview</p>
                                        <h1 className="text-3xl font-semibold text-[#1E1E1E] mt-2">Let&apos;s Understand Your Business Better</h1>
                                        <p className="mt-2 text-base text-gray-500">We&apos;ll briefly analyze your site to tailor ICPs and messaging. This takes about 10 seconds.</p>
                                        <div className="mt-6 w-full">
                                            <OnboardingStepper currentStep={2} totalSteps={6} />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Your Company Website</label>
                                            <div className="relative">
                                                <input 
                                                    id="website" 
                                                    type="text" 
                                                    value={website} 
                                                    onChange={(e) => setWebsite(e.target.value)} 
                                                    placeholder="https://www.example.com" 
                                                    className="h-12 w-full rounded-xl bg-gray-100 border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]" 
                                                />
                                                {website && (
                                                    <button 
                                                        onClick={() => setWebsite('')} 
                                                        aria-label="Clear website input" 
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <X size={16}/>
                                                    </button>
                                                )}
                                            </div>
                                            {derivedDomain && (
                                                <p className="text-xs text-gray-500 mt-1.5 ml-1">Domain: {derivedDomain}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <BusinessTypeCard 
                                                    icon={Building2} 
                                                    title="B2B" 
                                                    description="You sell to other companies." 
                                                    isSelected={businessType === 'B2B'} 
                                                    onClick={() => setBusinessType('B2B')} 
                                                    disabled={isLoading} 
                                                />
                                                <BusinessTypeCard 
                                                    icon={User} 
                                                    title="B2C" 
                                                    description="You sell to consumers." 
                                                    isSelected={businessType === 'B2C'} 
                                                    onClick={() => setBusinessType('B2C')} 
                                                    disabled={isLoading} 
                                                />
                                            </div>
                                        </div>
                                        {error && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                                <p className="text-red-600 text-sm">{error}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-8">
                                        <button 
                                            onClick={handleAnalyze} 
                                            disabled={!isFormValid || isLoading} 
                                            className="h-12 w-full rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Analyze Website with AI
                                        </button>
                                        <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                                            <Clock size={12}/> Takes ~10 seconds.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}