'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, User, BarChart3, Users, Mail, Clipboard, Phone, Play, GitBranch,
  Eye, UserPlus, MessageSquare, Mic, UserCheck, ThumbsUp, Clock, Database,
  Settings, ChevronDown, ChevronRight, FileText, Target, Send, CheckCircle,
  Plus, MessageCircle, X, Star, HelpCircle, Contact, Briefcase
} from 'lucide-react';

// Configuration for workflow elements
const WORKFLOW_STEPS = [
  { id: 'setup', icon: '📋', label: 'Setup', status: 'completed' },
  { id: 'audience', icon: '🎯', label: 'Audience', status: 'completed' },
  { id: 'workflow', icon: '🔗', label: 'Workflow', status: 'active' },
  { id: 'content', icon: '📧', label: 'Content', status: 'upcoming' },
  { id: 'review', icon: '✅', label: 'Review', status: 'upcoming' },
  { id: 'launch', icon: '🚀', label: 'Launch', status: 'upcoming' }
];

const WORKFLOW_SECTIONS = [
  {
    id: 'workflow-builder',
    title: 'Workflow Builder',
    subtitle: 'Design your campaign flow',
    icon: BarChart3,
    iconColor: 'text-orange-500',
    isExpanded: true,
    showCheckmark: true
  },
  {
    id: 'identity-sender',
    title: 'Identity & Sender',
    subtitle: 'Choose campaign identity',
    icon: Contact,
    iconColor: 'text-orange-500',
    isExpanded: false,
    showEllipsis: true
  },
  {
    id: 'audience-targeting',
    title: 'Audience & Targeting',
    subtitle: 'Select your target audience',
    icon: Target,
    iconColor: 'text-blue-500',
    isExpanded: false,
    showEllipsis: true
  },
  {
    id: 'content-messages',
    title: 'Content & Messages',
    subtitle: 'Craft your campaign content',
    icon: Mail,
    iconColor: 'text-orange-500',
    isExpanded: false,
    showEllipsis: true
  },
  {
    id: 'campaign-settings',
    title: 'Campaign Settings',
    subtitle: 'Configure automation rules',
    icon: Settings,
    iconColor: 'text-gray-500',
    isExpanded: false,
    showEllipsis: true
  },
  {
    id: 'engagement-rules',
    title: 'Engagement Rules',
    subtitle: 'Set timing & conditions',
    icon: Clock,
    iconColor: 'text-yellow-500',
    isExpanded: false,
    showEllipsis: true
  },
  {
    id: 'launch-campaign',
    title: 'Launch Campaign',
    subtitle: 'Go live with your campaign',
    icon: Send,
    iconColor: 'text-green-500',
    isExpanded: false,
    showEllipsis: true
  }
];

const FILTER_PILLS = [
  { id: 'linkedin', label: 'LinkedIn', icon: Users, active: true },
  { id: 'email', label: 'Email', icon: Mail, active: false },
  { id: 'tasks', label: 'Tasks', icon: Clipboard, active: false },
  { id: 'actions', label: 'Actions', icon: Play, active: false }
];

