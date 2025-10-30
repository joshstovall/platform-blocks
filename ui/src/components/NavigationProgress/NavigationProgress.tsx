import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import type { NavigationProgressProps, NavigationProgressController } from './types';
import { NAVIGATIONPROGRESS_DEFAULTS } from './defaults';
import { useTheme } from '../../core/theme';
import { useColorScheme } from '../../core/theme/useColorScheme';

let subscribers = new Set<(state: { value: number; active: boolean }) => void>();
let internalState = { value: 0, active: false };
let interval: any = null;

function broadcast() { subscribers.forEach(cb => cb({ ...internalState })); }
function schedule(intervalMs: number) {
  clearInterval(interval);
  interval = setInterval(() => {
    if (!internalState.active) return;
    const remain = 100 - internalState.value;
    const inc = Math.max(0.1, remain * 0.03);
    internalState.value = Math.min(99, internalState.value + inc);
    broadcast();
  }, intervalMs);
}

export const navigationProgress: NavigationProgressController = {
  start() { if (internalState.active) return; internalState.active = true; if (internalState.value >= 100) internalState.value = 0; broadcast(); schedule(NAVIGATIONPROGRESS_DEFAULTS.stepInterval); },
  stop() { internalState.active = false; broadcast(); },
  complete() { internalState.active = true; internalState.value = 100; broadcast(); setTimeout(() => { internalState.active = false; internalState.value = 0; broadcast(); }, 400); },
  reset() { internalState.value = 0; internalState.active = false; broadcast(); },
  set(v: number) { internalState.value = Math.max(0, Math.min(100, v)); broadcast(); },
  increment(delta = 5) { internalState.value = Math.min(100, internalState.value + delta); broadcast(); },
  decrement(delta = 5) { internalState.value = Math.max(0, internalState.value - delta); broadcast(); },
  isActive() { return internalState.active; }
};

export const NavigationProgress: React.FC<NavigationProgressProps> = ({
  value,
  size = NAVIGATIONPROGRESS_DEFAULTS.size,
  color = NAVIGATIONPROGRESS_DEFAULTS.color,
  zIndex = NAVIGATIONPROGRESS_DEFAULTS.zIndex,
  overlay = NAVIGATIONPROGRESS_DEFAULTS.overlay,
  stepInterval = NAVIGATIONPROGRESS_DEFAULTS.stepInterval,
  radius = NAVIGATIONPROGRESS_DEFAULTS.radius,
  active = true,
  style
}) => {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const sub = (s: { value: number; active: boolean }) => {
      if (value == null) {
        progress.value = withTiming(s.value, { duration: stepInterval });
        opacity.value = withTiming(s.active ? 1 : 0, { duration: 150 });
      }
    };
    subscribers.add(sub); broadcast();
    return () => { subscribers.delete(sub); };
  }, [value, stepInterval, progress, opacity]);

  useEffect(() => {
    if (value != null) {
      progress.value = withTiming(value, { duration: stepInterval });
      opacity.value = withTiming(active ? 1 : 0, { duration: 150 });
    }
  }, [value, active, stepInterval]);

  let resolvedColor: string = color;
  if ((theme.colors as any)[color]) {
    const bucket: any = (theme.colors as any)[color];
    resolvedColor = bucket[5] || bucket[4] || bucket[0];
  }

  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));
  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          position: overlay ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          height: size,
          backgroundColor: isDark ? theme.colors.gray[3] : theme.colors.gray[2],
          overflow: 'hidden',
          zIndex,
          borderRadius: radius,
          pointerEvents: 'none'
        },
        containerStyle,
        style
      ]}
    >
      <Animated.View
        style={[{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          backgroundColor: resolvedColor,
          borderRadius: radius,
        }, barStyle]}
      />
      <Animated.View
        style={[{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 80,
          backgroundColor: 'rgba(255,255,255,0.2)'
        }, barStyle]}
      />
    </Animated.View>
  );
};
