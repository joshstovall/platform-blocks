import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import type { ChartDataPoint } from '../../types';
import type { useChartTheme } from '../../theme/ChartThemeContext';

/**
 * Props for the AnimatedBubble component
 * Renders an animated bubble for bubble charts with appearance and selection animations
 */
export interface AnimatedBubbleProps {
  /** Data point with calculated chart positions and radius */
  bubble: ChartDataPoint & {
    /** X position on the chart */
    chartX: number;
    /** Y position on the chart */
    chartY: number;
    /** Radius of the bubble */
    radius: number;
    /** Value represented by the bubble */
    value: number;
  };
  /** Color of the bubble */
  color: string;
  /** Opacity of the bubble (0 to 1) */
  opacity: number;
  /** Stroke color of the bubble */
  strokeColor?: string;
  /** Stroke width of the bubble */
  strokeWidth?: number;
  /** Whether the bubble is selected (for scaling effect) */
  isSelected?: boolean;
  /** Index for staggered animation delay */
  index: number;
  /** Whether the bubble is disabled (skips animation) */
  disabled?: boolean;
  /** Chart theme for colors and styles */
  theme: ReturnType<typeof useChartTheme>;
}

export const AnimatedBubble: React.FC<AnimatedBubbleProps> = React.memo(({
  bubble,
  color,
  opacity,
  strokeColor = 'rgba(0,0,0,0.12)',
  strokeWidth = 1,
  isSelected = false,
  index,
  disabled = false,
  theme,
}) => {
  const scale = useSharedValue(disabled ? 1 : 0);
  const bubbleOpacity = useSharedValue(disabled ? opacity : 0);

  useEffect(() => {
    if (disabled) {
      scale.value = 1;
      bubbleOpacity.value = opacity;
      return;
    }

    // Staggered appearance animation
    const delay = index * 75;
    scale.value = withDelay(delay, withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.back(1.1)),
    }));
    bubbleOpacity.value = withDelay(delay, withTiming(opacity, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    }));
  }, [disabled, index, opacity, scale, bubbleOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * (isSelected ? 1.2 : 1) }],
    opacity: bubbleOpacity.value,
  }));

  // Skip rendering if coordinates or radius are invalid
  if (
    typeof bubble.chartX !== 'number' ||
    typeof bubble.chartY !== 'number' ||
    typeof bubble.radius !== 'number' ||
    bubble.radius <= 0
  ) {
    return null;
  }

  const diameter = bubble.radius * 2;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: bubble.chartX - bubble.radius,
          top: bubble.chartY - bubble.radius,
          width: diameter,
          height: diameter,
          borderRadius: bubble.radius,
          backgroundColor: color,
          borderWidth: strokeWidth,
          borderColor: isSelected ? theme.colors.accentPalette[0] : strokeColor,
          pointerEvents: 'none',
        },
        animatedStyle,
      ]}
    />
  );
});

AnimatedBubble.displayName = 'AnimatedBubble';