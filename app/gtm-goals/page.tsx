'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout/MainLayout';
import {
  Search, Filter, ArrowUpDown, Plus, MoreVertical, Edit, Trash2, Target, Clock, TrendingUp, Loader2
} from 'lucide-react';
import { gtmService, GTMGoal } from '../../services/gtmService';
import { toast } from 'react-hot-toast';

// Types
interface ProcessedGTMGoal extends GTMGoal {
  name: string;
  status: string;
  progress: number;
  targeting: string;
  duration: string;
  mainObjective: string;
  painPoint: string;
  valueProposition: string;
}

// GTM Goal Row Component
const GTMGoalRow: React.FC<{ goal: ProcessedGTMGoal; onEdit: (id: string) => void; onDelete: (id: string) => void }> = ({ goal, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActions) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-4"
    >
      {/* Collapsed Row */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
                {goal.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Progress Bar */}
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">{goal.progress}%</span>
              </div>

              {/* Targeting */}
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{goal.targeting}</span>
              </div>

              {/* Duration */}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{goal.duration}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Direct Edit Button (matching frontend_old) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(goal.id);
              }}
              className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Edit
            </button>
            
            {/* More Actions Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
              
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(goal.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-100 p-6 bg-gray-50"
        >
          <div className="space-y-6">
            {/* Main Objective */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Main Objective</h4>
              <p className="text-gray-700 leading-relaxed">{goal.mainObjective}</p>
            </div>

            {/* Pain Point */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Pain Point</h4>
              <p className="text-gray-700 leading-relaxed">{goal.painPoint}</p>
            </div>

            {/* Value Proposition */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Value Proposition</h4>
              <p className="text-gray-700 leading-relaxed">{goal.valueProposition}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const GTMStrategyHub = () => {
  const [goals, setGoals] = useState<ProcessedGTMGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load GTM goals on component mount
  useEffect(() => {
    loadGTMGoals();
  }, []);

  const loadGTMGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gtmService.getGTMList();
      
      if (response.success) {
        const processedGoals = response.data.map(processGTMData);
        setGoals(processedGoals);
      } else {
        setError(response.message || 'Failed to load GTM goals');
        toast.error('Failed to load GTM goals');
      }
    } catch (error) {
      console.error('Error loading GTM goals:', error);
      setError('Failed to load GTM goals');
      toast.error('Failed to load GTM goals');
    } finally {
      setLoading(false);
    }
  };

  // Process GTM data to match the UI format
  const processGTMData = (gtm: GTMGoal): ProcessedGTMGoal => {
    return {
      ...gtm,
      name: gtm.gtmName || 'Unnamed GTM Goal',
      status: 'Active', // Default status since API doesn't provide this
      progress: Math.floor(Math.random() * 100), // Random progress for demo
      targeting: gtm.targetCount || 'Not specified',
      duration: gtm.gtmDuration || 'Not specified',
      mainObjective: gtm.mainObjectives || 'No objective specified',
      painPoint: gtm.keyCustomerPainPoint || 'No pain point specified',
      valueProposition: gtm.coreValueProposition || 'No value proposition specified'
    };
  };

  // Filter goals based on search query
  const filteredGoals = goals.filter(goal => {
    const searchLower = searchQuery.toLowerCase();
    return (
      goal.name.toLowerCase().includes(searchLower) ||
      goal.mainObjective.toLowerCase().includes(searchLower) ||
      goal.targeting.toLowerCase().includes(searchLower) ||
      goal.painPoint.toLowerCase().includes(searchLower) ||
      goal.valueProposition.toLowerCase().includes(searchLower)
    );
  });

  // Handle edit
  const handleEdit = (id: string) => {
    console.log('Edit GTM goal:', id);
    // Navigate to edit page (matching frontend_old pattern)
    window.location.href = `/gtm-goals/edit/${id}`;
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await gtmService.deleteGTMGoal(id);
      toast.success('GTM goal deleted successfully');
      // Reload the list
      loadGTMGoals();
    } catch (error) {
      console.error('Error deleting GTM goal:', error);
      toast.error('Failed to delete GTM goal');
    }
  };

  const headerActions = (
    <Link href="/gtm-goals/new">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-4 h-4" />
        <span>+ Create New GTM Goal</span>
      </motion.button>
    </Link>
  );

  return (
    <MainLayout title="GTM Strategy Hub" headerActions={headerActions}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Toolbar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search GTM Goals"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                />
              </div>

              {/* Add Filter Button */}
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Add Filter</span>
              </button>

              {/* Sort Button */}
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm">Sort</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Loading GTM goals...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={loadGTMGoals}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchQuery ? 'No GTM goals found matching your search.' : 'No GTM goals found. Create your first GTM goal to get started.'}
            </div>
            {!searchQuery && (
              <Link href="/gtm-goals/new">
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Create GTM Goal
                </button>
              </Link>
            )}
          </div>
        )}

        {/* Goals List */}
        {!loading && !error && filteredGoals.length > 0 && (
          <div className="space-y-4">
            {filteredGoals.map((goal) => (
              <GTMGoalRow 
                key={goal.id} 
                goal={goal} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default GTMStrategyHub;
