import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Pressable, ViewStyle, Platform } from 'react-native';

import { factory } from '../../core/factory';
import { SizeValue, getIconSize } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { RatingProps, RatingFactoryPayload } from './types';
import { Icon } from '../Icon'
import { Text } from '../Text';

function RatingBase(props: RatingProps, ref: React.Ref<View>) {
  const {
    value: controlledValue,
    defaultValue = 0,
    count = 5,
    readOnly = false,
    allowFraction = false,
    allowHalf = false, // Deprecated but kept for backward compatibility
    precision = allowFraction ? 0.1 : (allowHalf ? 0.5 : 1),
    size = 'md',
    color,
    emptyColor,
    hoverColor,
    onChange,
    onHover,
    showTooltip = false,
    character = '★',
    emptyCharacter = '☆',
    gap = 'xs',
    style,
    testID,
    accessibilityLabel,
    accessibilityHint,
    label,
    labelPosition = 'above',
    labelGap = 'xs',
    ...spacingProps
  } = props;

  const theme = useTheme();
  const { spacingProps: extractedSpacingProps } = extractSpacingProps(spacingProps);
  const spacingStyles = getSpacingStyles(extractedSpacingProps);

  // Determine if fractional ratings are enabled
  const fractionalEnabled = allowFraction || allowHalf;

  // Clamp precision to reasonable bounds
  const actualPrecision = Math.max(0.01, Math.min(1, precision));

  // State for uncontrolled component
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue! : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;

  // Helper function to round value to specified precision
  const roundToPrecision = useCallback((value: number) => {
    // Use parseFloat and toFixed to avoid floating-point precision issues
    const rounded = Math.round(value / actualPrecision) * actualPrecision;
    // Round to the number of decimal places based on precision
    const decimalPlaces = Math.max(0, -Math.floor(Math.log10(actualPrecision)));
    return parseFloat(rounded.toFixed(decimalPlaces));
  }, [actualPrecision]);

  // Helper function to calculate rating value based on position within a star
  const calculateRatingFromPosition = useCallback((starIndex: number, positionRatio: number) => {
    if (!fractionalEnabled) {
      return starIndex + 1;
    }

    const rawValue = starIndex + positionRatio;
    const clampedValue = Math.min(count, Math.max(0, rawValue));
    return roundToPrecision(clampedValue);
  }, [count, fractionalEnabled, roundToPrecision]);

  // Theme-based colors
  const filledColor = color || theme.colors.warning[5] || '#FFA500';
  const unfilledColor = emptyColor || theme.colors.gray[4] || '#D1D5DB';
  const highlightColor = hoverColor || theme.colors.warning[6] || '#FF8C00';

  // Size calculations
  const iconSize = typeof size === 'number' ? size : getIconSize(size);
  const gapSize = typeof gap === 'number' ? gap : getIconSize(gap) / 2;
  const labelGapSize = typeof labelGap === 'number' ? labelGap : getIconSize(labelGap) / 2;
  const labelNode = useMemo(() => {
    if (!label) return null;
    if (typeof label === 'string') {
      return (
        <Text variant="caption" colorVariant="secondary">
          {label}
        </Text>
      );
    }
    return label;
  }, [label, size, iconSize, filledColor]);

  const handlePress = useCallback((starIndex: number, positionRatio: number = 1) => {
    if (readOnly) return;

    const newValue = calculateRatingFromPosition(starIndex, positionRatio);

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  }, [readOnly, isControlled, onChange, calculateRatingFromPosition]);

  const handleHover = useCallback((starIndex: number, positionRatio: number = 1) => {
    if (readOnly || Platform.OS !== 'web') return;

    const newValue = calculateRatingFromPosition(starIndex, positionRatio);
    setHoverValue(newValue);
    onHover?.(newValue);
  }, [readOnly, onHover, calculateRatingFromPosition]);

  const handleHoverLeave = useCallback(() => {
    if (readOnly || Platform.OS !== 'web') return;
    setHoverValue(null);
  }, [readOnly]);

  const renderStar = useCallback((starIndex: number) => {
    const starValue = starIndex + 1;
    const fractionalPart = displayValue - starIndex;
    const isFilled = displayValue >= starValue;
    const isPartiallyFilled = fractionalEnabled && fractionalPart > 0 && fractionalPart < 1;
    const isHovered = hoverValue !== null && hoverValue >= starIndex + actualPrecision;

    const activeFillColor = hoverValue !== null ? highlightColor : filledColor;
    const starColor = isHovered ? activeFillColor : (isFilled || isPartiallyFilled ? activeFillColor : unfilledColor);

    const StarComponent = () => {
      if (typeof character === 'string' && typeof emptyCharacter === 'string') {
        // For fractional ratings, we need to render a partially filled star
        if (isPartiallyFilled) {
          return (
            <View style={{ position: 'relative' }}>
              {/* Empty star base */}
              <Icon
                name="star"
                size={iconSize}
                color={unfilledColor}
                variant="filled"
              />
              {/* Filled portion overlay */}
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: iconSize * fractionalPart,
                  height: iconSize,
                  overflow: 'hidden',
                }}
              >
                <Icon
                  name="star"
                  size={iconSize}
                  color={activeFillColor}
                  variant="filled"
                />
              </View>
            </View>
          );
        }

        // Regular star rendering
        return (
          <Icon
            name="star"
            size={iconSize}
            color={starColor}
            variant="filled"
          />
        );
      } else {
        // Use custom components
        const StarChar = isFilled || isPartiallyFilled ? character : emptyCharacter;
        if (React.isValidElement(StarChar)) {
          return React.cloneElement(StarChar as React.ReactElement<any>, {
            size: iconSize,
            color: starColor,
          });
        }
        return (
          <Icon
            name="star"
            size={iconSize}
            color={starColor}
          />
        );
      }
    };

    return (
      <View key={starIndex} style={{ marginRight: starIndex < count - 1 ? gapSize : 0 }}>
        <StarComponent />
      </View>
    );
  }, [
    displayValue,
    hoverValue,
    fractionalEnabled,
    actualPrecision,
    count,
    readOnly,
    iconSize,
    gapSize,
    filledColor,
    unfilledColor,
    highlightColor,
    character,
    emptyCharacter,
    roundToPrecision,
  ]);

  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, index) => renderStar(index));
  }, [count, renderStar]);

  const accessibilityProps = {
    accessibilityRole: (readOnly ? 'text' : 'adjustable') as any,
    accessibilityLabel: accessibilityLabel || `Rating: ${currentValue} out of ${count} stars`,
    accessibilityHint: accessibilityHint || (readOnly ? undefined : 'Double tap to adjust rating'),
    accessibilityValue: {
      min: 0,
      max: count,
      now: currentValue,
    },
  };

  const isVertical = labelPosition === 'above' || labelPosition === 'below';

  // Continuous pointer helpers across the entire row (including gaps)
  const totalWidth = useMemo(() => {
    return count * iconSize + (count - 1) * gapSize;
  }, [count, iconSize, gapSize]);

  // Web-only: container ref to compute clientX-relative position
  const containerRef = useRef<any>(null);
  const getOffsetXFromEventWeb = useCallback((e: any) => {
    try {
      const rect = containerRef.current?.getBoundingClientRect?.();
      const clientX = e?.clientX ?? e?.nativeEvent?.clientX ?? 0;
      if (rect && typeof clientX === 'number') {
        return clientX - rect.left;
      }
    } catch {
      console.warn('getOffsetXFromEventWeb failed, event or ref may be invalid');
    }
    return e?.nativeEvent?.locationX ?? 0;
  }, []);

  const valueFromOffsetX = useCallback((x: number, containerWidth?: number) => {
    const width = containerWidth && containerWidth > 0 ? containerWidth : totalWidth;
    const clampedX = Math.max(0, Math.min(width, x));
    const rawUnits = (clampedX / width) * count; // 0..count
    if (fractionalEnabled) {
      return roundToPrecision(rawUnits);
    }
    // Integer mode: map to 1..count
    const intVal = Math.ceil(rawUnits);
    return Math.min(count, Math.max(1, intVal));
  }, [totalWidth, count, fractionalEnabled, roundToPrecision]);

  const handlePointerMove = useCallback((x: number, width?: number) => {
    if (readOnly) return;
    const newVal = valueFromOffsetX(x, width);
    setHoverValue(newVal);
    onHover?.(newVal);
  }, [readOnly, valueFromOffsetX, onHover]);

  const commitAtOffsetX = useCallback((x: number, width?: number) => {
    if (readOnly) return;
    const newVal = valueFromOffsetX(x, width);
    if (!isControlled) setInternalValue(newVal);
    onChange?.(newVal);
  }, [readOnly, valueFromOffsetX, isControlled, onChange]);

  return (
    <View
      ref={ref}
      style={[
        {
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: isVertical ? 'flex-start' : 'center',
        },
        spacingStyles,
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {labelNode && (labelPosition === 'left' || labelPosition === 'above') && (
        <View style={{ marginRight: !isVertical && labelPosition === 'left' ? labelGapSize : 0, marginBottom: isVertical && labelPosition === 'above' ? labelGapSize : 0 }}>
          {labelNode}
        </View>
      )}
      <View
        ref={containerRef}
        style={{ flexDirection: 'row', position: 'relative' }}
        // Touch/gesture handling (mobile + web)
        onStartShouldSetResponder={() => !readOnly}
        onResponderGrant={(e: any) => {
          const x = e.nativeEvent?.locationX ?? 0;
          handlePointerMove(x);
        }}
        onResponderMove={(e: any) => {
          const x = e.nativeEvent?.locationX ?? 0;
          handlePointerMove(x);
        }}
        onResponderRelease={(e: any) => {
          const x = e.nativeEvent?.locationX ?? 0;
          commitAtOffsetX(x);
          setHoverValue(null);
        }}
        {...(Platform.OS === 'web' && {
          onMouseMove: (e: any) => handlePointerMove(getOffsetXFromEventWeb(e), containerRef.current?.getBoundingClientRect?.().width),
          onMouseDown: (e: any) => handlePointerMove(getOffsetXFromEventWeb(e), containerRef.current?.getBoundingClientRect?.().width),
          onMouseUp: (e: any) => {
            const rect = containerRef.current?.getBoundingClientRect?.();
            const x = getOffsetXFromEventWeb(e);
            commitAtOffsetX(x, rect?.width);
            setHoverValue(null);
          },
          onMouseLeave: () => setHoverValue(null),
        })}
      >
        {stars}
      </View>
      {labelNode && (labelPosition === 'right' || labelPosition === 'below') && (
        <View style={{ marginLeft: !isVertical && labelPosition === 'right' ? labelGapSize : 0, marginTop: isVertical && labelPosition === 'below' ? labelGapSize : 0 }}>
          {labelNode}
        </View>
      )}
    </View>
  );
}

export const Rating = factory<RatingFactoryPayload>(RatingBase);

Rating.displayName = 'Rating';
