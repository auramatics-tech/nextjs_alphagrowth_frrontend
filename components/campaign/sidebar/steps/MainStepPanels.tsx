'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface MainStepPanelsProps {
  steps: any[];
  activeStep: string;
  onStepChange: (id: string) => void;
  renderContent: (stepId: string) => React.ReactNode;
}

const MainStepPanels: React.FC<MainStepPanelsProps> = ({ steps, activeStep, onStepChange, renderContent }) => {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const IconComponent: any = (step as any).icon;
        const isLast = index === steps.length - 1;
        const isActive = activeStep === step.id;

        return (
          <div key={step.id} className="relative">
            {/* Step Header - Clickable */}
            <button
              onClick={() => onStepChange(isActive ? '' : step.id)}
              className={`w-full flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 ${
                isActive ? 'bg-orange-50 rounded-lg ml-1' : (step.status as any) === 'completed' ? 'opacity-75' : ''
              }`}
            >
              {/* Step Indicator */}
              <div className="relative flex-shrink-0">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                      (step.status as any) === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  ></div>
                )}

                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    (step.status as any) === 'completed'
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'btn-primary'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                >
                  {(step.status as any) === 'completed' ? (
                    // check icon as white circle, matching original
                    <span className="text-white">✓</span>
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 text-left">
                <div
                  className={`font-semibold text-sm ${
                    isActive ? 'text-gray-900' : (step.status as any) === 'completed' ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {step.name}
                </div>
                <div
                  className={`text-xs ${
                    isActive ? 'text-gray-600' : (step.status as any) === 'completed' ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.description}
                </div>
              </div>

              {/* Step Icon */}
              <div className="flex-shrink-0">{IconComponent ? <IconComponent size={18} className={step.color} /> : null}</div>

              {/* Chevron Indicator */}
              <div className="flex-shrink-0">
                <motion.div animate={{ rotate: isActive ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400">
                  <ChevronRight size={16} />
                </motion.div>
              </div>
            </button>

            {/* Step Content - Accordion */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">{renderContent(step.id)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default MainStepPanels;


