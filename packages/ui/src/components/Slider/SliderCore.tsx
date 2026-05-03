import React, { useMemo, useCallback } from 'react';
import { View, type ViewStyle } from 'react-native';
import { Text } from '../Text';
import { Card } from '../Card';
import { mergeSlotProps } from '../../core/utils';
import type {
  SliderTick,
  SliderTrackProps,
  SliderThumbProps,
  SliderTicksProps,
  SliderLabelProps,
  SliderValueLabelProps,
  SliderVariant,
} from './types';

type VariantTrackStyle = {
  inactive: ViewStyle;
  active: ViewStyle;
  trackHeightMultiplier: number;
};

type VariantThumbStyle = {
  style: ViewStyle;
  sizeMultiplier: number;
};

// Per-variant track styling. `trackHeightMultiplier` lets variants scale the
// rendered track thickness without changing the layout/hit-target geometry.
const getVariantTrackStyle = (
  variant: SliderVariant,
  theme: any,
  disabled: boolean,
  resolvedTrackColor: string,
  resolvedActiveTrackColor: string,
): VariantTrackStyle => {
  switch (variant) {
    case 'filled':
      return {
        inactive: {
          backgroundColor: disabled
            ? theme.colors.gray[2]
            : (theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[2]),
        },
        active: { backgroundColor: resolvedActiveTrackColor },
        trackHeightMultiplier: 1.6,
      };
    case 'outline':
      return {
        inactive: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? theme.colors.gray[3] : resolvedTrackColor,
        },
        active: { backgroundColor: resolvedActiveTrackColor },
        trackHeightMultiplier: 1.4,
      };
    case 'minimal':
      return {
        inactive: { backgroundColor: resolvedTrackColor },
        active: { backgroundColor: resolvedActiveTrackColor },
        trackHeightMultiplier: 0.4,
      };
    case 'segmented':
      // Segmented hides the inactive track surface — the per-segment fills
      // (rendered by the consumer-facing layer via ticks) carry the visual.
      return {
        inactive: { backgroundColor: 'transparent' },
        active: { backgroundColor: 'transparent' },
        trackHeightMultiplier: 1,
      };
    case 'unstyled':
      return {
        inactive: { backgroundColor: 'transparent' },
        active: { backgroundColor: 'transparent' },
        trackHeightMultiplier: 1,
      };
    case 'default':
    default:
      return {
        inactive: { backgroundColor: resolvedTrackColor },
        active: { backgroundColor: resolvedActiveTrackColor },
        trackHeightMultiplier: 1,
      };
  }
};

/**
 * Per-variant thumb size multiplier (e.g. `minimal` shrinks the thumb).
 * Exposed separately so callers can pre-adjust `thumbSize` before computing
 * track/thumb positions, keeping the visual aligned with the track ends.
 */
export const getVariantThumbSizeMultiplier = (variant: SliderVariant = 'default'): number => {
  switch (variant) {
    case 'minimal': return 0.7;
    case 'segmented': return 0.9;
    case 'filled': return 1.1;
    default: return 1;
  }
};

const getVariantThumbStyle = (
  variant: SliderVariant,
  theme: any,
  disabled: boolean,
  resolvedThumbColor: string,
): VariantThumbStyle => {
  switch (variant) {
    case 'filled':
      return {
        style: {
          backgroundColor: resolvedThumbColor,
          borderWidth: 0,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
          elevation: 4,
        },
        sizeMultiplier: 1.1,
      };
    case 'outline':
      return {
        style: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#fff',
          borderWidth: 2,
          borderColor: disabled ? theme.colors.gray[4] : resolvedThumbColor,
          boxShadow: 'none',
          elevation: 0,
        },
        sizeMultiplier: 1,
      };
    case 'minimal':
      return {
        style: {
          backgroundColor: resolvedThumbColor,
          borderWidth: 0,
          boxShadow: 'none',
          elevation: 0,
        },
        sizeMultiplier: 0.7,
      };
    case 'segmented':
      return {
        style: {
          backgroundColor: resolvedThumbColor,
          borderWidth: 2,
          borderColor: '#fff',
          borderRadius: 4,
        },
        sizeMultiplier: 0.9,
      };
    case 'unstyled':
      return {
        style: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          boxShadow: 'none',
          elevation: 0,
        },
        sizeMultiplier: 1,
      };
    case 'default':
    default:
      return {
        style: {
          backgroundColor: resolvedThumbColor,
          borderWidth: 2,
          borderColor: '#fff',
        },
        sizeMultiplier: 1,
      };
  }
};

