// Size system for Platform Blocks - supports both string tokens and numeric values
// Inspired by Mantine's size system

import { DESIGN_TOKENS } from '../design-tokens';

export type SizeValue =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  | number;

export interface SizeScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

// Base size scales (in pixels)
export const SIZE_SCALES = {
  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24
  },

  // Spacing (padding, margin, gap) - now using design tokens
  spacing: DESIGN_TOKENS.spacing,

  // Icon sizes
  iconSize: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 40
  },

  // Component heights
  height: {
    xs: 28,
    sm: 32,
    md: 36,
    lg: 44,
    xl: 52,
    '2xl': 60,
    '3xl': 68
  },

  // Border radius
  radius: {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 20
  },

  // Line heights (as multipliers)
  lineHeight: {
    xs: 1.2,
    sm: 1.3,
    md: 1.4,
    lg: 1.5,
    xl: 1.6,
    '2xl': 1.7,
    '3xl': 1.8
  }
} as const;

/**
 * Resolves a size value to a number
 * @param value - Size value (string token or number)
 * @param scale - Which scale to use for string tokens
 * @param unit - Unit to append (default: no unit for React Native)
 * @returns Resolved size as number or string with unit
 */
export function resolveSize(
  value: SizeValue | undefined,
  scale: keyof typeof SIZE_SCALES,
  unit: 'px' | 'rem' | 'em' | '' = ''
): number | string {
  if (value === undefined) {
    return SIZE_SCALES[scale].md;
  }

  if (typeof value === 'number') {
    return unit ? `${value}${unit}` : value;
  }

  const resolvedValue = SIZE_SCALES[scale][value];
  return unit ? `${resolvedValue}${unit}` : resolvedValue;
}

/**
 * Get font size from size value
 */
export function getFontSize(size: SizeValue | undefined): number {
  return resolveSize(size, 'fontSize') as number;
}

/**
 * Get spacing from size value
 */
export function getSpacing(size: SizeValue | undefined): number {
  return resolveSize(size, 'spacing') as number;
}

/**
 * Get icon size from size value
 */
export function getIconSize(size: SizeValue | undefined): number {
  return resolveSize(size, 'iconSize') as number;
}

/**
 * Get height from size value
 */
export function getHeight(size: SizeValue | undefined): number {
  return resolveSize(size, 'height') as number;
}

/**
 * Get border radius from size value
 */
export function getRadius(size: SizeValue | undefined): number {
  return resolveSize(size, 'radius') as number;
}

/**
 * Get line height from size value
 * For numeric values, returns a reasonable line height multiplier
 * For string values, uses the predefined line height scale
 */
export function getLineHeight(size: SizeValue | undefined): number {
  if (typeof size === 'number') {
    // For numeric font sizes, return a reasonable line height multiplier
    // Larger fonts typically need smaller line height multipliers
    if (size <= 12) return 1.4;
    if (size <= 16) return 1.3;
    if (size <= 24) return 1.2;
    if (size <= 48) return 1.1;
    if (size <= 72) return 1.0;
    return 0.9; // For very large display fonts, use extra tight line height
  }
  
  return resolveSize(size, 'lineHeight') as number;
}

// Common size combinations for components
export const COMPONENT_SIZES = {
  button: {
    xs: { fontSize: 'xs' as const, spacing: 'xs' as const, height: 'xs' as const },
    sm: { fontSize: 'sm' as const, spacing: 'sm' as const, height: 'sm' as const },
    md: { fontSize: 'md' as const, spacing: 'md' as const, height: 'md' as const },
    lg: { fontSize: 'lg' as const, spacing: 'lg' as const, height: 'lg' as const },
    xl: { fontSize: 'xl' as const, spacing: 'xl' as const, height: 'xl' as const },
    '2xl': { fontSize: '2xl' as const, spacing: '2xl' as const, height: '2xl' as const },
    '3xl': { fontSize: '3xl' as const, spacing: '3xl' as const, height: '3xl' as const }
  },
  chip: {
    xs: { fontSize: 'xs' as const, spacing: 'xs' as const, height: 'xs' as const },
    sm: { fontSize: 'xs' as const, spacing: 'sm' as const, height: 'sm' as const },
    md: { fontSize: 'sm' as const, spacing: 'sm' as const, height: 'md' as const },
    lg: { fontSize: 'sm' as const, spacing: 'md' as const, height: 'lg' as const },
    xl: { fontSize: 'md' as const, spacing: 'md' as const, height: 'xl' as const },
    '2xl': { fontSize: 'lg' as const, spacing: 'lg' as const, height: '2xl' as const },
    '3xl': { fontSize: 'xl' as const, spacing: 'xl' as const, height: '3xl' as const }
  },
  badge: {
    xs: 8,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    '2xl': 26,
    '3xl': 30
  }
} as const;
