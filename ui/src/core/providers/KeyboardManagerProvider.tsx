import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export interface KeyboardManagerProviderProps {
  children: React.ReactNode;
  /**
   * Optional flag to disable native listeners (primarily for tests).
   */
  disabled?: boolean;
}

export interface KeyboardManagerContextValue {
  /** Indicates if the on-screen keyboard is currently visible */
  isKeyboardVisible: boolean;
  /** Height of the keyboard in pixels when visible */
  keyboardHeight: number;
  /** Native end coordinates from the last keyboard event */
  keyboardEndCoordinates?: KeyboardEvent['endCoordinates'];
  /** Reported animation duration (ms) from the native keyboard event */
  keyboardAnimationDuration: number;
  /** Reported animation easing from the native keyboard event */
  keyboardAnimationEasing?: KeyboardEvent['easing'];
  /** Latest focus target requested via `setFocusTarget`; null when none pending */
  pendingFocusTarget: string | null;
  /** Imperative helper for dismissing the keyboard */
  dismissKeyboard: () => void;
  /**
   * Sets an optional focus target that can be consumed by an input after the keyboard closes.
   * Passing null clears the stored target.
   */
  setFocusTarget: (componentId: string | null) => void;
  /**
   * Returns true when the provided component id matches the stored focus target.
   * The focus target is cleared after a successful match.
   */
  consumeFocusTarget: (componentId: string) => boolean;
  /**
   * Helper that records a focus target so the next mounted input can restore focus.
   * Consumers can call `dismissKeyboard` separately when they need to drop the keyboard.
   */
  refocus: (componentId: string, options?: { dismiss?: boolean }) => void;
}

interface KeyboardState {
  isVisible: boolean;
  height: number;
  endCoordinates?: KeyboardEvent['endCoordinates'];
  duration: number;
  easing?: KeyboardEvent['easing'];
}

const DEFAULT_STATE: KeyboardState = {
  isVisible: false,
  height: 0,
  duration: 0,
  easing: undefined,
};

const KeyboardManagerContext = createContext<KeyboardManagerContextValue | null>(null);

export const KeyboardManagerProvider: React.FC<KeyboardManagerProviderProps> = ({
  children,
  disabled = false,
}) => {
  const [state, setState] = useState<KeyboardState>(DEFAULT_STATE);
  const focusTargetRef = useRef<string | null>(null);
  const [pendingFocusTarget, setPendingFocusTarget] = useState<string | null>(null);

  const handleKeyboardChange = useCallback((event: KeyboardEvent) => {
    if (!event) {
      return;
    }

    const height = event.endCoordinates?.height ?? 0;

    setState({
      isVisible: true,
      height,
      endCoordinates: event.endCoordinates,
      duration: event.duration ?? 0,
      easing: event.easing,
    });
  }, []);

  const handleKeyboardHide = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: false,
      height: 0,
      endCoordinates: undefined,
      duration: 0,
      easing: undefined,
    }));
  }, []);

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    const listeners = [
      Keyboard.addListener('keyboardWillShow', handleKeyboardChange),
      Keyboard.addListener('keyboardDidShow', handleKeyboardChange),
      Keyboard.addListener('keyboardWillChangeFrame', handleKeyboardChange),
      Keyboard.addListener('keyboardDidChangeFrame', handleKeyboardChange),
      Keyboard.addListener('keyboardWillHide', handleKeyboardHide),
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide),
    ];

    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }, [disabled, handleKeyboardChange, handleKeyboardHide]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const setFocusTarget = useCallback((componentId: string | null) => {
    focusTargetRef.current = componentId;
    setPendingFocusTarget(componentId);
  }, []);

  const consumeFocusTarget = useCallback((componentId: string) => {
    if (!focusTargetRef.current) {
      return false;
    }

    if (focusTargetRef.current === componentId) {
      focusTargetRef.current = null;
      setPendingFocusTarget(null);
      return true;
    }

    return false;
  }, []);

  const refocus = useCallback((componentId: string, options?: { dismiss?: boolean }) => {
    if (!componentId) {
      return;
    }

    if (options?.dismiss) {
      dismissKeyboard();
    }

    setFocusTarget(componentId);
  }, [dismissKeyboard, setFocusTarget]);

  const value = useMemo<KeyboardManagerContextValue>(() => ({
    isKeyboardVisible: state.isVisible,
    keyboardHeight: state.height,
    keyboardEndCoordinates: state.endCoordinates,
    keyboardAnimationDuration: state.duration,
    keyboardAnimationEasing: state.easing,
    pendingFocusTarget,
    dismissKeyboard,
    setFocusTarget,
    consumeFocusTarget,
    refocus,
  }), [state, pendingFocusTarget, dismissKeyboard, setFocusTarget, consumeFocusTarget, refocus]);

  return (
    <KeyboardManagerContext.Provider value={value}>
      {children}
    </KeyboardManagerContext.Provider>
  );
};

KeyboardManagerProvider.displayName = 'KeyboardManagerProvider';

export function useKeyboardManager(): KeyboardManagerContextValue {
  const context = useContext(KeyboardManagerContext);
  if (!context) {
    throw new Error('useKeyboardManager must be used within a KeyboardManagerProvider');
  }
  return context;
}

export function useKeyboardManagerOptional(): KeyboardManagerContextValue | null {
  return useContext(KeyboardManagerContext);
}
