import { useState, useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';
import type { Breakpoint } from '../types';

// Central breakpoint values (keep in sync with design tokens if needed)
export const BREAKPOINT_VALUES = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm');

  useEffect(() => {
    if (Platform.OS === 'web') {
      const updateBreakpoint = () => {
        const width = window.innerWidth;
        if (width >= BREAKPOINT_VALUES.xl) setBreakpoint('xl');
        else if (width >= BREAKPOINT_VALUES.lg) setBreakpoint('lg');
        else if (width >= BREAKPOINT_VALUES.md) setBreakpoint('md');
        else if (width >= BREAKPOINT_VALUES.sm) setBreakpoint('sm');
        else setBreakpoint('xs');
      };
      updateBreakpoint();
      window.addEventListener('resize', updateBreakpoint);
      return () => window.removeEventListener('resize', updateBreakpoint);
    } else {
      const { width } = Dimensions.get('window');
      if (width >= BREAKPOINT_VALUES.xl) setBreakpoint('xl');
      else if (width >= BREAKPOINT_VALUES.lg) setBreakpoint('lg');
      else if (width >= BREAKPOINT_VALUES.md) setBreakpoint('md');
      else if (width >= BREAKPOINT_VALUES.sm) setBreakpoint('sm');
      else setBreakpoint('xs');
    }
  }, []);

  return breakpoint;
};
