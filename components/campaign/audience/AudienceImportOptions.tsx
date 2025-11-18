'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Linkedin } from 'lucide-react';

interface AudienceImportOptionsProps {
  onLinkedInImport: () => void;
  onImportPeople: () => void;
  onCrmImport: () => void;
  onCSVImport: () => void;
  onDatabaseImport: () => void;
}

const AudienceImportOptions: React.FC<AudienceImportOptionsProps> = ({
  onLinkedInImport,
  onImportPeople,
  onCrmImport,
  onCSVImport,
  onDatabaseImport
}) => {
  const importOptions = [
    {
      id: 'database',
      title: 'Import from AlphaGrowth Database',
      subtitle: 'Import contacts from your existing database',
      icon: (
        <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">AG</span>
        </div>
      ),
      badge: 'new',
      onClick: onDatabaseImport,
      delay: 0.1
    },
    {
      id: 'linkedin',
      title: 'Import from LinkedIn',
      subtitle: 'Import contacts from LinkedIn Sales Navigator',
      icon: <Linkedin size={20} className="text-blue-600" />,
      onClick: onLinkedInImport,
      delay: 0.2
    },
    {
      id: 'csv',
      title: 'Import from CSV',
      subtitle: 'Upload a CSV file with your contacts',
      icon: (
        <div className="w-6 h-6 bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center">
          csv
        </div>
      ),
      onClick: onCSVImport,
      delay: 0.4
    },
    // {
    //   id: 'crm',
    //   title: 'Import from CRM',
    //   subtitle: 'Import contacts from your CRM system',
    //   icon: (
    //     <div className="w-6 h-6 bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center">
    //       CRM
    //     </div>
    //   ),
    //   badge: 'ULTIMATE',
    //   onClick: onCrmImport,
    //   delay: 0.5
    // }
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-3">
        {importOptions.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: option.delay }}
            className="relative bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors group"
            onClick={option.onClick}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  {option.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">{option.title}</h3>
                    {option.badge && (
                      <span className={`px-2 py-1 text-orange-700 text-xs font-medium rounded-full ${
                        option.badge === 'new' ? 'bg-orange-100' : 'bg-orange-100'
                      }`}>
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{option.subtitle}</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AudienceImportOptions;
