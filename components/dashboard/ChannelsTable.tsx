'use client';

import React from 'react';
import { Mail, Linkedin, Phone } from 'lucide-react';
import type { ChannelData } from '../../types/dashboard';

interface ChannelsTableProps {
  rows: ChannelData[];
  filter: string;
}

const ChannelsTable: React.FC<ChannelsTableProps> = ({ rows = [], filter = "All" }) => {
  const number = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n ?? 0));
  const currency = (n: number) => new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  }).format(Math.round(n ?? 0));

  // Ensure rows is an array and handle different data formats
  const safeRows = Array.isArray(rows) ? rows : [];
  const filtered = safeRows.filter(r => filter === "All" ? true : r.channel === filter);

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'email':
        return Mail;
      case 'linkedin':
        return Linkedin;
      case 'voice':
        return Phone;
      default:
        return Mail;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Channel</th>
            <th className="px-6 py-3">Prospects</th>
            <th className="px-6 py-3">Open Rate</th>
            <th className="px-6 py-3">Accept Rate</th>
            <th className="px-6 py-3">Replies</th>
            <th className="px-6 py-3">Meetings</th>
            <th className="px-6 py-3">Pipeline</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => {
            const IconComponent = getChannelIcon(r.channel);
            return (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                  <IconComponent size={16} className="text-gray-400"/>
                  {r.channel}
                </td>
                <td className="px-6 py-4">{number(r.prospects)}</td>
                <td className="px-6 py-4">{r.openRate != null ? `${r.openRate}%` : "—"}</td>
                <td className="px-6 py-4">{r.acceptRate != null ? `${r.acceptRate}%` : "—"}</td>
                <td className="px-6 py-4">{number(r.replies)}</td>
                <td className="px-6 py-4">{number(r.meetings)}</td>
                <td className="px-6 py-4 font-bold text-[#1E1E1E]">{currency(r.pipeline)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ChannelsTable;
