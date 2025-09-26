'use client';

import React, { useState, useCallback } from 'react';
import { Search, Filter, Clock, Save, ChevronDown } from 'lucide-react';
import ProspectCard from './ProspectCard';

interface Message {
  id: string;
  type: 'linkedin' | 'email' | 'voice';
  title: string;
  content: string;
  characterCount: number;
  limit: number;
  isWithinLimit: boolean;
}

interface Prospect {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  linkedinUrl: string;
  messages: Message[];
}

// Mock data
const mockProspects: Prospect[] = [
  {
    id: '1',
    name: 'Chait Jain',
    title: 'Founder & CEO',
    company: 'DataMind AI',
    location: 'Bengaluru, India',
    avatar: 'CJ',
    linkedinUrl: 'https://linkedin.com/in/chaitjain',
    messages: [
      {
        id: 'msg1',
        type: 'linkedin',
        title: 'LinkedIn Connection Note',
        content: 'Hi Chait, saw your work on AI-driven analytics at DataMind AI. Your insights on machine learning applications in business intelligence really caught my attention. I\'d love to connect and share some thoughts on how we might collaborate on similar projects.',
        characterCount: 255,
        limit: 300,
        isWithinLimit: true
      },
      {
        id: 'msg2',
        type: 'email',
        title: 'Email 1',
        content: 'Following up on my connection request, I was impressed by your recent post about scaling AI solutions for enterprise clients. At AlphaGrowth, we\'ve been working on similar challenges and I believe there could be valuable synergies between our approaches. Would you be open to a brief conversation about potential collaboration opportunities?',
        characterCount: 341,
        limit: 500,
        isWithinLimit: true
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Chen',
    title: 'VP of Engineering',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    avatar: 'SC',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    messages: [
      {
        id: 'msg3',
        type: 'linkedin',
        title: 'LinkedIn Connection Note',
        content: 'Hi Sarah, I noticed your recent work on scaling engineering teams at TechCorp. Your insights on building high-performance development cultures really resonated with me.',
        characterCount: 189,
        limit: 300,
        isWithinLimit: true
      }
    ]
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    title: 'Sales Director',
    company: 'GrowthCo',
    location: 'Austin, TX',
    avatar: 'MR',
    linkedinUrl: 'https://linkedin.com/in/michaelrodriguez',
    messages: [
      {
        id: 'msg4',
        type: 'linkedin',
        title: 'LinkedIn Connection Note',
        content: 'Hi Michael, your approach to sales automation at GrowthCo caught my attention. I\'d love to connect and share insights about AI-driven sales strategies.',
        characterCount: 156,
        limit: 300,
        isWithinLimit: true
      }
    ]
  }
];

export default function AIPersonalisationEditor() {
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('All Titles');
  const [selectedCompany, setSelectedCompany] = useState('All Companies');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  // Update message content
  const handleContentChange = useCallback((prospectId: string, messageId: string, content: string) => {
    setProspects(prev => prev.map(prospect => 
      prospect.id === prospectId 
        ? {
            ...prospect,
            messages: prospect.messages.map(msg => 
              msg.id === messageId 
                ? { ...msg, content, characterCount: content.length }
                : msg
            )
          }
        : prospect
    ));
    
    // Update last saved time
    setLastSaved(new Date());
  }, []);

  // Save all changes
  const handleSaveAll = useCallback(() => {
    // Simulate save operation
    console.log('Saving all changes...', prospects);
    setLastSaved(new Date());
    
    // You could add a toast notification here
    // toast.success('All changes saved successfully!');
  }, [prospects]);

  // Filter prospects based on search and filters
  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTitle = selectedTitle === 'All Titles' || prospect.title.includes(selectedTitle);
    const matchesCompany = selectedCompany === 'All Companies' || prospect.company.includes(selectedCompany);
    
    return matchesSearch && matchesTitle && matchesCompany;
  });

  // Get unique titles and companies for filters
  const uniqueTitles = Array.from(new Set(prospects.map(p => p.title)));
  const uniqueCompanies = Array.from(new Set(prospects.map(p => p.company)));

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Personalisation</h1>
          <p className="text-gray-600 mt-1">Review and edit AI-generated drafts for each prospect</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>Autosaved {formatLastSaved(lastSaved)}</span>
          </div>
          <button
            onClick={handleSaveAll}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
          >
            <Save size={16} />
            Save All Changes
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search prospects by name, company, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All Titles">All Titles</option>
            {uniqueTitles.map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        
        <div className="relative">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All Companies">All Companies</option>
            {uniqueCompanies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={16} />
          More Filters
        </button>
      </div>

      {/* Prospects Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{filteredProspects.length} Prospects</h2>
          <p className="text-sm text-gray-600">Click on any prospect to expand and edit their personalized sequence</p>
        </div>
        
        <div className="space-y-4">
          {filteredProspects.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onContentChange={handleContentChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

