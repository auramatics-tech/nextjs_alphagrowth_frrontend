'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ChevronDown, ChevronRight, Users, Mail, Clipboard, Phone, Play, GitBranch,
  Eye, UserPlus, MessageSquare, Mic, UserCheck, ThumbsUp, Clock, Database, Settings
} from 'lucide-react';

// Configuration for accordion sections and draggable nodes
const WORKFLOW_CONFIG = [
  {
    id: 'campaign-steps',
    title: 'Campaign Steps',
    subtitle: 'Build your workflow',
    icon: FileText,
    iconColor: 'text-orange-500',
    isExpanded: true,
    content: {
      filterPills: [
        { id: 'linkedin', label: 'LinkedIn', icon: Users, active: true },
        { id: 'email', label: 'Email', icon: Mail, active: false },
        { id: 'tasks', label: 'Tasks', icon: Clipboard, active: false },
        { id: 'call', label: 'Call', icon: Phone, active: false },
        { id: 'actions', label: 'Actions', icon: Play, active: false },
        { id: 'conditions', label: 'Conditions', icon: GitBranch, active: false }
      ],
      nodes: {
        linkedin: [
          { id: 'visit-profile', title: 'Visit Profile', subtitle: 'Visit prospect\'s LinkedIn profile', icon: Eye, color: 'bg-blue-500' },
          { id: 'add-connection', title: 'Add Connection', subtitle: 'Send connection request', icon: UserPlus, color: 'bg-blue-500' },
          { id: 'send-message', title: 'Send Message', subtitle: 'Send personalized message', icon: MessageSquare, color: 'bg-blue-500' },
          { id: 'send-voice', title: 'Send Voice', subtitle: 'Send voice message', icon: Mic, color: 'bg-blue-500' },
          { id: 'follow', title: 'Follow', subtitle: 'Follow prospect\'s updates', icon: UserCheck, color: 'bg-blue-500' },
          { id: 'endorse', title: 'Endorse', subtitle: 'Endorse skills & expertise', icon: ThumbsUp, color: 'bg-blue-500' }
        ],
        email: [
          { id: 'send-email', title: 'Send Email', subtitle: 'Send personalized email', icon: Mail, color: 'bg-red-500' },
          { id: 'follow-up-email', title: 'Follow Up Email', subtitle: 'Send follow-up email', icon: Mail, color: 'bg-red-500' },
          { id: 'email-sequence', title: 'Email Sequence', subtitle: 'Start email sequence', icon: Mail, color: 'bg-red-500' }
        ],
        tasks: [
          { id: 'create-task', title: 'Create Task', subtitle: 'Create follow-up task', icon: Clipboard, color: 'bg-yellow-500' },
          { id: 'set-reminder', title: 'Set Reminder', subtitle: 'Set reminder task', icon: Clock, color: 'bg-yellow-500' },
          { id: 'update-crm', title: 'Update CRM', subtitle: 'Update CRM record', icon: Database, color: 'bg-yellow-500' }
        ],
        call: [
          { id: 'phone-call', title: 'Phone Call', subtitle: 'Make phone call', icon: Phone, color: 'bg-green-500' },
          { id: 'ai-voice-call', title: 'AI Voice Call', subtitle: 'AI-powered voice call', icon: Phone, color: 'bg-green-500' },
          { id: 'schedule-call', title: 'Schedule Call', subtitle: 'Schedule a call', icon: Phone, color: 'bg-green-500' }
        ],
        actions: [
          { id: 'visit-profile', title: 'Visit Profile', subtitle: 'Visit prospect\'s LinkedIn profile', icon: Eye, color: 'bg-blue-500' },
          { id: 'add-connection', title: 'Add Connection', subtitle: 'Send connection request', icon: UserPlus, color: 'bg-blue-500' },
          { id: 'send-message', title: 'Send Message', subtitle: 'Send personalized message', icon: MessageSquare, color: 'bg-blue-500' }
        ],
        conditions: [
          { id: 'if-connected', title: 'If Connected', subtitle: 'Check if connection accepted', icon: GitBranch, color: 'bg-yellow-500' },
          { id: 'if-email-opened', title: 'If Email Opened', subtitle: 'Check if email was opened', icon: GitBranch, color: 'bg-yellow-500' },
          { id: 'has-email', title: 'Has Email', subtitle: 'Check if has professional email', icon: GitBranch, color: 'bg-yellow-500' }
        ]
      }
    }
  },
  {
    id: 'audience',
    title: 'Audience',
    subtitle: 'Target settings',
    icon: Users,
    iconColor: 'text-blue-500',
    isExpanded: false,
    content: null
  },
  {
    id: 'identity',
    title: 'Identity',
    subtitle: 'Sender profile',
    icon: UserCheck,
    iconColor: 'text-green-500',
    isExpanded: false,
    content: null
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'Campaign config',
    icon: Settings,
    iconColor: 'text-gray-500',
    isExpanded: false,
    content: null
  }
];

