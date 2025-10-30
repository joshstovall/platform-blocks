import React, { useMemo, useCallback, useRef, useState, useEffect, memo } from 'react';
import { View, Pressable, ViewStyle, Text as RNText, Platform } from 'react-native';
import ReanimatedCarousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import Animated, { useSharedValue, useAnimatedStyle, interpolateColor, useDerivedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { useTheme } from '../../core/theme/ThemeProvider';
import { useDirection } from '../../core/providers/DirectionProvider';
import type { CarouselProps } from './types';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Button } from '../Button';
import { Icon } from '../Icon';

// Wrapper implementation using react-native-reanimated-carousel as the engine
// Keeps PlatformBlocks Carousel API (subset) while delegating gesture/scroll physics.

const ORDER: any[] = ['base', 'xs', 'sm', 'md', 'lg', 'xl'];

const resolveResponsive = (config: any, breakpoint: string) => {
  if (config == null) return undefined;
  if (typeof config === 'number' || typeof config === 'string') return config;
  const idx = ORDER.indexOf(breakpoint);
  for (let i = idx; i >= 0; i--) {
    const k = ORDER[i];
    if (config[k] != null) return config[k];
  }
  return undefined;
};

// Optimized Dot component with memo to prevent unnecessary re-renders
const CarouselDot = memo(({
  index,
  pageProgress,
  baseDotSize,
  totalPages,
  loop,
  theme,
  onPress,
  isVertical = false
}: {
  index: number;
  pageProgress: SharedValue<number>;
  baseDotSize: number;
  totalPages: number;
  loop: boolean;
  theme: any;
  onPress: (index: number) => void;
  isVertical?: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    let current = pageProgress.value;
    // Normalize for loop jitter: map absolute progress to logical page index space
    if (loop && totalPages > 0) {
      current = ((current % totalPages) + totalPages) % totalPages;
    }
    const rawDist = Math.abs(current - index);
    const dist = loop ? Math.min(rawDist, totalPages - rawDist) : rawDist;
    const active = 1 - Math.min(dist, 1); // clamp to [0,1]

    // Use withTiming for smoother animations and reduced frame drops
    const size = withTiming(baseDotSize + (baseDotSize * 1.4) * active, { duration: 100 });
    const opacity = withTiming(0.4 + 0.6 * active, { duration: 100 });
    const backgroundColor = interpolateColor(active, [0, 1], [theme.colors.gray[4], theme.colors.primary[6]]);

    return {
      width: isVertical ? baseDotSize : size,
      height: isVertical ? size : baseDotSize,
      opacity,
      backgroundColor
    } as any;
  }, [isVertical]);

  const handlePress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  const containerStyle = isVertical
    ? { marginVertical: 4, width: baseDotSize, justifyContent: 'center' as const }
    : { marginHorizontal: 4, height: baseDotSize, justifyContent: 'center' as const };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Go to slide ${index + 1}`}
      style={containerStyle}
    >
      <Animated.View style={[{ borderRadius: baseDotSize / 2 }, animatedStyle]} />
    </Pressable>
  );
});

// Optimized breakpoint hook with debouncing
const useOptimizedBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('sm');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const compute = () => {
      const w = Platform.OS === 'web'
        ? (window as any).innerWidth
        : require('react-native').Dimensions.get('window').width;

      let newBreakpoint = 'sm';
      if (w >= 1200) newBreakpoint = 'xl';
      else if (w >= 992) newBreakpoint = 'lg';
      else if (w >= 768) newBreakpoint = 'md';
      else if (w >= 576) newBreakpoint = 'sm';
      else newBreakpoint = 'xs';

      setBreakpoint(prev => prev !== newBreakpoint ? newBreakpoint : prev);
    };

    const debouncedCompute = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(compute, 100); // Debounce resize events
    };

    compute();

    if (Platform.OS === 'web') {
      window.addEventListener('resize', debouncedCompute, { passive: true });
      return () => {
        window.removeEventListener('resize', debouncedCompute);
        clearTimeout(timeoutId);
      };
    }

    return () => clearTimeout(timeoutId);
  }, []);

  return breakpoint;
};

export const Carousel: React.FC<CarouselProps> = (props) => {
  const {
    children,
    orientation = 'horizontal',
    height = 200,
    w = 300,
    showDots = true,
    showArrows = true,
    loop = true,
    autoPlay = false,
    autoPlayInterval = 3000,
    itemsPerPage = 1,
    slideSize,
    slideGap,
    itemGap = 16,
    onSlideChange,
    style,
    itemStyle,
    arrowSize = 'md',
    dotSize = 'md', // currently uniform size; active expands
    snapToItem = true, // kept for API parity (engine handles snapping)
    windowSize = 0, // 0 means no virtualization
    reducedMotion = false,
    ...rest
  } = props as any;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);
  const theme = useTheme();
  const { isRTL } = useDirection();

  const containerRef = useRef<View>(null);
  const carouselRef = useRef<ICarouselInstance>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  // progress holds absolute item progress (fractional, not modulo) supplied by engine
  const progress = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsArray = useMemo(() => React.Children.toArray(children), [children]);
  const totalItems = itemsArray.length;

  // Use optimized breakpoint detection with debouncing
  const breakpoint = useOptimizedBreakpoint();

  const resolvedGap = useMemo(() => {
    const raw = resolveResponsive(slideGap, breakpoint);
    if (raw == null) return itemGap;
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
      const parsed = parseFloat(raw);
      return isNaN(parsed) ? itemGap : parsed;
    }
    return itemGap;
  }, [slideGap, breakpoint, itemGap]);

  const isVertical = orientation === 'vertical';
  const containerSize = isVertical ? containerHeight : containerWidth;

  const itemSize = useMemo(() => {
    if (containerSize <= 0) return 0;
    const rawSize = resolveResponsive(slideSize, breakpoint);
    if (rawSize == null) {
      return (containerSize - resolvedGap * (itemsPerPage - 1)) / itemsPerPage;
    }
    if (typeof rawSize === 'number') {
      if (rawSize > 0 && rawSize <= 1) return containerSize * rawSize; // fraction
      return rawSize; // pixels
    }
    if (typeof rawSize === 'string') {
      if (rawSize.endsWith('%')) {
        const p = parseFloat(rawSize.slice(0, -1));
        return containerSize * (isNaN(p) ? 1 : p / 100);
      }
      const num = parseFloat(rawSize);
      if (!isNaN(num)) {
        if (num > 0 && num <= 1) return containerSize * num;
        return num;
      }
    }
    return (containerSize - resolvedGap * (itemsPerPage - 1)) / itemsPerPage;
  }, [slideSize, breakpoint, containerSize, itemsPerPage, resolvedGap]);

  const handleLayout = useCallback((e: any) => {
    setContainerWidth(e.nativeEvent.layout.width);
    setContainerHeight(e.nativeEvent.layout.height);
  }, []);

  const goTo = useCallback((index: number) => {
    if (!carouselRef.current) return;
    if (totalItems === 0) return;
    const clamped = ((index % totalItems) + totalItems) % totalItems;
    const delta = clamped - currentIndex;
    if (delta === 0) return;
    // For looping choose shortest path if loop enabled
    let count = delta;
    if (loop) {
      const alt = delta > 0 ? delta - totalItems : delta + totalItems;
      if (Math.abs(alt) < Math.abs(count)) count = alt;
    }
    carouselRef.current.scrollTo({ count, animated: true });
  }, [carouselRef, totalItems, currentIndex, loop]);

  const goPrev = useCallback(() => {
    if (!carouselRef.current) return;
    carouselRef.current.prev();
  }, []);

  const goNext = useCallback(() => {
    if (!carouselRef.current) return;
    carouselRef.current.next();
  }, []);

  const totalPages = useMemo(() => totalItems, [totalItems]);

  // Page progress derived directly from absolute item progress
  const pageProgress = useDerivedValue(() => {
    return progress.value;
  }, []);

  const baseDotSize = useMemo(() => {
    switch (dotSize) {
      case 'sm': return 6;
      case 'lg': return 10;
      default: return 8;
    }
  }, [dotSize]);

  // Memoized render functions to prevent unnecessary re-renders
  const renderDots = useMemo(() => {
    if (!showDots || totalPages <= 1) return null;

    const dotsStyle = isVertical
      ? { flexDirection: 'column' as const, alignItems: 'center' as const, marginLeft: 12 }
      : {
        flexDirection: (isRTL ? 'row-reverse' : 'row') as 'row' | 'row-reverse',
        justifyContent: 'center' as const,
        marginTop: 12
      };

    return (
      <View style={dotsStyle}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <CarouselDot
            key={i}
            index={i}
            pageProgress={pageProgress}
            baseDotSize={baseDotSize}
            totalPages={totalPages}
            loop={loop}
            theme={theme}
            onPress={goTo}
            isVertical={isVertical}
          />
        ))}
      </View>
    );
  }, [showDots, totalPages, pageProgress, baseDotSize, loop, theme, goTo, isVertical, isRTL]);

  // Arrows
  const renderArrows = () => {
    if (!showArrows || totalItems <= 1) return null;

    if (isVertical) {
      return (
        <>
          <View style={{ position: 'absolute', top: 8, left: '50%', transform: [{ translateX: -20 }], zIndex: 10 }}>
            <Button
              size={arrowSize}
              variant="secondary"
              icon={<Icon name="chevron-up" size={arrowSize} />}
              onPress={goPrev}
              radius="full"
            />
          </View>
          <View style={{ position: 'absolute', bottom: 8, left: '50%', transform: [{ translateX: -20 }], zIndex: 10 }}>
            <Button
              size={arrowSize}
              variant="secondary"
              icon={<Icon name="chevron-down" size={arrowSize} />}
              onPress={goNext}
              radius="full"
            />
          </View>
        </>
      );
    }

    // Horizontal arrows - swap positions and icons in RTL
    return (
      <>
        <View style={{ position: 'absolute', top: '50%', ...(isRTL ? { right: 8 } : { left: 8 }), transform: [{ translateY: -20 }], zIndex: 10 }}>
          <Button
            size={arrowSize}
            variant="secondary"
            icon={<Icon name={isRTL ? 'chevron-right' : 'chevron-left'} size={arrowSize} />}
            onPress={goPrev}
            radius="full"
          />
        </View>
        <View style={{ position: 'absolute', top: '50%', ...(isRTL ? { left: 8 } : { right: 8 }), transform: [{ translateY: -20 }], zIndex: 10 }}>
          <Button
            size={arrowSize}
            variant="secondary"
            icon={<Icon name={isRTL ? 'chevron-left' : 'chevron-right'} size={arrowSize} />}
            onPress={goNext}
            radius="full"
          />
        </View>
      </>
    );
  };

  // Autoplay: if library autoPlay not sufficient for pause logic, we can just pass through for now.
  const enableAutoPlay = autoPlay && totalItems > 1;

  return (
    <View
      ref={containerRef}
      style={[
        {
          position: 'relative',
          ...(isVertical ? { flexDirection: 'row' } : {})
        },
        spacingStyles,
        style as ViewStyle
      ]}
      onLayout={handleLayout}
      {...otherProps}
    >
      <View style={{ flex: 1 }}>
        {itemSize > 0 && (
          <ReanimatedCarousel
            ref={carouselRef}
            width={isVertical ? containerWidth : itemSize}
            height={isVertical ? itemSize : height}
            style={isVertical ? { height: containerHeight } : { width: containerWidth }}
            vertical={isVertical}
            loop={loop}
            autoPlay={enableAutoPlay}
            autoPlayInterval={autoPlayInterval}
            data={itemsArray}
            pagingEnabled={snapToItem}
            windowSize={windowSize > 0 ? windowSize : undefined}
            // Performance optimizations
            overscrollEnabled={false}
            enabled={!reducedMotion}
            withAnimation={reducedMotion ?
              { type: 'timing', config: { duration: 100 } } :
              { type: 'spring', config: { damping: 60, stiffness: 150 } }
            }
            onProgressChange={(offset: number, absolute: number) => {
              // absolute may be undefined in some versions; fallback to offset
              const val = typeof absolute === 'number' ? absolute : offset;
              progress.value = val;
              const ci = ((Math.round(val) % totalItems) + totalItems) % totalItems;
              if (ci !== currentIndex) {
                setCurrentIndex(ci);
                onSlideChange?.(ci);
              }
            }}
            renderItem={({ item, index }) => (
              <View
                style={[
                  {
                    width: isVertical ? containerWidth : itemSize,
                    height: isVertical ? itemSize : height,
                    ...(isVertical
                      ? { marginBottom: index < itemsArray.length - 1 ? resolvedGap : 0 }
                      : { marginRight: index < itemsArray.length - 1 ? resolvedGap : 0 }
                    ),
                  },
                  itemStyle,
                ]}
                accessibilityLabel={`Carousel item ${index + 1} of ${totalItems}`}
              >
                {item as any}
              </View>
            )}
          />
        )}
      </View>
      {renderArrows()}
      {renderDots}
    </View>
  );
};

export default Carousel;
