'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Save, User as UserIcon, Mail, Building, Phone, 
    Linkedin, CheckCircle, AlertCircle, Loader2, Clock, Settings,
    BarChart3, Calendar, History, Edit3, Trash2
} from 'lucide-react';
import { identityService } from '@/services/identityService';
import { actionLimitsService } from '@/services/actionLimitsService';
import { Identity } from '@/types/identity.types';
import LinkedInActionsSection from '@/components/identities/LinkedInActionsSection';
import EmailActionsSection from '@/components/identities/EmailActionsSection';
import PhoneActionsSection from '@/components/identities/PhoneActionsSection';
import WorkingHoursComponent from '@/components/identities/WorkingHoursComponent';

interface WorkingHours {
    monday: { start: string; end: string; enabled: boolean };
    tuesday: { start: string; end: string; enabled: boolean };
    wednesday: { start: string; end: string; enabled: boolean };
    thursday: { start: string; end: string; enabled: boolean };
    friday: { start: string; end: string; enabled: boolean };
    saturday: { start: string; end: string; enabled: boolean };
    sunday: { start: string; end: string; enabled: boolean };
}


type TabType = 'identity' | 'working' | 'limits' | 'email' | 'past';

export default function IdentityManagementPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const identityId = params.identityId as string;

    const [identity, setIdentity] = useState<Identity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('identity');

    // Form state for identity details
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company_name: '',
        phone: '',
        linkedin_url: ''
    });

    // Working hours state
    const [workingHours, setWorkingHours] = useState<WorkingHours>({
        monday: { start: '09:00', end: '17:00', enabled: true },
        tuesday: { start: '09:00', end: '17:00', enabled: true },
        wednesday: { start: '09:00', end: '17:00', enabled: true },
        thursday: { start: '09:00', end: '17:00', enabled: true },
        friday: { start: '09:00', end: '17:00', enabled: true },
        saturday: { start: '10:00', end: '14:00', enabled: false },
        sunday: { start: '10:00', end: '14:00', enabled: false }
    });

    // Action limits state (for progress bars)
    const [actionLimits, setActionLimits] = useState<Record<string, number>>({
        action_invitation: 0,
        action_send_message: 0,
        action_visit_profile: 0,
        action_follow: 0,
        action_list_post: 0,
        action_send_email: 0,
        action_make_call: 0
    });

    // Saving states for each action
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [loadingLimits, setLoadingLimits] = useState(false);

    // Handle URL parameters for tab selection
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['identity', 'working', 'limits', 'email', 'past'].includes(tab)) {
            setActiveTab(tab as TabType);
        }
    }, [searchParams]);

    // Load identity data
    useEffect(() => {
        const loadIdentity = async () => {
            try {
                setIsLoading(true);
                const identities = await identityService.getIdentities();
                const foundIdentity = identities.find(id => id.id === identityId);
                
                if (foundIdentity) {
                    setIdentity(foundIdentity);
                    setFormData({
                        name: foundIdentity.name || '',
                        email: foundIdentity.email || '',
                        company_name: foundIdentity.company_name || '',
                        phone: foundIdentity.phone || '',
                        linkedin_url: foundIdentity.linkedin_url || ''
                    });
                    
                    // Load action limits after identity is loaded
                    await loadActionLimits(identityId);
                } else {
                    setError('Identity not found');
                }
            } catch (err) {
                console.error('Error loading identity:', err);
                setError('Failed to load identity');
            } finally {
                setIsLoading(false);
            }
        };

        if (identityId) {
            loadIdentity();
        }
    }, [identityId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWorkingHoursChange = (day: keyof WorkingHours, field: 'start' | 'end' | 'enabled', value: string | boolean) => {
        setWorkingHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    // Load action limits from API
    const loadActionLimits = async (identityId: string) => {
        try {
            setLoadingLimits(true);
            const response = await actionLimitsService.getActionLimits(identityId);
            if (response.data && Array.isArray(response.data)) {
                const limits: Record<string, number> = {};
                response.data.forEach((limit: any) => {
                    limits[limit.key] = limit.value;
                });
                setActionLimits(prev => ({
                    ...prev,
                    ...limits
                }));
            }
        } catch (error) {
            console.error('Error loading action limits:', error);
            toast.error('Failed to load action limits');
        } finally {
            setLoadingLimits(false);
        }
    };

    const handleActionLimitsChange = (key: string, value: number) => {
        setActionLimits(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSavingChange = (key: string, saving: boolean) => {
        setSaving(prev => ({
            ...prev,
            [key]: saving
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);
            
            if (activeTab === 'identity') {
                // Save identity details
                await identityService.updateIdentity(identityId, formData);
            } else {
                // Save working hours and action limits
                console.log('Saving settings:', { workingHours, actionLimits });
                // This would typically call an API to save the settings
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
        } catch (err) {
            console.error('Error saving:', err);
            setError('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const days = [
        { key: 'monday', label: 'Monday' },
        { key: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', label: 'Thursday' },
        { key: 'friday', label: 'Friday' },
        { key: 'saturday', label: 'Saturday' },
        { key: 'sunday', label: 'Sunday' }
    ] as const;

    const sidebarTabs = [
        {
            id: 'identity' as TabType,
            label: 'Identity Details',
            icon: UserIcon,
            description: 'Edit identity information'
        },
        {
            id: 'working' as TabType,
            label: 'Working Hours',
            icon: Clock,
            description: 'Set working hours'
        },
        {
            id: 'limits' as TabType,
            label: 'Action Limits',
            icon: BarChart3,
            description: 'Configure sending limits'
        },
        {
            id: 'email' as TabType,
            label: 'Email Settings',
            icon: Mail,
            description: 'Email configuration'
        },
        {
            id: 'past' as TabType,
            label: 'Past Actions',
            icon: History,
            description: 'View action history'
        }
    ];

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 size={24} className="animate-spin" />
                        Loading identity...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !identity) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                    <p className="text-gray-500 mb-6">{error || 'Identity not found'}</p>
                    <button
                        onClick={() => router.push('/identities')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Back to Identities
                    </button>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'identity':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Identity Details</h2>
                        
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <UserIcon size={16} className="inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter full name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail size={16} className="inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter email address"
                                />
                            </div>

                            {/* Company */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building size={16} className="inline mr-2" />
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter company name"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone size={16} className="inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            {/* LinkedIn URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Linkedin size={16} className="inline mr-2" />
                                    LinkedIn Profile URL
                                </label>
                                <input
                                    type="url"
                                    name="linkedin_url"
                                    value={formData.linkedin_url}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'working':
                return (
                    <WorkingHoursComponent 
                        identityId={identityId}
                        identityName={identity?.name}
                    />
                );

            case 'limits':
                if (loadingLimits) {
                    return (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            <span className="ml-3 text-gray-600">Loading action limits...</span>
                        </div>
                    );
                }
                
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Action Limits</h2>
                        <p className="text-gray-600">Configure daily limits for your outreach activities. Use the sliders to set safe, fast, or risky limits for each action type.</p>
                        
                        {/* LinkedIn Actions */}
                        <LinkedInActionsSection
                            actionLimits={actionLimits}
                            onUpdate={handleActionLimitsChange}
                            saving={saving}
                            disabled={isSaving || loadingLimits}
                            identityId={identityId}
                            onSavingChange={handleSavingChange}
                        />

                        {/* Email Actions */}
                        <EmailActionsSection
                            actionLimits={actionLimits}
                            onUpdate={handleActionLimitsChange}
                            saving={saving}
                            disabled={isSaving || loadingLimits}
                            identityId={identityId}
                            onSavingChange={handleSavingChange}
                        />

                        {/* Phone Actions */}
                        <PhoneActionsSection
                            actionLimits={actionLimits}
                            onUpdate={handleActionLimitsChange}
                            saving={saving}
                            disabled={isSaving || loadingLimits}
                            identityId={identityId}
                            onSavingChange={handleSavingChange}
                        />
                    </div>
                );

            case 'email':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <p className="text-gray-500">Email configuration settings will be implemented here.</p>
                        </div>
                    </div>
                );

            case 'past':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Past Actions</h2>
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <p className="text-gray-500">Action history will be displayed here.</p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.push('/identities')}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Identity Management</h1>
                    <p className="text-gray-500 mt-1">Manage settings for {identity.name}</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <AlertCircle size={20} className="text-red-500" />
                    <span className="text-red-700">{error}</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                        
                        <div className="space-y-2">
                            {sidebarTabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={20} className="flex-shrink-0" />
                                        <div className="min-w-0">
                                            <div className="font-medium text-sm">{tab.label}</div>
                                            <div className="text-xs text-gray-500 truncate">{tab.description}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Identity Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Identity Info</h3>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={identity.image || `https://placehold.co/40x40/FF6B2C/FFFFFF?text=${identity.name.charAt(0)}`}
                                alt={identity.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <div className="font-medium text-gray-900">{identity.name}</div>
                                <div className="text-sm text-gray-500">{identity.email || 'No email'}</div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex justify-between">
                                <span>Company:</span>
                                <span>{identity.company_name || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phone:</span>
                                <span>{identity.phone || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>LinkedIn:</span>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    identity.linkedin_sign === 'loggedin' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    <CheckCircle size={12} />
                                    {identity.linkedin_sign === 'loggedin' ? 'Connected' : 'Disconnected'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Save Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <Save size={20} />
                                )}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
