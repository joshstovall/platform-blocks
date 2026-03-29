import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Platform, PanResponder, GestureResponderHandlers } from 'react-native';

import { factory } from '../../core/factory';
import { SizeValue, getIconSize } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { useDisclaimer, extractDisclaimerProps } from '../_internal/Disclaimer';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { Tooltip } from '../Tooltip';
import { RatingProps, RatingFactoryPayload } from './types';

function RatingBase(rawProps: RatingProps, ref: React.Ref<View>) {
  const { disclaimerProps: disclaimerData, otherProps: propsAfterDisclaimer } = extractDisclaimerProps(rawProps);
  const { spacingProps, otherProps: props } = extractSpacingProps(propsAfterDisclaimer as RatingProps);
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
  } = props as RatingProps;

  const theme = useTheme();
  const spacingStyles = getSpacingStyles(spacingProps);
  const renderDisclaimer = useDisclaimer(disclaimerData.disclaimer, disclaimerData.disclaimerProps);

  const fractionalEnabled = allowFraction || allowHalf;
  const actualPrecision = Math.max(0.01, Math.min(1, precision));

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerMetricsRef = useRef<{ width: number; left: number }>({ width: 0, left: 0 });
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue! : internalValue;
  const displayValue = hoverValue ?? currentValue;

  const roundToPrecision = useCallback((value: number) => {
    const rounded = Math.round(value / actualPrecision) * actualPrecision;
    const decimalPlaces = Math.max(0, -Math.floor(Math.log10(actualPrecision)));
    return parseFloat(rounded.toFixed(decimalPlaces));
  }, [actualPrecision]);

  const calculateRatingFromPosition = useCallback((starIndex: number, positionRatio: number) => {
    if (!fractionalEnabled) {
      return starIndex + 1;
    }

    const rawValue = starIndex + positionRatio;
    const clampedValue = Math.min(count, Math.max(0, rawValue));
    return roundToPrecision(clampedValue);
  }, [count, fractionalEnabled, roundToPrecision]);

  const filledColor = color || theme.colors.warning[5] || '#FFA500';
  const unfilledColor = emptyColor || theme.colors.gray[4] || '#D1D5DB';
  const highlightColor = hoverColor || theme.colors.warning[6] || '#FF8C00';

  const iconSize = typeof size === 'number' ? size : getIconSize(size as SizeValue);
  const gapSize = typeof gap === 'number' ? gap : getIconSize(gap as SizeValue) / 2;
  const labelGapSize = typeof labelGap === 'number' ? labelGap : getIconSize(labelGap as SizeValue) / 2;

  const labelNode = useMemo(() => {
    if (!label) return null;
    if (typeof label === 'string') {
      return (
        <Text variant="small" colorVariant="secondary">
          {label}
        </Text>
      );
    }
    return label;
  }, [label]);

  const handleHoverLeave = useCallback(() => {
    if (Platform.OS !== 'web') return;
    setHoverValue(null);
    setTooltipIndex(null);
    if (!readOnly) {
      onHover?.(currentValue);
    }
  }, [onHover, currentValue, readOnly]);

  const tooltipDecimalPlaces = useMemo(() => {
    if (!fractionalEnabled) return 0;

    let decimals = 0;
    let precisionCandidate = actualPrecision;
    const maxIterations = 6;

    while (precisionCandidate < 1 && decimals < maxIterations) {
      precisionCandidate *= 10;
      decimals += 1;

      if (Math.abs(Math.round(precisionCandidate) - precisionCandidate) < 1e-6) {
        break;
      }
    }

    return decimals;
  }, [fractionalEnabled, actualPrecision]);

  const tooltipNumberFormatter = useMemo(() => {
    if (!showTooltip || !fractionalEnabled) {
      return null;
    }

    const decimals = Math.min(tooltipDecimalPlaces, 6);

    try {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch (_error) {
      return null;
    }
  }, [showTooltip, fractionalEnabled, tooltipDecimalPlaces]);

  const tooltipValue = useMemo(() => {
    if (!showTooltip) return null;
    if (hoverValue !== null) return hoverValue;
    if (tooltipIndex !== null) return currentValue;
    return null;
  }, [showTooltip, hoverValue, tooltipIndex, currentValue]);

  const tooltipLabel = useMemo(() => {
    if (!showTooltip || tooltipValue === null) {
      return '';
    }

    const clampedValue = Math.max(0, Math.min(tooltipValue, count));
    if (!fractionalEnabled) {
      const integerValue = Math.round(clampedValue);
      return `${integerValue} / ${count}`;
    }

    const normalizedValue = roundToPrecision(clampedValue);
    const decimals = Math.min(tooltipDecimalPlaces, 6);
    const formattedValue = tooltipNumberFormatter
      ? tooltipNumberFormatter.format(normalizedValue)
      : normalizedValue.toFixed(decimals);

    return `${formattedValue} / ${count}`;
  }, [showTooltip, tooltipValue, fractionalEnabled, tooltipDecimalPlaces, tooltipNumberFormatter, count, roundToPrecision]);

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
        if (isPartiallyFilled) {
          return (
            <View style={{ position: 'relative' }}>
              <Icon
                name="star"
                size={iconSize}
                color={unfilledColor}
                variant="filled"
              />
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

        return (
          <Icon
            name="star"
            size={iconSize}
            color={starColor}
            variant="filled"
          />
        );
      }

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
    };

    const baseStar = <StarComponent />;

    const starWithTooltip = showTooltip ? (
      <Tooltip
        label={tooltipLabel}
        position="top"
        opened={tooltipIndex === starIndex && tooltipLabel.length > 0}
        events={{ hover: false, focus: false, touch: false }}
      >
        {baseStar}
      </Tooltip>
    ) : baseStar;

    return (
      <View key={starIndex} style={{ marginRight: starIndex < count - 1 ? gapSize : 0 }}>
        {starWithTooltip}
      </View>
    );
  }, [
    displayValue,
    fractionalEnabled,
    hoverValue,
    actualPrecision,
    highlightColor,
    filledColor,
    unfilledColor,
    character,
    emptyCharacter,
    iconSize,
    gapSize,
    count,
    showTooltip,
    tooltipIndex,
    tooltipLabel,
  ]);

  const stars = useMemo(() => Array.from({ length: count }, (_, index) => renderStar(index)), [count, renderStar]);

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

  const totalWidth = useMemo(() => count * iconSize + (count - 1) * gapSize, [count, iconSize, gapSize]);

  const containerRef = useRef<any>(null);

  const getOffsetXFromEventWeb = useCallback((e: any) => {
    const nativeEvent = e?.nativeEvent ?? e;
    const rect = containerRef.current?.getBoundingClientRect?.();

    const clientXCandidate = e?.clientX
      ?? nativeEvent?.clientX
      ?? nativeEvent?.pageX
      ?? nativeEvent?.changedTouches?.[0]?.clientX
      ?? nativeEvent?.touches?.[0]?.clientX;

    if (rect && typeof clientXCandidate === 'number' && !Number.isNaN(clientXCandidate)) {
      return clientXCandidate - rect.left;
    }

    const offsetX = nativeEvent?.offsetX;
    if (typeof offsetX === 'number' && !Number.isNaN(offsetX)) {
      return offsetX;
    }

    const locationX = nativeEvent?.locationX;
    if (typeof locationX === 'number' && !Number.isNaN(locationX)) {
      return locationX;
    }

    return 0;
  }, []);

  const resolveValueDetails = useCallback((x: number, widthOverride?: number) => {
    const width = widthOverride && widthOverride > 0 ? widthOverride : totalWidth;
    const clampedX = Math.max(0, Math.min(width, x));
    const rawUnits = width > 0 ? (clampedX / width) * count : 0;

    const ratingValue = fractionalEnabled
      ? roundToPrecision(rawUnits)
      : Math.min(count, Math.max(1, Math.ceil(rawUnits)));

    if (__DEV__) {
      console.log('[Rating] resolveValueDetails', { x, widthOverride, resolvedWidth: width, clampedX, rawUnits, ratingValue, count, fractionalEnabled });
    }

    return { ratingValue, rawUnits };
  }, [totalWidth, count, fractionalEnabled, roundToPrecision]);

  const resolveTooltipIndexFromRaw = useCallback((rawUnits: number | null | undefined) => {
    if (!showTooltip || rawUnits == null || Number.isNaN(rawUnits)) {
      return null;
    }

    const approxIndex = Math.round(rawUnits - 0.5);
    return Math.max(0, Math.min(count - 1, approxIndex));
  }, [showTooltip, count]);

  const handlePointerMove = useCallback((x: number, widthOverride?: number) => {
    const { ratingValue, rawUnits } = resolveValueDetails(x, widthOverride);
    setHoverValue(ratingValue);
    setTooltipIndex(resolveTooltipIndexFromRaw(rawUnits));
    if (!readOnly) {
      onHover?.(ratingValue);
    }
  }, [resolveValueDetails, resolveTooltipIndexFromRaw, onHover, readOnly]);

  const commitAtOffsetX = useCallback((x: number, widthOverride?: number) => {
    if (readOnly) return;
    const { ratingValue, rawUnits } = resolveValueDetails(x, widthOverride);
    if (!isControlled) {
      setInternalValue(ratingValue);
    }
    onChange?.(ratingValue);
    setTooltipIndex(resolveTooltipIndexFromRaw(rawUnits));
  }, [readOnly, resolveValueDetails, resolveTooltipIndexFromRaw, isControlled, onChange]);

  const resolveRelativePosition = useCallback((evt: any) => {
    if (Platform.OS === 'web') {
      const measuredWidth = containerRef.current?.getBoundingClientRect?.().width;
      const width = (typeof measuredWidth === 'number' && measuredWidth > 0)
        ? measuredWidth
        : (containerWidth ?? containerMetricsRef.current.width ?? totalWidth);
      const x = getOffsetXFromEventWeb(evt);
      return { x, width };
    }

    const { pageX, locationX } = evt?.nativeEvent ?? {};
    const { left, width } = containerMetricsRef.current;

    if (typeof pageX === 'number' && width > 0) {
      return { x: pageX - left, width };
    }

    const fallbackWidth = width || containerWidth || totalWidth;
    const relativeX = typeof locationX === 'number' ? locationX : 0;
    return {
      x: relativeX,
      width: fallbackWidth,
    };
  }, [containerWidth, getOffsetXFromEventWeb, totalWidth]);

  useEffect(() => () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      (document.body.style as any).userSelect = '';
    }
  }, []);

  useEffect(() => {
    if (!showTooltip) {
      setTooltipIndex(null);
    }
  }, [showTooltip]);

  const panHandlers: GestureResponderHandlers = useMemo(() => {
    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => !readOnly,
      onMoveShouldSetPanResponder: () => !readOnly,
      onPanResponderGrant: (evt) => {
        if (readOnly) return;
        if (Platform.OS === 'web') {
          (evt as any).preventDefault?.();
          if (typeof document !== 'undefined') {
            document.body.style.userSelect = 'none';
          }
        }
        const { x, width } = resolveRelativePosition(evt);
        handlePointerMove(x, width);
      },
      onPanResponderMove: (evt) => {
        if (readOnly) return;
        if (Platform.OS === 'web') {
          (evt as any).preventDefault?.();
        }
        const { x, width } = resolveRelativePosition(evt);
        handlePointerMove(x, width);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (evt) => {
        if (readOnly) return;
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
          document.body.style.userSelect = '';
        }
        const { x, width } = resolveRelativePosition(evt);
        commitAtOffsetX(x, width);
        setHoverValue(null);
        setTooltipIndex(null);
      },
      onPanResponderTerminate: () => {
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
          document.body.style.userSelect = '';
        }
        setHoverValue(null);
        setTooltipIndex(null);
      },
    });

    return responder.panHandlers;
  }, [readOnly, resolveRelativePosition, handlePointerMove, commitAtOffsetX]);

  const ratingContent = (
    <View
      ref={containerRef}
      style={{ flexDirection: 'row', position: 'relative' }}
      onLayout={(event) => {
        const layoutWidth = event.nativeEvent.layout?.width;
        if (typeof layoutWidth === 'number' && layoutWidth > 0) {
          setContainerWidth(layoutWidth);
        }

        if (Platform.OS === 'web') {
          const rect = containerRef.current?.getBoundingClientRect?.();
          if (rect) {
            containerMetricsRef.current = {
              width: rect.width,
              left: rect.left,
            };
            if (rect.width > 0) {
              setContainerWidth(rect.width);
            }
          }
          return;
        }

        if ((containerRef.current as any)?.measure) {
          (containerRef.current as any).measure((
            _x: number,
            _y: number,
            width: number,
            _height: number,
            pageX: number,
            _pageY: number,
          ) => {
            if (typeof width === 'number' && width > 0) {
              setContainerWidth(width);
              containerMetricsRef.current = {
                width,
                left: typeof pageX === 'number' ? pageX : containerMetricsRef.current.left,
              };
            }
          });
        }
      }}
      {...panHandlers}
      {...(Platform.OS === 'web' && {
        onMouseMove: (e: any) => handlePointerMove(getOffsetXFromEventWeb(e), containerRef.current?.getBoundingClientRect?.().width),
        onMouseDown: (e: any) => handlePointerMove(getOffsetXFromEventWeb(e), containerRef.current?.getBoundingClientRect?.().width),
        onMouseUp: (e: any) => {
          const rect = containerRef.current?.getBoundingClientRect?.();
          const x = getOffsetXFromEventWeb(e);
          commitAtOffsetX(x, rect?.width);
          setHoverValue(null);
          setTooltipIndex(null);
        },
        onMouseLeave: () => handleHoverLeave(),
      })}
    >
      {stars}
    </View>
  );

  const disclaimerNode = renderDisclaimer();

  return (
    <View
      ref={ref}
      style={[
        {
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: isVertical ? 'flex-start' : 'center',
          flexWrap: 'wrap',
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
      {ratingContent}
      {labelNode && (labelPosition === 'right' || labelPosition === 'below') && (
        <View style={{ marginLeft: !isVertical && labelPosition === 'right' ? labelGapSize : 0, marginTop: isVertical && labelPosition === 'below' ? labelGapSize : 0 }}>
          {labelNode}
        </View>
      )}
      {disclaimerNode ? (
        <View style={{ width: '100%' }}>
          {disclaimerNode}
        </View>
      ) : null}
    </View>
  );
}

export const Rating = factory<RatingFactoryPayload>(RatingBase);

Rating.displayName = 'Rating';
