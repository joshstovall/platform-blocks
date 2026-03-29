import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { Platform } from 'react-native';
import { PlatformBlocksTheme, PlatformBlocksThemeOverride } from './types';

// Enhanced theme mode types
export type ColorSchemeMode = 'light' | 'dark' | 'auto';

export interface ThemeModeConfig {
  /** Initial color scheme mode */
  initialMode?: ColorSchemeMode;
  /** Custom persistence functions (optional) */
  persistence?: {
    get: () => ColorSchemeMode | null;
    set: (mode: ColorSchemeMode) => void;
  };
  /** Custom DOM manipulation (web only, optional) */
  domConfig?: {
    selector: string;
    lightClass: string;
    darkClass: string;
    attribute: string;
  };
}

interface ThemeModeContextValue {
  mode: ColorSchemeMode;
  setMode: (mode: ColorSchemeMode) => void;
  cycleMode: () => void;
  actualColorScheme: 'light' | 'dark'; // resolved value (no 'auto')
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

// Default persistence using localStorage (web only)
const defaultPersistence = {
  get: (): ColorSchemeMode | null => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('platform-blocks-theme-mode');
      if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
    } catch {
      console.warn('Failed to access localStorage for theme mode');
    }
    return null;
  },
  set: (mode: ColorSchemeMode) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      localStorage.setItem('platform-blocks-theme-mode', mode);
    } catch {
      console.warn('Failed to access localStorage for theme mode');
    }
  }
};

// Default DOM configuration
const defaultDomConfig = {
  selector: 'html',
  lightClass: 'platform-blocks-light',
  darkClass: 'platform-blocks-dark',
  attribute: 'data-platform-blocks-manual'
};

/**
 * Enhanced theme mode provider that manages color scheme with persistence
 */
export function ThemeModeProvider({ 
  children, 
  config = {} 
}: { 
  children: React.ReactNode;
  config?: ThemeModeConfig;
}) {
  const { 
    initialMode = 'auto', 
    persistence = defaultPersistence,
    domConfig = defaultDomConfig
  } = config;

  // Get system color scheme
  const [systemColorScheme, setSystemColorScheme] = React.useState<'light' | 'dark'>('light');
  
  // Current mode state
  const [mode, setModeState] = React.useState<ColorSchemeMode>(() => {
    const persisted = persistence?.get?.();
    return persisted || initialMode;
  });

  // Listen to system color scheme changes (web only)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemScheme = () => {
      setSystemColorScheme(mediaQuery.matches ? 'dark' : 'light');
    };
    
    updateSystemScheme(); // Set initial value
    mediaQuery.addEventListener('change', updateSystemScheme);
    
    return () => mediaQuery.removeEventListener('change', updateSystemScheme);
  }, []);

  // Resolve actual color scheme
  const actualColorScheme = useMemo((): 'light' | 'dark' => {
    return mode === 'auto' ? systemColorScheme : mode;
  }, [mode, systemColorScheme]);

  // Apply DOM changes (web only)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    
    const element = document.querySelector(domConfig.selector) as HTMLElement;
    if (!element) return;

    // Clear previous classes and attributes
    element.classList.remove(domConfig.lightClass, domConfig.darkClass);
    if (mode === 'auto') {
      element.removeAttribute(domConfig.attribute);
    } else {
      element.setAttribute(domConfig.attribute, mode);
      element.classList.add(
        actualColorScheme === 'dark' ? domConfig.darkClass : domConfig.lightClass
      );
    }
  }, [mode, actualColorScheme, domConfig]);

  const setMode = React.useCallback((newMode: ColorSchemeMode) => {
    setModeState(newMode);
    persistence?.set?.(newMode);
  }, [persistence]);

  const cycleMode = React.useCallback(() => {
    const nextMode: ColorSchemeMode = 
      mode === 'light' ? 'dark' : 
      mode === 'dark' ? 'auto' : 
      'light';
    setMode(nextMode);
  }, [mode, setMode]);

  const value = useMemo((): ThemeModeContextValue => ({
    mode,
    setMode,
    cycleMode,
    actualColorScheme
  }), [mode, setMode, cycleMode, actualColorScheme]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

/**
 * Hook to access theme mode context
 */
export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
}

/**
 * Hook to get only the resolved color scheme for theming
 */
export function useColorScheme(): 'light' | 'dark' {
  const { actualColorScheme } = useThemeMode();
  return actualColorScheme;
}

export function useOptionalThemeMode(): ThemeModeContextValue | null {
  return useContext(ThemeModeContext);
}

export function useOptionalColorScheme(): 'light' | 'dark' | null {
  return useOptionalThemeMode()?.actualColorScheme ?? null;
}