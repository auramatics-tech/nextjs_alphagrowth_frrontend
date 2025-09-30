'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useChannelsData } from '../../hooks/useDashboardData';
import ChannelsTable from './ChannelsTable';
import type { DashboardFilters } from '../../types/dashboard';

interface ChannelsDashboardProps {
  userId: string;
  filters?: DashboardFilters;
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const ChannelsDashboard: React.FC<ChannelsDashboardProps> = ({ 
  userId, 
  filters = { gtmIds: [], campaignIds: [] }, 
  refreshTrigger = 0,
  onRefresh 
}) => {
  const { data: channelsData, loading, error, refetch } = useChannelsData(userId, filters, refreshTrigger);
  const [activeChannel, setActiveChannel] = useState("All");

  // Loading state
  if (loading) {
    return (
      <motion.div 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h6 className="text-lg font-bold text-[#1E1E1E] mb-4">Channels Performance</h6>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B2C]" />
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h6 className="text-lg font-bold text-[#1E1E1E] mb-4">Channels Performance</h6>
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
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-lg font-bold text-[#1E1E1E]">Channels Performance</h6>
        <div className="flex gap-2">
          {['All', 'LinkedIn', 'Email', 'Voice'].map(c => (
            <button 
              key={c} 
              type="button" 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeChannel === c 
                  ? 'bg-[#FF6B2C] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveChannel(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <ChannelsTable rows={channelsData} filter={activeChannel} />
    </motion.div>
  );
};

export default ChannelsDashboard;
