'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { campaignSettingsService, CampaignSettings } from '@/services/campaignService';

interface SettingsPanelProps {
  campaignId: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ campaignId }) => {
  const [settings, setSettings] = useState<CampaignSettings>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const s = await campaignSettingsService.getCampaignSettings(campaignId);
        setSettings(s || {});
      } catch (e: any) {
        setError('Failed to load campaign settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [campaignId]);

  const startMode = settings.start?.mode || 'immediate';
  const startAt = settings.start?.at || '';

  const onSaveStart = async () => {
    try {
      setLoading(true); setError(null);
      await campaignSettingsService.updateCampaignStart(campaignId, {
        mode: startMode as any,
        at: startMode === 'scheduled' ? startAt : undefined,
      });
      setSavedAt(new Date());
    } catch (e: any) {
      setError('Failed to save start settings');
    } finally {
      setLoading(false);
    }
  };

  const [engLinkedIn, setEngLinkedIn] = useState({ invitesPerDay: 20, messagesPerDay: 40, maxPending: 300 });
  const [engEmail, setEngEmail] = useState({ emailsPerDay: 100, perMinute: 10 });
  useEffect(() => {
    if (settings.engagement?.linkedin) setEngLinkedIn({ ...engLinkedIn, ...settings.engagement.linkedin });
    if (settings.engagement?.email) setEngEmail({ ...engEmail, ...settings.engagement.email });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.engagement]);

  const onSaveEngagement = async () => {
    try {
      setLoading(true); setError(null);
      await campaignSettingsService.updateCampaignEngagement(campaignId, {
        linkedin: engLinkedIn,
        email: engEmail,
      });
      setSavedAt(new Date());
    } catch (e: any) {
      setError('Failed to save engagement settings');
    } finally {
      setLoading(false);
    }
  };

  const [emailTrack, setEmailTrack] = useState({ open: true, click: true, reply: true });
  useEffect(() => {
    if (settings.emailTracking) setEmailTrack({ ...emailTrack, ...settings.emailTracking });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.emailTracking]);

  const onSaveEmailTracking = async () => {
    try {
      setLoading(true); setError(null);
      await campaignSettingsService.updateCampaignEmailTracking(campaignId, emailTrack);
      setSavedAt(new Date());
    } catch (e: any) {
      setError('Failed to save email tracking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">{error}</div>}

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 pt-4">
          <h3 className="font-semibold text-gray-900">Engagement Rules</h3>
          <p className="text-xs text-gray-500">Set timing & conditions</p>
        </div>

        {/* Start Date */}
        <div className="px-4 pt-4">
          <div className="font-medium text-sm text-gray-800 mb-2">Start Date</div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={startMode === 'immediate'} onChange={() => setSettings(s => ({ ...s, start: { mode: 'immediate' } }))} />
              Start immediately
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={startMode === 'scheduled'} onChange={() => setSettings(s => ({ ...s, start: { mode: 'scheduled', at: s.start?.at } }))} />
              Schedule
            </label>
            {startMode === 'scheduled' && (
              <input
                type="datetime-local"
                value={startAt || ''}
                onChange={e => setSettings(s => ({ ...s, start: { mode: 'scheduled', at: e.target.value } }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
            <button onClick={onSaveStart} className="ml-auto btn-primary px-4 py-2 rounded-lg text-sm">Save</button>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 h-px bg-gray-100" />

        {/* Engagement Settings */}
        <div className="px-4 pt-4 pb-2">
          <div className="font-medium text-sm text-gray-800 mb-2">Engagement Settings</div>
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="text-sm font-medium mb-2">LinkedIn</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <label className="flex flex-col gap-1">
                  <span className="text-gray-600">Invites / day</span>
                  <input type="number" className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={engLinkedIn.invitesPerDay || 0}
                    onChange={e => setEngLinkedIn({ ...engLinkedIn, invitesPerDay: Number(e.target.value) })} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-gray-600">Messages / day</span>
                  <input type="number" className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={engLinkedIn.messagesPerDay || 0}
                    onChange={e => setEngLinkedIn({ ...engLinkedIn, messagesPerDay: Number(e.target.value) })} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-gray-600">Max pending</span>
                  <input type="number" className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={engLinkedIn.maxPending || 0}
                    onChange={e => setEngLinkedIn({ ...engLinkedIn, maxPending: Number(e.target.value) })} />
                </label>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="text-sm font-medium mb-2">Email</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <label className="flex flex-col gap-1">
                  <span className="text-gray-600">Emails / day</span>
                  <input type="number" className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={engEmail.emailsPerDay || 0}
                    onChange={e => setEngEmail({ ...engEmail, emailsPerDay: Number(e.target.value) })} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-gray-600">Per minute</span>
                  <input type="number" className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={engEmail.perMinute || 0}
                    onChange={e => setEngEmail({ ...engEmail, perMinute: Number(e.target.value) })} />
                </label>
              </div>
            </div>
            <div className="text-right">
              <button onClick={onSaveEngagement} className="btn-primary px-4 py-2 rounded-lg text-sm">Save</button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-2 h-px bg-gray-100" />

        {/* Email Tracking */}
        <div className="px-4 pt-4 pb-4">
          <div className="font-medium text-sm text-gray-800 mb-2">Email Tracking</div>
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!emailTrack.open} onChange={e => setEmailTrack({ ...emailTrack, open: e.target.checked })} />
              Opens
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!emailTrack.click} onChange={e => setEmailTrack({ ...emailTrack, click: e.target.checked })} />
              Clicks
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!emailTrack.reply} onChange={e => setEmailTrack({ ...emailTrack, reply: e.target.checked })} />
              Replies
            </label>
            <button onClick={onSaveEmailTracking} className="ml-auto btn-primary px-4 py-2 rounded-lg text-sm">Save</button>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        {savedAt && <span>Saved {savedAt.toLocaleTimeString()}</span>}
        {loading && <span>Working…</span>}
      </div>
    </div>
  );
};

export default SettingsPanel;


