'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle, X, Lightbulb, ChevronDown, Linkedin, Mail, Phone, CheckCircle,
    AlertCircle, Save, User as UserIcon, Building, Upload, MoreHorizontal, Check,
    Loader2, RefreshCw, Trash2, Edit3, Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import AddIdentityModal from '@/components/identities/AddIdentityModal';
import { LinkedInPopup, EnhancedLinkedInPopup, SmtpPopup } from '@/components/identities';
import { EmailConnectionDropdown } from '@/components/identities';
import { identityService } from '@/services/identityService';
import { Identity } from '@/types/identity.types';

// --- Reusable Components ---

const ChannelConnectButton = ({
    channel,
    status,
    onClick,
    isLoading = false
}: {
    channel: 'linkedin' | 'email' | 'phone';
    status: 'connected' | 'disconnected' | 'verified' | 'unverified';
    onClick: () => void;
    isLoading?: boolean;
}) => {
    const isConnected = status === 'connected' || status === 'verified';
    const channelConfig = {
        linkedin: { icon: Linkedin, label: "LinkedIn", color: "blue" },
        email: { icon: Mail, label: "Email", color: "red" },
        phone: { icon: Phone, label: "Phone", color: "green" },
    };
    const config = channelConfig[channel];

    if (isConnected) {
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                <CheckCircle size={14} className="text-green-600" />
                Connected
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <config.icon size={14} className={`text-${config.color}-500`} />
            )}
            Connect {config.label}
        </button>
    );
};

const IdentityCard = ({
    identity,
    onLinkedInConnect,
    onEmailConnect,
    onPhoneConnect,
    onLinkedInSignout,
    onEmailSignout,
    onEdit,
    onDelete,
    onRefresh,
    isLoading
}: {
    identity: Identity;
    onLinkedInConnect: (id: string) => void;
    onEmailConnect: (id: string) => void;
    onPhoneConnect: (id: string) => void;
    onLinkedInSignout: (id: string) => void;
    onEmailSignout: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onRefresh: () => void;
    isLoading: boolean;
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState<string | null>(null);

    const getLinkedInStatus = () => {
        console.log('LinkedIn status for', identity.name, ':', identity.linkedin_sign);
        if (identity.linkedin_sign === 'loggedin') return 'connected';
        if (identity.linkedin_sign === 'requested') return 'disconnected';
        return 'disconnected';
    };

    const getEmailStatus = () => {
        console.log('Email status for', identity.name, ':', identity.email_detail);
        if (identity.email_detail?.connection_status === 'loggedin') return 'connected';
        if (identity.email_detail?.connection_status === 'requested') return 'disconnected';
        return 'disconnected';
    };

    const getPhoneStatus = () => {
        console.log('Phone status for', identity.name, ':', identity.phone_detail);
        if (identity.phone_detail?.connection_status === 'verified') return 'verified';
        return 'unverified';
    };

    const handleLinkedInAction = () => {
        if (getLinkedInStatus() === 'connected') {
            setIsSigningOut(identity.id);
            onLinkedInSignout(identity.id);
        } else {
            onLinkedInConnect(identity.id);
        }
    };

    const handleEmailAction = () => {
        if (getEmailStatus() === 'connected') {
            setIsSigningOut(identity.id);
            onEmailSignout(identity.id);
        } else {
            onEmailConnect(identity.id);
        }
    };

    return (
        <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src={identity.image || `https://placehold.co/40x40/FF6B2C/FFFFFF?text=${identity.name.charAt(0)}`}
                        alt={identity.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">{identity.name}</h3>
                        <p className="text-sm text-gray-500">{identity.email || 'No email provided'}</p>
                        <p className="text-xs text-gray-400">{identity.company_name || 'No company provided'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        <ChannelConnectButton
                            channel="linkedin"
                            status={getLinkedInStatus()}
                            onClick={handleLinkedInAction}
                            isLoading={isSigningOut === identity.id}
                        />
                        <EmailConnectionDropdown
                            identity={identity}
                            onSmtpConnect={onEmailConnect}
                            onRefresh={onRefresh}
                        />
                        <ChannelConnectButton
                            channel="phone"
                            status={getPhoneStatus()}
                            onClick={() => onPhoneConnect(identity.id)}
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                                >
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                onEdit(identity.id);
                                                setShowDropdown(false);
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Edit3 size={16} />
                                            Edit Identity
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDelete(identity.id);
                                                setShowDropdown(false);
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete Identity
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {identity.created_at && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Created {formatDistanceToNow(new Date(identity.created_at), { addSuffix: true })}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

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
            // identityService.getIdentities returns Identity[] (normalized service)
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
        const identityId = localStorage.getItem("google_identity_id");

        // Prevent running again if already called
        if (!code || !identityId) return;
        // if (localStorage.getItem("isApiCalled") === "true") return;

        // Lock for this session
        localStorage.setItem("isApiCalled", "true");

        const runOAuthFlow = async () => {
            try {
                // 1️⃣ Call OAuth API
                await (identityService as any).googleOAuth({ code, identity_id: identityId });

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


    const handleAddIdentity = async (identityData: any) => {
        try {
            const response = await identityService.createIdentity(identityData);
            if ((response as any).success) {
                await loadIdentities();
                setIsModalOpen(false);
            } else {
                setError((response as any).message || 'Failed to create identity');
            }
        } catch (err: any) {
            console.error('Error creating identity:', err);
            setError('Failed to create identity. Please try again.');
        }
    };

    const handleLinkedInConnect = (identityId: string) => {
        setSelectedIdentityId(identityId);
        setIsLinkedInPopupOpen(true);
    };

    const handleEmailConnect = (identityId: string) => {
        setSelectedIdentityId(identityId);
        setIsSmtpPopupOpen(true);
    };

    const handlePhoneConnect = (identityId: string) => {
        // Phone connection logic
        console.log('Phone connect for:', identityId);
    };

    const handleLinkedInSignout = async (identityId: string) => {
        try {
            setIsSigningOut(identityId);
            await (identityService as any).signout(identityId, { type: 'LINKEDIN' });
            await loadIdentities();
        } catch (err: any) {
            console.error('LinkedIn signout failed:', err);
            setError('Failed to sign out from LinkedIn');
        } finally {
            setIsSigningOut(null);
        }
    };

    const handleEmailSignout = async (identityId: string) => {
        try {
            setIsSigningOut(identityId);
            const identity = identities.find(id => id.id === identityId);
            const providerType = identity?.email_detail?.provider_type || 'GMAIL';
            await (identityService as any).signout(identityId, { type: providerType as any });
            await loadIdentities();
        } catch (err: any) {
            console.error('Email signout failed:', err);
            setError('Failed to sign out from email');
        } finally {
            setIsSigningOut(null);
        }
    };

    const handleEdit = (identityId: string) => {
        // Edit functionality
        console.log('Edit identity:', identityId);
    };

    const handleDelete = async (identityId: string) => {
        if (window.confirm('Are you sure you want to delete this identity?')) {
            // Delete functionality
            console.log('Delete identity:', identityId);
        }
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
                                    onPhoneConnect={handlePhoneConnect}
                                    onLinkedInSignout={handleLinkedInSignout}
                                    onEmailSignout={handleEmailSignout}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
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
 

            {/* Modals */ }
    <AnimatePresence>
        {isModalOpen && (
            <AddIdentityModal
                onClose={() => setIsModalOpen(false)}
                onAddIdentity={handleAddIdentity}
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
