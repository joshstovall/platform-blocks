import React, { useMemo, useRef, useState } from 'react';
import { Pressable, View, Animated, Easing, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { SizeValue, getFontSize, getSpacing, getHeight } from '../../core/theme/sizes';
import { createRadiusStyles } from '../../core/theme/radius';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { getSpacingStyles, extractSpacingProps, extractShadowProps, getShadowStyles, getLayoutStyles, extractLayoutProps } from '../../core/utils';
import { Loader } from '../Loader';
import { Text } from '../Text';
import { Tooltip } from '../Tooltip';
import { ButtonProps } from './types';
import { useHaptics } from '../../hooks/useHaptics';
import { DESIGN_TOKENS, getUnifiedComponentSize } from '../../core/unified-styles';
import { useFocus, useReducedMotion, useAnnouncer } from '../../core/accessibility/hooks';
import { createAccessibilityProps } from '../../core/accessibility/utils';
import { resolveLinearGradient } from '../../utils/optionalDependencies';

const { LinearGradient: OptionalLinearGradient, hasLinearGradient } = resolveLinearGradient();

const getButtonStyles = (
  theme: PlatformBlocksTheme,
  variant: ButtonProps['variant'] = 'filled',
  size: SizeValue = 'md',
  disabled: boolean = false,
  loading: boolean = false,
  height: number,
  radiusStyles: any,
  shadowStyles: any,
  customColor?: string,
  isIconButton: boolean = false,
  fullWidth: boolean = false
): any => {
  const sizeConfig = getUnifiedComponentSize(size as any);
  const horizontalSpacing = isIconButton ? 0 : sizeConfig.padding;

  const baseStyles = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: sizeConfig.height,
    minHeight: sizeConfig.height,
    minWidth: isIconButton ? sizeConfig.height : sizeConfig.height,
    // For icon buttons, make width equal to height (square), otherwise use horizontal padding
    ...(isIconButton ? { width: sizeConfig.height } : { paddingHorizontal: horizontalSpacing }),
    // Add full width support
    ...(fullWidth && !isIconButton ? { width: '100%' as const } : {}),
    paddingVertical: Math.round(sizeConfig.padding * 0.25), // Consistent vertical padding
    borderWidth: 1,
    opacity: disabled ? DESIGN_TOKENS.opacity.disabled : loading ? DESIGN_TOKENS.opacity.pressed : 1,
    ...radiusStyles,
    // Add consistent transitions
    ...(typeof window !== 'undefined' && {
      transition: `all ${DESIGN_TOKENS.motion.duration.fast}ms ${DESIGN_TOKENS.motion.easing.easeOut}`,
    }),
  };

  // If custom color is provided, use it for filled/secondary variants
  if (customColor) {
    const variantStyles = {
      primary: {
        backgroundColor: customColor,
        borderColor: customColor
      },
      filled: {
        backgroundColor: customColor,
        borderColor: customColor
      },
      secondary: {
        backgroundColor: theme.colors.gray[1],
        borderColor: customColor
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: customColor
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent'
      },
      gradient: {
        backgroundColor: customColor,
        borderColor: customColor
      },
      link: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      none: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        height: 'auto' as const,
        paddingHorizontal: 0,
        paddingVertical: 0
      }
    };
    return {
      ...baseStyles,
      ...(variant === 'none' ? { ...baseStyles, ...variantStyles[variant] } : variantStyles[variant])
    };
  }

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary[5],
      borderColor: theme.colors.primary[5]
    },
    filled: {
      backgroundColor: theme.colors.primary[5],
      borderColor: theme.colors.primary[5]
    },
    secondary: {
      backgroundColor: theme.colors.gray[1],
      borderColor: theme.colors.gray[3]
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.primary[5]
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent'
    },
    gradient: {
      backgroundColor: theme.colors.primary[5], // Fallback solid color for now
      borderColor: theme.colors.primary[5]
    },
    link: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      weight: 'normal' as const,
      textDecorationLine: 'underline' as const,
      paddingHorizontal: 0,
      paddingVertical: 0,
      color: theme.colors.primary[5],
    },
    none: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      height: 'auto' as const,
      paddingHorizontal: 0,
      paddingVertical: 0
    }
  };

  return {
    ...baseStyles,
    ...(variant === 'none' ? { ...baseStyles, ...variantStyles[variant] } : variantStyles[variant]),
    ...shadowStyles,
  };
};

