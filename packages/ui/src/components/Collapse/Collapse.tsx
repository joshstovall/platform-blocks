import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import type { CollapseProps } from './types';

const Collapse: React.FC<CollapseProps> = ({
  isCollapsed,
  children,
  duration = 300,
  timing = 'ease-out',
  easing,
  style,
  contentStyle,
  onAnimationStart,
  onAnimationEnd,
  animateOnMount = false,
  collapsedHeight = 0,
  fadeContent = true,
}) => {
  const heightAnimation = useRef(new Animated.Value(collapsedHeight)).current;
  const opacityAnimation = useRef(new Animated.Value(isCollapsed ? 0 : 1)).current;
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasMeasuredRef = useRef(false);
  const didInitRef = useRef(false);

  const resolvedEasing = useMemo(() => {
    if (easing) return easing;
    switch (timing) {
      case 'linear':
        return Easing.linear;
      case 'ease':
        return Easing.bezier(0.25, 0.1, 0.25, 1);
      case 'ease-in':
        return Easing.in(Easing.ease);
      case 'ease-in-out':
        return Easing.inOut(Easing.ease);
      case 'ease-out':
      default:
        return Easing.out(Easing.ease);
    }
  }, [easing, timing]);

  useEffect(() => {
    if (contentHeight === 0) return; // Wait for content to be measured

    // On the first pass after measuring, jump straight to the correct
    // position without animating (unless animateOnMount is requested).
    if (!didInitRef.current) {
      didInitRef.current = true;
      if (!animateOnMount) return;
    }

    setIsAnimating(true);
    onAnimationStart?.();

    const targetHeight = isCollapsed ? collapsedHeight : contentHeight;
    const targetOpacity = isCollapsed ? 0 : 1;

    const baseTimingConfig = {
      duration,
      useNativeDriver: false,
      ...(resolvedEasing ? { easing: resolvedEasing } : {}),
    } as const;

    const animations = [
      Animated.timing(heightAnimation, {
        toValue: targetHeight,
        ...baseTimingConfig,
      })
    ];

    if (fadeContent) {
      animations.push(
        Animated.timing(opacityAnimation, {
          toValue: targetOpacity,
          duration: duration * 0.8, // Slightly faster fade
          useNativeDriver: false,
          ...(resolvedEasing ? { easing: resolvedEasing } : {}),
        })
      );
    }

    Animated.parallel(animations).start(() => {
      setIsAnimating(false);
      onAnimationEnd?.();
    });
  }, [isCollapsed, contentHeight, duration, collapsedHeight, fadeContent, animateOnMount, resolvedEasing, opacityAnimation, heightAnimation, onAnimationEnd, onAnimationStart]);

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;

    if (!hasMeasuredRef.current) {
      hasMeasuredRef.current = true;
      setContentHeight(height);
      if (!animateOnMount) {
        heightAnimation.setValue(isCollapsed ? collapsedHeight : height);
        if (fadeContent) {
          opacityAnimation.setValue(isCollapsed ? 0 : 1);
        }
      }
      return;
    }

    setContentHeight(prev => {
      if (Math.abs(prev - height) > 0.5) {
        return height;
      }
      return prev;
    });
  };

  return (
    <Animated.View
      style={[
        {
          overflow: 'hidden',
          height: contentHeight > 0 ? heightAnimation : (isCollapsed ? collapsedHeight : undefined),
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          contentStyle,
          fadeContent && {
            opacity: opacityAnimation,
          },
        ]}
        onLayout={handleContentLayout}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default Collapse;
