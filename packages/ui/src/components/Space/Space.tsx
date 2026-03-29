import React from 'react';
import { View, ViewStyle } from 'react-native';
import { getSpacing, type SizeValue } from '../../core/theme/sizes';
import type { SpaceProps } from './types';

function resolveDimension(value?: SizeValue): number | undefined {
  if (value == null) return undefined;
  if (typeof value === 'number') return value;
  return getSpacing(value);
}

export const Space = React.forwardRef<View, SpaceProps>((props, ref) => {
  const {
    h,
    w,
    size = 'md',
    style,
    testID,
    accessibilityLabel,
    accessibilityRole,
    accessible,
    ...rest
  } = props;

  const resolvedHeight = resolveDimension(h);
  const resolvedWidth = resolveDimension(w);
  const fallbackSize = resolveDimension(size) ?? 0;

  const spacerStyle: ViewStyle = {
    height: resolvedHeight ?? (resolvedWidth == null ? fallbackSize : undefined),
    width: resolvedWidth,
    flexShrink: 0,
  };

  return (
    <View
      ref={ref}
      testID={testID}
      style={[spacerStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
      {...rest}
    />
  );
});

Space.displayName = 'Space';