export const Button: React.FC<ButtonProps> = (allProps) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(allProps);
  const { shadowProps, otherProps: propsAfterShadow } = extractShadowProps(propsAfterSpacing);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterShadow);
  const {
    title,
    children,
    onPress,
    onPressIn,
    onPressOut,
    onHoverIn,
    onHoverOut,
    onLongPress,
    onLayout,
    variant = 'filled',
    size = 'md',
    disabled = false,
    loading = false,
    loadingTitle,
    colorVariant,
    textColor: textColorProp,
    icon,
    startIcon,
    endIcon,
    tooltip,
    tooltipPosition = 'top',
    radius,
    style,
    testID,
    accessibilityLabel: accessibilityLabelProp,
    accessibilityHint: accessibilityHintProp,
  } = otherProps;
  // Theme
  const theme = useTheme();
  const effectiveVariant = variant === 'gradient' && !hasLinearGradient ? 'filled' : variant;

  // Accessibility hooks
  const { getDuration } = useReducedMotion();
  const { announce } = useAnnouncer();
  const { ref: focusRef, focus, isFocused } = useFocus(`button-${title || 'button'}`);

  // Determine button content - children takes precedence over title
  const buttonContent = children ?? title;

  // Calculate minimum width for loading state based on content and size
  const calculateMinWidth = () => {
    if (!buttonContent || typeof buttonContent !== 'string') return undefined;

    // Base character width estimates based on size
    const charWidthBySize = {
      xs: 6,
      sm: 7,
      md: 8,
      lg: 9,
      xl: 10,
      '2xl': 11,
      '3xl': 12
    };

    const sizeKey = typeof size === 'string' ? size : 'md';
    const charWidth = charWidthBySize[sizeKey as keyof typeof charWidthBySize] || 8;
    const horizontalPadding = getSpacing(size) * 2; // Left + right padding

    // Estimate content width: character count * average char width + padding
    const contentWidth = buttonContent.length * charWidth + horizontalPadding;

    // Add space for loader and gap when loading
    const loaderWidth = getFontSize(size) + getSpacing(size) / 2; // Loader + margin

    return Math.max(contentWidth, contentWidth + loaderWidth);
  };

  // Determine what content to show based on loading state
  const displayContent = loading
    ? (loadingTitle !== undefined ? loadingTitle : '')
    : buttonContent;

  // Helper to ensure any primitive or array of primitives ends up wrapped in Text
  const renderButtonContent = (content: any) => {
    if (content == null) return content;
    // Direct React element, return as-is
    if (React.isValidElement(content)) return content;
    // Array of primitives (strings/numbers)
    if (Array.isArray(content)) {
      const allPrimitive = content.every(c => ['string', 'number'].includes(typeof c));
      if (allPrimitive) {
        return <Text {...textProps}>{content.join('')}</Text>;
      }
      // Mixed array - wrap each primitive with span Text
      return (
        <Text {...textProps}>
          {content.map((c, i) => typeof c === 'string' || typeof c === 'number' ? String(c) : c)}
        </Text>
      );
    }
    if (typeof content === 'string' || typeof content === 'number') {
      return <Text {...textProps}>{content}</Text>;
    }
    return content;
  };

  // Check if this is an icon button (has icon prop but no title/children)
  const isIconButton = !!icon && !buttonContent;

  // Validate that either children/title or icon is provided
  // if (!buttonContent && !icon) {
  //   console.warn('Button: Either title prop, children, or icon must be provided');
  // }

  const height = getHeight(size);
  const radiusStyles = createRadiusStyles(radius, height, 'button');

  // Handle shadow prop - use default 'sm' for primary/filled/secondary/gradient variants if no shadow specified
  const effectiveShadow = shadowProps.shadow ?? ((effectiveVariant === 'filled' || effectiveVariant === 'secondary' || effectiveVariant === 'gradient') ? 'sm' : 'none');
  const shadowStyles = getShadowStyles({ shadow: effectiveShadow }, theme, 'button');

  const spacingStyles = getSpacingStyles(spacingProps);
  const baseLayoutStyles = getLayoutStyles(layoutProps);

  // Apply minimum width when loading to prevent size changes
  const calculatedMinWidth = calculateMinWidth();
  const layoutStyles = {
    ...baseLayoutStyles,
    ...(loading && calculatedMinWidth && !layoutProps.width && !layoutProps.w && !layoutProps.fullWidth
      ? { minWidth: calculatedMinWidth }
      : {})
  };

  const iconSpacing = getSpacing(size) / 2;

  const resolveTokenColor = (token?: string): string | undefined => {
    if (!token) return undefined;
    // palette.shade format
    const m = token.match(/^([a-zA-Z0-9_-]+)\.([0-9]{1,2})$/);
    if (m) {
      const [, palette, shadeStr] = m;
      const shade = parseInt(shadeStr, 10);
      const pal = (theme.colors as any)[palette];
      if (pal && Array.isArray(pal) && pal[shade] != null) return pal[shade];
    }
    // palette only
    const pal = (theme.colors as any)[token];
    if (pal) {
      if (Array.isArray(pal)) return pal[5] || pal[0];
      return pal;
    }
    return token; // raw css color
  };

  const resolvedCustomColor = resolveTokenColor(colorVariant);
  const buttonStyles = getButtonStyles(theme, effectiveVariant, size, disabled, loading, height, radiusStyles, shadowStyles, resolvedCustomColor, isIconButton, layoutProps.fullWidth || false);

  // derive contrasted text color if filled/filled background
  const pickContrast = (bg?: string): string => {
    if (!bg) return theme.text.primary;
    if (/^#?[0-9a-fA-F]{6}$/.test(bg)) {
      const hex = bg.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16); const g = parseInt(hex.slice(2, 4), 16); const b = parseInt(hex.slice(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 160 ? '#222' : '#FFF';
    }
    return '#FFF';
  };

  const textColor = useMemo(() => {
    if (textColorProp) return resolveTokenColor(textColorProp) || textColorProp;
    if (resolvedCustomColor) {
      if (effectiveVariant === 'filled' || effectiveVariant === 'gradient') return pickContrast(resolvedCustomColor);
      if (effectiveVariant === 'outline' || effectiveVariant === 'ghost' || effectiveVariant === 'none' || effectiveVariant === 'secondary') return resolvedCustomColor;
    }
    switch (effectiveVariant) {
      case 'filled': return '#FFFFFF';
      case 'gradient': return '#FFFFFF';
      case 'secondary': return theme.colors.gray[7];
      case 'outline': return theme.colors.primary[5];
      case 'ghost': return theme.colors.gray[7];
      case 'link': return theme.colors.primary[5];
      case 'none': return 'currentColor';
      default: return '#FFFFFF';
    }
  }, [textColorProp, resolvedCustomColor, effectiveVariant, theme.colors.gray, theme.colors.primary]);

  // Memoize text props
  const textProps = useMemo(() => ({
    size,
    weight: '600' as const,
    align: 'center' as const,
    color: textColor,
    selectable: false,
    style: {
      lineHeight: getFontSize(size) * 1.3, // Better line height for Android
      textAlignVertical: 'center' as const // Ensure vertical centering on Android
    }
  }), [size, textColor]);

  // Memoize loader color calculation
  const loaderColor = useMemo(() => {
    if (resolvedCustomColor) {
      if (effectiveVariant === 'filled') return pickContrast(resolvedCustomColor);
      return resolvedCustomColor;
    }
    switch (effectiveVariant) {
      case 'filled': return '#FFFFFF';
      case 'secondary': return theme.colors.gray[7];
      case 'outline': return theme.colors.primary[5];
      case 'ghost': return theme.colors.gray[7];
      case 'gradient': return '#FFFFFF';
      case 'link': return theme.colors.primary[5];
      case 'none': return 'currentColor';
      default: return '#FFFFFF';
    }
  }, [resolvedCustomColor, effectiveVariant, theme.colors.gray, theme.colors.primary]);

  // Helper function to inject color into icon components
  const renderIconWithColor = (iconElement: React.ReactNode) => {
    if (!iconElement) return iconElement;

    // If it's a React element, try to clone it with the button's text color
    if (React.isValidElement(iconElement)) {
      const iconProps = iconElement.props as any;

      // Check if it looks like an Icon component and should inherit color
      if (iconProps && (iconProps.name !== undefined || iconProps.color !== undefined)) {
        // Only inject color if no color is set or if it's set to currentColor
        const shouldInjectColor = !iconProps.color || iconProps.color === 'currentColor';
        if (shouldInjectColor) {
          return React.cloneElement(iconElement as any, {
            ...iconProps,
            color: textColor
          });
        }
      }
    }

    return iconElement;
  };

  // Button is effectively disabled when loading or disabled
  const isInteractionDisabled = disabled || loading;

  // Get loader color based on variant and custom color
  const getLoaderColor = () => loaderColor;

  // Press animation (scale) - stays outside style calc so parent re-renders unaffected
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animateTo = (to: number) => {
    Animated.timing(scaleAnim, {
      toValue: to,
      duration: getDuration(110), // Respect reduced motion preference
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
  };

  const [isPressing, setIsPressing] = useState(false);
  const { impactPressIn, impactPressOut } = useHaptics();
  const handlePressIn = () => {
    if (!isInteractionDisabled) {
      setIsPressing(true);
      impactPressIn();
      animateTo(0.96);
    }
    onPressIn?.();
  };
  const handlePressOut = () => {
    setIsPressing(false);
    impactPressOut();
    animateTo(1);
    onPressOut?.();
  };

  // Pulse animation for clicks that do not produce a pressIn (e.g., keyboard activation)
  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { 
        toValue: 0.95, 
        duration: getDuration(90), 
        easing: Easing.out(Easing.quad), 
        useNativeDriver: true 
      }),
      Animated.timing(scaleAnim, { 
        toValue: 1, 
        duration: getDuration(140), 
        easing: Easing.out(Easing.quad), 
        useNativeDriver: true 
      })
    ]).start();
  };

  const handleInternalPress = () => {
    if (isInteractionDisabled) return;
    // If user triggered onPress without a prior pressIn (keyboard / programmatic), run pulse
    if (!isPressing) {
      pulse();
    }
    
    // Announce action for screen readers if tooltip is provided
    if (tooltip) {
      announce(`${tooltip} button activated`);
    }
    
    onPress?.();
  };

  // Generate accessibility props
  const accessibilityLabel = accessibilityLabelProp || tooltip || (typeof buttonContent === 'string' ? buttonContent : 'Button');
  const accessibilityHint = accessibilityHintProp || (loading ? 'Loading' : undefined);
  const accessibilityProps = createAccessibilityProps({
    role: 'button',
    label: accessibilityLabel,
    hint: accessibilityHint,
    disabled: isInteractionDisabled,
    selected: false,
  });

  // For web we also want mouse down/up to reflect; Pressable already fires these.
  const animatedWrapperStyle = useMemo(() => ({ transform: [{ scale: scaleAnim }] }), [scaleAnim]);

  const buttonElement = (
    <View style={[spacingStyles, layoutStyles]}>
      <Animated.View style={animatedWrapperStyle} collapsable={false}

      >
        <Pressable
          ref={focusRef}
          testID={testID}
          {...accessibilityProps}
          style={({ pressed }) => [
            buttonStyles,
            {
              width: '100%',
            },
            // subtle visual feedback beyond scale on supported platforms
            pressed && !isInteractionDisabled ? {
              opacity: effectiveVariant === 'ghost' || effectiveVariant === 'none' ? 0.6 : 0.9,
              ...(Platform.OS !== 'web' ? { transform: [{ translateY: 1 }] } : {})
            } : null,
            style,
            { minWidth: calculatedMinWidth }
          ]}
          onPress={handleInternalPress}
          onLayout={onLayout}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onHoverIn={onHoverIn}
          onHoverOut={onHoverOut}
          onLongPress={onLongPress}
          disabled={isInteractionDisabled}
        >

          {variant === 'gradient' && hasLinearGradient && (
            <OptionalLinearGradient
              colors={
                resolvedCustomColor
                  ? [resolvedCustomColor, theme.colors.primary[7]]
                  : [theme.colors.primary[5], theme.colors.primary[7]]
              }
              style={{ position: 'absolute', zIndex: -1, top: 0, left: 0, right: 0, bottom: 0, borderRadius: radiusStyles.borderRadius }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}

          {loading ? (
            <>
              <Loader
                size={size}
                color={getLoaderColor()}
                style={!isIconButton ? { marginRight: iconSpacing } : undefined}
              />
              {!isIconButton && renderButtonContent(displayContent)}
            </>
          ) : isIconButton ? (
            // Icon-only button
            renderIconWithColor(icon)
          ) : (
            // Regular button with text and optional side icons
            <>
              {startIcon && (
                <View style={{ marginRight: iconSpacing }}>
                  {renderIconWithColor(startIcon)}
                </View>
              )}

              {renderButtonContent(displayContent)}

              {endIcon && (
                <View style={{ marginLeft: iconSpacing }}>
                  {renderIconWithColor(endIcon)}
                </View>
              )}
            </>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );

  // Conditionally wrap with Tooltip if tooltip prop is provided
  if (tooltip) {
    return (
      <Tooltip label={tooltip} position={tooltipPosition}>
        {buttonElement}
      </Tooltip>
    );
  }

  return buttonElement;
};
