'use client';

import React from 'react';

interface MainStepperProps {
  steps: any[];
  activeStep: string;
  onStepChange: (id: string) => void;
  renderPanels: (stepId: string) => React.ReactNode;
}

// This stepper simply delegates header + panels rendering to props, keeping logic minimal
const MainStepper: React.FC<MainStepperProps> = ({ steps, activeStep, onStepChange, renderPanels }) => {
  return <>{renderPanels(activeStep)}</>;
};

export default MainStepper;


