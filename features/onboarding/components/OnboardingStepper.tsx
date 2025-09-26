import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  currentStep,
  totalSteps = 6,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {[...Array(totalSteps)].map((_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        
        return (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              isCompleted 
                ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white' 
                : isActive 
                  ? 'border-2 border-[#FF6B2C] text-[#FF6B2C]' 
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {isCompleted ? <Check size={12} /> : step}
            </div>
            {i < totalSteps - 1 && (
              <div className={`h-0.5 flex-1 rounded-full ${
                isCompleted 
                  ? 'bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF]' 
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OnboardingStepper;






