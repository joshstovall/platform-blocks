import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '../../core/theme/ThemeProvider';
import { getRadius } from '../../core/theme/sizes';
import type { OverlayProps } from './types';

const DEFAULT_OPACITY = 0.6;

const HEX_COLOR_REGEX = /^#?[0-9a-f]{3,8}$/i;

const clampOpacity = (value: number | undefined): number => {
  if (value == null || Number.isNaN(value)) {
    return DEFAULT_OPACITY;
  }
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
};

const normalizeHex = (hex: string): string => {
  if (!hex.startsWith('#')) {
    return `#${hex}`;
  }
  return hex;
};

const hexToRgba = (hex: string, opacity: number): string => {
  const normalized = normalizeHex(hex).replace('#', '');

  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  if (normalized.length === 4) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  if (normalized.length === 6 || normalized.length === 8) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return hex;
};

const applyOpacity = (color: string, opacity: number): string => {
  const lower = color.toLowerCase();
  if (lower === 'transparent') {
    return 'transparent';
  }

  if (lower === 'black') {
    return `rgba(0, 0, 0, ${opacity})`;
  }

  if (lower === 'white') {
    return `rgba(255, 255, 255, ${opacity})`;
  }

  if (HEX_COLOR_REGEX.test(color)) {
    return hexToRgba(color, opacity);
  }

  if (color.startsWith('rgba')) {
    const body = color.slice(color.indexOf('(') + 1, color.lastIndexOf(')'));
    const parts = body.split(',').map(part => part.trim());
    if (parts.length === 4) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
    }
    if (parts.length === 3) {
      return `rgba(${parts.join(', ')}, ${opacity})`;
    }
  }

  if (color.startsWith('rgb(')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }

  if (color.startsWith('hsl')) {
    const prefix = color.startsWith('hsla') ? 'hsla' : 'hsl';
    const body = color.slice(color.indexOf('(') + 1, color.lastIndexOf(')'));
    const parts = body.split(',').map(part => part.trim());
    if (parts.length === 3) {
      return `${prefix}(${parts.join(', ')}, ${opacity})`;
    }
    if (parts.length === 4) {
      return `${prefix}(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
    }
  }

  return color;
};

const resolveThemeColor = (theme: any, color?: string): string | undefined => {
  if (!color) return undefined;
  if (color === 'transparent') return 'transparent';
  if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl') || color.startsWith('var(')) {
    return color;
  }

  const [palette, shadeToken] = color.split('.');
  const paletteValue = theme?.colors?.[palette];

  if (paletteValue) {
    if (Array.isArray(paletteValue)) {
      const shadeIndex = shadeToken ? Number(shadeToken) : 5;
      if (!Number.isNaN(shadeIndex) && paletteValue[shadeIndex] != null) {
        return paletteValue[shadeIndex];
      }
      return paletteValue[5] ?? paletteValue[0];
    }
    if (typeof paletteValue === 'string') {
      return paletteValue;
    }
  }

  const backgroundColor = theme?.backgrounds?.[color];
  if (backgroundColor) {
    return backgroundColor;
  }

  const textColor = theme?.text?.[color];
  if (textColor) {
    return textColor;
  }

  return color;
};

export const Overlay = React.forwardRef<View, OverlayProps>((props, ref) => {
  const theme = useTheme();
  const {
    color,
    opacity,
    backgroundOpacity,
    gradient,
    blur,
    radius,
    zIndex,
    fixed = false,
    center = false,
    style,
    children,
    ...rest
  } = props;

  const clampedOpacity = clampOpacity(backgroundOpacity ?? opacity ?? DEFAULT_OPACITY);
  const resolvedColor = resolveThemeColor(theme, color);
  const baseColor = resolvedColor ?? '#000000';
  const backgroundColor = gradient && Platform.OS === 'web'
    ? undefined
    : applyOpacity(baseColor, clampedOpacity);

  const resolvedRadius = typeof radius === 'number'
    ? radius
    : radius != null
    ? getRadius(radius)
    : undefined;

  const radiusStyle = resolvedRadius != null
    ? {
        borderRadius: resolvedRadius,
        overflow: resolvedRadius > 0 ? 'hidden' : undefined,
      } as ViewStyle
    : null;

  const getBlurValue = (value: number | string): string => {
    if (typeof value === 'number') {
      return `blur(${value}px)`;
    }
    return value.includes('(') ? value : `blur(${value})`;
  };

  const blurStyle = Platform.OS === 'web' && blur != null
    ? {
        backdropFilter: getBlurValue(blur),
        WebkitBackdropFilter: getBlurValue(blur),
      } as ViewStyle
    : null;

  const gradientStyle = Platform.OS === 'web' && gradient
    ? {
        backgroundImage: gradient,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      } as ViewStyle
    : null;

  const webFixedStyle = Platform.OS === 'web' && fixed
    ? ({ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 } as unknown as ViewStyle)
    : null;

  return (
    <View
      ref={ref}
      style={[
        StyleSheet.absoluteFillObject,
        webFixedStyle,
        center ? styles.center : null,
        zIndex != null ? { zIndex } : null,
        backgroundColor ? { backgroundColor } : null,
        gradientStyle,
        blurStyle,
        radiusStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
});

Overlay.displayName = 'Overlay';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
