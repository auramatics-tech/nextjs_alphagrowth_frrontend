'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import TaskCard from '@/components/tasks/TaskCard';
import { getUserTasks, updateTaskStatus, updateTaskNotes, deleteTask, type Task } from '@/services/taskService';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getUserTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        (task.lead.first_name && task.lead.first_name.toLowerCase().includes(searchLower)) ||
        (task.lead.last_name && task.lead.last_name.toLowerCase().includes(searchLower)) ||
        (task.lead.company_name && task.lead.company_name.toLowerCase().includes(searchLower)) ||
        (task.campaign.name && task.campaign.name.toLowerCase().includes(searchLower)) ||
        (task.task_notes && task.task_notes.toLowerCase().includes(searchLower));
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, searchQuery]);

  const handleTaskUpdate = async (taskId: string, updates: any) => {
    try {
      if (updates.status) {
        await updateTaskStatus(taskId, updates.status);
        toast.success('Task status updated successfully');
      }
      if (updates.task_notes !== undefined) {
        await updateTaskNotes(taskId, updates.task_notes);
        toast.success('Task notes updated successfully');
      }
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        toast.success('Task deleted successfully');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
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
          {/* <button
            onClick={handleAddTask}
            className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            + Add Task
          </button> */}
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
              <option value="OPENED">Open</option>
              <option value="WORKING">Working</option>
              <option value="CLOSED">Closed</option>
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
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600">Loading tasks...</span>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}

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

