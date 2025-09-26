'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ImportState {
  isImporting: boolean;
  status: 'in-progress' | 'completed' | 'failed';
  totalLeads: number;
  importedLeads: number;
  errorMessage?: string;
}

interface ImportContextType {
  importState: ImportState;
  startImport: (totalLeads: number) => void;
  updateProgress: (importedLeads: number) => void;
  completeImport: () => void;
  failImport: (errorMessage: string) => void;
  resetImport: () => void;
}

const ImportContext = createContext<ImportContextType | undefined>(undefined);

interface ImportProviderProps {
  children: ReactNode;
}

export function ImportProvider({ children }: ImportProviderProps) {
  const [importState, setImportState] = useState<ImportState>({
    isImporting: false,
    status: 'in-progress',
    totalLeads: 0,
    importedLeads: 0,
    errorMessage: undefined
  });

  const startImport = useCallback((totalLeads: number) => {
    setImportState({
      isImporting: true,
      status: 'in-progress',
      totalLeads,
      importedLeads: 0,
      errorMessage: undefined
    });
  }, []);

  const updateProgress = useCallback((importedLeads: number) => {
    setImportState(prev => ({
      ...prev,
      importedLeads
    }));
  }, []);

  const completeImport = useCallback(() => {
    setImportState(prev => ({
      ...prev,
      status: 'completed'
    }));
  }, []);

  const failImport = useCallback((errorMessage: string) => {
    setImportState(prev => ({
      ...prev,
      status: 'failed',
      errorMessage
    }));
  }, []);

  const resetImport = useCallback(() => {
    setImportState({
      isImporting: false,
      status: 'in-progress',
      totalLeads: 0,
      importedLeads: 0,
      errorMessage: undefined
    });
  }, []);

  const value: ImportContextType = {
    importState,
    startImport,
    updateProgress,
    completeImport,
    failImport,
    resetImport
  };

  return (
    <ImportContext.Provider value={value}>
      {children}
    </ImportContext.Provider>
  );
}

export function useImport() {
  const context = useContext(ImportContext);
  if (context === undefined) {
    throw new Error('useImport must be used within an ImportProvider');
  }
  return context;
}

