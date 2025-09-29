'use client';

import React, { useState, useEffect, memo } from 'react';
import {
  Mail,
  Linkedin,
  Mic,
  User,
  Phone,
  Eye,
  Copy,
  Trash2,
  Edit,
  Plus,
  Minus,
  Clock,
  GitBranch,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  Clipboard,
  MoreVertical
} from 'lucide-react';
import {
  Handle,
  Position,
} from '@xyflow/react';

// Helper function to get user-friendly node names
const getFriendlyNodeName = (nodeType: string, label: string) => {
  const nameMap: { [key: string]: string } = {
    'condition_custom': 'Custom Condition',
    'action_linkedin_like': 'Like LinkedIn Post',
    'condition_open_linkedin_message': 'If LinkedIn Message Opened',
    'condition_email_opened': 'If Email Opened',
    'condition_link_clicked': 'If Link Clicked',
    'condition_form_submitted': 'If Form Submitted',
    'action_send_email': 'Send Email',
    'action_wait': 'Wait',
    'action_linkedin_connect': 'Connect on LinkedIn',
    'action_linkedin_message': 'Send LinkedIn Message',
    'action_visit_profile': 'Visit Profile',
    'action_add_connection': 'Add Connection',
    'action_follow': 'Follow',
    'action_unfollow': 'Unfollow',
    'action_like_post': 'Like Post',
    'action_comment': 'Comment',
    'action_share': 'Share',
    'action_call': 'Make Call',
    'action_sms': 'Send SMS',
    'action_schedule_meeting': 'Schedule Meeting'
  };
  
  // First try to match by nodeType, then by label, then return original label
  return nameMap[nodeType] || nameMap[label] || label;
};

interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    iconType: string;
    action_key: string;
    subtitle?: string;
    isCondition?: boolean;
    hasYesBranch?: boolean;
    hasNoBranch?: boolean;
    onPlusClick?: () => void;
    onYesClick?: () => void;
    onNoClick?: () => void;
    onYesDrop?: (nodeType: string) => void;
    onNoDrop?: (nodeType: string) => void;
    onReplaceClick?: () => void;
    onDeleteClick?: () => void;
    onNodeClick?: () => void;
    closeDropdownTrigger?: boolean;
    wait_time?: number;
    duration?: number; // Duration in days for any node
    source?: string;
    onWaitTimeChange?: (nodeId: string, waitTimeInMinutes: number) => void;
    onDurationChange?: (nodeId: string, durationInDays: number) => void;
    onEditClick?: () => void;
  };
  onNodeClick?: (nodeId: string, nodeData: any) => void;
  onWaitTimeChange?: (nodeId: string, waitTimeInMinutes: number) => void;
  onDurationChange?: (nodeId: string, durationInDays: number) => void;
  onNodeDragOver?: (event: React.DragEvent, nodeId: string) => void;
  onNodeDrop?: (event: React.DragEvent, nodeId: string) => void;
}

