'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useSalesFunnelData } from '../../hooks/useDashboardData';
import ConeFunnel from './ConeFunnel';
import type { DashboardFilters } from '../../types/dashboard';

interface SalesFunnelProps {
  userId: string;
  filters?: DashboardFilters;
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const SalesFunnel: React.FC<SalesFunnelProps> = ({ 
  userId, 
  filters = { gtmIds: [], campaignIds: [] }, 
  refreshTrigger = 0,
  onRefresh 
}) => {
  const { data: funnelData, loading, error, refetch } = useSalesFunnelData(userId, filters, refreshTrigger);

  // Loading state
  if (loading) {
    return (
      <motion.div 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h6 className="text-lg font-bold text-[#1E1E1E] mb-4">Sales Funnel (Value after Reply)</h6>
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
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h6 className="text-lg font-bold text-[#1E1E1E] mb-4">Sales Funnel (Value after Reply)</h6>
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
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h6 className="text-lg font-bold text-[#1E1E1E] mb-4">Sales Funnel (Value after Reply)</h6>
      <ConeFunnel values={funnelData} />
      {onRefresh && (
        <div className="mt-4 text-center">
          <button 
            onClick={onRefresh}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SalesFunnel;
