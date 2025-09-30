'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Calendar, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useKPIData } from '../../hooks/useDashboardData';
import KpiCard from './KPICard';
import type { DashboardFilters } from '../../types/dashboard';

interface KPIDashboardProps {
  userId: string;
  filters?: DashboardFilters;
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const KPIDashboard: React.FC<KPIDashboardProps> = ({ 
  userId, 
  filters = { gtmIds: [], campaignIds: [] }, 
  refreshTrigger = 0,
  onRefresh 
}) => {
  const { data: kpiData, loading, error, refetch } = useKPIData(userId, filters, refreshTrigger);

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF6B2C]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="col-span-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-red-600 mb-2">{error}</div>
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className="px-4 py-2 bg-[#FF6B2C] text-white rounded-lg hover:bg-[#FF6B2C]/90 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Prospects Targeted",
      value: kpiData.prospects,
      hint: `${kpiData.openRate}% open rate (email)`,
      icon: Users
    },
    {
      title: "Replies",
      value: kpiData.replies,
      hint: `${kpiData.replyRate}% reply rate`,
      icon: MessageCircle
    },
    {
      title: "Meetings Booked",
      value: kpiData.meetings,
      hint: `${kpiData.meetingRate}% of replies`,
      icon: Calendar
    },
    {
      title: "Pipeline",
      value: kpiData.pipeline,
      valueUSD: kpiData.pipeline,
      hint: "weighted",
      icon: DollarSign
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {kpiCards.map((item, index) => (
        <KpiCard 
          key={item.title} 
          title={item.title}
          value={item.value}
          valueUSD={item.valueUSD}
          hint={item.hint}
          icon={item.icon}
          index={index}
        />
      ))}
    </div>
  );
};

export default KPIDashboard;
