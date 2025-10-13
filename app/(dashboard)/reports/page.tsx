'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  Users,
  MessageCircle,
  Mail,
  Phone,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

// Types
type DateRange = '7d' | '30d' | '90d' | 'custom';
type ReportType = 'overview' | 'campaigns' | 'channels' | 'leads';

interface CampaignReport {
  id: string;
  name: string;
  gtmGoal: string;
  status: 'active' | 'paused' | 'completed';
  prospects: number;
  messages: number;
  replies: number;
  meetings: number;
  pipeline: number;
  replyRate: number;
  meetingRate: number;
  startDate: Date;
  lastActivity: Date;
}

interface ChannelPerformance {
  channel: 'LinkedIn' | 'Email' | 'Phone';
  sent: number;
  delivered: number;
  opened: number;
  replied: number;
  meetings: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
}

interface LeadAnalytics {
  status: string;
  count: number;
  percentage: number;
  value: number;
  change: number;
}

interface TimeSeriesData {
  date: string;
  prospects: number;
  replies: number;
  meetings: number;
  pipeline: number;
}

// Static Data
const CAMPAIGN_REPORTS: CampaignReport[] = [
  {
    id: '1',
    name: 'Q4 DataOps Expansion',
    gtmGoal: 'Enterprise BI Leaders Outreach',
    status: 'active',
    prospects: 1250,
    messages: 3400,
    replies: 187,
    meetings: 45,
    pipeline: 675000,
    replyRate: 5.5,
    meetingRate: 24.1,
    startDate: new Date('2024-10-01'),
    lastActivity: new Date('2025-01-12')
  },
  {
    id: '2',
    name: 'Tech Startup Founders Campaign',
    gtmGoal: 'SaaS Growth Strategy',
    status: 'active',
    prospects: 890,
    messages: 2200,
    replies: 134,
    meetings: 32,
    pipeline: 480000,
    replyRate: 6.1,
    meetingRate: 23.9,
    startDate: new Date('2024-11-15'),
    lastActivity: new Date('2025-01-13')
  },
  {
    id: '3',
    name: 'Healthcare IT Decision Makers',
    gtmGoal: 'HIPAA Compliance Solutions',
    status: 'active',
    prospects: 650,
    messages: 1800,
    replies: 98,
    meetings: 28,
    pipeline: 420000,
    replyRate: 5.4,
    meetingRate: 28.6,
    startDate: new Date('2024-12-01'),
    lastActivity: new Date('2025-01-13')
  },
  {
    id: '4',
    name: 'Manufacturing Leaders Outreach',
    gtmGoal: 'Supply Chain Optimization',
    status: 'paused',
    prospects: 420,
    messages: 1100,
    replies: 52,
    meetings: 15,
    pipeline: 225000,
    replyRate: 4.7,
    meetingRate: 28.8,
    startDate: new Date('2024-09-15'),
    lastActivity: new Date('2024-12-20')
  },
  {
    id: '5',
    name: 'Financial Services Campaign',
    gtmGoal: 'Fintech Innovation Push',
    status: 'completed',
    prospects: 780,
    messages: 2100,
    replies: 156,
    meetings: 42,
    pipeline: 630000,
    replyRate: 7.4,
    meetingRate: 26.9,
    startDate: new Date('2024-08-01'),
    lastActivity: new Date('2024-11-30')
  }
];

const CHANNEL_PERFORMANCE: ChannelPerformance[] = [
  {
    channel: 'LinkedIn',
    sent: 5200,
    delivered: 5200,
    opened: 3640,
    replied: 412,
    meetings: 98,
    openRate: 70.0,
    replyRate: 7.9,
    conversionRate: 23.8
  },
  {
    channel: 'Email',
    sent: 3400,
    delivered: 3315,
    opened: 1823,
    replied: 215,
    meetings: 54,
    openRate: 55.0,
    replyRate: 11.8,
    conversionRate: 25.1
  },
  {
    channel: 'Phone',
    sent: 180,
    delivered: 180,
    opened: 145,
    replied: 98,
    meetings: 36,
    openRate: 80.6,
    replyRate: 67.6,
    conversionRate: 36.7
  }
];

const LEAD_ANALYTICS: LeadAnalytics[] = [
  { status: 'Not Set', count: 2145, percentage: 54.2, value: 0, change: -2.3 },
  { status: 'Interested', count: 627, percentage: 15.8, value: 940500, change: 8.7 },
  { status: 'Meeting Scheduled', count: 162, percentage: 4.1, value: 486000, change: 12.5 },
  { status: 'Meeting Completed', count: 134, percentage: 3.4, value: 603000, change: 5.2 },
  { status: 'Follow Up/Nurture', count: 489, percentage: 12.3, value: 733500, change: -1.8 },
  { status: 'Closed Won', count: 87, percentage: 2.2, value: 1305000, change: 18.9 },
  { status: 'Closed Lost', count: 316, percentage: 8.0, value: 0, change: -5.4 }
];

