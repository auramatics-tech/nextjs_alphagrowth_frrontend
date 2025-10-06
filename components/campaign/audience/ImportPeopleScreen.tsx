'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageCircle, 
  UserPlus, 
  CalendarDays, 
  ThumbsUp, 
  Linkedin, 
  Compass 
} from 'lucide-react';

type ImportView = 'main' | 'comment' | 'followers' | 'event' | 'like' | 'basic-search' | 'sales-navigator' | 'sales-navigator-list';

interface ImportPeopleScreenProps {
  activeView: ImportView;
  onViewChange: (view: ImportView) => void;
  onBack: () => void;
  onClose: () => void;
  onComplete: () => void;
}

const ImportPeopleScreen: React.FC<ImportPeopleScreenProps> = ({
  activeView,
  onViewChange,
  onBack,
  onClose,
  onComplete
}) => {
  const importOptions = [
    {
      id: 'comment' as ImportView,
      title: 'Commented a Post',
      icon: MessageCircle,
      delay: 0.1
    },
    {
      id: 'followers' as ImportView,
      title: 'My Followers',
      icon: UserPlus,
      delay: 0.2
    },
    {
      id: 'event' as ImportView,
      title: 'Attended An Event',
      icon: CalendarDays,
      delay: 0.3
    },
    {
      id: 'like' as ImportView,
      title: 'Liked A Post',
      icon: ThumbsUp,
      delay: 0.4
    },
    {
      id: 'basic-search' as ImportView,
      title: 'LinkedIn Basic Search',
      icon: Linkedin,
      delay: 0.5
    },
    {
      id: 'sales-navigator' as ImportView,
      title: 'LinkedIn Sales Navigator',
      icon: Compass,
      delay: 0.6
    },
    {
      id: 'sales-navigator-list' as ImportView,
      title: 'Sales Navigator List',
      icon: Compass,
      delay: 0.7
    }
  ];

  const renderImportForm = (view: ImportView) => {
    const commonFields = (
      <>
        {/* Create New Audience */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
          <input
            type="text"
            placeholder="Enter audience name"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Identity */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900">Identity</h3>
          <div className="relative">
            <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>Select Identity</option>
              <option value="identity1">Chait Jain (chait@company.com)</option>
              <option value="identity2">John Doe (john@company.com)</option>
              <option value="identity3">Jane Smith (jane@company.com)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Import Button */}
        <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
          Import
        </button>
      </>
    );

    switch (view) {
      case 'comment':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">People who Commented a Post</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Paste the LinkedIn Post URL here
              </label>
              <input
                type="url"
                placeholder="Paste the LinkedIn Post URL here"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600 space-y-1">
                <p>1. Click on the 3 dots near to the Post <span className="font-bold">...</span></p>
                <p>2. On the menu, select &quot;<span className="font-bold">Copy link to the post</span>&quot;</p>
                <p>3. Paste the link here</p>
              </div>
            </div>

            {commonFields}
          </div>
        );

      case 'followers':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">My Followers</h2>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>1. This will scrape followers of your LinkedIn identity</p>
              <p>2. Paste your LinkedIn profile URL below</p>
              <p>3. Select your identity and enter audience name</p>
              <p>4. Click import to get your followers</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Paste your LinkedIn Profile URL here
              </label>
              <input
                type="url"
                placeholder="Paste your LinkedIn Profile URL here"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600">
                Example: https://www.linkedin.com/in/your-profile-name
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
              <input
                type="text"
                placeholder="Enter audience name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Identity</h3>
              <div className="relative">
                <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Select Identity</option>
                  <option value="identity1">Chait Jain (chait@company.com)</option>
                  <option value="identity2">John Doe (john@company.com)</option>
                  <option value="identity3">Jane Smith (jane@company.com)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">
              Import
            </button>
          </div>
        );

      case 'event':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Event Attendees</h2>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>1. Go to LinkedIn event page</p>
              <p>2. Copy the event URL from browser</p>
              <p>3. Paste the URL here to get attendees</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Paste LinkedIn event URL here
              </label>
              <input
                type="url"
                placeholder="Paste LinkedIn event URL here"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="text-base font-bold text-gray-900">Create New Audience</h3>
              <input
                type="text"
                placeholder="Enter audience name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {commonFields}
          </div>
        );

      case 'like':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">People who Liked a Post</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Paste the LinkedIn Post URL here
              </label>
              <input
                type="url"
                placeholder="Paste the LinkedIn Post URL here"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600 space-y-1">
                <p>1. Click on the 3 dots near to the Post <span className="font-bold">...</span></p>
                <p>2. On the menu, select &quot;<span className="font-bold">Copy link to the post</span>&quot;</p>
                <p>3. Paste the link here</p>
              </div>
            </div>

            {commonFields}
          </div>
        );

      case 'basic-search':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">LinkedIn Basic Search</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Paste the LinkedIn Search URL here
              </label>
              <input
                type="url"
                placeholder="Paste the LinkedIn Search URL here"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="text-sm text-orange-600">
                Eg: https://www.linkedin.com/search/results/people
              </div>
            </div>

            {commonFields}
          </div>
        );

      case 'sales-navigator':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">LinkedIn Sales Navigator</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Paste the LinkedIn Sales Navigator URL here
              </label>
              <input
                type="url"
                placeholder="Paste the LinkedIn Sales Navigator URL here"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {commonFields}
          </div>
        );

      case 'sales-navigator-list':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Sales Navigator List</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Paste the Sales Navigator List URL here
              </label>
              <input
                type="url"
                placeholder="Paste the Sales Navigator List URL here"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {commonFields}
          </div>
        );

      default:
        return null;
    }
  };

  if (activeView === 'main') {
    return (
      <div className="p-6 space-y-6">
        {/* Import People Who... Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Import People Who...</h2>
          <div className="space-y-3">
            {importOptions.slice(0, 4).map((option) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: option.delay }}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                  onClick={() => onViewChange(option.id)}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent size={20} className="text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{option.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Import from a LinkedIn Search Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Import from a LinkedIn Search</h2>
          <div className="space-y-3">
            {importOptions.slice(4).map((option) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: option.delay }}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors group"
                  onClick={() => onViewChange(option.id)}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent size={20} className="text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{option.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="font-medium">Back</span>
      </button>

      {/* Form Content */}
      {renderImportForm(activeView)}
    </div>
  );
};

export default ImportPeopleScreen;
