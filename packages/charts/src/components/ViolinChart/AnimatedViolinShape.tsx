import React, { useEffect, useCallback } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { Path as SvgPath } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(SvgPath);

export interface AnimatedViolinShapeProps {
  path: string;
  fill: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  index: number;
  totalViolins?: number;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
}

export const AnimatedViolinShape: React.FC<AnimatedViolinShapeProps> = React.memo(({
  path,
  fill,
  fillOpacity = 0.35,
  stroke = 'none',
  strokeWidth = 0,
  index,
  totalViolins = 1,
  disabled = false,
  onFocus,
  onBlur,
  onPress,
}) => {
  const opacity = useSharedValue(disabled ? 1 : 0);
  const scaleX = useSharedValue(disabled ? 1 : 0.3);
  const scaleY = useSharedValue(disabled ? 1 : 0.8);

  // Adaptive timing based on number of violins
  const adaptiveTiming = React.useMemo(() => {
    if (totalViolins <= 3) {
      return { duration: 1000, staggerDelay: 200 };
    } else if (totalViolins <= 6) {
      return { duration: 800, staggerDelay: 150 };
    } else {
      return { duration: 600, staggerDelay: 100 };
    }
  }, [totalViolins]);

  useEffect(() => {
    if (disabled) {
      opacity.value = 1;
      scaleX.value = 1;
      scaleY.value = 1;
      return;
    }

    const delay = index * adaptiveTiming.staggerDelay;
    
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: adaptiveTiming.duration,
        easing: Easing.out(Easing.cubic),
      })
    );
    
    scaleX.value = withDelay(
      delay,
      withTiming(1, {
        duration: adaptiveTiming.duration,
        easing: Easing.out(Easing.back(1.3)),
      })
    );
    
    scaleY.value = withDelay(
      delay + 100,
      withTiming(1, {
        duration: adaptiveTiming.duration - 100,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [disabled, index, adaptiveTiming, opacity, scaleX, scaleY]);

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
    transform: [
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
    ],
  }));

  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      d={path}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      pointerEvents="auto"
      onPress={onPress ? handlePress : undefined}
      onPressIn={onFocus ? handleFocus : undefined}
      onPressOut={onBlur ? handleBlur : undefined}
      // @ts-ignore web hover events
      onMouseEnter={onFocus ? handleFocus : undefined}
      // @ts-ignore web hover events
      onMouseLeave={onBlur ? handleBlur : undefined}
      // @ts-ignore react-native-web hover events
      onHoverIn={onFocus ? handleFocus : undefined}
      // @ts-ignore react-native-web hover events
      onHoverOut={onBlur ? handleBlur : undefined}
    />
  );
});

AnimatedViolinShape.displayName = 'AnimatedViolinShape';