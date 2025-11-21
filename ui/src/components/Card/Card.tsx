import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../core/theme';
import { createRadiusStyles } from '../../core/theme/radius';
import type { ShadowValue } from '../../core/theme/shadow';
import { getSpacingStyles, extractSpacingProps, extractShadowProps, getShadowStyles, getLayoutStyles, extractLayoutProps } from '../../core/utils';
import type { CardProps, PlatformBlocksTheme } from './types';
import { DESIGN_TOKENS } from '../../core/unified-styles';
import { resolveLinearGradient } from '../../utils/optionalDependencies';

const { LinearGradient: OptionalLinearGradient } = resolveLinearGradient();

type CardVariant = NonNullable<CardProps['variant']>;

interface CardVariantConfig {
  style: Record<string, any>;
  defaultShadow: ShadowValue;
  pressedStyle: Record<string, any>;
  gradient?: {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
}

const DEFAULT_PADDING = DESIGN_TOKENS.spacing.md;

const resolveGradientColors = (theme: PlatformBlocksTheme): string[] => {
  const palette = theme.colors?.primary ?? [];
  const fallback = theme.primaryColor;
  const start = palette[4] ?? palette[5] ?? fallback;
  const end = palette[6] ?? palette[7] ?? fallback;
  return [start, end];
};

const getVariantConfig = (theme: PlatformBlocksTheme, variant: CardVariant): CardVariantConfig => {
  const subtleBorder = theme.semantic?.borderSubtle ?? theme.backgrounds.border;

  switch (variant) {
    case 'outline':
      return {
        style: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.backgrounds.border,
        },
        defaultShadow: 'none',
        pressedStyle: { opacity: 0.9 },
      };
    case 'elevated':
      return {
        style: {
          backgroundColor: theme.backgrounds.elevated ?? theme.backgrounds.surface,
        },
        defaultShadow: 'lg',
        pressedStyle: { opacity: 0.94 },
      };
    case 'subtle':
      return {
        style: {
          backgroundColor: theme.backgrounds.subtle,
          borderWidth: 1,
          borderColor: subtleBorder,
        },
        defaultShadow: 'xs',
        pressedStyle: { opacity: 0.92 },
      };
    case 'ghost':
      return {
        style: {
          backgroundColor: 'transparent',
        },
        defaultShadow: 'none',
        pressedStyle: {
          backgroundColor: theme.backgrounds.subtle,
          opacity: 1,
        },
      };
    case 'gradient': {
      const colors = resolveGradientColors(theme);
      return {
        style: {
          backgroundColor: colors[0],
          overflow: 'hidden',
        },
        defaultShadow: 'md',
        pressedStyle: { opacity: 0.9 },
        gradient: {
          colors,
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
      };
    }
    case 'filled':
    default:
      return {
        style: {
          backgroundColor: theme.backgrounds.surface,
        },
        defaultShadow: 'sm',
        pressedStyle: { opacity: 0.95 },
      };
  }
};

export const Card: React.FC<CardProps> = (allProps) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(allProps);
  const { shadowProps, otherProps: propsAfterShadow } = extractShadowProps(propsAfterSpacing);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterShadow);
  const {
    children,
    variant,
    padding,
    radius,
    style,
    onPress,
    disabled,
    ...rest
  } = otherProps;

  const theme = useTheme();
  const resolvedVariant: CardVariant = variant ?? 'filled';

  const variantConfig = React.useMemo(
    () => getVariantConfig(theme, resolvedVariant),
    [theme, resolvedVariant]
  );

  // Handle radius prop with 'md' as default for cards
  const radiusStyles = createRadiusStyles(radius || 'md');

  const baseStyles = {
    padding: padding ?? DEFAULT_PADDING,
    position: 'relative' as const,
    ...(radiusStyles || {}),
  };

  const defaultShadow = shadowProps.shadow ?? variantConfig.defaultShadow;
  const shadowStyles = getShadowStyles({ shadow: defaultShadow }, theme, 'card');

  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);

  const combinedStyles = [baseStyles, variantConfig.style, shadowStyles, spacingStyles, layoutStyles, style];

  const gradientOverlay = variantConfig.gradient && OptionalLinearGradient
    ? (
        <OptionalLinearGradient
          pointerEvents="none"
          colors={variantConfig.gradient.colors}
          start={variantConfig.gradient.start}
          end={variantConfig.gradient.end}
          style={[StyleSheet.absoluteFillObject, radiusStyles, {zIndex:-1}]}
        />
      )
    : null;

  // If onPress is provided, wrap in Pressable
  if (onPress) {
    return (
      <Pressable 
        {...rest} 
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={({ pressed }) => [
          ...combinedStyles,
          disabled && { opacity: 0.5 },
          pressed && !disabled ? variantConfig.pressedStyle : null,
        ]}
      >
        {gradientOverlay}
        {children}
      </Pressable>
    );
  }

  return (
    <View {...rest} style={combinedStyles}>
      {gradientOverlay}
      {children}
    </View>
  );
};
