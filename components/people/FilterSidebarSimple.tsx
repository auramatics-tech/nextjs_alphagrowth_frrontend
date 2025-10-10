'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, Search, Save, RotateCcw, X, Filter } from 'lucide-react';

// Filter configuration matching frontend_old exactly
const FILTER_CONFIGS = {
  jobTitles: {
    key: 'selectedJobs',
    apiKey: 'person_titles',
    label: 'Job Title',
    options: [
      'CEO', 'CTO', 'CFO', 'COO', 'CMO',
      'VP of Sales', 'VP of Marketing', 'VP of Engineering',
      'Sales Manager', 'Marketing Manager', 'Engineering Manager',
      'Sales Director', 'Marketing Director', 'Engineering Director',
      'Software Engineer', 'Senior Software Engineer', 'Lead Engineer',
      'Product Manager', 'Senior Product Manager',
      'Business Development', 'Account Executive', 'Account Manager',
      'Head of Sales', 'Head of Marketing', 'Head of Engineering',
      'Founder', 'Co-Founder', 'President', 'Owner'
    ]
  },
  countries: {
    key: 'selectedcountry',
    apiKey: 'person_locations',
    label: 'Country',
    options: [
      'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
      'India', 'Australia', 'Spain', 'Italy', 'Netherlands',
      'Sweden', 'Brazil', 'Mexico', 'Japan', 'China',
      'Singapore', 'Switzerland', 'Ireland', 'Denmark', 'Norway'
    ]
  },
  regions: {
    key: 'selectedregion',
    apiKey: 'organization_locations',
    label: 'Region',
    options: [
      'North America', 'Europe', 'Asia Pacific', 'South America',
      'Middle East', 'Africa', 'Caribbean', 'Central America',
      'Eastern Europe', 'Western Europe', 'Southeast Asia', 'East Asia'
    ]
  },
  departments: {
    key: 'selecteddepartment',
    apiKey: 'q_organization_job_titles',
    label: 'Department',
    options: [
      'Engineering', 'Sales', 'Marketing', 'Human Resources',
      'Finance', 'Operations', 'Customer Success', 'Product',
      'Business Development', 'IT', 'Legal', 'Executive'
    ]
  },
  positions: {
    key: 'selectedposition',
    apiKey: 'positions',
    label: 'Position',
    options: [
      'Manager', 'Director', 'Senior', 'Lead', 'Principal',
      'Vice President', 'C-Level', 'Entry Level', 'Mid Level'
    ]
  },
  seniority: {
    key: 'selectedseniority',
    apiKey: 'person_seniorities',
    label: 'Seniority',
    options: [
      'Entry', 'Junior', 'Mid', 'Senior', 'Manager',
      'Director', 'VP', 'C-Level', 'Owner', 'Partner'
    ]
  }
};

interface FilterSidebarSimpleProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  filters: Record<string, string[]>;
  onFilterChange: (filterKey: string, values: string[]) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

