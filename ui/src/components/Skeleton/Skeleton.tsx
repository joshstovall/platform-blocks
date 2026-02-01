import React, { useEffect } from 'react';
import { View, DimensionValue } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  interpolate,
  Easing 
} from 'react-native-reanimated';

import { factory } from '../../core/factory';
import { SizeValue, getSpacing, getHeight } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { SkeletonProps, SkeletonShape, SkeletonFactoryPayload } from './types';

function SkeletonBase(props: SkeletonProps, ref: React.Ref<View>) {
  const {
    shape = 'rectangle',
    w,
    h,
    size = 'md',
    radius,
    animate = true,
    animationDuration = 1500,
    colors,
    style,
    testID,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();
  const animationProgress = useSharedValue(0);

  const baseColor = colors?.[0] || theme.colors.gray[1];
  const highlightColor = colors?.[1] || theme.colors.gray[2];

  // Start animation
  useEffect(() => {
    if (!animate) return;

    animationProgress.value = withRepeat(
      withTiming(1, {
        duration: animationDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [animate, animationDuration, animationProgress]);

  const getShapeDimensions = (): { width: DimensionValue; height: DimensionValue } => {
    const sizeValue = getHeight(size);

    switch (shape) {
      case 'text':
        return {
          width: w || '100%',
          height: h || getSpacing('md')
        };
      case 'chip':
        return {
          width: w || (sizeValue * 3),
          height: h || sizeValue
        };
      case 'avatar':
      case 'circle':
        return {
          width: w || sizeValue,
          height: h || sizeValue
        };
      case 'button':
        return {
          width: w || (sizeValue * 4),
          height: h || sizeValue
        };
      case 'card':
        return {
          width: w || '100%',
          height: h || (sizeValue * 6)
        };
      case 'rectangle':
      case 'rounded':
      default:
        return {
          width: w || '100%',
          height: h || sizeValue
        };
    }
  };

  const getShapeRadius = () => {
    if (radius !== undefined) {
      return typeof radius === 'number' ? radius : getSpacing(radius);
    }

    const sizeValue = getHeight(size);

    switch (shape) {
      case 'chip':
        return sizeValue / 2;
      case 'avatar':
      case 'circle':
        return sizeValue / 2;
      case 'button':
        return getSpacing('sm');
      case 'card':
      case 'rounded':
        return getSpacing('md');
      case 'text':
        return getSpacing('xs');
      case 'rectangle':
      default:
        return 0;
    }
  };

  const dimensions = getShapeDimensions();
  const borderRadius = getShapeRadius();

  const animatedStyle = useAnimatedStyle(() => {
    if (!animate) {
      return {
        backgroundColor: baseColor,
      };
    }

    const interpolatedOpacity = interpolate(
      animationProgress.value,
      [0, 1],
      [0.3, 1]
    );

    return {
      backgroundColor: highlightColor,
      opacity: interpolatedOpacity,
    };
  });

  return (
    <View
      ref={ref}
      style={[
        {
          backgroundColor: baseColor,
          width: dimensions.width,
          height: dimensions.height,
          borderRadius,
          overflow: 'hidden',
        },
        spacingStyles,
        style
      ]}
      testID={testID}
      {...otherProps}
    >
      {animate && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius
            },
            animatedStyle
          ]}
        />
      )}
    </View>
  );
}

export const Skeleton = factory<SkeletonFactoryPayload>(SkeletonBase);

Skeleton.displayName = 'Skeleton';
