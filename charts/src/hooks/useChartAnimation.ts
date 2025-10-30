import { useSharedValue, withTiming, withDelay, withSequence, Easing } from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';

/**
 * Optimized animation hook that prevents unnecessary re-renders
 * and provides better control over animation sequences
 */
export function useChartAnimation(
  data: any[],
  options: {
    duration?: number;
    delay?: number;
    stagger?: number;
    disabled?: boolean;
    easing?: any;
  } = {}
) {
  const {
    duration = 800,
    delay = 0,
    stagger = 50,
    disabled = false,
    easing = Easing.out(Easing.cubic)
  } = options;

  // Create stable animated values (avoid recreating on re-renders)
  const animatedValues = useMemo(() => 
    data.map(() => useSharedValue(0)), 
    [data.length] // Only recreate when data length changes
  );

  const masterProgress = useSharedValue(0);

  useEffect(() => {
    if (disabled) {
      // Set all values immediately
      animatedValues.forEach(value => value.value = 1);
      masterProgress.value = 1;
      return;
    }

    // Reset and animate
    animatedValues.forEach(value => value.value = 0);
    masterProgress.value = 0;

    // Stagger animations for better visual effect
    animatedValues.forEach((value, index) => {
      value.value = withDelay(
        delay + (index * stagger),
        withTiming(1, { duration, easing })
      );
    });

    // Master progress for overall animation state
    masterProgress.value = withDelay(
      delay,
      withTiming(1, { duration: duration + (data.length * stagger), easing })
    );
  }, [data, disabled]);

  return {
    animatedValues,
    masterProgress,
    isAnimating: masterProgress.value < 1,
  };
}

/**
 * Performance-optimized hook for path animations
 */
export function usePathAnimation(
  pathData: string,
  options: {
    duration?: number;
    disabled?: boolean;
  } = {}
) {
  const { duration = 1000, disabled = false } = options;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (disabled) {
      progress.value = 1;
      return;
    }

    progress.value = 0;
    progress.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [pathData, disabled]);

  return progress;
}
