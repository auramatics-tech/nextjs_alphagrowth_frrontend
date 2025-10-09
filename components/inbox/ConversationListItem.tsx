'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

 

interface ConversationListItemProps {
  conversation: any;
  isSelected: boolean;
  onClick: () => void;
}

export default function ConversationListItem({ 
  conversation, 
  isSelected, 
  onClick 
}: ConversationListItemProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'linkedin':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'email':
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
    }
  };


  useEffect(()=>{
console.log("conversation------conversation",conversation);

  },[conversation])

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-gradient-to-r from-orange-50 to-blue-50 border-r-2 border-orange-500' 
          : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={"/avatars/default-avatar.jpg"} 
              alt={(conversation as any)?.lead?.first_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ display: 'none' }}>
              {/* {conversation.contact.name.split(' ').map(n => n[0]).join('')} */}
            </div>
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {(conversation as any)?.lead?.first_name} / {conversation?.identity?.name}
              </h3>
              {/* {conversation.contact.verified && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )} */}
              {/* {getChannelIcon(conversation.channel)} */}
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {/* {formatTime(conversation.lastMessage.timestamp)} */}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 truncate mb-1">
            {conversation.lead.job} at {conversation.lead.company_name}
          </p>
          
          <p className="text-xs text-gray-400 truncate">
            {/* {conversation.contact.campaign} */}
          </p>
        </div>

        {/* Unread count badge */}
        {/* {conversation.unreadCount > 0 && (
          <div className="flex-shrink-0">
            <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
              {conversation.unreadCount}
            </div>
          </div>
        )} */}
      </div>
    </motion.div>
  );
}
