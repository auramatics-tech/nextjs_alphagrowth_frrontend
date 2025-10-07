'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Eye, Save, Edit3, MessageSquare, Mail, MessageCircle, Linkedin } from 'lucide-react';
import WorkflowStepItem from './WorkflowStepItem';
import { campaignService } from '@/services/campaignService';




// Available variables for personalization
const availableVariables = [
  { name: '{{first_name}}', description: 'Contact first name' },
  { name: '{{Company}}', description: 'Contact company name' },
  { name: '{{Industry}}', description: 'Contact industry' },
  { name: '{{lead_title}}', description: 'Contact job title' },
  { name: '{{lead_location}}', description: 'Contact location' },
  { name: '{{lead_website}}', description: 'Contact website' }
];

interface CustomContentEditorProps {
  campaignId: string;
}

export default function CustomContentEditor({ campaignId }: CustomContentEditorProps) {
  const [workflowSteps, setWorkflowSteps] = useState<any[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  const selectedStep = selectedStepId ? workflowSteps.find(step => step.id === selectedStepId) : null;

  // State for variable insertion
  const [activeField, setActiveField] = useState<'subject' | 'message'>('message');
  const [inputRefs, setInputRefs] = useState<{
    subject: HTMLInputElement | null;
    message: HTMLTextAreaElement | null;
  }>({
    subject: null,
    message: null
  });

  const [dirtyNodes, setDirtyNodes] = useState<Record<string, boolean>>({});

  // Stable ref setters to prevent infinite loops
  const setSubjectRef = useCallback((el: HTMLInputElement | null) => {
    setInputRefs(prev => ({ ...prev, subject: el }));
  }, []);

  const setMessageRef = useCallback((el: HTMLTextAreaElement | null) => {
    setInputRefs(prev => ({ ...prev, message: el }));
  }, []);

  const loadNodes = async () => {
    try {
      const flow = await campaignService.getCampaignFlow(campaignId);
      const nodes = flow?.data?.nodes || flow?.nodes || [];
      const edges = flow?.data?.edges || flow?.edges || [];

      // helper: compute traversal order using DAG topological BFS from sources (no incoming)
      const computeOrder = () => {
        const nodeIds = nodes.map((n: any) => n.id?.toString());
        const inDegree: Record<string, number> = {};
        nodeIds.forEach((nid: string) => (inDegree[nid] = 0));
        edges.forEach((e: any) => {
          const t = e.target?.toString();
          if (t && t in inDegree) inDegree[t] += 1;
        });
        const queue: string[] = [];
        Object.keys(inDegree).forEach((nodeId: string) => { if (inDegree[nodeId] === 0) queue.push(nodeId); });
        // tie-break by x then y position for nicer ordering
        const getPos = (id: string) => {
          const n = nodes.find((x: any) => x.id?.toString() === id);
          const p = n?.position || { x: 0, y: 0 };
          return [p.x, p.y];
        };
        queue.sort((a, b) => getPos(a)[0] - getPos(b)[0] || getPos(a)[1] - getPos(b)[1]);
        const order: Record<string, number> = {};
        let idx = 1;
        while (queue.length) {
          const id = queue.shift() as string;
          order[id] = idx++;
          const outs = edges.filter((e: any) => e.source?.toString() === id).map((e: any) => e.target?.toString());
          outs.forEach((t: string | undefined) => {
            if (!t) return;
            inDegree[t] -= 1;
            if (inDegree[t] === 0) queue.push(t);
          });
          queue.sort((a, b) => getPos(a)[0] - getPos(b)[0] || getPos(a)[1] - getPos(b)[1]);
        }
        return order;
      };
      const topoOrder = computeOrder();
 


      const mapped: any[] = nodes.map((n: any, idx: number) => {
        const data = n.data || {};
        const label = data.label || data.title || n.id || `Step ${idx + 1}`;
        const subtype = data.subtype || data.type || n.type || 'action';
        const channelRaw = data.channel || data.iconType || '';
        const actionKey = data?.action_key || data?.actionKey || n?.type;
        const message = data?.message;
        console.log("message---", message);

        // Prefer action_key to determine channel reliably
        let channel: any = 'generic';
        if (actionKey === 'action_send_email') channel = 'email';
        else if (actionKey === 'action_send_message') channel = 'linkedin';
        else channel = /email/i.test(channelRaw) ? 'email' : /linkedin|li/i.test(channelRaw) ? 'linkedin' : 'generic';
        const isCondition = /condition/i.test(subtype) || /if_/i.test(n.type || '');
        const editable = actionKey === 'action_send_message' || actionKey === 'action_send_email';

        return {
          id: n.id?.toString() || `${idx + 1}`,
          title: label,
          description: data.subtitle || (isCondition ? 'Condition' : 'Send personalized message'),
          type: isCondition ? 'condition' : 'action',
          channel: channel,
          icon: isCondition ? 'eye' : channel === 'email' ? 'email' : channel === 'linkedin' ? 'message' : 'message',
          hasContent: false,
          content: message,
          characterLimit: channel === 'linkedin' ? 300 : channel === 'email' ? 1000 : 500,
          day: data?.delayInDays ?? data?.day ?? 0,
          order: topoOrder[n.id?.toString()] || data?.order || idx + 1,
          editable,
        } as any;
      });

      const sorted = [...mapped].sort((a, b) => (a.day || 0) - (b.day || 0) || (a.order || 0) - (b.order || 0));
      setWorkflowSteps(sorted);
      // pick initial selection and load its content from server so refresh shows text
      if (sorted.length > 0 && !selectedStepId) {
        const initialId = sorted.find(s => s.type === 'action' && s.editable)?.id || sorted[0].id;
        setSelectedStepId(initialId);

      }
    } catch (e) {


    }
  };


  // Handle step selection: lazy-load message if not loaded
  const handleStepSelect = useCallback(async (stepId: string) => {
    setSelectedStepId(stepId);
    try {

    } catch (e: any) {

    }
  }, []);
 

  // Save current node (Debounced via user interactions)
  const saveCurrentNode = useCallback(async (e: any) => {




    const data: any = {};

    if (!selectedStepId) return;
    const step = workflowSteps.find(s => s.id === selectedStepId);

    if (e.target.name == "subject") {
      data.subject = e.target.value
      data.message = step?.content?.message
    } else {
      data.message = e.target.value
      data.subject = step?.content?.subject
    }

    const payload: any = { node_id: selectedStepId, data };
    try {


      await campaignService.upsertCampaignNodeMessage(payload);
      loadNodes();

    } catch (e: any) {

    } finally {

    }
  }, [selectedStepId, workflowSteps, dirtyNodes]);

  // Handle variable insertion
  const handleVariableInsert = useCallback((variable: string) => {
    if (!selectedStep || !selectedStepId) return;
    
    // Get the active input element
    const activeInput = activeField === 'subject' ? inputRefs.subject : inputRefs.message;
    
    if (!activeInput) return;
    
    // Focus the input to ensure it's active
    activeInput.focus();
    
    // Get cursor position
    const cursorPos = activeInput.selectionStart || 0;
    
    // Insert the variable at cursor position
    const currentValue = activeInput.value;
    const newValue = currentValue.slice(0, cursorPos) + variable + currentValue.slice(cursorPos);
    
    // Update the input value
    activeInput.value = newValue;
    
    // Set cursor position after the inserted text
    activeInput.setSelectionRange(cursorPos + variable.length, cursorPos + variable.length);
    
    // Create a synthetic event that matches your onChange signature
    const syntheticEvent = {
      target: {
        name: activeField,
        value: newValue
      }
    };
    
    // Call your existing saveCurrentNode directly
    saveCurrentNode(syntheticEvent);
    
  }, [selectedStep, selectedStepId, activeField, inputRefs, saveCurrentNode]);




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

  useEffect(() => {

    loadNodes();
  }, [campaignId]);



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

          <button

            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} className="inline mr-2" />
            Preview
          </button>
          <button

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
                  disabled={!step.editable}
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
                {selectedStep.channel === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      ref={setSubjectRef}
                      name="subject"
                      type="text"
                      value={selectedStep?.content?.subject || ''}
                      onChange={saveCurrentNode}
                      onFocus={() => setActiveField('subject')}
                      placeholder="Write your email subject..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    ref={setMessageRef}
                    name="message"
                    value={selectedStep?.content?.message || ''}
                    onChange={saveCurrentNode}
                    onFocus={() => setActiveField('message')}
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
                    Click on any variable to insert it at cursor position in your {activeField === 'subject' ? 'subject line' : 'message'}
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
