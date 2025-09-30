'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Search, Filter, Clock, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { campaignWorkflowService } from '@/services/campaignWorkflowService';

interface AIPersonalisationEditorProps {
  campaignId: string;
}

interface AiMessageItem {
  id: string;
  lead_id: string;
  lead?: any;
  content: string; // May be JSON for Email/LinkedIn
  message_type: string; // e.g., 'Email', 'LinkedIn', etc.
  node_id: string;
  status?: string;
  created_at?: string;
}

interface ParsedContent {
  subject?: string;
  message?: string;
  cc?: string;
  bcc?: string;
  alternate_message?: string;
}

export default function AIPersonalisationEditor({ campaignId }: AIPersonalisationEditorProps) {
  const [messages, setMessages] = useState<AiMessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Set<string>>(new Set());
  const [editedContent, setEditedContent] = useState<Record<string, ParsedContent>>({});

  const fetchMessages = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await campaignWorkflowService.getCampaignAiMessages(campaignId);
      setMessages(data as any);
    } catch (e: any) {
      setError(e?.message || 'Failed to load AI messages');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const groupByLead = useMemo(() => {
    const groups: Record<string, { leadId: string; lead: any; items: AiMessageItem[] }> = {};
    for (const m of messages) {
      const key = m.lead_id;
      if (!groups[key]) {
        groups[key] = { leadId: key, lead: (m as any).lead, items: [] };
      }
      groups[key].items.push(m);
    }
    return Object.values(groups)
      .map(g => ({
        ...g,
        items: g.items.filter(item =>
          (item.lead?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.lead?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.lead?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.message_type || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(g => g.items.length > 0 || searchTerm.trim() === '');
  }, [messages, searchTerm]);

  const parseContent = (raw: string, channel: string): ParsedContent => {
    try {
      const parsed = JSON.parse(raw);
      if (channel === 'Email') {
        return {
          subject: parsed.subject || '',
          message: parsed.message || '',
          cc: parsed.cc || '',
          bcc: parsed.bcc || '',
          alternate_message: parsed.alternate_message || ''
        };
      }
      if (channel === 'LinkedIn') {
        return {
          message: parsed.message || raw,
          cc: parsed.cc || '',
          bcc: parsed.bcc || '',
          alternate_message: parsed.alternate_message || ''
        };
      }
      return { message: raw };
    } catch {
      return { message: raw };
    }
  };

  const serializeContent = (content: ParsedContent, channel: string): string => {
    if (channel === 'Email') {
      return JSON.stringify({
        subject: content.subject || '',
        message: content.message || '',
        cc: content.cc || '',
        bcc: content.bcc || '',
        alternate_message: content.alternate_message || ''
      });
    }
    if (channel === 'LinkedIn') {
      return JSON.stringify({
        message: content.message || '',
        cc: content.cc || '',
        bcc: content.bcc || '',
        alternate_message: content.alternate_message || ''
      });
    }
    return content.message || '';
  };

  const toggleLead = useCallback((leadId: string) => {
    setExpandedLeads(prev => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId); else next.add(leadId);
      return next;
    });
  }, []);

  const onEditToggle = useCallback((messageId: string, current: ParsedContent) => {
    setEditing(prev => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
        setEditedContent(ec => {
          const copy = { ...ec };
          delete copy[messageId];
          return copy;
        });
      } else {
        next.add(messageId);
        setEditedContent(ec => ({ ...ec, [messageId]: { ...current } }));
      }
      return next;
    });
  }, []);

  const onFieldChange = useCallback((messageId: string, field: keyof ParsedContent, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [messageId]: { ...(prev[messageId] || {}), [field]: value }
    }));
  }, []);

  const onSave = useCallback(async (messageId: string, channel: string) => {
    try {
      const content = editedContent[messageId] || {};
      const serialized = serializeContent(content, channel);
      await campaignWorkflowService.updateAiMessage(messageId, serialized);
      setEditing(prev => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
      setEditedContent(prev => {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      });
      setLastSaved(new Date());
      fetchMessages();
    } catch (e) {
      // noop or surface toast later
    }
  }, [editedContent, fetchMessages]);

  const formatLastSaved = useCallback((date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return `${Math.floor(diff / 3600)} hours ago`;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Personalisation</h1>
          <p className="text-gray-600 mt-1">Review and edit AI-generated drafts per lead</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>Updated {formatLastSaved(lastSaved)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by lead, company or channel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {loading && (
        <div className="text-sm text-gray-600">Loading messages...</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {groupByLead.map(group => {
            const isOpen = expandedLeads.has(group.leadId);
            const leadName = `${group.lead?.first_name || ''} ${group.lead?.last_name || ''}`.trim() || 'Unknown Lead';
            return (
              <div key={group.leadId} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleLead(group.leadId)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{leadName}</div>
                    <div className="text-xs text-gray-500">
                      {group.lead?.company_name || '—'}
                    </div>
                  </div>
                  {isOpen ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
                </button>
                {isOpen && (
                  <div className="p-4 border-t border-gray-100 space-y-4">
                    {group.items.map(item => {
                      const channel = item.message_type;
                      const current = parseContent(item.content, channel);
                      const isEditing = editing.has(item.id);
                      const draft = editedContent[item.id] ?? current;
                      return (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-700 font-medium">{channel || 'Message'}</div>
                            <div className="text-xs text-gray-400">Node {item.node_id}</div>
                          </div>

                          {channel === 'Email' && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Subject</label>
                                <input
                                  type="text"
                                  value={draft.subject || ''}
                                  onChange={(e) => onFieldChange(item.id, 'subject', e.target.value)}
                                  readOnly={!isEditing}
                                  className={`w-full px-3 py-2 rounded border ${isEditing ? 'border-orange-300 focus:ring-2 focus:ring-orange-500' : 'border-gray-200 bg-gray-50'}`}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Message</label>
                                <textarea
                                  value={draft.message || ''}
                                  onChange={(e) => onFieldChange(item.id, 'message', e.target.value)}
                                  readOnly={!isEditing}
                                  rows={4}
                                  className={`w-full px-3 py-2 rounded border ${isEditing ? 'border-orange-300 focus:ring-2 focus:ring-orange-500' : 'border-gray-200 bg-gray-50'}`}
                                />
                              </div>
                            </div>
                          )}

                          {channel === 'LinkedIn' && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">LinkedIn Message</label>
                              <textarea
                                value={draft.message || ''}
                                onChange={(e) => onFieldChange(item.id, 'message', e.target.value)}
                                readOnly={!isEditing}
                                rows={4}
                                className={`w-full px-3 py-2 rounded border ${isEditing ? 'border-orange-300 focus:ring-2 focus:ring-orange-500' : 'border-gray-200 bg-gray-50'}`}
                              />
                            </div>
                          )}

                          {channel !== 'Email' && channel !== 'LinkedIn' && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Message</label>
                              <textarea
                                value={draft.message || ''}
                                onChange={(e) => onFieldChange(item.id, 'message', e.target.value)}
                                readOnly={!isEditing}
                                rows={4}
                                className={`w-full px-3 py-2 rounded border ${isEditing ? 'border-orange-300 focus:ring-2 focus:ring-orange-500' : 'border-gray-200 bg-gray-50'}`}
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-end gap-2 mt-3">
                            {!isEditing ? (
                              <button
                                onClick={() => onEditToggle(item.id, current)}
                                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                              >
                                Edit
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => onSave(item.id, channel)}
                                  className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => onEditToggle(item.id, current)}
                                  className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {groupByLead.length === 0 && (
            <div className="text-sm text-gray-500">No messages found.</div>
          )}
        </div>
      )}
    </div>
  );
}

