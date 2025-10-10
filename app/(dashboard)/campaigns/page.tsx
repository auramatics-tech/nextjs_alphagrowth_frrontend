'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    PlusCircle, Search, SlidersHorizontal, ChevronDown, MoreHorizontal, Linkedin, Mail, Phone, Users,
    Briefcase, CheckCircle, PlayCircle, PauseCircle, ArrowLeft, ArrowRight, LayoutDashboard,
    Users as UsersIcon, BarChart2, CheckSquare, Target, GitBranch, PhoneCall, Inbox, Database,
    Contact, UserCheck, Building, Bell, HelpCircle, ChevronLeft, X, Loader2, RefreshCw, AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { campaignService, Campaign as BackendCampaign } from '../../../services/campaignService';
import { CreateCampaignModal } from '../../../components/campaign';
import { useCreateCampaignModal } from '../../../hooks/useCreateCampaignModal';

// --- Types & Mock Data ---

type CampaignStatus = 'active' | 'draft' | 'completed' | 'paused';
type Channel = 'LinkedIn' | 'Email' | 'Voice';

// UI Campaign type that extends backend campaign
type Campaign = BackendCampaign & {
  leadsCompleted: {
    current: number;
    total: number;
  };
  replyRate: number;
  meetingsBooked: number;
  channels: Channel[];
  lastActivity: string;
  gtmGoal?: string; // ✅ GTM Goal name
  audienceName?: string; // ✅ Audience name
  totalLeads?: number; // ✅ Total leads count
};

 

// --- Reusable Themed Components ---

