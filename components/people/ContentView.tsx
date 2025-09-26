'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Filter {
  id: string;
  filterId: string;
  label: string;
  value: string;
  type: string;
}

interface Person {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  companySize: string;
  avatar: string;
  email: string;
  linkedin: string;
  phone: string;
}

interface ContentViewProps {
  viewMode: 'people' | 'companies';
  onViewModeChange: (mode: 'people' | 'companies') => void;
  searchResults: Person[];
  activeFilters: Filter[];
  isSearching: boolean;
}

export default function ContentView({
  viewMode,
  onViewModeChange,
  searchResults,
  activeFilters,
  isSearching
}: ContentViewProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const EmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-orange-100 to-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          People Database
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Use the filters on the left to search through your people database. 
          Add filters to find specific contacts based on their job title, company, 
          location, and more.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => {/* Focus on first filter section */}}
          className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Apply a Filter
        </button>
      </motion.div>
    </div>
  );

  const ResultsView = () => (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Search Results</h2>
            <p className="text-sm text-gray-600 mt-1">
              Found {searchResults.length} people matching your criteria
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('people')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'people'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              People
            </button>
            <button
              onClick={() => onViewModeChange('companies')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'companies'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Companies
            </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-y-4">
            {searchResults.map((person, index) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={person.avatar} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold" style={{ display: 'none' }}>
                        {getInitials(person.name)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                        <p className="text-gray-600">{person.title}</p>
                        <p className="text-sm text-gray-500">{person.company}</p>
                        <p className="text-sm text-gray-500">{person.location}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="View profile">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Add to campaign">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📧 {person.email}</span>
                      <span>📱 {person.phone}</span>
                      <span>🏢 {person.industry}</span>
                      <span>👥 {person.companySize} employees</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingView = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4">
          <svg className="animate-spin w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-600">Searching your database...</p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {isSearching ? (
        <LoadingView />
      ) : searchResults.length > 0 ? (
        <ResultsView />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

