'use client';

import React from 'react';

interface SelectOption {
  id: string;
  name: string;
  email?: string;
  count?: number;
  description?: string;
}

interface ReusableSelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder: string;
  showCount?: boolean;
  showEmail?: boolean;
  className?: string;
}

const ReusableSelect: React.FC<ReusableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  showCount = false,
  showEmail = false,
  className = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
}) => {
  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
            {showEmail && option.email && ` (${option.email})`}
            {showCount && option.count && ` (${option.count} contacts)`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReusableSelect;
