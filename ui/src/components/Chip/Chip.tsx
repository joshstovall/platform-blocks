import React from 'react';
import { View, Text as RNText, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../core/theme';
import { SizeValue, getFontSize, getSpacing, getHeight } from '../../core/theme/sizes';
import { createRadiusStyles } from '../../core/theme/radius';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { getSpacingStyles, extractSpacingProps, extractShadowProps, getShadowStyles } from '../../core/utils';
import type { ChipProps } from './types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { resolveLinearGradient } from '../../utils/optionalDependencies';

const { LinearGradient: OptionalLinearGradient, hasLinearGradient } = resolveLinearGradient();

const normalizeHex = (input: string): string | null => {
  if (!input) return null;
  let hex = input.trim();
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex.split('').map(ch => ch + ch).join('');
  }
  if (hex.length !== 6 || /[^0-9a-fA-F]/.test(hex)) {
    return null;
  }
  return `#${hex.toLowerCase()}`;
};

const adjustHexColor = (input: string, amount: number): string => {
  const normalized = normalizeHex(input);
  if (!normalized) return input;
  const hex = normalized.slice(1);
  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const r = clamp(parseInt(hex.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.slice(4, 6), 16) + amount);
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const buildGradientStops = (
  theme: PlatformBlocksTheme,
  color: ChipProps['color'],
  isCustomColor: boolean
): [string, string] => {
  if (isCustomColor && typeof color === 'string') {
    const normalized = normalizeHex(color);
    if (normalized) {
      return [normalized, adjustHexColor(normalized, -30)];
    }
    return [color, color];
  }

  const palette = color ? (theme.colors as any)[color as string] : undefined;
  if (palette && Array.isArray(palette)) {
    const start = palette[Math.min(5, palette.length - 1)] ?? palette[0];
    const end = palette[Math.min(7, palette.length - 1)] ?? palette[palette.length - 1] ?? start;
    return [start, end];
  }

  const primary = theme.colors.primary;
  const start = primary[5] ?? primary[4] ?? primary[0];
  const end = primary[7] ?? primary[6] ?? primary[5] ?? start;
  return [start, end];
};


const getChipStyles = (
  theme: PlatformBlocksTheme,
  variant: ChipProps['variant'] = 'filled',
  color: ChipProps['color'] = 'primary',
  size: SizeValue = 'md',
  disabled: boolean = false,
  height: number,
  radiusStyles: any,
  shadowStyles: any,
  gradientStops?: [string, string]
) => {
  const horizontalSpacing = getSpacing(size);

  const baseStyles = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height,
    paddingHorizontal: horizontalSpacing,
    borderWidth: 1,
    opacity: disabled ? 0.5 : 1,
    position: 'relative' as const,
    ...radiusStyles
  };

  // Check if color is a custom color string or theme color
  const isCustomColor = color && !['primary', 'secondary', 'success', 'warning', 'error', 'gray'].includes(color as string);
  
  if (isCustomColor) {
    const customColor = color as string;
    const variantStyles = {
      filled: {
        backgroundColor: customColor,
        borderColor: customColor
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: customColor
      },
      light: {
        backgroundColor: customColor + '20', // Add transparency
        borderColor: customColor + '40'
      },
      subtle: {
        backgroundColor: customColor + '10', // Even lighter transparency
        borderColor: 'transparent'
      },
      gradient: {
        backgroundColor: gradientStops?.[0] ?? customColor,
        borderColor: gradientStops?.[1] ?? customColor
      }
    };
    const styleForVariant = {
      ...baseStyles,
      ...variantStyles[variant],
      ...(variant === 'gradient' ? { overflow: 'hidden' as const } : {})
    };
    return variant === 'gradient'
      ? { ...styleForVariant, ...shadowStyles }
      : styleForVariant;
  }

  // Use theme colors
  const colorPalette = theme.colors[color as keyof typeof theme.colors];
  if (!colorPalette) {
    return {
      ...baseStyles,
      backgroundColor: theme.colors.primary[5],
      borderColor: theme.colors.primary[5]
    };
  }
  const variantStyles = {
    filled: {
      backgroundColor: colorPalette[5],
      borderColor: colorPalette[5]
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colorPalette[5]
    },
    light: {
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[1]
    },
    subtle: {
      backgroundColor: colorPalette[0] || (colorPalette[1] + '40'),
      borderColor: 'transparent'
    },
    gradient: {
      backgroundColor: gradientStops?.[0] ?? colorPalette[5],
      borderColor: gradientStops?.[1] ?? colorPalette[6] ?? colorPalette[5]
    }
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
    ...(variant === 'gradient' ? { overflow: 'hidden' as const } : {}),
    ...shadowStyles
  };
};

