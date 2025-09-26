'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Building, MapPin, Eye, Linkedin } from 'lucide-react';

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

interface ProspectCardProps {
  prospect: Prospect;
  onContentChange: (prospectId: string, messageId: string, content: string) => void;
}

export default function ProspectCard({ prospect, onContentChange }: ProspectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMessageChange = (messageId: string, content: string) => {
    onContentChange(prospect.id, messageId, content);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getChannelLabel = (type: string) => {
    switch (type) {
      case 'linkedin': return 'LinkedIn';
      case 'email': return 'Email';
      case 'voice': return 'Voice';
      default: return type;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Prospect Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {getInitials(prospect.name)}
            </div>
            
            {/* Prospect Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{prospect.name}</h3>
              <p className="text-sm text-gray-600">{prospect.title}</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Building size={12} />
                  {prospect.company}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} />
                  {prospect.location}
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Linkedin size={16} className="text-blue-600" />
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
              <Eye size={12} />
              Preview
            </button>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 p-4 space-y-4">
              {prospect.messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {/* Message Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                        {message.type === 'linkedin' && <Linkedin size={12} className="text-blue-600" />}
                        {message.type === 'email' && <span className="text-xs font-bold text-gray-600">@</span>}
                        {message.type === 'voice' && <span className="text-xs font-bold text-gray-600">🎤</span>}
                      </div>
                      <h4 className="font-medium text-gray-900">{message.title}</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {getChannelLabel(message.type)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <textarea
                    value={message.content}
                    onChange={(e) => handleMessageChange(message.id, e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter your message..."
                  />
                  
                  {/* Character Counter */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">{message.characterCount} characters</span>
                    <span className={`font-medium ${
                      message.isWithinLimit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {message.isWithinLimit ? 'Within limit' : 'Over limit'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

