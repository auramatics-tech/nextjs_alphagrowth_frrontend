'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TaskCard from '@/components/tasks/TaskCard';

// Mock task data
const mockTasks = [
  {
    id: '1',
    leadName: 'Emily Chen',
    leadEmail: 'emily.chen@techcorp.com',
    leadAvatar: '/avatars/emily-chen.jpg',
    company: 'TechCorp Solutions',
    campaign: 'Q4 Enterprise Outreach',
    taskNotes: 'Follow up on demo request and schedule meeting for next week',
    status: 'open',
    created: '2023-10-25T10:30:00Z',
    priority: 'high'
  },
  {
    id: '2',
    leadName: 'Michael Rodriguez',
    leadEmail: 'm.rodriguez@startup.io',
    leadAvatar: '/avatars/michael-rodriguez.jpg',
    company: 'StartupIO',
    campaign: 'SaaS Product Launch',
    taskNotes: 'Send pricing information and case studies',
    status: 'in_progress',
    created: '2023-10-24T14:15:00Z',
    priority: 'medium'
  },
  {
    id: '3',
    leadName: 'Sarah Johnson',
    leadEmail: 'sarah.j@enterprise.com',
    leadAvatar: '/avatars/sarah-johnson.jpg',
    company: 'Enterprise Solutions Inc',
    campaign: 'Enterprise Outreach',
    taskNotes: 'Prepare custom proposal based on their requirements',
    status: 'completed',
    created: '2023-10-23T09:20:00Z',
    priority: 'high'
  },
  {
    id: '4',
    leadName: 'David Kim',
    leadEmail: 'david.kim@innovate.com',
    leadAvatar: '/avatars/david-kim.jpg',
    company: 'Innovate Technologies',
    campaign: 'Innovation Partnership',
    taskNotes: 'Schedule technical integration call with their dev team',
    status: 'open',
    created: '2023-10-22T16:45:00Z',
    priority: 'low'
  },
  {
    id: '5',
    leadName: 'Lisa Thompson',
    leadEmail: 'lisa.thompson@globalcorp.com',
    leadAvatar: '/avatars/lisa-thompson.jpg',
    company: 'GlobalCorp',
    campaign: 'Global Expansion',
    taskNotes: 'Follow up on contract review and legal requirements',
    status: 'in_progress',
    created: '2023-10-21T11:30:00Z',
    priority: 'medium'
  }
];

export default function MyTasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesSearch = task.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.taskNotes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, searchQuery]);

  const handleTaskUpdate = (taskId: string, updates: any) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleAddTask = () => {
    // TODO: Implement add task functionality
    console.log('Add new task');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          <button
            onClick={handleAddTask}
            className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Filter by Status */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter and Sort Buttons */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Add Filter
            </button>
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Sort
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6">
        {/* Header Row */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
            <div className="col-span-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lead Name</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Campaign</span>
            </div>
            <div className="col-span-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Task Notes</span>
            </div>
            <div className="col-span-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
            </div>
            <div className="col-span-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</span>
            </div>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TaskCard
                  task={task}
                  onUpdate={handleTaskUpdate}
                  onDelete={handleTaskDelete}
                />
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first task.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {filteredTasks.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        )}
      </div>
    </div>
  );
}