const getChipTextStyles = (
  theme: PlatformBlocksTheme,
  variant: ChipProps['variant'] = 'filled',
  color: ChipProps['color'] = 'primary',
  size: SizeValue = 'md'
) => {
  const fontSize = getFontSize(size);

  const baseStyles = {
    fontSize,
    fontWeight: '500' as const,
    textAlign: 'center' as const
  };

  // Check if color is a custom color string or theme color
  const isCustomColor = color && !['primary', 'secondary', 'success', 'warning', 'error', 'gray'].includes(color as string);
  
  if (isCustomColor) {
    const customColor = color as string;
    const variantStyles = {
      filled: {
        color: '#FFFFFF'
      },
      outline: {
        color: customColor
      },
      light: {
        color: customColor
      },
      subtle: {
        color: customColor
      },
      gradient: {
        color: '#FFFFFF'
      }
    };
    return {
      ...baseStyles,
      ...variantStyles[variant]
    };
  }

  // Use theme colors
  const colorPalette = theme.colors[color as keyof typeof theme.colors];
  if (!colorPalette) {
    return { ...baseStyles, color: '#FFFFFF' };
  }
  const variantStyles = {
    filled: {
      color: '#FFFFFF'
    },
    outline: {
      color: colorPalette[6]
    },
    light: {
      color: colorPalette[7]
    },
    subtle: {
      color: colorPalette[6] || colorPalette[7]
    },
    gradient: {
      color: '#FFFFFF'
    }
  };

  return {
    ...baseStyles,
    ...variantStyles[variant]
  };
};

export const Chip: React.FC<ChipProps> = (props) => {
  const {
    children,
    size = 'md',
    variant = 'filled',
    color = 'primary',
    onPress,
    startIcon,
    endIcon,
    onRemove,
    removePosition = 'right',
    disabled = false,
    style,
    textStyle,
    radius,
    shadow,
    ...rest
  } = props;

  const requestedVariant = variant;
  const resolvedColor = color;
  const isCustomColor = typeof resolvedColor === 'string' && !['primary', 'secondary', 'success', 'warning', 'error', 'gray'].includes(resolvedColor as string);
  const shouldUseGradient = requestedVariant === 'gradient' && hasLinearGradient;
  const effectiveVariant = shouldUseGradient ? 'gradient' : (requestedVariant === 'gradient' ? 'filled' : requestedVariant);

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const { shadowProps } = extractShadowProps({ shadow });
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();

  // Handle radius prop with 'chip' as default
  const radiusStyles = createRadiusStyles(radius || 'chip');
  
  // Handle shadow prop - use default 'sm' for filled/gradient variant if no shadow specified
  const effectiveShadow = shadowProps.shadow ?? ((effectiveVariant === 'filled' || effectiveVariant === 'gradient') ? 'sm' : 'none');
  const shadowStyles = getShadowStyles({ shadow: effectiveShadow }, theme, 'chip');

  const height = getHeight(size);
  const gradientStops = React.useMemo(() => (
    shouldUseGradient ? buildGradientStops(theme, resolvedColor, isCustomColor) : undefined
  ), [shouldUseGradient, theme, resolvedColor, isCustomColor]);

  const chipStyles = getChipStyles(theme, effectiveVariant, resolvedColor, size, disabled, height-10, radiusStyles, shadowStyles, gradientStops);
  const chipTextStyles = getChipTextStyles(theme, effectiveVariant, resolvedColor, size);
  const iconSpacing = getSpacing(size) / 2;

  const Component = onPress ? Pressable : View;

  const removeButton = onRemove ? (
    <Button
      icon={<Icon name="close" size="sm" />}
      variant="none"
      onPress={onRemove}
      disabled={disabled}
      style={{ marginLeft: removePosition === 'right' ? 2 : 0, marginRight: removePosition === 'left' ? 2 : 0 }}
    />
  ) : null;

  return (
    <Component
      style={[chipStyles, spacingStyles, style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      {...otherProps}
    >
      {shouldUseGradient && gradientStops && (
        <OptionalLinearGradient
          pointerEvents="none"
          colors={gradientStops}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFillObject, radiusStyles]}
        />
      )}
      {removePosition === 'left' && removeButton && (
        <View style={{ marginRight: iconSpacing }}>
          {removeButton}
        </View>
      )}

      {startIcon && (
        <View style={{ marginRight: iconSpacing }}>
          {startIcon}
        </View>
      )}

      <RNText style={[chipTextStyles, textStyle]}>
        {children}
      </RNText>

      {(endIcon || (onRemove && removePosition === 'right')) && (
        <View style={{ marginLeft: iconSpacing }}>
          {removePosition === 'right' && removeButton ? removeButton : endIcon}
        </View>
      )}
    </Component>
  );
};

export default Chip;
