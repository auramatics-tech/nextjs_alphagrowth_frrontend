'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLinkedInLogin } from '../../hooks/useLinkedInLogin';
import ConnectionStatusPoller from './ConnectionStatusPoller';

interface EnhancedLinkedInPopupProps {
    identityId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EnhancedLinkedInPopup({ identityId, onClose, onSuccess }: EnhancedLinkedInPopupProps) {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        location: ''
    });
    const [showConnectionFlow, setShowConnectionFlow] = useState(false);
    const [currentConnectionId, setCurrentConnectionId] = useState<string | null>(null);
    
    const {
        status,
        connectionStatusId,
        error,
        isPolling,
        startConnection,
        reset
    } = useLinkedInLogin();

    // Reset state when popup opens
    useEffect(() => {
        reset();
    }, [reset]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!credentials.email || !credentials.password || !credentials.location) {
            return;
        }

        try {
            const connectionId = await startConnection(identityId, credentials);
            console.log('Connection started with ID:', connectionId);
            if (connectionId) {
                setCurrentConnectionId(connectionId);
                setShowConnectionFlow(true);
            }
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    const handleOAuthConnect = () => {
        // Store identity ID for OAuth callback
        localStorage.setItem('google_identity_id', identityId);
        
        // Redirect to LinkedIn OAuth (placeholder URL)
        window.open('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&state=linkedin', '_blank');
    };

    const handleConnectionSuccess = () => {
        onSuccess();
        onClose();
    };

    const handleConnectionClose = () => {
        reset();
        setCurrentConnectionId(null);
        setShowConnectionFlow(false);
        onClose();
    };

    console.log('EnhancedLinkedInPopup render:', { 
        showConnectionFlow, 
        currentConnectionId, 
        status, 
        connectionStatusId 
    });

    if (showConnectionFlow && currentConnectionId) {
        console.log('Rendering ConnectionStatusPoller with ID:', currentConnectionId);
        return (
            <ConnectionStatusPoller
                connectionStatusId={currentConnectionId}
                onSuccess={handleConnectionSuccess}
                onClose={handleConnectionClose}
            />
        );
    }

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
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-500" />
                                <span className="text-sm text-red-700">{error}</span>
                            </div>
                        )}

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
                                        disabled={status === 'connecting' || !credentials.email || !credentials.password || !credentials.location}
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                    >
                                        {status === 'connecting' ? (
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
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
