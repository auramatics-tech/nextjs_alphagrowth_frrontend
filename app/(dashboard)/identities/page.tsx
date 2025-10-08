'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle, X,
    AlertCircle, User as UserIcon,
    Loader2, RefreshCw,
} from 'lucide-react';


import AddIdentityModal from '@/components/identities/AddIdentityModal';
import { EnhancedLinkedInPopup, SmtpPopup, IdentityCard } from '@/components/identities';

import { identityService } from '@/services/identityService';
import { emailService } from '@/services/emailService';
import { Identity } from '@/types/identity.types';

// --- Reusable Components ---




// --- Main Page Component ---
export default function IdentitiesPage() {
    const [identities, setIdentities] = useState<Identity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLinkedInPopupOpen, setIsLinkedInPopupOpen] = useState(false);
    const [isSmtpPopupOpen, setIsSmtpPopupOpen] = useState(false);
    const [selectedIdentityId, setSelectedIdentityId] = useState<string | null>(null);

    const [isSigningOut, setIsSigningOut] = useState<string | null>(null);

    const loadIdentities = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const list = await identityService.getIdentities();

            if (Array.isArray(list)) {
                setIdentities(list as any);
            } else {
                setIdentities([]);
                setError('Failed to load identities');
            }
        } catch (err: any) {
            console.error('Error loading identities:', err);
            setError('Failed to load identities');
        } finally {
            setIsLoading(false);
        }
    };

    // Load identities on mount
    useEffect(() => {
        loadIdentities();
    }, []);

    // Handle Gmail OAuth callback (exact copy from frontend_old)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const identityId = localStorage.getItem("gmail_identity_id");

        // Prevent running again if already called
        if (!code || !identityId) return;
        // if (localStorage.getItem("isApiCalled") === "true") return;

        // Lock for this session
        localStorage.setItem("isApiCalled", "true");

        const runOAuthFlow = async () => {
            try {
                // 1️⃣ Call OAuth API
                await emailService.handleGmailCallback(code, identityId);

                // 2️⃣ Redirect to /identities without query params
                window.history.replaceState({}, document.title, "/identities");

                // 3️⃣ Fetch list after redirect
                await loadIdentities();
                window.location.reload();
            } catch (error) {
                console.error("Google OAuth error:", error);
            } finally {
                // Cleanup
                localStorage.removeItem("google_identity_id");
            }
        };

        runOAuthFlow();
    }, [loadIdentities]);




    const handleLinkedInConnect = (identityId: string) => {
        setSelectedIdentityId(identityId);
        setIsLinkedInPopupOpen(true);
    };

    const handleEmailConnect = (identityId: string) => {
        setSelectedIdentityId(identityId);
        setIsSmtpPopupOpen(true);
    };






    const handleEdit = (identityId: string) => {
        // Navigate to identity management page
        window.location.href = `/identities/${identityId}`;
    };




    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Identities</h1>
                    <p className="text-gray-500 mt-1">Manage sender profiles for your multichannel campaigns.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 md:mt-0 h-12 px-6 flex items-center gap-2 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold rounded-xl shadow-md hover:opacity-95 transition-opacity"
                >
                    <PlusCircle size={20} /> Add Identity
                </button>
            </div>

            {/* Error Message */}
            <div>
                {error && (
                    <motion.div
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle size={20} className="text-red-500" />
                        <span className="text-red-700">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 size={24} className="animate-spin" />
                            Loading identities...
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {identities.length === 0 ? (
                            <div className="text-center py-12">
                                <UserIcon size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No identities yet</h3>
                                <p className="text-gray-500 mb-6">Create your first identity to start sending campaigns.</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-12 px-6 flex items-center gap-2 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold rounded-xl shadow-md hover:opacity-95 transition-opacity mx-auto"
                                >
                                    <PlusCircle size={20} /> Add Your First Identity
                                </button>
                            </div>
                        ) : (
                            identities.map((identity) => (
                                <IdentityCard
                                    key={identity.id}
                                    identity={identity}
                                    onLinkedInConnect={handleLinkedInConnect}
                                    onEmailConnect={handleEmailConnect}
                                    onEdit={handleEdit}
                                    onRefresh={loadIdentities}
                                    isLoading={isSigningOut === identity.id}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Refresh Button */}
                {!isLoading && identities.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={loadIdentities}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                )}
            </div>


            {/* Modals */}
            <AnimatePresence>
                {isModalOpen && (
                    <AddIdentityModal
                        onClose={() => setIsModalOpen(false)}
                        loadIdentities={loadIdentities}
                    />
                )}
                {isLinkedInPopupOpen && selectedIdentityId && (
                    <EnhancedLinkedInPopup
                        identityId={selectedIdentityId}
                        onClose={() => {
                            setIsLinkedInPopupOpen(false);
                            setSelectedIdentityId(null);
                        }}
                        onSuccess={() => {
                            loadIdentities();
                            setIsLinkedInPopupOpen(false);
                            setSelectedIdentityId(null);
                        }}
                    />
                )}
                {isSmtpPopupOpen && selectedIdentityId && (
                    <SmtpPopup
                        identityId={selectedIdentityId}
                        onClose={() => {
                            setIsSmtpPopupOpen(false);
                            setSelectedIdentityId(null);
                        }}
                        onSuccess={() => {
                            loadIdentities();
                            setIsSmtpPopupOpen(false);
                            setSelectedIdentityId(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div >
    );
}
