'use client';

import React, { useState } from 'react';
import CallDashboard from '@/components/calls/CallDashboard';
import ConfigureCall from '@/components/calls/ConfigureCall';
import CreateAgent from '@/components/calls/CreateAgent';
import CallAnalysis from '@/components/calls/CallAnalysis';

type Screen = 'dashboard' | 'configure' | 'create-agent' | 'analysis';

export default function CallModulePage() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [previousScreen, setPreviousScreen] = useState<Screen>('dashboard');
  const [selectedCall, setSelectedCall] = useState<any>(null);

  const showScreen = (screenId: Screen, fromScreen?: Screen) => {
    if (fromScreen) {
      setPreviousScreen(fromScreen);
    }
    setActiveScreen(screenId);
  };

  const handleBackToDashboard = () => {
    setActiveScreen('dashboard');
  };

  const handleBackToPrevious = () => {
    setActiveScreen(previousScreen);
  };

  const handleViewAnalysis = (call: any) => {
    setSelectedCall(call);
    setActiveScreen('analysis');
  };

  const handleCreateAgentFromDashboard = () => {
    setPreviousScreen('dashboard');
    setActiveScreen('create-agent');
  };

  const handleCreateAgentFromConfigure = () => {
    setPreviousScreen('configure');
    setActiveScreen('create-agent');
  };

  const handleNewCall = () => {
    setActiveScreen('configure');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-7xl mx-auto overflow-hidden">
        {activeScreen === 'dashboard' && (
          <CallDashboard
            onNewCall={handleNewCall}
            onCreateAgent={handleCreateAgentFromDashboard}
            onViewAnalysis={handleViewAnalysis}
          />
        )}
        
        {activeScreen === 'configure' && (
          <ConfigureCall
            onBack={handleBackToDashboard}
            onCreateAgent={handleCreateAgentFromConfigure}
          />
        )}
        
        {activeScreen === 'create-agent' && (
          <CreateAgent
            onBack={handleBackToPrevious}
            onSave={() => setActiveScreen(previousScreen)}
          />
        )}
        
        {activeScreen === 'analysis' && selectedCall && (
          <CallAnalysis
            call={selectedCall}
            onBack={handleBackToDashboard}
          />
        )}
      </div>
    </div>
  );
}

