'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Info, Download, ChevronDown } from 'lucide-react';
import ContactRow from './ContactRow';
import { contactsService, type LeadRecord } from '../../services/contactsService';
import EditLeadPopup, { EditableContact } from './EditLeadPopup';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  picture?: string;
  email: string;
  personalEmail: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  website: string;
  industry: string;
  linkedin: string;
  bio: string;
  gender: string;
  audiences: string[];
  campaigns: string[];
  leadStatus: string;
  contacted: boolean;
  replied: boolean;
  unsubscribed: boolean;
  proEmail: string;
  customAttributes: { [key: string]: string };
}

interface AllContactsViewProps {
  selectedContacts: string[];
  onContactSelection: (contactIds: string[]) => void;
  contacts?: Contact[];
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Abdullah',
    lastName: 'Ali',
    email: 'abdullah.ali@codingpixel.com',
    personalEmail: 'abdullah.personal@gmail.com',
    phone: '+1 832-123-4567',
    company: 'Coding Pixel',
    jobTitle: 'Software Engineer',
    location: 'New York, NY',
    website: 'codingpixel.com',
    industry: 'Technology',
    linkedin: 'linkedin.com/in/abdullah-ali',
    bio: 'Passionate software engineer with 5+ years of experience',
    gender: 'Male',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
    leadStatus: 'Hot',
    contacted: true,
    replied: false,
    unsubscribed: false,
    proEmail: 'abdullah.pro@codingpixel.com',
    customAttributes: {
      'Custom Attribute 1': 'Value 1',
      'Custom Attribute 2': 'Value 2',
      'Custom Attribute 3': 'Value 3',
      'Custom Attribute 4': 'Value 4',
      'Custom Attribute 5': 'Value 5',
      'Custom Attribute 6': 'Value 6',
      'Custom Attribute 7': 'Value 7',
      'Custom Attribute 8': 'Value 8',
      'Custom Attribute 9': 'Value 9',
      'Custom Attribute 10': 'Value 10'
    }
  },
  {
    id: '2',
    firstName: 'Tariq',
    lastName: 'Shahabedden',
    email: 'tariq@azdan.com',
    personalEmail: 'tariq.personal@gmail.com',
    phone: '+971 56-789-0123',
    company: 'Azdan',
    jobTitle: 'Product Manager',
    location: 'Dubai, UAE',
    website: 'azdan.com',
    industry: 'E-commerce',
    linkedin: 'linkedin.com/in/tariq-shahabedden',
    bio: 'Product manager focused on user experience and growth',
    gender: 'Male',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
    leadStatus: 'Warm',
    contacted: false,
    replied: false,
    unsubscribed: false,
    proEmail: 'tariq.pro@azdan.com',
    customAttributes: {
      'Custom Attribute 1': 'Value 1',
      'Custom Attribute 2': 'Value 2',
      'Custom Attribute 3': 'Value 3',
      'Custom Attribute 4': 'Value 4',
      'Custom Attribute 5': 'Value 5',
      'Custom Attribute 6': 'Value 6',
      'Custom Attribute 7': 'Value 7',
      'Custom Attribute 8': 'Value 8',
      'Custom Attribute 9': 'Value 9',
      'Custom Attribute 10': 'Value 10'
    }
  },
  {
    id: '3',
    firstName: 'Vince',
    lastName: 'Neematallah',
    email: 'vince@majarra.com',
    personalEmail: 'vince.personal@gmail.com',
    phone: '+1 555-987-6543',
    company: 'Majarra',
    jobTitle: 'Marketing Director',
    location: 'San Francisco, CA',
    website: 'majarra.com',
    industry: 'Marketing',
    linkedin: 'linkedin.com/in/vince-neematallah',
    bio: 'Marketing director with expertise in digital campaigns',
    gender: 'Male',
    audiences: ['Test1000'],
    campaigns: ['Q1 Campaign'],
    leadStatus: 'Cold',
    contacted: true,
    replied: true,
    unsubscribed: false,
    proEmail: 'vince.pro@majarra.com',
    customAttributes: {
      'Custom Attribute 1': 'Value 1',
      'Custom Attribute 2': 'Value 2',
      'Custom Attribute 3': 'Value 3',
      'Custom Attribute 4': 'Value 4',
      'Custom Attribute 5': 'Value 5',
      'Custom Attribute 6': 'Value 6',
      'Custom Attribute 7': 'Value 7',
      'Custom Attribute 8': 'Value 8',
      'Custom Attribute 9': 'Value 9',
      'Custom Attribute 10': 'Value 10'
    }
  }
];

