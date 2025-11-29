import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { View, PanResponder, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { resolveComponentSize, type ComponentSize } from '../../core/theme/componentSize';
import { factory } from '../../core/factory';
import type { SliderProps, RangeSliderProps, SliderTick } from './types';
import {
  SLIDER_CONSTANTS,
  getOrientationProps,
  sliderUtils,
  useSliderTicks,
  useSliderValue,
  useSliderGesture,
  SliderTrack,
  SliderTicks,
  SliderThumb,
  SliderLabel,
  SliderValueLabel,
} from './SliderCore';

const SLIDER_SIZE_SCALE: Partial<Record<ComponentSize, 'sm' | 'md' | 'lg'>> = {
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
  '2xl': 'lg',
  '3xl': 'lg',
};

const resolvePaletteColor = (themeColors: Record<string, string[]>, scheme?: SliderProps['colorScheme']) => {
  if (!scheme || typeof scheme !== 'string') {
    return undefined;
  }

  const palette = themeColors[scheme];
  if (Array.isArray(palette)) {
    return palette;
  }

  return undefined;
};

const resolveSliderColors = (
  theme: ReturnType<typeof useTheme>,
  {
    colorScheme,
    trackColor,
    activeTrackColor,
    thumbColor,
    tickColor,
    activeTickColor,
  }: Pick<SliderProps, 'colorScheme' | 'trackColor' | 'activeTrackColor' | 'thumbColor' | 'tickColor' | 'activeTickColor'>
) => {
  const palette = resolvePaletteColor(theme.colors as Record<string, string[]>, colorScheme);
  const schemeColor = palette?.[5]
    ?? (typeof colorScheme === 'string' ? colorScheme : undefined)
    ?? theme.colors.primary[5];

  const resolvedActiveTrack = activeTrackColor ?? schemeColor;
  const defaultTrackColor = theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.gray[3];
  const defaultTickColor = theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[4];

  return {
    trackColor: trackColor ?? defaultTrackColor,
    activeTrackColor: resolvedActiveTrack,
    thumbColor: thumbColor ?? resolvedActiveTrack,
    tickColor: tickColor ?? defaultTickColor,
    activeTickColor: activeTickColor ?? resolvedActiveTrack,
  };
};

// Optimized Single Slider Component
export const Slider = factory<{
  props: SliderProps;
  ref: View;
}>((props, ref) => {
  const {
    value,
    defaultValue = 0,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    size = 'md',
    orientation = 'horizontal',
    containerSize,
    fullWidth = true,
    label,
    valueLabel,
    valueLabelAlwaysOn = false,
    ticks,
    showTicks = false,
    restrictToTicks = false,
    trackColor,
    activeTrackColor,
    thumbColor,
    trackSize,
    thumbSize: thumbSizeProp,
    colorScheme = 'primary',
    trackStyle,
    activeTrackStyle,
    thumbStyle,
    tickColor,
    activeTickColor,
    style,
    ...spacingProps
  } = props;

  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  // Uncontrolled internal value
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<number>(value ?? defaultValue);
  // Keep internal in sync when controlled value changes
  useEffect(() => {
    if (isControlled && value !== internal && value !== undefined) {
      setInternal(value);
    }
  }, [value, isControlled, internal]);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<View>(null);

  // Track actual container dimensions when fullWidth is enabled
  const [actualContainerSize, setActualContainerSize] = useState<{ width: number, height: number } | null>(null);

  // Orientation and sizing (restrict size to supported values)
  const resolvedSliderSize = resolveComponentSize(size, SLIDER_SIZE_SCALE, {
    fallback: 'md',
    allowedSizes: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
  });
  const sliderSize: 'sm' | 'md' | 'lg' = typeof resolvedSliderSize === 'number'
    ? resolvedSliderSize <= 36
      ? 'sm'
      : resolvedSliderSize >= 52
        ? 'lg'
        : 'md'
    : (resolvedSliderSize ?? 'md');
  const orientationProps = getOrientationProps(orientation, containerSize);
  const thumbSize = thumbSizeProp ?? SLIDER_CONSTANTS.THUMB_SIZE[sliderSize];
  const trackHeight = trackSize ?? SLIDER_CONSTANTS.TRACK_HEIGHT[sliderSize];

  // Memoized processed value
  const clampedValue = useSliderValue(isControlled ? (value as number) : internal, min, max, step, restrictToTicks, ticks, false) as number;

  // Memoized value label handling
  const defaultValueFormatter = useCallback((val: number) => Math.round(val).toString(), []);

  const resolvedValueLabel = useMemo<((value: number) => string) | null>(() => {
    if (valueLabel === null) return null;
    if (valueLabel) return valueLabel;
    return defaultValueFormatter;
  }, [valueLabel, defaultValueFormatter]);

  const labelConfig = useMemo(() => ({
    shouldShow: !!resolvedValueLabel && (valueLabelAlwaysOn || isDragging || (Platform.OS === 'web' && isHovering)),
    formatter: resolvedValueLabel ?? defaultValueFormatter,
  }), [resolvedValueLabel, valueLabelAlwaysOn, isDragging, isHovering, defaultValueFormatter]);

  const sliderColors = useMemo(() => resolveSliderColors(theme, {
    colorScheme,
    trackColor,
    activeTrackColor,
    thumbColor,
    tickColor,
    activeTickColor,
  }), [theme, colorScheme, trackColor, activeTrackColor, thumbColor, tickColor, activeTickColor]);

  // Memoized position calculations
  const positions = useMemo(() => {
    const percentage = sliderUtils.valueToPercentage(clampedValue, min, max);

    // Use actual container size when available (for fullWidth), otherwise use default
    const containerWidth = actualContainerSize?.width ?? orientationProps.containerWidth;
    const containerHeight = actualContainerSize?.height ?? orientationProps.containerHeight;
    const trackLength = (orientationProps.isVertical ? containerHeight : containerWidth) - thumbSize;
    let thumbPosition = (percentage / 100) * trackLength;

    // For vertical sliders, invert the thumb position so higher values appear at the top
    if (orientationProps.isVertical) {
      thumbPosition = trackLength - thumbPosition;
    }

    // Active length represents the progress - for vertical sliders this should extend from bottom to thumb
    const activeLength = (percentage / 100) * trackLength;

    return { percentage, trackLength, thumbPosition, activeLength };
  }, [clampedValue, min, max, orientationProps.containerWidth, orientationProps.containerHeight, orientationProps.isVertical, thumbSize, actualContainerSize]);

  // Memoized tick generation
  const allTicks = useSliderTicks(
    ticks,
    showTicks,
    min,
    max,
    step,
    positions.trackLength
  ).map(tick => ({
    ...tick,
    isActive: tick.value <= clampedValue // Update active state for single slider
  }));

  // Gesture handling
  const { calculateNewValue } = useSliderGesture(min, max, step, restrictToTicks, ticks, disabled);

  const handlePress = useCallback((evt: any) => {
    if (disabled) return;

    const { locationX, locationY } = evt.nativeEvent;
    const location = orientationProps.isVertical ? locationY : locationX;
    let relativePosition = location - (thumbSize / 2);

    // For vertical sliders, invert the position so top = max value, bottom = min value
    if (orientationProps.isVertical) {
      relativePosition = positions.trackLength - relativePosition;
    }

    const clampedPosition = sliderUtils.clamp(
      relativePosition,
      0,
      positions.trackLength
    );

    const newValue = calculateNewValue(clampedPosition, positions.trackLength);

    // Sanity check: make sure the value is reasonable
    if (newValue >= min && newValue <= max) {
      if (!isControlled) setInternal(newValue);
      onChange?.(newValue);
    }
  }, [disabled, positions.trackLength, calculateNewValue, onChange, thumbSize, orientationProps.isVertical, min, max]);

  // Memoized pan responder
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,

    onPanResponderGrant: (evt) => {
      setIsDragging(true);
      if (Platform.OS === 'web') {
        return document.body.style.userSelect = 'none';
      }

      // Store initial touch position for more reliable tracking
      const { locationX } = evt.nativeEvent;
      if (containerRef.current) {
        containerRef.current.setNativeProps({
          initialTouchX: locationX
        });
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      if (disabled) return;

      // Use moveX/moveY for more reliable touch tracking during drag
      const moveX = gestureState.moveX;
      const moveY = gestureState.moveY;
      const moveCoordinate = orientationProps.isVertical ? moveY : moveX;

      // Fallback to locationX/locationY if move coordinates are unreliable
      const { locationX, locationY } = evt.nativeEvent;
      const locationCoordinate = orientationProps.isVertical ? locationY : locationX;

      // Get container position and calculate relative position
      if (containerRef.current) {
        containerRef.current.measure((x, y, width, height, pageX, pageY) => {
          const containerStart = orientationProps.isVertical ? pageY : pageX;
          const containerLength = orientationProps.isVertical ? height : width;
          const actualTrackLength = containerLength - thumbSize;

          if (containerStart !== undefined && moveCoordinate > 0) {
            // Primary method: use move coordinate with container position
            let relativePosition = moveCoordinate - containerStart - (thumbSize / 2);

            // For vertical sliders, invert the position so top = max value, bottom = min value
            if (orientationProps.isVertical) {
              relativePosition = actualTrackLength - relativePosition;
            }

            const clampedPosition = sliderUtils.clamp(relativePosition, 0, actualTrackLength);
            const newValue = calculateNewValue(clampedPosition, actualTrackLength);

            // Sanity check: make sure the value is reasonable
            if (newValue >= min && newValue <= max) {
              if (!isControlled) setInternal(newValue);
              onChange?.(newValue);
            }
          } else if (locationCoordinate > 0) {
            // Fallback method: use location coordinate directly
            let relativePosition = locationCoordinate - (thumbSize / 2);

            // For vertical sliders, invert the position so top = max value, bottom = min value
            if (orientationProps.isVertical) {
              relativePosition = actualTrackLength - relativePosition;
            }

            const clampedRelativePosition = sliderUtils.clamp(
              relativePosition,
              0,
              actualTrackLength
            );
            const newValue = calculateNewValue(clampedRelativePosition, actualTrackLength);

            // Sanity check: make sure the value is reasonable
            if (newValue >= min && newValue <= max) {
              if (!isControlled) setInternal(newValue);
              onChange?.(newValue);
            }
          }
        });
      }
    },

    onPanResponderRelease: () => {
      setIsDragging(false);
      if (Platform.OS === 'web') {
        document.body.style.userSelect = '';
      }
    },

    onPanResponderTerminate: () => {
      setIsDragging(false);
      if (Platform.OS === 'web') {
        document.body.style.userSelect = '';
      }
    },
  }), [disabled, positions.trackLength, calculateNewValue, onChange, thumbSize, orientationProps.isVertical, min, max]);

  return (
    <View style={[{ flex: 1 }, style, spacingProps]}>
      {/* Input label */}
      {label && <SliderLabel label={label} />}

      <View
        ref={containerRef}
        style={{
          width: fullWidth && orientation === 'horizontal' ? '100%' : orientationProps.containerWidth,
          height: fullWidth && orientation === 'vertical' ? '100%' : orientationProps.containerHeight,
          justifyContent: 'center',
          position: 'relative',
          ...(Platform.OS === 'web' && orientation === 'vertical' ? { touchAction: 'none' as const } : null),
        }}
        onLayout={(event) => {
          // When fullWidth is enabled, track the actual container dimensions
          if (fullWidth) {
            const { width, height } = event.nativeEvent.layout;
            setActualContainerSize({ width, height });
          } else {
            // Reset to null when not using fullWidth
            setActualContainerSize(null);
          }
        }}
        onStartShouldSetResponder={() => !isDragging} // Only handle press when not dragging
        onResponderGrant={handlePress}
        {...(Platform.OS === 'web' && {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        })}
        {...panResponder.panHandlers}
      >
        {/* Track */}
        <SliderTrack
          disabled={disabled}
          theme={theme}
          size={sliderSize}
          orientation={orientation}
          activeWidth={positions.activeLength}
          trackColor={sliderColors.trackColor}
          activeTrackColor={sliderColors.activeTrackColor}
          trackStyle={trackStyle}
          activeTrackStyle={activeTrackStyle}
          trackHeight={trackHeight}
          thumbSize={thumbSize}
        />

        {/* Ticks */}
        <SliderTicks
          ticks={allTicks}
          disabled={disabled}
          theme={theme}
          size={sliderSize}
          orientation={orientation}
          trackHeight={trackHeight}
          thumbSize={thumbSize}
          tickColor={sliderColors.tickColor}
          activeTickColor={sliderColors.activeTickColor}
        />

        {/* Thumb */}
        <SliderThumb
          position={positions.thumbPosition}
          disabled={disabled}
          theme={theme}
          size={sliderSize}
          orientation={orientation}
          isDragging={isDragging}
          thumbColor={sliderColors.thumbColor}
          thumbStyle={thumbStyle}
          thumbSize={thumbSize}
        />

        {/* Value label */}
        {labelConfig.shouldShow && (
          <SliderValueLabel
            value={labelConfig.formatter(clampedValue)}
            position={positions.thumbPosition}
            size={sliderSize}
            orientation={orientation}
            isCard={true}
            thumbSize={thumbSize}
          />
        )}
      </View>
    </View>
  );
});

