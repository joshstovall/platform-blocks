import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../core/theme';
import { COMPONENT_SIZES } from '../../core/theme/sizes';
import type { IndicatorProps } from './types';

/**
 * Indicator: a small indicator positioned on the corner of a parent container.
 * Usage: Wrap target with a relative container and place <Indicator /> as a sibling.
 */
export function Indicator({
  size = 'sm',
  color,
  borderColor,
  borderWidth = 1,
  placement = 'bottom-right',
  offset = 0,
  style,
  children,
  invisible,
}: IndicatorProps) {
  const theme = useTheme();
  if (invisible) return null;

  const finalColor = color || theme.colors.success[5];
  const ringColor = borderColor || theme.colors.surface[0];
  
  // Resolve size to a number
  const resolvedSize = typeof size === 'number' 
    ? size 
    : COMPONENT_SIZES.badge[size];

  const base: ViewStyle = {
    position: 'absolute',
    width: resolvedSize,
    height: resolvedSize,
    borderRadius: resolvedSize / 2,
    backgroundColor: finalColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth,
    borderColor: ringColor,
    boxShadow: theme.shadows.xs,
  };

  // Corner placement
  switch (placement) {
    case 'top-left':
      base.top = offset * -1;
      base.left = offset * -1;
      break;
    case 'top-right':
      base.top = offset * -1;
      base.right = offset * -1;
      break;
    case 'bottom-left':
      base.bottom = offset * -1;
      base.left = offset * -1;
      break;
    case 'bottom-right':
    default:
      base.bottom = offset * -1;
      base.right = offset * -1;
      break;
  }

  return <View style={[base, style]}>{children}</View>;
}
