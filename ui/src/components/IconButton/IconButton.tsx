import React, { useMemo, useRef, useState } from 'react';
import { Pressable, View, Animated, Easing, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { SizeValue, getFontSize, getSpacing, getHeight } from '../../core/theme/sizes';
import { createRadiusStyles } from '../../core/theme/radius';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { getSpacingStyles, extractSpacingProps, extractShadowProps, getShadowStyles, getLayoutStyles, extractLayoutProps } from '../../core/utils';
import { Loader } from '../Loader';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { IconButtonProps } from './types';
import { LinearGradient } from 'expo-linear-gradient';
import { useHaptics } from '../../hooks/useHaptics';

const getIconButtonStyles = (
  theme: PlatformBlocksTheme,
  variant: IconButtonProps['variant'] = 'filled',
  size: SizeValue = 'md',
  disabled: boolean = false,
  loading: boolean = false,
  height: number,
  radiusStyles: any,
  shadowStyles: any,
  customColor?: string
): any => {
  const baseStyles = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height,
    width: height, // Make it square by default
    minHeight: height,
    minWidth: height,
    borderWidth: 1,
    opacity: disabled ? 0.5 : loading ? 0.8 : 1,
    ...radiusStyles,
    ...shadowStyles
  };

  // If custom color is provided, use it for filled/secondary variants
  if (customColor) {
    const resolvedColor = resolveColor(customColor, theme);
    
    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: resolvedColor,
          borderColor: resolvedColor,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: `${resolvedColor}20`, // 20% opacity
          borderColor: `${resolvedColor}40`, // 40% opacity
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderColor: resolvedColor,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
    }
  }

  // Default theme-based styles
  switch (variant) {
    case 'filled':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.primary[5],
        borderColor: theme.colors.primary[5],
      };
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.gray[1],
        borderColor: theme.colors.gray[3],
      };
    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary[5],
      };
    case 'ghost':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      };
    case 'gradient':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      };
    case 'none':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
      };
    default:
      return {
        ...baseStyles,
        backgroundColor: theme.colors.primary[5],
        borderColor: theme.colors.primary[5],
      };
  }
};

const getIconColor = (
  theme: PlatformBlocksTheme,
  variant: IconButtonProps['variant'] = 'filled',
  customColor?: string,
  iconColor?: string
): string => {
  // If explicit icon color is provided, use it
  if (iconColor) {
    return resolveColor(iconColor, theme);
  }

  // If custom color is provided, derive icon color
  if (customColor) {
    const resolvedColor = resolveColor(customColor, theme);
    switch (variant) {
      case 'filled':
        return theme.colors.surface[0]; // White/light text on colored background
      case 'secondary':
      case 'outline':
      case 'ghost':
        return resolvedColor; // Use the custom color for icon
      case 'gradient':
        return theme.colors.surface[0];
      default:
        return resolvedColor;
    }
  }

  // Default theme-based icon colors
  switch (variant) {
    case 'filled':
      return theme.colors.surface[0]; // White/light on primary background
    case 'secondary':
      return theme.colors.gray[7];
    case 'outline':
      return theme.colors.primary[6];
    case 'ghost':
      return theme.colors.gray[6];
    case 'gradient':
      return theme.colors.surface[0];
    case 'none':
      return theme.colors.gray[6];
    default:
      return theme.colors.surface[0];
  }
};

const resolveColor = (color: string, theme: PlatformBlocksTheme): string => {
  // If it's already a valid CSS color (hex, rgb, etc.), return as-is
  if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
    return color;
  }
  
  // Handle theme token syntax like 'primary' or 'primary.6'
  const [palette, shade] = color.split('.');
  const shadeIndex = shade ? parseInt(shade, 10) : 5; // Default to middle shade
  
  if (theme.colors[palette as keyof typeof theme.colors]) {
    const paletteColors = theme.colors[palette as keyof typeof theme.colors] as any;
    return paletteColors[shadeIndex] || paletteColors[5] || color;
  }
  
  return color;
};

