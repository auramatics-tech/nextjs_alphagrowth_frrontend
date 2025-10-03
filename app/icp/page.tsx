'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MainLayout from '../../components/layout/MainLayout/MainLayout';
import {
  Search, Filter, ArrowUpDown, Plus, Edit, Eye, X, MapPin, Building, MoreVertical, Trash2, Loader2
} from 'lucide-react';
import { icpService, ICP } from '../../services/icpService';
import { toast } from 'react-hot-toast';

// Types
interface ProcessedICP extends ICP {
  location: string;
  company: string;
  industry: string;
  target: string;
  techStack: string[];
}

export default function IcpListingPage() {
  const [icps, setIcps] = useState<ProcessedICP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Load ICPs on component mount
  useEffect(() => {
    loadICPs();
  }, []);

  const loadICPs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await icpService.getICPList();
      
      if (response.success) {
        const processedICPs = response.data.map(processICPData);
        setIcps(processedICPs);
      } else {
        setError(response.message || 'Failed to load ICPs');
        toast.error('Failed to load ICPs');
      }
    } catch (error) {
      console.error('Error loading ICPs:', error);
      setError('Failed to load ICPs');
      toast.error('Failed to load ICPs');
    } finally {
      setLoading(false);
    }
  };

  // Process ICP data to match the UI format
  const processICPData = (icp: ICP): ProcessedICP => {
    return {
      ...icp,
      location: `${icp.location_city}, ${icp.location_country}`,
      company: icp.business?.companyName || 'Unknown Company',
      industry: icp.business?.industry || 'Unknown Industry',
      target: icp.company_targets || 'No target specified',
      techStack: icp.tech_stack_current ? icp.tech_stack_current.split(',').map(tech => tech.trim()) : []
    };
  };

  const handleEdit = (id: string) => {
    console.log('Edit ICP:', id);
    // TODO: Navigate to edit page
  };

  const handleView = (id: string) => {
    console.log('View ICP:', id);
  };

  const handleRemoveStatusFilter = () => {
    setStatusFilter('All');
  };

  const handleDelete = async (id: string) => {
    try {
      await icpService.deleteICP(id);
      toast.success('ICP deleted successfully');
      // Reload the list
      loadICPs();
    } catch (error) {
      console.error('Error deleting ICP:', error);
      toast.error('Failed to delete ICP');
    } finally {
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Helper function to parse industry into tags
  const parseIndustryTags = (industry: string) => {
    const parts = industry.split(' - ')[0].split(', ');
    return parts.slice(0, 3); // Limit to 3 tags for better UI
  };

  // Helper function to extract domain from URL
  const getDomainFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Filter ICPs based on search query
  const filteredICPs = icps.filter(icp => {
    const searchLower = searchQuery.toLowerCase();
    return (
      icp.name.toLowerCase().includes(searchLower) ||
      icp.title.toLowerCase().includes(searchLower) ||
      icp.company.toLowerCase().includes(searchLower) ||
      icp.industry.toLowerCase().includes(searchLower) ||
      icp.target.toLowerCase().includes(searchLower)
    );
  });

  const headerActions = (
    <Link href="/icp/new">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-4 h-4" />
        <span>+ New ICP</span>
      </motion.button>
    </Link>
  );

  return (
    <MainLayout title="ICP" headerActions={headerActions}>
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
                    placeholder="Search ICP"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Status Filter Pill */}
                {statusFilter !== 'All' && (
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-sm text-gray-700">Status-{statusFilter}</span>
                    <button
                      onClick={handleRemoveStatusFilter}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                )}

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
              <span className="ml-2 text-gray-600">Loading ICPs...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={loadICPs}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredICPs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {searchQuery ? 'No ICPs found matching your search.' : 'No ICPs found. Create your first ICP to get started.'}
              </div>
              {!searchQuery && (
                <Link href="/icp/new">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Create ICP
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* ICP Cards */}
          {!loading && !error && filteredICPs.length > 0 && (
            <div className="space-y-4">
              {filteredICPs.map((icp, index) => (
              <motion.div
                key={icp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {getInitials(icp.name)}
                      </div>
                      
                      {/* Name and Title */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {icp.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {icp.title}
                        </p>
                      </div>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(icp.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {openDropdown === icp.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]"
                        >
                          <button
                            onClick={() => handleEdit(icp.id)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(icp.id)}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="mb-4">
                    {/* Location and Company */}
                    <div className="flex items-center space-x-6 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{icp.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <a
                          href={icp.company}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {getDomainFromUrl(icp.company)}
                        </a>
                      </div>
                    </div>

                    {/* Industry Tags */}
                    <div className="flex flex-wrap gap-2">
                      {parseIndustryTags(icp.industry).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-700">
                      {icp.target}
                    </p>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
      </motion.div>
    </MainLayout>
  );
}
