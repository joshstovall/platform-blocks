import React from 'react';
import { Platform } from 'react-native';
import { AppLayoutContext } from './context';
import type { AppLayoutBlueprint, AppLayoutRuntimeOverrides } from './types';

export interface AppLayoutProviderProps {
  blueprint: AppLayoutBlueprint;
  value?: AppLayoutRuntimeOverrides;
  children: React.ReactNode;
}

export const AppLayoutProvider: React.FC<AppLayoutProviderProps> = ({
  blueprint,
  value,
  children,
}) => {
  const runtime = React.useMemo(() => ({
    query: value?.query ?? {},
    pathname: value?.pathname,
    navigation: value?.navigation,
    platform: value?.platform ?? Platform.OS,
    meta: value?.meta,
  }), [value]);

  const contextValue = React.useMemo(() => ({
    blueprint,
    runtime,
  }), [blueprint, runtime]);

  return (
    <AppLayoutContext.Provider value={contextValue}>
      {children}
    </AppLayoutContext.Provider>
  );
};
