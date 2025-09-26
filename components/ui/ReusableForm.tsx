'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'url' | 'email';
  placeholder: string;
  required?: boolean;
  description?: string;
}

interface ReusableFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  onBack?: () => void;
  submitText?: string;
  showBackButton?: boolean;
}

const ReusableForm: React.FC<ReusableFormProps> = ({
  title,
  fields,
  onSubmit,
  onBack,
  submitText = 'Import',
  showBackButton = true
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    fields.forEach(field => {
      data[field.name] = formData.get(field.name);
    });
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {showBackButton && onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="font-medium">Back</span>
        </button>
      )}

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {field.description && (
              <div className="text-sm text-gray-600">
                {field.description}
              </div>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full py-2 px-4 btn-primary rounded-lg font-medium"
        >
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default ReusableForm;

