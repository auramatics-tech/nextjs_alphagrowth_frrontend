'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building, Mail } from 'lucide-react';
import { CreateIdentityRequest } from '../../types/identity.types';
import { identityService } from '@/services/identityService';

interface AddIdentityModalProps {
    onClose: () => void;
   
    loadIdentities:any
}

export default function AddIdentityModal({ onClose, loadIdentities }: AddIdentityModalProps) {
    const [formData, setFormData] = useState<CreateIdentityRequest>({
        name: '',
        company_name: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await handleAddIdentity(formData);
            onClose(); // Close the popup after successful creation
        } catch (error) {
            console.error('Error creating identity:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name.trim() !== '' && 
                       formData.company_name.trim() !== '' && 
                       formData.email.trim() !== '';

                        const handleAddIdentity = async (identityData: any) => {
        try {
            const response = await identityService.createIdentity(identityData);
            if ((response as any).success) {
                await loadIdentities();
                onClose();
            } else {
              
            }
        } catch (err: any) {
            console.error('Error creating identity:', err);
      
        }
    };

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
                    className="bg-white w-full max-w-lg rounded-2xl shadow-xl"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 relative">
                        <h2 className="text-2xl font-semibold text-gray-900">Add Identity</h2>
                        <p className="text-sm text-gray-500 mt-1">Create a new sender profile for your campaigns.</p>
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <form className="space-y-6">
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
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                        <div className="flex justify-between items-center">
                            <button 
                                onClick={onClose}
                                className="px-6 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            
                            <button 
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                className="px-6 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-95"
                            >
                                {isSubmitting ? 'Creating...' : 'Create My Account'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

