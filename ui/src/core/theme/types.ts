
// Common type aliases
export type SizeValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type ColorValue = string;

// Enhanced spacing value that supports CSS values like 'auto'
export type SpacingValue = SizeValue | 'auto' | '0' | number;

// Import design tokens type
import type { DESIGN_TOKENS } from '../design-tokens';

// Spacing and layout props
export interface SpacingProps {
  /** Margin on all sides */
  m?: SpacingValue;
  /** Margin top */
  mt?: SpacingValue;
  /** Margin right */
  mr?: SpacingValue;
  /** Margin bottom */
  mb?: SpacingValue;
  /** Margin left */
  ml?: SpacingValue;
  /** Margin horizontal (left and right) */
  mx?: SpacingValue;
  /** Margin vertical (top and bottom) */
  my?: SpacingValue;

  /** Padding on all sides */
  p?: SpacingValue;
  /** Padding top */
  pt?: SpacingValue;
  /** Padding right */
  pr?: SpacingValue;
  /** Padding bottom */
  pb?: SpacingValue;
  /** Padding left */
  pl?: SpacingValue;
  /** Padding horizontal (left and right) */
  px?: SpacingValue;
  /** Padding vertical (top and bottom) */
  py?: SpacingValue;
}

export interface PlatformBlocksTheme {
  /** Primary color used for buttons, links, etc. */
  primaryColor: string;

  /** Color scheme */
  colorScheme: 'light' | 'dark';

  /** Design tokens for consistent styling */
  designTokens?: typeof DESIGN_TOKENS;

  /** Colors palette */
  colors: {
    primary: string[];
    secondary: string[];
    tertiary: string[];
    surface: string[];
    success: string[];
    warning: string[];
    error: string[];
    gray: string[];
    highlight: string[];
    pink?: string[];
    purple?: string[];
    violet?: string[];
    cyan?: string[];
    lime?: string[];
    sky?: string[];
    amber?: string[];
    indigo?: string[];
    teal?: string[];
  };

  /** Semantic text colors */
  text: {
    /** Primary text color (high contrast) */
    primary: string;
    /** Secondary text color (medium contrast) */
    secondary: string;
    /** Muted text color (low contrast) */
    muted: string;
    /** Disabled text color (very low contrast) */
    disabled: string;
    /** Link text color (typically primary color) */
    link: string;
    /** Text color intended for use on top of primary[5] backgrounds */
    onPrimary?: string;
  };

  /** Semantic background & surface colors */
  backgrounds: {
    /** Main app/page background */
    base: string;
    /** Subtle background sections (stripes, alternate rows) */
    subtle: string;
    /** Standard surface (cards, containers) */
    surface: string;
    /** Elevated surface (modals, popovers) */
    elevated: string;
    /** Border / hairline color for separators */
    border: string;
  };

  /** Semantic interactive state colors */
  states?: {
    focusRing?: string; // outline / ring color for focusable elements
    textSelection?: string; // text selection background color
    highlightText?: string; // color for highlighting matching text in autocomplete/search
    highlightBackground?: string; // background color for highlighted text
  };

  /** Font family */
  fontFamily: string;

  /** Font sizes - extended with new size system */
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };

  /** Spacing values - extended with new size system */
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };

  /** Border radius values - extended with new size system */
  radii: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };

  /** Shadows */
  shadows: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  /** Breakpoints for responsive design */
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  /** Motion tokens for animations */
  motion: {
    /** Easing functions */
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
      spring: string;
    };
    /** Duration tokens */
    duration: {
      instant: string;
      fast: string;
      normal: string;
      slow: string;
    };
  };

  /** Semantic color aliases */
  semantic: {
    /** Accent color (usually primary[6]) */
    accent: string;
    /** Default border color */
    borderDefault: string;
    /** Subtle border color */
    borderSubtle: string;
    /** Elevated surface color */
    surfaceElevated: string;
    /** Card surface color */
    surfaceCard: string;
    /** Focus outline color */
    focusRing: string;
  };

  /** Component default props and styles (override point) */
  components: Record<string, ComponentTokenOverride>;

  /** Any additional custom theme properties */
  other: Record<string, any>;
}

export type PlatformBlocksThemeOverride = Partial<PlatformBlocksTheme>;

// Generic token override shape for any component
export interface ComponentTokenOverride {
  defaults?: Record<string, any>;
  variants?: Record<string, any>;
  sizes?: Record<string, any>;
  // Additional arbitrary extension buckets
  [key: string]: any;
}
