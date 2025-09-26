'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ConfigureCallProps {
  onBack: () => void;
  onCreateAgent: () => void;
}

export default function ConfigureCall({ onBack, onCreateAgent }: ConfigureCallProps) {
  const [prospect, setProspect] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Discovery Agent (Vapi.ai)');
  const [callObjective, setCallObjective] = useState('Book a Meeting');
  const [talkingPoints, setTalkingPoints] = useState('');
  const [callSchedule, setCallSchedule] = useState<'now' | 'later'>('now');

  const handleInitiateCall = () => {
    // TODO: Implement call initiation logic
    console.log('Initiating call with:', {
      prospect,
      selectedAgent,
      callObjective,
      talkingPoints,
      callSchedule
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configure New AI Call</h1>
          <p className="text-gray-500 mt-1">Set up the Vapi.ai agent for your prospect.</p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-800 flex items-center space-x-1"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Form */}
      <div className="p-8 space-y-8">
        {/* Section 1: Prospect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Select Prospect</h3>
          <input
            type="text"
            placeholder="Search for a contact by name or company..."
            value={prospect}
            onChange={(e) => setProspect(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          />
        </motion.div>

        {/* Section 2: AI Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Choose AI Agent</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="flex-grow bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            >
              <option value="Discovery Agent (Vapi.ai)">Discovery Agent (Vapi.ai)</option>
              <option value="Follow-up Agent (Vapi.ai)">Follow-up Agent (Vapi.ai)</option>
            </select>
            <button
              onClick={onCreateAgent}
              className="flex-shrink-0 text-indigo-600 hover:text-indigo-800 font-semibold text-sm border border-gray-300 rounded-lg py-3 px-4 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add New Agent</span>
            </button>
          </div>
        </motion.div>

        {/* Section 3: Objective */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Set Call Objective</h3>
          <select
            value={callObjective}
            onChange={(e) => setCallObjective(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-4"
          >
            <option value="Book a Meeting">Book a Meeting</option>
            <option value="Qualify Lead">Qualify Lead</option>
          </select>
          <textarea
            placeholder="Add key talking points for the AI... (e.g., Mention their recent funding round and congratulate them.)"
            rows={3}
            value={talkingPoints}
            onChange={(e) => setTalkingPoints(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          />
        </motion.div>

        {/* Section 4: Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Schedule</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setCallSchedule('now')}
              className={`flex-1 text-center py-3 px-4 border-2 rounded-lg font-semibold transition-colors ${
                callSchedule === 'now'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Call Now
            </button>
            <button
              onClick={() => setCallSchedule('later')}
              className={`flex-1 text-center py-3 px-4 border-2 rounded-lg font-semibold transition-colors ${
                callSchedule === 'later'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Schedule for Later
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 text-right">
        <button
          onClick={handleInitiateCall}
          className="bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          Initiate Call
        </button>
      </div>
    </div>
  );
}

