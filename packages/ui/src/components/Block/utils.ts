import { ViewStyle, DimensionValue } from 'react-native';
import { SizeValue, getSpacing } from '../../core/theme/sizes';
import { DESIGN_TOKENS } from '../../core/design-tokens';
import type { BlockStyleProps } from './types';

/**
 * Maps radius values to numeric pixels
 */
export function getRadius(radius: BlockStyleProps['radius']): number | undefined {
  if (radius === undefined) return undefined;
  if (typeof radius === 'number') return radius;
  
  const radiusMap = {
    xs: DESIGN_TOKENS.radius.xs,
    sm: DESIGN_TOKENS.radius.sm,
    md: DESIGN_TOKENS.radius.md,
    lg: DESIGN_TOKENS.radius.lg,
    xl: DESIGN_TOKENS.radius.xl,
    full: DESIGN_TOKENS.radius.full,
  };
  
  return radiusMap[radius];
}

/**
 * Maps shadow values to shadow styles
 */
export function getShadow(shadow: BlockStyleProps['shadow']) {
  if (shadow === undefined) return {};
  
  const shadowValue = typeof shadow === 'number' ? shadow : getShadowLevel(shadow);
  const opacity = 0.1 + (shadowValue * 0.05);
  
  return {
    boxShadow: `0 ${shadowValue}px ${shadowValue * 2}px rgba(0, 0, 0, ${opacity})`,
    elevation: shadowValue * 2, // Android elevation
  };
}

function getShadowLevel(shadow: string): number {
  const shadowMap = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  };
  return shadowMap[shadow as keyof typeof shadowMap] || 0;
}

/**
 * Maps width/height values to styles
 */
export function getDimension(value: BlockStyleProps['w']): DimensionValue | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  if (value === 'auto') return 'auto';
  if (value === 'full') return '100%';
  return value as DimensionValue;
}

/**
 * Maps gap values to numeric spacing
 */
export function getGap(gap: BlockStyleProps['gap']): number | undefined {
  if (gap === undefined) return undefined;
  if (typeof gap === 'number') return gap;
  return getSpacing(gap as SizeValue);
}

function resolveFlexWrap(wrap: BlockStyleProps['wrap']): ViewStyle['flexWrap'] | undefined {
  if (wrap === undefined) return undefined;
  if (typeof wrap === 'boolean') {
    return wrap ? 'wrap' : 'nowrap';
  }
  return wrap;
}

/**
 * Converts Block style props to React Native ViewStyle
 */
export function getBlockStyles(props: BlockStyleProps, isRTL: boolean = false): ViewStyle {
  const {
    bg,
    radius,
    borderWidth,
    borderColor,
    shadow,
    opacity,
    w,
    h,
    minW,
    minH,
    maxW,
    maxH,
    grow,
    shrink,
    basis,
    direction,
    align,
    justify,
    wrap,
    gap,
    position,
    top,
    right,
    bottom,
    left,
    start,
    end,
    zIndex,
    flex,
  } = props;

  // Handle RTL-aware positioning
  // Priority: start/end > left/right (start/end are logical properties)
  let resolvedLeft = left;
  let resolvedRight = right;
  
  if (start !== undefined || end !== undefined) {
    // start/end take precedence
    if (isRTL) {
      resolvedRight = start !== undefined ? start : resolvedRight;
      resolvedLeft = end !== undefined ? end : resolvedLeft;
    } else {
      resolvedLeft = start !== undefined ? start : resolvedLeft;
      resolvedRight = end !== undefined ? end : resolvedRight;
    }
  } else if (isRTL && (left !== undefined || right !== undefined)) {
    // Swap left and right in RTL if start/end not provided
    const temp = resolvedLeft;
    resolvedLeft = resolvedRight;
    resolvedRight = temp;
  }

  return {
    // Background & appearance
    backgroundColor: bg,
    borderRadius: getRadius(radius),
    borderWidth,
    borderColor,
    opacity,
    
    // Shadow
    ...getShadow(shadow),
    
    // Dimensions
    width: getDimension(w),
    height: getDimension(h),
    minWidth: getDimension(minW),
    minHeight: getDimension(minH),
    maxWidth: getDimension(maxW),
    maxHeight: getDimension(maxH),
    
    // Flex properties
    ...(flex !== false && {
      display: 'flex',
    }),
    flexGrow: typeof grow === 'boolean' ? (grow ? 1 : 0) : grow,
    flexShrink: typeof shrink === 'boolean' ? (shrink ? 1 : 0) : shrink,
    flexBasis: getDimension(basis),
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
  flexWrap: resolveFlexWrap(wrap),
    gap: getGap(gap),
    
    // Position (RTL-aware)
    position,
    top: getDimension(top),
    right: getDimension(resolvedRight),
    bottom: getDimension(bottom),
    left: getDimension(resolvedLeft),
    zIndex,
  };
}