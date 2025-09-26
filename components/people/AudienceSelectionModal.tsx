'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Users, Search, Check, ArrowRight } from 'lucide-react';

interface Audience {
  id: string;
  name: string;
  description: string;
  leadCount: number;
  createdAt: string;
  isDefault?: boolean;
}

interface AudienceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeadsCount: number;
  onSelectAudience: (audienceId: string) => void;
  onCreateNewAudience: () => void;
}

const AudienceSelectionModal: React.FC<AudienceSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedLeadsCount,
  onSelectAudience,
  onCreateNewAudience
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudienceId, setSelectedAudienceId] = useState<string | null>(null);
  const [audiences, setAudiences] = useState<Audience[]>([]);

  // Mock audiences data
  useEffect(() => {
    const mockAudiences: Audience[] = [
      {
        id: '1',
        name: 'High-Value Prospects',
        description: 'Leads with high potential value and engagement',
        leadCount: 1247,
        createdAt: '2024-01-15',
        isDefault: true
      },
      {
        id: '2',
        name: 'Tech Industry Contacts',
        description: 'Software engineers, product managers, and tech executives',
        leadCount: 892,
        createdAt: '2024-01-10'
      },
      {
        id: '3',
        name: 'Marketing Professionals',
        description: 'CMOs, marketing managers, and growth specialists',
        leadCount: 634,
        createdAt: '2024-01-08'
      },
      {
        id: '4',
        name: 'Sales Directors',
        description: 'VP of Sales, Sales Directors, and Revenue Leaders',
        leadCount: 445,
        createdAt: '2024-01-05'
      },
      {
        id: '5',
        name: 'Startup Founders',
        description: 'CEO, CTO, and founders of early-stage startups',
        leadCount: 298,
        createdAt: '2024-01-03'
      },
      {
        id: '6',
        name: 'Enterprise Decision Makers',
        description: 'C-level executives at Fortune 500 companies',
        leadCount: 156,
        createdAt: '2024-01-01'
      }
    ];
    setAudiences(mockAudiences);
  }, []);

  const filteredAudiences = audiences.filter(audience =>
    audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audience.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAudience = () => {
    if (selectedAudienceId) {
      onSelectAudience(selectedAudienceId);
      onClose();
    }
  };

  const handleCreateNew = () => {
    onCreateNewAudience();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Import {selectedLeadsCount} leads to Audience
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Choose an existing audience or create a new one
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search audiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Create New Audience Button */}
            <div className="mb-6">
              <button
                onClick={handleCreateNew}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Plus size={20} className="text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 group-hover:text-orange-700">
                    Create New Audience
                  </div>
                  <div className="text-sm text-gray-500">
                    Start fresh with a new audience
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
              </button>
            </div>

            {/* Existing Audiences */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Existing Audiences</h4>
              {filteredAudiences.length > 0 ? (
                filteredAudiences.map((audience) => (
                  <button
                    key={audience.id}
                    onClick={() => setSelectedAudienceId(audience.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedAudienceId === audience.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedAudienceId === audience.id
                            ? 'bg-orange-100'
                            : 'bg-gray-100'
                        }`}>
                          <Users size={20} className={
                            selectedAudienceId === audience.id
                              ? 'text-orange-600'
                              : 'text-gray-600'
                          } />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-gray-900">{audience.name}</h5>
                            {audience.isDefault && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{audience.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>{audience.leadCount.toLocaleString()} leads</span>
                            <span>Created {new Date(audience.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      {selectedAudienceId === audience.id && (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No audiences found</p>
                  <p className="text-sm">Try adjusting your search or create a new audience</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectAudience}
              disabled={!selectedAudienceId}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={16} />
              Import to Selected Audience
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudienceSelectionModal;
