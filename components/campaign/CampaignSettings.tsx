'use client';

import React, { useState } from 'react';
import { Calendar, Settings, Mail, Link, Check } from 'lucide-react';

interface CampaignSettingsProps {
  onSave?: (settings: any) => void;
}

const CampaignSettings: React.FC<CampaignSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState({
    startDate: '',
    pauseOnReply: true,
    trackEmailOpens: true,
    trackLinkClicks: true,
  });

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
    console.log('Campaign settings saved:', settings);
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-2">Engagement Rules</h2>
        <p className="text-blue-100">Set timing & conditions</p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {/* Start Date Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <label className="text-gray-900 font-medium">Start Date</label>
          </div>
          <input
            type="date"
            value={settings.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Engagement Settings Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-green-600" />
            <label className="text-gray-900 font-medium">Engagement Settings</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="pauseOnReply"
              checked={settings.pauseOnReply}
              onChange={(e) => handleInputChange('pauseOnReply', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="pauseOnReply" className="text-gray-700 cursor-pointer">
              Pause sequence for a contact if they reply?
            </label>
          </div>
        </div>

        {/* Email Tracking Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-purple-600" />
            <label className="text-gray-900 font-medium">Email Tracking</label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trackEmailOpens"
                checked={settings.trackEmailOpens}
                onChange={(e) => handleInputChange('trackEmailOpens', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="trackEmailOpens" className="text-gray-700 cursor-pointer">
                Track email opens?
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trackLinkClicks"
                checked={settings.trackLinkClicks}
                onChange={(e) => handleInputChange('trackLinkClicks', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="trackLinkClicks" className="text-gray-700 cursor-pointer">
                Track link clicks?
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3"
        >
          <Check className="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default CampaignSettings;
