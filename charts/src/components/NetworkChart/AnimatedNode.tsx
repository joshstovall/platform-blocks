import React, { useEffect, useCallback } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Circle, G, Text as SvgText } from 'react-native-svg';
import type { useChartTheme } from '../../theme/ChartThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(SvgText);
const AnimatedGroup = Animated.createAnimatedComponent(G);

export interface AnimatedNodeProps {
  id: string;
  x: number;
  y: number;
  color: string;
  label?: string;
  radius?: number;
  index: number;
  disabled?: boolean;
  theme: ReturnType<typeof useChartTheme>;
  showLabel?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
}

export const AnimatedNode: React.FC<AnimatedNodeProps> = React.memo(
  ({
    id,
    x,
    y,
    color,
    label,
    radius = 12,
    index,
    disabled = false,
    theme,
    showLabel = true,
    onFocus,
    onBlur,
    onPress,
  }) => {
    const cx = useSharedValue(x);
    const cy = useSharedValue(y);
    const opacity = useSharedValue(disabled ? 0.45 : 0);
    const labelOpacity = useSharedValue(0);

    useEffect(() => {
      // Skip animations for performance - directly set positions
      cx.value = x;
      cy.value = y;
      opacity.value = disabled ? 0.45 : 1;
      labelOpacity.value = disabled ? 0.25 : 0.85;
    }, [x, y, disabled, cx, cy, opacity, labelOpacity]);

    const nodeProps = useAnimatedProps(() => ({
      cx: cx.value,
      cy: cy.value,
      opacity: opacity.value,
    }));

    const groupProps = useAnimatedProps(() => ({
      opacity: opacity.value,
    }));

    const textProps = useAnimatedProps(() => ({
      x: cx.value,
      y: cy.value + radius + 6,
      opacity: labelOpacity.value,
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
      <AnimatedGroup
        animatedProps={groupProps}
        key={id}
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
      >
        <AnimatedCircle
          animatedProps={nodeProps}
          r={radius}
          fill={color}
          stroke={theme.colors.background}
          strokeWidth={1.5}
        />
        {label && showLabel && (
          <AnimatedText
            animatedProps={textProps}
            fontSize={theme.fontSize.xs}
            fill={theme.colors.textPrimary}
            fontFamily={theme.fontFamily}
            textAnchor="middle"
            pointerEvents="none"
          >
            {label}
          </AnimatedText>
        )}
      </AnimatedGroup>
    );
  }
);

AnimatedNode.displayName = 'NetworkAnimatedNode';