// FilterDropdown Component
const FilterDropdown = ({ 
  config, 
  filterKey, 
  selectedItems, 
  onAdd, 
  onRemove, 
  isVisible, 
  showOptions, 
  onToggleOptions,
  searchTerm,
  onSearchChange,
  dropdownRef 
}: any) => {
  
  const filteredOptions = config.options.filter((option: string) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isVisible) return null;

  return (
    <div className='relative'>
      {/* Filter Tag - Click to expand options */}
      <div 
        onClick={onToggleOptions}
        className="mt-1 px-3 py-2 bg-gray-50 border border-blue-500 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:-translate-y-0.5 shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-blue-600">
            {selectedItems.length > 0 ? `${selectedItems.length} selected` : `Select ${config.label.toLowerCase()}`}
          </span>
          {selectedItems.length > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {selectedItems.length}
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-blue-600 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
      </div>

      {/* Options Dropdown */}
      {showOptions && (
        <div 
          ref={dropdownRef}
          className="mt-1.5 bg-white border border-blue-500 rounded-lg p-3 shadow-lg relative z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h6 className="text-sm font-semibold text-blue-600 mb-0">
              {config.label} Options
            </h6>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
              {filteredOptions.length} available
            </span>
          </div>

          {/* Search Input */}
          <div className="flex items-center mb-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50">
            <Search size={14} className="text-gray-400 mr-2" />
            <input
              type='search'
              placeholder={`Search ${config.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  onAdd(searchTerm.trim());
                  onSearchChange('');
                }
              }}
              className="flex-1 text-sm bg-transparent border-none outline-none"
            />
          </div>

          {/* Options List */}
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option: string, index: number) => {
                const isSelected = selectedItems.includes(option);
                return (
                  <div 
                    key={index} 
                    onClick={() => onAdd(option)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-all text-sm ${
                      index < filteredOptions.length - 1 ? 'border-b border-gray-200' : ''
                    } ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className={`${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {option}
                    </span>
                    {isSelected && (
                      <span className="text-blue-700 font-bold text-lg">✓</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No options found for &quot;{searchTerm}&quot;
              </div>
            )}
          </div>

          {/* Selected Items Tags */}
          {selectedItems.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <span className="text-xs text-gray-600 font-medium">
                  Selected ({selectedItems.length}):
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedItems.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    {item}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item);
                      }}
                      className="hover:opacity-80 font-bold text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FilterSidebarSimple: React.FC<FilterSidebarSimpleProps> = ({
  isCollapsed,
  onToggleCollapse,
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters
}) => {
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({});
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const dropdownRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  // Initialize refs
  useEffect(() => {
    Object.keys(FILTER_CONFIGS).forEach(key => {
      dropdownRefs.current[key] = React.createRef();
    });
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        const ref = dropdownRefs.current[key];
        if (ref.current && !ref.current.contains(event.target as Node)) {
          closeDropdown(key, 'Options');
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (filterKey: string, stateType: string) => {
    const key = `${filterKey}${stateType}`;
    setDropdownStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const closeDropdown = (filterKey: string, stateType: string) => {
    const key = `${filterKey}${stateType}`;
    setDropdownStates(prev => ({ ...prev, [key]: false }));
  };

  const handleFilterAdd = (filterKey: string, item: string) => {
    const config = FILTER_CONFIGS[filterKey as keyof typeof FILTER_CONFIGS];
    const currentValues = filters[config.key] || [];
    
    if (!currentValues.includes(item)) {
      onFilterChange(config.key, [...currentValues, item]);
    }
  };

  const handleFilterRemove = (filterKey: string, item: string) => {
    const config = FILTER_CONFIGS[filterKey as keyof typeof FILTER_CONFIGS];
    const currentValues = filters[config.key] || [];
    onFilterChange(config.key, currentValues.filter((v: string) => v !== item));
  };

  const handleSearchTermChange = (filterKey: string, term: string) => {
    setSearchTerms(prev => ({ ...prev, [filterKey]: term }));
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
        <div className="mt-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Filter size={16} className="text-gray-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-0">
          <h2 className="text-lg font-semibold text-gray-900">🔍 Filters</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              title="Reset filters"
            >
              <RotateCcw size={16} className="text-gray-600" />
            </button>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Body */}
      <div className="flex-1 overflow-y-auto p-3 bg-white">
        {/* Not in campaign filter */}
        <div className="flex items-center justify-between p-3 mb-2 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-2 w-3.5 h-3.5"
            />
            <span className="text-sm font-medium text-gray-700">
              Not in campaign
            </span>
          </div>
        </div>

        {/* Dynamic Filter Bars */}
        {Object.keys(FILTER_CONFIGS).map(filterKey => {
          const config = FILTER_CONFIGS[filterKey as keyof typeof FILTER_CONFIGS];
          const isVisible = dropdownStates[`${filterKey}Visible`];
          const showOptions = dropdownStates[`${filterKey}Options`];
          const selectedItems = filters[config.key] || [];

          return (
            <div key={filterKey} className="mb-2">
              {/* Filter Title Bar */}
              <div 
                onClick={() => !isVisible ? toggleDropdown(filterKey, 'Visible') : undefined}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  selectedItems.length > 0 
                    ? 'bg-blue-50 border border-blue-500' 
                    : 'bg-gray-50 border border-gray-200'
                } hover:shadow-sm`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    selectedItems.length > 0 ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {config.label}
                  </span>
                  {selectedItems.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {selectedItems.length}
                    </span>
                  )}
                </div>

                <div>
                  {!isVisible ? (
                    <ChevronDown size={12} className="text-gray-500" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(filterKey, 'Visible');
                        closeDropdown(filterKey, 'Options');
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Dropdown */}
              <FilterDropdown
                config={config}
                filterKey={filterKey}
                selectedItems={selectedItems}
                onAdd={(item: string) => handleFilterAdd(filterKey, item)}
                onRemove={(item: string) => handleFilterRemove(filterKey, item)}
                isVisible={isVisible}
                showOptions={showOptions}
                onToggleOptions={() => toggleDropdown(filterKey, 'Options')}
                searchTerm={searchTerms[filterKey] || ''}
                onSearchChange={(term: string) => handleSearchTermChange(filterKey, term)}
                dropdownRef={dropdownRefs.current[filterKey]}
              />
            </div>
          );
        })}

        {/* Apply Filters Button */}
        <div className="mt-4 text-center px-1">
          <button
            onClick={onApplyFilters}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebarSimple;
export { FILTER_CONFIGS };

