import { Animated } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useReducedMotion } from '../motion/ReducedMotionProvider';

export interface TransitionConfig {
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
}

export type TransitionType =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'rotate';

export const TRANSITION_EASINGS = {
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1)
} as const;

export const DEFAULT_TRANSITION_CONFIG: Required<TransitionConfig> = {
  duration: 200,
  delay: 0,
  easing: TRANSITION_EASINGS.easeOut
};

export function createTransition(
  animatedValue: Animated.Value,
  toValue: number,
  config: TransitionConfig = {},
  opts: { reduced?: boolean } = {}
): Animated.CompositeAnimation {
  const finalConfig = { ...DEFAULT_TRANSITION_CONFIG, ...config };
  const duration = opts.reduced ? 0 : finalConfig.duration;
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay: finalConfig.delay,
    easing: finalConfig.easing,
    useNativeDriver: false
  });
}

export function createSpringTransition(
  animatedValue: Animated.Value,
  toValue: number,
  config: {
    tension?: number;
    friction?: number;
    speed?: number;
    bounciness?: number;
  } = {},
  opts: { reduced?: boolean } = {}
): Animated.CompositeAnimation {
  if (opts.reduced) {
    animatedValue.setValue(toValue);
    // Return a no-op animation interface
    return {
      start: (cb?: Animated.EndCallback) => cb && cb({ finished: true }),
      stop: () => {},
      reset: () => {},
      _startNativeLoop: () => {}
    } as any;
  }
  return Animated.spring(animatedValue, {
    toValue,
    tension: config.tension || 100,
    friction: config.friction || 8,
    speed: config.speed || 12,
    bounciness: config.bounciness || 8,
    useNativeDriver: false
  });
}

// Hook-friendly helpers
export function useTransitionConfig() {
  const reduced = useReducedMotion();
  return { reduced };
}
