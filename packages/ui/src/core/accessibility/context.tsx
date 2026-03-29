import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { AccessibilityContextValue, AccessibilityProviderProps } from './types';

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  reducedMotion = false,
}) => {
  // Reduced motion state
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(reducedMotion);
  
  // Focus management state
  const [currentFocusId, setCurrentFocusId] = useState<string | null>(null);
  const [focusHistory, setFocusHistory] = useState<string[]>([]);
  
  // Screen reader state
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  
  // Refs for cleanup
  const announcementTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Check for screen reader on mount
  useEffect(() => {
    const checkScreenReader = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setScreenReaderEnabled(isEnabled);
      } catch (error) {
        console.warn('Failed to check screen reader status:', error);
      }
    };

    checkScreenReader();

    // Listen for screen reader changes
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const checkReducedMotion = async () => {
      try {
        const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setPrefersReducedMotion(isReduceMotionEnabled || reducedMotion);
      } catch (error) {
        console.warn('Failed to check reduced motion preference:', error);
        setPrefersReducedMotion(reducedMotion);
      }
    };

    checkReducedMotion();

    // Listen for reduced motion changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => setPrefersReducedMotion(isEnabled || reducedMotion)
    );

    return () => {
      subscription?.remove();
    };
  }, [reducedMotion]);

  // Focus management
  const setFocus = useCallback((id: string) => {
    setFocusHistory(prev => {
      const newHistory = prev.filter(historyId => historyId !== id);
      if (currentFocusId && currentFocusId !== id) {
        newHistory.push(currentFocusId);
      }
      return newHistory.slice(-10); // Keep last 10 focus states
    });
    setCurrentFocusId(id);
  }, [currentFocusId]);

  const restoreFocus = useCallback(() => {
    const lastFocusId = focusHistory[focusHistory.length - 1];
    if (lastFocusId) {
      setCurrentFocusId(lastFocusId);
      setFocusHistory(prev => prev.slice(0, -1));
    }
  }, [focusHistory]);

  // Announcement system
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!screenReaderEnabled) return;

    setAnnouncements(prev => [...prev, message]);

    // Clear announcement after delay
    const timeout = setTimeout(() => {
      setAnnouncements(prev => prev.filter(ann => ann !== message));
    }, priority === 'assertive' ? 5000 : 3000);

    announcementTimeouts.current.add(timeout);
  }, [screenReaderEnabled]);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
    announcementTimeouts.current.forEach(timeout => clearTimeout(timeout));
    announcementTimeouts.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      announcementTimeouts.current.forEach(timeout => clearTimeout(timeout));
      announcementTimeouts.current.clear();
    };
  }, []);

  const contextValue: AccessibilityContextValue = {
    prefersReducedMotion,
    currentFocusId,
    focusHistory,
    screenReaderEnabled,
    announcements,
    setFocus,
    restoreFocus,
    announce,
    clearAnnouncements,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextValue => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const useOptionalAccessibility = () => useContext(AccessibilityContext);