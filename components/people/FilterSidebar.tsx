'use client';

import React, { useState } from 'react';
import {
  ChevronDown, ChevronRight, Search, Save, RotateCcw, Plus, X,
  Filter, Building, User, MapPin, Briefcase, Globe, Phone, Mail,
  Linkedin, Calendar, Users, Target, DollarSign, TrendingUp,
  FileText, Hash, Clock, Award, GraduationCap, Building2
} from 'lucide-react';
import FilterModal from './FilterModal';

interface FilterOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  type: 'text' | 'select' | 'range' | 'boolean';
  options?: string[];
}

interface FilterCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  options: FilterOption[];
  isExpanded?: boolean;
}

interface ActiveFilter {
  id: string;
  category: string;
  label: string;
  value: string;
}

interface FilterSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (filterId: string) => void;
  onAddFilter: (category: string, option: FilterOption, value: string) => void;
  onSaveFilters: () => void;
  onResetFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeFilters,
  onRemoveFilter,
  onAddFilter,
  onSaveFilters,
  onResetFilters
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['general']));
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilterOption, setSelectedFilterOption] = useState<FilterOption | null>(null);

  const filterCategories: FilterCategory[] = [
    {
      id: 'general',
      label: 'General',
      icon: Filter,
      options: [
        { id: 'not_in_campaign', label: 'Not already in a campaign', icon: Target, type: 'boolean' },
        { id: 'current_job_title', label: 'Current job title', icon: Briefcase, type: 'text' },
        { id: 'country', label: 'Country', icon: MapPin, type: 'select', options: ['India', 'USA', 'UK', 'Canada', 'Australia'] },
        { id: 'region', label: 'Region', icon: MapPin, type: 'select', options: ['North America', 'Europe', 'Asia', 'South America', 'Africa'] },
        { id: 'keyword_profile', label: 'Keyword in profile', icon: Search, type: 'text' },
        { id: 'department', label: 'Department', icon: Building, type: 'select', options: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'] },
        { id: 'position_tenure', label: 'Current position tenure', icon: Clock, type: 'range' },
        { id: 'seniority', label: 'Seniority', icon: Award, type: 'select', options: ['Entry', 'Mid', 'Senior', 'Executive', 'C-Level'] },
        { id: 'years_experience', label: 'Years of experience', icon: GraduationCap, type: 'range' },
        { id: 'connections', label: 'Number of connections', icon: Users, type: 'range' },
        { id: 'past_job_title', label: 'Past job title', icon: Briefcase, type: 'text' }
      ]
    },
    {
      id: 'company',
      label: 'Company Information',
      icon: Building2,
      options: [
        { id: 'company_size', label: 'Company size', icon: Users, type: 'select', options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+'] },
        { id: 'company_industry', label: 'Company industry', icon: Building, type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education', 'Retail'] },
        { id: 'company_market', label: 'Company market', icon: Globe, type: 'select', options: ['B2B', 'B2C', 'Enterprise', 'SMB'] },
        { id: 'company_type', label: 'Company type', icon: Building, type: 'select', options: ['Public', 'Private', 'Startup', 'Non-profit'] },
        { id: 'company_name', label: 'Company name', icon: Building, type: 'text' },
        { id: 'company_founded', label: 'Company founded year', icon: Calendar, type: 'range' },
        { id: 'company_country', label: 'Company country', icon: MapPin, type: 'select', options: ['India', 'USA', 'UK', 'Canada', 'Australia'] },
        { id: 'company_region', label: 'Company region', icon: MapPin, type: 'select', options: ['North America', 'Europe', 'Asia', 'South America', 'Africa'] },
        { id: 'company_city', label: 'Company city / state', icon: MapPin, type: 'text' },
        { id: 'company_linkedin', label: 'Company LinkedIn URL', icon: Linkedin, type: 'text' },
        { id: 'company_website', label: 'Company Website URL', icon: Globe, type: 'text' }
      ]
    },
    {
      id: 'signals',
      label: 'Signals & Intents',
      icon: TrendingUp,
      options: [
        { id: 'company_growth', label: 'Company size growth (3m.)', icon: TrendingUp, type: 'range' },
        { id: 'funding_date', label: 'Company last funding date', icon: Calendar, type: 'range' },
        { id: 'company_revenue', label: 'Company revenue', icon: DollarSign, type: 'range' },
        { id: 'company_keyword', label: 'Keyword in company', icon: Search, type: 'text' }
      ]
    },
    {
      id: 'contact',
      label: 'Contact Information',
      icon: User,
      options: [
        { id: 'email_domain', label: 'Email domain', icon: Mail, type: 'select', options: ['gmail.com', 'yahoo.com', 'company.com', 'outlook.com'] },
        { id: 'phone_country', label: 'Phone country code', icon: Phone, type: 'select', options: ['+1', '+91', '+44', '+61', '+33'] },
        { id: 'linkedin_url', label: 'LinkedIn URL', icon: Linkedin, type: 'text' },
        { id: 'twitter', label: 'Twitter', icon: Hash, type: 'text' },
        { id: 'personal_email', label: 'Personal email', icon: Mail, type: 'boolean' },
        { id: 'business_email', label: 'Business email', icon: Mail, type: 'boolean' }
      ]
    },
    {
      id: 'lemlist',
      label: 'lemlist Contacts',
      icon: FileText,
      options: [
        { id: 'company_lists', label: 'Company lists', icon: Building, type: 'select', options: ['List 1', 'List 2', 'List 3'] },
        { id: 'contact_lists', label: 'Contact lists', icon: User, type: 'select', options: ['List A', 'List B', 'List C'] },
        { id: 'not_in_contacts', label: 'Not already in All contacts', icon: User, type: 'boolean' }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = filterCategories.filter(category =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.options.some(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddFilter = (category: FilterCategory, option: FilterOption) => {
    setSelectedFilterOption(option);
    setIsFilterModalOpen(true);
  };

  const handleApplyFilter = (filterId: string, value: string, operator: string) => {
    if (selectedFilterOption) {
      const category = filterCategories.find(cat => 
        cat.options.some(opt => opt.id === filterId)
      );
      if (category) {
        onAddFilter(category.id, selectedFilterOption, value);
      }
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 h-screen">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Expand filters"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
        <div className="mt-4 space-y-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Filter size={16} className="text-gray-600" />
          </div>
          {activeFilters.length > 0 && (
            <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {activeFilters.length}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onSaveFilters}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Save filters"
            >
              <Save size={16} className="text-gray-600" />
            </button>
            <button
              onClick={onResetFilters}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Reset filters"
            >
              <RotateCcw size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm"
              >
                <span>{filter.label}: {filter.value}</span>
                <button
                  onClick={() => onRemoveFilter(filter.id)}
                  className="hover:bg-blue-100 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Categories */}
      <div className="flex-1 overflow-y-auto px-0 py-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const activeCount = activeFilters.filter(f => f.category === category.id).length;
          
          return (
            <div key={category.id} className="border-b border-gray-100">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <category.icon size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{category.label}</span>
                  {activeCount > 0 && (
                    <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {activeCount}
                    </div>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="pb-2">
                  {category.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAddFilter(category, option)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <option.icon size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                      <Plus size={14} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Collapse Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
        >
          <ChevronRight size={16} />
          Collapse Filter
        </button>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterOption={selectedFilterOption}
        onApplyFilter={handleApplyFilter}
      />
    </div>
  );
};

export default FilterSidebar;