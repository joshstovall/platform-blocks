import React, { createContext, useContext, useMemo } from 'react';

import { DEFAULT_THEME } from './defaultTheme';
import { PlatformBlocksTheme, PlatformBlocksThemeOverride } from './types';
import { mergeTheme } from './utils';

// Debug flag (only logs when in dev mode AND explicit debug env flag is set)
const DEBUG = typeof __DEV__ !== 'undefined' && __DEV__ && !!process.env.EXPO_PUBLIC_DEBUG;
const debugLog = (...args: any[]) => { if (DEBUG) console.log(...args); };

// Theme Context
const PlatformBlocksThemeContext = createContext<PlatformBlocksTheme | null>(null);

export interface PlatformBlocksThemeProviderProps {
  /** Theme override object */
  theme?: PlatformBlocksThemeOverride;
  /** Whether to inherit theme from parent provider */
  inherit?: boolean;
  /** Children to render */
  children: React.ReactNode;
}

export function PlatformBlocksThemeProvider({
  theme,
  inherit = true,
  children
}: PlatformBlocksThemeProviderProps) {
  const parentTheme = useTheme();

  const mergedTheme = useMemo(() => {
    const baseTheme = inherit && parentTheme ? parentTheme : DEFAULT_THEME;
    
    // If no theme override is provided, return the base theme directly (no new object)
    if (!theme) {
      // debugLog('[PlatformBlocksThemeProvider] No theme override, using base theme directly, colorScheme:', baseTheme.colorScheme);
      return baseTheme;
    }
    
    // If the theme is a complete theme object (has colorScheme), use it directly
    if ('colorScheme' in theme && theme.colorScheme) {
      // debugLog('[PlatformBlocksThemeProvider] Complete theme provided, using directly, colorScheme:', theme.colorScheme);
      return theme as PlatformBlocksTheme;
    }
    
    // Only create a new object if we actually have a theme override to merge
    const result = mergeTheme(baseTheme, theme);
    // debugLog('[PlatformBlocksThemeProvider] Creating merged theme with override, colorScheme:', result.colorScheme);
    return result;
  }, [theme, parentTheme, inherit]);
  // debugLog('[PlatformBlocksThemeProvider] Rendering with theme colorScheme:', mergedTheme.colorScheme);

  return (
    <PlatformBlocksThemeContext.Provider value={mergedTheme}>
      {children}
    </PlatformBlocksThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme
 */
export function useTheme(): PlatformBlocksTheme {
  const theme = useContext(PlatformBlocksThemeContext);

  if (!theme) {
    // Return default theme if no provider is found
    return DEFAULT_THEME;
  }

  return theme;
}

/**
 * Hook that safely returns theme or default theme
 */
export function useSafePlatformBlocksTheme(): PlatformBlocksTheme {
  const theme = useContext(PlatformBlocksThemeContext);
  return theme || DEFAULT_THEME;
}
