'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Contact {
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
}

interface ChatHeaderProps {
  contact: any;
  onToggleProfile: () => void;
}

export default function ChatHeader({ contact, onToggleProfile }: ChatHeaderProps) {
  const getLeadStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'interested':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'hot':
        return 'bg-gradient-to-r from-orange-500 to-blue-500 text-white border-transparent';
      case 'cold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  useEffect(()=>{
console.log("contact=====",contact);

  },[contact])

  return (
    <div className="border-b border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={"/avatars/default-avatar.jpg"} 
                alt={contact?.first_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg" style={{ display: 'none' }}>
                {contact?.first_name?.split(' ').map((n:any) => n[0]).join('')}
              </div>
            </div>
            
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">{contact?.first_name}</h2>
              {contact?.verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getLeadStatusColor(contact?.lead_status)}`}>
                {contact?.lead_status}
              </span>
              <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                {contact?.campaign}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Video Call */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Video Call"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </motion.button>

          {/* Phone Call */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Phone Call"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </motion.button>

          {/* More Options */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleProfile}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="View Profile"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