// Constants
export const SLIDER_CONSTANTS = {
  THUMB_SIZE: {
    sm: 16,
    md: 20,
    lg: 24,
  },
  TRACK_HEIGHT: {
    sm: 4,
    md: 6,
    lg: 8,
  },
  CONTAINER_HEIGHT: 40,
  CONTAINER_WIDTH: 300, // Default width for horizontal sliders
  LABEL_OFFSET: 8,
};

// Orientation-aware constants and utilities
export const getOrientationProps = (
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  containerSize?: number
) => {
  const isVertical = orientation === 'vertical';
  const defaultContainerSize = isVertical ? SLIDER_CONSTANTS.CONTAINER_WIDTH : SLIDER_CONSTANTS.CONTAINER_WIDTH;
  const actualContainerSize = containerSize || defaultContainerSize;

  return {
    isVertical,
    trackDimension: isVertical ? 'height' : 'width',
    thumbDimension: isVertical ? 'top' : 'left',
    crossDimension: isVertical ? 'width' : 'height',
    mainAxis: isVertical ? 'column' : 'row',
    crossAxis: isVertical ? 'row' : 'column',
    mainSize: isVertical ? 'height' : 'width',
    crossSize: isVertical ? 'width' : 'height',
    containerWidth: isVertical ? SLIDER_CONSTANTS.CONTAINER_HEIGHT : actualContainerSize,
    containerHeight: isVertical ? actualContainerSize : SLIDER_CONSTANTS.CONTAINER_HEIGHT,
    trackStart: isVertical ? 'top' : 'left',
    trackEnd: isVertical ? 'bottom' : 'right',
    thumbPosition: isVertical ? 'top' : 'left',
    crossPosition: isVertical ? 'left' : 'top',
  };
};

// Optimized utility functions with better performance
export const sliderUtils = {
  clamp: (value: number, min: number, max: number): number =>
    value < min ? min : value > max ? max : value,

  roundToStep: (value: number, step: number): number =>
    Math.round(value / step) * step,

  // Optimized closest tick finding using binary search when ticks are sorted
  roundToTicks: (value: number, ticks: SliderTick[]): number => {
    if (!ticks.length) return value;

    // For small arrays, linear search is faster
    if (ticks.length <= 8) {
      let closestTick = ticks[0];
      let minDistance = Math.abs(value - closestTick.value);

      for (let i = 1; i < ticks.length; i++) {
        const distance = Math.abs(value - ticks[i].value);
        if (distance < minDistance) {
          minDistance = distance;
          closestTick = ticks[i];
        }
      }
      return closestTick.value;
    }

    // For larger arrays, assume sorted and use binary search
    let left = 0;
    let right = ticks.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (ticks[mid].value < value) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Check closest between left-1 and left
    if (left > 0) {
      const leftDist = Math.abs(value - ticks[left - 1].value);
      const rightDist = Math.abs(value - ticks[left].value);
      return leftDist <= rightDist ? ticks[left - 1].value : ticks[left].value;
    }

    return ticks[left].value;
  },

  valueToPercentage: (value: number, min: number, max: number): number =>
    ((value - min) / (max - min)) * 100,

  percentageToValue: (percentage: number, min: number, max: number): number =>
    min + (percentage / 100) * (max - min),

  positionToPercentage: (position: number, trackLength: number): number =>
    (position / trackLength) * 100,
};

