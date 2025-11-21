import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { useOptionalHapticsSettings } from '../core/haptics/HapticsProvider';
import { resolveOptionalModule } from '../utils/optionalModule';

// Lazy load expo-haptics (optional dependency) so library works without it.
const Haptics = resolveOptionalModule<any>('expo-haptics');

export interface UseHapticsOptions {
  /** Whether haptics are disabled */
  disabled?: boolean;
  /** Minimum ms between triggers to avoid flood. */
  throttleMs?: number;
}

export interface UseHapticsReturn {
  /** Light impact when press starts */
  impactPressIn: () => void;
  /** A second impact on release (slightly heavier) */
  impactPressOut: () => void;
  /** Convenience for success events (e.g., toast show) */
  notifySuccess: () => void;
  /** Convenience for warning events */
  notifyWarning: () => void;
  /** Convenience for error events */
  notifyError: () => void;
  /** Haptic feedback for selection changes */
  selection: () => void;
}

export function useHaptics(opts: UseHapticsOptions = {}): UseHapticsReturn {
  const { disabled, throttleMs = 40 } = opts;
  const lastRef = useRef(0);
  const missingProviderWarnedRef = useRef(false);
  const hapticsSettings = useOptionalHapticsSettings();

  if (__DEV__ && !hapticsSettings && !missingProviderWarnedRef.current) {
    console.warn('[platform-blocks] useHaptics called without <HapticsProvider>; falling back to defaults.');
    missingProviderWarnedRef.current = true;
  }

  const enabled = hapticsSettings?.enabled ?? true;
  const can = !!Haptics && !disabled && enabled && (Platform.OS === 'ios' || Platform.OS === 'android');
  const withinThrottle = () => {
    const now = Date.now();
    if (now - lastRef.current < throttleMs) return true;
    lastRef.current = now;
    return false;
  };

  const safeRun = useCallback((fn: () => Promise<any> | void) => {
    if (!can || withinThrottle()) return;
    try { fn(); } catch {
      console.warn('Haptics call failed, ensure expo-haptics is installed correctly');
    }
  }, [can]);

  const impactPressIn = useCallback(() => {
    // Defer to avoid synchronous call on UI thread causing worklet boundary error
    Promise.resolve().then(() => safeRun(() => Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Medium)));
  }, [safeRun]);

  const impactPressOut = useCallback(() => {
    Promise.resolve().then(() => safeRun(() => Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Light)));
  }, [safeRun]);

  const notifySuccess = useCallback(() => {
    safeRun(() => Haptics?.notificationAsync?.(Haptics.NotificationFeedbackType.Success));
  }, [safeRun]);

  const notifyWarning = useCallback(() => {
    safeRun(() => Haptics?.notificationAsync?.(Haptics.NotificationFeedbackType.Warning));
  }, [safeRun]);

  const notifyError = useCallback(() => {
    safeRun(() => Haptics?.notificationAsync?.(Haptics.NotificationFeedbackType.Error));
  }, [safeRun]);

  const selection = useCallback(() => {
    safeRun(() => Haptics?.selectionAsync?.());
  }, [safeRun]);

  return { impactPressIn, impactPressOut, notifySuccess, notifyWarning, notifyError, selection };
}

export default useHaptics;
