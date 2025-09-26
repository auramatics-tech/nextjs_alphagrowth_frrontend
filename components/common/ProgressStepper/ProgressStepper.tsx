import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
  className?: string;
  'aria-label'?: string;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  totalSteps,
  steps = [],
  className = '',
  'aria-label': ariaLabel = 'Progress'
}) => {
  return (
    <div 
      className={`flex items-center justify-between ${className}`}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Step Circle */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isCurrent 
                    ? 'bg-orange-500 text-white ring-2 ring-orange-200' 
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {isCompleted ? (
                <Check size={16} />
              ) : (
                stepNumber
              )}
            </div>

            {/* Step Label */}
            {steps[index] && (
              <div className="ml-2 hidden sm:block">
                <p className={`text-xs font-medium ${
                  isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {steps[index]}
                </p>
              </div>
            )}

            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <div
                className={`
                  w-12 h-0.5 mx-2 transition-colors duration-300
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepper;





