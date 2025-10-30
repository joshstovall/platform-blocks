import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface UseClipboardOptions {
  /** Time in ms after which the copied state will reset, 2000 by default */
  timeout?: number;
}

export interface UseClipboardReturnValue {
  /** Function to copy value to clipboard */
  copy: (value: any) => Promise<void> | void;
  /** Function to reset copied state and error */
  reset: () => void;
  /** Error if copying failed */
  error: Error | null;
  /** Boolean indicating if the value was copied successfully */
  copied: boolean;
  /** The last copied value (stringified) */
  lastValue: string | null;
  /** True if clipboard API not available */
  unsupported: boolean;
}

/**
 * useClipboard hook
 * Provides a simple way to copy text to the clipboard, track copied state, handle errors,
 * and reset the state after the given timeout. Uses navigator.clipboard.writeText when available
 * and falls back to a manual execCommand copying strategy on web. No-op on native without polyfill.
 */
// Lazy optional expo-clipboard (only present in native envs if installed)
let ExpoClipboard: any = null;
try { // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExpoClipboard = require('expo-clipboard');
} catch {
  console.warn('expo-clipboard not found, clipboard support will be limited on native platforms');
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturnValue {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastValue, setLastValue] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isWeb = Platform.OS === 'web';
  const unsupported = isWeb
    ? (typeof navigator === 'undefined' || !navigator?.clipboard)
    : !ExpoClipboard?.setStringAsync; // native needs expo-clipboard

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCopied(false);
    setError(null);
  }, []);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const scheduleReset = useCallback(() => {
    if (timeout <= 0) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      setError(null);
    }, timeout);
  }, [timeout]);

  const execCopyFallback = useCallback((text: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-1000px';
      textarea.style.left = '-1000px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (!success) throw new Error('Fallback copy command unsuccessful');
      return true;
    } catch (e: any) {
      setError(e);
      return false;
    }
  }, []);

  const copy = useCallback(async (value: any) => {
    reset();
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    setLastValue(text);

    // Native path (expo-clipboard)
    if (!isWeb && ExpoClipboard?.setStringAsync) {
      try {
        await ExpoClipboard.setStringAsync(text);
        setCopied(true);
        scheduleReset();
        return;
      } catch (e: any) {
        setError(e);
      }
    }

    if (isWeb && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        scheduleReset();
        return;
      } catch (e: any) {
        setError(e);
        // attempt fallback below
      }
    }

    // Fallback (web only)
    if (isWeb && typeof document !== 'undefined') {
      const ok = execCopyFallback(text);
      if (ok) {
        setCopied(true);
        scheduleReset();
      }
    }
  }, [execCopyFallback, scheduleReset, reset]);

  return { copy, reset, error, copied, lastValue, unsupported };
}

export default useClipboard;
