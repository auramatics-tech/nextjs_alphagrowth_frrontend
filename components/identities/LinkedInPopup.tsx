'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { identityService } from '../../services/identityService';
import ConnectionStatusPoller from './ConnectionStatusPoller';

interface LinkedInPopupProps {
    identityId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function LinkedInPopup({ identityId, onClose, onSuccess }: LinkedInPopupProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [connectionStatusId, setConnectionStatusId] = useState<string | null>(null);
    const [showVerification, setShowVerification] = useState(false);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        location: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!credentials.email || !credentials.password || !credentials.location) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await identityService.connectLinkedIn({
                identity_id: identityId,
                data: credentials,
                type: 'LINKEDIN'
            });

            if (response.success && response.data?.id) {
                // Store connection status ID and start verification flow
                setConnectionStatusId(response.data.id);
                setShowVerification(true);
            } else {
                setError(response.message || 'Failed to connect LinkedIn account');
            }
        } catch (err: any) {
            console.error('LinkedIn connection error:', err);
            setError(err.response?.data?.message || 'Failed to connect LinkedIn account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthConnect = () => {
        // Store identity ID for OAuth callback
        localStorage.setItem('google_identity_id', identityId);
        
        // Redirect to LinkedIn OAuth (this would be the actual LinkedIn OAuth URL)
        // For now, we'll simulate it
        window.open('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&state=linkedin', '_blank');
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
                                <Linkedin size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Connect LinkedIn</h2>
                                <p className="text-sm text-gray-500">Link your LinkedIn account for outreach</p>
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
                        {showVerification && connectionStatusId ? (
                            <ConnectionStatusPoller
                                connectionStatusId={connectionStatusId}
                                onSuccess={onSuccess}
                                onClose={onClose}
                            />
                        ) : success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn Connected!</h3>
                                <p className="text-gray-600">Your LinkedIn account has been successfully connected.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* OAuth Option */}
                                <div className="text-center">
                                    <button
                                        onClick={handleOAuthConnect}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        <Linkedin size={20} />
                                        Connect with OAuth (Recommended)
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">Secure and fast connection</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">or</span>
                                    </div>
                                </div>

                                {/* Manual Credentials */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            LinkedIn Email *
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={credentials.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your LinkedIn email"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            LinkedIn Password *
                                        </label>
                                        <input
                                            name="password"
                                            type="password"
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your LinkedIn password"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location *
                                        </label>
                                        <input
                                            name="location"
                                            type="text"
                                            value={credentials.location}
                                            onChange={handleInputChange}
                                            placeholder="Enter your location (e.g., New York, NY)"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <AlertCircle size={16} className="text-red-500" />
                                            <span className="text-sm text-red-700">{error}</span>
                                        </div>
                                    )}

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
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Connecting...
                                                </>
                                            ) : (
                                                'Connect'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
