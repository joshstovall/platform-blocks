import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { 
  HapticsProvider, 
  PlatformBlocksProvider, 
  DialogProvider, 
  SpotlightProvider, 
  ToastProvider, 
  DialogRenderer, 
  onDialogsRequested, 
  onToastsRequested, 
  useTheme,
  AccessibilityProvider,
  KeyboardManagerProvider,
  SoundProvider,
  getAllSounds,
  DirectionProvider,
  useThemeMode,
  type ColorSchemeMode,
  type ThemeModeConfig
} from '@platform-blocks/ui';
import { docsI18nResources } from '../../i18n/resources';
import { ChartThemeProvider } from '@platform-blocks/charts';
import { getAllAppSounds } from '../../config/sounds';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  children: React.ReactNode;
}

const getSafeBrowserStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storage = window.localStorage;
    if (!storage) {
      return null;
    }

    return storage;
  } catch {
    return null;
  }
};

const ConditionalDialogProvider = React.memo<{ enabled: boolean; children: React.ReactNode }>(({ enabled, children }) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <DialogProvider>
      {children}
      <DialogRenderer />
    </DialogProvider>
  );
});

ConditionalDialogProvider.displayName = 'ConditionalDialogProvider';

const ConditionalToastProvider = React.memo<{ enabled: boolean; children: React.ReactNode }>(({ enabled, children }) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
});

ConditionalToastProvider.displayName = 'ConditionalToastProvider';

export const AppProviders: React.FC<Props> = React.memo(({ children }) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const [dialogsEnabled, setDialogsEnabled] = useState<boolean>(isDev);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(isDev);
  const browserStorage = useMemo(() => getSafeBrowserStorage(), []);
  const directionMemoryRef = useRef<Record<string, string>>({});
  const keyboardManagerEnabled = useMemo(() => {
    const flag = process.env.EXPO_PUBLIC_ENABLE_KEYBOARD_MANAGER;
    if (flag === 'false') {
      return false;
    }
    return true;
  }, []);

  useEffect(() => {
    const detachDialog = onDialogsRequested(() => setDialogsEnabled(true));
    const detachNotifications = onToastsRequested(() => setNotificationsEnabled(true));
    return () => {
      detachDialog();
      detachNotifications();
    };
  }, []);

  // Enhanced theme mode configuration that matches the docs app's current behavior
  const themeModeConfig: ThemeModeConfig | undefined = useMemo(() => {
    if (Platform.OS === 'web' && browserStorage) {
      return {
        initialMode: 'auto',
        persistence: {
          get: () => {
            try {
              const stored = browserStorage.getItem('platform-blocks-theme-mode');
              if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
            } catch {
              return null;
            }
            return null;
          },
          set: (mode) => {
            try {
              browserStorage.setItem('platform-blocks-theme-mode', mode);
            } catch {
              /* noop */
            }
          }
        },
        domConfig: {
          selector: 'html',
          lightClass: 'platform-blocks-light',
          darkClass: 'platform-blocks-dark',
          attribute: 'data-platform-blocks-manual'
        }
      };
    }

    // Native platforms still need the provider, but can rely on default persistence.
    return {
      initialMode: 'auto'
    };
  }, [browserStorage]);

  const readDirectionMemory = (key: string) => directionMemoryRef.current[key] ?? null;
  const writeDirectionMemory = (key: string, value: string) => {
    directionMemoryRef.current[key] = value;
  };

  // Direction storage controller for RTL support
  const directionStorage = useMemo(() => {
    if (Platform.OS === 'web' && browserStorage) {
      return {
        getItem: async (key: string) => {
          try {
            return browserStorage.getItem(key);
          } catch {
            return null;
          }
        },
        setItem: async (key: string, value: string) => {
          try {
            browserStorage.setItem(key, value);
          } catch {
            /* no-op */
          }
        }
      };
    }

    return {
      getItem: async (key: string) => {
        if (Platform.OS === 'web') {
          return readDirectionMemory(key);
        }

        try {
          const value = await AsyncStorage.getItem(key);
          if (value == null) {
            return readDirectionMemory(key);
          }
          writeDirectionMemory(key, value);
          return value;
        } catch {
          return readDirectionMemory(key);
        }
      },
      setItem: async (key: string, value: string) => {
        writeDirectionMemory(key, value);

        if (Platform.OS !== 'web') {
          try {
            await AsyncStorage.setItem(key, value);
          } catch {
            /* ignore write errors */
          }
        }
      }
    };
  }, [browserStorage]);

  // Memoize providers to avoid unnecessary re-renders when only color scheme changes
  const content = useMemo(() => (
    <ConditionalDialogProvider enabled={dialogsEnabled}>
      <SpotlightProvider>
        <ConditionalToastProvider enabled={notificationsEnabled}>
          <AccessibilityProvider>
            <SoundProvider initialSounds={getAllAppSounds()}>
              {children}
            </SoundProvider>
          </AccessibilityProvider>
        </ConditionalToastProvider>
      </SpotlightProvider>
    </ConditionalDialogProvider>
  ), [children, dialogsEnabled, notificationsEnabled]);

  return (
    <SafeAreaProvider>
      <HapticsProvider>
        <DirectionProvider 
          initialDirection="ltr"
          storage={directionStorage}
          storageKey="platform-blocks-direction"
        >
          <PlatformBlocksProvider 
            themeModeConfig={themeModeConfig}
            withOverlays 
            i18nResources={docsI18nResources}
          >
            <ThemeModeHydrator />
            <ChartThemeBridge>
              <KeyboardManagerProvider disabled={!keyboardManagerEnabled}>
                {content}
              </KeyboardManagerProvider>
            </ChartThemeBridge>
          </PlatformBlocksProvider>
        </DirectionProvider>
      </HapticsProvider>
    </SafeAreaProvider>
  );
});

AppProviders.displayName = 'AppProviders';

const ChartThemeBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const accentPalette = React.useMemo(() => {
    const candidates = [
      theme.colors.primary?.[5],
      theme.colors.secondary?.[5],
      theme.colors.tertiary?.[5],
      theme.colors.success?.[5],
      theme.colors.warning?.[5],
      theme.colors.error?.[5],
      theme.colors.cyan?.[5],
      theme.colors.sky?.[5],
      theme.colors.purple?.[5],
      theme.colors.indigo?.[5],
      theme.colors.pink?.[5],
      theme.colors.lime?.[5],
    ].filter(Boolean) as string[];
    const unique: string[] = [];
    const seen = new Set<string>();
    candidates.forEach((color) => {
      const key = color.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(color);
      }
    });
    return unique.length ? unique : undefined;
  }, [theme]);

  const hostBridge = React.useMemo(() => ({
    textPrimary: theme.text.primary,
    textSecondary: theme.text.secondary,
    background: theme.backgrounds.surface,
    grid: theme.colors.gray?.[3] ?? theme.backgrounds.border ?? '#e5e7eb',
    accentPalette,
    fontFamily: theme.fontFamily,
  }), [theme, accentPalette]);

  return (
    <ChartThemeProvider hostThemeBridge={hostBridge}>
      {children}
    </ChartThemeProvider>
  );
};

ChartThemeBridge.displayName = 'ChartThemeBridge';

const ThemeModeHydrator: React.FC = () => {
  const { mode, setMode } = useThemeMode();
  const hydratedRef = React.useRef(Platform.OS === 'web');
  const latestModeRef = React.useRef(mode);

  useEffect(() => {
    latestModeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (Platform.OS === 'web' || hydratedRef.current) {
      return;
    }

    let cancelled = false;

    AsyncStorage.getItem('platform-blocks-theme-mode')
      .then((stored: string | null) => {
        if (cancelled) {
          return;
        }

        const persistedMode = stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : null;
        hydratedRef.current = true; // Unlock writes only after the initial read completes

        if (persistedMode && persistedMode !== latestModeRef.current) {
          setMode(persistedMode);
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        hydratedRef.current = true;
        // Ignore read errors
      });

    return () => {
      cancelled = true;
    };
  }, [setMode]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    if (!hydratedRef.current) {
      return;
    }

    AsyncStorage.setItem('platform-blocks-theme-mode', mode).catch(() => {
      // Ignore write errors
    });
  }, [mode]);

  return null;
};

ThemeModeHydrator.displayName = 'ThemeModeHydrator';
