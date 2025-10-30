import React, { createContext, useContext, useRef } from 'react';
import { setDefaultColorScheme } from '../utils';

/**
 * Optional bridge interface to inject theme values from host design system
 */
export interface HostThemeBridge {
  /** Primary text color */
  textPrimary?: string;
  /** Secondary text color */
  textSecondary?: string;
  /** Background color */
  background?: string;
  /** Grid line color */
  grid?: string;
  /** Array of accent colors for data visualization */
  accentPalette?: string[];
  /** Font family */
  fontFamily?: string;
}

/**
 * Chart theme configuration
 */
export interface ChartTheme {
  /** Color values used across charts */
  colors: {
    /** Primary text color */
    textPrimary: string;
    /** Secondary text color */
    textSecondary: string;
    /** Background color */
    background: string;
    /** Grid line color */
    grid: string;
    /** Palette of colors for data series */
    accentPalette: string[];
  };
  /** Font size scale */
  fontSize: { xs: number; sm: number; md: number; lg: number };
  /** Border radius for chart elements */
  radius: number;
  /** Font family */
  fontFamily?: string;
}

const defaultTheme: ChartTheme = {
  colors: {
    textPrimary: '#111', // will be overridden by host when provided
    textSecondary: '#555',
    background: '#ffffff',
    grid: '#e3e3e3',
    accentPalette: ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#f97316','#06b6d4','#ec4899']
  },
  fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
  radius: 4,
  fontFamily: 'System',
};

const ChartThemeCtx = createContext<ChartTheme>(defaultTheme);

/**
 * Provider component for chart theming
 * @param value - Partial theme overrides
 * @param hostThemeBridge - Optional bridge to host design system theme
 * @param children - Child components to render
 */
export const ChartThemeProvider: React.FC<{ value?: Partial<ChartTheme>; hostThemeBridge?: HostThemeBridge; children: React.ReactNode }> = ({ value, hostThemeBridge, children }) => {
  const paletteRef = useRef<string | null>(null);
  const merged: ChartTheme = {
    ...defaultTheme,
    ...value,
    colors: {
      ...defaultTheme.colors,
      ...(value?.colors || {}),
      ...(hostThemeBridge ? {
        textPrimary: hostThemeBridge.textPrimary ?? defaultTheme.colors.textPrimary,
        textSecondary: hostThemeBridge.textSecondary ?? defaultTheme.colors.textSecondary,
        background: hostThemeBridge.background ?? defaultTheme.colors.background,
        grid: hostThemeBridge.grid ?? defaultTheme.colors.grid,
        accentPalette: hostThemeBridge.accentPalette ?? defaultTheme.colors.accentPalette,
      } : {})
    },
    fontSize: { ...defaultTheme.fontSize, ...(value?.fontSize || {}) },
    fontFamily: hostThemeBridge?.fontFamily || value?.fontFamily || defaultTheme.fontFamily,
  };
  const palette = Array.isArray(merged.colors?.accentPalette) && merged.colors.accentPalette.length
    ? merged.colors.accentPalette
    : defaultTheme.colors.accentPalette;
  const paletteKey = palette.join('|');
  if (paletteRef.current !== paletteKey) {
    paletteRef.current = paletteKey;
    setDefaultColorScheme([...palette]);
  }
  return <ChartThemeCtx.Provider value={merged}>{children}</ChartThemeCtx.Provider>;
};

/**
 * Hook to access the current chart theme
 * @returns Current chart theme configuration
 */
export function useChartTheme() {
  return useContext(ChartThemeCtx);
}

/**
 * Convenience hook for host integration (expects a host design system theme object)
 * @param host - Host design system theme object
 * @returns Chart theme derived from host theme
 */
export function useHostChartTheme(host: { text?: { primary?: string; secondary?: string }; backgrounds?: { surface?: string }; colors?: { gray?: string[]; primary?: string[] } } | null | undefined) {
  if (!host) return defaultTheme;
  return {
    colors: {
      ...defaultTheme.colors,
      textPrimary: host.text?.primary || defaultTheme.colors.textPrimary,
      textSecondary: host.text?.secondary || defaultTheme.colors.textSecondary,
      background: host.backgrounds?.surface || defaultTheme.colors.background,
      grid: host.colors?.gray?.[3] || defaultTheme.colors.grid,
      accentPalette: host.colors?.primary || defaultTheme.colors.accentPalette,
    },
    fontSize: defaultTheme.fontSize,
    radius: defaultTheme.radius,
    fontFamily: (host as any).fontFamily || defaultTheme.fontFamily,
  } as ChartTheme;
}
