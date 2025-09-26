'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building, Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { CreateIdentityRequest } from '../../types/identity.types';

interface AddIdentityModalProps {
    onClose: () => void;
    onAddIdentity: (data: CreateIdentityRequest) => void;
}

type Step = 1 | 2;

const DRAFT_KEY = 'ag_identity_draft_v1';

const saveDraft = (data: Partial<CreateIdentityRequest>) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
};

const loadDraft = (): Partial<CreateIdentityRequest> | null => {
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft) : null;
};

const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
};

const Step1Basics = ({ 
    formData, 
    setFormData 
}: { 
    formData: CreateIdentityRequest; 
    setFormData: (data: CreateIdentityRequest) => void; 
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                </label>
                <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] focus:border-transparent"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                </label>
                <div className="relative">
                    <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        name="company_name"
                        type="text"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Enter your company name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] focus:border-transparent"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                </label>
                <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@company.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] focus:border-transparent"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

const Step2Connect = ({ 
    formData, 
    setFormData 
}: { 
    formData: CreateIdentityRequest; 
    setFormData: (data: CreateIdentityRequest) => void; 
}) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Identity Created Successfully!</h3>
                <p className="text-gray-600">
                    Your identity <strong>{formData.name}</strong> has been created. 
                    You can now connect channels to start sending campaigns.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Connect your LinkedIn account for social outreach</li>
                    <li>• Set up email credentials for email campaigns</li>
                    <li>• Configure phone settings for call campaigns</li>
                </ul>
            </div>
        </div>
    );
};

export default function AddIdentityModal({ onClose, onAddIdentity }: AddIdentityModalProps) {
    const [step, setStep] = useState<Step>(1);
    const [formData, setFormData] = useState<CreateIdentityRequest>(() => 
        loadDraft() || { name: '', company_name: '', email: '' }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Save draft on form changes
    useEffect(() => {
        saveDraft(formData);
    }, [formData]);

    const handleNext = () => {
        if (step === 1) {
            // Validate form before proceeding
            if (!formData.name.trim() || !formData.company_name.trim() || !formData.email.trim()) {
                return;
            }
            setStep(2);
        }
    };

    const handleFinish = async () => {
        try {
            setIsSubmitting(true);
            await onAddIdentity(formData);
            clearDraft();
            // Step 2 will be shown automatically after successful creation
        } catch (error) {
            console.error('Error creating identity:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const isStep1Valid = formData.name.trim() !== '' && 
                        formData.company_name.trim() !== '' && 
                        formData.email.trim() !== '';

    return (
        <AnimatePresence>
            <motion.div 
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div 
                    className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 relative">
                        <h2 className="text-2xl font-semibold text-gray-900">Add Identity</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {step === 1 ? 'Create a new sender profile for your campaigns.' : 'Identity created successfully!'}
                        </p>
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step >= 1 ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {step > 1 ? <CheckCircle size={16} /> : '1'}
                            </div>
                            <div className={`h-0.5 flex-1 mx-2 ${
                                step >= 2 ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF]' : 'bg-gray-200'
                            }`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step >= 2 ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {step >= 2 ? <CheckCircle size={16} /> : '2'}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: step === 1 ? -30 : 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: step === 1 ? 30 : -30 }}
                                transition={{ duration: 0.3 }}
                            >
                                {step === 1 && <Step1Basics formData={formData} setFormData={setFormData} />}
                                {step === 2 && <Step2Connect formData={formData} setFormData={setFormData} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                        <div className="flex justify-between items-center">
                            <button 
                                onClick={() => saveDraft(formData)}
                                className="text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Save Draft
                            </button>
                            
                            <div className="flex items-center gap-3">
                                {step === 2 && (
                                    <button 
                                        onClick={handleBack}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        <ArrowLeft size={16} />
                                        Back
                                    </button>
                                )}
                                
                                {step === 1 && (
                                    <button 
                                        onClick={handleNext}
                                        disabled={!isStep1Valid}
                                        className="flex items-center gap-2 px-6 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                    >
                                        Next: Connect
                                        <ArrowRight size={16} />
                                    </button>
                                )}
                                
                                {step === 2 && (
                                    <button 
                                        onClick={handleFinish}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 px-6 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Finish & Create'}
                                        <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}




