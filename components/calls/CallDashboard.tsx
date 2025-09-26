'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Call {
  id: string;
  contact: {
    name: string;
    title: string;
    company: string;
    initials: string;
    avatar?: string;
  };
  date: string;
  duration: string;
  agent: string;
  campaign: string;
  outcome: string;
  outcomeColor: string;
}

interface CallDashboardProps {
  onNewCall: () => void;
  onCreateAgent: () => void;
  onViewAnalysis: (call: Call) => void;
}

export default function CallDashboard({ onNewCall, onCreateAgent, onViewAnalysis }: CallDashboardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState('All Outcomes');
  const [selectedCampaign, setSelectedCampaign] = useState('All Campaigns');
  const [selectedDate, setSelectedDate] = useState('');

  // Mock call data
  const mockCalls: Call[] = [
    {
      id: '1',
      contact: {
        name: 'Chait Jain',
        title: 'Founder & CEO',
        company: 'DataMind AI',
        initials: 'CJ'
      },
      date: 'Sep 23, 2025',
      duration: '2m 45s',
      agent: 'Discovery Agent',
      campaign: 'Q4 Tech Outreach',
      outcome: 'Meeting Booked',
      outcomeColor: 'bg-green-100 text-green-800'
    },
    {
      id: '2',
      contact: {
        name: 'Sarah Johnson',
        title: 'VP of Engineering',
        company: 'TechCorp',
        initials: 'SJ'
      },
      date: 'Sep 22, 2025',
      duration: '0m 32s',
      agent: 'Follow-up Agent',
      campaign: 'Post-Demo Follow Up',
      outcome: 'Voicemail Left',
      outcomeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: '3',
      contact: {
        name: 'Michael Rodriguez',
        title: 'CTO',
        company: 'StartupIO',
        initials: 'MR'
      },
      date: 'Sep 21, 2025',
      duration: '1m 15s',
      agent: 'Discovery Agent',
      campaign: 'Q4 Tech Outreach',
      outcome: 'Not Interested',
      outcomeColor: 'bg-red-100 text-red-800'
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of all past and scheduled AI calls.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCreateAgent}
            className="font-semibold text-sm border border-gray-300 rounded-lg py-2 px-4 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4.343 5.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM14.95 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" />
              <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
            <span>Create Agent</span>
          </button>
          <button
            onClick={onNewCall}
            className="bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>New AI Call</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center space-x-4">
        <select
          value={selectedOutcome}
          onChange={(e) => setSelectedOutcome(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="All Outcomes">All Outcomes</option>
          <option value="Meeting Booked">Meeting Booked</option>
          <option value="Voicemail Left">Voicemail Left</option>
          <option value="Not Interested">Not Interested</option>
        </select>
        <select
          value={selectedCampaign}
          onChange={(e) => setSelectedCampaign(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="All Campaigns">All Campaigns</option>
          <option value="Q4 Tech Outreach">Q4 Tech Outreach</option>
          <option value="Post-Demo Follow Up">Post-Demo Follow Up</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      {/* Call Log */}
      <div className="p-6 space-y-4">
        {mockCalls.map((call, index) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-blue-500 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getInitials(call.contact.name)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{call.contact.name}</p>
                <p className="text-sm text-gray-500">{call.contact.title} at {call.contact.company}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{call.date}</p>
              <p>Duration: {call.duration}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Agent: <span className="font-semibold">{call.agent}</span></p>
              <p>Campaign: <span className="font-semibold">{call.campaign}</span></p>
            </div>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${call.outcomeColor}`}>
                {call.outcome}
              </span>
            </div>
            <button
              onClick={() => onViewAnalysis(call)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
            >
              View Analysis →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

