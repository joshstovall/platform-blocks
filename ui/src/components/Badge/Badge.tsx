import React from 'react';
import { View, Text as RNText, Pressable } from 'react-native';
import { useTheme } from '../../core/theme';
import { SizeValue, getFontSize, getSpacing, getHeight } from '../../core/theme/sizes';
import { createRadiusStyles } from '../../core/theme/radius';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { getSpacingStyles, extractSpacingProps, extractShadowProps, getShadowStyles } from '../../core/utils';
import type { BadgeProps } from './types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { DESIGN_TOKENS } from '../../core/unified-styles';


const getBadgeStyles = (
  theme: PlatformBlocksTheme,
  variant: BadgeProps['variant'] = 'filled',
  color: BadgeProps['color'] = 'primary',
  size: SizeValue = 'md',
  disabled: boolean = false,
  height: number,
  radiusStyles: any,
  shadowStyles: any
) => {
  // Use design tokens for consistent badge sizing
  const badgeHeight = Math.max(DESIGN_TOKENS.component.badge.height, height * 0.7);
  const horizontalPadding = Math.max(DESIGN_TOKENS.component.badge.padding, height * 0.3);

  const baseStyles = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: badgeHeight,
    minHeight: badgeHeight,
    paddingHorizontal: horizontalPadding,
    borderWidth: 1,
    opacity: disabled ? 0.5 : 1,
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
    }
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
    ...shadowStyles
  };
};

const getBadgeTextStyles = (
  theme: PlatformBlocksTheme,
  variant: BadgeProps['variant'] = 'filled',
  color: BadgeProps['color'] = 'primary',
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
    }
  };

  return {
    ...baseStyles,
    ...variantStyles[variant]
  };
};

export const Badge: React.FC<BadgeProps> = (props) => {
  const {
    children,
    size = 'md',
    variant,
    v, // variant alias
    color,
    c, // color alias
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

  // Use aliases if provided, otherwise fall back to full prop names or defaults
  const resolvedVariant = v || variant || 'subtle';
  const resolvedColor = c || color || 'primary';

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const { shadowProps } = extractShadowProps({ shadow });
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();

  // Handle radius prop with 'chip' as default
  const radiusStyles = createRadiusStyles(radius || 'badge');
  
  // Handle shadow prop - use default 'sm' for filled variant if no shadow specified
  const effectiveShadow = shadowProps.shadow ?? (resolvedVariant === 'filled' ? 'sm' : 'none');
  const shadowStyles = getShadowStyles({ shadow: effectiveShadow }, theme, 'badge');

  const height = getHeight(size);
  const badgeStyles = getBadgeStyles(theme, resolvedVariant, resolvedColor, size, disabled, height-10, radiusStyles, shadowStyles);
  const badgeTextStyles = getBadgeTextStyles(theme, resolvedVariant, resolvedColor, size);
  const iconSpacing = getSpacing(size) / 2;

  const Component = onPress ? Pressable : View;

  const removeButton = onRemove ? (
    <Button
      icon={<Icon name="x" size="sm" />}
      variant="none"
      onPress={onRemove}
      disabled={disabled}
      style={{ marginLeft: removePosition === 'right' ? DESIGN_TOKENS.spacing.xs : 0, marginRight: removePosition === 'left' ? DESIGN_TOKENS.spacing.xs : 0 }}
    />
  ) : null;

  return (
    <Component
      style={[badgeStyles, spacingStyles, style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      {...otherProps}
    >
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

      <RNText style={[badgeTextStyles, textStyle]}>
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

export default Badge;
