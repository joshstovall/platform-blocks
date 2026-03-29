import React, { createContext, useContext, useCallback, useMemo } from 'react';

import type { NavigationContext, NavigationState, Route } from './types';

const NavigationStateContext = createContext<NavigationContext | null>(null);

export function useNavigation(): NavigationContext {
  const context = useContext(NavigationStateContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationContainer');
  }
  return context;
}

export function useRoute(): Route {
  const navigation = useNavigation();
  return navigation.state.routes[navigation.state.index];
}

interface NavigationProviderProps {
  children: React.ReactNode;
  state: NavigationState;
  onStateChange: (state: NavigationState) => void;
}

export function NavigationProvider({ children, state, onStateChange }: NavigationProviderProps) {
  const navigate = useCallback((name: string, params?: Record<string, any>) => {
    const existingRouteIndex = state.routes.findIndex(route => route.name === name);

    if (existingRouteIndex !== -1) {
      // Navigate to existing route
      const newState = {
        ...state,
        index: existingRouteIndex,
        routes: state.routes.map((route, index) =>
          index === existingRouteIndex ? { ...route, params: { ...route.params, ...params } } : route
        )
      };
      onStateChange(newState);
    } else {
      // Add new route
      const newRoute: Route = {
        key: `${name}-${Date.now()}`,
        name,
        params
      };
      const newState = {
        ...state,
        index: state.routes.length,
        routes: [...state.routes, newRoute]
      };
      onStateChange(newState);
    }
  }, [state, onStateChange]);

  const goBack = useCallback(() => {
    if (state.index > 0) {
      const newState = {
        ...state,
        index: state.index - 1,
        routes: state.routes.slice(0, -1)
      };
      onStateChange(newState);
    }
  }, [state, onStateChange]);

  const canGoBack = useCallback(() => {
    return state.index > 0;
  }, [state.index]);

  const reset = useCallback((newState: NavigationState) => {
    onStateChange(newState);
  }, [onStateChange]);

  const contextValue = useMemo(() => ({
    state,
    navigate,
    goBack,
    canGoBack,
    reset
  }), [state, navigate, goBack, canGoBack, reset]);

  return (
    <NavigationStateContext.Provider value={contextValue}>
      {children}
    </NavigationStateContext.Provider>
  );
}