// Shared tick generation logic with memoization
export const useSliderTicks = (
  ticks: SliderTick[] | undefined,
  showTicks: boolean,
  min: number,
  max: number,
  step: number,
  trackLength: number,
  isRange: boolean = false,
  rangeValues?: [number, number]
) => {
  return useMemo(() => {
    // Use custom ticks if provided
    if (ticks && ticks.length > 0) {
      return ticks.map(tick => {
        const percentage = sliderUtils.valueToPercentage(tick.value, min, max);
        const position = (percentage / 100) * trackLength;

        let isActive: boolean;
        if (isRange && rangeValues) {
          isActive = tick.value >= rangeValues[0] && tick.value <= rangeValues[1];
        } else {
          isActive = !isRange; // Will be determined by individual slider
        }

        return {
          ...tick,
          position,
          isActive,
        };
      });
    }

    // Generate automatic ticks based on step
    if (!showTicks) return [];

    const autoTicks = [];
    for (let i = min; i <= max; i += step) {
      const percentage = sliderUtils.valueToPercentage(i, min, max);
      const position = (percentage / 100) * trackLength;

      let isActive: boolean;
      if (isRange && rangeValues) {
        isActive = i >= rangeValues[0] && i <= rangeValues[1];
      } else {
        isActive = false; // Will be determined by individual slider
      }

      autoTicks.push({
        value: i,
        position,
        isActive,
      });
    }

    return autoTicks;
  }, [ticks, showTicks, min, max, step, trackLength, isRange, rangeValues]);
};

// Shared value processing logic
export const useSliderValue = (
  value: number | [number, number],
  min: number,
  max: number,
  step: number,
  restrictToTicks: boolean,
  ticks: SliderTick[] | undefined,
  isRange: boolean = false
) => {
  return useMemo(() => {
    if (isRange && Array.isArray(value)) {
      let [minValue, maxValue] = [
        sliderUtils.clamp(Math.min(value[0], value[1]), min, max),
        sliderUtils.clamp(Math.max(value[0], value[1]), min, max)
      ];

      if (restrictToTicks && ticks && ticks.length > 0) {
        minValue = sliderUtils.roundToTicks(minValue, ticks);
        maxValue = sliderUtils.roundToTicks(maxValue, ticks);
      } else {
        minValue = sliderUtils.roundToStep(minValue, step);
        maxValue = sliderUtils.roundToStep(maxValue, step);
      }

      return [minValue, maxValue] as [number, number];
    } else {
      let clampedValue = sliderUtils.clamp(value as number, min, max);

      if (restrictToTicks && ticks && ticks.length > 0) {
        clampedValue = sliderUtils.roundToTicks(clampedValue, ticks);
      } else {
        clampedValue = sliderUtils.roundToStep(clampedValue, step);
      }

      return clampedValue;
    }
  }, [value, min, max, step, restrictToTicks, ticks, isRange]);
};

// Shared gesture calculation logic
export const useSliderGesture = (
  min: number,
  max: number,
  step: number,
  restrictToTicks: boolean,
  ticks: SliderTick[] | undefined,
  disabled: boolean
) => {
  const calculateNewValue = useCallback((position: number, trackLength: number): number => {
    const percentage = sliderUtils.positionToPercentage(position, trackLength);
    let newValue = sliderUtils.percentageToValue(percentage, min, max);

    if (restrictToTicks && ticks && ticks.length > 0) {
      newValue = sliderUtils.roundToTicks(newValue, ticks);
    } else {
      newValue = sliderUtils.roundToStep(newValue, step);
    }

    return sliderUtils.clamp(newValue, min, max);
  }, [min, max, step, restrictToTicks, ticks]);

  return { calculateNewValue };
};

