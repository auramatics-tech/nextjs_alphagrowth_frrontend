'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Download, ChevronDown, Users } from 'lucide-react';
import Link from 'next/link';
import AllContactsView from '../../../../components/contacts/AllContactsView';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  website: string;
  industry: string;
  linkedin: string;
  bio: string;
  gender: string;
  leadStatus: 'Hot' | 'Warm' | 'Cold';
  contacted: boolean;
  replied: boolean;
  unsubscribed: boolean;
  proEmail: string;
  personalEmail: string;
  audiences: string[];
  campaigns: string[];
  customAttributes: { [key: string]: string };
}

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

// Mock data for audiences
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

// Mock data for contacts in Test1000 audience
const mockContactsForTest1000: Contact[] = [
  {
    id: '1',
    firstName: 'Abdullah',
    lastName: 'Ali',
    email: 'abdullah.ali@codingpixel.com',
    phone: '+1 832-123-4567',
    company: 'Coding Pixel',
    jobTitle: 'Software Engineer',
    location: 'New York, NY',
    website: 'codingpixel.com',
    industry: 'Technology',
    linkedin: 'linkedin.com/in/abdullah-ali',
    bio: 'Passionate software engineer with 5+ years of experience',
    gender: 'Male',
    leadStatus: 'Hot',
    contacted: true,
    replied: false,
    unsubscribed: false,
    proEmail: 'abdullah.pro@codingpixel.com',
    personalEmail: 'abdullah.personal@gmail.com',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
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
    email: 'tariq.shahabedden@azdan.com',
    phone: '+971 56-789-0123',
    company: 'Azdan',
    jobTitle: 'Product Manager',
    location: 'Dubai, UAE',
    website: 'azdan.com',
    industry: 'Healthcare',
    linkedin: 'linkedin.com/in/tariq-shahabedden',
    bio: 'Product manager focused on healthcare solutions',
    gender: 'Male',
    leadStatus: 'Warm',
    contacted: false,
    replied: false,
    unsubscribed: false,
    proEmail: 'tariq.pro@azdan.com',
    personalEmail: 'tariq.personal@outlook.com',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
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
    email: 'vince.neematallah@majarra.com',
    phone: '+1 555-987-6543',
    company: 'Majarra',
    jobTitle: 'CEO',
    location: 'San Francisco, CA',
    website: 'majarra.com',
    industry: 'Fintech',
    linkedin: 'linkedin.com/in/vince-neematallah',
    bio: 'CEO and founder of innovative fintech solutions',
    gender: 'Male',
    leadStatus: 'Cold',
    contacted: true,
    replied: true,
    unsubscribed: false,
    proEmail: 'vince.pro@majarra.com',
    personalEmail: 'vince.personal@yahoo.com',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
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

const AudienceDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const audienceId = params.audienceId as string;
  
  const [audience, setAudience] = useState<Audience | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch audience details and contacts
    const fetchAudienceData = async () => {
      setLoading(true);
      
      // Find the audience by ID
      const foundAudience = mockAudiences.find(a => a.id === audienceId);
      setAudience(foundAudience || null);
      
      // For demo purposes, we'll use the same contacts for all audiences
      // In a real app, you'd fetch contacts specific to this audience
      if (audienceId === '1') {
        setContacts(mockContactsForTest1000);
      } else {
        // Generate mock data for other audiences
        const mockContacts = Array.from({ length: foundAudience?.leadCount || 0 }, (_, index) => ({
          id: `${audienceId}-${index + 1}`,
          firstName: `Contact${index + 1}`,
          lastName: 'User',
          email: `contact${index + 1}@example.com`,
          phone: `+1 555-${String(index + 1).padStart(3, '0')}-${String(index + 1).padStart(4, '0')}`,
          company: `Company ${index + 1}`,
          jobTitle: 'Employee',
          location: 'City, State',
          website: `company${index + 1}.com`,
          industry: 'Technology',
          linkedin: `linkedin.com/in/contact${index + 1}`,
          bio: `Bio for contact ${index + 1}`,
          gender: 'Male',
          leadStatus: ['Hot', 'Warm', 'Cold'][index % 3] as 'Hot' | 'Warm' | 'Cold',
          contacted: index % 2 === 0,
          replied: index % 3 === 0,
          unsubscribed: false,
          proEmail: `contact${index + 1}.pro@company${index + 1}.com`,
          personalEmail: `contact${index + 1}.personal@gmail.com`,
          audiences: [foundAudience?.name || 'Unknown'],
          campaigns: ['Q1 Campaign'],
          customAttributes: {
            'Custom Attribute 1': `Value ${index + 1}`,
            'Custom Attribute 2': `Value ${index + 1}`,
            'Custom Attribute 3': `Value ${index + 1}`,
            'Custom Attribute 4': `Value ${index + 1}`,
            'Custom Attribute 5': `Value ${index + 1}`,
            'Custom Attribute 6': `Value ${index + 1}`,
            'Custom Attribute 7': `Value ${index + 1}`,
            'Custom Attribute 8': `Value ${index + 1}`,
            'Custom Attribute 9': `Value ${index + 1}`,
            'Custom Attribute 10': `Value ${index + 1}`
          }
        }));
        setContacts(mockContacts);
      }
      
      setLoading(false);
    };

    if (audienceId) {
      fetchAudienceData();
    }
  }, [audienceId]);

  const handleContactSelection = (contactIds: string[]) => {
    setSelectedContacts(contactIds);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading audience details...</p>
        </div>
      </div>
    );
  }

  if (!audience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Audience Not Found</h1>
          <p className="text-gray-600 mb-6">The audience you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/audiences"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all flex items-center gap-2 mx-auto w-fit"
          >
            <ArrowLeft size={16} />
            Back to Audiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/audiences" className="hover:text-orange-500 transition-colors">
              Audiences
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{audience.name}</span>
          </div>

          {/* Title and Action Buttons */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{audience.name}</h1>
              {audience.description && (
                <p className="text-gray-600">{audience.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">
                  <Users size={16} className="inline mr-1" />
                  {audience.leadCount} leads
                </span>
                {audience.campaigns.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {audience.campaigns.length} campaigns
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2">
                <Plus size={16} />
                Create a campaign
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all flex items-center gap-2">
                <Download size={16} />
                Export leads
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <AllContactsView 
          selectedContacts={selectedContacts}
          onContactSelection={handleContactSelection}
          contacts={contacts}
        />
      </div>
    </div>
  );
};

export default AudienceDetailPage;
