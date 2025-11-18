'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  MessageSquare, 
  Mic, 
  Clipboard, 
  ThumbsUp, 
  Phone, 
  UserPlus, 
  Eye, 
  Link, 
  Clock, 
  CheckCircle 
} from 'lucide-react';

interface NodeSelectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (nodeType: string) => void;
  title?: string;
  isReplaceMode?: boolean;
}

interface NodeItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  type: 'action' | 'condition';
}

// Mock data for nodes
const stepNodes: NodeItem[] = [
  {
    id: 'action_send_email',
    title: 'Send Email',
    subtitle: 'on Gmail',
    icon: Mail,
    type: 'action'
  },
  {
    id: 'action_send_message',
    title: 'Chat Message',
    subtitle: 'Send on Linkedin',
    icon: MessageSquare,
    type: 'action'
  },
  // {
  //   id: 'action_ai_voice_message',
  //   title: 'Voice Message',
  //   subtitle: 'on Linkedin',
  //   icon: Mic,
  //   type: 'action'
  // },
  {
    id: 'action_create_task',
    title: 'Create Task',
    subtitle: 'on Linkedin',
    icon: Clipboard,
    type: 'action'
  },
  {
    id: 'action_linkedin_like',
    title: 'Linkedin Like Post',
    subtitle: 'on Linkedin',
    icon: ThumbsUp,
    type: 'action'
  },
  {
    id: 'action_ai_voice_call',
    title: 'Ai Voice call',
    subtitle: 'Ai Voice call',
    icon: Phone,
    type: 'action'
  },
  {
    id: 'action_invitation',
    title: 'Invitations',
    subtitle: 'on Linkedin',
    icon: UserPlus,
    type: 'action'
  },
  {
    id: 'action_visit_profile',
    title: 'Visit Profile',
    subtitle: 'Visit Profile',
    icon: Eye,
    type: 'action'
  }
];

const conditionNodes: NodeItem[] = [
  
  {
    id: 'condition_has_email',
    title: 'Has Professional Email',
    subtitle: '',
    icon: CheckCircle,
    type: 'condition'
  },
  
  
  {
    id: 'condition_accepted_invite',
    title: 'If connected',
    subtitle: '',
    icon: CheckCircle,
    type: 'condition'
  },
  {
    id: 'condition_open_email',
    title: 'If email opened',
    subtitle: '',
    icon: CheckCircle,
    type: 'condition'
  },
  {
    id: 'condition_is_email_verified',
    title: 'If email verified',
    subtitle: '',
    icon: CheckCircle,
    type: 'condition'
  },
  {
    id: 'condition_has_phone_number',
    title: 'Has Phone Number',
    subtitle: '',
    icon: CheckCircle,
    type: 'condition'
  },
 
  {
    id: 'condition_open_message',
    title: 'Open Linkedin Message',
    subtitle: '',
    icon: MessageSquare,
    type: 'condition'
  }
];

export default function NodeSelectorDrawer({ isOpen, onClose, onSelectNode, title, isReplaceMode }: NodeSelectorDrawerProps) {
  const [activeTab, setActiveTab] = useState<'steps' | 'conditions'>('steps');

  // Preserve tab state when drawer reopens
  React.useEffect(() => {
    if (isOpen) {
      // Tab state is already preserved in component state
    }
  }, [isOpen]);

  const handleNodeClick = (nodeId: string) => {
    onSelectNode(nodeId);
    onClose();
  };

  const renderNodeSlider = (nodes: NodeItem[]) => {
    return (
      <div className="p-6">
        <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex gap-4 pb-2" style={{ width: 'max-content', minWidth: '100%' }}>
            {nodes.map((node) => {
              const IconComponent = node.icon;
              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNodeClick(node.id);
                    }
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', node.id);
                    e.dataTransfer.effectAllowed = 'move';
                    // Add visual feedback during drag
                    e.currentTarget.style.opacity = '0.5';
                    e.currentTarget.style.transform = 'rotate(2deg)';
                    e.currentTarget.style.transition = 'all 0.2s ease';
                  }}
                  onDragEnd={(e) => {
                    // Reset visual feedback after drag
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                  draggable
                  className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-center min-w-[160px] flex-shrink-0 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex-shrink-0">
                    <IconComponent size={24} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">{node.title}</h4>
                    {node.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">{node.subtitle}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full ml-0.5"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full ml-0.5"></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl max-h-[70vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex flex-col gap-3">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">
                  {isReplaceMode ? 'Replace Step' : 'Add New Step'}
                </h3>
                
                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('steps')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'steps'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Add Steps
                  </button>
                  <button
                    onClick={() => setActiveTab('conditions')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'conditions'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Add Conditions
                  </button>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto">
              {activeTab === 'steps' ? renderNodeSlider(stepNodes) : renderNodeSlider(conditionNodes)}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

