import React, { useMemo, useRef, useEffect } from 'react';

import { CSSVariables } from './CSSVariables';
import { DARK_THEME } from './darkTheme';
import { DEFAULT_THEME } from './defaultTheme';
import { PlatformBlocksThemeProvider, PlatformBlocksThemeProviderProps } from './ThemeProvider';
import { useColorScheme, ColorScheme } from './useColorScheme';
import { OverlayProvider, OverlayRenderer } from '../providers';
import { SpotlightController } from '../../components/Spotlight/SpotlightController';
import { I18nProvider } from '../i18n';
import { UniversalCSS } from '../utils/UniversalCSS';
import type { HighlightProps as HighlightComponentProps } from '../../components/Highlight';
import {
  ThemeModeProvider,
  ThemeModeConfig,
  useOptionalColorScheme as useOptionalThemeModeColorScheme
} from './ThemeModeProvider';

interface ThemeBoundaryProps {
  theme: PlatformBlocksThemeProviderProps['theme'];
  inherit: boolean;
  withCSSVariables: boolean;
  cssVariablesSelector: string;
  withGlobalCSS: boolean;
  children: React.ReactNode;
}

const ThemeBoundary = React.memo<ThemeBoundaryProps>(function ThemeBoundary({
  theme,
  inherit,
  withCSSVariables,
  cssVariablesSelector,
  withGlobalCSS,
  children,
}) {
  return (
    <PlatformBlocksThemeProvider theme={theme} inherit={inherit}>
      {withCSSVariables && <CSSVariables selector={cssVariablesSelector} />}
      {withGlobalCSS && <UniversalCSS />}
      {children}
    </PlatformBlocksThemeProvider>
  );
});

interface OverlayBoundaryProps {
  enabled: boolean;
  children: React.ReactNode;
}

const OverlayBoundary = React.memo<OverlayBoundaryProps>(function OverlayBoundary({ enabled, children }) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <OverlayProvider>
      {children}
      <OverlayRenderer />
    </OverlayProvider>
  );
});

interface I18nBoundaryProps {
  locale: string;
  fallbackLocale: string;
  resources: NonNullable<PlatformBlocksProviderProps['i18nResources']>;
  children: React.ReactNode;
}

const I18nBoundary = React.memo<I18nBoundaryProps>(function I18nBoundary({ locale, fallbackLocale, resources, children }) {
  return (
    <I18nProvider initial={{ locale, fallbackLocale, resources }}>
      {children}
    </I18nProvider>
  );
});

export interface PlatformBlocksProviderProps extends Omit<PlatformBlocksThemeProviderProps, 'children'> {
  /** Your application */
  children: React.ReactNode;

  /** Whether to inject CSS variables */
  withCSSVariables?: boolean;

  /** CSS selector where variables should be applied */
  cssVariablesSelector?: string;

  /**
   * Color scheme mode:
   * - 'auto': automatically follows OS preference
   * - 'light': force light mode
   * - 'dark': force dark mode
   */
  colorSchemeMode?: 'auto' | 'light' | 'dark';

  /** Whether to enable overlay system (menus, tooltips, etc.) */
  withOverlays?: boolean;

  /** Whether to inject global CSS for universal props (lightHidden/darkHidden) */
  withGlobalCSS?: boolean;

  /** Enhanced theme mode configuration */
  themeModeConfig?: ThemeModeConfig;

  /** Lazily mount Spotlight search UI at library level (opt-in) */
  withSpotlight?: boolean;
  /** Configure Spotlight behavior at provider level */
  spotlightConfig?: {
    shortcut?: string | string[] | null; // default ['cmd+k','ctrl+k']
    actions?: any[]; // optional initial actions; apps can still mount their own Spotlight if needed
    placeholder?: string;
    limit?: number;
    highlightQuery?: boolean | HighlightComponentProps['highlight'];
    /** Render Spotlight even when no actions provided (useful to inject later) */
    alwaysMount?: boolean;
  };

  /** i18n: initial active locale */
  locale?: string;
  /** i18n: fallback locale */
  fallbackLocale?: string;
  /** i18n: resources map */
  i18nResources?: Record<string, { translation: Record<string, any> }>;
}

/**
 * Internal component that uses the enhanced theme mode when config is provided
 */