const AllContactsView: React.FC<AllContactsViewProps> = ({ selectedContacts, onContactSelection, contacts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serverContacts, setServerContacts] = useState<Contact[] | null>(null);
  const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<EditableContact | null>(null);
  const [saving, setSaving] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    audiences: true,
    campaigns: false,
    leadStatus: false,
    contacted: true,
    replied: true,
    company: true,
    phone: true,
    unsubscribed: false,
    proEmail: true,
    personalEmail: true,
    jobTitle: true,
    location: true,
    website: true,
    industry: true,
    linkedin: true,
    bio: true,
    gender: false,
  });

  const mapLeadToContact = (lead: LeadRecord): Contact => ({
    id: lead.id,
    firstName: lead.first_name || '',
    lastName: lead.last_name || '',
    picture: (lead as any).picture || (lead as any).profile_url || '',
    email: lead.pro_email || '',
    personalEmail: lead.perso_email || '',
    phone: lead.phone || '',
    company: lead.company_name || '',
    jobTitle: lead.job || '',
    location: lead.location || '',
    website: lead.website || '',
    industry: lead.industry || '',
    linkedin: lead.linkedin || '',
    bio: lead.bio || '',
    gender: lead.gender || '',
    audiences: Array.isArray(lead.audienceLeads)
      ? lead.audienceLeads.map((a) => a.audience?.audience_name || '').filter(Boolean)
      : [],
    campaigns: [],
    leadStatus: '',
    contacted: !!lead.contacted,
    replied: !!lead.has_replied,
    unsubscribed: !!lead.unsubscribed,
    proEmail: lead.pro_email || '',
    customAttributes: {},
  });
  const openEdit = (c: Contact) => {
    setEditing({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.proEmail,
      personalEmail: c.personalEmail,
      phone: c.phone,
      company: c.company,
      jobTitle: c.jobTitle,
      location: c.location,
      website: c.website,
      industry: c.industry,
      linkedin: c.linkedin,
      bio: c.bio,
    });
    setEditOpen(true);
  };

  const saveEdit = async (updated: EditableContact) => {
    try {
      setSaving(true);
      await contactsService.updateLead(updated.id, {
        first_name: updated.firstName,
        last_name: updated.lastName,
        pro_email: updated.email,
        perso_email: updated.personalEmail,
        phone: updated.phone,
        company_name: updated.company,
        job: updated.jobTitle,
        location: updated.location,
        website: updated.website,
        industry: updated.industry,
        linkedin: updated.linkedin,
        bio: updated.bio,
      });
      // refresh current page
      const res = await contactsService.listLeads({ page, limit, search: searchQuery });
      const mapped = (res.data || []).map(mapLeadToContact);
      setServerContacts(mapped);
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  };


  // Use passed contacts (for testing/dev) or server data fallback to mock
  const contactsData: Contact[] = useMemo(() => {
    if (contacts && contacts.length) return contacts;
    if (serverContacts && serverContacts.length) return serverContacts;
    return mockContacts;
  }, [contacts, serverContacts]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return contactsData.filter(contact =>
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.company.toLowerCase().includes(q)
    );
  }, [contactsData, searchQuery]);

  // Fetch from API
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await contactsService.listLeads({ page, limit, search: searchQuery });
        if (!mounted) return;
        const mapped = (res.data || []).map(mapLeadToContact);
        setServerContacts(mapped);
        setTotal(res.total || mapped.length);
      } catch (e) {
        if (!mounted) return;
        setServerContacts([]);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    // debounce search
    const t = setTimeout(fetchData, 300);
    return () => { mounted = false; controller.abort(); clearTimeout(t); };
  }, [page, limit, searchQuery]);

  const handleSelectAll = () => {
    if (isSelectAllChecked) {
      onContactSelection([]);
      setIsSelectAllChecked(false);
    } else {
      const allContactIds = filteredContacts.map(contact => contact.id);
      onContactSelection(allContactIds);
      setIsSelectAllChecked(true);
    }
  };

  const handleRowSelection = (contactId: string, isSelected: boolean) => {
    if (isSelected) {
      onContactSelection([...selectedContacts, contactId]);
    } else {
      onContactSelection(selectedContacts.filter(id => id !== contactId));
    }
  };

  // Update select all checkbox state when individual selections change
  React.useEffect(() => {
    if (selectedContacts.length === 0) {
      setIsSelectAllChecked(false);
    } else if (selectedContacts.length === filteredContacts.length) {
      setIsSelectAllChecked(true);
    } else {
      setIsSelectAllChecked(false);
    }
  }, [selectedContacts, filteredContacts.length]);

  return (
    <div className="p-6">
      {/* removed custom CSS; using Tailwind classes only */}
      
      {/* Filter & Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Search & Filter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus size={16} />
              Add filter
            </button>
            <span className="text-sm text-gray-500">{total} leads</span>
            {/* Columns menu */}
            <div className="relative">
              <details>
                <summary className="list-none cursor-pointer flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Columns <ChevronDown size={14} />
                </summary>
                <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow p-3 max-h-64 overflow-auto w-64">
                  {Object.keys(visibleColumns).map((key) => (
                    <label key={key} className="flex items-center gap-2 py-1 text-sm">
                      <input
                        type="checkbox"
                        checked={visibleColumns[key] !== false}
                        onChange={() => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))}
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g,' ').trim()}</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* Right Side - Bulk Actions */}
          <div className="flex items-center gap-2">
            <button
              disabled={selectedContacts.length === 0}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedContacts.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Edit size={16} />
              Edit leads
              <ChevronDown size={16} />
            </button>
            <button
              disabled={selectedContacts.length === 0 || enriching}
              onClick={async () => {
                try {
                  setEnriching(true);
                  await contactsService.enrichLeads({ lead_ids: selectedContacts });
                  // optional refresh
                } catch (e) {
                  console.error('Bulk enrich failed', e);
                } finally {
                  setEnriching(false);
                }
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                (selectedContacts.length === 0 || enriching)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              <Info size={16} />
              {enriching ? 'Enriching…' : 'Enrich'}
            </button>
            <button
              disabled={selectedContacts.length === 0}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedContacts.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {selectedContacts.length} selected
        </span>
        <button
          onClick={handleSelectAll}
          className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-2"
        >
          <input
            type="checkbox"
            checked={isSelectAllChecked}
            onChange={handleSelectAll}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          Select all {filteredContacts.length}
        </button>
        <button
          onClick={async () => {
            const ids = await contactsService.fetchAllLeadIds(searchQuery);
            onContactSelection(ids);
            setSelectAllAcrossPages(true);
          }}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Select all across pages
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="relative overflow-auto max-h-[calc(100vh-300px)] w-full pb-1">
          <table className="min-w-max table-auto">
            <thead className="border-b border-gray-200 sticky top-0 bg-white z-10">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isSelectAllChecked}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                {visibleColumns.name !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[220px] whitespace-nowrap">Name</th>
                )}
                {visibleColumns.audiences !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">Audiences</th>
                )}
                {visibleColumns.campaigns !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">Campaigns</th>
                )}
                {visibleColumns.leadStatus !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">Lead&apos;s Status</th>
                )}
                {visibleColumns.contacted !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">Contacted</th>
                )}
                {visibleColumns.replied !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">Replied</th>
                )}
                {visibleColumns.company !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">Company Name</th>
                )}
                {visibleColumns.phone !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">Phone</th>
                )}
                {visibleColumns.unsubscribed !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">Unsubscribed</th>
                )}
                {visibleColumns.proEmail !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">Pro Email</th>
                )}
                {visibleColumns.personalEmail !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">Perso Email</th>
                )}
                {visibleColumns.jobTitle !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">Job</th>
                )}
                {visibleColumns.location !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">Location</th>
                )}
                {visibleColumns.website !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">Website</th>
                )}
                {visibleColumns.industry !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">Industry</th>
                )}
                {visibleColumns.linkedin !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">LinkedIn</th>
                )}
                {visibleColumns.bio !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px] whitespace-nowrap">Bio</th>
                )}
                {visibleColumns.gender !== false && (
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">Gender</th>
                )}
                {/* No custom attribute columns to match frontend_old */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={25}>Loading contacts...</td>
                </tr>
              )}
              {!loading && filteredContacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContacts.includes(contact.id)}
                  onSelectionChange={(isSelected) => handleRowSelection(contact.id, isSelected)}
                  visibleColumns={visibleColumns}
                  onEdit={(c) => openEdit(c)}
                  onEnrich={async (c) => {
                    try {
                      await contactsService.enrichLeads({ lead_ids: [c.id] });
                      // Optionally refetch
                    } catch (e) {
                      console.error('Enrich failed', e);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Lead Popup */}
      <EditLeadPopup
        isOpen={editOpen}
        contact={editing}
        saving={saving}
        onClose={() => setEditOpen(false)}
        onSave={saveEdit}
      />

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value, 10)); }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 rounded border ${page === 1 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >Prev</button>
          {/* Page numbers */}
          {(() => {
            const pages: number[] = [];
            const totalPages = Math.max(1, Math.ceil(total / limit));
            const maxVisible = 7;
            let start = Math.max(1, page - 3);
            let end = Math.min(totalPages, start + maxVisible - 1);
            if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            return (
              <>
                {start > 1 && <span className="px-1">...</span>}
                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded border ${p === page ? 'bg-gray-200 border-gray-300' : 'border-gray-300 hover:bg-gray-50'}`}
                  >{p}</button>
                ))}
                {end < totalPages && <span className="px-1">...</span>}
              </>
            );
          })()}
          <button
            disabled={page * limit >= total}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded border ${(page * limit >= total) ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default AllContactsView;
