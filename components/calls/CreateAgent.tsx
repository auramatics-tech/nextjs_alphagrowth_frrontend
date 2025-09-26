'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CreateAgentProps {
  onBack: () => void;
  onSave: () => void;
}

export default function CreateAgent({ onBack, onSave }: CreateAgentProps) {
  const [formData, setFormData] = useState({
    agentName: '',
    aiModel: 'GPT-4o (Recommended)',
    aiVoice: 'Female 1 (Natural)',
    firstMessage: '',
    systemPrompt: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAgent = () => {
    // TODO: Implement save agent logic
    console.log('Saving agent:', formData);
    onSave();
  };

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New AI Agent</h1>
          <p className="text-gray-500 mt-1">Define the persona, knowledge, and voice of your Vapi.ai agent.</p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-800 flex items-center space-x-1"
        >
          <span>←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Form */}
      <div className="p-8 space-y-6">
        {/* Agent Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 mb-1">
            Agent Name
          </label>
          <input
            type="text"
            id="agent-name"
            placeholder="e.g., 'Friendly Discovery Agent'"
            value={formData.agentName}
            onChange={(e) => handleInputChange('agentName', e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          />
        </motion.div>

        {/* AI Model and Voice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 gap-6"
        >
          <div>
            <label htmlFor="ai-model" className="block text-sm font-medium text-gray-700 mb-1">
              AI Model (LLM)
            </label>
            <select
              id="ai-model"
              value={formData.aiModel}
              onChange={(e) => handleInputChange('aiModel', e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            >
              <option value="GPT-4o (Recommended)">GPT-4o (Recommended)</option>
              <option value="GPT-3.5-Turbo">GPT-3.5-Turbo</option>
            </select>
          </div>
          <div>
            <label htmlFor="ai-voice" className="block text-sm font-medium text-gray-700 mb-1">
              Voice
            </label>
            <select
              id="ai-voice"
              value={formData.aiVoice}
              onChange={(e) => handleInputChange('aiVoice', e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            >
              <option value="Female 1 (Natural)">Female 1 (Natural)</option>
              <option value="Male 1 (Professional)">Male 1 (Professional)</option>
            </select>
          </div>
        </motion.div>

        {/* First Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label htmlFor="first-message" className="block text-sm font-medium text-gray-700 mb-1">
            First Message (Greeting)
          </label>
          <textarea
            id="first-message"
            placeholder="e.g., 'Hi, this is Alex from AlphaGrowth, is this a good time to talk?'"
            rows={2}
            value={formData.firstMessage}
            onChange={(e) => handleInputChange('firstMessage', e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          />
        </motion.div>

        {/* System Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700 mb-1">
            System Prompt (Agent Instructions)
          </label>
          <textarea
            id="system-prompt"
            placeholder="Define the agent's persona, goals, and rules. Be specific. E.g., 'You are a helpful assistant for AlphaGrowth. Your goal is to book a meeting. Be polite, professional, and never promise features we don't have...'"
            rows={6}
            value={formData.systemPrompt}
            onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          />
        </motion.div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 text-right">
        <button
          onClick={handleSaveAgent}
          className="bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          Save Agent
        </button>
      </div>
    </div>
  );
}

