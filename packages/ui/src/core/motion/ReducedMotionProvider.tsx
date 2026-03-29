import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export interface ReducedMotionContextValue { reduced: boolean; }

const ReducedMotionContext = createContext<ReducedMotionContextValue>({ reduced: false });

export interface ReducedMotionProviderProps { children: React.ReactNode; forcedValue?: boolean; }

export const ReducedMotionProvider: React.FC<ReducedMotionProviderProps> = ({ children, forcedValue }) => {
  const [reduced, setReduced] = useState<boolean>(false);
  const forcedRef = useRef(forcedValue);
  forcedRef.current = forcedValue;

  useEffect(() => {
    let mounted = true;
    // Native (iOS/Android)
    AccessibilityInfo.isReduceMotionEnabled?.().then((value) => {
      if (mounted && forcedRef.current === undefined) setReduced(!!value);
    }).catch(() => {
      console.warn('AccessibilityInfo.isReduceMotionEnabled is not available on this platform');
    });

    const sub = (AccessibilityInfo as any).addEventListener?.('reduceMotionChanged', (value: boolean) => {
      if (forcedRef.current === undefined) setReduced(!!value);
    });

    // Web
    let mql: MediaQueryList | undefined;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'matchMedia' in window) {
      mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const apply = () => {
        if (forcedRef.current === undefined) setReduced(mql!.matches);
      };
      try {
        if (mql.addEventListener) mql.addEventListener('change', apply); else (mql as any).addListener(apply);
      } catch {
        console.warn('MediaQueryList.addEventListener is not supported, falling back to deprecated addListener');
      }
      apply();
    }

    return () => {
      mounted = false;
      try { sub?.remove?.(); } catch {
        console.warn('AccessibilityInfo.removeEventListener is not supported, falling back to deprecated remove');
      }
      if (mql) {
        try { if (mql.removeEventListener) mql.removeEventListener('change', () => {}); else (mql as any).removeListener(() => {}); } catch {
          console.warn('MediaQueryList.removeEventListener is not supported, falling back to deprecated removeListener');
        }
      }
    };
  }, []);

  const value: ReducedMotionContextValue = { reduced: forcedValue !== undefined ? forcedValue : reduced };
  return <ReducedMotionContext.Provider value={value}>{children}</ReducedMotionContext.Provider>;
};

export function useReducedMotion(): boolean { return useContext(ReducedMotionContext).reduced; }
