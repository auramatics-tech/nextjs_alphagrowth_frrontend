'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Linkedin, Filter, Download, Check, X, Loader2, AlertCircle, Plus } from 'lucide-react';
import { linkedinService, LinkedInLeadSearchParams, LinkedInLead } from '@/services/linkedinService';
import { useIdentities } from '@/hooks/useIdentities';
// import { toast } from 'react-hot-toast';

interface LinkedInLeadSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: LinkedInLead[]) => void;
  connectionId?: string;
}

const LinkedInLeadSearch: React.FC<LinkedInLeadSearchProps> = ({
  isOpen,
  onClose,
  onImportLeads,
  connectionId
}) => {
  const [searchParams, setSearchParams] = useState<LinkedInLeadSearchParams>({
    search_type: 'regular',
    keywords: '',
    location: '',
    industry: '',
    company_size: '',
    seniority_level: '',
    page: 1,
    limit: 50
  });
  
  const [leads, setLeads] = useState<LinkedInLead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // Identity management
  const {
    identities,
    selectedIdentity,
    loading: identityLoading,
    selectIdentity,
    createIdentity
  } = useIdentities({ autoFetch: true, linkedInOnly: true });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  }, [error]);

  const handleSearch = useCallback(async () => {
    if (!selectedIdentity) {
      setError('Please select an identity');
      return;
    }
    
    if (!searchParams.keywords?.trim()) {
      setError('Please enter search keywords');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await linkedinService.searchLeads(searchParams);
      
      if (response.success) {
        setLeads(response.data.leads);
        setTotalResults(response.data.total);
        setHasMore(response.data.has_more);
        setSelectedLeads(new Set());
        console.log(`Found ${response.data.leads.length} leads`);
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Search failed. Please try again.';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const nextPageParams = { ...searchParams, page: (searchParams.page || 1) + 1 };
      const response = await linkedinService.searchLeads(nextPageParams);
      
      if (response.success) {
        setLeads(prev => [...prev, ...response.data.leads]);
        setHasMore(response.data.has_more);
        setSearchParams(prev => ({ ...prev, page: nextPageParams.page }));
      }
    } catch (err: any) {
      console.error('Failed to load more leads');
    } finally {
      setLoading(false);
    }
  }, [searchParams, hasMore, loading]);

  const handleSelectLead = useCallback((leadId: string) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(lead => lead.id)));
    }
  }, [leads, selectedLeads.size]);

  const handleImportSelected = useCallback(() => {
    const selectedLeadsData = leads.filter(lead => selectedLeads.has(lead.id));
    onImportLeads(selectedLeadsData);
    onClose();
  }, [leads, selectedLeads, onImportLeads, onClose]);

  const handleURLSearch = useCallback(async (url: string) => {
    if (!selectedIdentity) {
      setError('Please select an identity');
      return;
    }
    
    if (!url.trim()) {
      setError('Please enter a LinkedIn search URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await linkedinService.searchLeads({ search_url: url });
      
      if (response.success) {
        setLeads(response.data.leads);
        setTotalResults(response.data.total);
        setHasMore(response.data.has_more);
        setSelectedLeads(new Set());
        console.log(`Found ${response.data.leads.length} leads from URL`);
      } else {
        throw new Error(response.message || 'URL search failed');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'URL search failed. Please try again.';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Linkedin size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">LinkedIn Lead Search</h2>
                <p className="text-sm text-gray-600">Search and import leads from LinkedIn</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Search Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-4">
              {/* Identity Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Identity
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedIdentity?.id || ''}
                    onChange={(e) => selectIdentity(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose an identity</option>
                    {identities.map((identity) => (
                      <option key={identity.id} value={identity.id}>
                        {identity.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt('Enter identity name:');
                      if (name) createIdentity(name);
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                    title="Create new identity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {identityLoading && (
                  <div className="text-sm text-gray-500">Loading identities...</div>
                )}
              </div>

              {/* Search Type Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSearchParams(prev => ({ ...prev, search_type: 'regular' }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchParams.search_type === 'regular'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Regular Search
                </button>
                <button
                  onClick={() => setSearchParams(prev => ({ ...prev, search_type: 'sales_navigator' }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchParams.search_type === 'sales_navigator'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sales Navigator
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Filter size={16} />
                  Filters
                </button>
              </div>

              {/* Basic Search */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    name="keywords"
                    value={searchParams.keywords || ''}
                    onChange={handleInputChange}
                    placeholder="Enter keywords (e.g., 'marketing manager', 'CEO', 'startup founder')"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  Search
                </button>
              </div>

              {/* URL Search */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="url"
                    placeholder="Or paste LinkedIn search URL here"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleURLSearch(e.currentTarget.value);
                      }
                    }}
                  />
                </div>
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleURLSearch(input.value);
                  }}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Import from URL
                </button>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    <select
                      name="location"
                      value={searchParams.location || ''}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Location</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                    <select
                      name="industry"
                      value={searchParams.industry || ''}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                    </select>
                    <select
                      name="company_size"
                      value={searchParams.company_size || ''}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Company Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                    </select>
                    <select
                      name="seniority_level"
                      value={searchParams.seniority_level || ''}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seniority</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {leads.length > 0 && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLeads.size === leads.length && leads.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Select All ({selectedLeads.size} selected)
                      </span>
                    </label>
                    <span className="text-sm text-gray-600">
                      {totalResults} total results
                    </span>
                  </div>
                  <button
                    onClick={handleImportSelected}
                    disabled={selectedLeads.size === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Import Selected ({selectedLeads.size})
                  </button>
                </div>
              </div>
            )}

            {/* Leads List */}
            <div className="flex-1 overflow-y-auto">
              {leads.length === 0 && !loading && (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No leads found. Try searching with different keywords.</p>
                  </div>
                </div>
              )}

              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'N/A'}
                          </h3>
                          {lead.headline && (
                            <p className="text-sm text-gray-600 mt-1">{lead.headline}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            {lead.organization?.name && (
                              <span>{lead.organization.name}</span>
                            )}
                            {lead.city && lead.country && (
                              <span>{lead.city}, {lead.country}</span>
                            )}
                            {lead.industry && (
                              <span>{lead.industry}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {lead.linkedin_url && (
                            <a
                              href={lead.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View LinkedIn Profile"
                            >
                              <Linkedin size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="p-4 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LinkedInLeadSearch;
