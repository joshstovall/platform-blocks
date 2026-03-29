import { SizeValue } from './theme/types';

/**
 * Design tokens for consistent styling across the UI library
 * These tokens ensure visual consistency and make global changes easier
 */

/**
 * Animation tokens
 */
export const MOTION_TOKENS = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

/** 
 * Shadow tokens for depth and elevation
 */
export const SHADOW_TOKENS = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
} as const;

/**
 * Border radius tokens
 */
export const RADIUS_TOKENS = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const;

/**
 * Spacing tokens
 */
export const SPACING_TOKENS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

/**
 * Typography tokens
 */
export const TYPOGRAPHY_TOKENS = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 42,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

/** 
 * Interactive element tokens 
 */
export const INTERACTIVE_TOKENS = {
  // Consistent heights for interactive elements
  height: {
    xs: 28,
    sm: 32,
    md: 40,
    lg: 44,
    xl: 48,
    '2xl': 52,
    '3xl': 56,
  },
  // Consistent padding for interactive elements
  padding: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  // Hit targets for touch interfaces
  hitTarget: {
    minimum: 44, // iOS/Android minimum
    comfortable: 48,
    large: 56,
  },
  // Focus ring sizes
  focusRing: {
    width: 2,
    offset: 1,
  },
} as const;

/** 
 * Color opacity tokens 
 */
export const OPACITY_TOKENS = {
  disabled: 0.5,
  hover: 0.9,
  pressed: 0.8,
  overlay: 0.6,
  backdrop: 0.4,
  subtle: 0.1,
} as const;

/** 
 * Component-specific tokens
 */
export const COMPONENT_TOKENS = {
  clearButton: {
    size: 14, // Icon size
    padding: 4,
    margin: -4, // Negative margin to not affect layout
    borderRadius: 6,
    hitSlop: 6,
  },
  divider: {
    thickness: 1,
    opacity: 0.1,
  },
  badge: {
    minWidth: 20,
    height: 20,
    padding: 6,
  },
} as const;

/**
 * Get design token value
 */
export function getToken<T extends keyof typeof DESIGN_TOKENS>(
  category: T,
  token: keyof typeof DESIGN_TOKENS[T]
): any {
  return DESIGN_TOKENS[category][token];
}

/**
 * All design tokens grouped for easy access
 */
export const DESIGN_TOKENS = {
  motion: MOTION_TOKENS,
  shadow: SHADOW_TOKENS,
  radius: RADIUS_TOKENS,
  spacing: SPACING_TOKENS,
  typography: TYPOGRAPHY_TOKENS,
  interactive: INTERACTIVE_TOKENS,
  opacity: OPACITY_TOKENS,
  component: COMPONENT_TOKENS,
} as const;

/**
 * Create consistent transition styles
 */
export function createTransition(
  properties: string[] = ['all'],
  duration: keyof typeof MOTION_TOKENS.duration = 'normal',
  easing: keyof typeof MOTION_TOKENS.easing = 'easeOut'
) {
  return `${properties.join(', ')} ${MOTION_TOKENS.duration[duration]}ms ${MOTION_TOKENS.easing[easing]}`;
}

/**
 * Get responsive value based on size
 */
export function getResponsiveValue<T>(
  values: Partial<Record<SizeValue, T>>,
  size: SizeValue = 'md'
): T | undefined {
  return values[size] || values.md;
}