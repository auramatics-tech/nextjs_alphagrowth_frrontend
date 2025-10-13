'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  Search,
  Download,
  Plus,
  Globe,
  Target,
  Users,
  Package,
  ExternalLink,
  MoreVertical,
  Star,
  StarOff,
  Calendar,
  Sparkles,
  GitBranch,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { businessService } from '../../../services/businessService';

// Types matching Business schema from backend
type BusinessType = 'B2B' | 'B2C' | 'BOTH';

interface Business {
  id: string;
  userId: string;
  companyName: string;
  websiteUrl: string;
  summary: string | null;
  industry: string | null;
  valueProposition: string | null;
  businessType: BusinessType;
  createdAt: Date;
  // Related counts
  gtmStrategiesCount: number;
  icpsCount: number;
  productsServicesCount: number;
  isFavorite?: boolean;
}

// Static business data removed - now using API data
// You can still use this for testing if API is unavailable

export default function CompaniesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterBusinessType, setFilterBusinessType] = useState<'all' | BusinessType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch businesses from API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage (stored during login/signup)
        const token = typeof window !== 'undefined' ? localStorage.getItem('_token') : null;
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }

        // The API will use the token from the request interceptor to identify the user
        // We don't need to pass userId explicitly - the backend extracts it from the token
        const response = await businessService.getBusinessInfo({ 
          business_id: '' // Empty string to get all businesses for the authenticated user
        });

        console.log('Businesses response:', response);

        // Transform the data to match our interface
        const transformedData: Business[] = (response.businesses || []).map((business: any) => ({
          id: business.id,
          userId: business.userId,
          companyName: business.companyName,
          websiteUrl: business.websiteUrl,
          summary: business.summary,
          industry: business.industry,
          valueProposition: business.valueProposition,
          businessType: business.businessType,
          createdAt: new Date(business.createdAt),
          gtmStrategiesCount: business.GTMStrategy?.length || 0,
          icpsCount: business.icps?.length || 0,
          productsServicesCount: business.keyProductsOrServices?.length || 0,
          isFavorite: false // Can be extended later with user preferences
        }));

        setBusinesses(transformedData);
      } catch (err: any) {
        console.error('Error fetching businesses:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch businesses');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Get unique industries (filter out null/undefined)
  const industries = ['all', ...Array.from(new Set(businesses.map(b => b.industry).filter((industry): industry is string => Boolean(industry))))];

  // Filter businesses
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || business.industry === filterIndustry;
    const matchesType = filterBusinessType === 'all' || business.businessType === filterBusinessType;
    
    return matchesSearch && matchesIndustry && matchesType;
  });

  const handleSelectAll = () => {
    if (selectedBusinesses.length === filteredBusinesses.length) {
      setSelectedBusinesses([]);
    } else {
      setSelectedBusinesses(filteredBusinesses.map(b => b.id));
    }
  };

  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinesses(prev =>
      prev.includes(businessId)
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    );
  };

  const toggleFavorite = (businessId: string) => {
    setBusinesses(prev =>
      prev.map(business =>
        business.id === businessId
          ? { ...business, isFavorite: !business.isFavorite }
          : business
      )
    );
  };

  const getBusinessTypeBadge = (type: BusinessType) => {
    const colors = {
      B2B: 'bg-blue-100 text-blue-700',
      B2C: 'bg-purple-100 text-purple-700',
      BOTH: 'bg-orange-100 text-orange-700'
    };
    return colors[type];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                <Building size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
                <p className="text-sm text-gray-500">Manage your business profiles</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading businesses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                <Building size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
                <p className="text-sm text-gray-500">Manage your business profiles</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Businesses</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                <Building size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
                <p className="text-sm text-gray-500">Manage your business profiles</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
              <button 
                onClick={() => window.location.href = '/onboarding/business-profile'}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} />
                Add Business
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Industry Filter */}
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>

            {/* Business Type Filter */}
            <select
              value={filterBusinessType}
              onChange={(e) => setFilterBusinessType(e.target.value as 'all' | BusinessType)}
              className="h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
              <option value="BOTH">B2B & B2C</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                List
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total Businesses:</span>
              <span className="font-semibold text-gray-900">{filteredBusinesses.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Selected:</span>
              <span className="font-semibold text-orange-600">{selectedBusinesses.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total GTM Strategies:</span>
              <span className="font-semibold text-gray-900">
                {filteredBusinesses.reduce((sum, b) => sum + b.gtmStrategiesCount, 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total ICPs:</span>
              <span className="font-semibold text-gray-900">
                {filteredBusinesses.reduce((sum, b) => sum + b.icpsCount, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <input
                      type="checkbox"
                      checked={selectedBusinesses.includes(business.id)}
                      onChange={() => handleSelectBusiness(business.id)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(business.id)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {business.isFavorite ? (
                          <Star size={18} className="fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff size={18} />
                        )}
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Business Name and Logo */}
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{business.companyName}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{business.industry}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBusinessTypeBadge(business.businessType)}`}>
                        {business.businessType}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  {business.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2">{business.summary}</p>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 text-sm bg-gray-50">
                  {/* Value Proposition */}
                  {business.valueProposition && (
                    <div className="flex items-start gap-2">
                      <Sparkles size={14} className="flex-shrink-0 mt-0.5 text-orange-500" />
                      <p className="text-xs text-gray-700 line-clamp-2 italic">{business.valueProposition}</p>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <GitBranch size={14} className="text-blue-500" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{business.gtmStrategiesCount}</div>
                      <div className="text-xs text-gray-500">GTM Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target size={14} className="text-purple-500" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{business.icpsCount}</div>
                      <div className="text-xs text-gray-500">ICPs</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Package size={14} className="text-green-500" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{business.productsServicesCount}</div>
                      <div className="text-xs text-gray-500">Products</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={business.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Globe size={14} />
                    Website
                  </a>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{formatDate(business.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedBusinesses.length === filteredBusinesses.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Business</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Industry</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Value Proposition</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">GTM Goals</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ICPs</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Products</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBusinesses.map((business) => (
                  <motion.tr
                    key={business.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBusinesses.includes(business.id)}
                        onChange={() => handleSelectBusiness(business.id)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {business.companyName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{business.companyName}</div>
                          <a
                            href={business.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Globe size={12} />
                            {business.websiteUrl.replace('https://', '').replace('http://', '')}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{business.industry}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getBusinessTypeBadge(business.businessType)}`}>
                        {business.businessType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <div className="line-clamp-2">{business.valueProposition}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <GitBranch size={14} className="text-blue-500" />
                        <span className="font-semibold text-gray-900">{business.gtmStrategiesCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target size={14} className="text-purple-500" />
                        <span className="font-semibold text-gray-900">{business.icpsCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Package size={14} className="text-green-500" />
                        <span className="font-semibold text-gray-900">{business.productsServicesCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(business.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(business.id)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          {business.isFavorite ? (
                            <Star size={16} className="fill-yellow-500 text-yellow-500" />
                          ) : (
                            <StarOff size={16} />
                          )}
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Building size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

