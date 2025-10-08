'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ActionSliderProps {
    value: number;
    min: number;
    max: number;
    safeRange: [number, number];
    fastRange: [number, number];
    riskyRange: [number, number];
    onChange: (value: number) => void;
    onSave?: (value: number) => Promise<void>;
    disabled?: boolean;
    tooltip?: string;
    className?: string;
    label?: string;
    unit?: string;
    saving?: boolean;
}

const ActionSlider: React.FC<ActionSliderProps> = ({
    value,
    min,
    max,
    safeRange,
    fastRange,
    riskyRange,
    onChange,
    onSave,
    disabled = false,
    tooltip = '',
    className = '',
    label = '',
    unit = 'per day',
    saving = false
}) => {
    // Color calculation functions
    const getColor = (currentValue: number) => {
        if (currentValue >= safeRange[0] && currentValue < safeRange[1]) {
            return "#10b981"; // Safe - Green
        } else if (currentValue >= fastRange[0] && currentValue < fastRange[1]) {
            return "#f59e0b"; // Fast - Orange
        } else if (currentValue >= riskyRange[0] && currentValue <= riskyRange[1]) {
            return "#ef4444"; // Risky - Red
        }
        return "#10b981"; // Default to safe
    };

    const getSafeColor = (currentValue: number) => {
        return currentValue >= safeRange[0] && currentValue < safeRange[1] ? "#10b981" : "#6b7280";
    };

    const getFastColor = (currentValue: number) => {
        return currentValue >= fastRange[0] && currentValue < fastRange[1] ? "#f59e0b" : "#6b7280";
    };

    const getRiskyColor = (currentValue: number) => {
        return currentValue >= riskyRange[0] && currentValue <= riskyRange[1] ? "#ef4444" : "#6b7280";
    };

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            const newValue = Number(e.target.value);
            onChange(newValue);
            
            // Debounced save
            if (onSave) {
                if (debounceTimer.current) {
                    clearTimeout(debounceTimer.current);
                }
                debounceTimer.current = setTimeout(() => {
                    onSave(newValue);
                }, 500);
            }
        }
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    const currentColor = getColor(value);
    const percentage = (value / max) * 100;

    return (
        <div className="w-full">
            {/* Value Display */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                    <span className="text-xs text-gray-500">{unit}</span>
                    {saving && (
                        <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                    )}
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative">
                {/* Range Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${className}`}
                    onChange={handleChange}
                    disabled={disabled}
                    style={{
                        background: `linear-gradient(to right, 
                            ${currentColor} 0%, 
                            ${currentColor} ${percentage}%, 
                            #e5e7eb ${percentage}%, 
                            #e5e7eb 100%)`,
                    }}
                />

                {/* Range Labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
            </div>

            {/* Safety Zones */}
            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-1">
                    <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getSafeColor(value) }}
                    />
                    <span 
                        className="text-xs font-medium"
                        style={{ color: getSafeColor(value) }}
                    >
                        Safe
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getFastColor(value) }}
                    />
                    <span 
                        className="text-xs font-medium"
                        style={{ color: getFastColor(value) }}
                    >
                        Fast
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getRiskyColor(value) }}
                    />
                    <span 
                        className="text-xs font-medium"
                        style={{ color: getRiskyColor(value) }}
                    >
                        Risky
                    </span>
                    {tooltip && (
                        <div className="group relative">
                            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-10">
                                {tooltip}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom slider styles */}
            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: ${currentColor};
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: ${currentColor};
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .slider:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default ActionSlider;
