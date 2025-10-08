'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Clock, Save, Loader2, AlertCircle } from 'lucide-react';
import * as yup from 'yup';
import { workingHoursService, SaveWorkingHoursRequest } from '@/services/workingHoursService';
import { timeZones } from '@/utils/timeUtils';
import DayRowComponent from './DayRowComponent';

interface WorkingHoursComponentProps {
  identityId: string;
  identityName?: string;
}

interface WorkingHours {
  monday: { is_active: boolean; start_time: string; end_time: string };
  tuesday: { is_active: boolean; start_time: string; end_time: string };
  wednesday: { is_active: boolean; start_time: string; end_time: string };
  thursday: { is_active: boolean; start_time: string; end_time: string };
  friday: { is_active: boolean; start_time: string; end_time: string };
  saturday: { is_active: boolean; start_time: string; end_time: string };
  sunday: { is_active: boolean; start_time: string; end_time: string };
}

const WorkingHoursComponent: React.FC<WorkingHoursComponentProps> = ({
  identityId,
  identityName
}) => {
  // State Management
  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { is_active: true, start_time: '09:00', end_time: '17:00' },
    tuesday: { is_active: false, start_time: '09:00', end_time: '17:00' },
    wednesday: { is_active: false, start_time: '09:00', end_time: '17:00' },
    thursday: { is_active: false, start_time: '09:00', end_time: '17:00' },
    friday: { is_active: false, start_time: '09:00', end_time: '17:00' },
    saturday: { is_active: false, start_time: '09:00', end_time: '17:00' },
    sunday: { is_active: false, start_time: '09:00', end_time: '17:00' }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});

  // Yup validation schema
  const workingHoursSchema = yup.object().shape({
    timeZone: yup.string().required('Timezone is required'),
    workingHours: yup.array().of(
      yup.object().shape({
        day_of_week: yup.string().required(),
        is_active: yup.boolean().required(),
        start_time: yup.string().when('is_active', (is_active, schema) => {
          return is_active[0] ? schema.required('Start time is required for active days') : schema.notRequired();
        }),
        end_time: yup.string().when('is_active', (is_active, schema) => {
          return is_active[0] ? schema.required('End time is required for active days') : schema.notRequired();
        })
      })
    ).test('at-least-one-active-day', 'At least one day must be active', function(value) {
      if (!value || !Array.isArray(value)) return false;
      return value.some(day => day.is_active === true);
    })
  });

  // Load working hours
  const loadWorkingHours = async (identityId: string) => {
    if (!identityId) return;
    
    setLoading(true);
    try {
      const response = await workingHoursService.getWorkingHours(identityId);
      if (response.success && response.data) {
        // Set timezone
        if (response.data.identity.time_zone) {
          setSelectedTimeZone(response.data.identity.time_zone);
        } else {
          setSelectedTimeZone('America/Los_Angeles');
        }
        
        // Convert backend working hours to frontend state format
        if (response.data.workingHours && response.data.workingHours.length > 0) {
          const updatedWorkingHours = { ...workingHours };
          response.data.workingHours.forEach(wh => {
            updatedWorkingHours[wh.day_of_week as keyof WorkingHours] = {
              is_active: wh.is_active,
              start_time: wh.start_time || '09:00',
              end_time: wh.end_time || '17:00'
            };
          });
          setWorkingHours(updatedWorkingHours);
        }
      }
    } catch (error) {
      console.error('Error loading working hours:', error);
      toast.error('Failed to load working hours');
    } finally {
      setLoading(false);
    }
  };

  // Save working hours
  const handleSaveWorkingHours = async () => {
    if (!identityId) {
      toast.error('Identity ID is required');
      return;
    }

    // Clear previous validation errors
    setValidationErrors({});

    // Prepare payload for validation
    const payload: SaveWorkingHoursRequest = {
      timeZone: selectedTimeZone,
      workingHours: Object.entries(workingHours).map(([day, data]) => ({
        day_of_week: day,
        is_active: data.is_active,
        start_time: data.is_active ? data.start_time : '',
        end_time: data.is_active ? data.end_time : ''
      }))
    };

    // Validate the payload
    try {
      await workingHoursSchema.validate(payload, { abortEarly: false });
    } catch (validationError: any) {
      const errors: Record<string, any> = {};
      
      if (validationError.inner && Array.isArray(validationError.inner)) {
        validationError.inner.forEach((error: any) => {
          if (error.path.includes('workingHours')) {
            const match = error.path.match(/workingHours\[(\d+)\]\.(\w+)/);
            if (match) {
              const dayIndex = parseInt(match[1]);
              const field = match[2];
              const day = payload.workingHours[dayIndex]?.day_of_week;
              if (day) {
                if (!errors[day]) errors[day] = {};
                errors[day][field] = error.message;
              }
            }
          } else {
            errors[error.path] = error.message;
          }
        });
      } else {
        errors.general = validationError.message || 'Validation failed';
      }
      
      setValidationErrors(errors);
      toast.error('Please fix the validation errors before saving');
      return;
    }

    setSaving(true);
    try {
      const response = await workingHoursService.saveWorkingHours(identityId, payload);
      if (response.success) {
        toast.success(response.message || 'Working hours saved successfully!');
        setValidationErrors({});
      } else {
        toast.error(response.message || 'Failed to save working hours');
      }
    } catch (error) {
      console.error('Error saving working hours:', error);
      toast.error('Failed to save working hours');
    } finally {
      setSaving(false);
    }
  };

  // Update working hours when a day toggle changes
  const updateWorkingHourDay = (day: keyof WorkingHours, field: 'is_active' | 'start_time' | 'end_time', value: boolean | string) => {
    setWorkingHours(prev => {
      let updated;
      
      // If toggling is_active to false, clear the times
      if (field === 'is_active' && value === false) {
        updated = {
          ...prev,
          [day]: {
            ...prev[day],
            [field]: value as boolean,
            start_time: '',
            end_time: ''
          }
        };
      } else {
        updated = {
          ...prev,
          [day]: {
            ...prev[day],
            [field]: value
          }
        };
      }
      
      return updated;
    });
    
    // Clear validation errors for this field when user makes changes
    if (validationErrors[day]?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [field]: undefined
        }
      }));
    }
  };

  // Load working hours when identity changes
  useEffect(() => {
    if (identityId) {
      loadWorkingHours(identityId);
    }
  }, [identityId]);

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-gray-600">Loading working hours...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Working Hours</h2>
            <p className="text-sm text-gray-500">Configure when this identity will be active for outreach activities</p>
          </div>
        </div>
        
        {/* Timezone Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              validationErrors.timeZone ? 'border-red-500' : 'border-gray-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            value={selectedTimeZone}
            onChange={(e) => {
              setSelectedTimeZone(e.target.value);
              if (validationErrors.timeZone) {
                setValidationErrors(prev => ({
                  ...prev,
                  timeZone: undefined
                }));
              }
            }}
            disabled={loading}
          >
            <option value="">Select Timezone</option>
            {timeZones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          {validationErrors.timeZone && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.timeZone}</p>
          )}
        </div>

        {/* Days Configuration */}
        <div className="space-y-3">
          {days.map((day) => (
            <DayRowComponent
              key={day.key}
              day={day}
              workingHours={workingHours[day.key as keyof WorkingHours]}
              validationErrors={validationErrors[day.key]}
              onUpdate={(field, value) => updateWorkingHourDay(day.key as keyof WorkingHours, field, value)}
              disabled={loading}
            />
          ))}
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button 
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-colors ${
              saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
            onClick={handleSaveWorkingHours}
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Working Hours
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursComponent;

