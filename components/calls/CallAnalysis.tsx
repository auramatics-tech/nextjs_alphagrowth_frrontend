'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Call {
  id: string;
  contact: {
    name: string;
    title: string;
    company: string;
    initials: string;
  };
  date: string;
  duration: string;
  agent: string;
  campaign: string;
  outcome: string;
  outcomeColor: string;
}

interface CallAnalysisProps {
  call: Call;
  onBack: () => void;
}

export default function CallAnalysis({ call, onBack }: CallAnalysisProps) {
  const [actionItems, setActionItems] = useState([
    { id: 1, text: 'Send demo confirmation email to Chait.', completed: true },
    { id: 2, text: 'Add prospect to "Qualified Leads" pipeline.', completed: false }
  ]);

  const toggleActionItem = (id: number) => {
    setActionItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Analysis</h1>
          <p className="text-gray-500 mt-1">
            Review of AI call with {call.contact.name} on {call.date}.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-800 flex items-center space-x-1"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Two-Panel Layout */}
      <div className="flex">
        {/* Left Panel: Context */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-6">
          <div className="sticky top-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="bg-gradient-to-r from-orange-500 to-blue-500 h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                {getInitials(call.contact.name)}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{call.contact.name}</p>
                <p className="text-md text-gray-500">{call.contact.title} at {call.contact.company}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-1">Outcome</h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${call.outcomeColor}`}>
                  {call.outcome}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-1">Duration</h4>
                <p className="text-lg font-bold text-gray-900">{call.duration}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-1">AI Agent</h4>
                <p className="text-lg font-bold text-gray-900">{call.agent}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel: Vapi.ai Data */}
        <div className="w-2/3 p-8 space-y-8 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {/* Recording */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Recording</h3>
            <audio controls className="w-full">
              <source src="#" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </motion.div>

          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI-Generated Summary{' '}
              <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent font-bold">
                (Vapi.ai)
              </span>
            </h3>
            <ul className="list-disc list-inside bg-gray-50 p-4 rounded-lg text-gray-700 space-y-2">
              <li>Prospect confirmed interest in AI-driven analytics.</li>
              <li>Main pain point is the dependency on technical teams for data insights.</li>
              <li>Scheduled a follow-up demo for next Tuesday at 10 AM.</li>
            </ul>
          </motion.div>

          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Action Items</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 space-y-2">
              {actionItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-start"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleActionItem(item.id)}
                    className="mt-1 mr-2"
                  />
                  <span className={item.completed ? 'line-through text-gray-500' : ''}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Full Transcript */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Full Transcript</h3>
            <div className="space-y-4 text-sm bg-gray-50 p-4 rounded-lg">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <span className="font-bold text-indigo-600">AI:</span> "Hi Chait, this is Alex from AlphaGrowth. I noticed your work at DataMind AI and was impressed."
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <span className="font-bold text-gray-700">{call.contact.name}:</span> "Oh, thank you. How can I help?"
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <span className="font-bold text-indigo-600">AI:</span> "We help companies like yours accelerate their GTM strategy with AI. I saw you mentioned a challenge with data dependency... a lot of our clients face that."
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