// Optimized Range Slider Component
export const RangeSlider = factory<{
  props: RangeSliderProps;
  ref: View;
}>((props, ref) => {
  const {
    value = [0, 100],
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    size = 'md',
    orientation = 'horizontal',
    containerSize,
    fullWidth = true,
    label,
    valueLabel,
    valueLabelAlwaysOn = false,
    ticks,
    showTicks = false,
    restrictToTicks = false,
    pushOnOverlap = true,
    trackColor,
    activeTrackColor,
    thumbColor,
    trackSize,
    thumbSize: thumbSizeProp,
    colorScheme = 'primary',
    trackStyle,
    activeTrackStyle,
    thumbStyle,
    tickColor,
    activeTickColor,
    style,
    ...spacingProps
  } = props;

  const theme = useTheme();
  const [dragState, setDragState] = useState<{ thumb: 'min' | 'max' | null }>({ thumb: null });
  const [isHovering, setIsHovering] = useState(false);
  const rangeContainerRef = useRef<View>(null);

  // Track actual container dimensions when fullWidth is enabled
  const [actualRangeContainerSize, setActualRangeContainerSize] = useState<{ width: number, height: number } | null>(null);

  // Orientation and sizing (restrict size to supported values)
  const rangeResolvedSliderSize = resolveComponentSize(size, SLIDER_SIZE_SCALE, {
    fallback: 'md',
    allowedSizes: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
  });
  const sliderSize: 'sm' | 'md' | 'lg' = typeof rangeResolvedSliderSize === 'number'
    ? rangeResolvedSliderSize <= 36
      ? 'sm'
      : rangeResolvedSliderSize >= 52
        ? 'lg'
        : 'md'
    : (rangeResolvedSliderSize ?? 'md');
  const orientationProps = getOrientationProps(orientation, containerSize);
  const thumbSize = thumbSizeProp ?? SLIDER_CONSTANTS.THUMB_SIZE[sliderSize];
  const trackHeight = trackSize ?? SLIDER_CONSTANTS.TRACK_HEIGHT[sliderSize];
  const containerRef = useRef<View>(null);

  const sliderColors = useMemo(() => resolveSliderColors(theme, {
    colorScheme,
    trackColor,
    activeTrackColor,
    thumbColor,
    tickColor,
    activeTickColor,
  }), [theme, colorScheme, trackColor, activeTrackColor, thumbColor, tickColor, activeTickColor]);

  // Memoized processed values
  const [minValue, maxValue] = useSliderValue(value, min, max, step, restrictToTicks, ticks, true) as [number, number];

  // Memoized backward compatibility handling
  const defaultRangeFormatter = useCallback((val: number, _index?: number) => Math.round(val).toString(), []);

  const resolvedValueLabel = useMemo<((value: number, index: number) => string) | null>(() => {
    if (valueLabel === null) return null;
    if (valueLabel) return valueLabel;
    return defaultRangeFormatter;
  }, [valueLabel, defaultRangeFormatter]);

  const labelConfig = useMemo(() => ({
    shouldShow: !!resolvedValueLabel && (valueLabelAlwaysOn || dragState.thumb !== null || (Platform.OS === 'web' && isHovering)),
    formatter: resolvedValueLabel ?? defaultRangeFormatter,
  }), [resolvedValueLabel, valueLabelAlwaysOn, dragState.thumb, isHovering, defaultRangeFormatter]);


  // Memoized position calculations
  const positions = useMemo(() => {
    // Use actual container size when available (for fullWidth), otherwise use default
    const containerWidth = actualRangeContainerSize?.width ?? orientationProps.containerWidth;
    const containerHeight = actualRangeContainerSize?.height ?? orientationProps.containerHeight;
    const trackLength = (orientationProps.isVertical ? containerHeight : containerWidth) - thumbSize;
    const minPercentage = sliderUtils.valueToPercentage(minValue, min, max);
    const maxPercentage = sliderUtils.valueToPercentage(maxValue, min, max);
    let minThumbPosition = (minPercentage / 100) * trackLength;
    let maxThumbPosition = (maxPercentage / 100) * trackLength;

    // For vertical sliders, invert the thumb positions so higher values appear at the top
    if (orientationProps.isVertical) {
      minThumbPosition = trackLength - minThumbPosition;
      maxThumbPosition = trackLength - maxThumbPosition;
    }

    // Calculate active area - it should span between the two thumb positions
    const startPosition = Math.min(minThumbPosition, maxThumbPosition);
    const endPosition = Math.max(minThumbPosition, maxThumbPosition);
    const activeLength = Math.abs(endPosition - startPosition);

    return {
      trackLength,
      minThumbPosition,
      maxThumbPosition,
      activeWidth: activeLength,
      activeLeft: thumbSize / 2 + startPosition,
    };
  }, [minValue, maxValue, min, max, orientationProps.containerWidth, orientationProps.containerHeight, orientationProps.isVertical, thumbSize, actualRangeContainerSize]);

  // Memoized tick generation
  const allTicks = useSliderTicks(
    ticks,
    showTicks,
    min,
    max,
    step,
    positions.trackLength,
    true,
    [minValue, maxValue]
  );

  // Gesture handling
  const { calculateNewValue } = useSliderGesture(min, max, step, restrictToTicks, ticks, disabled);

  const handleTrackPress = useCallback((evt: any) => {
    if (disabled || dragState.thumb) return;

    const { locationX, locationY } = evt.nativeEvent;
    const location = orientationProps.isVertical ? locationY : locationX;
    let clickPosition = location - (thumbSize / 2);

    // For vertical sliders, invert the position so top = max value, bottom = min value
    if (orientationProps.isVertical) {
      clickPosition = positions.trackLength - clickPosition;
    }

    const clampedPosition = sliderUtils.clamp(
      clickPosition,
      0,
      positions.trackLength
    );
    const clickValue = calculateNewValue(clampedPosition, positions.trackLength);

    // Sanity check: make sure the value is reasonable
    if (clickValue < min || clickValue > max) return;

    // Determine which thumb to move based on distance
    const distanceToMin = Math.abs(clickValue - minValue);
    const distanceToMax = Math.abs(clickValue - maxValue);

    if (distanceToMin <= distanceToMax) {
      const newMinValue = Math.min(clickValue, maxValue);
      onChange?.([newMinValue, maxValue]);
    } else {
      const newMaxValue = Math.max(clickValue, minValue);
      onChange?.([minValue, newMaxValue]);
    }
  }, [disabled, dragState.thumb, positions.trackLength, calculateNewValue, minValue, maxValue, onChange, thumbSize, orientationProps.isVertical, min, max]);

  // Memoized pan responder factory
  const createThumbPanResponder = useCallback((thumbType: 'min' | 'max') => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,

      onPanResponderGrant: () => {
        setDragState({ thumb: thumbType });
        if (Platform.OS === 'web') {
          document.body.style.userSelect = 'none';
        }
        return true;
      },

      onPanResponderMove: (evt, gestureState) => {
        if (disabled) return;

        const moveX = gestureState.moveX;
        const moveY = gestureState.moveY;
        const moveCoordinate = orientationProps.isVertical ? moveY : moveX;
        const { locationX, locationY } = evt.nativeEvent;
        const locationCoordinate = orientationProps.isVertical ? locationY : locationX;

        if (rangeContainerRef.current) {
          rangeContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
            const containerStart = orientationProps.isVertical ? pageY : pageX;
            const containerLength = orientationProps.isVertical ? height : width;
            const actualTrackLength = containerLength - thumbSize;

            if (containerStart !== undefined && moveCoordinate > 0) {
              // Primary method: use move coordinate with container position
              let relativePosition = moveCoordinate - containerStart - (thumbSize / 2);

              // For vertical sliders, invert the position so top = max value, bottom = min value
              if (orientationProps.isVertical) {
                relativePosition = actualTrackLength - relativePosition;
              }

              const newPosition = sliderUtils.clamp(relativePosition, 0, actualTrackLength);
              const newValue = calculateNewValue(newPosition, actualTrackLength);

              if (thumbType === 'min') {
                let clampedValue = newValue;

                if (pushOnOverlap) {
                  // Default behavior: prevent overlap by clamping to max value
                  clampedValue = Math.min(newValue, maxValue);
                } else {
                  // Allow crossing: min thumb can go beyond max value
                  clampedValue = newValue;

                  // If min thumb moves beyond max, update both values
                  if (clampedValue > maxValue) {
                    // Sanity check
                    if (clampedValue >= min && clampedValue <= max && maxValue >= min && maxValue <= max) {
                      onChange?.([maxValue, clampedValue]);
                    }
                    return;
                  }
                }

                // Sanity check
                if (clampedValue >= min && clampedValue <= max) {
                  onChange?.([clampedValue, maxValue]);
                }
              } else {
                let clampedValue = newValue;

                if (pushOnOverlap) {
                  // Default behavior: prevent overlap by clamping to min value
                  clampedValue = Math.max(newValue, minValue);
                } else {
                  // Allow crossing: max thumb can go below min value
                  clampedValue = newValue;

                  // If max thumb moves below min, update both values
                  if (clampedValue < minValue) {
                    // Sanity check
                    if (clampedValue >= min && clampedValue <= max && minValue >= min && minValue <= max) {
                      onChange?.([clampedValue, minValue]);
                    }
                    return;
                  }
                }

                // Sanity check
                if (clampedValue >= min && clampedValue <= max) {
                  onChange?.([minValue, clampedValue]);
                }
              }
            } else if (locationCoordinate > 0) {
              // Fallback method: use location coordinate directly
              let fallbackPosition = locationCoordinate - (thumbSize / 2);

              // For vertical sliders, invert the position so top = max value, bottom = min value
              if (orientationProps.isVertical) {
                fallbackPosition = actualTrackLength - fallbackPosition;
              }

              const clampedFallbackPosition = sliderUtils.clamp(fallbackPosition, 0, actualTrackLength);
              const fallbackValue = calculateNewValue(clampedFallbackPosition, actualTrackLength);

              if (thumbType === 'min') {
                let clampedValue = fallbackValue;

                if (pushOnOverlap) {
                  // Default behavior: prevent overlap by clamping to max value
                  clampedValue = Math.min(fallbackValue, maxValue);
                } else {
                  // Allow crossing: min thumb can go beyond max value
                  clampedValue = fallbackValue;

                  // If min thumb moves beyond max, update both values
                  if (clampedValue > maxValue) {
                    if (clampedValue >= min && clampedValue <= max && maxValue >= min && maxValue <= max) {
                      onChange?.([maxValue, clampedValue]);
                    }
                    return;
                  }
                }

                if (clampedValue >= min && clampedValue <= max) {
                  onChange?.([clampedValue, maxValue]);
                }
              } else {
                let clampedValue = fallbackValue;

                if (pushOnOverlap) {
                  // Default behavior: prevent overlap by clamping to min value  
                  clampedValue = Math.max(fallbackValue, minValue);
                } else {
                  // Allow crossing: max thumb can go below min value
                  clampedValue = fallbackValue;

                  // If max thumb moves below min, update both values
                  if (clampedValue < minValue) {
                    if (clampedValue >= min && clampedValue <= max && minValue >= min && minValue <= max) {
                      onChange?.([clampedValue, minValue]);
                    }
                    return;
                  }
                }

                if (clampedValue >= min && clampedValue <= max) {
                  onChange?.([minValue, clampedValue]);
                }
              }
            }
          });
        }
      },

      onPanResponderRelease: () => {
        setDragState({ thumb: null });
        if (Platform.OS === 'web') {
          document.body.style.userSelect = '';
        }
      },

      onPanResponderTerminate: () => {
        setDragState({ thumb: null });
        if (Platform.OS === 'web') {
          document.body.style.userSelect = '';
        }
      },
    });
  }, [disabled, positions.trackLength, calculateNewValue, minValue, maxValue, onChange, thumbSize, orientationProps.isVertical, min, max, pushOnOverlap]);

  const minThumbPanResponder = useMemo(() => createThumbPanResponder('min'), [createThumbPanResponder]);
  const maxThumbPanResponder = useMemo(() => createThumbPanResponder('max'), [createThumbPanResponder]);

  const valueLabelSpacing = resolvedValueLabel ? 24 : 0;
  const containerSpacingStyle = orientationProps.isVertical
    ? { marginRight: valueLabelSpacing }
    : { marginBottom: valueLabelSpacing };

  return (
    <View style={[containerSpacingStyle, style, spacingProps]}>
      {/* Input label */}
      {label && <SliderLabel label={label} />}

      <View
        ref={rangeContainerRef}
        style={{
          width: fullWidth && orientation === 'horizontal' ? '100%' : orientationProps.containerWidth,
          height: fullWidth && orientation === 'vertical' ? '100%' : orientationProps.containerHeight,
          justifyContent: 'center',
          position: 'relative',
          ...(Platform.OS === 'web' && orientation === 'vertical' ? { touchAction: 'none' as const } : null),
        }}
        onLayout={(event) => {
          // When fullWidth is enabled, track the actual container dimensions
          if (fullWidth) {
            const { width, height } = event.nativeEvent.layout;
            setActualRangeContainerSize({ width, height });
          } else {
            // Reset to null when not using fullWidth
            setActualRangeContainerSize(null);
          }
        }}
        onStartShouldSetResponder={() => true}
        onResponderGrant={handleTrackPress}
        {...(Platform.OS === 'web' && {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        })}
        collapsable={false}
      >
        {/* Track */}
        <SliderTrack
          disabled={disabled}
          theme={theme}
          size={sliderSize}
          orientation={orientation}
          activeWidth={positions.activeWidth}
          activeLeft={positions.activeLeft}
          isRange={true}
          trackColor={sliderColors.trackColor}
          activeTrackColor={sliderColors.activeTrackColor}
          trackStyle={trackStyle}
          activeTrackStyle={activeTrackStyle}
          trackHeight={trackHeight}
          thumbSize={thumbSize}
        />

        {/* Ticks */}
        <SliderTicks
          ticks={allTicks}
          disabled={disabled}
          theme={theme}
          size={sliderSize}
          orientation={orientation}
          keyPrefix="range-tick"
          trackHeight={trackHeight}
          thumbSize={thumbSize}
          tickColor={sliderColors.tickColor}
          activeTickColor={sliderColors.activeTickColor}
        />

        {/* Min Thumb */}
        <SliderThumb
          position={positions.minThumbPosition}
          disabled={disabled}
          theme={theme}
          size={sliderSize}
          orientation={orientation}
          isDragging={dragState.thumb === 'min'}
          zIndex={dragState.thumb === 'min' ? 10 : 1}
          panHandlers={minThumbPanResponder.panHandlers}
          thumbColor={sliderColors.thumbColor}
          thumbStyle={thumbStyle}
          thumbSize={thumbSize}
        />

        {/* Max Thumb */}
        <SliderThumb
          position={positions.maxThumbPosition}
          disabled={disabled}
          theme={theme}
          size={sliderSize}
          orientation={orientation}
          isDragging={dragState.thumb === 'max'}
          zIndex={dragState.thumb === 'max' ? 10 : 2}
          panHandlers={maxThumbPanResponder.panHandlers}
          thumbColor={sliderColors.thumbColor}
          thumbStyle={thumbStyle}
          thumbSize={thumbSize}
        />

        {/* Value labels */}
        {labelConfig.shouldShow && (
          <>
            <SliderValueLabel
              value={labelConfig.formatter(minValue, 0)}
              position={positions.minThumbPosition}
              size={sliderSize}
              orientation={orientation}
              isCard={true}
              thumbSize={thumbSize}
            />
            <SliderValueLabel
              value={labelConfig.formatter(maxValue, 1)}
              position={positions.maxThumbPosition}
              size={sliderSize}
              orientation={orientation}
              isCard={true}
              thumbSize={thumbSize}
            />
          </>
        )}
      </View>
    </View>
  );
});