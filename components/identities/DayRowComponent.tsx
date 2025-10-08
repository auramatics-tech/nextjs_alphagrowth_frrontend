'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';

interface DayRowComponentProps {
  day: {
    key: string;
    label: string;
  };
  workingHours: {
    is_active: boolean;
    start_time: string;
    end_time: string;
  };
  validationErrors?: {
    is_active?: string;
    start_time?: string;
    end_time?: string;
  };
  onUpdate: (field: 'is_active' | 'start_time' | 'end_time', value: boolean | string) => void;
  disabled?: boolean;
}

const DayRowComponent: React.FC<DayRowComponentProps> = ({
  day,
  workingHours,
  validationErrors = {},
  onUpdate,
  disabled = false
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onUpdate('is_active', !workingHours.is_active);
    }
  };

  const handleTimeChange = (field: 'start_time' | 'end_time', value: string) => {
    if (!disabled) {
      onUpdate(field, value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border p-4 transition-all duration-200 ${
        workingHours.is_active 
          ? 'border-orange-200 bg-orange-50' 
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Day Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
              workingHours.is_active ? 'bg-orange-600' : 'bg-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                workingHours.is_active ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{day.label}</span>
            {workingHours.is_active && (
              <CheckCircle className="w-4 h-4 text-orange-600" />
            )}
          </div>
        </div>

        {/* Time Selectors */}
        {workingHours.is_active && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div className="flex items-center gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Start</label>
                  <input
                    type="time"
                    value={workingHours.start_time}
                    onChange={(e) => handleTimeChange('start_time', e.target.value)}
                    disabled={disabled}
                    className={`text-sm border rounded-md px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      validationErrors.start_time ? 'border-red-500' : 'border-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {validationErrors.start_time && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.start_time}</p>
                  )}
                </div>
                
                <span className="text-gray-400">-</span>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End</label>
                  <input
                    type="time"
                    value={workingHours.end_time}
                    onChange={(e) => handleTimeChange('end_time', e.target.value)}
                    disabled={disabled}
                    className={`text-sm border rounded-md px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      validationErrors.end_time ? 'border-red-500' : 'border-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {validationErrors.end_time && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.end_time}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DayRowComponent;

