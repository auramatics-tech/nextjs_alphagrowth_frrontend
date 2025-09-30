'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import KPIDashboard from '../../../components/dashboard/KPIDashboard';
import SalesFunnel from '../../../components/dashboard/SalesFunnel';
import ChannelsDashboard from '../../../components/dashboard/ChannelsDashboard';
import TasksDashboard from '../../../components/dashboard/TasksDashboard';
import MeetingsTrend from '../../../components/dashboard/MeetingsTrend';
import FilterDropdowns from '../../../components/dashboard/FilterDropdowns';
import type { DashboardFilters } from '../../../types/dashboard';

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<DashboardFilters>({
    gtmIds: [],
    campaignIds: []
  });

  // Get userId from localStorage
  const userId = typeof window !== 'undefined' 
    ? localStorage.getItem('userId') || localStorage.getItem('_token') || 'default-user-id'
    : 'default-user-id';

  // Handle filter changes from FilterDropdowns
  const handleFiltersChange = useCallback((filters: DashboardFilters) => {
    console.log('Main Dashboard - Filters received:', filters);
    setSelectedFilters(filters);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 shadow-sm" />
            <h1 className="text-xl font-semibold text-gray-900">AlphaGrowth — Analytics</h1>
          </div>
          <div className="flex items-center gap-3">
            <FilterDropdowns 
              userId={userId} 
              refreshTrigger={refreshTrigger}
              onRefresh={handleRefresh}
              onFiltersChange={handleFiltersChange}
            />
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* KPI Dashboard */}
        <KPIDashboard 
          userId={userId} 
          refreshTrigger={refreshTrigger}
          onRefresh={handleRefresh}
          filters={selectedFilters}
        />

        {/* Sales Funnel and Meetings Trend Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <h6 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel (Value after Reply)</h6>
              <SalesFunnel 
                userId={userId} 
                refreshTrigger={refreshTrigger}
                onRefresh={handleRefresh}
                filters={selectedFilters}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <h6 className="text-lg font-semibold text-gray-900 mb-4">Meetings Trend (weekly)</h6>
              <MeetingsTrend />
            </div>
          </div>
        </div>

        {/* Channels Dashboard */}
        <ChannelsDashboard 
          userId={userId} 
          refreshTrigger={refreshTrigger}
          onRefresh={handleRefresh}
          filters={selectedFilters}
        />

        {/* Tasks Dashboard */}
        <TasksDashboard 
          userId={userId} 
          refreshTrigger={refreshTrigger}
          onRefresh={handleRefresh}
          filters={selectedFilters}
        />
      </div>
    </main>
  );
}