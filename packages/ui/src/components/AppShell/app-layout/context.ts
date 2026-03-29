import React from 'react';
import type { AppLayoutProviderValue } from './types';

export const AppLayoutContext = React.createContext<AppLayoutProviderValue | undefined>(undefined);

export const useAppLayoutContext = (): AppLayoutProviderValue => {
  const ctx = React.useContext(AppLayoutContext);
  if (!ctx) {
    throw new Error('useAppLayoutContext must be used within an AppLayoutProvider');
  }
  return ctx;
};
