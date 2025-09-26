"use client";
import React from 'react';
import AutoSizingTextarea from './AutoSizingTextarea';

interface Props {
    label: string;
    value: string | string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isTextarea?: boolean;
}

const EditableField: React.FC<Props> = ({ label, value, onChange, isTextarea = false }) => {
    return (
        <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 capitalize mb-1">{label.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</label>
            {isTextarea ? (
                <AutoSizingTextarea
                    value={Array.isArray(value) ? value.join(', ') : value}
                    onChange={onChange as any}
                    className="bg-gray-50"
                />
            ) : (
                <input
                    type="text"
                    value={value as string}
                    onChange={onChange as any}
                    className="w-full text-sm p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#FF6B2C] focus:border-[#FF6B2C] bg-gray-50"
                />
            )}
        </div>
    );
};

export default EditableField;








