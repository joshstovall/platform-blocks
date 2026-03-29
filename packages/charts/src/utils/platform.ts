// Simple platform detection helper for charts package without importing full React Native Platform everywhere.
// We treat 'web' as presence of window & document objects.

/**
 * Checks if the current platform is web (browser)
 * @returns True if running in a browser environment
 */
export const isWeb = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Optional helper for SSR-safe window access
 * Returns undefined if window is not available
 */
export const safeWindow: (Window & typeof globalThis) | undefined = typeof window !== 'undefined' ? window : undefined;
