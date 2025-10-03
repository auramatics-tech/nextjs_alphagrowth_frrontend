'use client';

import React, { useState, useEffect } from 'react';
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
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [selectedIdentity, setSelectedIdentity] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load identities and conversations on component mount
  useEffect(() => {
    loadIdentities();
  }, []);

  // Load conversations when identity is selected
  useEffect(() => {
    if (selectedIdentity) {
      loadConversations();
    }
  }, [selectedIdentity]);


  const loadIdentities = async () => {
    try {
      setLoading(true);
      const response = await inboxService.getIdentities();
      console.log('Identities response:', response);
      // Handle different response structures
      const identities = response.identities || response.data || response || [];
      console.log('Identities array:', identities);
      setIdentities(identities);
      if (identities.length > 0) {
        console.log('Setting selected identity to:', identities[0].id);
        setSelectedIdentity(identities[0].id);
      } else {
        console.warn('No identities found. Please add an identity first.');
        toast.warning('No identities found. Please add an identity first.');
      }
    } catch (error) {
      console.error('Error loading identities:', error);
      setError('Failed to load identities');
      toast.error('Failed to load identities');
    } finally {
      setLoading(false);
    }
  };


  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log('Loading conversations with selectedIdentity:', selectedIdentity);
      const response = await inboxService.getAllLeads();
      
      console.log("response----",response);
      
      // Handle different response structures
      const messageRepliedLeads: MessageRepliedLead[] = response.data || response.leads || response || [];
      
      if (messageRepliedLeads.length > 0) {
        // Transform message replied leads into conversations (without pre-loading messages)
        const conversations = messageRepliedLeads.map((messageRepliedLead) => {
          const lead = messageRepliedLead.lead; // Extract the actual lead data
          
          // Get lead status and deal value from messageRepliedLead
          const leadStatus = messageRepliedLead.lead_status || 'Not Set';
          const dealValue = messageRepliedLead.deal_value ? `$${messageRepliedLead.deal_value}` : 'Not Set';
          
          const conversation: Conversation = {
            id: lead.id,
            leadId: lead.id, // Store the actual lead ID
            identityId: messageRepliedLead?.identity_id, // Store the identity ID
    contact: {
              name: `${lead.first_name || 'Unknown'} ${lead.last_name || 'Contact'}`,
              avatar: '/avatars/default-avatar.jpg',
              company: lead.company_name || 'Unknown Company',
              title: lead.job || 'Unknown',
              verified: false,
              leadStatus: leadStatus,
              dealValue: dealValue,
              emails: [lead.pro_email, lead.perso_email].filter(Boolean),
              linkedinUrl: lead.linkedin || lead.profile_url || '',
              phone: lead.phone || '',
              campaign: 'Inbox'
    },
    lastMessage: {
              content: 'Click to load messages',
              timestamp: new Date().toISOString(),
      type: 'system'
    },
            unreadCount: 0,
    channel: 'linkedin',
            messages: [] // Start with empty messages, load on-demand
          };
          
          console.log('Created conversation for lead', lead.id, ':', conversation);
          return conversation;
        });
        
        console.log('Loaded conversations:', conversations);
        console.log('First conversation details:', conversations[0]);
        setConversations(conversations);
        
        if (conversations.length > 0) {
          setSelectedConversation(conversations[0]);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = async (conversation: Conversation) => {
    console.log('Conversation selected:', conversation.id);
    console.log('Conversation details:', conversation);
    
    try {
      // Make fresh API call to get messages (like frontend_old)
      const inboxResponse = await inboxService.getInboxMessages(conversation.leadId, conversation.identityId);
      console.log('Fresh inbox response for lead', conversation.leadId, ':', inboxResponse);
      
      const messages: InboxMessage[] = inboxResponse.data || [];
      console.log('Fresh messages for lead', conversation.leadId, ':', messages);
      
      // Transform messages to conversation format
      const transformedMessages = messages.map(msg => {
        console.log('Processing message:', msg);
        let content = 'System message';
        let messageType = msg.type;
        let recordingUrl = null;
        let transcript = null;
        
        if (msg.message) {
          try {
            const parsed = JSON.parse(msg.message);
            console.log('Parsed message:', parsed);
            
            // Handle voice call recordings
            if (msg.type === 'voice_call_recording' && parsed && typeof parsed === 'object' && parsed.recordingUrl) {
              content = 'Voice call recording';
              recordingUrl = parsed.recordingUrl;
              transcript = parsed.transcript;
            }
            // Handle AI voice messages
            else if (msg.type === 'action_ai_voice_message' && parsed && typeof parsed === 'object' && parsed.attachmentFilePath) {
              content = 'Audio message';
              recordingUrl = parsed.attachmentFilePath;
            }
            // Handle email messages
            else if (msg.type === 'action_send_email' || msg.type === 'inbox_email_message') {
              if (parsed.subject && parsed.message) {
                content = `Subject: ${parsed.subject}\n\n${parsed.message}`;
              } else if (typeof parsed === 'string') {
                content = parsed;
              } else {
                content = parsed.message || parsed.subject || 'Email message';
              }
            }
            // Handle regular messages
            else {
              if (typeof parsed === 'string') {
                content = parsed;
              } else if (parsed.message && typeof parsed.message === 'string') {
                content = parsed.message;
              } else if (parsed.content && typeof parsed.content === 'string') {
                content = parsed.content;
              } else if (typeof parsed === 'object') {
                // For other object types, show a descriptive message
                content = `[${msg.type}] Message`;
              } else {
                content = msg.message;
              }
            }
          } catch (e) {
            console.log('Failed to parse message, using raw content:', msg.message);
            content = msg.message;
          }
        }
        
        // Define all types that come from the other user (like frontend_old)
        const otherUserTypes = new Set(["reply_message"]);
        const isFromUser = !otherUserTypes.has(msg.type);
        
        return {
          id: msg.id,
          type: isFromUser ? 'outgoing' : 'incoming',
          content: typeof content === 'string' ? content : String(content || 'System message'),
          timestamp: msg.created_at || msg.timestamp || new Date().toISOString(),
          sender: isFromUser ? 'user' : 'contact',
          channel: msg.type?.includes('linkedin') ? 'linkedin' : 'email',
          messageType: messageType,
          recordingUrl: recordingUrl,
          transcript: transcript
        };
      });
      
      // Update the conversation with fresh messages
      const updatedConversation = {
        ...conversation,
        messages: transformedMessages,
        lastMessage: transformedMessages.length > 0 ? transformedMessages[transformedMessages.length - 1] : {
          content: 'No messages yet',
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      };
      
      console.log('Updated conversation with fresh messages:', updatedConversation);
      setSelectedConversation(updatedConversation);
      
    } catch (error) {
      console.error('Error loading messages for conversation:', error);
      // Still set the conversation even if message loading fails
      setSelectedConversation(conversation);
    }
  };

  const handleSendMessage = async (leadId: string, message: string, channel: 'linkedin' | 'email', subject?: string) => {
    try {
      if (!selectedIdentity) {
        toast.error('Please select an identity first');
        return;
      }

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

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && conversations.length === 0) {
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
              loadIdentities();
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Identity:</label>
              <select
                value={selectedIdentity}
                onChange={(e) => setSelectedIdentity(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {identities.map((identity) => (
                  <option key={identity.id} value={identity.id}>
                    {identity.name} ({identity.company})
                  </option>
                ))}
              </select>
            </div>

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
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
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
