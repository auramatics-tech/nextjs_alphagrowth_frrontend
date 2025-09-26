'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, User, Mail, Building, Phone, MapPin, X } from 'lucide-react';

interface FieldMappingProps {
  file: File;
  previewData: any[];
  onFieldMapping: (mappings: Record<string, string>) => void;
  currentMappings: Record<string, string>;
}

interface DatabaseField {
  id: string;
  label: string;
  required: boolean;
  icon: React.ComponentType<any>;
  description: string;
}

export default function FieldMapping({ 
  file, 
  previewData, 
  onFieldMapping, 
  currentMappings 
}: FieldMappingProps) {
  const [mappings, setMappings] = useState<Record<string, string>>(currentMappings);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({});
  const [removeHeader, setRemoveHeader] = useState(false);

  const databaseFields: DatabaseField[] = [
    {
      id: 'excluded',
      label: 'Excluded',
      required: false,
      icon: X,
      description: 'Mark contact as excluded'
    },
    {
      id: 'first_name',
      label: 'First Name',
      required: false,
      icon: User,
      description: 'Contact first name'
    },
    {
      id: 'last_name',
      label: 'Last Name',
      required: false,
      icon: User,
      description: 'Contact last name'
    },
    {
      id: 'company_name',
      label: 'Company Name',
      required: false,
      icon: Building,
      description: 'Company or organization name'
    },
    {
      id: 'company_website',
      label: 'Company Website',
      required: false,
      icon: Building,
      description: 'Company website URL'
    },
    {
      id: 'phone',
      label: 'Phone',
      required: false,
      icon: Phone,
      description: 'Contact phone number'
    },
    {
      id: 'business_email',
      label: 'Business Email',
      required: false,
      icon: Mail,
      description: 'Business email address'
    },
    {
      id: 'personal_email',
      label: 'Personal Email',
      required: false,
      icon: Mail,
      description: 'Personal email address'
    },
    {
      id: 'linkedin_url',
      label: 'LinkedIn URL',
      required: false,
      icon: User,
      description: 'LinkedIn profile URL'
    },
    {
      id: 'gender',
      label: 'Gender',
      required: false,
      icon: User,
      description: 'Contact gender'
    },
    {
      id: 'job_title',
      label: 'Job Title',
      required: false,
      icon: Building,
      description: 'Professional title or role'
    },
    {
      id: 'twitter',
      label: 'Twitter',
      required: false,
      icon: User,
      description: 'Twitter handle or URL'
    },
    {
      id: 'location',
      label: 'Location',
      required: false,
      icon: MapPin,
      description: 'City, state, or country'
    },
    {
      id: 'industry',
      label: 'Industry',
      required: false,
      icon: Building,
      description: 'Industry or sector'
    },
    {
      id: 'profile_picture',
      label: 'Profile Picture',
      required: false,
      icon: User,
      description: 'Profile picture URL'
    },
    {
      id: 'short_bio',
      label: 'Short Bio',
      required: false,
      icon: User,
      description: 'Brief biography or description'
    },
    {
      id: 'crm_id',
      label: 'CRM Id',
      required: false,
      icon: Building,
      description: 'CRM system identifier'
    },
    {
      id: 'custom_att_1',
      label: 'Custom Att 1',
      required: false,
      icon: User,
      description: 'Custom attribute 1'
    },
    {
      id: 'custom_att_2',
      label: 'Custom Att 2',
      required: false,
      icon: User,
      description: 'Custom attribute 2'
    },
    {
      id: 'custom_att_3',
      label: 'Custom Att 3',
      required: false,
      icon: User,
      description: 'Custom attribute 3'
    },
    {
      id: 'custom_att_4',
      label: 'Custom Att 4',
      required: false,
      icon: User,
      description: 'Custom attribute 4'
    },
    {
      id: 'custom_att_5',
      label: 'Custom Att 5',
      required: false,
      icon: User,
      description: 'Custom attribute 5'
    },
    {
      id: 'custom_att_6',
      label: 'Custom Att 6',
      required: false,
      icon: User,
      description: 'Custom attribute 6'
    },
    {
      id: 'custom_att_7',
      label: 'Custom Att 7',
      required: false,
      icon: User,
      description: 'Custom attribute 7'
    },
    {
      id: 'custom_att_8',
      label: 'Custom Att 8',
      required: false,
      icon: User,
      description: 'Custom attribute 8'
    },
    {
      id: 'custom_att_9',
      label: 'Custom Att 9',
      required: false,
      icon: User,
      description: 'Custom attribute 9'
    },
    {
      id: 'custom_att_10',
      label: 'Custom Att 10',
      required: false,
      icon: User,
      description: 'Custom attribute 10'
    }
  ];

  useEffect(() => {
    if (previewData.length > 0) {
      const headers = Object.keys(previewData[0]);
      setCsvHeaders(headers);
      
      // Initialize all columns as selected
      const initialSelection: Record<string, boolean> = {};
      headers.forEach(header => {
        initialSelection[header] = true;
      });
      setSelectedColumns(initialSelection);
    }
  }, [previewData]);

  useEffect(() => {
    onFieldMapping(mappings);
  }, [mappings, onFieldMapping]);

  const handleMappingChange = (csvField: string, dbField: string) => {
    setMappings(prev => {
      const newMappings = { ...prev };
      
      // Remove any existing mapping for this database field
      Object.keys(newMappings).forEach(key => {
        if (newMappings[key] === dbField) {
          delete newMappings[key];
        }
      });
      
      // Add new mapping
      if (dbField) {
        newMappings[csvField] = dbField;
      } else {
        delete newMappings[csvField];
      }
      
      return newMappings;
    });
  };

  const handleColumnSelection = (csvField: string, selected: boolean) => {
    setSelectedColumns(prev => ({
      ...prev,
      [csvField]: selected
    }));
    
    // Remove mapping if column is deselected
    if (!selected) {
      setMappings(prev => {
        const newMappings = { ...prev };
        delete newMappings[csvField];
        return newMappings;
      });
    }
  };

  const handleSelectAll = (selectAll: boolean) => {
    const newSelection: Record<string, boolean> = {};
    csvHeaders.forEach(header => {
      newSelection[header] = selectAll;
    });
    setSelectedColumns(newSelection);
    
    if (!selectAll) {
      setMappings({});
    }
  };

  const getUnmatchedColumns = () => {
    return csvHeaders.filter(header => 
      selectedColumns[header] && !mappings[header]
    );
  };

  const getPreviewData = (csvField: string, maxLength: number = 50) => {
    const data = previewData.map(row => row[csvField]).filter(Boolean);
    const preview = data.slice(0, 8).join(', ');
    return preview.length > maxLength ? preview.substring(0, maxLength) + '...' : preview;
  };


  const unmatchedColumns = getUnmatchedColumns();
  const allSelected = Object.values(selectedColumns).every(Boolean);
  const usedFields = Object.values(mappings);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Column matching</h3>
        <p className="text-gray-600">
          Your file must be in CSV format and encoded in UTF-8.{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800">Learn more</a>
        </p>
      </div>

      {/* Unmatched Columns Warning */}
      {unmatchedColumns.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle size={20} className="text-orange-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-900 mb-2">
                {unmatchedColumns.length} unmatched columns
              </h4>
              <p className="text-sm text-orange-800 mb-2">
                Exclude the columns you don&apos;t want to import by unchecking the corresponding rows, 
                or select an option from the list to match your columns with the possible values.
              </p>
              <button 
                onClick={() => handleSelectAll(false)}
                className="text-sm text-orange-700 hover:text-orange-900 underline"
              >
                Exclude all unmatched columns
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Select all ({csvHeaders.length})
            </span>
          </label>
        </div>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={removeHeader}
            onChange={(e) => setRemoveHeader(e.target.checked)}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700">Remove column header</span>
        </label>
      </div>

      {/* Column Mapping List - Compact Table Style */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
            </div>
            <div className="col-span-4">CSV Column</div>
            <div className="col-span-1"></div>
            <div className="col-span-5">Map to Field</div>
            <div className="col-span-1">Preview</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {csvHeaders.map((csvField, index) => {
            const isSelected = selectedColumns[csvField];
            const mappedField = mappings[csvField];
            const isUnmatched = isSelected && !mappedField;
            const fieldInfo = databaseFields.find(f => f.id === mappedField);
            
            return (
              <motion.div
                key={csvField}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                  isUnmatched ? 'bg-red-50' : ''
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Checkbox */}
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleColumnSelection(csvField, e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </div>

                  {/* Column Name */}
                  <div className="col-span-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium truncate ${
                        isUnmatched ? 'text-red-900' : 'text-gray-900'
                      }`}>
                        {csvField}
                      </span>
                      {isUnmatched && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded whitespace-nowrap">
                          Unmatched
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="col-span-1 text-center">
                    <span className="text-gray-400 text-sm">→</span>
                  </div>

                  {/* Field Mapping Dropdown */}
                  <div className="col-span-5">
                    <select
                      value={mappedField || ''}
                      onChange={(e) => handleMappingChange(csvField, e.target.value)}
                      disabled={!isSelected}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        isUnmatched 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 bg-white'
                      } ${!isSelected ? 'bg-gray-100 text-gray-400' : ''}`}
                    >
                      <option value="">Select a field</option>
                      {databaseFields.map(field => {
                        const isUsed = usedFields.includes(field.id) && mappedField !== field.id;
                        return (
                          <option 
                            key={field.id} 
                            value={field.id}
                            disabled={isUsed}
                          >
                            {field.label} {field.required ? '(Required)' : ''}
                            {isUsed ? ' (Already mapped)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Compact Preview */}
                  <div className="col-span-1">
                    {isSelected && (
                      <div 
                        className="text-xs text-gray-500 truncate cursor-help" 
                        title={getPreviewData(csvField, 100)}
                      >
                        {getPreviewData(csvField, 20)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Import Summary</h4>
            <p className="text-sm text-blue-800 mt-1">
              {Object.keys(mappings).length} of {csvHeaders.length} columns mapped
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">{previewData.length}</div>
            <div className="text-sm text-blue-800">contacts to import</div>
          </div>
        </div>
      </div>
    </div>
  );
}