const StatusBadge = ({ status }: { status: CampaignStatus }) => {
    const styles = {
        active: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        draft: 'bg-gray-100 text-gray-700',
        paused: 'bg-yellow-100 text-yellow-800',
    };
    const icon = {
        active: <PlayCircle size={12} className="text-blue-500" />,
        completed: <CheckCircle size={12} className="text-green-600" />,
        draft: <PauseCircle size={12} className="text-gray-500" />,
        paused: <PauseCircle size={12} className="text-yellow-500" />
    };
    
    // ✅ Display status as lowercase like frontend_old
    return (
        <div className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 ${styles[status]}`}>
            {icon[status]} 
            <span>{status}</span>
        </div>
    );
};

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const KpiTag = ({ rate }: { rate: number }) => {
    const color = rate > 50 ? 'text-green-600' : rate > 20 ? 'text-orange-600' : 'text-red-600';
    return <span className={`font-semibold ${color}`}>{rate}%</span>;
};

const ChannelIcons = ({ channels }: { channels: Channel[] }) => {
    const channelStyles = {
        LinkedIn: 'bg-blue-500',
        Email: 'bg-red-500',
        Voice: 'bg-green-500',
    };

    return (
        <div className="flex -space-x-2">
            {channels.map(channel => (
                <div key={channel} className={`w-7 h-7 rounded-full ${channelStyles[channel] || 'bg-gray-700'} text-white flex items-center justify-center border-2 border-white`}>
                    {channel === 'LinkedIn' && <Linkedin size={14} />}
                    {channel === 'Email' && <Mail size={14} />}
                    {channel === 'Voice' && <Phone size={14} />}
                </div>
            ))}
        </div>
    );
};


// --- Main Page Component ---
export default function CampaignListingPage() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Use the custom hook for modal management
    const { isModalOpen, openModal, closeModal } = useCreateCampaignModal();

    // Load campaigns on component mount
    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            setError(null);
            const backendCampaigns = await campaignService.listCampaigns();
            
            if (backendCampaigns && backendCampaigns.length > 0) {
                // Transform backend campaigns to UI format
                const transformedCampaigns: Campaign[] = backendCampaigns.map((backendCampaign: any) => ({
                    ...backendCampaign,
                    // ✅ Keep status as-is from backend (lowercase like frontend_old)
                    status: backendCampaign.status as CampaignStatus,
                    leadsCompleted: backendCampaign.leadsCompleted || { current: 0, total: 0 },
                    replyRate: backendCampaign.replyRate || 0,
                    meetingsBooked: backendCampaign.meetingsBooked || 0,
                    channels: (backendCampaign.channels || ['LinkedIn']) as Channel[],
                    lastActivity: backendCampaign.lastActivity || backendCampaign.updated_at,
                    // ✅ New fields
                    gtmGoal: backendCampaign.gtm?.name || backendCampaign.gtmGoal || 'No GTM',
                    audienceName: backendCampaign.audience?.audience_name || backendCampaign.audienceName || 'No Audience',
                    totalLeads: backendCampaign.totalLeads || backendCampaign.campaignLeads?.length || 0
                }));
                
                setCampaigns(transformedCampaigns);
            } else {
                // Fallback to mock data if no campaigns exist
                // setCampaigns(MOCK_CAMPAIGNS);
            }
        } catch (err) {
            console.error('Error loading campaigns:', err);
            // Fallback to mock data on error
            // setCampaigns(MOCK_CAMPAIGNS);
            setError('Failed to load campaigns from server. Showing sample data.');
        } finally {
            setLoading(false);
        }
    };

    const handleCampaignCreated = async (newCampaign: BackendCampaign) => {
        // Refresh campaigns list after successful creation
        await loadCampaigns();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                            <SlidersHorizontal size={14} /> Status <ChevronDown size={16} />
                        </button>
                        <button 
                            onClick={loadCampaigns}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                    <button 
                        onClick={openModal}
                        className="h-10 px-4 flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold rounded-xl shadow-md hover:opacity-95"
                    >
                        <PlusCircle size={18} />
                        <span className="hidden sm:inline">
                            Create Campaign
                        </span>
                    </button>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-500" />
                        <span className="text-red-700">{error}</span>
                        <button 
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                        <Loader2 size={32} className="animate-spin text-[#FF6B2C] mx-auto mb-4" />
                        <p className="text-gray-600">Loading campaigns...</p>
                    </div>
                )}

                {/* Campaigns Table */}
                {!loading && campaigns.length > 0 && (
                    <>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="p-4 w-10">
                                            <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                        </th>
                                        {['Name', 'GTM Goal', 'Audience', 'Status', 'Total Leads', 'Progress', 'Reply Rate', 'Meetings', 'Channels', 'Created', ''].map(h => 
                                            <th key={h} className="p-4 text-left font-semibold">{h}</th>
                                        )}
                                    </tr>
                                </thead>
                                <motion.tbody 
                                    variants={{ show: { transition: { staggerChildren: 0.05 } } }} 
                                    initial="hidden" 
                                    animate="show"
                                >
                                    {campaigns.map(campaign => (
                                        <motion.tr 
                                            key={campaign.id} 
                                            className="border-b border-gray-100 last:border-b-0 hover:bg-orange-50/50 transition-all duration-200 cursor-pointer group" 
                                            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                                            onClick={() => router.push(`/campaigns/${campaign.id}/new/workflow`)}
                                            title="Click to open campaign workflow"
                                        >
                                            <td className="p-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </td>
                                            <td className="p-4 font-semibold text-[#1E1E1E] group-hover:text-orange-600 transition-colors">
                                                {campaign.name}
                                                <span className="ml-2 text-xs text-gray-400 group-hover:text-orange-500">→</span>
                                            </td>
                                            {/* ✅ GTM Goal Column */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Target size={14} className="text-orange-500" />
                                                    <span className="text-sm text-gray-700">{campaign.gtmGoal || 'No GTM'}</span>
                                                </div>
                                            </td>
                                            {/* ✅ Audience Column */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Users size={14} className="text-blue-500" />
                                                    <span className="text-sm text-gray-700">{campaign.audienceName || 'No Audience'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <StatusBadge status={campaign.status} />
                                            </td>
                                            {/* ✅ Total Leads Column */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-900">{campaign.totalLeads || campaign.leadsCompleted?.total || 0}</span>
                                                    <span className="text-xs text-gray-500">leads</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="w-24">
                                                    <ProgressBar current={campaign.leadsCompleted?.current || 0} total={campaign.leadsCompleted?.total || 0} />
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {campaign.leadsCompleted?.current || 0}/{campaign.leadsCompleted?.total || 0}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <KpiTag rate={campaign.replyRate || 0} />
                                            </td>
                                            <td className="p-4 font-semibold">{campaign.meetingsBooked || 0}</td>
                                            <td className="p-4">
                                                <ChannelIcons channels={campaign.channels || ['LinkedIn']} />
                                            </td>
                                            {/* ✅ Created Date Column */}
                                            <td className="p-4 text-sm text-gray-500">
                                                {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                }) : 'N/A'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    className="text-gray-400 hover:text-gray-700"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal size={20}/>
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                            <p>Showing 1-4 of 4 results</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-200 rounded-md disabled:opacity-50" disabled>
                                    <ArrowLeft size={16}/>
                                </button>
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold rounded-md">1</span>
                                <button className="p-2 hover:bg-gray-200 rounded-md disabled:opacity-50" disabled>
                                    <ArrowRight size={16}/>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!loading && campaigns.length === 0 && !error && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="max-w-md mx-auto">
                            <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                            <p className="text-gray-600 mb-6">Create your first campaign to start reaching out to prospects.</p>
                            <button 
                                onClick={openModal}
                                className="px-6 py-3 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold rounded-lg shadow-md hover:opacity-95"
                            >
                                <PlusCircle size={20} className="inline mr-2" />
                                Create Your First Campaign
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Create Campaign Modal */}
            <CreateCampaignModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                onSuccess={handleCampaignCreated}
            />
        </div>
    );
}