const TIME_SERIES_DATA: TimeSeriesData[] = [
  { date: '2025-01-06', prospects: 245, replies: 18, meetings: 4, pipeline: 60000 },
  { date: '2025-01-07', prospects: 289, replies: 22, meetings: 5, pipeline: 75000 },
  { date: '2025-01-08', prospects: 312, replies: 25, meetings: 6, pipeline: 90000 },
  { date: '2025-01-09', prospects: 278, replies: 19, meetings: 5, pipeline: 75000 },
  { date: '2025-01-10', prospects: 334, replies: 28, meetings: 7, pipeline: 105000 },
  { date: '2025-01-11', prospects: 298, replies: 24, meetings: 6, pipeline: 90000 },
  { date: '2025-01-12', prospects: 356, replies: 31, meetings: 8, pipeline: 120000 }
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [reportType, setReportType] = useState<ReportType>('overview');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Summary Stats
  const totalProspects = CAMPAIGN_REPORTS.reduce((sum, c) => sum + c.prospects, 0);
  const totalReplies = CAMPAIGN_REPORTS.reduce((sum, c) => sum + c.replies, 0);
  const totalMeetings = CAMPAIGN_REPORTS.reduce((sum, c) => sum + c.meetings, 0);
  const totalPipeline = CAMPAIGN_REPORTS.reduce((sum, c) => sum + c.pipeline, 0);
  const avgReplyRate = CAMPAIGN_REPORTS.reduce((sum, c) => sum + c.replyRate, 0) / CAMPAIGN_REPORTS.length;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUp size={16} className="text-green-500" />;
    if (change < 0) return <ArrowDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                <BarChart3 size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-sm text-gray-500">Comprehensive performance insights</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar size={16} />
                {dateRange === '7d' ? 'Last 7 Days' : dateRange === '30d' ? 'Last 30 Days' : dateRange === '90d' ? 'Last 90 Days' : 'Custom'}
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all shadow-sm">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Report Type Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'campaigns', label: 'Campaigns', icon: Target },
              { id: 'channels', label: 'Channels', icon: MessageCircle },
              { id: 'leads', label: 'Lead Analytics', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as ReportType)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  reportType === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Overview Report */}
        {reportType === 'overview' && (
          <>
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(12.5)}
                    <span className={`font-medium ${12.5 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(12.5)}%
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalProspects.toLocaleString()}</h3>
                <p className="text-sm text-gray-500 mt-1">Total Prospects Targeted</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <MessageCircle size={24} className="text-purple-600" />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(8.3)}
                    <span className={`font-medium ${8.3 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(8.3)}%
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalReplies.toLocaleString()}</h3>
                <p className="text-sm text-gray-500 mt-1">Total Replies ({avgReplyRate.toFixed(1)}% rate)</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar size={24} className="text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(15.7)}
                    <span className={`font-medium ${15.7 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(15.7)}%
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalMeetings}</h3>
                <p className="text-sm text-gray-500 mt-1">Meetings Booked</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <DollarSign size={24} className="text-orange-600" />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(22.1)}
                    <span className={`font-medium ${22.1 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(22.1)}%
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalPipeline)}</h3>
                <p className="text-sm text-gray-500 mt-1">Total Pipeline Value</p>
              </motion.div>
            </div>

            {/* Performance Trend Chart */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Performance Trend (Last 7 Days)</h2>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-lg font-medium">Prospects</button>
                  <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Replies</button>
                  <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Meetings</button>
                </div>
              </div>
              <div className="h-64 flex items-end gap-4">
                {TIME_SERIES_DATA.map((data, index) => {
                  const maxValue = Math.max(...TIME_SERIES_DATA.map(d => d.prospects));
                  const height = (data.prospects / maxValue) * 100;
                  return (
                    <div key={data.date} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg relative group cursor-pointer hover:opacity-80"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.prospects} prospects
                        </div>
                      </motion.div>
                      <div className="text-xs text-gray-500 mt-2">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Channel Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {CHANNEL_PERFORMANCE.map((channel, index) => (
                <motion.div
                  key={channel.channel}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{channel.channel}</h3>
                    {channel.channel === 'LinkedIn' && <Mail size={20} className="text-blue-600" />}
                    {channel.channel === 'Email' && <Mail size={20} className="text-purple-600" />}
                    {channel.channel === 'Phone' && <Phone size={20} className="text-green-600" />}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sent</span>
                      <span className="font-semibold text-gray-900">{channel.sent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Open Rate</span>
                      <span className="font-semibold text-blue-600">{channel.openRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Reply Rate</span>
                      <span className="font-semibold text-purple-600">{channel.replyRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Meetings</span>
                      <span className="font-semibold text-green-600">{channel.meetings}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Campaigns Report */}
        {reportType === 'campaigns' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Campaign Performance</h2>
              <p className="text-sm text-gray-500 mt-1">Detailed metrics for all campaigns</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prospects</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Replies</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meetings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pipeline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reply Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {CAMPAIGN_REPORTS.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-xs text-gray-500">{campaign.gtmGoal}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campaign.prospects.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campaign.messages.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campaign.replies}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campaign.meetings}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(campaign.pipeline)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-medium text-purple-600">{campaign.replyRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Channels Report */}
        {reportType === 'channels' && (
          <div className="space-y-6">
            {CHANNEL_PERFORMANCE.map((channel, index) => (
              <motion.div
                key={channel.channel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      channel.channel === 'LinkedIn' ? 'bg-blue-100' :
                      channel.channel === 'Email' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {channel.channel === 'LinkedIn' && <Mail size={24} className="text-blue-600" />}
                      {channel.channel === 'Email' && <Mail size={24} className="text-purple-600" />}
                      {channel.channel === 'Phone' && <Phone size={24} className="text-green-600" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{channel.channel}</h3>
                      <p className="text-sm text-gray-500">Channel Performance Breakdown</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{channel.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900">{channel.delivered.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {((channel.delivered / channel.sent) * 100).toFixed(1)}% delivery rate
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Opened</p>
                    <p className="text-2xl font-bold text-blue-600">{channel.opened.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 mt-1">{channel.openRate}% open rate</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Replied</p>
                    <p className="text-2xl font-bold text-purple-600">{channel.replied}</p>
                    <p className="text-xs text-purple-600 mt-1">{channel.replyRate}% reply rate</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Meetings Booked</p>
                      <p className="text-xl font-bold text-green-600">{channel.meetings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
                      <p className="text-xl font-bold text-orange-600">{channel.conversionRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Avg Response Time</p>
                      <p className="text-xl font-bold text-gray-900">2.4h</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lead Analytics Report */}
        {reportType === 'leads' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Lead Status Distribution</h2>
              <div className="space-y-4">
                {LEAD_ANALYTICS.map((stat, index) => (
                  <motion.div
                    key={stat.status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-32">
                        <p className="text-sm font-medium text-gray-900">{stat.status}</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.percentage}%` }}
                            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                            className={`h-full rounded-full ${
                              stat.status === 'Closed Won' ? 'bg-green-500' :
                              stat.status === 'Closed Lost' ? 'bg-red-500' :
                              stat.status === 'Meeting Scheduled' ? 'bg-blue-500' :
                              stat.status === 'Interested' ? 'bg-purple-500' :
                              'bg-gray-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 ml-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{stat.count.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{stat.percentage}%</p>
                      </div>
                      {stat.value > 0 && (
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(stat.value)}</p>
                          <p className="text-xs text-gray-500">value</p>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        {getTrendIcon(stat.change)}
                        <span className={`text-sm font-medium ${
                          stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {Math.abs(stat.change)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lead Source Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Quality Score</h3>
                <div className="space-y-3">
                  {[
                    { range: '90-100', count: 234, color: 'bg-green-500' },
                    { range: '70-89', count: 567, color: 'bg-blue-500' },
                    { range: '50-69', count: 892, color: 'bg-yellow-500' },
                    { range: '0-49', count: 1267, color: 'bg-red-500' }
                  ].map((score, index) => (
                    <div key={score.range} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${score.color}`} />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-gray-600">{score.range} points</span>
                        <span className="text-sm font-semibold text-gray-900">{score.count.toLocaleString()} leads</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Rate by Segment</h3>
                <div className="space-y-3">
                  {[
                    { segment: 'Enterprise', rate: 8.7 },
                    { segment: 'Mid-Market', rate: 6.3 },
                    { segment: 'SMB', rate: 5.1 },
                    { segment: 'Startup', rate: 7.9 }
                  ].map((seg) => (
                    <div key={seg.segment} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{seg.segment}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"
                            style={{ width: `${(seg.rate / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">{seg.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

