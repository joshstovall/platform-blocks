import React, { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';
import type { RevealProps } from './types';

// TODO: implement this into the see more Spoiler and Accordion components
const Reveal: React.FC<RevealProps> = ({
  isRevealed,
  children,
  duration = 300,
  timing = 'ease-out',
  style,
  contentStyle,
  onAnimationStart,
  onAnimationEnd,
  animateOnMount = false,
  collapsedHeight = 0,
  fadeContent = true,
}) => {
  const heightAnimation = useRef(new Animated.Value(animateOnMount ? collapsedHeight : (isRevealed ? 1 : collapsedHeight))).current;
  const opacityAnimation = useRef(new Animated.Value(animateOnMount ? 0 : (isRevealed ? 1 : 0))).current;
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Convert timing string to Animated easing function
  const getEasing = () => {
    switch (timing) {
      case 'linear':
        return Animated.timing;
      case 'ease':
        return Animated.timing;
      case 'ease-in':
        return Animated.timing;
      case 'ease-out':
        return Animated.timing;
      case 'ease-in-out':
        return Animated.timing;
      default:
        return Animated.timing;
    }
  };

  useEffect(() => {
    if (contentHeight === 0) return; // Wait for content to be measured

    setIsAnimating(true);
    onAnimationStart?.();

    const targetHeight = isRevealed ? contentHeight : collapsedHeight;
    const targetOpacity = isRevealed ? 1 : 0;

    const animations = [
      Animated.timing(heightAnimation, {
        toValue: targetHeight,
        duration,
        useNativeDriver: false,
      })
    ];

    if (fadeContent) {
      animations.push(
        Animated.timing(opacityAnimation, {
          toValue: targetOpacity,
          duration: duration * 0.8, // Slightly faster fade
          useNativeDriver: false,
        })
      );
    }

    Animated.parallel(animations).start(() => {
      setIsAnimating(false);
      onAnimationEnd?.();
    });
  }, [isRevealed, contentHeight, duration, collapsedHeight, fadeContent]);

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (contentHeight === 0) {
      setContentHeight(height);
      // Set initial values based on isRevealed state
      heightAnimation.setValue(isRevealed ? height : collapsedHeight);
      if (fadeContent) {
        opacityAnimation.setValue(isRevealed ? 1 : 0);
      }
    }
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

export default Reveal;