const getDefaultIconSize = (buttonSize: SizeValue): SizeValue => {
  const sizeMap: Record<SizeValue, SizeValue> = {
    'xs': 'xs',
    'sm': 'sm',
    'md': 'md',
    'lg': 'lg',
    'xl': 'xl',
    '2xl': 'xl',
    '3xl': 'xl'
  };
  return sizeMap[buttonSize] || 'md';
};

export const IconButton: React.FC<IconButtonProps> = (allProps) => {
  const { spacingProps, otherProps: withoutSpacing } = extractSpacingProps(allProps);
  const { shadowProps, otherProps: withoutShadow } = extractShadowProps(withoutSpacing);
  const { layoutProps, otherProps } = extractLayoutProps(withoutShadow);

  const {
    icon,
    onPress,
    onLayout,
    variant = 'filled',
    size = 'md',
    disabled = false,
    loading = false,
    colorVariant,
    iconColor,
    iconVariant,
    iconSize,
    tooltip,
    tooltipPosition = 'top',
    accessibilityLabel,
    style,
    testID,
    radius = 'md', // Default to medium radius (square-ish), 'xl' will be circular
    ...restProps
  } = otherProps;

  const theme = useTheme();
  const { impactPressIn, impactPressOut } = useHaptics();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  // Calculate button height based on size
  const height = getHeight(size);

  // Create radius styles - xl radius makes it circular
  const radiusStyles = createRadiusStyles(radius, height, 'button');
  
  // Create shadow styles
  const shadowStyles = getShadowStyles(shadowProps, theme);

  // Get button styles
  const buttonStyles = useMemo(() => 
    getIconButtonStyles(theme, variant, size, disabled, loading, height, radiusStyles, shadowStyles, colorVariant),
    [theme, variant, size, disabled, loading, height, radiusStyles, shadowStyles, colorVariant]
  );

  // Get icon color
  const resolvedIconColor = useMemo(() => 
    getIconColor(theme, variant, colorVariant, iconColor),
    [theme, variant, colorVariant, iconColor]
  );

  // Get icon size
  const resolvedIconSize = iconSize || getDefaultIconSize(size);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
      impactPressIn();
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
    impactPressOut();
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Loader 
          size={resolvedIconSize} 
          color={resolvedIconColor}
        />
      );
    }

    return (
      <Icon
        name={icon}
        size={resolvedIconSize}
        color={resolvedIconColor}
        variant={iconVariant}
      />
    );
  };

  const buttonElement = (
    <Animated.View
      style={[
        getSpacingStyles(spacingProps),
        getLayoutStyles(layoutProps),
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      {variant === 'gradient' ? (
        <LinearGradient
          colors={[theme.colors.primary[4], theme.colors.primary[6]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[buttonStyles, { borderWidth: 0 }]}
        >
          <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onLayout={onLayout}
            disabled={disabled || loading}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{
              disabled: disabled || loading,
              busy: loading,
            }}
            testID={testID}
            {...restProps}
          >
            {renderContent()}
          </Pressable>
        </LinearGradient>
      ) : (
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onLayout={onLayout}
          disabled={disabled || loading}
          style={[
            buttonStyles,
            isPressed && !disabled && !loading && {
              backgroundColor: variant === 'filled' 
                ? theme.colors.primary[6] 
                : variant === 'secondary'
                ? theme.colors.gray[2]
                : buttonStyles.backgroundColor,
            },
          ]}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          accessibilityState={{
            disabled: disabled || loading,
            busy: loading,
          }}
          testID={testID}
          {...restProps}
        >
          {renderContent()}
        </Pressable>
      )}
    </Animated.View>
  );

  // Wrap with tooltip if provided
  if (tooltip) {
    return (
      <Tooltip label={tooltip} position={tooltipPosition}>
        {buttonElement}
      </Tooltip>
    );
  }

  return buttonElement;
};

IconButton.displayName = 'IconButton';