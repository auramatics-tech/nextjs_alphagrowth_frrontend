'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, Eye, MessageCircle, Linkedin } from 'lucide-react';

interface WorkflowStepItemProps {
  step: {
    id: string;
    title: string;
    description: string;
    type: 'action' | 'condition';
    channel: 'linkedin' | 'email' | 'voice' | 'generic';
    icon: string;
    hasContent: boolean;
    content?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function WorkflowStepItem({ step, isSelected, onClick }: WorkflowStepItemProps) {
  const getIconComponent = (iconName: string, channel: string) => {
    const iconProps = { size: 18, className: "text-gray-600" };
    
    switch (iconName) {
      case 'message':
        if (channel === 'linkedin') {
          return (
            <div className="relative">
              <MessageSquare {...iconProps} />
              <Linkedin size={8} className="absolute -bottom-1 -right-1 text-blue-600" />
            </div>
          );
        }
        return <MessageSquare {...iconProps} />;
      case 'email':
        return <Mail {...iconProps} />;
      case 'eye':
        return <Eye {...iconProps} />;
      case 'follow-up':
        return (
          <div className="relative">
            <MessageCircle {...iconProps} />
            <Linkedin size={8} className="absolute -bottom-1 -right-1 text-blue-600" />
          </div>
        );
      default:
        return <MessageSquare {...iconProps} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'action':
        return 'bg-blue-100 text-blue-800';
      case 'condition':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'linkedin':
        return 'LinkedIn';
      case 'email':
        return 'Email';
      case 'voice':
        return 'Voice';
      default:
        return 'Generic';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-orange-500 bg-orange-50 shadow-sm' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIconComponent(step.icon, step.channel)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-medium text-sm ${
              isSelected ? 'text-orange-900' : 'text-gray-900'
            }`}>
              {step.title}
            </h4>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(step.type)}`}>
              {step.type}
            </span>
          </div>
          
          <p className={`text-xs mb-2 ${
            isSelected ? 'text-orange-700' : 'text-gray-600'
          }`}>
            {step.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {getChannelLabel(step.channel)}
            </span>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {step.hasContent ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Content added</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>No content</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

