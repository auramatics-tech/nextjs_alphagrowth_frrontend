'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Download, ChevronDown, Search, MoreVertical, Mail, Linkedin } from 'lucide-react';

interface Audience {
  id: string;
  name: string;
  description: string;
  leadCount: number;
  campaigns: Array<{
    id: string;
    name: string;
    type: 'linkedin' | 'email' | 'mixed';
    followUps: number;
  }>;
}

// Mock audience data
const mockAudiences: Audience[] = [
  {
    id: '1',
    name: 'Test1000',
    description: 'Testing Upload',
    leadCount: 201,
    campaigns: []
  },
  {
    id: '2',
    name: 'TestingV1',
    description: 'Test',
    leadCount: 200,
    campaigns: []
  },
  {
    id: '3',
    name: 'Medical Devices',
    description: 'Pakari LCC test',
    leadCount: 440,
    campaigns: [
      {
        id: 'c1',
        name: 'Linkedin > Email - 3 Follow-ups (+ Voice) 2',
        type: 'mixed',
        followUps: 3
      },
      {
        id: 'c2',
        name: 'Linkedin > Email | 3 follow-ups 1',
        type: 'mixed',
        followUps: 3
      }
    ]
  },
  {
    id: '4',
    name: 'LinkedIn_Outreach_Campaign_Contacts_-_Revised_Batch_1',
    description: '',
    leadCount: 200,
    campaigns: []
  }
];

const AudiencesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAudiences = mockAudiences.filter(audience =>
    audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audience.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCampaignIcon = (type: string) => {
    switch (type) {
      case 'linkedin':
        return <Linkedin size={12} className="text-blue-600" />;
      case 'email':
        return <Mail size={12} className="text-gray-600" />;
      case 'mixed':
        return <div className="flex gap-1">
          <Linkedin size={12} className="text-blue-600" />
          <Mail size={12} className="text-gray-600" />
        </div>;
      default:
        return <Mail size={12} className="text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Title and Action Buttons */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Audiences</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2">
                <Plus size={16} />
                New audience
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all flex items-center gap-2">
                <Download size={16} />
                Import leads
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Header/Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center">
            {/* Left Side - Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search an audience"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* List Header */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">DETAILS</h3>
              </div>
              <div className="col-span-2">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">LEADS</h3>
              </div>
              <div className="col-span-3">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">CAMPAIGNS</h3>
              </div>
              <div className="col-span-1">
                {/* Empty column for actions */}
              </div>
            </div>
          </div>

          {/* Audience Cards */}
          <div className="divide-y divide-gray-200">
            {filteredAudiences.map((audience) => (
              <div key={audience.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Details Column */}
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {audience.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-3">
                        <Link 
                          href={`/audiences/${audience.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-orange-500 transition-colors cursor-pointer"
                        >
                          {audience.name}
                        </Link>
                        {audience.description && (
                          <div className="text-sm text-gray-500">
                            {audience.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Leads Column */}
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-900">
                      {audience.leadCount}
                    </span>
                  </div>

                  {/* Campaigns Column */}
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-2">
                      {audience.campaigns.length > 0 ? (
                        audience.campaigns.map((campaign) => (
                          <div
                            key={campaign.id}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {getCampaignIcon(campaign.type)}
                            <span className="text-gray-700">{campaign.name}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No campaigns</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="col-span-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudiencesPage;
