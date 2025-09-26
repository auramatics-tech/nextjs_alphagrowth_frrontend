'use client';

import React, { useState, useCallback } from 'react';
import { ArrowLeft, Eye, Save, Edit3, MessageSquare, Mail, MessageCircle, Linkedin } from 'lucide-react';
import WorkflowStepItem from './WorkflowStepItem';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'condition';
  channel: 'linkedin' | 'email' | 'voice' | 'generic';
  icon: string;
  hasContent: boolean;
  content?: string;
  characterLimit?: number;
}

// Mock workflow steps data
const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: '1',
    title: 'Send Message',
    description: 'Send personalized message',
    type: 'action',
    channel: 'linkedin',
    icon: 'message',
    hasContent: false,
    content: '',
    characterLimit: 300
  },
  {
    id: '2',
    title: 'Send Email',
    description: 'Send personalized email',
    type: 'action',
    channel: 'email',
    icon: 'email',
    hasContent: false,
    content: '',
    characterLimit: 1000
  },
  {
    id: '3',
    title: 'If Email Opened',
    description: 'Check if email was opened',
    type: 'condition',
    channel: 'generic',
    icon: 'eye',
    hasContent: false,
    content: '',
    characterLimit: 500
  },
  {
    id: '4',
    title: 'Follow Up Message',
    description: 'Send follow-up message',
    type: 'action',
    channel: 'linkedin',
    icon: 'follow-up',
    hasContent: false,
    content: '',
    characterLimit: 300
  }
];

// Available variables for personalization
const availableVariables = [
  { name: '{{firstName}}', description: 'Contact first name' },
  { name: '{{companyName}}', description: 'Contact company name' },
  { name: '{{industry}}', description: 'Contact industry' },
  { name: '{{title}}', description: 'Contact job title' },
  { name: '{{location}}', description: 'Contact location' },
  { name: '{{linkedinUrl}}', description: 'Contact LinkedIn URL' }
];

export default function CustomContentEditor() {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(mockWorkflowSteps);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  // Get selected step
  const selectedStep = selectedStepId ? workflowSteps.find(step => step.id === selectedStepId) : null;

  // Handle step selection
  const handleStepSelect = useCallback((stepId: string) => {
    setSelectedStepId(stepId);
  }, []);

  // Handle content change
  const handleContentChange = useCallback((stepId: string, content: string) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, content, hasContent: content.trim().length > 0 }
        : step
    ));
    setLastSaved(new Date());
  }, []);

  // Handle variable insertion
  const handleVariableInsert = useCallback((variable: string) => {
    if (selectedStep) {
      const currentContent = selectedStep.content || '';
      const newContent = currentContent + variable;
      handleContentChange(selectedStep.id, newContent);
    }
  }, [selectedStep, handleContentChange]);

  // Save all content
  const handleSaveAll = useCallback(() => {
    console.log('Saving all content...', workflowSteps);
    setLastSaved(new Date());
    // You could add a toast notification here
    // toast.success('All content saved successfully!');
  }, [workflowSteps]);

  // Preview content
  const handlePreview = useCallback(() => {
    console.log('Opening preview...', workflowSteps);
    // You could open a preview modal here
  }, [workflowSteps]);

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

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Content Editor</h1>
            <p className="text-sm text-gray-600">Test Campaign</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Autosaved {formatLastSaved(lastSaved)}</span>
          </div>
          <button
            onClick={handlePreview}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} className="inline mr-2" />
            Preview
          </button>
          <button
            onClick={handleSaveAll}
            className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Save size={16} />
            Save All Content
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Workflow Steps */}
        <div className="w-96 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Workflow Steps</h2>
              <p className="text-sm text-gray-600">Click on any step to add or edit content</p>
            </div>
            
            <div className="space-y-3">
              {workflowSteps.map((step) => (
                <WorkflowStepItem
                  key={step.id}
                  step={step}
                  isSelected={selectedStepId === step.id}
                  onClick={() => handleStepSelect(step.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane - Editing Area */}
        <div className="flex-1 bg-white overflow-y-auto">
          {selectedStep ? (
            <div className="p-6">
              {/* Step Header */}
              <div className="flex items-center gap-3 mb-6">
                {getIconComponent(selectedStep.icon, selectedStep.channel)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedStep.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedStep.description}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getChannelLabel(selectedStep.channel)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    value={selectedStep.content || ''}
                    onChange={(e) => handleContentChange(selectedStep.id, e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {selectedStep.content?.length || 0} / {selectedStep.characterLimit || 1000} characters
                    </span>
                    {(selectedStep.content?.length || 0) > (selectedStep.characterLimit || 1000) && (
                      <span className="text-xs text-red-600 font-medium">Over limit</span>
                    )}
                  </div>
                </div>

                {/* Available Variables */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Variables
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {availableVariables.map((variable) => (
                      <button
                        key={variable.name}
                        onClick={() => handleVariableInsert(variable.name)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {variable.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Click on any variable to insert it into your message
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Edit3 size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Step to Edit</h3>
                <p className="text-gray-600">
                  Choose a workflow step from the left to start adding content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