const CustomNode = memo(function CustomNode({ id, data, onNodeClick, onWaitTimeChange, onDurationChange, onNodeDragOver, onNodeDrop }: CustomNodeProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [showWaitPopup, setShowWaitPopup] = useState(false);
  const [isDurationEditing, setIsDurationEditing] = useState(false);
      

  const toggleWaitPopup = () => setShowWaitPopup(prev => !prev);

  useEffect(() => {
    if (data.wait_time) {
      const days = Math.round(data.wait_time / 1440);
      setCount(days > 0 ? days : 1);
    } else if (data.duration) {
      setCount(data.duration > 0 ? data.duration : 1);
    }
  }, [data.wait_time, data.duration]);

  const handleIncrement = () => {

    
    const newCount = count + 1;
    setCount(newCount);
        // data.onWaitTimeChange?.(id, newCount * 1440); 
    if (data.wait_time !== undefined) {
          console.log("fkljk");
      data.onWaitTimeChange?.(id, newCount * 1440); // convert to minutes for wait nodes
    } else {
          console.log("fkljks");
      data.onWaitTimeChange?.(id, newCount); // use days for other nodes
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      if (data.wait_time !== undefined) {
        onWaitTimeChange?.(id, newCount * 1440); // convert to minutes for wait nodes
      } else {
        onDurationChange?.(id, newCount); // use days for other nodes
      }
    }
  };

  useEffect(() => {
    if (data.closeDropdownTrigger) {
      setIsDropdownOpen(false);
    }
  }, [data.closeDropdownTrigger]);

  const iconMap = {
    action_send_email: <Mail size={21} className="text-blue-500" />,
    linkedin: <Linkedin size={22} className="text-blue-600" />,
    action_ai_voice_message: <Mic size={20} className="text-purple-500" />,
    action_ai_voice_call: <Phone size={20} className="text-green-500" />,
    action_invitation: <User size={22} className="text-gray-800" />,
    action_send_message: <MessageSquare size={32} className="text-blue-600" />,
    action_call: <Phone size={32} className="text-gray-800" />,
    action_visit_profile: <Eye size={32} className="text-gray-800" />,
    condition: <GitBranch size={20} className="text-gray-600" />,
    condition_accepted_invite: <GitBranch size={20} className="text-gray-600" />,
    condition_has_email: <Mail size={20} className="text-green-600" />,
    condition_has_phone_number: <Phone size={20} className="text-green-600" />,
    condition_open_email: <Mail size={20} className="text-blue-600" />,
    condition_link_clicked: <MessageSquare size={20} className="text-blue-600" />,
    condition_is_email_verified: <ShieldCheck size={20} className="text-green-600" />,
    condition_open_message: <MessageSquare size={20} className="text-blue-600" />,
    action_list_post: <ThumbsUp size={20} className="text-blue-600" />,
        action_create_task: <Clipboard size={20} className="text-green-600" />,
    LikePost: <ThumbsUp size={20} className="text-blue-600" />,
    createtask: <Clipboard size={20} className="text-green-600" />
  };

  const getNodeColor = () => {
    if (data.isCondition) {
      return 'border-gray-200 bg-gray-50';
    }
    return 'border-blue-200 bg-blue-50';
  };

  return (
    <>
      <style jsx>{`
        .workflow-node-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .branch-container {
          display: flex;
          justify-content: center;
          position: relative;
          padding-top: 30px;
          width: 100%;
        }

        /* Main vertical line from condition node */
        .branch-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 30px;
          background-color: #d1d5db;
          transform: translateX(-50%);
        }

        /* Horizontal branching line */
        .branch-container::after {
          content: '';
          position: absolute;
          top: 30px;
          left: 25%;
          right: 25%;
          height: 2px;
          background-color: #d1d5db;
        }

        .branch-path {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 50%;
          padding-top: 20px;
        }

        /* Vertical lines extending down from each branch */
        .branch-path::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 40px;
          background-color: #d1d5db;
          transform: translateX(-50%);
        }

        /* Branch labels styling */
        .branch-label {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          font-weight: 600;
          z-index: 10;
          white-space: nowrap;
        }

        .yes-label {
          color: #166534; /* Dark Green */
          background-color: #dcfce7; /* Light Green */
          padding: 2px 8px;
          border-radius: 99px;
        }

        .no-label {
          color: #991b1b; /* Dark Red */
          background-color: #fee2e2; /* Light Red */
          padding: 2px 8px;
          border-radius: 99px;
        }

        /* Plus button positioning */
        .branch-plus-button {
          position: absolute;
          top: 35px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
        }

        /* Adjust spacing for branch paths */
        .yes-path {
          padding-right: 20px;
        }

        .no-path {
          padding-left: 20px;
        }

        /* Ensure line colors match the reference design */
        .yes-path::before {
          border-color: #10b981; /* Green for Yes path */
        }

        .no-path::before {
          border-color: #ef4444; /* Red for No path */
        }
      `}</style>
      <div className="workflow-node-wrapper"
        onDragOver={(e) => {
              console.log("CustomNode onDragOver called for node:", id);

          onNodeDragOver?.(e, id)}}
      >
      {/* 1. The Node Card Itself */}
      <div 
        className={`relative w-64 bg-white border-2 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${getNodeColor()}`}
        onClick={() => onNodeClick?.(id, { iconType: data.iconType, type: data.type, label: data.label, subtitle: data.subtitle })}
        onDragOver={(e) => {
              console.log("CustomNode onDragOver called for node:", id);

          onNodeDragOver?.(e, id)}}
        onDrop={(e) =>{

            console.log("CustomNode onDrop called for node:", id);
onNodeDrop?.(e, id)
        } }
        role="button"
        tabIndex={0}
        aria-label={`${data.label} node - ${data.subtitle}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNodeClick?.(id, { iconType: data.iconType, type: data.type, label: data.label, subtitle: data.subtitle });
          }
        }}
      >
      {/* Inline Duration Editor - Available for all nodes */}
      {isDurationEditing && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {data.iconType === 'wait' ? 'wait' : 'duration'}
          </span>
          <button
            onClick={handleDecrement}
            className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
          >
            <Minus size={14} className="text-gray-700" />
          </button>
          <input
            type="number"
            value={count}
            onChange={(e) => {
              const newCount = Math.max(1, parseInt(e.target.value) || 1);
              setCount(newCount);
              if (data.wait_time !== undefined) {
                onWaitTimeChange?.(id, newCount * 1440); // Convert to minutes for wait nodes
              } else {
                onDurationChange?.(id, newCount); // Use days for other nodes
              }
            }}
            className="w-12 h-6 text-center text-sm border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
            min="1"
          />
          <button
            onClick={handleIncrement}
            className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
          >
            <Plus size={14} className="text-white" />
          </button>
          <span className="text-sm font-medium text-gray-700">Days</span>
        </div>
      )}

      {/* Wait popup */}
      {showWaitPopup && (
        <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border rounded-lg shadow-lg p-3 z-10'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Wait</span>
            <button
              onClick={handleDecrement}
              className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors"
            >
              <Minus size={16} className="text-white" />
            </button>
            <span className='text-lg font-bold min-w-[2rem] text-center'>{count}</span>
            <button
              onClick={handleIncrement}
              className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors"
            >
              <Plus size={16} className="text-white" />
            </button>
            <span className='text-sm'>day{count > 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Node Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {iconMap[data.iconType as keyof typeof iconMap]}
            <div>
              <h3 className="font-medium text-gray-900 text-sm">{getFriendlyNodeName(data.action_key || data.iconType, data.label)}</h3>
              {data.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{data.subtitle}</p>
              )}
              {/* Duration Display */}
              {(data.wait_time || data.duration) && (
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  {data.iconType === 'wait' ? 'Wait' : 'Duration'}: {count} day{count !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Edit Button - show for all nodes to edit duration */}
            <button 
              onClick={() => setIsDurationEditing(!isDurationEditing)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={data.iconType === 'wait' ? "Edit wait time" : "Edit duration"}
            >
              <Edit size={14} className="text-gray-400" />
            </button>
            
            {/* More Options Button */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical size={14} className="text-gray-400" />
              </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      data.onReplaceClick?.();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit size={14} />
                    Replace this step
                  </button>
                  <button
                    onClick={() => {
                      data.onDeleteClick?.();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                  {data.iconType === 'condition' && (
                    <button
                      onClick={() => {
                        toggleWaitPopup();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Clock size={14} />
                      Set wait time
                    </button>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            data.isCondition 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {data.isCondition ? 'condition' : 'action'}
          </span>
        </div>
      </div>

        {/* Add Next Step Button for non-condition nodes */}
        {!data.isCondition && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-20">
                <button
                  onClick={data.onPlusClick}
                  className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
                  aria-label={`Add new step after ${data.label}`}
                  title={`Add new step after ${data.label}`}
                >
                  <Plus size={12} className="text-gray-600" />
                </button>
            {/* Connection line extending down from plus button */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-300"></div>
          </div>
        )}

        {/* React Flow Handles - All nodes need target handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-500"
          

        />
        {!data.isCondition && (
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 bg-blue-500"
          />
        )}
        {/* Conditional node handles for Yes/No branches */}
        {data.isCondition && (
          <>
            <Handle
              type="source"
              position={Position.Left}
              id="yes"
              style={{ 
                left: '-6px',
                top: '60%'
              }}
              className="w-3 h-3 bg-green-500"
            />
            <Handle
              type="source"
              position={Position.Right}
              id="no"
              style={{ 
                right: '-6px',
                top: '60%'
              }}
              className="w-3 h-3 bg-red-500"
            />
          </>
        )}
      </div>

      {/* 2. The Branching Container (only for condition nodes) */}
      {data.isCondition && (
        <div className="branch-container">
          {/* Yes Branch */}
          <div className="branch-path yes-path">
            {/* Yes Label */}
            <div className="branch-label yes-label">
              Yes
            </div>
            
            {/* Yes Plus Button */}
            {!data.hasYesBranch && (
              <div 
                className="branch-plus-button"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'link';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const nodeType = e.dataTransfer.getData('application/reactflow');
                  if (nodeType && data.onYesClick) {
                    if (data.onYesDrop) {
                      data.onYesDrop(nodeType);
                    } else {
                      data.onYesClick();
                    }
                  }
                }}
              >
                <button
                  onClick={data.onYesClick}
                  className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-green-500 hover:bg-green-50 transition-colors shadow-sm"
                  aria-label="Add new step to Yes branch"
                  title="Add new step to Yes branch"
                >
                  <Plus size={12} className="text-gray-600" />
                </button>
                {/* Connection line extending down from plus button */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-300"></div>
              </div>
            )}
            
            {/* Yes branch connection point */}
            {/* Child nodes for the 'Yes' path will be rendered here */}
          </div>
          
          {/* No Branch */}
          <div className="branch-path no-path">
            {/* No Label */}
            <div className="branch-label no-label">
              No
            </div>
            
            {/* No Plus Button */}
            {!data.hasNoBranch && (
              <div 
                className="branch-plus-button"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'link';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const nodeType = e.dataTransfer.getData('application/reactflow');
                  if (nodeType && data.onNoClick) {
                    if (data.onNoDrop) {
                      data.onNoDrop(nodeType);
                    } else {
                      data.onNoClick();
                    }
                  }
                }}
              >
                <button
                  onClick={data.onNoClick}
                  className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  aria-label="Add new step to No branch"
                  title="Add new step to No branch"
                >
                  <Plus size={12} className="text-gray-600" />
                </button>
                {/* Connection line extending down from plus button */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-300"></div>
              </div>
            )}
            
            {/* No branch connection point */}
            {/* Child nodes for the 'No' path will be rendered here */}
          </div>
        </div>
      )}
      </div>
    </>
  );
});

export default CustomNode;







