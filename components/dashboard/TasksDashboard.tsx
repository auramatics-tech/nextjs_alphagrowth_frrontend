'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTasksData } from '../../hooks/useDashboardData';
import TaskTable from './TaskTable';
import type { DashboardFilters } from '../../types/dashboard';

interface TasksDashboardProps {
  userId: string;
  filters?: DashboardFilters;
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const TasksDashboard: React.FC<TasksDashboardProps> = ({ 
  userId, 
  filters = { gtmIds: [], campaignIds: [] }, 
  refreshTrigger = 0,
  onRefresh 
}) => {
  const { data: tasks, loading, error, refetch } = useTasksData(userId, filters, refreshTrigger);

  // Loading state
  if (loading) {
    return (
      <motion.div 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h6 className="text-lg font-bold text-[#1E1E1E] mb-4">Today&apos;s Tasks & Upcoming Meetings</h6>
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
        <h6 className="text-lg font-bold text-[#1E1E1E] mb-4">Today&apos;s Tasks & Upcoming Meetings</h6>
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
      <h6 className="text-lg font-bold text-[#1E1E1E] mb-4">Today&apos;s Tasks & Upcoming Meetings</h6>
      <TaskTable items={tasks} />
    </motion.div>
  );
};

export default TasksDashboard;