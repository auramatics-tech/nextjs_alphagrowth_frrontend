'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Settings, Loader2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { identityService } from '../../services/identityService';

interface SmtpPopupProps {
    identityId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SmtpPopup({ identityId, onClose, onSuccess }: SmtpPopupProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [fieldsVisible, setFieldsVisible] = useState(false);
    const [passwordsVisible, setPasswordsVisible] = useState(false);

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
        const { name, value, type } = e.target;

        if (name.startsWith('smtp_') || name.startsWith('imap_')) {
            const [section, field] = name.split('_');
            if (section === 'smtp') {
                setCredentials(prev => ({
                    ...prev,
                    smtp: {
                        ...prev.smtp,
                        [field]: field === 'port' ? parseInt(value) || 587 : value
                    }
                }));
            } else if (section === 'imap') {
                setCredentials(prev => ({
                    ...prev,
                    imap: {
                        ...prev.imap,
                        [field]: field === 'port' ? parseInt(value) || 993 : value
                    }
                }));
            }
        } else {
            setCredentials(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const toggleFields = () => {
        setFieldsVisible(prev => !prev);
    };

    const togglePasswords = () => {
        setPasswordsVisible(prev => !prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!credentials.email || !credentials.password) {
            setError('Please fill in email and password');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const requestData = {
                identity_id: identityId,
                data: {
                    email: credentials.email,
                    password: credentials.password,
                    sender_full_name: credentials.sender_full_name,
                    smtp: {
                        host: credentials.smtp.host,
                        password: credentials.smtp.password || credentials.password,
                        port: parseInt(credentials.smtp.port.toString()),
                    },
                    imap: {
                        host: credentials.imap.host,
                        password: credentials.imap.password || credentials.password,
                        port: parseInt(credentials.imap.port.toString()),
                    },
                },
                type: "SMTP/IMAP",
            };

            console.log("requestData:", requestData);
            const response = await identityService.connectLinkedIn(requestData);
            console.log("API Success:", response);

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            console.error('SMTP connection error:', err);

            let errorMessage = 'SMTP connection failed';
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
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
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
                    className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 relative">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Email connection</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
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
                                {/* Basic Email/Password Section */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={credentials.email}
                                                onChange={handleInputChange}
                                                placeholder="your.email@company.com"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                            <input
                                                name="password"
                                                type="password"
                                                value={credentials.password}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email password"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Automatic Setup Button */}
                                    <div className="flex justify-end">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                            <Settings size={16} />
                                            Automatic setup
                                        </button>
                                    </div>
                                </div>

                                {/* SMTP/IMAP Setup Section */}
                                <div className="border border-gray-200 rounded-xl">
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={toggleFields}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ChevronDown
                                                size={20}
                                                className={`text-gray-500 transition-transform ${fieldsVisible ? 'rotate-90' : ''}`}
                                            />
                                            <span className="font-medium text-gray-900">SMTP / IMAP Setup</span>
                                        </div>
                                    </div>

                                    {fieldsVisible && (
                                        <div className="px-4 pb-4 border-t border-gray-200">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                                                {/* IMAP Column */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sender Fullname</label>
                                                        <input
                                                            name="sender_full_name"
                                                            type="text"
                                                            value={credentials.sender_full_name}
                                                            onChange={handleInputChange}
                                                            placeholder="Your Full Name"
                                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">Receiving server</span>
                                                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                                            Check
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">IMAP Host</label>
                                                        <input
                                                            name="imap_host"
                                                            type="text"
                                                            value={credentials.imap.host}
                                                            onChange={handleInputChange}
                                                            placeholder="imap.gmail.com"
                                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            IMAP port - <span className="text-gray-500 italic">Optional</span>
                                                        </label>
                                                        <input
                                                            name="imap_port"
                                                            type="number"
                                                            value={credentials.imap.port}
                                                            onChange={handleInputChange}
                                                            placeholder="993"
                                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>

                                                    {passwordsVisible && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                                            <input
                                                                name="imap_password"
                                                                type="password"
                                                                value={credentials.imap.password}
                                                                onChange={handleInputChange}
                                                                placeholder="IMAP Password"
                                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* SMTP Column */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={passwordsVisible}
                                                                onChange={togglePasswords}
                                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm text-gray-700">Different passwords for IMAP/SMTP</span>
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">Sending server</span>
                                                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                                            Check
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                                                        <input
                                                            name="smtp_host"
                                                            type="text"
                                                            value={credentials.smtp.host}
                                                            onChange={handleInputChange}
                                                            placeholder="smtp.gmail.com"
                                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            SMTP port - <span className="text-gray-500 italic">Optional</span>
                                                        </label>
                                                        <input
                                                            name="smtp_port"
                                                            type="number"
                                                            value={credentials.smtp.port}
                                                            onChange={handleInputChange}
                                                            placeholder="587"
                                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>

                                                    {passwordsVisible && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                                            <input
                                                                name="smtp_password"
                                                                type="password"
                                                                value={credentials.smtp.password}
                                                                onChange={handleInputChange}
                                                                placeholder="SMTP Password"
                                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertCircle size={16} className="text-red-500" />
                                        <span className="text-sm text-red-700">{error}</span>
                                    </div>
                                )}

                                {/* Footer Actions */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save settings'
                                            )}
                                        </button>
                                        <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                                            <span>Email Sending limits</span>
                                            <AlertCircle size={14} />
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 transition-colors">
                                        <X size={16} />
                                        <span>Remove Email Connection</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