const ACTION_NODES = {
  linkedin: [
    { id: 'visit-profile', title: 'Visit Profile', subtitle: 'Visit prospect&apos;s LinkedIn profile', icon: Eye, color: 'bg-blue-500' },
    { id: 'add-connection', title: 'Add Connection', subtitle: 'Send connection request', icon: UserPlus, color: 'bg-blue-500' },
    { id: 'send-message', title: 'Send Message', subtitle: 'Send personalized message', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'send-voice', title: 'Send Voice', subtitle: 'Send voice message', icon: Mic, color: 'bg-blue-500' },
    { id: 'follow', title: 'Follow', subtitle: 'Follow prospect&apos;s updates', icon: UserCheck, color: 'bg-blue-500' },
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
  actions: [
    { id: 'visit-profile', title: 'Visit Profile', subtitle: 'Visit prospect&apos;s LinkedIn profile', icon: Eye, color: 'bg-blue-500' },
    { id: 'add-connection', title: 'Add Connection', subtitle: 'Send connection request', icon: UserPlus, color: 'bg-blue-500' },
    { id: 'send-message', title: 'Send Message', subtitle: 'Send personalized message', icon: MessageSquare, color: 'bg-blue-500' }
  ]
};

// Header Component
const Header: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-[#1E1E1E]">Campaign</h1>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Bell size={20} />
          </button>
          <button className="w-8 h-8 bg-[#FF6B2C] rounded-full flex items-center justify-center text-white font-semibold text-sm">
            U
          </button>
        </div>
      </div>

      {/* Campaign Header */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1E1E1E]">Campaign: Test Campaign</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FF6B2C] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Progress Stepper Component
const ProgressStepper: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-4">
        {WORKFLOW_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                  step.status === 'active' 
                    ? 'bg-[#FF6B2C] text-white shadow-lg' 
                    : step.status === 'completed'
                    ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: step.status === 'active' ? 1.1 : 1,
                  boxShadow: step.status === 'active' ? '0 0 20px rgba(255, 107, 44, 0.3)' : 'none'
                }}
                transition={{ duration: 0.3 }}
              >
                {step.status === 'completed' ? <CheckCircle size={20} /> : step.icon}
              </motion.div>
              <span className={`text-xs font-medium mt-2 transition-colors ${
                step.status !== 'upcoming' ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            {index < WORKFLOW_STEPS.length - 1 && (
              <motion.div 
                className={`w-8 h-0.5 mx-2 transition-all duration-500 ${
                  step.status === 'completed' 
                    ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF]' 
                    : 'bg-gray-300'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step.status === 'completed' ? 1 : 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Draggable Node Component
interface DraggableNodeProps {
  node: {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
  };
  onDragStart?: (nodeId: string) => void;
  onClick?: (nodeId: string) => void;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ node, onDragStart, onClick }) => {
  const Icon = node.icon;

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-md"
      draggable
      onDragStart={() => onDragStart?.(node.id)}
      onClick={() => onClick?.(node.id)}
      whileHover={{ scale: 1.02, y: -1 }}
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

// Campaign Steps Modal Component (Exact Match to Screenshot)
const CampaignStepsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onNodeDragStart?: (nodeId: string) => void;
  onNodeClick?: (nodeId: string) => void;
}> = ({ isOpen, onClose, activeFilter, onFilterChange, onNodeDragStart, onNodeClick }) => {
  const [activeTab, setActiveTab] = useState('actions');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-start">
      <motion.div 
        className="bg-white w-full max-w-md rounded-2xl shadow-xl m-4 max-h-[calc(100vh-2rem)] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0, x: -20 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        exit={{ scale: 0.95, opacity: 0, x: -20 }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-orange-500" />
            <h2 className="text-lg font-bold text-[#1E1E1E]">Campaign Steps</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Workflow Builder Section */}
        <div className="border-b border-gray-200">
          <div className="relative">
            {/* Orange active bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B2C] rounded-r-sm" />
            
            {/* Section Content */}
            <div className="bg-orange-50 p-6 ml-1">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 size={18} className="text-orange-500" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">Workflow Builder</div>
                  <div className="text-xs text-gray-600">Design your campaign flow</div>
                </div>
                <CheckCircle size={16} className="text-green-500" />
              </div>

              {/* Workflow Builder Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Workflow Builder</h3>
                  <p className="text-sm text-gray-600 mb-4">Design your campaign automation flow with drag & drop actions</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mb-6">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                      <Star size={16} />
                      Upgrade to Pro
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      <HelpCircle size={16} />
                      Help
                    </button>
                  </div>

                  {/* Filter Pills - Exact Match to Screenshot */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => onFilterChange('linkedin')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === 'linkedin'
                          ? 'bg-[#FF6B2C] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Users size={16} />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => onFilterChange('email')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === 'email'
                          ? 'bg-[#FF6B2C] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Mail size={16} />
                      Email
                    </button>
                    <button
                      onClick={() => onFilterChange('tasks')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === 'tasks'
                          ? 'bg-[#FF6B2C] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Clipboard size={16} />
                      Tasks
                    </button>
                  </div>

                  {/* Action/Condition Toggle - Exact Match to Screenshot */}
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setActiveTab('actions')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'actions'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Play size={16} />
                      Actions
                    </button>
                    <button 
                      onClick={() => setActiveTab('conditions')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'conditions'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <GitBranch size={16} />
                      Conditions
                    </button>
                  </div>

                  {/* Action Nodes Grid - Exact Match to Screenshot */}
                  {activeTab === 'actions' && (
                    <div className="grid grid-cols-1 gap-3">
                      {ACTION_NODES[activeFilter as keyof typeof ACTION_NODES]?.map((node) => (
                        <DraggableNode
                          key={node.id}
                          node={node}
                          onDragStart={onNodeDragStart}
                          onClick={onNodeClick}
                        />
                      ))}
                    </div>
                  )}

                  {/* Condition Nodes for Conditions Tab */}
                  {activeTab === 'conditions' && (
                    <div className="grid grid-cols-1 gap-3">
                      <DraggableNode
                        node={{ id: 'if-connected', title: 'If Connected', subtitle: 'Check if connection accepted', icon: GitBranch, color: 'bg-yellow-500' }}
                        onDragStart={onNodeDragStart}
                        onClick={onNodeClick}
                      />
                      <DraggableNode
                        node={{ id: 'if-email-opened', title: 'If Email Opened', subtitle: 'Check if email was opened', icon: GitBranch, color: 'bg-yellow-500' }}
                        onDragStart={onNodeDragStart}
                        onClick={onNodeClick}
                      />
                      <DraggableNode
                        node={{ id: 'has-email', title: 'Has Email', subtitle: 'Check if has professional email', icon: GitBranch, color: 'bg-yellow-500' }}
                        onDragStart={onNodeDragStart}
                        onClick={onNodeClick}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Workflow Sections - Exact Match to Screenshot */}
        <div className="divide-y divide-gray-200">
          {WORKFLOW_SECTIONS.slice(1).map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="p-4">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-r-sm" />
                  <div className="bg-orange-50 rounded-lg p-4 ml-2">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={section.iconColor} />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{section.title}</div>
                        <div className="text-xs text-gray-600">{section.subtitle}</div>
                      </div>
                      {section.showEllipsis && (
                        <span className="text-xs text-gray-500">...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

// Workflow Sidebar Component
const WorkflowSidebar: React.FC<{
  onOpenCampaignSteps?: () => void;
}> = ({ onOpenCampaignSteps }) => {
  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-[#1E1E1E]">Campaign</h3>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Workflow Section */}
        <div className="relative border-b border-gray-200">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B2C] rounded-r-sm" />
          
          <button 
            onClick={onOpenCampaignSteps}
            className="w-full bg-orange-50 p-4 text-left hover:bg-orange-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={18} className="text-orange-500" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Workflow</div>
                <div className="text-xs text-gray-600">Build your workflow</div>
              </div>
            </div>
          </button>
        </div>

        {/* Other Sidebar Sections */}
        {WORKFLOW_SECTIONS.slice(1).map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="border-b border-gray-200">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon size={18} className={section.iconColor} />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{section.title}</div>
                    <div className="text-xs text-gray-600">{section.subtitle}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Canvas Component
const WorkflowCanvas: React.FC<{
  onAddFirstStep?: () => void;
  onViewAIMessages?: () => void;
}> = ({ onAddFirstStep, onViewAIMessages }) => {
  return (
    <div className="flex-1 bg-gray-50 relative">
      {/* Canvas Header */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <button 
          onClick={onViewAIMessages}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          <MessageCircle size={16} />
          View AI Messages
        </button>
        <button 
          onClick={onAddFirstStep}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6B2C] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={16} />
          Add First Step
        </button>
      </div>

      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Centered Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF6B2C] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <BarChart3 size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Workflow Builder</h2>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Design your campaign automation flow with drag & drop actions.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Campaign Builder Page
export default function CampaignBuilderPage() {
  const [showCampaignSteps, setShowCampaignSteps] = useState(true); // Open by default to match screenshot
  const [activeFilter, setActiveFilter] = useState('linkedin');

  const handleNodeDragStart = (nodeId: string) => {
    console.log('Node drag started:', nodeId);
    // Mock implementation - in real app, this would handle drag to canvas
  };

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
    // Mock implementation - in real app, this would add node to workflow
  };

  const handleAddFirstStep = () => {
    console.log('Add first step clicked');
    setShowCampaignSteps(true);
  };

  const handleViewAIMessages = () => {
    console.log('View AI messages clicked');
    // Mock implementation - in real app, this would show AI message panel
  };

  const handleOpenCampaignSteps = () => {
    setShowCampaignSteps(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <Header />

      {/* Progress Stepper */}
      <ProgressStepper />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Workflow Canvas */}
        <WorkflowCanvas 
          onAddFirstStep={handleAddFirstStep}
          onViewAIMessages={handleViewAIMessages}
        />

        {/* Workflow Sidebar */}
        <WorkflowSidebar 
          onOpenCampaignSteps={handleOpenCampaignSteps}
        />
      </div>

      {/* Campaign Steps Modal */}
      <AnimatePresence>
        {showCampaignSteps && (
          <CampaignStepsModal
            isOpen={showCampaignSteps}
            onClose={() => setShowCampaignSteps(false)}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onNodeDragStart={handleNodeDragStart}
            onNodeClick={handleNodeClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}