'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, ChevronDown, User } from 'lucide-react';
import AllContactsView from '../../../components/contacts/AllContactsView';

const ContactsPage: React.FC = () => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const handleContactSelection = (contactIds: string[]) => {
    setSelectedContacts(contactIds);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Contacts</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2">
                <Plus size={16} />
                Create contact
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all flex items-center gap-2">
                <Download size={16} />
                Import contacts
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <AllContactsView 
          selectedContacts={selectedContacts}
          onContactSelection={handleContactSelection}
        />
      </div>
    </div>
  );
};

export default ContactsPage;
