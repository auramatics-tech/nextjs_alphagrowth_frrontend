'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  status: 'OPENED' | 'WORKING' | 'CLOSED';
  task_notes: string;
  opened_at: string;
  working_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
  lead: {
    id: string;
    first_name: string;
    last_name: string;
    company_name: string;
    pro_email: string;
    profile_url?: string;
  };
  campaign: {
    id: string;
    name: string;
    status: string;
  };
  node?: {
    id: string;
    label: string;
    type: string;
    node_type: string;
  };
}

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: any) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPENED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'WORKING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CLOSED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignColor = (campaign: string) => {
    const colors = [
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-teal-100 text-teal-800 border-teal-200',
      'bg-orange-100 text-orange-800 border-orange-200'
    ];
    
    // Simple hash function to get consistent color for same campaign
    let hash = 0;
    for (let i = 0; i < campaign.length; i++) {
      hash = campaign.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleMarkComplete = () => {
    onUpdate(task.id, { status: 'CLOSED' });
    setShowActionsMenu(false);
  };

  const handleMarkInProgress = () => {
    onUpdate(task.id, { status: 'WORKING' });
    setShowActionsMenu(false);
  };

  const handleReopen = () => {
    onUpdate(task.id, { status: 'OPENED' });
    setShowActionsMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
    setShowActionsMenu(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName || ''} ${lastName || ''}`.trim();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="grid grid-cols-12 gap-4 px-6 py-4">
        {/* Lead Name */}
        <div className="col-span-3 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {task.lead.profile_url ? (
                <img 
                  src={task.lead.profile_url} 
                  alt={getFullName(task.lead.first_name, task.lead.last_name)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm ${task.lead.profile_url ? 'hidden' : 'flex'}`}>
                {getInitials(task.lead.first_name, task.lead.last_name)}
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">{getFullName(task.lead.first_name, task.lead.last_name)}</div>
            <div className="text-sm text-gray-500 truncate">{task.lead.pro_email || 'No email'}</div>
          </div>
        </div>

        {/* Company */}
        <div className="col-span-2 flex items-center">
          <span className="text-sm text-gray-900 truncate">{task.lead.company_name || 'Not specified'}</span>
        </div>

        {/* Campaign */}
        <div className="col-span-2 flex items-center">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCampaignColor(task.campaign.name)}`}>
            {task.campaign.name || 'Unnamed Campaign'}
          </span>
        </div>

        {/* Task Notes */}
        <div className="col-span-3 flex items-center">
          <textarea 
            className="w-full text-sm text-gray-900 border-0 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white rounded px-2 py-1"
            value={task.task_notes || ''} 
            onChange={(e) => onUpdate(task.id, { task_notes: e.target.value })}
            onBlur={() => onUpdate(task.id, { task_notes: task.task_notes })}
            rows={2}
            placeholder="Add task notes..."
          />
        </div>

        {/* Status */}
        <div className="col-span-1 flex items-center">
          <select 
            className={`text-xs font-medium border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1 ${getStatusColor(task.status)}`}
            value={task.status} 
            onChange={(e) => onUpdate(task.id, { status: e.target.value as 'OPENED' | 'WORKING' | 'CLOSED' })}
          >
            <option value="OPENED">Open</option>
            <option value="WORKING">Working</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Created */}
        <div className="col-span-1 flex items-center">
          <span className="text-sm text-gray-500">{formatDate(task.opened_at)}</span>
        </div>
      </div>

      {/* Actions Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowActionsMenu(!showActionsMenu)}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        <AnimatePresence>
          {showActionsMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-8 z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            >
              {task.status === 'OPENED' && (
                <button
                  onClick={handleMarkInProgress}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark as Working
                </button>
              )}
              
              {task.status === 'WORKING' && (
                <button
                  onClick={handleMarkComplete}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Closed
                </button>
              )}
              
              {task.status === 'CLOSED' && (
                <button
                  onClick={handleReopen}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reopen Task
                </button>
              )}
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Task
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

