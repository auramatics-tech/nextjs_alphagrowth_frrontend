'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, Lightbulb, Boxes, ArrowRight, Check, AlertCircle, Lock, Info, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/layout';
import { businessService } from '../../../services/businessService';
import { BusinessInfoResponse, UpdateBusinessRequest, CreateIcpRequest, CreateIcpResponse } from '../../../types/business.types';

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

const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
    <div className="relative flex items-center group">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1E1E1E] text-white text-xs rounded-md py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1E1E1E] rotate-45"></div>
        </div>
    </div>
);

// --- Main Page Component ---
export default function BusinessProfilePage() {
    const router = useRouter();
    
    // Single formData object (like frontend_old)
    const [formData, setFormData] = useState({
        industry: "",
        services: [] as string[],
        valueProposition: "",
        business_id: "",
    });

    // Business form data for context
    const [businessForm, setBusinessForm] = useState({
        domain: "",
        businessType: "",
        newPrompt: "",
    });

    // UI state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Get business ID from localStorage (from previous step)
    const businessId = typeof window !== 'undefined' ? localStorage.getItem('businessId') : null;
    const domain = typeof window !== 'undefined' ? localStorage.getItem('businessDomain') : '';
    const prompt = typeof window !== 'undefined' ? localStorage.getItem('businessPrompt') : '';

    // Form validation
    const isFormValid = formData.industry && formData.valueProposition && formData.services.length > 0;

    // Load business data on component mount
    useEffect(() => {
        const token = localStorage.getItem('_token');
        if (!token) {
            router.push('/signup');
            return;
        }
        if (!businessId) {
            router.push('/onboarding/business-overview');
            return;
        }
        getBusinessInfo(businessId);
    }, [businessId, router]);

    // Load business information from API
    const getBusinessInfo = async (businessId: string) => {
        try {
            setLoading(true);
            setError("");

            const responseData: BusinessInfoResponse = await businessService.getBusinessInfo({ business_id: businessId });
            
            if (responseData?.error) {
                setError(responseData.error);
                return;
            }

            // Extract business data from various possible response shapes
            const business = responseData?.business ||
                (Array.isArray(responseData?.businesses) ? responseData.businesses[0] : undefined) ||
                responseData?.updatedBusinessData ||
                responseData?.data?.business ||
                responseData?.data?.updatedBusinessData ||
                {};

            // Parse JSON summary if available
            let parsedSummary = {};
            try {
                if (business?.summary) {
                    parsedSummary = JSON.parse(business.summary);
                }
            } catch {
                // Ignore parse errors
            }

            // Normalize services list from various possible shapes
            let services: string[] = [];
            if (Array.isArray(business?.keyProductsOrServices)) {
                services = business.keyProductsOrServices
                    .map((x: any) => (typeof x === "string" ? x : x?.name))
                    .filter(Boolean);
            } else if (Array.isArray(business?.services)) {
                services = business.services
                    .map((x: any) => (typeof x === "string" ? x : x?.name))
                    .filter(Boolean);
            } else if (typeof business?.services === "string") {
                services = business.services
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean);
            }

            // Update form data with API response
            setFormData(prev => ({
                ...prev,
                business_id: businessId,
                industry: business?.industry || (parsedSummary as any)?.industry || "",
                services,
                valueProposition: business?.valueProposition || business?.value_proposition || (parsedSummary as any)?.valueProposition || "",
            }));

            // Update business form context
            setBusinessForm(prev => ({
                ...prev,
                domain: business?.domain || business?.website || domain,
                businessType: business?.businessType || business?.business_type || "",
                newPrompt: responseData?.aiResponse?.prompt || prompt || "",
            }));

        } catch (err: any) {
            console.error("Error fetching business info:", err);
            setError("Failed to load business information. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Single change handler for all form inputs (like frontend_old)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "services") {
            // Handle services as array, split by newlines
            const servicesArray = value.split("\n").filter(s => s.trim());
            setFormData(prev => ({ ...prev, [name]: servicesArray }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Form submission with API calls (update business + create ICP)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Step 1: Update business information
            const updatePayload: UpdateBusinessRequest = {
                business_id: formData.business_id,
                industry: formData.industry,
                services: formData.services,
                valueProposition: formData.valueProposition,
            };

            const updateResponse = await businessService.updateBusinessInfo(updatePayload);
            if (updateResponse?.error) {
                setError(updateResponse.error);
                return;
            }

            // Step 2: Create ICPs (like frontend_old)
            const createIcpPayload: CreateIcpRequest = {
                businessId: formData.business_id,
                title: formData.industry, // Use industry as title (like frontend_old)
                domain: businessForm.domain,
                newPrompt: businessForm.newPrompt,
            };

            const createIcpResponse: CreateIcpResponse = await businessService.createIcps(createIcpPayload);
            if (createIcpResponse?.error) {
                setError(createIcpResponse.error);
                return;
            }

            // Show success toast
            setShowToast(true);
            setTimeout(() => {
                router.push('/onboarding/icp-drafts');
            }, 2000);

        } catch (err: any) {
            console.error("Error updating business details:", err);
            setError("Failed to save business details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Loading state while fetching data
    if (loading && !formData.industry) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#FF6B2C]" />
                    <p className="mt-4 text-gray-600">Loading your business information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Header />
            <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-12 md:gap-8">
                        {/* --- Left Info Panel --- */}
                        <aside className="hidden md:col-span-5 md:flex flex-col justify-center">
                            <motion.div
                                className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-semibold text-[#1E1E1E]">Let's Perfect Your Business Profile</h2>
                                <p className="mt-2 text-base text-gray-500">
                                    We've analyzed your website to understand your business. Now let's refine the details to create the perfect ICP suggestions.
                                </p>
                                <ul className="mt-8 space-y-6">
                                    <li className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 text-[#FF6B2C] flex items-center justify-center">
                                            <Factory size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Industry Analysis</h3>
                                            <p className="text-sm text-gray-500 mt-1">This helps our AI find high-potential prospects and relevant market trends for your campaigns.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 text-[#3AA3FF] flex items-center justify-center">
                                            <Lightbulb size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Value Proposition</h3>
                                            <p className="text-sm text-gray-500 mt-1">Your value prop is the foundation for all AI-generated copy, ensuring outreach is compelling.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                                            <Boxes size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Services Overview</h3>
                                            <p className="text-sm text-gray-500 mt-1">Listing your offerings allows us to connect them to specific customer problems for more resonant messaging.</p>
                                        </div>
                                    </li>
                                </ul>
                            </motion.div>
                        </aside>

                        {/* --- Right Form Panel --- */}
                        <main className="md:col-span-7 flex items-center">
                            <motion.div
                                className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="text-left mb-8">
                                    <p className="text-sm font-semibold text-[#FF6B2C]">Step 3 · Business Profile</p>
                                    <h1 className="text-2xl md:text-3xl font-semibold text-[#1E1E1E] mt-2">Review & Refine Your Business Details</h1>
                                    <p className="mt-2 text-sm text-gray-500">
                                        We analyzed {businessForm.domain} to draft this profile. Please review and edit if needed – accurate details here help us generate much better Ideal Customer Profile (ICP) suggestions next!
                                    </p>
                                    <div className="mt-6">
                                        <OnboardingStepper currentStep={3} totalSteps={6} />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Industry Field */}
                                    <div>
                                        <label htmlFor="industry" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                                            YOUR INDUSTRY <span className="text-red-500">*</span>
                                            <Tooltip content="Helps our AI understand your market and competitors.">
                                                <Info size={14} className="text-gray-400" />
                                            </Tooltip>
                                        </label>
                                        <input
                                            type="text"
                                            id="industry"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                                            placeholder="e.g., Enterprise Technology Solutions"
                                            required
                                        />
                                        {formData.industry && (
                                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                <Check size={12} />
                                                Industry identified from your website
                                            </div>
                                        )}
                                    </div>

                                    {/* Value Proposition Field */}
                                    <div>
                                        <label htmlFor="valueProposition" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                                            YOUR CORE VALUE PROPOSITION <span className="text-red-500">*</span>
                                            <Tooltip content="This is used to generate personalized outreach messages.">
                                                <Info size={14} className="text-gray-400" />
                                            </Tooltip>
                                        </label>
                                        <textarea
                                            id="valueProposition"
                                            name="valueProposition"
                                            value={formData.valueProposition}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] resize-none"
                                            placeholder="Describe your unique value proposition..."
                                            required
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            {formData.valueProposition && (
                                                <div className="text-xs text-green-600 flex items-center gap-1">
                                                    <Check size={12} />
                                                    Value proposition extracted from your website
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500">
                                                {formData.valueProposition.length}/500 characters
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services Field */}
                                    <div>
                                        <label htmlFor="services" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                                            YOUR MAIN PRODUCTS/SERVICES <span className="text-red-500">*</span>
                                            <Tooltip content="List your key offerings, one per line. This helps us find relevant pain points.">
                                                <Info size={14} className="text-gray-400" />
                                            </Tooltip>
                                        </label>
                                        <textarea
                                            id="services"
                                            name="services"
                                            rows={5}
                                            value={Array.isArray(formData.services) ? formData.services.join("\n") : ""}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] resize-none"
                                            placeholder="List your main products or services, one per line..."
                                            required
                                        />
                                        <div className="text-xs text-gray-500 mt-1">
                                            Enter each service on a new line for better organization
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4 space-y-4">
                                        <button
                                            type="submit"
                                            disabled={loading || !isFormValid}
                                            className="h-12 w-full rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm Profile & Define My Ideal Customer
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>

                                        {/* Form validation status */}
                                        <div className="text-center">
                                            {!isFormValid ? (
                                                <div className="text-xs text-amber-600 flex items-center justify-center gap-1">
                                                    <AlertCircle size={12} />
                                                    Please fill in all fields to continue
                                                </div>
                                            ) : (
                                                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                                                    <Check size={12} />
                                                    All fields completed! Ready to proceed
                                                </div>
                                            )}
                                        </div>

                                        {/* Additional info */}
                                        <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                                            <Lock size={12} />
                                            Your data is secure and will be used to create personalized ICP suggestions
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </main>
                    </div>
                </div>
            </div>
            <Toast message="Profile saved successfully!" show={showToast} />
        </div>
    );
}