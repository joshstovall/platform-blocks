import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { NavigationProvider } from './NavigationContext';
import type { NavigationState, Route } from './types';

export interface NavigationContainerProps {
  children: React.ReactNode;
  initialState?: NavigationState;
  onStateChange?: (state: NavigationState) => void;
  theme?: any; // For compatibility with React Navigation themes
  linking?: any; // For web URL routing (basic implementation)
}

const defaultInitialState: NavigationState = {
  routes: [],
  index: 0,
  key: 'root'
};

function NavigationContainerBase({
  children,
  initialState = defaultInitialState,
  onStateChange,
  theme,
  linking,
  ...props
}: NavigationContainerProps) {
  // Initialize state based on current URL if linking is provided
  const getInitialStateFromURL = useCallback(() => {
    if (linking && typeof window !== 'undefined' && linking.config) {
      const pathname = window.location.pathname;
      const matchedRoute = parseUrl(pathname, linking.config);
      
      if (matchedRoute) {
        return {
          routes: [matchedRoute],
          index: 0,
          key: 'root'
        };
      }
    }
    return initialState;
  }, [linking, initialState]);

  const [state, setState] = useState<NavigationState>(getInitialStateFromURL);

  // Handle browser back/forward events
  useEffect(() => {
    if (linking && typeof window !== 'undefined') {
      const handlePopState = () => {
        const pathname = window.location.pathname;
        const matchedRoute = parseUrl(pathname, linking.config);
        
        if (matchedRoute) {
          const newState = {
            routes: [matchedRoute],
            index: 0,
            key: 'root'
          };
          setState(newState);
          onStateChange?.(newState);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [linking, onStateChange]);

  const handleStateChange = useCallback((newState: NavigationState) => {
    setState(newState);
    onStateChange?.(newState);

    // Basic web URL routing support
    if (linking && typeof window !== 'undefined' && window.history) {
      const currentRoute = newState.routes[newState.index];
      if (currentRoute) {
        const url = generateUrl(currentRoute, linking.config);
        window.history.pushState({}, '', url);
      }
    }
  }, [onStateChange, linking]);

  // Initialize with first child if no routes
  const enhancedChildren = useMemo(() => {
    if (state.routes.length === 0 && React.Children.count(children) > 0) {
      // Auto-initialize with the first navigator's initial route
      // This will be handled by the navigator components themselves
    }
    return children;
  }, [children, state.routes.length]);

  return (
    <View style={styles.container} {...props}>
      <NavigationProvider state={state} onStateChange={handleStateChange}>
        {enhancedChildren}
      </NavigationProvider>
    </View>
  );
}

// Helper function to generate URLs for web routing
function generateUrl(route: Route, config: any): string {
  if (!config?.screens) return '/';

  // Simple URL generation - can be enhanced for complex routing
  const screenConfig = config.screens[route.name];
  if (typeof screenConfig === 'string') {
    return screenConfig;
  } else if (typeof screenConfig === 'object' && screenConfig.path) {
    let path = screenConfig.path;
    // Replace params in path
    if (route.params) {
      Object.entries(route.params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, String(value));
      });
    }
    return path;
  }

  return `/${route.name.toLowerCase()}`;
}

// Helper function to parse URLs and match routes
function parseUrl(pathname: string, config: any): Route | null {
  if (!config?.screens) return null;

  // Check each screen configuration
  for (const [screenName, screenConfig] of Object.entries(config.screens)) {
    if (typeof screenConfig === 'string') {
      if (pathname === screenConfig) {
        return {
          key: `${screenName}-${Date.now()}`,
          name: screenName,
          params: {}
        };
      }
    } else if (typeof screenConfig === 'object' && (screenConfig as any).path) {
      const configPath = (screenConfig as any).path;
      
      // Handle exact matches
      if (pathname === configPath) {
        return {
          key: `${screenName}-${Date.now()}`,
          name: screenName,
          params: {}
        };
      }
      
      // Handle parameterized paths (basic implementation)
      const pathPattern = configPath.replace(/:([^/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${pathPattern}$`);
      const match = pathname.match(regex);
      
      if (match) {
        const params: Record<string, string> = {};
        const paramNames = [...configPath.matchAll(/:([^/]+)/g)].map(m => m[1]);
        
        paramNames.forEach((paramName, index) => {
          params[paramName] = match[index + 1];
        });
        
        return {
          key: `${screenName}-${Date.now()}`,
          name: screenName,
          params
        };
      }
    } else if (typeof screenConfig === 'object' && (screenConfig as any).screens) {
      // Handle nested screens (like stack navigators)
      const nestedConfig = (screenConfig as any);
      
      // Check if the path matches the parent path
      if (nestedConfig.path && pathname.startsWith(nestedConfig.path)) {
        // For nested routes, return the parent stack route
        return {
          key: `${screenName}-${Date.now()}`,
          name: screenName,
          params: {}
        };
      }
    }
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export const NavigationContainer = React.forwardRef<View, NavigationContainerProps>((props, ref) => (
  <NavigationContainerBase {...props} />
));
