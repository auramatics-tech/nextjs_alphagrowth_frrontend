'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { AuthProvider } from '../contexts/AuthContext';
import { ImportProvider } from '../contexts/ImportContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AuthProvider>
          <ImportProvider>
            {children}
          </ImportProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}





