'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { identityService } from '../../services/identityService';
import { EMAIL_PROVIDERS } from '../../types/identity.types';

interface SmtpPopupProps {
    identityId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SmtpPopup({ identityId, onClose, onSuccess }: SmtpPopupProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(EMAIL_PROVIDERS[0]);
    const [showProviderDropdown, setShowProviderDropdown] = useState(false);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        sender_full_name: '',
        smtp: {
            host: '',
            password: '',
            port: 587
        },
        imap: {
            host: '',
            password: '',
            port: 993
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('smtp_') || name.startsWith('imap_')) {
            const [section, field] = name.split('_');
            if (section === 'smtp') {
                setCredentials(prev => ({
                    ...prev,
                    smtp: {
                        ...prev.smtp,
                        [field]: type === 'checkbox' ? checked : value
                    }
                }));
            } else if (section === 'imap') {
                setCredentials(prev => ({
                    ...prev,
                    imap: {
                        ...prev.imap,
                        [field]: type === 'checkbox' ? checked : value
                    }
                }));
            }
        } else {
            setCredentials(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleProviderSelect = (provider: typeof EMAIL_PROVIDERS[0]) => {
        setSelectedProvider(provider);
        setShowProviderDropdown(false);
        
        // Set default SMTP settings based on provider
        if (provider.type === 'GMAIL') {
            setCredentials(prev => ({
                ...prev,
                smtp: {
                    ...prev.smtp,
                    host: 'smtp.gmail.com',
                    port: 587
                },
                imap: {
                    ...prev.imap,
                    host: 'imap.gmail.com',
                    port: 993
                }
            }));
        } else if (provider.type === 'OUTLOOK') {
            setCredentials(prev => ({
                ...prev,
                smtp: {
                    ...prev.smtp,
                    host: 'smtp-mail.outlook.com',
                    port: 587
                },
                imap: {
                    ...prev.imap,
                    host: 'outlook.office365.com',
                    port: 993
                }
            }));
        } else {
            setCredentials(prev => ({
                ...prev,
                smtp: {
                    ...prev.smtp,
                    host: '',
                    port: 587
                },
                imap: {
                    ...prev.imap,
                    host: '',
                    port: 993
                }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!credentials.email || !credentials.password || !credentials.smtp.host || !credentials.imap.host) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await identityService.saveSmtpCredentials({
                identity_id: identityId,
                data: credentials,
                type: 'SMTP/IMAP'
            });

            if (response.success || response.message) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                setError(response.message || 'Failed to connect email account');
            }
        } catch (err: any) {
            console.error('SMTP connection error:', err);
            
            // Enhanced error handling with user-friendly messages
            let errorMessage = 'Failed to connect email account';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
                
                // User-friendly error message mapping
                if (errorMessage.includes('Invalid login')) {
                    errorMessage = 'Invalid email or password. Please check your credentials.';
                } else if (errorMessage.includes('Username and Password not accepted')) {
                    errorMessage = 'Email or password is incorrect. Please verify your credentials.';
                } else if (errorMessage.includes('Connection timeout')) {
                    errorMessage = 'Connection timeout. Please check your SMTP settings and try again.';
                } else if (errorMessage.includes('Authentication failed')) {
                    errorMessage = 'Authentication failed. Please check your email and password.';
                } else if (errorMessage.includes('SMTP connection test failed')) {
                    errorMessage = 'SMTP connection test failed. Please check your server settings.';
                }
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthConnect = () => {
        // Store identity ID for OAuth callback
        localStorage.setItem('google_identity_id', identityId);
        
        // Redirect to Google OAuth for Gmail
        if (selectedProvider.type === 'GMAIL') {
            const googleOAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin + '/identities')}&scope=email&response_type=code&state=gmail`;
            window.location.href = googleOAuthUrl;
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
                    className="bg-white w-full max-w-md rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Mail size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Connect Email</h2>
                                <p className="text-sm text-gray-500">Set up email credentials for campaigns</p>
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
                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Connected!</h3>
                                <p className="text-gray-600">Your email account has been successfully connected.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Provider Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Provider *
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{selectedProvider.icon}</span>
                                                <span className="font-medium">{selectedProvider.name}</span>
                                            </div>
                                            <ChevronDown size={20} className="text-gray-400" />
                                        </button>

                                        <AnimatePresence>
                                            {showProviderDropdown && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
                                                >
                                                    {EMAIL_PROVIDERS.map((provider) => (
                                                        <button
                                                            key={provider.id}
                                                            onClick={() => handleProviderSelect(provider)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                                                        >
                                                            <span className="text-lg">{provider.icon}</span>
                                                            <span className="font-medium">{provider.name}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* OAuth Option for Gmail */}
                                {selectedProvider.type === 'GMAIL' && (
                                    <div className="text-center">
                                        <button
                                            onClick={handleOAuthConnect}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                                        >
                                            <Mail size={20} />
                                            Connect with Google OAuth (Recommended)
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">Secure and fast connection</p>
                                    </div>
                                )}

                                {(selectedProvider.type === 'GMAIL' || selectedProvider.type === 'OUTLOOK' || selectedProvider.type === 'CUSTOM') && (
                                    <>
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
                                                    Email Address *
                                                </label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    value={credentials.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your.email@company.com"
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Password *
                                                </label>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    value={credentials.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your email password"
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Sender Full Name *
                                                </label>
                                                <input
                                                    name="sender_full_name"
                                                    type="text"
                                                    value={credentials.sender_full_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Your Full Name"
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    SMTP Host *
                                                </label>
                                                <input
                                                    name="smtp_host"
                                                    type="text"
                                                    value={credentials.smtp.host}
                                                    onChange={handleInputChange}
                                                    placeholder="smtp.gmail.com"
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    SMTP Port *
                                                </label>
                                                <input
                                                    name="smtp_port"
                                                    type="number"
                                                    value={credentials.smtp.port}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    IMAP Host *
                                                </label>
                                                <input
                                                    name="imap_host"
                                                    type="text"
                                                    value={credentials.imap.host}
                                                    onChange={handleInputChange}
                                                    placeholder="imap.gmail.com"
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    IMAP Port *
                                                </label>
                                                <input
                                                    name="imap_port"
                                                    type="number"
                                                    value={credentials.imap.port}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                                    className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
