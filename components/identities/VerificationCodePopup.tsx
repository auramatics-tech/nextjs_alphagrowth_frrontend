'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { identityService } from '../../services/identityService';

interface VerificationCodePopupProps {
    connectionStatusId: string;
    onClose: () => void;
    onSuccess: () => void;
    onFailure: (error: string) => void;
    error?: string;
}

export default function VerificationCodePopup({ 
    connectionStatusId, 
    onClose, 
    onSuccess, 
    onFailure,
    error: initialError 
}: VerificationCodePopupProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState(initialError || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!code.trim()) {
            setError('Please enter the verification code');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const response = await identityService.verifyLinkedInCaptcha({
                code: code.trim(),
                type: 'email',
                connection_id: connectionStatusId
            });

            console.log('Verification response:', response);
            
            if (response.success) {
                onSuccess();
            } else {
                const errorMsg = response.message || 'Invalid verification code';
                setError(errorMsg);
                onFailure(errorMsg);
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            const errorMsg = err.response?.data?.message || 'Verification failed. Please try again.';
            setError(errorMsg);
            onFailure(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        if (error) setError(''); // Clear error when user starts typing
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
                    className="bg-white w-full max-w-md rounded-2xl shadow-xl"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Mail size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">LinkedIn Two-Step Verification</h2>
                                <p className="text-sm text-gray-500">Enter your verification code</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail size={32} className="text-blue-600" />
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Verification Code</h3>
                            <p className="text-gray-600">
                                Please check your email or open your LinkedIn application to get your verification code.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code *
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={handleCodeChange}
                                    placeholder="Enter code"
                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                    }`}
                                    required
                                />
                                {error && (
                                    <div className="flex items-center gap-2 mt-2 text-red-600">
                                        <AlertCircle size={16} />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 text-gray-700 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !code.trim()}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

