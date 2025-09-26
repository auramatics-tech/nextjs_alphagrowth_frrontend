'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout/MainLayout';
import {
  Search, Filter, ArrowUpDown, Plus, MoreVertical, Edit, Trash2, Target, Clock, TrendingUp
} from 'lucide-react';

// Mock data for GTM Goals
const mockGoals = [
  {
    id: 1,
    name: 'DataMind AI Go-to-Market Launch',
    status: 'Active',
    progress: 60,
    targeting: 'Mid-market SaaS',
    duration: '4 Months',
    mainObjective: 'Establish DataMind AI as the go-to AI analytics platform for mid-market SaaS companies by Q2 2024, achieving 25% market penetration and $2M ARR.',
    painPoint: 'Chief Data Officers in mid-market SaaS face dependency on technical teams for data insights, causing delays in decision-making and missed opportunities for growth optimization.',
    valueProposition: 'DataMind AI provides an AI-driven platform that enables non-technical teams to generate actionable insights from complex datasets, reducing time-to-insight by 75% and increasing data-driven decision velocity.',
  },
  {
    id: 2,
    name: 'Enterprise Security Solutions Expansion',
    status: 'Planning',
    progress: 25,
    targeting: 'Fortune 500',
    duration: '8 Months',
    mainObjective: 'Expand our security solutions portfolio to capture 15% of the enterprise cybersecurity market, focusing on Fortune 500 companies with complex compliance requirements.',
    painPoint: 'Enterprise security teams struggle with fragmented tools and manual compliance reporting, leading to security gaps and regulatory violations that cost millions in penalties.',
    valueProposition: 'Our integrated security platform provides end-to-end protection with automated compliance reporting, reducing security incidents by 90% and compliance costs by 60%.',
  },
  {
    id: 3,
    name: 'Healthcare Digital Transformation',
    status: 'Active',
    progress: 80,
    targeting: 'Healthcare Systems',
    duration: '6 Months',
    mainObjective: 'Become the leading digital transformation partner for healthcare systems, targeting 50 hospital networks and achieving $5M in healthcare-specific revenue.',
    painPoint: 'Healthcare systems are overwhelmed with legacy systems and regulatory requirements, making digital transformation slow and costly while patient care suffers.',
    valueProposition: 'Our healthcare-specific platform accelerates digital transformation while maintaining HIPAA compliance, improving patient outcomes by 40% and operational efficiency by 55%.',
  }
];

// GTM Goal Row Component
const GTMGoalRow: React.FC<{ goal: any }> = ({ goal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

          {/* Actions Menu */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle actions menu
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

        {/* Goals List */}
        <div className="space-y-4">
          {mockGoals.map((goal) => (
            <GTMGoalRow key={goal.id} goal={goal} />
          ))}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default GTMStrategyHub;
