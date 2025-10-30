export interface Breakpoints {
  /** Base breakpoint (0px) */
  base: number;
  /** Small phones / narrow screens */
  sm: number;
  /** Tablets / small desktop */
  md: number;
  /** Large desktop */
  lg: number;
  /** Wide screens */
  xl: number;
}

export const DEFAULT_BREAKPOINTS: Breakpoints = {
  base: 0,
  sm: 480,
  md: 640,
  lg: 960,
  xl: 1200,
};

export type ResponsiveProp<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T };

/**
 * Resolves a responsive prop value based on the current width and breakpoints
 * @param value - The responsive prop value to resolve
 * @param width - The current width to check against breakpoints
 * @param breakpoints - The breakpoints configuration to use
 * @returns The resolved value for the current width
 */
export function resolveResponsiveProp<T>(value: ResponsiveProp<T> | undefined, width: number, breakpoints: Breakpoints = DEFAULT_BREAKPOINTS): T | undefined {
  if (value === undefined) return undefined;
  if (value && typeof value !== 'object') return value as T;
  const map = value as Record<string, T | undefined>;
  /** Determine active breakpoint (largest whose min <= width) */
  const order: (keyof Breakpoints)[] = ['base', 'sm', 'md', 'lg', 'xl'];
  let active: T | undefined;
  for (const key of order) {
    const min = breakpoints[key];
    if (width >= min && map[key] !== undefined) {
      active = map[key];
    }
  }
  /** Fallback: if nothing matched, try explicit base */
  if (active === undefined) active = map.base;
  return active;
}

/**
 * Returns the first defined value from the provided arguments
 * @param vals - Values to check for defined state
 * @returns The first defined value or undefined if none are defined
 */
export function pickFirstDefined<T>(...vals: (T | undefined)[]): T | undefined {
  for (const v of vals) if (v !== undefined) return v;
  return undefined;
}