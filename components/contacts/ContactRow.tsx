'use client';

import React from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
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

interface ContactRowProps {
  contact: Contact;
  isSelected: boolean;
  onSelectionChange: (isSelected: boolean) => void;
}

const ContactRow: React.FC<ContactRowProps> = ({ contact, isSelected, onSelectionChange }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hot':
        return 'bg-red-500 text-white';
      case 'warm':
        return 'bg-yellow-500 text-white';
      case 'cold':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getBooleanIcon = (value: boolean) => {
    return value ? (
      <span className="text-green-600 text-lg">✓</span>
    ) : (
      <span className="text-gray-400 text-lg">✗</span>
    );
  };

  return (
    <tr
      className={`hover:bg-orange-50 transition-colors ${
        isSelected ? 'bg-orange-50' : ''
      }`}
    >
      {/* Checkbox */}
      <td className="px-4 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectionChange(e.target.checked)}
          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
        />
      </td>

      {/* Name with Avatar */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {getInitials(contact.firstName, contact.lastName)}
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-semibold text-gray-900">
              {contact.firstName} {contact.lastName}
            </div>
          </div>
        </div>
      </td>

      {/* Audiences */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm text-gray-900">{contact.audiences.join(', ')}</span>
          <ChevronDown size={16} className="ml-1 text-gray-400" />
        </div>
      </td>

      {/* Campaigns */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.campaigns.join(', ')}</span>
      </td>

      {/* Lead's Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.leadStatus)}`}>
          {contact.leadStatus}
        </span>
      </td>

      {/* Contacted */}
      <td className="px-4 py-4 whitespace-nowrap">
        {getBooleanIcon(contact.contacted)}
      </td>

      {/* Replied */}
      <td className="px-4 py-4 whitespace-nowrap">
        {getBooleanIcon(contact.replied)}
      </td>

      {/* Company Name */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.company}</span>
      </td>

      {/* Phone */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.phone}</span>
      </td>

      {/* Unsubscribed */}
      <td className="px-4 py-4 whitespace-nowrap">
        {getBooleanIcon(contact.unsubscribed)}
      </td>

      {/* Pro Email */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.proEmail}</span>
      </td>

      {/* Personal Email */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.personalEmail}</span>
      </td>

      {/* Job */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.jobTitle}</span>
      </td>

      {/* Location */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.location}</span>
      </td>

      {/* Website */}
      <td className="px-4 py-4 whitespace-nowrap">
        <a
          href={`https://${contact.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {contact.website}
          <ExternalLink size={12} />
        </a>
      </td>

      {/* Industry */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.industry}</span>
      </td>

      {/* LinkedIn */}
      <td className="px-4 py-4 whitespace-nowrap">
        <a
          href={`https://${contact.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          LinkedIn
          <ExternalLink size={12} />
        </a>
      </td>

      {/* Bio */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-900 max-w-xs truncate block" title={contact.bio}>
          {contact.bio}
        </span>
      </td>

      {/* Gender */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.gender}</span>
      </td>

      {/* Custom Attributes */}
      {Array.from({ length: 10 }, (_, i) => (
        <td key={i} className="px-4 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-900">
            {contact.customAttributes[`Custom Attribute ${i + 1}`] || '-'}
          </span>
        </td>
      ))}
    </tr>
  );
};

export default ContactRow;
