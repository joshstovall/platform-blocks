import React, { createContext, useContext, useMemo } from 'react';

import { DEFAULT_THEME } from './defaultTheme';
import { PlatformBlocksTheme, PlatformBlocksThemeOverride } from './types';
import { mergeTheme } from './utils';

// Debug flag (only logs when in dev mode AND explicit debug env flag is set)
const DEBUG = typeof __DEV__ !== 'undefined' && __DEV__ && !!process.env.EXPO_PUBLIC_DEBUG;
const debugLog = (...args: any[]) => { if (DEBUG) console.log(...args); };

// Full theme context (backwards compatible)
const PlatformBlocksThemeContext = createContext<PlatformBlocksTheme | null>(null);

// Granular sub-contexts — components can subscribe to only the slice they need,
// avoiding re-renders when unrelated theme properties change.

/** Visual slice: colors, text, backgrounds, interactive states, colorScheme */
export interface ThemeVisuals {
  colorScheme: PlatformBlocksTheme['colorScheme'];
  primaryColor: PlatformBlocksTheme['primaryColor'];
  colors: PlatformBlocksTheme['colors'];
  text: PlatformBlocksTheme['text'];
  backgrounds: PlatformBlocksTheme['backgrounds'];
  states: PlatformBlocksTheme['states'];
}
const ThemeVisualsContext = createContext<ThemeVisuals | null>(null);

/** Layout / token slice: font, spacing, radii, shadows, breakpoints */
export interface ThemeLayout {
  fontFamily: PlatformBlocksTheme['fontFamily'];
  fontSizes: PlatformBlocksTheme['fontSizes'];
  spacing: PlatformBlocksTheme['spacing'];
  radii: PlatformBlocksTheme['radii'];
  shadows: PlatformBlocksTheme['shadows'];
  breakpoints: PlatformBlocksTheme['breakpoints'];
  designTokens: PlatformBlocksTheme['designTokens'];
}
const ThemeLayoutContext = createContext<ThemeLayout | null>(null);

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

  // Derive stable sub-context values — only create new objects when the
  // relevant subset of the theme actually changes.
  const visuals = useMemo<ThemeVisuals>(() => ({
    colorScheme: mergedTheme.colorScheme,
    primaryColor: mergedTheme.primaryColor,
    colors: mergedTheme.colors,
    text: mergedTheme.text,
    backgrounds: mergedTheme.backgrounds,
    states: mergedTheme.states,
  }), [
    mergedTheme.colorScheme,
    mergedTheme.primaryColor,
    mergedTheme.colors,
    mergedTheme.text,
    mergedTheme.backgrounds,
    mergedTheme.states,
  ]);

  const layout = useMemo<ThemeLayout>(() => ({
    fontFamily: mergedTheme.fontFamily,
    fontSizes: mergedTheme.fontSizes,
    spacing: mergedTheme.spacing,
    radii: mergedTheme.radii,
    shadows: mergedTheme.shadows,
    breakpoints: mergedTheme.breakpoints,
    designTokens: mergedTheme.designTokens,
  }), [
    mergedTheme.fontFamily,
    mergedTheme.fontSizes,
    mergedTheme.spacing,
    mergedTheme.radii,
    mergedTheme.shadows,
    mergedTheme.breakpoints,
    mergedTheme.designTokens,
  ]);

  // debugLog('[PlatformBlocksThemeProvider] Rendering with theme colorScheme:', mergedTheme.colorScheme);

  return (
    <PlatformBlocksThemeContext.Provider value={mergedTheme}>
      <ThemeVisualsContext.Provider value={visuals}>
        <ThemeLayoutContext.Provider value={layout}>
          {children}
        </ThemeLayoutContext.Provider>
      </ThemeVisualsContext.Provider>
    </PlatformBlocksThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme (full object — backwards compatible)
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
 * Granular hook: subscribe only to visual / color-related properties.
 * Components using this will NOT re-render when layout tokens change.
 */
export function useThemeVisuals(): ThemeVisuals {
  const visuals = useContext(ThemeVisualsContext);
  if (!visuals) {
    const t = DEFAULT_THEME;
    return {
      colorScheme: t.colorScheme,
      primaryColor: t.primaryColor,
      colors: t.colors,
      text: t.text,
      backgrounds: t.backgrounds,
      states: t.states,
    };
  }
  return visuals;
}

/**
 * Granular hook: subscribe only to layout / token properties.
 * Components using this will NOT re-render when colors change.
 */
export function useThemeLayout(): ThemeLayout {
  const layout = useContext(ThemeLayoutContext);
  if (!layout) {
    const t = DEFAULT_THEME;
    return {
      fontFamily: t.fontFamily,
      fontSizes: t.fontSizes,
      spacing: t.spacing,
      radii: t.radii,
      shadows: t.shadows,
      breakpoints: t.breakpoints,
      designTokens: t.designTokens,
    };
  }
  return layout;
}

/**
 * Hook that safely returns theme or default theme
 */
export function useSafePlatformBlocksTheme(): PlatformBlocksTheme {
  const theme = useContext(PlatformBlocksThemeContext);
  return theme || DEFAULT_THEME;
}
