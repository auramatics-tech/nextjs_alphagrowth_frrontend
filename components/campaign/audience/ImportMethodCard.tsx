'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ImportMethodConfig } from '@/constants/linkedinImportMethods';

interface ImportMethodCardProps {
  method: ImportMethodConfig;
  isSelected: boolean;
  onSelect: (methodId: string) => void;
  delay?: number;
}

const ImportMethodCard: React.FC<ImportMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
  delay = 0
}) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={() => onSelect(method.id)}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(method.color)}`}>
          <span className="text-lg">{method.icon}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{method.title}</span>
          <p className="text-sm text-gray-600">{method.description}</p>
        </div>
      </div>
    </motion.button>
  );
};

export default ImportMethodCard;
