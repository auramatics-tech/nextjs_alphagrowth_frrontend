'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationListPanel from '@/components/inbox/ConversationListPanel';
import ChatPanel from '@/components/inbox/ChatPanel';
import ProfilePanel from '@/components/inbox/ProfilePanel';

// Mock conversation data
const mockConversations = [
  {
    id: '1',
    contact: {
      name: 'Chait Jain',
      avatar: '/avatars/chait-jain.jpg',
      company: 'DataMind AI',
      title: 'Founder & CEO',
      verified: true,
      leadStatus: 'Hot',
      dealValue: 'Not Set',
      emails: ['chait@datamind.ai'],
      linkedinUrl: 'https://linkedin.com/in/chaitjain',
      phone: '+1 (555) 123-4567',
      campaign: 'Q4 Tech Outreach'
    },
    lastMessage: {
      content: 'Voice call initiated (Call ID: bae246df-a51e-43a3-ba81-8ba237e7851e)',
      timestamp: '2025-09-15T15:03:00Z',
      type: 'system'
    },
    unreadCount: 6,
    channel: 'linkedin',
    messages: [
      {
        id: 'msg1',
        type: 'system',
        content: 'Profile enriched from LinkedIn',
        timestamp: '2025-09-10T23:45:00Z',
        sender: 'system'
      },
      {
        id: 'msg2',
        type: 'outgoing',
        content: 'Email sent',
        subject: '2 ss',
        body: 'ssass',
        timestamp: '2025-09-11T00:00:00Z',
        sender: 'user',
        channel: 'email'
      },
      {
        id: 'msg3',
        type: 'outgoing',
        content: '(action_list_post)',
        timestamp: '2025-09-11T01:02:00Z',
        sender: 'user'
      },
      {
        id: 'msg4',
        type: 'outgoing',
        content: 'Voice Call',
        timestamp: '2025-09-15T13:19:00Z',
        sender: 'user',
        recording: {
          duration: '0:37',
          currentTime: '0:00'
        }
      },
      {
        id: 'msg5',
        type: 'outgoing',
        content: 'Voice Call',
        timestamp: '2025-09-15T14:52:00Z',
        sender: 'user',
        recording: {
          duration: '0:17',
          currentTime: '0:00'
        }
      },
      {
        id: 'msg6',
        type: 'system',
        content: 'Voice call initiated (Call ID: bae246df-a51e-43a3-ba81-8ba237e7851e) - Real-time monitoring unavailable',
        timestamp: '2025-09-15T15:03:00Z',
        sender: 'system'
      }
    ]
  },
  {
    id: '2',
    contact: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah-johnson.jpg',
      company: 'TechCorp Solutions',
      title: 'VP of Engineering',
      verified: false,
      leadStatus: 'Qualified',
      dealValue: '$50,000',
      emails: ['sarah@techcorp.com'],
      linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
      phone: '+1 (555) 987-6543',
      campaign: 'Enterprise Outreach'
    },
    lastMessage: {
      content: 'Thanks for reaching out! I\'d love to learn more about your solution.',
      timestamp: '2025-09-14T10:30:00Z',
      type: 'incoming'
    },
    unreadCount: 2,
    channel: 'email',
    messages: [
      {
        id: 'msg1',
        type: 'outgoing',
        content: 'Hi Sarah, I hope this email finds you well. I wanted to reach out about our new AI-powered analytics platform...',
        timestamp: '2025-09-14T09:15:00Z',
        sender: 'user',
        channel: 'email'
      },
      {
        id: 'msg2',
        type: 'incoming',
        content: 'Thanks for reaching out! I\'d love to learn more about your solution.',
        timestamp: '2025-09-14T10:30:00Z',
        sender: 'contact'
      }
    ]
  }
];

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = mockConversations.filter(conversation =>
    conversation.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anything"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-80"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Three-Pane Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Pane - Conversation List (25%) */}
        <div className="w-1/4 bg-white border-r border-gray-100 flex flex-col">
          <ConversationListPanel 
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onConversationSelect={setSelectedConversation}
          />
        </div>

        {/* Center Pane - Chat View (45%) */}
        <div className="flex-1 bg-white border-r border-gray-100 flex flex-col">
          <ChatPanel 
            conversation={selectedConversation}
            onToggleProfile={() => setIsProfileVisible(!isProfileVisible)}
          />
        </div>

        {/* Right Pane - Profile Details (30%) */}
        <AnimatePresence>
          {isProfileVisible && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '30%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-white flex flex-col"
            >
              <ProfilePanel 
                contact={selectedConversation?.contact}
                onClose={() => setIsProfileVisible(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
