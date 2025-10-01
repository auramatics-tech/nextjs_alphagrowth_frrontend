'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { CheckCircle, Calendar, Mail, Settings, Loader2 } from 'lucide-react';

interface SettingsPanelProps {
  campaignId: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ campaignId }) => {
  // ✅ Form State
  const [startDate, setStartDate] = useState<'immediate' | 'custom'>('immediate');
  const [customStartDate, setCustomStartDate] = useState('');
  const [pauseOnReply, setPauseOnReply] = useState(true);
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);

  // ✅ UI State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Load existing campaign settings
  useEffect(() => {
    const loadCampaignSettings = async () => {
      if (!campaignId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`/pub/v1/campaigns/${campaignId}/detail`);
        const campaign = response.data?.data;

        if (campaign) {
          setStartDate(campaign.start_date || 'immediate');
          
          if (campaign.custom_start_date) {
            // Convert to datetime-local format
            const date = new Date(campaign.custom_start_date);
            const formattedDate = date.toISOString().slice(0, 16);
            setCustomStartDate(formattedDate);
          }
          
          setPauseOnReply(campaign.pause_on_reply ?? true);
          setTrackOpens(campaign.track_opens ?? true);
          setTrackClicks(campaign.track_clicks ?? true);
        }
      } catch (err: any) {
        console.error('Error loading campaign settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadCampaignSettings();
  }, [campaignId]);

  // ✅ Get minimum date (current date + 5 min buffer)
  const getMinDate = useCallback(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // 5 minute buffer
    return now.toISOString().slice(0, 16);
  }, []);

  // ✅ Validate form
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = 'Start Date is required.';
    }

    if (startDate === 'custom') {
      if (!customStartDate) {
        newErrors.customStartDate = 'Custom start date is required.';
      } else {
        const selectedDate = new Date(customStartDate);
        const minDate = new Date(getMinDate());
        
        if (selectedDate < minDate) {
          newErrors.customStartDate = 'Start date must be at least 5 minutes in the future.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [startDate, customStartDate, getMinDate]);

  // ✅ Handle Save Settings (like frontend_old)
  const handleSaveSettings = useCallback(async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // ✅ Use same API endpoint as frontend_old
      const response = await apiClient.post('/pub/v1/campaigns/save-schedule', {
        campaignId,
        schedule: {
          start_date: startDate,
          custom_start_date: startDate === 'custom' ? customStartDate : null,
          pause_on_reply: pauseOnReply,
          track_opens: trackOpens,
          track_clicks: trackClicks,
          // Preserve other fields (timezone, days, etc.)
          time_zone: 'UTC',
          days_of_week: ['Monday'],
          sending_hours: '9:00 AM - 5:00 PM',
          max_connections: 50,
          max_messages: 50,
          max_emails: 50
        }
      });

      if (response.data?.status || response.status === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [campaignId, startDate, customStartDate, pauseOnReply, trackOpens, trackClicks, validateForm]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="mt-4 flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span className="ml-2 text-sm text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-800">Settings saved successfully!</p>
        </div>
      )}

      {/* Settings Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Engagement Rules</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">Set timing & conditions</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Start Date Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-900">Start Date</label>
            </div>
            
            <div className="space-y-3">
              {/* Radio Options */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="startDate"
                    value="immediate"
                    checked={startDate === 'immediate'}
                    onChange={(e) => {
                      setStartDate('immediate');
                      setCustomStartDate('');
                      setErrors({});
                    }}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Start immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="startDate"
                    value="custom"
                    checked={startDate === 'custom'}
                    onChange={(e) => {
                      setStartDate('custom');
                      setErrors({});
                    }}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Set custom start date</span>
                </label>
              </div>

              {/* Custom Date Picker */}
              {startDate === 'custom' && (
                <div className="ml-6 mt-2">
                  <input
                    type="datetime-local"
                    value={customStartDate}
                    min={getMinDate()}
                    onChange={(e) => {
                      setCustomStartDate(e.target.value);
                      setErrors({});
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.customStartDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.customStartDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.customStartDate}</p>
                  )}
                </div>
              )}
              
              {errors.startDate && (
                <p className="text-xs text-red-600">{errors.startDate}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Engagement Settings */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-3">Engagement Settings</label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={pauseOnReply}
                onChange={(e) => setPauseOnReply(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <div>
                <span className="text-sm text-gray-700">Pause sequence for a contact if they reply?</span>
                <p className="text-xs text-gray-500 mt-1">Automatically stops the campaign for contacts who respond</p>
              </div>
            </label>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Email Tracking */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-900">Email Tracking</label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={trackOpens}
                  onChange={(e) => setTrackOpens(e.target.checked)}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Track email opens?</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={trackClicks}
                  onChange={(e) => setTrackClicks(e.target.checked)}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Track link clicks?</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;


