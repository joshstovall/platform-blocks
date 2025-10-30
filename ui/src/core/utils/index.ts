/**
 * Converts pixel values to rem units
 */
export function rem(value: number | string): string {
  if (typeof value === 'string') {
    return value;
  }
  return `${value / 16}rem`;
}

// Export spacing utilities
export { SpacingProps, BaseSystemProps, getSpacingStyles, extractSpacingProps } from './spacing';

// Export universal props system
export { 
  UniversalProps, 
  ResponsiveProps, 
  UniversalSystemProps, 
  getUniversalClasses, 
  extractUniversalProps, 
  shouldHideComponent,
  shouldHideForBreakpoint,
  useUniversalStyles
} from './universal';

// Export universal props utilities
export { withUniversalProps, useUniversalProps } from './withUniversalProps';

// Export layout utilities
export { LayoutProps, getLayoutStyles, extractLayoutProps } from './layout';

// Export shadow utilities
export { extractShadowProps, getShadowStyles } from './shadow';

// Export RTL utilities
export {
  flipDirection,
  flipHorizontal,
  getLogicalProperty,
  transformRTLStyle,
  flipAlignment,
  shouldMirrorIcon,
  getIconMirrorTransform,
  swapStartEnd,
  getWritingDirection,
  getDefaultTextAlign,
  mirrorPlacement,
  reverseArray,
  DEFAULT_MIRRORABLE_ICONS,
} from './rtl';

// Export performance utilities
export { debounce, throttle, measurePerformance, measureAsyncPerformance } from './debounce';
export { INPUT_PERFORMANCE_CONFIG, PERFORMANCE_THRESHOLDS, buildInputComponents } from './performance';

// Export positioning utilities (unified from positioning-enhanced)
export { 
  calculateOverlayPosition,
  calculateOverlayPositionEnhanced,
  getViewport, 
  measureElement, 
  pointInRect, 
  getScrollPosition,
  clearOverlayPositionCache
} from './positioning-enhanced';
export type { Rect, Viewport, PositionResult, PlacementType, PositioningOptions } from './positioning-enhanced';

/**
 * Converts values to px
 */
export function px(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  if (value.includes('rem')) {
    return parseFloat(value) * 16;
  }

  if (value.includes('px')) {
    return parseFloat(value);
  }

  return parseFloat(value);
}

/**
 * Gets a size value from theme or returns the value if it's a string
 */
export function getSize(
  size: string | number | undefined,
  prefix: string,
  theme?: any
): string | undefined {
  if (size === undefined) {
    return undefined;
  }

  if (typeof size === 'number') {
    return rem(size);
  }

  if (typeof size === 'string') {
    // Check if it's a theme size key
    if (theme?.spacing?.[size]) {
      return theme.spacing[size];
    }

    // Return as CSS custom property
    return `var(--platform-blocks-${prefix}-${size}, ${size})`;
  }

  return size;
}

/**
 * Gets font size value
 */
export function getFontSize(size: string | undefined): string | undefined {
  if (!size) {
    return undefined;
  }

  return `var(--platform-blocks-font-size-${size})`;
}

/**
 * Gets radius value
 */
export function getRadius(radius: string | number | undefined): string | undefined {
  if (radius === undefined) {
    return undefined;
  }

  if (typeof radius === 'number') {
    return rem(radius);
  }

  return `var(--platform-blocks-radius-${radius})`;
}

/**
 * Gets shadow value
 */
export function getShadow(shadow: string | undefined): string | undefined {
  if (!shadow) {
    return undefined;
  }

  return `var(--platform-blocks-shadow-${shadow})`;
}

/**
 * Gets color value from theme
 */
export function getColor(color: string | undefined, shade?: number | string): string | undefined {
  if (!color) {
    return undefined;
  }

  if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
    return color;
  }

  if (shade !== undefined) {
    return `var(--platform-blocks-color-${color}-${shade})`;
  }

  return `var(--platform-blocks-color-${color}-5)`; // Default to middle shade
}
