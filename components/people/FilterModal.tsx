'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Plus } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterOption: {
    id: string;
    label: string;
    type: 'text' | 'select' | 'range' | 'boolean';
    options?: string[];
  } | null;
  onApplyFilter: (filterId: string, value: string, operator: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filterOption,
  onApplyFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [operator, setOperator] = useState('contains');
  const [customValue, setCustomValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  // Mock data for different filter types
  const mockData: { [key: string]: string[] } = {
    'current_job_title': [
      'Software Engineer', 'Product Manager', 'Data Scientist', 'Marketing Manager',
      'Sales Director', 'UX Designer', 'DevOps Engineer', 'Business Analyst',
      'Project Manager', 'HR Manager', 'Finance Director', 'Operations Manager',
      'CEO', 'CTO', 'CFO', 'VP of Sales', 'VP of Marketing', 'VP of Engineering',
      'Senior Software Engineer', 'Lead Developer', 'Technical Lead', 'Architect',
      'Scrum Master', 'Agile Coach', 'Product Owner', 'Growth Manager',
      'Content Manager', 'Social Media Manager', 'Digital Marketing Manager'
    ],
    'country': [
      'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
      'Germany', 'France', 'Japan', 'Singapore', 'Brazil', 'Mexico', 'Spain',
      'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
      'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Poland',
      'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia',
      'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Malta', 'Cyprus',
      'Luxembourg', 'Iceland', 'Liechtenstein', 'Monaco', 'San Marino',
      'Vatican City', 'Andorra', 'South Korea', 'China', 'Taiwan', 'Hong Kong',
      'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'Philippines', 'New Zealand',
      'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Tunisia',
      'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Uruguay',
      'Paraguay', 'Bolivia', 'Ecuador', 'Guyana', 'Suriname', 'French Guiana'
    ],
    'company_size': [
      '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+'
    ],
    'industry': [
      'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education',
      'Retail', 'Real Estate', 'Consulting', 'Media', 'Transportation',
      'Energy', 'Automotive', 'Aerospace', 'Telecommunications', 'Pharmaceuticals',
      'Food & Beverage', 'Fashion', 'Entertainment', 'Sports', 'Travel & Tourism',
      'Insurance', 'Banking', 'Investment', 'Venture Capital', 'Private Equity'
    ],
    'department': [
      'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations',
      'Product', 'Design', 'Customer Success', 'Legal', 'IT', 'Security',
      'Quality Assurance', 'Research & Development', 'Business Development',
      'Partnerships', 'Strategy', 'Analytics', 'Data Science', 'Machine Learning'
    ],
    'seniority': [
      'Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'C-Level'
    ],
    'company_industry': [
      'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education',
      'Retail', 'Real Estate', 'Consulting', 'Media', 'Transportation',
      'Energy', 'Automotive', 'Aerospace', 'Telecommunications', 'Pharmaceuticals',
      'Food & Beverage', 'Fashion', 'Entertainment', 'Sports', 'Travel & Tourism'
    ],
    'region': [
      'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania',
      'Middle East', 'Central America', 'Caribbean', 'Eastern Europe',
      'Western Europe', 'Northern Europe', 'Southern Europe', 'Southeast Asia',
      'East Asia', 'South Asia', 'West Asia', 'Sub-Saharan Africa'
    ],
    'company_type': [
      'Public', 'Private', 'Startup', 'Non-profit', 'Government', 'Agency',
      'Consulting', 'Partnership', 'LLC', 'Corporation', 'Sole Proprietorship'
    ],
    'company_market': [
      'B2B', 'B2C', 'Enterprise', 'SMB', 'Mid-Market', 'Startup', 'Government',
      'Non-profit', 'Education', 'Healthcare', 'Financial Services'
    ]
  };

  useEffect(() => {
    if (filterOption && filterOption.options) {
      setFilteredOptions(filterOption.options);
    } else if (filterOption && mockData[filterOption.id]) {
      setFilteredOptions(mockData[filterOption.id]);
    } else {
      setFilteredOptions([]);
    }
  }, [filterOption]);

  useEffect(() => {
    if (filterOption) {
      const options = filterOption.options || mockData[filterOption.id] || [];
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, filterOption]);

  const handleApplyFilter = () => {
    if (!filterOption) return;

    let value = '';
    if (filterOption.type === 'boolean') {
      value = selectedValue || 'Yes';
    } else if (filterOption.type === 'text') {
      value = customValue || selectedValue;
    } else {
      value = selectedValue;
    }

    if (value) {
      onApplyFilter(filterOption.id, value, operator);
      onClose();
    }
  };

  const getOperatorOptions = () => {
    switch (filterOption?.type) {
      case 'text':
        return [
          { value: 'contains', label: 'Contains' },
          { value: 'equals', label: 'Equals' },
          { value: 'starts_with', label: 'Starts with' },
          { value: 'ends_with', label: 'Ends with' }
        ];
      case 'select':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Not equals' }
        ];
      case 'range':
        return [
          { value: 'greater_than', label: 'Greater than' },
          { value: 'less_than', label: 'Less than' },
          { value: 'between', label: 'Between' }
        ];
      case 'boolean':
        return [
          { value: 'equals', label: 'Is' }
        ];
      default:
        return [{ value: 'contains', label: 'Contains' }];
    }
  };

  if (!isOpen || !filterOption) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <style jsx>{`
          .filter-options-list {
            max-height: 12rem;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #d1d5db #f9fafb;
          }
          .filter-options-list::-webkit-scrollbar {
            width: 6px;
          }
          .filter-options-list::-webkit-scrollbar-track {
            background: #f9fafb;
            border-radius: 3px;
          }
          .filter-options-list::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
            border-radius: 3px;
          }
          .filter-options-list::-webkit-scrollbar-thumb:hover {
            background-color: #9ca3af;
          }
        `}</style>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-96 max-h-[28rem] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter by {filterOption.label}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Operator Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {getOperatorOptions().map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            {filterOption.type !== 'boolean' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search {filterOption.label.toLowerCase()}
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${filterOption.label.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Value Selection */}
            {filterOption.type === 'boolean' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="booleanValue"
                      value="Yes"
                      checked={selectedValue === 'Yes'}
                      onChange={(e) => setSelectedValue(e.target.value)}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="booleanValue"
                      value="No"
                      checked={selectedValue === 'No'}
                      onChange={(e) => setSelectedValue(e.target.value)}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            ) : filterOption.type === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${filterOption.label.toLowerCase()}...`}
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Value
                </label>
                <div className="filter-options-list border border-gray-200 rounded-lg">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedValue(option)}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between ${
                          selectedValue === option ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-sm">{option}</span>
                        {selectedValue === option && (
                          <Check size={16} className="text-orange-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">
                      No options found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilter}
              disabled={!selectedValue && !customValue}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={16} />
              Apply Filter
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterModal;