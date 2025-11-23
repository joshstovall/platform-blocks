import { Platform } from 'react-native';

interface OptionalModuleCacheEntry {
  value: any | null;
  error: Error | null;
  logged: boolean;
}

interface ResolveOptionalModuleOptions<T> {
  accessor?: (module: any) => T | null | undefined;
  devWarning?: string;
  loader?: () => any;
}

const optionalModuleCache = new Map<string, OptionalModuleCacheEntry>();

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

type OptionalModuleLoader = () => any;

// Metro bundler requires static string literals for require; keep all optional modules here.
const optionalModuleLoaders: Record<string, OptionalModuleLoader> = {
  'react-native': () => require('react-native'),
  'expo-clipboard': () => require('expo-clipboard'),
  'expo-haptics': () => require('expo-haptics'),
  'expo-linear-gradient': () => require('expo-linear-gradient'),
  'expo-document-picker': () => require('expo-document-picker'),
  'react-native-webview': () => require('react-native-webview'),
  'lodash.debounce': () => require('lodash.debounce'),
  'react-syntax-highlighter': () => require('react-syntax-highlighter'),
  'react-syntax-highlighter/dist/esm/languages/prism/jsx': () =>
    require('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
  'react-syntax-highlighter/dist/esm/languages/prism/tsx': () =>
    require('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
  'react-syntax-highlighter/dist/esm/languages/prism/typescript': () =>
    require('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
  'react-syntax-highlighter/dist/esm/languages/prism/javascript': () =>
    require('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  'react-syntax-highlighter/dist/esm/languages/prism/json': () =>
    require('react-syntax-highlighter/dist/esm/languages/prism/json'),
  'react-syntax-highlighter/dist/esm/languages/prism/bash': () =>
    require('react-syntax-highlighter/dist/esm/languages/prism/bash'),
  'react-syntax-highlighter/dist/esm/styles/prism/prism': () =>
    require('react-syntax-highlighter/dist/esm/styles/prism/prism'),
  'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus': () =>
    require('react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'),
  'expo-audio': () => require('expo-audio'),
  'react-native-gesture-handler': () => require('react-native-gesture-handler'),
  'expo-status-bar': () => require('expo-status-bar'),
  'lottie-react': () => require('lottie-react'),
  '@lottiefiles/dotlottie-react': () => require('@lottiefiles/dotlottie-react'),
  'lottie-react-native': () => require('lottie-react-native'),
  'expo-navigation-bar': () => require('expo-navigation-bar'),
};

/**
 * Attempts to synchronously resolve an optional dependency while caching the result.
 * Returns `null` when the module cannot be loaded. An optional accessor can pull
 * a specific export off the module evaluation.
 */
export function resolveOptionalModule<T = any>(moduleId: string, options: ResolveOptionalModuleOptions<T> = {}): T | null {
  const { accessor, devWarning, loader } = options;

  const cached = optionalModuleCache.get(moduleId);
  if (cached) {
    if (cached.value != null) {
      const result = accessor ? accessor(cached.value) : cached.value;
      return (result ?? null) as T | null;
    }
    if (isDev && devWarning && !cached.logged) {
      cached.logged = true;
      console.warn(devWarning);
    }
    return null;
  }

  const entry: OptionalModuleCacheEntry = { value: null, error: null, logged: false };
  optionalModuleCache.set(moduleId, entry);

  const moduleLoader = loader ?? optionalModuleLoaders[moduleId];
  if (!moduleLoader) {
    const message = `Optional module "${moduleId}" is not registered with optionalModuleLoaders.`;
    entry.error = new Error(message);
    if (isDev) {
      const prefix = Platform.OS === 'web' ? '[platform-blocks]' : '[platform-blocks/native]';
      entry.logged = true;
      console.warn(`${prefix} ${devWarning ?? message}`);
    }
    return null;
  }

  try {
    const required = moduleLoader();
    entry.value = required;
  } catch (error) {
    entry.error = error instanceof Error ? error : new Error(String(error));
    if (isDev && devWarning) {
      entry.logged = true;
      const prefix = Platform.OS === 'web' ? '[platform-blocks]' : '[platform-blocks/native]';
      console.warn(`${prefix} ${devWarning}`);
    }
    return null;
  }

  const result = accessor ? accessor(entry.value) : entry.value;
  return (result ?? null) as T | null;
}

/**
 * Clears the cached optional module entries. Useful for tests to re-attempt loads.
 */
export function resetOptionalModuleCache() {
  optionalModuleCache.clear();
}
