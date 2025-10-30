import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { Text } from '../Text';
import { Card } from '../Card';
import type {
  SliderTick,
  SliderTrackProps,
  SliderThumbProps,
  SliderTicksProps,
  SliderLabelProps,
  SliderValueLabelProps
} from './types';

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
  activeLeft = SLIDER_CONSTANTS.THUMB_SIZE[size] / 2,
  isRange = false
}) => {
  const orientationProps = getOrientationProps(orientation);
  const thumbSize = SLIDER_CONSTANTS.THUMB_SIZE[size];
  const trackHeight = SLIDER_CONSTANTS.TRACK_HEIGHT[size];

  const baseTrackStyle = {
    position: 'absolute' as const,
    backgroundColor: disabled ? theme.colors.gray[2] : theme.colors.gray[3],
    borderRadius: trackHeight / 2,
  };

  const activeTrackStyle = {
    position: 'absolute' as const,
    backgroundColor: disabled ? theme.colors.gray[4] : theme.colors.primary[5],
    borderRadius: trackHeight / 2,
  };

  if (orientationProps.isVertical) {
    return (
      <>
        {/* Background track */}
        <View
          style={{
            ...baseTrackStyle,
            top: thumbSize / 2,
            bottom: thumbSize / 2,
            width: trackHeight,
            left: (thumbSize - trackHeight) / 2,
          }}
        />

        {/* Active track - for vertical sliders */}
        {activeWidth > 0 && (
          <View
            style={{
              ...activeTrackStyle,
              // For range sliders, use activeLeft as top position; for single sliders, start from bottom
              ...(isRange ? {
                top: activeLeft,
                height: activeWidth,
              } : {
                bottom: thumbSize / 2,
                height: activeWidth,
              }),
              width: trackHeight,
              left: (thumbSize - trackHeight) / 2,
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* Background track */}
      <View
        style={{
          ...baseTrackStyle,
          left: thumbSize / 2,
          right: thumbSize / 2,
          height: trackHeight,
          top: (SLIDER_CONSTANTS.CONTAINER_HEIGHT - trackHeight) / 2,
        }}
      />

      {/* Active track */}
      {activeWidth > 0 && (
        <View
          style={{
            ...activeTrackStyle,
            left: activeLeft,
            width: activeWidth,
            height: trackHeight,
            top: (SLIDER_CONSTANTS.CONTAINER_HEIGHT - trackHeight) / 2,
          }}
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
  keyPrefix = 'tick'
}) => {
  const orientationProps = getOrientationProps(orientation);
  const thumbSize = SLIDER_CONSTANTS.THUMB_SIZE[size];
  const trackHeight = SLIDER_CONSTANTS.TRACK_HEIGHT[size];

  if (orientationProps.isVertical) {
    return (
      <>
        {/* Tick marks */}
        {ticks.map((tick, index) => (
          <View
            key={`${keyPrefix}-${tick.value}-${index}`}
            style={{
              position: 'absolute',
              top: thumbSize / 2 + tick.position,
              left: (thumbSize - trackHeight) / 2 - 3,
              height: 2,
              width: trackHeight + 6,
              backgroundColor: tick.isActive
                ? (disabled ? theme.colors.gray[4] : theme.colors.primary[5])
                : (disabled ? theme.colors.gray[2] : theme.colors.gray[4]),
              borderRadius: 1,
            }}
          />
        ))}

        {/* Tick labels */}
        {ticks.map((tick, index) => (
          tick.label ? (
            <View
              key={`${keyPrefix}-label-${tick.value}-${index}`}
              style={{
                position: 'absolute',
                top: thumbSize / 2 + tick.position - 10,
                left: thumbSize + 8,
                height: 20,
                justifyContent: 'center',
              }}
            >
              <Text size="xs">
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
          style={{
            position: 'absolute',
            left: thumbSize / 2 + tick.position,
            top: (SLIDER_CONSTANTS.CONTAINER_HEIGHT - trackHeight) / 2 - 3,
            width: 2,
            height: trackHeight + 6,
            backgroundColor: tick.isActive
              ? (disabled ? theme.colors.gray[4] : theme.colors.primary[5])
              : (disabled ? theme.colors.gray[2] : theme.colors.gray[4]),
            borderRadius: 1,
          }}
        />
      ))}

      {/* Tick labels */}
      {ticks.map((tick, index) => (
        tick.label ? (
          <View
            key={`${keyPrefix}-label-${tick.value}-${index}`}
            style={{
              position: 'absolute',
              left: thumbSize / 2 + tick.position - 20,
              top: SLIDER_CONSTANTS.CONTAINER_HEIGHT + 8,
              width: 40,
              alignItems: 'center',
            }}
          >
            <Text size="xs" style={{ textAlign: 'center' }}>
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
  panHandlers
}) => {
  const orientationProps = getOrientationProps(orientation);
  const thumbSize = SLIDER_CONSTANTS.THUMB_SIZE[size];

  const baseStyle = {
    position: 'absolute' as const,
    width: thumbSize,
    height: thumbSize,
    backgroundColor: disabled ? theme.colors.gray[4] : theme.colors.primary[5],
    borderRadius: thumbSize / 2,
    borderWidth: 2,
    borderColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
    transform: isDragging ? [{ scale: 1.1 }] : [{ scale: 1 }],
    zIndex,
  };

  if (orientationProps.isVertical) {
    return (
      <View
        style={{
          ...baseStyle,
          top: position,
          left: 0,
        }}
        {...panHandlers}
      />
    );
  }

  return (
    <View
      style={{
        ...baseStyle,
        left: position,
        top: (SLIDER_CONSTANTS.CONTAINER_HEIGHT - thumbSize) / 2,
      }}
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
  isCard = false
}) => {
  const orientationProps = getOrientationProps(orientation);
  const thumbSize = SLIDER_CONSTANTS.THUMB_SIZE[size];

  // round number to 2 decimal places for display
  const displayValue = typeof value === 'number' ? value.toFixed(2) : value;

  if (orientationProps.isVertical) {
    return (
      <View
        style={{
          position: 'absolute',
          top: position + (thumbSize / 2) - 10,
          right: thumbSize + 8,
          height: 20,
          justifyContent: 'center',
        }}
      >
        {isCard ? (
          <Card p="xs" variant="filled">
            <Text size="sm">
              {displayValue}
            </Text>
          </Card>
        ) : (
          <Text size="sm">
            {displayValue}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        left: position + (thumbSize / 2) - 50,
        bottom: SLIDER_CONSTANTS.CONTAINER_HEIGHT - 6, // Moved closer to thumb
        width: 100,
        alignItems: 'center',
      }}
    >
      {isCard ? (
        <Card style={{ margin: 'auto' }} p="xs" variant="filled" shadow="md">
          <Text size="sm" style={{ textAlign: 'center' }}>
            {displayValue}
          </Text>
        </Card>
      ) : (
        <Text size="sm" style={{ textAlign: 'center' }}>
          {displayValue}
        </Text>
      )}
    </View>
  );
};