// DraggableNode component
interface DraggableNodeProps {
  node: {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
  };
  onDragStart?: (nodeId: string) => void;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ node, onDragStart }) => {
  const Icon = node.icon;

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={() => onDragStart?.(node.id)}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${node.color} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm leading-tight">{node.title}</div>
          <div className="text-xs text-gray-600 mt-1 leading-tight">{node.subtitle}</div>
        </div>
      </div>
    </motion.div>
  );
};

// AccordionSection component
interface AccordionSectionProps {
  section: typeof WORKFLOW_CONFIG[0];
  isExpanded: boolean;
  onToggle: () => void;
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
  onNodeDragStart?: (nodeId: string) => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  section,
  isExpanded,
  onToggle,
  activeFilter = 'linkedin',
  onFilterChange,
  onNodeDragStart
}) => {
  const Icon = section.icon;
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div className="relative">
      {/* Orange active bar */}
      {isExpanded && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B2C] rounded-r-sm" />
      )}
      
      {/* Accordion Header */}
      <button
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isExpanded ? 'bg-orange-50' : 'hover:bg-gray-100'
        }`}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={section.iconColor} />
          <div>
            <div className="font-semibold text-gray-900 text-sm">{section.title}</div>
            <div className="text-xs text-gray-600">{section.subtitle}</div>
          </div>
        </div>
        <ChevronIcon size={16} className="text-gray-400" />
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isExpanded && section.content && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              {/* Filter Pills */}
              {section.content.filterPills && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {section.content.filterPills.map((pill) => {
                    const PillIcon = pill.icon;
                    const isActive = activeFilter === pill.id;
                    
                    return (
                      <button
                        key={pill.id}
                        onClick={() => onFilterChange?.(pill.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#FF6B2C] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <PillIcon size={14} />
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Draggable Nodes Grid */}
              {section.content.nodes && (
                <div className="grid grid-cols-1 gap-3">
                  {section.content.nodes[activeFilter as keyof typeof section.content.nodes]?.map((node) => (
                    <DraggableNode
                      key={node.id}
                      node={node}
                      onDragStart={onNodeDragStart}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main WorkflowSidebar component
interface WorkflowSidebarProps {
  className?: string;
  onNodeDragStart?: (nodeId: string) => void;
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ 
  className = '', 
  onNodeDragStart 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['campaign-steps'])
  );
  const [activeFilter, setActiveFilter] = useState('linkedin');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const handleNodeDragStart = (nodeId: string) => {
    console.log('Dragging node:', nodeId);
    onNodeDragStart?.(nodeId);
  };

  return (
    <div className={`w-96 bg-gray-50 border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileText size={24} className="text-[#FF6B2C]" />
          <div>
            <h2 className="text-lg font-bold text-[#1E1E1E]">Campaign Steps</h2>
            <p className="text-sm text-gray-600">Build your workflow</p>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="flex-1 overflow-y-auto">
        {WORKFLOW_CONFIG.map((section) => (
          <AccordionSection
            key={section.id}
            section={section}
            isExpanded={expandedSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onNodeDragStart={handleNodeDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowSidebar;
