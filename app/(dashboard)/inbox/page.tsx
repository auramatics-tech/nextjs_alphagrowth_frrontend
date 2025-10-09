'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationListPanel from '@/components/inbox/ConversationListPanel';
import ChatPanel from '@/components/inbox/ChatPanel';
import ProfilePanel from '@/components/inbox/ProfilePanel';
import { inboxService, Conversation, Lead, InboxMessage, MessageRepliedLead, Contact } from '@/services/inboxService';
import { toast } from 'react-hot-toast';

// Types
interface Identity {
  id: string;
  name: string;
  email: string;
  company: string;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdentity, setSelectedIdentity] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);

      const response = await inboxService.getAllLeads();
      if (response.data.length > 0) {
        setConversations(response.data);
        setSelectedConversation(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);



  // Load conversations when identity is selected




  const handleConversationSelect = async (conversation: any) => {
    try {
     

      // Fetch messages from API
      const inboxResponse = await inboxService.getInboxMessages(
        conversation?.lead?.id,
        conversation.identity_id
      );

      const messages: InboxMessage[] = inboxResponse.data || [];
    

      // Store raw messages directly - transformation will happen in UI
      const updatedConversation = {
        ...conversation,
        messages: messages  // 👈 Raw messages without transformation
      };

      setSelectedConversation(updatedConversation as any);

    } catch (error) {
      console.error('Error loading messages for conversation:', error);
      setSelectedConversation(conversation);
    }
  };

  const handleSendMessage = async (leadId: string, message: string, channel: 'linkedin' | 'email', subject?: string) => {
    try {
    

      const messageData = {
        message,
        identity_id: selectedIdentity,
        channel,
        subject,
        userId: selectedIdentity // Using identity as userId for now
      };

      await inboxService.sendMessage(leadId, messageData);
      toast.success(`Message sent via ${channel}`);

      // Reload conversations to show the new message
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  useEffect(() => {

    loadConversations();

  }, [ loadConversations]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inbox...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);

            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>

            {/* Identity Selector */}


            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
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
            <button
              onClick={loadConversations}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <svg className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect as any}
          />
        </div>

        {/* Center Pane - Chat View (45%) */}
        <div className="flex-1 bg-white border-r border-gray-100 flex flex-col">
          <ChatPanel
            conversation={selectedConversation}
            onToggleProfile={() => setIsProfileVisible(!isProfileVisible)}
            onSendMessage={handleSendMessage}
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
                contact={selectedConversation?.lead}
                onClose={() => setIsProfileVisible(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
