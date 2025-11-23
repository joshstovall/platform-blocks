import { SizeValue, getSpacing } from '../theme/sizes';
import { SpacingValue } from '../theme/types';
import { UniversalSystemProps } from './universal';
import { Platform } from 'react-native';

/** Re-export SpacingValue from theme types */
export type { SpacingValue } from '../theme/types';

/** Base system props that include universal props */
export type BaseSystemProps = UniversalSystemProps;

/** Enhanced spacing prop types with CSS value support */
export type SpacingProps = BaseSystemProps & {
  /** All margins */
  m?: SpacingValue;
  /** Horizontal margins (left + right) */
  mx?: SpacingValue;
  /** Vertical margins (top + bottom) */
  my?: SpacingValue;
  /** Margin top */
  mt?: SpacingValue;
  /** Margin right */
  mr?: SpacingValue;
  /** Margin bottom */
  mb?: SpacingValue;
  /** Margin left */
  ml?: SpacingValue;

  /** All padding */
  p?: SpacingValue;
  /** Horizontal padding (left + right) */
  px?: SpacingValue;
  /** Vertical padding (top + bottom) */
  py?: SpacingValue;
  /** Padding top */
  pt?: SpacingValue;
  /** Padding right */
  pr?: SpacingValue;
  /** Padding bottom */
  pb?: SpacingValue;
  /** Padding left */
  pl?: SpacingValue;
};

/**
 * Enhanced function to resolve spacing values including CSS values
 * @param value - The spacing value to resolve
 * @returns The resolved spacing value as number or string
 */
function resolveSpacingValue(value: SpacingValue): number | string {
  if (value === 'auto') return 'auto';
  if (value === '0' || value === 0) return 0;
  if (typeof value === 'string') {
    return getSpacing(value as SizeValue);
  }
  return getSpacing(value);
}

/**
 * Enhanced utility function to generate spacing styles from props
 * Now supports RTL-aware spacing using logical properties on web and swapped values on native
 * 
 * @param props - The spacing props to convert to styles
 * @param isRTL - Whether the current direction is RTL (optional, defaults to false for backwards compatibility)
 * @returns A record of CSS style properties
 */
export function getSpacingStyles(
  props: SpacingProps,
  isRTL: boolean = false
): Record<string, number | string | undefined> {
  const styles: Record<string, number | string | undefined> = {};

  /** Handle margin props */
  if (props.m !== undefined) {
    const value = resolveSpacingValue(props.m);
    styles.marginTop = value;
    styles.marginRight = value;
    styles.marginBottom = value;
    styles.marginLeft = value;
  }

  if (props.mx !== undefined) {
    const value = resolveSpacingValue(props.mx);
    // Use logical properties on web, swapped values on native
    if (Platform.OS === 'web') {
      (styles as any).marginInlineStart = value;
      (styles as any).marginInlineEnd = value;
    } else {
      // On native, manually swap if RTL
      styles.marginLeft = value;
      styles.marginRight = value;
    }
  }

  if (props.my !== undefined) {
    const value = resolveSpacingValue(props.my);
    styles.marginTop = value;
    styles.marginBottom = value;
  }

  /** Individual margin props (override shorthand props) */
  if (props.mt !== undefined) styles.marginTop = resolveSpacingValue(props.mt);
  if (props.mb !== undefined) styles.marginBottom = resolveSpacingValue(props.mb);
  
  // Handle mr/ml with RTL awareness
  if (props.mr !== undefined) {
    const value = resolveSpacingValue(props.mr);
    if (Platform.OS === 'web') {
      (styles as any).marginInlineEnd = value;
    } else {
      // On native, swap if RTL
      if (isRTL) {
        styles.marginLeft = value;
      } else {
        styles.marginRight = value;
      }
    }
  }
  
  if (props.ml !== undefined) {
    const value = resolveSpacingValue(props.ml);
    if (Platform.OS === 'web') {
      (styles as any).marginInlineStart = value;
    } else {
      // On native, swap if RTL
      if (isRTL) {
        styles.marginRight = value;
      } else {
        styles.marginLeft = value;
      }
    }
  }

  /** Handle padding props */
  if (props.p !== undefined) {
    const value = resolveSpacingValue(props.p);
    styles.paddingTop = value;
    styles.paddingRight = value;
    styles.paddingBottom = value;
    styles.paddingLeft = value;
  }

  if (props.px !== undefined) {
    const value = resolveSpacingValue(props.px);
    // Use logical properties on web, swapped values on native
    if (Platform.OS === 'web') {
      (styles as any).paddingInlineStart = value;
      (styles as any).paddingInlineEnd = value;
    } else {
      // On native, manually swap if RTL
      styles.paddingLeft = value;
      styles.paddingRight = value;
    }
  }

  if (props.py !== undefined) {
    const value = resolveSpacingValue(props.py);
    styles.paddingTop = value;
    styles.paddingBottom = value;
  }

  /** Individual padding props (override shorthand props) */
  if (props.pt !== undefined) styles.paddingTop = resolveSpacingValue(props.pt);
  if (props.pb !== undefined) styles.paddingBottom = resolveSpacingValue(props.pb);
  
  // Handle pr/pl with RTL awareness
  if (props.pr !== undefined) {
    const value = resolveSpacingValue(props.pr);
    if (Platform.OS === 'web') {
      (styles as any).paddingInlineEnd = value;
    } else {
      // On native, swap if RTL
      if (isRTL) {
        styles.paddingLeft = value;
      } else {
        styles.paddingRight = value;
      }
    }
  }
  
  if (props.pl !== undefined) {
    const value = resolveSpacingValue(props.pl);
    if (Platform.OS === 'web') {
      (styles as any).paddingInlineStart = value;
    } else {
      // On native, swap if RTL
      if (isRTL) {
        styles.paddingRight = value;
      } else {
        styles.paddingLeft = value;
      }
    }
  }

  return styles;
}

/**
 * Helper to extract spacing props from component props
 * @param props - The component props to extract spacing props from
 * @returns An object containing separated spacing props and other props
 */
export function extractSpacingProps<T extends SpacingProps>(
  props: T
): { spacingProps: SpacingProps; otherProps: Omit<T, keyof SpacingProps> } {
  const {
    m, mx, my, mt, mr, mb, ml,
    p, px, py, pt, pr, pb, pl,
    lightHidden,
    darkHidden,
    hiddenFrom,
    visibleFrom,
    ...otherProps
  } = props;

  const spacingProps: SpacingProps = {
    m, mx, my, mt, mr, mb, ml,
    p, px, py, pt, pr, pb, pl,
    lightHidden,
    darkHidden,
    hiddenFrom,
    visibleFrom
  };

  return { spacingProps, otherProps };
}
