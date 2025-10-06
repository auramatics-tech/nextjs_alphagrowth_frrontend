'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Edit3, Settings } from 'lucide-react';

interface NodeEditorProps {
  nodeData: {
    id: string;
    type: string;
    label: string;
    subtitle: string;
    iconType: string;
    wait_time?: number;
  } | null;
  onClose: () => void;
 
}

export default function NodeEditor({ nodeData, onClose}: NodeEditorProps) {
  const [editedData, setEditedData] = useState(nodeData);

  useEffect(() => {
    setEditedData(nodeData);
  }, [nodeData]);

  if (!editedData) return null;

  const handleSave = () => {
 
    onClose();
  };

  const getNodeIcon = (iconType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'action_send_email': <Eye size={24} className="text-blue-600" />,
      'action_send_message': <Edit3 size={24} className="text-green-600" />,
      'action_ai_voice_message': <Settings size={24} className="text-purple-600" />,
      'action_create_task': <Settings size={24} className="text-orange-600" />,
      'action_visit_profile': <Eye size={24} className="text-blue-600" />,
      'action_invitation': <Settings size={24} className="text-green-600" />,
      'condition_open_email': <Eye size={24} className="text-yellow-600" />,
      'condition_has_email': <Settings size={24} className="text-yellow-600" />,
      'wait': <Settings size={24} className="text-gray-600" />,
    };
    return iconMap[iconType] || <Settings size={24} className="text-gray-600" />;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {getNodeIcon(editedData.iconType)}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Node Editor</h2>
            <p className="text-sm text-gray-500">Edit node properties</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Node Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Node Type
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            {editedData.type}
          </div>
        </div>

        {/* Node Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <input
            type="text"
            value={editedData.label}
            onChange={(e) => setEditedData({ ...editedData, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter node label"
          />
        </div>

        {/* Node Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={editedData.subtitle}
            onChange={(e) => setEditedData({ ...editedData, subtitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter node subtitle"
          />
        </div>

        {/* Node ID (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Node ID
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            {editedData.id}
          </div>
        </div>

        {/* Additional Properties based on node type */}
        {editedData.iconType === 'wait' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wait Time (Days)
            </label>
            <input
              type="number"
              min="1"
              value={editedData.wait_time ? editedData.wait_time / 1440 : 1}
              onChange={(e) => setEditedData({ 
                ...editedData, 
                wait_time: parseInt(e.target.value) * 1440 
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:shadow-md transition-all duration-300 flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
