'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Info, Download, ChevronDown } from 'lucide-react';
import ContactRow from './ContactRow';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  website: string;
  industry: string;
  linkedin: string;
  bio: string;
  gender: string;
  audiences: string[];
  campaigns: string[];
  leadStatus: string;
  contacted: boolean;
  replied: boolean;
  unsubscribed: boolean;
  proEmail: string;
  customAttributes: { [key: string]: string };
}

interface AllContactsViewProps {
  selectedContacts: string[];
  onContactSelection: (contactIds: string[]) => void;
  contacts?: Contact[];
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Abdullah',
    lastName: 'Ali',
    email: 'abdullah.ali@codingpixel.com',
    personalEmail: 'abdullah.personal@gmail.com',
    phone: '+1 832-123-4567',
    company: 'Coding Pixel',
    jobTitle: 'Software Engineer',
    location: 'New York, NY',
    website: 'codingpixel.com',
    industry: 'Technology',
    linkedin: 'linkedin.com/in/abdullah-ali',
    bio: 'Passionate software engineer with 5+ years of experience',
    gender: 'Male',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
    leadStatus: 'Hot',
    contacted: true,
    replied: false,
    unsubscribed: false,
    proEmail: 'abdullah.pro@codingpixel.com',
    customAttributes: {
      'Custom Attribute 1': 'Value 1',
      'Custom Attribute 2': 'Value 2',
      'Custom Attribute 3': 'Value 3',
      'Custom Attribute 4': 'Value 4',
      'Custom Attribute 5': 'Value 5',
      'Custom Attribute 6': 'Value 6',
      'Custom Attribute 7': 'Value 7',
      'Custom Attribute 8': 'Value 8',
      'Custom Attribute 9': 'Value 9',
      'Custom Attribute 10': 'Value 10'
    }
  },
  {
    id: '2',
    firstName: 'Tariq',
    lastName: 'Shahabedden',
    email: 'tariq@azdan.com',
    personalEmail: 'tariq.personal@gmail.com',
    phone: '+971 56-789-0123',
    company: 'Azdan',
    jobTitle: 'Product Manager',
    location: 'Dubai, UAE',
    website: 'azdan.com',
    industry: 'E-commerce',
    linkedin: 'linkedin.com/in/tariq-shahabedden',
    bio: 'Product manager focused on user experience and growth',
    gender: 'Male',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
    leadStatus: 'Warm',
    contacted: false,
    replied: false,
    unsubscribed: false,
    proEmail: 'tariq.pro@azdan.com',
    customAttributes: {
      'Custom Attribute 1': 'Value 1',
      'Custom Attribute 2': 'Value 2',
      'Custom Attribute 3': 'Value 3',
      'Custom Attribute 4': 'Value 4',
      'Custom Attribute 5': 'Value 5',
      'Custom Attribute 6': 'Value 6',
      'Custom Attribute 7': 'Value 7',
      'Custom Attribute 8': 'Value 8',
      'Custom Attribute 9': 'Value 9',
      'Custom Attribute 10': 'Value 10'
    }
  },
  {
    id: '3',
    firstName: 'Vince',
    lastName: 'Neematallah',
    email: 'vince@majarra.com',
    personalEmail: 'vince.personal@gmail.com',
    phone: '+1 555-987-6543',
    company: 'Majarra',
    jobTitle: 'Marketing Director',
    location: 'San Francisco, CA',
    website: 'majarra.com',
    industry: 'Marketing',
    linkedin: 'linkedin.com/in/vince-neematallah',
    bio: 'Marketing director with expertise in digital campaigns',
    gender: 'Male',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
    leadStatus: 'Cold',
    contacted: true,
    replied: true,
    unsubscribed: false,
    proEmail: 'vince.pro@majarra.com',
    customAttributes: {
      'Custom Attribute 1': 'Value 1',
      'Custom Attribute 2': 'Value 2',
      'Custom Attribute 3': 'Value 3',
      'Custom Attribute 4': 'Value 4',
      'Custom Attribute 5': 'Value 5',
      'Custom Attribute 6': 'Value 6',
      'Custom Attribute 7': 'Value 7',
      'Custom Attribute 8': 'Value 8',
      'Custom Attribute 9': 'Value 9',
      'Custom Attribute 10': 'Value 10'
    }
  }
];

const AllContactsView: React.FC<AllContactsViewProps> = ({ selectedContacts, onContactSelection, contacts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  // Use passed contacts or fall back to mock data
  const contactsData = contacts || mockContacts;

  const filteredContacts = contactsData.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (isSelectAllChecked) {
      onContactSelection([]);
      setIsSelectAllChecked(false);
    } else {
      const allContactIds = filteredContacts.map(contact => contact.id);
      onContactSelection(allContactIds);
      setIsSelectAllChecked(true);
    }
  };

  const handleRowSelection = (contactId: string, isSelected: boolean) => {
    if (isSelected) {
      onContactSelection([...selectedContacts, contactId]);
    } else {
      onContactSelection(selectedContacts.filter(id => id !== contactId));
    }
  };

  // Update select all checkbox state when individual selections change
  React.useEffect(() => {
    if (selectedContacts.length === 0) {
      setIsSelectAllChecked(false);
    } else if (selectedContacts.length === filteredContacts.length) {
      setIsSelectAllChecked(true);
    } else {
      setIsSelectAllChecked(false);
    }
  }, [selectedContacts, filteredContacts.length]);

  return (
    <div className="p-6">
      <style jsx>{`
        .table-container {
          overflow-x: auto;
          overflow-y: auto;
          max-height: calc(100vh - 300px);
        }
        .table-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        .contacts-table {
          min-width: 3000px;
          table-layout: auto;
        }
        .contacts-table th,
        .contacts-table td {
          white-space: nowrap;
          overflow: visible;
        }
      `}</style>
      
      {/* Filter & Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Search & Filter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus size={16} />
              Add filter
            </button>
            <span className="text-sm text-gray-500">{filteredContacts.length} leads</span>
          </div>

          {/* Right Side - Bulk Actions */}
          <div className="flex items-center gap-2">
            <button
              disabled={selectedContacts.length === 0}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedContacts.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Edit size={16} />
              Edit leads
              <ChevronDown size={16} />
            </button>
            <button
              disabled={selectedContacts.length === 0}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedContacts.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              <Info size={16} />
              Enrichment
              <ChevronDown size={16} />
            </button>
            <button
              disabled={selectedContacts.length === 0}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedContacts.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {selectedContacts.length} selected
        </span>
        <button
          onClick={handleSelectAll}
          className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-2"
        >
          <input
            type="checkbox"
            checked={isSelectAllChecked}
            onChange={handleSelectAll}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          Select all {filteredContacts.length}
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="table-container">
          <table className="contacts-table w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isSelectAllChecked}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px] whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                  Audiences
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">
                  Campaigns
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                  Lead's Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                  Contacted
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                  Replied
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">
                  Company Name
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                  Phone
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                  Unsubscribed
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">
                  Pro Email
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">
                  Perso Email
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                  Job
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                  Location
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                  Website
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                  Industry
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                  LinkedIn
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px] whitespace-nowrap">
                  Bio
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                  Gender
                </th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th key={i} className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px] whitespace-nowrap">
                    Custom Attribute {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContacts.includes(contact.id)}
                  onSelectionChange={(isSelected) => handleRowSelection(contact.id, isSelected)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllContactsView;
