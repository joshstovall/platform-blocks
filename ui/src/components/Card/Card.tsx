import React from 'react';
import { View, Platform, Pressable } from 'react-native';

import { useTheme } from '../../core/theme';
import { BorderRadiusProps, createRadiusStyles } from '../../core/theme/radius';
import { ShadowProps } from '../../core/theme/shadow';
import { getSpacingStyles, extractSpacingProps, extractShadowProps, getShadowStyles, getLayoutStyles, extractLayoutProps } from '../../core/utils';
import type { CardProps, PlatformBlocksTheme } from './types';
import { DESIGN_TOKENS } from '../../core/unified-styles';

const getCardStyles = (
  theme: PlatformBlocksTheme,
  variant: CardProps['variant'] = 'filled',
  padding?: number,
  radiusStyles?: any,
  shadowStyles?: any
) => {
  // Use design tokens for consistent padding
  const defaultPadding = DESIGN_TOKENS.spacing.md;
  
  const baseStyles = {
    padding: padding ?? defaultPadding,
    backgroundColor: theme.backgrounds.surface,
    ...(radiusStyles || {}),
    // Always include shadow styles if provided by user
    ...(shadowStyles || {}),
    // Add subtle elevation for cards
    ...(variant !== 'outline' && {
      ...DESIGN_TOKENS.shadow.sm && { boxShadow: DESIGN_TOKENS.shadow.sm },
      elevation: 1,
    }),
  };

  const variantStyles = {
    outline: {
      borderWidth: 1,
      borderColor: theme.backgrounds.border,
      backgroundColor: 'transparent',
      boxShadow: 'none',
      elevation: 0,
    },
    filled: {
      backgroundColor: theme.backgrounds.surface,
    },
    elevated: {
      backgroundColor: theme.backgrounds.elevated,
      ...DESIGN_TOKENS.shadow.md && { boxShadow: DESIGN_TOKENS.shadow.md },
      elevation: 2,
    }
  };

  return {
    ...baseStyles,
    ...(variant ? variantStyles[variant] : {})
  };
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

  // Handle radius prop with 'md' as default for cards
  const radiusStyles = createRadiusStyles(radius || 'md');

  // Handle shadow prop - no default shadow, user must specify if they want one
  const shadowStyles = getShadowStyles(shadowProps, theme, 'card');

  const cardStyles = getCardStyles(theme, variant, padding, radiusStyles, shadowStyles);
  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);

  const combinedStyles = [cardStyles, spacingStyles, layoutStyles, style];

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
          pressed && { opacity: 0.7 },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View {...rest} style={combinedStyles}>
      {children}
    </View>
  );
};
