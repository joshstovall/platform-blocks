import { useEffect, useRef, useCallback, useState } from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';
import { useOptionalAccessibility } from './context';
import type { FocusOptions, AnnouncementOptions, ScreenReaderInfo } from './types';

/**
 * Hook for managing focus state and restoration
 * Gracefully handles cases where AccessibilityProvider is not available (e.g., in overlays)
 */
export const useFocus = (id: string, options: FocusOptions = {}) => {
  const accessibilityContext = useOptionalAccessibility();

  useEffect(() => {
    if (!accessibilityContext) {
      console.warn('useFocus: AccessibilityProvider not available, focus management will be limited');
    }
  }, [accessibilityContext]);

  const setFocus = accessibilityContext?.setFocus ?? (() => {});
  const restoreFocus = accessibilityContext?.restoreFocus ?? (() => {});
  const currentFocusId = accessibilityContext?.currentFocusId ?? null;

  const elementRef = useRef<any>(null);
  const { preventScroll = false, restoreOnUnmount = false } = options;

  const focus = useCallback(() => {
    if (elementRef.current) {
      setFocus(id);
      
      // Focus the actual element
      try {
        if ('focus' in elementRef.current) {
          elementRef.current.focus({ preventScroll });
        } else {
          // For React Native components, use AccessibilityInfo
          const node = findNodeHandle(elementRef.current);
          if (node) {
            AccessibilityInfo.setAccessibilityFocus(node);
          }
        }
      } catch (error) {
        console.warn('Failed to set focus:', error);
      }
    }
  }, [id, setFocus, preventScroll]);

  const blur = useCallback(() => {
    if (elementRef.current && 'blur' in elementRef.current) {
      elementRef.current.blur();
    }
  }, []);

  const isFocused = currentFocusId === id;

  // Handle restore focus on unmount
  useEffect(() => {
    if (restoreOnUnmount) {
      return () => {
        if (isFocused) {
          restoreFocus();
        }
      };
    }
  }, [restoreOnUnmount, isFocused, restoreFocus]);

  return {
    ref: elementRef,
    focus,
    blur,
    isFocused,
  };
};

/**
 * Hook for making announcements to screen readers
 * Gracefully handles cases where AccessibilityProvider is not available (e.g., in overlays)
 */
export const useAnnouncer = () => {
  const accessibilityContext = useOptionalAccessibility();

  useEffect(() => {
    if (!accessibilityContext) {
      console.warn('useAnnouncer: AccessibilityProvider not available, announcements will be disabled');
    }
  }, [accessibilityContext]);

  const announce = useCallback((
    message: string,
    options: AnnouncementOptions = {}
  ) => {
    // If no accessibility context, just return early
    if (!accessibilityContext) {
      return;
    }

    const {
      priority = 'polite',
      timeout = priority === 'assertive' ? 5000 : 3000,
      clearPrevious = false,
    } = options;

    if (!accessibilityContext.screenReaderEnabled) return;

    // Use context announce if available
    if (accessibilityContext.announce) {
      accessibilityContext.announce(message, priority);
    }

    // Auto-clear after timeout
    if (timeout > 0) {
      setTimeout(() => {
        // Message will be auto-cleared by context
      }, timeout);
    }
  }, [accessibilityContext]);

  return {
    announce,
    screenReaderEnabled: accessibilityContext?.screenReaderEnabled ?? false,
  };
};

/**
 * Hook for detecting reduced motion preferences
 * Gracefully handles cases where AccessibilityProvider is not available (e.g., in overlays)
 */
export const useReducedMotion = () => {
  const accessibilityContext = useOptionalAccessibility();

  useEffect(() => {
    if (!accessibilityContext) {
      console.warn('useReducedMotion: AccessibilityProvider not available, using default motion preferences');
    }
  }, [accessibilityContext]);

  const prefersReducedMotion = accessibilityContext?.prefersReducedMotion ?? false;

  const getDuration = useCallback((normalDuration: number) => {
    return prefersReducedMotion ? 0 : normalDuration;
  }, [prefersReducedMotion]);

  const getScale = useCallback((normalScale: number) => {
    return prefersReducedMotion ? 1 : normalScale;
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    getDuration,
    getScale,
  };
};

/**
 * Hook for screen reader detection and information
 * Gracefully handles cases where AccessibilityProvider is not available (e.g., in overlays)
 */
export const useScreenReader = (): ScreenReaderInfo => {
  const accessibilityContext = useOptionalAccessibility();

  useEffect(() => {
    if (!accessibilityContext) {
      console.warn('useScreenReader: AccessibilityProvider not available, using default screen reader detection');
    }
  }, [accessibilityContext]);

  const screenReaderEnabled = accessibilityContext?.screenReaderEnabled ?? false;
  const [screenReaderType, setScreenReaderType] = useState<'voiceover' | 'talkback' | 'nvda' | 'jaws' | 'unknown'>('unknown');

  useEffect(() => {
    const detectScreenReaderType = async () => {
      try {
        // This is a simplified detection - in reality, you'd need platform-specific detection
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        if (isEnabled) {
          // On iOS, it's likely VoiceOver
          // On Android, it's likely TalkBack
          // This would need more sophisticated detection in a real implementation
          setScreenReaderType('unknown');
        }
      } catch (error) {
        console.warn('Failed to detect screen reader type:', error);
      }
    };

    if (screenReaderEnabled) {
      detectScreenReaderType();
    }
  }, [screenReaderEnabled]);

  return {
    enabled: screenReaderEnabled,
    type: screenReaderType,
  };
};