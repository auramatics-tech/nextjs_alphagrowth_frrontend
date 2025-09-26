'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConversationListItem from './ConversationListItem';

interface Conversation {
  id: string;
  contact: {
    name: string;
    avatar: string;
    company: string;
    title: string;
    verified: boolean;
    leadStatus: string;
    dealValue: string;
    emails: string[];
    linkedinUrl: string;
    campaign: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    type: string;
  };
  unreadCount: number;
  channel: string;
  messages: any[];
}

interface ConversationListPanelProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
}

export default function ConversationListPanel({ 
  conversations, 
  selectedConversation, 
  onConversationSelect 
}: ConversationListPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {conversations.reduce((total, conv) => total + conv.unreadCount, 0)}
            </span>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ConversationListItem
                  conversation={conversation}
                  isSelected={selectedConversation?.id === conversation.id}
                  onClick={() => onConversationSelect(conversation)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
