import type { ResponsiveSize, Breakpoint } from '../types';

// Ordered breakpoints for fallback resolution
const ORDER: Breakpoint[] = ['base', 'xs', 'sm', 'md', 'lg', 'xl'];

export const resolveResponsiveValue = (value: ResponsiveSize, breakpoint: Breakpoint): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseInt(value, 10) || 0;
  const currentIndex = ORDER.indexOf(breakpoint);
  for (let i = currentIndex; i >= 0; i--) {
    const bp = ORDER[i];
    if (value[bp] != null) {
      const v: any = value[bp];
      return typeof v === 'number' ? v : parseInt(v, 10) || 0;
    }
  }
  return 0;
};
