import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolate,
  interpolateColor 
} from 'react-native-reanimated';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { Text } from '../Text';
import { FieldHeader } from '../_internal/FieldHeader';
import { useDisclaimer, extractDisclaimerProps } from '../_internal/Disclaimer';
import { SwitchProps } from './types';
import { useSwitchStyles } from './styles';
import { Row, Column } from '../Layout';
import { DESIGN_TOKENS } from '../../core/design-tokens';
import { resolveComponentSize, type ComponentSize } from '../../core/theme/componentSize';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';

export const Switch = factory<{
  props: SwitchProps;
  ref: View;
}>((rawProps, ref) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(rawProps);
  const spacingStyles = getSpacingStyles(spacingProps);
  const { disclaimerProps: disclaimerData, otherProps: props } = extractDisclaimerProps(propsAfterSpacing as SwitchProps);
  const {
    checked,
    defaultChecked = false,
    onChange,
    size = 'md',
    color = 'primary',
    label,
    disabled = false,
    required = false,
    error,
    description,
    labelPosition = 'right',
    children,
    onIcon,
    offIcon,
    onLabel = 'On',
    offLabel = 'Off',
    controls,
    accessibilityLabel: accessibilityLabelProp,
    accessibilityHint,
    testID,
    style,
  } = props;

  const theme = useTheme();
  const renderDisclaimer = useDisclaimer(disclaimerData.disclaimer, disclaimerData.disclaimerProps);
  // Controlled / uncontrolled logic
  const isControlled = typeof checked === 'boolean';
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  const prevIsControlled = useRef(isControlled);
  useEffect(() => {
    // If moving from controlled to uncontrolled or vice versa, we keep current visual state
    prevIsControlled.current = isControlled;
  }, [isControlled]);
  const effectiveChecked = isControlled ? !!checked : internalChecked;

  const styles = useSwitchStyles({
    checked: effectiveChecked,
    disabled,
    error: !!error,
    size,
    color,
    theme
  });

  // Animation setup
  const animationProgress = useSharedValue(effectiveChecked ? 1 : 0);

  useEffect(() => {
    animationProgress.value = withSpring(effectiveChecked ? 1 : 0, {
      damping: DESIGN_TOKENS.motion.duration.normal / 10, // Convert duration to damping ratio
      stiffness: DESIGN_TOKENS.motion.duration.fast, // Use fast duration for stiffness
      mass: 0.5,
    });
  }, [effectiveChecked, animationProgress]);

  // Get size dimensions for animation
  const sizeMap: Partial<Record<ComponentSize, { width: number; height: number; thumb: number }>> = {
    xs: { width: 24, height: 14, thumb: 10 },
    sm: { width: 32, height: 18, thumb: 14 },
    md: { width: 40, height: 22, thumb: 18 },
    lg: { width: 48, height: 26, thumb: 22 },
    xl: { width: 56, height: 30, thumb: 26 },
    '2xl': { width: 64, height: 34, thumb: 30 },
    '3xl': { width: 72, height: 38, thumb: 34 }
  };
  const resolvedDimensions = resolveComponentSize(size, sizeMap, {
    fallback: 'md',
    allowedSizes: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
  });
  const baseDimensions = sizeMap.md!;
  const baseWidthRatio = baseDimensions.width / baseDimensions.height;
  const baseThumbRatio = baseDimensions.thumb / baseDimensions.height;

  const switchDimensions = typeof resolvedDimensions === 'number'
    ? {
        width: resolvedDimensions * baseWidthRatio,
        height: resolvedDimensions,
        thumb: resolvedDimensions * baseThumbRatio,
      }
    : (resolvedDimensions ?? baseDimensions);
  const { width, height, thumb } = switchDimensions;

  // Calculate thumb positions with visual centering
  // Adjust positions independently for optimal visual balance
  const borderWidth = 2;
  const leftPadding = -2; // Move left position even further left
  const rightPadding = 2; // Keep right position as is (looks good)
  const leftPosition = borderWidth + leftPadding; // 1px from left edge
  const rightPosition = width - thumb - borderWidth - rightPadding; // 4px from right edge

  // Animated styles
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      [leftPosition, rightPosition]
    );

    return {
      transform: [{ translateX }],
    };
  }, [leftPosition, rightPosition]); // Add dependencies

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const colorKey = color as keyof typeof theme.colors;
    const activeColor = theme.colors[colorKey]?.[6] || theme.colors.primary[6];
    
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      [theme.colors.gray[3], activeColor]
    );

    return {
      backgroundColor: disabled ? theme.colors.gray[2] : backgroundColor,
    };
  }, [color, theme.colors, disabled]); // Add dependencies

  const handlePress = useCallback(() => {
    if (disabled) return;
    const next = !effectiveChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }, [disabled, onChange, effectiveChecked, isControlled]);

  const labelContent = children || label;

  const switchElement = (
    <View style={styles.switchContainer}>
      <Animated.View style={[styles.switchTrack, trackAnimatedStyle, style]}>
        <Pressable
          ref={ref}
          style={styles.switchPressable}
          onPress={handlePress}
          disabled={disabled}
          testID={testID}
          accessibilityRole="switch"
          accessibilityState={{
            checked: effectiveChecked,
            disabled
          }}
          accessibilityLabel={accessibilityLabelProp || (typeof labelContent === 'string' ? labelContent : undefined)}
          accessibilityHint={accessibilityHint}
          accessibilityValue={{ text: effectiveChecked ? onLabel : offLabel }}
          {...(controls && { 'aria-controls': controls })}
        >
          <Animated.View style={[styles.switchThumb, thumbAnimatedStyle]}>
            {effectiveChecked && onIcon ? onIcon : null}
            {!effectiveChecked && offIcon ? offIcon : null}
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );

  const labelElement = labelContent && (
    <Pressable
      style={styles.labelContainer}
      onPress={handlePress}
      disabled={disabled}
    >
      <FieldHeader
        label={labelContent}
        description={!error ? description : undefined}
        required={required}
        withAsterisk={true}
        disabled={disabled}
        error={!!error}
        size={size as any}
        marginBottom={error ? 2 : undefined}
      />
      {error && (
        <Text style={styles.error} size="sm" selectable={false}>{error}</Text>
      )}
    </Pressable>
  );

  const containerStyle = [
    styles.container,
    // labelPosition === 'left' && styles.containerReverse,
  ];

  // Determine layout based on label position
  const isVertical = labelPosition === 'top' || labelPosition === 'bottom';
  const LayoutComponent = isVertical ? Column : Row;
  
  // For vertical layouts (top/bottom), we want tighter spacing and center alignment
  const layoutProps = isVertical 
    ? { gap: 'xs' as const, align: 'center' as const }
    : { gap: 'sm' as const, align: 'center' as const };

  const disclaimerNode = renderDisclaimer();

  return (
    <View style={spacingStyles}>
      <LayoutComponent {...layoutProps}>
        {labelPosition === 'top' && labelElement}
        {labelPosition === 'left' && labelElement}
        {switchElement}
        {labelPosition === 'right' && labelElement}
        {labelPosition === 'bottom' && labelElement}
      </LayoutComponent>
      {disclaimerNode ? (
        <View style={{ width: '100%' }}>
          {disclaimerNode}
        </View>
      ) : null}
    </View>
  );
});

Switch.displayName = 'Switch';
