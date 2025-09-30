'use client';

import React, { useEffect, useState } from 'react';

export interface EditableContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string; // pro
  personalEmail: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  website: string;
  industry: string;
  linkedin: string;
  bio: string;
}

interface EditLeadPopupProps {
  isOpen: boolean;
  contact: EditableContact | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (updated: EditableContact) => Promise<void> | void;
}

const fieldClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent';

export default function EditLeadPopup({ isOpen, contact, onClose, onSave, saving }: EditLeadPopupProps) {
  const [form, setForm] = useState<EditableContact | null>(null);

  useEffect(() => {
    setForm(contact);
  }, [contact]);

  if (!isOpen || !form) return null;

  const handleChange = (key: keyof EditableContact, value: string) => {
    setForm(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const submit = async () => {
    if (!form) return;
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Lead</h3>
          <button onClick={onClose} className="px-2 py-1 text-sm rounded hover:bg-gray-100">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600">First name</label>
            <input className={fieldClass} value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">Last name</label>
            <input className={fieldClass} value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-gray-600">Pro email</label>
            <input className={fieldClass} value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">Personal email</label>
            <input className={fieldClass} value={form.personalEmail} onChange={(e) => handleChange('personalEmail', e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-gray-600">Phone</label>
            <input className={fieldClass} value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">Company</label>
            <input className={fieldClass} value={form.company} onChange={(e) => handleChange('company', e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-gray-600">Job title</label>
            <input className={fieldClass} value={form.jobTitle} onChange={(e) => handleChange('jobTitle', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">Location</label>
            <input className={fieldClass} value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-gray-600">Website</label>
            <input className={fieldClass} value={form.website} onChange={(e) => handleChange('website', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">Industry</label>
            <input className={fieldClass} value={form.industry} onChange={(e) => handleChange('industry', e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">LinkedIn</label>
            <input className={fieldClass} value={form.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">Bio</label>
            <textarea className={`${fieldClass} min-h-[80px]`} value={form.bio} onChange={(e) => handleChange('bio', e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">Cancel</button>
          <button onClick={submit} disabled={!!saving} className="px-4 py-2 text-sm rounded bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}


