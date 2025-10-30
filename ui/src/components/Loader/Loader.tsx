import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
  cancelAnimation,
  SharedValue,
} from 'react-native-reanimated';

import { factory } from '../../core/factory';
import { getIconSize } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import type { LoaderProps, LoaderVariant } from './types';

interface LoaderFactoryPayload {
  props: LoaderProps;
  ref: View;
}

function LoaderBase(props: LoaderProps, ref: React.Ref<View>) {
  const {
    size = 'md',
    color,
    variant = 'oval',
    speed = 1000,
    style,
    testID,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();
  const loaderSize = getIconSize(size); // scale up a bit for loader visibility
  const loaderColor = color || theme.colors.primary[5];

  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1, { duration: speed }),
      -1,
      false
    );

    return () => {
      cancelAnimation(animationValue);
    };
  }, [animationValue, speed]);

  const renderLoader = () => {
    switch (variant) {
      case 'bars':
        return <BarsLoader size={loaderSize} color={loaderColor} animationValue={animationValue} />;
      case 'dots':
        return <DotsLoader size={loaderSize} color={loaderColor} animationValue={animationValue} />;
      case 'oval':
      default:
        return <OvalLoader size={loaderSize} color={loaderColor} animationValue={animationValue} />;
    }
  };

  return (
    <View
      ref={ref}
      style={[
        {
          width: loaderSize,
          height: loaderSize,
          alignItems: 'center',
          justifyContent: 'center'
        },
        spacingStyles,
        style
      ]}
      testID={testID}
      {...otherProps}
    >
      {renderLoader()}
    </View>
  );
}

// Oval Loader (rotating circle with border)
function OvalLoader({ size, color, animationValue }: { size: number; color: string; animationValue: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      animationValue.value,
      [0, 1],
      [0, 360]
    );

    return {
      transform: [{ rotate: `${rotation}deg` }]
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: Math.max(2, size / 10),
          borderTopColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
        },
        animatedStyle
      ]}
    />
  );
}

// Bars Loader (animated bars)
function BarsLoader({ size, color, animationValue }: { size: number; color: string; animationValue: SharedValue<number> }) {
  const barWidth = size / 8;
  const barHeight = size;

  // Create a reusable Bar component
  const Bar = ({ index }: { index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const height = interpolate(
        animationValue.value,
        [0, 0.2 + index * 0.2, 0.6 + index * 0.2, 1],
        [barHeight * 0.3, barHeight, barHeight * 0.3, barHeight * 0.3],
        Extrapolation.CLAMP
      );

      return {
        height
      };
    });

    return (
      <Animated.View
        style={[
          {
            width: barWidth,
            backgroundColor: color,
            marginHorizontal: barWidth / 4,
            borderRadius: barWidth / 2
          },
          animatedStyle
        ]}
      />
    );
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: size }}>
      {[0, 1, 2].map((index) => {
        return <Bar key={index} index={index} />;
      })}
    </View>
  );
}

// Dots Loader (pulsing dots)
function DotsLoader({ size, color, animationValue }: { size: number; color: string; animationValue: SharedValue<number> }) {
  const dotSize = size / 4;

  // Create a reusable Dot component
  const Dot = ({ index }: { index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        animationValue.value,
        [0, 0.2 + index * 0.2, 0.6 + index * 0.2, 1],
        [0.8, 1.2, 0.8, 0.8],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        animationValue.value,
        [0, 0.2 + index * 0.2, 0.6 + index * 0.2, 1],
        [0.5, 1, 0.5, 0.5],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity
      };
    });

    return (
      <Animated.View
        style={[
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
            marginHorizontal: dotSize / 4,
          },
          animatedStyle
        ]}
      />
    );
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {[0, 1, 2].map((index) => {
        return <Dot key={index} index={index} />;
      })}
    </View>
  );
}

export const Loader = factory<LoaderFactoryPayload>(LoaderBase);

Loader.displayName = 'Loader';
