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
  const heightAnimation = useRef(new Animated.Value(animateOnMount ? collapsedHeight : (isCollapsed ? 1 : collapsedHeight))).current;
  const opacityAnimation = useRef(new Animated.Value(animateOnMount ? 0 : (isCollapsed ? 1 : 0))).current;
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasMeasuredRef = useRef(false);

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

    setIsAnimating(true);
    onAnimationStart?.();

    const targetHeight = isCollapsed ? contentHeight : collapsedHeight;
    const targetOpacity = isCollapsed ? 1 : 0;

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
  }, [isCollapsed, contentHeight, duration, collapsedHeight, fadeContent, resolvedEasing, opacityAnimation, heightAnimation, onAnimationEnd, onAnimationStart]);

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;

    if (!hasMeasuredRef.current) {
      hasMeasuredRef.current = true;
      setContentHeight(height);
      heightAnimation.setValue(isCollapsed ? height : Math.min(height, collapsedHeight));
      if (fadeContent) {
        opacityAnimation.setValue(isCollapsed ? 1 : 0);
      }
      return;
    }

    setContentHeight(prev => {
      if (Math.abs(prev - height) > 0.5) {
        heightAnimation.setValue(isCollapsed ? height : Math.min(height, collapsedHeight));
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
          height: contentHeight > 0 ? heightAnimation : undefined,
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