'use client';

import React from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

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
}

interface ContactRowProps {
  contact: Contact;
  isSelected: boolean;
  onSelectionChange: (isSelected: boolean) => void;
  visibleColumns?: Record<string, boolean>;
  onEdit?: (contact: Contact) => void;
  onEnrich?: (contact: Contact) => void;
}

const ContactRow: React.FC<ContactRowProps> = ({ contact, isSelected, onSelectionChange, visibleColumns, onEdit, onEnrich }) => {
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
      {(!visibleColumns || visibleColumns.name !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            {contact.picture ? (
              <img
                src={contact.picture.startsWith('http') ? contact.picture : `https://${contact.picture}`}
                alt={`${contact.firstName} ${contact.lastName}`}
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-semibold text-gray-900">
              {contact.firstName} {contact.lastName}
            </div>
          </div>
        </div>
      </td>
      )}

      {/* Audiences */}
      {(!visibleColumns || visibleColumns.audiences !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm text-gray-900">{contact.audiences.join(', ')}</span>
          <ChevronDown size={16} className="ml-1 text-gray-400" />
        </div>
      </td>
      )}

      {/* Campaigns */}
      {(!visibleColumns || visibleColumns.campaigns !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.campaigns.join(', ')}</span>
      </td>
      )}

      {/* Lead's Status */}
      {(!visibleColumns || visibleColumns.leadStatus !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.leadStatus)}`}>
          {contact.leadStatus}
        </span>
      </td>
      )}

      {/* Contacted */}
      {(!visibleColumns || visibleColumns.contacted !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        {getBooleanIcon(contact.contacted)}
      </td>
      )}

      {/* Replied */}
      {(!visibleColumns || visibleColumns.replied !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        {getBooleanIcon(contact.replied)}
      </td>
      )}

      {/* Company Name */}
      {(!visibleColumns || visibleColumns.company !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.company}</span>
      </td>
      )}

      {/* Phone */}
      {(!visibleColumns || visibleColumns.phone !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.phone}</span>
      </td>
      )}

      {/* Unsubscribed */}
      {(!visibleColumns || visibleColumns.unsubscribed !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        {getBooleanIcon(contact.unsubscribed)}
      </td>
      )}

      {/* Pro Email */}
      {(!visibleColumns || visibleColumns.proEmail !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.proEmail}</span>
      </td>
      )}

      {/* Personal Email */}
      {(!visibleColumns || visibleColumns.personalEmail !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.personalEmail}</span>
      </td>
      )}

      {/* Job */}
      {(!visibleColumns || visibleColumns.jobTitle !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.jobTitle}</span>
      </td>
      )}

      {/* Location */}
      {(!visibleColumns || visibleColumns.location !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.location}</span>
      </td>
      )}

      {/* Website */}
      {(!visibleColumns || visibleColumns.website !== false) && (
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
      )}

      {/* Industry */}
      {(!visibleColumns || visibleColumns.industry !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.industry}</span>
      </td>
      )}

      {/* LinkedIn */}
      {(!visibleColumns || visibleColumns.linkedin !== false) && (
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
      )}

      {/* Bio */}
      {(!visibleColumns || visibleColumns.bio !== false) && (
      <td className="px-4 py-4">
        <span className="text-sm text-gray-900 max-w-xs truncate block" title={contact.bio}>
          {contact.bio}
        </span>
      </td>
      )}

      {/* Gender */}
      {(!visibleColumns || visibleColumns.gender !== false) && (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{contact.gender}</span>
      </td>
      )}


      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onEdit?.(contact)}
            className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-50"
            title="Edit Lead"
          >
            Edit
          </button>
          <button
            onClick={() => onEnrich?.(contact)}
            className="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700"
            title="Enrich Lead"
          >
            Enrich
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ContactRow;
