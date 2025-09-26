import { useState, useCallback } from 'react';

// Generic form hook for better state management
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [formData, setFormData] = useState<T>(initialValues);

  // Generic input change handler
  const handleInputChange = useCallback((field: keyof T) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : e.target.value
      }));
    }, []);

  // Checkbox change handler
  const handleCheckboxChange = useCallback((field: keyof T) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.checked
      }));
    }, []);

  // Direct field update
  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormData(initialValues);
  }, [initialValues]);

  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return {
    formData,
    handleInputChange,
    handleCheckboxChange,
    updateField,
    updateFields,
    resetForm,
    setFormData
  };
};







