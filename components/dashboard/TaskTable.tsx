'use client';

import React, { useState } from 'react';
import type { TaskData } from '../../types/dashboard';

interface TaskTableProps {
  items: TaskData[];
}

const TaskTable: React.FC<TaskTableProps> = ({ items = [] }) => {
  const [remarks, setRemarks] = useState(() => 
    Object.fromEntries(items.map(t => [t.id, t.remark ?? ""]))
  );

  const onRemarkChange = (id: string, v: string) => {
    setRemarks(prev => ({ ...prev, [id]: v }));
  };

  const onBlurSave = (id: string) => {
    // TODO: Implement API call to save remark
    console.log('Saving remark for task:', id, remarks[id]);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Company</th>
            <th className="px-6 py-3">Task Type</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Time</th>
            <th className="px-6 py-3">Email ID</th>
            <th className="px-6 py-3">Phone Number</th>
            <th className="px-6 py-3">Remark</th>
          </tr>
        </thead>
        <tbody>
          {items.map(t => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{t.name ?? "—"}</td>
              <td className="px-6 py-4">{t.company ?? "—"}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {t.type ?? "—"}
                </span>
              </td>
              <td className="px-6 py-4">{t.date ?? "—"}</td>
              <td className="px-6 py-4">{t.time ?? "—"}</td>
              <td className="px-6 py-4">{t.email ?? "—"}</td>
              <td className="px-6 py-4">{t.phone ?? "—"}</td>
              <td className="px-6 py-4" style={{ minWidth: 220 }}>
                <input 
                  type="text" 
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B2C] focus:border-transparent" 
                  value={remarks[t.id] ?? ""} 
                  onChange={e => onRemarkChange(t.id, e.target.value)} 
                  onBlur={() => onBlurSave(t.id)} 
                  placeholder="Add remark…" 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;


