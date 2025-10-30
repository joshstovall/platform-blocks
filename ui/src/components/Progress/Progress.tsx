import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  interpolate,
  Extrapolation,
  cancelAnimation
} from 'react-native-reanimated';

import { factory } from '../../core/factory';
import { getHeight, getRadius } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
import { getSpacingStyles, extractSpacingProps, getLayoutStyles, extractLayoutProps } from '../../core/utils';
import type {
  ProgressProps,
  ProgressRootProps,
  ProgressSectionProps,
  ProgressLabelProps,
  ProgressFactoryPayload,
  ProgressRootFactoryPayload,
  ProgressSectionFactoryPayload,
  ProgressLabelFactoryPayload,
  ProgressColor
} from './types';

// Types moved to ./types

function ProgressBase(props: ProgressProps, ref: React.Ref<View>) {
  const {
    value,
    size = 'md',
    color = 'primary',
    radius = 'md',
    striped = false,
    animate = false,
    transitionDuration = 0,
    style,
    'aria-label': ariaLabel,
    testID,
    ...rest
  } = props;

  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(rest);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterSpacing);
  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);

  const theme = useTheme();
  const height = getHeight(size);
  const borderRadius = getRadius(radius);

  // Debug: Ensure we have valid colors
  const resolvedProgressColor = (() => {
    if (typeof color === 'string' && theme.colors[color as ProgressColor]) {
      return theme.colors[color as ProgressColor][5];
    }
    if (typeof color === 'string' && color.startsWith('#')) {
      return color;
    }
    // Fallback to primary color
    return theme.colors.primary[5] || '#007AFF';
  })();

  const resolvedBackgroundColor = theme.colors.gray[1] || '#E5E5EA';
  const progressValue = Math.max(0, Math.min(100, value));

  const animatedWidth = useSharedValue(transitionDuration > 0 ? 0 : progressValue);
  const stripeAnimation = useSharedValue(0);

  useEffect(() => {
    if (transitionDuration > 0) {
      animatedWidth.value = withTiming(progressValue, {
        duration: transitionDuration,
      });
    } else {
      animatedWidth.value = progressValue;
    }
  }, [progressValue, transitionDuration, animatedWidth]);

  useEffect(() => {
    if (striped && animate) {
      stripeAnimation.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        false
      );
    } else {
      cancelAnimation(stripeAnimation);
      stripeAnimation.value = 0;
    }
    
    return () => cancelAnimation(stripeAnimation);
  }, [striped, animate, stripeAnimation]);

  // Animated styles
  const progressAnimatedStyle = useAnimatedStyle(() => {
    const widthPercentage = interpolate(
      animatedWidth.value,
      [0, 100],
      [0, 100],
      Extrapolation.CLAMP
    );

    return {
      width: `${widthPercentage}%`,
    };
  });

  const stripeAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      stripeAnimation.value,
      [0, 1],
      [0, 32] // Move by the width of two stripes (16px each)
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      ref={ref}
      style={[
        {
          height: Math.max(height, 8), // Ensure minimum height
          backgroundColor: resolvedBackgroundColor,
          borderRadius,
          overflow: 'hidden',
        },
        spacingStyles,
        layoutStyles,
        style
      ]}
      testID={testID}
      accessibilityLabel={ariaLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progressValue }}
      {...otherProps}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: resolvedProgressColor,
            borderRadius,
            overflow: 'hidden'
          },
          progressAnimatedStyle
        ]}
      >
        {striped && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: -32, // Start offscreen to ensure seamless loop
                right: 32, // Extend beyond bounds for seamless animation
                bottom: 0,
                flexDirection: 'row',
                opacity: 0.3,
              },
              stripeAnimatedStyle
            ]}
          >
            {/* Create diagonal barbershop pole stripes */}
            {Array.from({ length: 30 }, (_, i) => (
              <View
                key={i}
                style={{
                  width: 16,
                  height: '200%', // Taller to accommodate diagonal
                  backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'transparent',
                  transform: [{ 
                    skewX: '20deg', // Create diagonal stripes
                  }, {
                    translateY: -10 // Offset to center the diagonal
                  }] as any,
                }}
              />
            ))}
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

function ProgressRootBase(props: ProgressRootProps, ref: React.Ref<View>) {
  const {
    size = 'md',
    radius = 'md',
    children,
    style,
    testID,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();
  const height = getHeight(size);
  const borderRadius = getRadius(radius);
  const backgroundColor = theme.colors.gray[1] || '#E5E5EA';

  return (
    <View
      ref={ref}
      style={[
        {
          width: '100%', // Ensure full width of parent
          height,
          backgroundColor,
          borderRadius,
          overflow: 'hidden',
          flexDirection: 'row'
        },
        spacingStyles,
        style
      ]}
      testID={testID}
      {...otherProps}
    >
      {children}
    </View>
  );
}

function ProgressSectionBase(props: ProgressSectionProps, ref: React.Ref<View>) {
  const {
    value,
    color = 'primary',
    children
  } = props;

  const theme = useTheme();
  
  // Resolve progress color with fallback
  const resolvedProgressColor = (() => {
    if (typeof color === 'string' && theme.colors[color as ProgressColor]) {
      return theme.colors[color as ProgressColor][5];
    }
    if (typeof color === 'string' && color.startsWith('#')) {
      return color;
    }
    // Fallback to primary color
    return theme.colors.primary[5] || '#007AFF';
  })();

  const progressValue = Math.max(0, Math.min(100, value));

  return (
    <View
      ref={ref}
      style={{
        flex: progressValue,
        backgroundColor: resolvedProgressColor,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progressValue }}
    >
      {children}
    </View>
  );
}

function ProgressLabelBase(props: ProgressLabelProps, ref: React.Ref<Text>) {
  const { children } = props;
  const theme = useTheme();

  return (
    <Text
      ref={ref}
      style={{
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center'
      }}
    >
      {children}
    </Text>
  );
}

export const Progress = factory<ProgressFactoryPayload>(ProgressBase);
export const ProgressRoot = factory<ProgressRootFactoryPayload>(ProgressRootBase);
export const ProgressSection = factory<ProgressSectionFactoryPayload>(ProgressSectionBase);
export const ProgressLabel = factory<ProgressLabelFactoryPayload>(ProgressLabelBase);

// Compound component pattern
const ProgressCompound = Progress as typeof Progress & {
  Root: typeof ProgressRoot;
  Section: typeof ProgressSection;
  Label: typeof ProgressLabel;
};

ProgressCompound.Root = ProgressRoot;
ProgressCompound.Section = ProgressSection;
ProgressCompound.Label = ProgressLabel;

Progress.displayName = 'Progress';
ProgressRoot.displayName = 'Progress.Root';
ProgressSection.displayName = 'Progress.Section';
ProgressLabel.displayName = 'Progress.Label';

export { ProgressCompound as ProgressWithCompound };