export const SliderTrack: React.FC<SliderTrackProps> = ({
  disabled,
  theme,
  size,
  orientation,
  activeWidth = 0,
  activeLeft,
  isRange = false,
  trackColor,
  activeTrackColor,
  trackStyle,
  activeTrackStyle,
  trackHeight,
  thumbSize,
  variant = 'default',
}) => {
  const orientationProps = getOrientationProps(orientation);
  const resolvedThumbSize = thumbSize ?? SLIDER_CONSTANTS.THUMB_SIZE[size];
  const baseTrackHeight = trackHeight ?? SLIDER_CONSTANTS.TRACK_HEIGHT[size];
  const resolvedActiveLeft = activeLeft ?? (resolvedThumbSize / 2);

  const fallbackTrack = disabled && !trackColor ? theme.colors.gray[2] : (trackColor ?? theme.colors.gray[3]);
  const fallbackActive = disabled && !activeTrackColor ? theme.colors.gray[4] : (activeTrackColor ?? theme.colors.primary[5]);
  const variantStyle = getVariantTrackStyle(variant, theme, disabled, fallbackTrack, fallbackActive);
  const resolvedTrackHeight = Math.max(1, Math.round(baseTrackHeight * variantStyle.trackHeightMultiplier));
  const trackBorderRadius = variant === 'segmented' ? 0 : resolvedTrackHeight / 2;

  const inactiveTrackBaseStyle = {
    position: 'absolute' as const,
    borderRadius: trackBorderRadius,
    ...variantStyle.inactive,
  };

  const activeTrackBaseStyle = {
    position: 'absolute' as const,
    borderRadius: trackBorderRadius,
    ...variantStyle.active,
  };

  if (orientationProps.isVertical) {
    return (
      <>
        {/* Background track */}
        <View
          style={[
            {
              ...inactiveTrackBaseStyle,
              top: resolvedThumbSize / 2,
              bottom: resolvedThumbSize / 2,
              width: resolvedTrackHeight,
              left: (resolvedThumbSize - resolvedTrackHeight) / 2,
            },
            trackStyle,
          ]}
        />

        {/* Active track - for vertical sliders */}
        {activeWidth > 0 && (
          <View
            style={[
              {
                ...activeTrackBaseStyle,
                ...(isRange ? {
                  top: activeLeft ?? resolvedActiveLeft,
                  height: activeWidth,
                } : {
                  bottom: resolvedThumbSize / 2,
                  height: activeWidth,
                }),
                width: resolvedTrackHeight,
                left: (resolvedThumbSize - resolvedTrackHeight) / 2,
              },
              activeTrackStyle,
            ]}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* Background track */}
      <View
        style={[
          {
            ...inactiveTrackBaseStyle,
            left: resolvedThumbSize / 2,
            right: resolvedThumbSize / 2,
            height: resolvedTrackHeight,
            top: (SLIDER_CONSTANTS.CONTAINER_HEIGHT - resolvedTrackHeight) / 2,
          },
          trackStyle,
        ]}
      />

      {/* Active track */}
      {activeWidth > 0 && (
        <View
          style={[
            {
              ...activeTrackBaseStyle,
              left: activeLeft ?? resolvedActiveLeft,
              width: activeWidth,
              height: resolvedTrackHeight,
              top: (SLIDER_CONSTANTS.CONTAINER_HEIGHT - resolvedTrackHeight) / 2,
            },
            activeTrackStyle,
          ]}
        />
      )}
    </>
  );
};


export const SliderTicks: React.FC<SliderTicksProps> = ({
  ticks,
  disabled,
  theme,
  size,
  orientation,
  keyPrefix = 'tick',
  trackHeight,
  thumbSize,
  activeTickColor,
  tickColor,
  tickStyle,
  activeTickStyle,
  tickLabelProps,
}) => {
  const orientationProps = getOrientationProps(orientation);
  const resolvedThumbSize = thumbSize ?? SLIDER_CONSTANTS.THUMB_SIZE[size];
  const resolvedTrackHeight = trackHeight ?? SLIDER_CONSTANTS.TRACK_HEIGHT[size];
  const inactiveColor = disabled && !tickColor ? theme.colors.gray[2] : (tickColor ?? theme.colors.gray[4]);
  const activeColor = disabled && !activeTickColor ? theme.colors.gray[4] : (activeTickColor ?? theme.colors.primary[5]);

  // tick.style (per-tick override) wins over the global tickStyle / activeTickStyle.
  const tickOverride = (tick: { isActive: boolean; style?: any }) => [
    tick.isActive ? activeTickStyle : tickStyle,
    tick.style,
  ];

  if (orientationProps.isVertical) {
    return (
      <>
        {/* Tick marks */}
        {ticks.map((tick, index) => (
          <View
            key={`${keyPrefix}-${tick.value}-${index}`}
            style={[
              {
                position: 'absolute',
                top: resolvedThumbSize / 2 + tick.position,
                left: (resolvedThumbSize - resolvedTrackHeight) / 2 - 3,
                height: 2,
                width: resolvedTrackHeight + 6,
                backgroundColor: tick.isActive ? activeColor : inactiveColor,
                borderRadius: 1,
              },
              ...tickOverride(tick),
            ]}
          />
        ))}

        {/* Tick labels */}
        {ticks.map((tick, index) => (
          tick.label ? (
            <View
              key={`${keyPrefix}-label-${tick.value}-${index}`}
              style={{
                position: 'absolute',
                top: resolvedThumbSize / 2 + tick.position - 10,
                left: resolvedThumbSize + 8,
                height: 20,
                justifyContent: 'center',
              }}
            >
              <Text {...mergeSlotProps({ size: 'xs' as const }, tickLabelProps)}>
                {tick.label}
              </Text>
            </View>
          ) : null
        ))}
      </>
    );
  }

  return (
    <>
      {/* Tick marks */}
      {ticks.map((tick, index) => (
        <View
          key={`${keyPrefix}-${tick.value}-${index}`}
          style={[
            {
              position: 'absolute',
              left: resolvedThumbSize / 2 + tick.position,
              top: (SLIDER_CONSTANTS.CONTAINER_HEIGHT - resolvedTrackHeight) / 2 - 3,
              width: 2,
              height: resolvedTrackHeight + 6,
              backgroundColor: tick.isActive ? activeColor : inactiveColor,
              borderRadius: 1,
            },
            ...tickOverride(tick),
          ]}
        />
      ))}

      {/* Tick labels */}
      {ticks.map((tick, index) => (
        tick.label ? (
          <View
            key={`${keyPrefix}-label-${tick.value}-${index}`}
            style={{
              position: 'absolute',
              left: resolvedThumbSize / 2 + tick.position - 20,
              top: SLIDER_CONSTANTS.CONTAINER_HEIGHT + 8,
              width: 40,
              alignItems: 'center',
            }}
          >
            <Text
              {...mergeSlotProps(
                { size: 'xs' as const, style: { textAlign: 'center' as const } },
                tickLabelProps
              )}
            >
              {tick.label}
            </Text>
          </View>
        ) : null
      ))}
    </>
  );
};

export const SliderThumb: React.FC<SliderThumbProps> = ({
  position,
  disabled,
  theme,
  size,
  orientation,
  isDragging,
  zIndex = 1,
  panHandlers,
  thumbColor,
  thumbStyle,
  thumbSize,
  variant = 'default',
}) => {
  const orientationProps = getOrientationProps(orientation);
  // Caller is expected to have already applied the variant size multiplier
  // (see getVariantThumbSizeMultiplier) so position math stays consistent.
  const resolvedThumbSize = thumbSize ?? SLIDER_CONSTANTS.THUMB_SIZE[size];
  const resolvedThumbColor = disabled && !thumbColor ? theme.colors.gray[4] : (thumbColor ?? theme.colors.primary[5]);
  const variantStyle = getVariantThumbStyle(variant, theme, disabled, resolvedThumbColor);

  // Variant overrides like `borderRadius` (segmented) win over the default circle.
  const baseStyle: ViewStyle = {
    position: 'absolute' as const,
    width: resolvedThumbSize,
    height: resolvedThumbSize,
    borderRadius: resolvedThumbSize / 2,
    borderWidth: 2,
    borderColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
    transform: isDragging ? [{ scale: 1.1 }] : [{ scale: 1 }],
    zIndex,
    ...variantStyle.style,
  };

  if (orientationProps.isVertical) {
    return (
      <View
        style={[
          baseStyle,
          {
            top: position,
            left: 0,
          },
          thumbStyle,
        ]}
        {...panHandlers}
      />
    );
  }

  return (
    <View
      style={[
        baseStyle,
        {
          left: position,
          top: (SLIDER_CONSTANTS.CONTAINER_HEIGHT - resolvedThumbSize) / 2,
        },
        thumbStyle,
      ]}
      {...panHandlers}
    />
  );
};


export const SliderLabel: React.FC<SliderLabelProps> = ({ label }) => (
  <View style={{ marginBottom: 8 }}>
    {typeof label === 'string' ? (
      <Text size="sm" weight="medium">{label}</Text>
    ) : (
      label
    )}
  </View>
);

export const SliderValueLabel: React.FC<SliderValueLabelProps> = ({
  value,
  position,
  size,
  orientation,
  isCard = false,
  thumbSize,
  placement,
  offset,
  containerStyle,
  textProps,
}) => {
  const orientationProps = getOrientationProps(orientation);
  const resolvedThumbSize = thumbSize ?? SLIDER_CONSTANTS.THUMB_SIZE[size];

  // round number to 2 decimal places for display
  const displayValue = typeof value === 'number' ? value.toFixed(2) : value;

  // For horizontal sliders the value label is centered inside a 100px-wide
  // wrapper, so the Card needs `margin: auto` and the Text needs `textAlign: center`.
  // Vertical layouts anchor by edge, so they skip those defaults.
  const renderContent = (centered: boolean) => {
    const cardStyle = centered
      ? [{ margin: 'auto' as const }, containerStyle]
      : containerStyle;
    const textBase = {
      size: 'sm' as const,
      style: centered ? { textAlign: 'center' as const } : undefined,
    };

    if (isCard) {
      return (
        <Card style={cardStyle} p="xs" variant="filled" shadow={centered ? 'md' : undefined}>
          <Text {...mergeSlotProps(textBase, textProps)}>{displayValue}</Text>
        </Card>
      );
    }
    return <Text {...mergeSlotProps(textBase, textProps)}>{displayValue}</Text>;
  };

  if (orientationProps.isVertical) {
    // Vertical placements: 'left' (default) or 'right' of the thumb
    const verticalPlacement = placement === 'right' ? 'right' : 'left';
    const verticalOffset = offset ?? 16;
    const lateralDistance = resolvedThumbSize + verticalOffset;

    const positionStyle: ViewStyle = verticalPlacement === 'right'
      ? { left: lateralDistance }
      : { right: lateralDistance };

    return (
      <View
        style={[
          {
            position: 'absolute',
            top: position + (resolvedThumbSize / 2) - 10,
            height: 20,
            justifyContent: 'center',
            alignItems: verticalPlacement === 'right' ? 'flex-start' : 'flex-end',
          },
          positionStyle,
        ]}
      >
        {renderContent(false)}
      </View>
    );
  }

  // Horizontal placements: 'top' (default, above the thumb) or 'bottom' (below)
  const horizontalPlacement = placement === 'bottom' ? 'bottom' : 'top';
  const horizontalOffset = offset ?? 6;

  const verticalAnchor: ViewStyle = horizontalPlacement === 'bottom'
    ? { top: SLIDER_CONSTANTS.CONTAINER_HEIGHT - horizontalOffset }
    : { bottom: SLIDER_CONSTANTS.CONTAINER_HEIGHT - horizontalOffset };

  return (
    <View
      style={[
        {
          position: 'absolute',
          left: position + (resolvedThumbSize / 2) - 50,
          width: 100,
          alignItems: 'center',
        },
        verticalAnchor,
      ]}
    >
      {renderContent(true)}
    </View>
  );
};
