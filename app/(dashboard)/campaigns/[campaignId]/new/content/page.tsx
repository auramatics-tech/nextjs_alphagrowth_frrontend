'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Mail, Phone, MessageSquare, Eye, ThumbsUp, Clipboard,
  User, Mic, Settings, Users, Briefcase, Send,
  BarChart3, Plus, X, GitBranch, Clock, Minus, MoreVertical, Save, RefreshCw, AlertCircle, Loader2, CheckCircle,
  Database, HelpCircle, Star, UserPlus, UserCheck, Play, MessageCircle, Search, Bell, ChevronRight,
  CalendarDays, Linkedin, Compass, FileText, Bot, Edit3, Info, ArrowLeft, ArrowRight
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'action' | 'condition';
  channel: string;
  action_key: string;
  label: string;
  description: string;
  icon: any;
  color: string;
  content?: {
    subject?: string;
    message?: string;
    variables?: string[];
  };
}

export default function ContentPage() {
  const router = useRouter();
  
  // Main state
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState<{ name: string } | null>(null);
  
  // Content editing state
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeContent, setNodeContent] = useState<{[key: string]: any}>({});
  const [showContentEditor, setShowContentEditor] = useState(false);

  // Mock workflow nodes - in real app, this would come from API
  const [workflowNodes] = useState<WorkflowNode[]>([
    {
      id: 'node-1',
      type: 'action',
      channel: 'linkedin',
      action_key: 'action_send_message',
      label: 'Send Message',
      description: 'Send personalized message',
      icon: MessageSquare,
      color: 'text-blue-500',
      content: {
        subject: '',
        message: '',
        variables: ['{{firstName}}', '{{companyName}}', '{{industry}}']
      }
    },
    {
      id: 'node-2',
      type: 'action',
      channel: 'email',
      action_key: 'action_send_email',
      label: 'Send Email',
      description: 'Send personalized email',
      icon: Mail,
      color: 'text-green-500',
      content: {
        subject: '',
        message: '',
        variables: ['{{firstName}}', '{{companyName}}', '{{email}}', '{{industry}}']
      }
    },
    {
      id: 'node-3',
      type: 'condition',
      channel: 'email',
      action_key: 'condition_email_opened',
      label: 'If Email Opened',
      description: 'Check if email was opened',
      icon: Eye,
      color: 'text-yellow-500',
      content: {
        subject: '',
        message: '',
        variables: ['{{firstName}}', '{{companyName}}']
      }
    },
    {
      id: 'node-4',
      type: 'action',
      channel: 'linkedin',
      action_key: 'action_send_message',
      label: 'Follow Up Message',
      description: 'Send follow-up message',
      icon: MessageSquare,
      color: 'text-blue-500',
      content: {
        subject: '',
        message: '',
        variables: ['{{firstName}}', '{{companyName}}', '{{industry}}']
      }
    }
  ]);

  // Initialize data
  useEffect(() => {
    setLoading(false);
    setCampaignData({ name: 'Test Campaign' });
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    setShowContentEditor(true);
  }, []);

  const handleContentSave = useCallback((nodeId: string, content: any) => {
    setNodeContent(prev => ({
      ...prev,
      [nodeId]: content
    }));
    setShowContentEditor(false);
    setSelectedNode(null);
  }, []);

  const handleBackToWorkflow = useCallback(() => {
    router.back();
  }, [router]);

  const getNodeIcon = (node: WorkflowNode) => {
    const IconComponent = node.icon;
    return <IconComponent size={20} className={node.color} />;
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'linkedin':
        return <Linkedin size={16} className="text-blue-600" />;
      case 'email':
        return <Mail size={16} className="text-green-600" />;
      case 'call':
        return <Phone size={16} className="text-orange-600" />;
      default:
        return <MessageSquare size={16} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading content editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToWorkflow}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#1E1E1E]">Content Editor</h1>
              <p className="text-sm text-gray-600">{campaignData?.name || 'Test Campaign'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Preview
            </button>
            <button className="px-4 py-2 btn-primary rounded-lg">
              Save All Content
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Workflow Nodes List */}
        <div className="w-1/3 bg-white border-r border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Workflow Steps</h2>
            <p className="text-sm text-gray-600">Click on any step to add or edit content</p>
          </div>

          <div className="space-y-3">
            {workflowNodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedNode === node.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => handleNodeClick(node.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getNodeIcon(node)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{node.label}</span>
                      {getChannelIcon(node.channel)}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        node.type === 'action' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {node.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{node.description}</p>
                    <div className="flex items-center gap-2">
                      {nodeContent[node.id] ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={12} />
                          <span className="text-xs">Content added</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Edit3 size={12} />
                          <span className="text-xs">No content</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Editor Area */}
        <div className="flex-1 p-6">
          {!showContentEditor ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Edit3 size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Step to Edit</h3>
                <p className="text-gray-600">Choose a workflow step from the left to start adding content</p>
              </div>
            </div>
          ) : (
            <ContentEditor
              node={workflowNodes.find(n => n.id === selectedNode)!}
              content={nodeContent[selectedNode!] || {}}
              onSave={(content) => handleContentSave(selectedNode!, content)}
              onCancel={() => {
                setShowContentEditor(false);
                setSelectedNode(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface ContentEditorProps {
  node: WorkflowNode;
  content: any;
  onSave: (content: any) => void;
  onCancel: () => void;
}

function ContentEditor({ node, content, onSave, onCancel }: ContentEditorProps) {
  const [formData, setFormData] = useState({
    subject: content.subject || '',
    message: content.message || '',
    ...content
  });

  const handleSave = () => {
    onSave(formData);
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('message') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + variable + after;
      
      setFormData(prev => ({
        ...prev,
        message: newText
      }));
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {node.icon && <node.icon size={24} className={node.color} />}
          <h2 className="text-xl font-semibold text-gray-900">{node.label}</h2>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
            {node.channel}
          </span>
        </div>
        <p className="text-gray-600">{node.description}</p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Subject Field (for email) */}
        {node.channel === 'email' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter email subject..."
            />
          </div>
        )}

        {/* Message Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Content
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Write your message here..."
          />
        </div>

        {/* Variables */}
        {node.content?.variables && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {node.content.variables.map((variable: string) => (
                <button
                  key={variable}
                  onClick={() => insertVariable(variable)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {variable}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click on any variable to insert it into your message
            </p>
          </div>
        )}

        {/* Character Count (for LinkedIn) */}
        {node.channel === 'linkedin' && (
          <div className="text-right">
            <span className={`text-sm ${
              formData.message.length > 3000 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {formData.message.length}/3000 characters
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 btn-primary rounded-lg"
        >
          Save Content
        </button>
      </div>
    </div>
  );
}
