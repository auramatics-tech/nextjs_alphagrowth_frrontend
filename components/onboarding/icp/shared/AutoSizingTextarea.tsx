"use client";
import React, { useEffect, useRef } from 'react';

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
}

const AutoSizingTextarea: React.FC<Props> = ({ value, onChange, className = '' }) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={ref}
            rows={1}
            value={value}
            onChange={onChange}
            className={`w-full text-sm p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#FF6B2C] focus:border-[#FF6B2C] resize-none overflow-hidden ${className}`}
        />
    );
};

export default AutoSizingTextarea;











