'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddStep: () => void;
}

export default function EmptyState({ onAddStep }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <BarChart3 size={32} className="text-gray-400" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          Workflow Builder
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Design your campaign automation flow by adding steps and connections
        </motion.p>

        {/* Add First Step Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onAddStep}
          className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus size={20} />
          Add First Step
        </motion.button>
      </div>
    </motion.div>
  );
}

