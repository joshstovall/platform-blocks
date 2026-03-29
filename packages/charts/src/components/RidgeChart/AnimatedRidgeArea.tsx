import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { Path as SvgPath } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(SvgPath);

export interface AnimatedRidgeAreaProps {
  path: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  index: number;
  totalAreas?: number;
  disabled?: boolean;
  fillOpacity?: number;
  strokeOpacity?: number;
}

export const AnimatedRidgeArea: React.FC<AnimatedRidgeAreaProps> = React.memo(({
  path,
  fill,
  stroke = 'none',
  strokeWidth = 0,
  index,
  totalAreas = 1,
  disabled = false,
  fillOpacity = 1,
  strokeOpacity = 1,
}) => {
  const opacity = useSharedValue(disabled ? 1 : 0);
  const scale = useSharedValue(disabled ? 1 : 0.8);

  // Adaptive timing based on number of areas
  const adaptiveTiming = React.useMemo(() => {
    if (totalAreas <= 5) {
      return { duration: 800, staggerDelay: 150 };
    } else if (totalAreas <= 10) {
      return { duration: 600, staggerDelay: 100 };
    } else {
      return { duration: 400, staggerDelay: 50 };
    }
  }, [totalAreas]);

  useEffect(() => {
    if (disabled) {
      opacity.value = 1;
      scale.value = 1;
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
    
    scale.value = withDelay(
      delay,
      withTiming(1, {
        duration: adaptiveTiming.duration,
        easing: Easing.out(Easing.back(1.2)),
      })
    );
  }, [disabled, index, adaptiveTiming, opacity, scale]);

  const animatedProps = useAnimatedProps(() => ({
    fillOpacity: opacity.value * fillOpacity,
    strokeOpacity: opacity.value * strokeOpacity,
    transform: [
      { scaleY: scale.value },
    ],
  }));

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      d={path}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
});

AnimatedRidgeArea.displayName = 'AnimatedRidgeArea';