'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';



interface ChatPanelProps {
  conversation: any | null;
  onToggleProfile: () => void;
  onSendMessage?: (leadId: string, message: string, channel: 'linkedin' | 'email', subject?: string) => void;
}

export default function ChatPanel({ conversation, onToggleProfile, onSendMessage }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedChannel, setSelectedChannel] = useState<'linkedin' | 'email'>('linkedin');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);



  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
          <p className="text-gray-600">Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  // Group messages by date (using raw message format)
  const groupedMessages = conversation?.messages?.reduce((groups: any, message: any) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  console.log('Final grouped messages:', groupedMessages);




  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <ChatHeader
        contact={conversation.lead}
        onToggleProfile={onToggleProfile}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {groupedMessages && Object.keys(groupedMessages).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Start a conversation with {conversation?.lead?.first_name}</p>
            </div>
          </div>
        ) : (groupedMessages &&
          Object.entries(groupedMessages).map(([date, messages]: [string, any]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-8">
                <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                  <span className="text-xs font-medium text-gray-500">
                    {new Date(date).toLocaleDateString([], {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {messages.map((message: any, index: number) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MessageBubble message={message} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        selectedChannel={selectedChannel}
        onChannelChange={setSelectedChannel}
        onSendMessage={(content, subject) => {
          if (onSendMessage && conversation) {
            // Use lead.id for sending messages
            onSendMessage(conversation.lead.id, content, selectedChannel, subject);
          }
        }}
      />
    </div>
  );
}