function PlatformBlocksContent({
  children,
  theme,
  inherit = true,
  withCSSVariables = true,
  cssVariablesSelector = ':root',
  colorSchemeMode = 'auto',
  withOverlays = true,
  withSpotlight = false,
  withGlobalCSS = true,
  spotlightConfig,
  themeModeConfig
}: Omit<PlatformBlocksProviderProps, 'locale' | 'fallbackLocale' | 'i18nResources'>) {
  const osColorScheme = useColorScheme();
  const optionalThemeModeColorScheme = useOptionalThemeModeColorScheme();
  
  // Use enhanced theme mode if available, otherwise fall back to colorSchemeMode
  const enhancedColorScheme = themeModeConfig ? optionalThemeModeColorScheme : null;
  const effectiveColorScheme = enhancedColorScheme || colorSchemeMode;
  
  // Cache light & dark theme objects once. If custom theme provided, bypass cache.
  const cachedThemesRef = useRef<{ light: any; dark: any } | null>(null);
  if (!cachedThemesRef.current && !theme) {
    cachedThemesRef.current = {
      light: DEFAULT_THEME,
      dark: {
        ...DEFAULT_THEME,
        colorScheme: 'dark' as const,
        colors: DARK_THEME.colors,
        text: DARK_THEME.text,
        backgrounds: DARK_THEME.backgrounds,
      }
    };
  }

  const resolvedTheme = useMemo(() => {
    if (theme) return theme; // user supplied custom theme (assumed stable externally)
    const store = cachedThemesRef.current!;
    const target: ColorScheme = effectiveColorScheme === 'auto' ? osColorScheme : effectiveColorScheme;
    return target === 'dark' ? store.dark : store.light;
  }, [theme, effectiveColorScheme, osColorScheme]);

  // Set color scheme data attribute on root element (web only)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const target = effectiveColorScheme === 'auto' ? osColorScheme : effectiveColorScheme;
      document.documentElement.setAttribute('data-platform-blocks-color-scheme', target);
    }
  }, [effectiveColorScheme, osColorScheme]);

  const mainContent = (
    <ThemeBoundary
      theme={resolvedTheme}
      inherit={inherit}
      withCSSVariables={withCSSVariables}
      cssVariablesSelector={cssVariablesSelector}
      withGlobalCSS={withGlobalCSS}
    >
      {children}
      {withSpotlight && <SpotlightController config={spotlightConfig} />}
    </ThemeBoundary>
  );

  return (
    <OverlayBoundary enabled={withOverlays}>
      {mainContent}
    </OverlayBoundary>
  );
}

/**
 * Main provider component for Platform Blocks library
 * Provides theme context and injects CSS variables
 */
export function PlatformBlocksProvider({
  children,
  theme,
  inherit = true,
  withCSSVariables = true,
  cssVariablesSelector = ':root',
  colorSchemeMode = 'auto',
  withOverlays = true,
  withSpotlight = false,
  withGlobalCSS = true,
  themeModeConfig,
  spotlightConfig,
  locale = 'en',
  fallbackLocale = 'en',
  i18nResources
}: PlatformBlocksProviderProps) {
  const i18nStore = useMemo(
    () => i18nResources || { en: { translation: {} } },
    [i18nResources]
  );

  const content = (
    <PlatformBlocksContent
      theme={theme}
      inherit={inherit}
      withCSSVariables={withCSSVariables}
      cssVariablesSelector={cssVariablesSelector}
      colorSchemeMode={colorSchemeMode}
      withOverlays={withOverlays}
      withSpotlight={withSpotlight}
      withGlobalCSS={withGlobalCSS}
      spotlightConfig={spotlightConfig}
      themeModeConfig={themeModeConfig}
    >
      {children}
    </PlatformBlocksContent>
  );

  const themedTree = themeModeConfig ? (
    <ThemeModeProvider config={themeModeConfig}>
      {content}
    </ThemeModeProvider>
  ) : (
    content
  );

  return (
    <I18nBoundary
      locale={locale}
      fallbackLocale={fallbackLocale}
      resources={i18nStore}
    >
      {themedTree}
    </I18nBoundary>
  );
}

PlatformBlocksProvider.displayName = 'PlatformBlocksProvider';
