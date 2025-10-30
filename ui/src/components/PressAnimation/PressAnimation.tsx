import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated';
import { useTheme } from '../../core/theme';
import { DESIGN_TOKENS } from '../../core/design-tokens';

export interface PressAnimationProps extends Omit<PressableProps, 'style'> {
  /** Scale factor when pressed (default: 0.97) */
  pressScale?: number;
  /** Opacity when pressed (default: 0.8) */
  pressOpacity?: number;
  /** Animation type */
  variant?: 'scale' | 'opacity' | 'both';
  /** Custom style */
  style?: ViewStyle;
  /** Disable animation (respects reduced motion) */
  disableAnimation?: boolean;
  /** Children to render */
  children: React.ReactNode;
}

/**
 * Enhanced pressable component with consistent animations using theme motion tokens.
 * Automatically respects reduced motion preferences.
 */
export const PressAnimation: React.FC<PressAnimationProps> = ({
  pressScale = 0.97,
  pressOpacity = 0.8,
  variant = 'both',
  style,
  disableAnimation = false,
  children,
  onPressIn,
  onPressOut,
  ...pressableProps
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    const shouldAnimate = !disableAnimation;
    return {
      transform: [
        {
          scale:
            (variant === 'scale' || variant === 'both') && shouldAnimate
              ? scale.value
              : 1,
        },
      ],
      opacity:
        (variant === 'opacity' || variant === 'both') && shouldAnimate
          ? opacity.value
          : 1,
    };
  });

  const handlePressIn = (event: any) => {
    if (!disableAnimation) {
      if (variant === 'scale' || variant === 'both') {
        scale.value = withTiming(pressScale, {
          duration: DESIGN_TOKENS.motion.duration.fast,
          reduceMotion: ReduceMotion.System,
        });
      }
      if (variant === 'opacity' || variant === 'both') {
        opacity.value = withTiming(pressOpacity, {
          duration: DESIGN_TOKENS.motion.duration.fast,
          reduceMotion: ReduceMotion.System,
        });
      }
    }

    // Call the original callback directly since it's already on JS thread
    if (onPressIn) {
      onPressIn(event);
    }
  };

  const handlePressOut = (event: any) => {
    if (!disableAnimation) {
      if (variant === 'scale' || variant === 'both') {
        scale.value = withTiming(1, {
          duration: DESIGN_TOKENS.motion.duration.normal,
          reduceMotion: ReduceMotion.System,
        });
      }
      if (variant === 'opacity' || variant === 'both') {
        opacity.value = withTiming(1, {
          duration: DESIGN_TOKENS.motion.duration.normal,
          reduceMotion: ReduceMotion.System,
        });
      }
    }

    // Call the original callback directly since it's already on JS thread
    if (onPressOut) {
      onPressOut(event);
    }
  };

  return (
    <Pressable
      {...pressableProps}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
};

/**
 * Higher-order component to add press animations to any component
 */
export function withPressAnimation<T extends object>(
  Component: React.ComponentType<T>,
  animationProps?: Partial<PressAnimationProps>
) {
  const AnimatedComponent = React.forwardRef<any, T & Partial<PressAnimationProps>>(
    (props, ref) => {
      const { style, ...componentProps } = props as any;
      return (
        <PressAnimation {...animationProps} {...(props as any)} style={style}>
          <Component {...(componentProps as T)} ref={ref} />
        </PressAnimation>
      );
    }
  );

  AnimatedComponent.displayName = `withPressAnimation(${(Component as any).displayName ||
    (Component as any).name})`;
  return AnimatedComponent;
}

/**
 * Pre-built animated button component for common use cases
 */
export const AnimatedPressable = PressAnimation;
