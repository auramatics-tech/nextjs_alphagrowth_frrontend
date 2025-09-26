'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailVerificationPopupProps {
    onClose: () => void;
}

export default function EmailVerificationPopup({ onClose }: EmailVerificationPopupProps) {
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
                                <h2 className="text-xl font-semibold text-gray-900">LinkedIn App Request</h2>
                                <p className="text-sm text-gray-500">Please check your LinkedIn app</p>
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
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail size={32} className="text-blue-600" />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your LinkedIn App</h3>
                        <p className="text-gray-600 mb-6">
                            Please open your LinkedIn mobile app and approve the connection request. 
                            This will allow us to connect your LinkedIn account securely.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle size={20} className="text-blue-600 mt-0.5" />
                                <div className="text-left">
                                    <h4 className="font-medium text-blue-900 mb-1">What to do:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Open your LinkedIn mobile app</li>
                                        <li>• Look for a connection request notification</li>
                                        <li>• Tap "Allow" or "Approve" to continue</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 text-gray-700 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                I've Approved
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}


