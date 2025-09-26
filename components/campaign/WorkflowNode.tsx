'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Mail, MessageSquare, Mic, Clipboard, ThumbsUp, Phone, UserPlus, Eye, Link, Clock, CheckCircle } from 'lucide-react';

interface WorkflowNodeProps {
  data: {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
  };
  onAddNext: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function WorkflowNode({ data, onAddNext, onEdit, onDelete }: WorkflowNodeProps) {
  const getIconComponent = (nodeType: string) => {
    const iconProps = { size: 18, className: "text-gray-600" };
    
    switch (nodeType) {
      case 'send-email':
        return <Mail {...iconProps} />;
      case 'chat-message':
        return <MessageSquare {...iconProps} />;
      case 'voice-message':
        return <Mic {...iconProps} />;
      case 'create-task':
        return <Clipboard {...iconProps} />;
      case 'linkedin-like':
        return <ThumbsUp {...iconProps} />;
      case 'call':
        return <Phone {...iconProps} />;
      case 'invitations':
        return <UserPlus {...iconProps} />;
      case 'visit-profile':
        return <Eye {...iconProps} />;
      case 'custom-condition':
      case 'has-professional-email':
      case 'email-not-accepted':
      case 'reach-goal':
      case 'if-connected':
      case 'if-email-opened':
      case 'if-email-verified':
      case 'has-phone-number':
      case 'if-email-link-clicked':
      case 'end-sequence':
      case 'open-linkedin-message':
        return <Link {...iconProps} />;
      case 'wait':
        return <Clock {...iconProps} />;
      default:
        return <CheckCircle {...iconProps} />;
    }
  };

  const getNodeTypeColor = (nodeType: string) => {
    // Check if it's a condition type
    const conditionTypes = [
      'custom-condition', 'has-professional-email', 'email-not-accepted', 'reach-goal',
      'if-connected', 'if-email-opened', 'if-email-verified', 'has-phone-number',
      'if-email-link-clicked', 'wait', 'end-sequence', 'open-linkedin-message'
    ];
    
    if (conditionTypes.includes(nodeType)) {
      return 'border-yellow-200 bg-yellow-50';
    }
    return 'border-blue-200 bg-blue-50';
  };

  const getNodeTypeLabel = (nodeType: string) => {
    const conditionTypes = [
      'custom-condition', 'has-professional-email', 'email-not-accepted', 'reach-goal',
      'if-connected', 'if-email-opened', 'if-email-verified', 'has-phone-number',
      'if-email-link-clicked', 'wait', 'end-sequence', 'open-linkedin-message'
    ];
    
    return conditionTypes.includes(nodeType) ? 'condition' : 'action';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative w-64 bg-white border-2 rounded-lg shadow-sm ${getNodeTypeColor(data.type)}`}
    >
      {/* Node Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getIconComponent(data.type)}
            <div>
              <h3 className="font-medium text-gray-900 text-sm">{data.title}</h3>
              {data.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{data.subtitle}</p>
              )}
            </div>
          </div>
          
          {/* More Options Button */}
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MoreVertical size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Type Badge */}
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            getNodeTypeLabel(data.type) === 'condition' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {getNodeTypeLabel(data.type)}
          </span>
        </div>
      </div>

      {/* Add Next Step Button */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
        <button
          onClick={onAddNext}
          className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
        >
          <Plus size={12} className="text-gray-600" />
        </button>
      </div>

      {/* Connection Line (for future use) */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-300"></div>
    </motion.div>
  );
}

