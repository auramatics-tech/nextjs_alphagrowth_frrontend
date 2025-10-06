'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Contact {
  name: string;
  avatar: string;
  company: string;
  title: string;
  verified: boolean;
  leadStatus: string;
  dealValue: string;
  emails: string[];
  linkedinUrl: string;
  phone: string;
  campaign: string;
}

interface ProfilePanelProps {
  contact?: Contact | null;
  onClose: () => void;
}

export default function ProfilePanel({ contact, onClose }: ProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState(contact || {
    name: 'Unknown Contact',
    avatar: '/avatars/default-avatar.jpg',
    company: 'Unknown Company',
    title: 'Unknown Title',
    verified: false,
    leadStatus: 'Not Set',
    dealValue: 'Not Set',
    emails: [],
    linkedinUrl: '',
    phone: '',
    campaign: 'No Campaign'
  });

  // Update editedContact when contact prop changes
  useEffect(() => {
    if (contact) {
      setEditedContact(contact);
    }
  }, [contact]);

  // Don't render if no contact data
  if (!contact) {
    return (
      <div className="w-80 bg-white border-l border-gray-100 flex flex-col">
        <div className="p-4 text-center">
          <p className="text-gray-500">No contact selected</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
    console.log('Contact updated:', editedContact);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getLeadStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interested':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'hot':
        return 'bg-gradient-to-r from-orange-500 to-blue-500 text-white border-transparent';
      case 'cold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Profile</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Contact Summary */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-3">
              <img 
                src={editedContact?.avatar || '/avatars/default-avatar.jpg'} 
                alt={editedContact?.name || 'Contact'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl" style={{ display: 'none' }}>
                {(editedContact?.name || 'Contact').split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <h4 className="text-lg font-bold text-gray-900">{editedContact?.name || 'Unknown Contact'}</h4>
          <p className="text-sm text-gray-600">At {editedContact?.company || 'Unknown Company'}</p>
        </div>

        {/* Enrichment Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Enrichment</label>
          <button className="w-full bg-orange-50 text-orange-800 px-4 py-3 rounded-lg font-medium hover:bg-orange-100 transition-colors border border-orange-200">
            Overview
          </button>
        </div>

        {/* Deal Value */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Deal Value</label>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedContact?.dealValue || ''}
              onChange={(e) => handleFieldChange('dealValue', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
          ) : (
            <div className="text-sm font-semibold text-gray-900">{editedContact?.dealValue || 'Not Set'}</div>
          )}
        </div>

        {/* Lead Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Lead Status</label>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          {isEditing ? (
            <select
              value={editedContact?.leadStatus || 'Not Set'}
              onChange={(e) => handleFieldChange('leadStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="Interested">Interested</option>
              <option value="Qualified">Qualified</option>
              <option value="Hot">Hot</option>
              <option value="Cold">Cold</option>
            </select>
          ) : (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getLeadStatusColor(editedContact?.leadStatus || 'Not Set')}`}>
              {editedContact?.leadStatus || 'Not Set'}
            </span>
          )}
        </div>

        {/* Contact Fields */}
        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            {isEditing ? (
              <input
                type="text"
                value={(editedContact?.name || '').split(' ')[0]}
                onChange={(e) => {
                  const lastName = (editedContact?.name || '').split(' ').slice(1).join(' ');
                  handleFieldChange('name', `${e.target.value} ${lastName}`);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <input
                type="text"
                value={(editedContact?.name || '').split(' ')[0]}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900"
              />
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            {isEditing ? (
              <input
                type="text"
                value={(editedContact?.name || '').split(' ').slice(1).join(' ')}
                onChange={(e) => {
                  const firstName = (editedContact?.name || '').split(' ')[0];
                  handleFieldChange('name', `${firstName} ${e.target.value}`);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <input
                type="text"
                value={(editedContact?.name || '').split(' ').slice(1).join(' ')}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900"
              />
            )}
          </div>

          {/* Emails */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emails</label>
            {isEditing ? (
              <input
                type="email"
                value={editedContact?.emails?.[0] || ''}
                onChange={(e) => handleFieldChange('emails', e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <input
                type="text"
                value={editedContact?.emails?.[0] || ''}
                readOnly
                placeholder="No email available"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900"
              />
            )}
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn url</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              {isEditing ? (
                <input
                  type="url"
                  value={editedContact?.linkedinUrl || ''}
                  onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <input
                  type="text"
                  value={editedContact?.linkedinUrl || ''}
                  readOnly
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900"
                />
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedContact?.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <input
                  type="text"
                  value={editedContact?.phone || ''}
                  readOnly
                  placeholder="No phone number available"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900"
                />
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-blue-600 transition-all"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
