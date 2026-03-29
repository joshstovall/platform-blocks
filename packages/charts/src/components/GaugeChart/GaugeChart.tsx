import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Path, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';

import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { colorSchemes, getColorFromScheme } from '../../utils';
import { useChartTheme } from '../../theme/ChartThemeContext';
import type { GaugeChartProps, GaugeChartMarker } from './types';
import {
  clamp,
  valueToAngle,
  createArcPath,
  getPointOnCircle,
  generateTickPositions,
  generateLabelPositions,
  angleDifference,
} from './utils';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const resolveEasing = (easing?: string) => {
  switch (easing) {
    case 'linear':
      return Easing.linear;
    case 'ease-in':
      return Easing.in(Easing.cubic);
    case 'ease-in-out':
      return Easing.inOut(Easing.cubic);
    case 'bounce':
      return Easing.bounce;
    default:
      return Easing.out(Easing.cubic);
  }
};

const angleToGradientPoints = (angle: number = 0) => {
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians);
  const y = Math.sin(radians);
  return {
    x1: 0.5 - x / 2,
    y1: 0.5 - y / 2,
    x2: 0.5 + x / 2,
    y2: 0.5 + y / 2,
  };
};

type RangeSegment = {
  key: string;
  path: string;
  stroke: string;
  thickness: number;
};

type RangeGradient = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: Array<{ offset: number; color: string; opacity?: number }>;
};

type TickMarkerSegment = {
  type: 'tick';
  key: string;
  inner: { x: number; y: number };
  outer: { x: number; y: number };
  color: string;
  width: number;
  label?: string;
  labelPoint?: { x: number; y: number };
  labelColor: string;
  labelFontSize: number;
  active: boolean;
};

type NeedleMarkerSegment = {
  type: 'needle';
  key: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  width: number;
  label?: string;
  labelPoint?: { x: number; y: number };
  labelColor: string;
  labelFontSize: number;
  active: boolean;
};

type ComputedMarkerSegment = TickMarkerSegment | NeedleMarkerSegment;

export const GaugeChart: React.FC<GaugeChartProps> = (props) => {
  const {
    value,
    min = 0,
    max = 100,
    width = 320,
    height = 240,
    title,
    subtitle,
    startAngle = 135,
    endAngle = 45,
    rotationOffset = 0,
    thickness = 12,
    track,
    ranges = [],
    ticks,
    labels,
    needle,
    centerLabel,
    legend,
    markers,
    markerFocusStrategy = 'closest',
    markerFocusThreshold,
    innerRadiusRatio,
    animationDuration = 600,
    animationEasing,
    disabled = false,
    style,
    valueFormatter,
    onValueChange,
    onMarkerFocus,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    accessible,
    importantForAccessibility,
    ...rest
  } = props;

  const theme = useChartTheme();

  const baseTrackThickness = track?.thickness ?? thickness;
  const trackMargin = Math.max(16, labels?.offset ?? 24);
  const outerRadius = Math.max(1, Math.min(width, height) / 2 - trackMargin / 2);
  const resolvedInnerRatio = innerRadiusRatio != null ? clamp(innerRadiusRatio, 0, 0.98) : null;
  const derivedTrackThickness = resolvedInnerRatio != null
    ? Math.max(1, outerRadius - outerRadius * resolvedInnerRatio)
    : baseTrackThickness;
  const radius = Math.max(1, outerRadius - derivedTrackThickness / 2);
  const innerRadius = Math.max(0, radius - derivedTrackThickness / 2);
  const outerRadiusActual = radius + derivedTrackThickness / 2;
  const centerX = width / 2;
  const centerY = height / 2;

  const baseStartAngle = startAngle + rotationOffset;
  let span = endAngle + rotationOffset - baseStartAngle;
  if (span <= 0) {
    span += 360;
  }
  const baseEndAngle = baseStartAngle + span;

  const clampedValue = clamp(value, min, max);
  const percentage = max === min ? 0 : (clampedValue - min) / (max - min);
  const valueAngle = valueToAngle(clampedValue, min, max, baseStartAngle, baseEndAngle);

  const easingFn = useMemo(() => resolveEasing(animationEasing), [animationEasing]);
  const animatedAngle = useSharedValue(valueAngle);
  const previousAngleRef = useRef(valueAngle);
  const previousValueRef = useRef(clampedValue);
  const gradientInstanceId = useMemo(() => `gauge-${Math.random().toString(36).slice(2, 10)}`, []);
  const formattedValue = useMemo(() => {
    return valueFormatter ? valueFormatter(clampedValue, percentage) : `${Math.round(clampedValue)}`;
  }, [valueFormatter, clampedValue, percentage]);

  const activeMarker = useMemo<GaugeChartMarker | null>(() => {
    if (!markers || markers.length === 0) {
      return null;
    }

    const sorted = [...markers].sort((a, b) => a.value - b.value);

    if (markerFocusStrategy === 'leading') {
      for (let i = sorted.length - 1; i >= 0; i -= 1) {
        if (clampedValue >= sorted[i].value) {
          return sorted[i];
        }
      }
      return null;
    }

    let bestMarker: GaugeChartMarker | null = null;
    let bestDiff = Number.POSITIVE_INFINITY;
    sorted.forEach((marker) => {
      const diff = Math.abs(clampedValue - marker.value);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMarker = marker;
      }
    });

    if (!bestMarker) {
      return null;
    }

    const threshold = markerFocusThreshold == null ? Number.POSITIVE_INFINITY : Math.max(0, markerFocusThreshold);
    if (threshold === Number.POSITIVE_INFINITY || bestDiff <= threshold) {
      return bestMarker;
    }

    return null;
  }, [markers, markerFocusStrategy, markerFocusThreshold, clampedValue]);

  const previousActiveMarkerRef = useRef<GaugeChartMarker | null>(null);

  useEffect(() => {
    const target = valueToAngle(clampedValue, min, max, baseStartAngle, baseEndAngle);
    const previous = previousAngleRef.current;
    const delta = angleDifference(previous, target);
    const finalTarget = previous + delta;

    previousAngleRef.current = finalTarget;

    if (!disabled && animationDuration > 0 && Math.abs(delta) > 1e-4) {
      animatedAngle.value = withTiming(finalTarget, {
        duration: animationDuration,
        easing: easingFn,
      });
    } else {
      animatedAngle.value = finalTarget;
    }

    if (onValueChange && previousValueRef.current !== clampedValue) {
      const previousValue = previousValueRef.current;
      previousValueRef.current = clampedValue;
      onValueChange(clampedValue, percentage, previousValue);
    } else {
      previousValueRef.current = clampedValue;
    }
  }, [animatedAngle, animationDuration, baseEndAngle, baseStartAngle, clampedValue, easingFn, max, min, disabled, onValueChange, percentage]);

  useEffect(() => {
    if (!onMarkerFocus) return;
    if (previousActiveMarkerRef.current !== activeMarker) {
      previousActiveMarkerRef.current = activeMarker;
      onMarkerFocus(activeMarker ?? null);
    }
  }, [activeMarker, onMarkerFocus]);

  const needleLengthRatio = needle?.length ?? 0.9;
  const needleLength = Math.max(0.2, Math.min(1.1, needleLengthRatio)) * outerRadiusActual;
  const needleWidth = needle?.width ?? 3;
  const needleColor = needle?.color ?? theme.colors.accentPalette[0] ?? '#2563eb';
  const showNeedle = needle?.show !== false;
  const showCenter = needle?.showCenter !== false;
  const centerSize = needle?.centerSize ?? Math.max(6, derivedTrackThickness * 0.6);
  const centerColor = needle?.centerColor ?? needleColor;

  const trackColor = track?.color ?? theme.colors.grid;
  const trackOpacity = track?.opacity ?? 0.35;
  const showTrack = track?.show !== false;

  const tickDerived = useMemo(() => {
    if (!ticks) return null;
    if (ticks.show === false) return null;

    const majorCount = Math.max(1, ticks.major ?? 5);
    const minorCount = Math.max(0, ticks.minor ?? 4);
    const generated = generateTickPositions(min, max, majorCount, minorCount);

    const majors = (ticks.majorPositions && ticks.majorPositions.length > 0)
      ? ticks.majorPositions
      : generated.major;
    const minors = (ticks.minorPositions && ticks.minorPositions.length > 0)
      ? ticks.minorPositions
      : generated.minor;

    return {
      majors,
      minors,
      majorLength: ticks.majorLength ?? 14,
      minorLength: ticks.minorLength ?? 10,
      color: ticks.color ?? theme.colors.grid,
      width: ticks.width ?? 2,
    };
  }, [ticks, min, max, theme.colors.grid]);

  const labelConfig = labels ?? {};
  const showLabels = labelConfig.show !== false;
  const labelPositions = useMemo(() => {
    if (!showLabels) return [] as number[];
    if (labelConfig.positions && labelConfig.positions.length > 0) {
      return labelConfig.positions;
    }
    if (tickDerived?.majors) {
      return tickDerived.majors;
    }
    const divisions = ticks?.major ?? 5;
    return generateLabelPositions(min, max, Math.max(1, divisions));
  }, [labelConfig.positions, min, max, showLabels, tickDerived?.majors, ticks?.major]);

  const labelFormatter = labelConfig.formatter ?? ((val: number) => `${Math.round(val)}`);
  const labelColor = labelConfig.color ?? theme.colors.textSecondary;
  const labelFontSize = labelConfig.fontSize ?? theme.fontSize.sm;
  const labelOffset = labelConfig.offset ?? 28;
  const labelFontWeight = labelConfig.fontWeight ?? 'normal';

  const { rangeSegments, rangeGradients } = useMemo(() => {
    if (!ranges || ranges.length === 0) {
      return { rangeSegments: [] as RangeSegment[], rangeGradients: [] as RangeGradient[] };
    }

    const segments: RangeSegment[] = [];
    const gradients: RangeGradient[] = [];

    ranges.forEach((range, index) => {
      const from = clamp(range.from, min, max);
      const to = clamp(range.to, min, max);
      if (to <= from) {
        return;
      }
      const start = valueToAngle(from, min, max, baseStartAngle, baseEndAngle);
      const end = valueToAngle(to, min, max, baseStartAngle, baseEndAngle);
      const defaultColor = range.color ?? getColorFromScheme(index, colorSchemes.default);
      const thicknessOverride = range.thickness ?? derivedTrackThickness;
      let stroke = defaultColor;

      if (range.gradient?.stops?.length) {
        const gradientId = `${gradientInstanceId}-range-${index}`;
        const gradientPoints = angleToGradientPoints(range.gradient.angle ?? 0);
        stroke = `url(#${gradientId})`;
        const stops = range.gradient!.stops;
        gradients.push({
          id: gradientId,
          ...gradientPoints,
          stops,
        });
      }

      segments.push({
        key: `${from}-${to}-${index}`,
        path: createArcPath(centerX, centerY, radius, start, end),
        stroke,
        thickness: thicknessOverride,
      });
    });

    return { rangeSegments: segments, rangeGradients: gradients };
  }, [ranges, min, max, baseStartAngle, baseEndAngle, centerX, centerY, radius, derivedTrackThickness, gradientInstanceId]);

  const markerSegments = useMemo<ComputedMarkerSegment[]>(() => {
    if (!markers || markers.length === 0) {
      return [];
    }

    const rangeCount = ranges ? ranges.length : 0;

    return markers.map((marker, index) => {
      const type = marker.type ?? 'tick';
      const clampedMarkerValue = clamp(marker.value, min, max);
      const angle = valueToAngle(clampedMarkerValue, min, max, baseStartAngle, baseEndAngle);
      const color = marker.color ?? getColorFromScheme(index + rangeCount, colorSchemes.default);
      const labelText = marker.label;
      const isActive = activeMarker === marker;

      if (type === 'needle') {
        const lengthRatio = marker.needleLength ?? 0.9;
        const markerNeedleLength = Math.max(0.2, Math.min(1.2, lengthRatio)) * outerRadiusActual;
        const startRadius = marker.needleFromCenter === false ? innerRadius : 0;
        const startPoint = getPointOnCircle(centerX, centerY, startRadius, angle);
        const endPoint = getPointOnCircle(centerX, centerY, markerNeedleLength, angle);
        const labelPoint = labelText
          ? getPointOnCircle(centerX, centerY, markerNeedleLength + (marker.labelOffset ?? 16), angle)
          : undefined;
        return {
          type: 'needle',
          key: `marker-${clampedMarkerValue}-${index}`,
          start: startPoint,
          end: endPoint,
          color,
          width: marker.needleWidth ?? marker.width ?? Math.max(2, derivedTrackThickness * 0.35),
          label: labelText,
          labelPoint,
          labelColor: marker.labelColor ?? labelColor,
          labelFontSize: marker.labelFontSize ?? labelFontSize,
          active: isActive,
        } satisfies NeedleMarkerSegment;
      }

      const offset = marker.offset ?? 0;
      const baseRadius = radius + offset;
      const size = marker.size ?? Math.max(derivedTrackThickness, 10);
      const strokeWidth = marker.width ?? Math.max(2, derivedTrackThickness * 0.25);
      const outer = getPointOnCircle(centerX, centerY, baseRadius, angle);
      const inner = getPointOnCircle(centerX, centerY, baseRadius - size, angle);
      const labelPoint = labelText
        ? getPointOnCircle(
            centerX,
            centerY,
            baseRadius + (marker.labelOffset ?? labelOffset + derivedTrackThickness * 0.5 + 8),
            angle,
          )
        : undefined;

      return {
        type: 'tick',
        key: `marker-${clampedMarkerValue}-${index}`,
        inner,
        outer,
        color,
        width: strokeWidth,
        label: labelText,
        labelPoint,
        labelColor: marker.labelColor ?? labelColor,
        labelFontSize: marker.labelFontSize ?? labelFontSize,
        active: isActive,
      } satisfies TickMarkerSegment;
    });
  }, [markers, ranges, min, max, baseStartAngle, baseEndAngle, radius, derivedTrackThickness, centerX, centerY, labelOffset, labelColor, labelFontSize, activeMarker, outerRadiusActual, innerRadius]);

  const legendItems = useMemo(() => {
    const rangeItems = (ranges && ranges.length)
      ? ranges.map((range, index) => ({
      label: range.label ?? `${range.from} – ${range.to}`,
      color: range.color ?? getColorFromScheme(index, colorSchemes.default),
      }))
      : [];

    if (!markers || markers.length === 0) {
      return rangeItems;
    }

    const rangeCount = ranges?.length ?? 0;
    const markerItems = markers
      .filter((marker) => marker.label && marker.showInLegend !== false)
      .map((marker, index) => ({
        label: marker.label as string,
        color: marker.color ?? getColorFromScheme(index + rangeCount, colorSchemes.default),
      }));

    return [...rangeItems, ...markerItems];
  }, [markers, ranges]);

  const needleAnimatedProps = useAnimatedProps(() => {
    const angleInRadians = ((animatedAngle.value - 90) * Math.PI) / 180;
    const x2 = centerX + needleLength * Math.cos(angleInRadians);
    const y2 = centerY + needleLength * Math.sin(angleInRadians);
    return { x2, y2 } as any;
  });

  const centerPrimaryText = (() => {
    if (centerLabel?.formatter) {
      return centerLabel.formatter(clampedValue, percentage);
    }
    if (centerLabel?.text) {
      return centerLabel.text;
    }
    if (centerLabel) {
      return formattedValue;
    }
    return undefined;
  })();

  const centerSecondaryText = (() => {
    if (!centerLabel) return undefined;
    if (typeof centerLabel.secondaryText === 'function') {
      return centerLabel.secondaryText(clampedValue, percentage);
    }
    return centerLabel.secondaryText;
  })();

  const shouldRenderCenterText = (centerLabel?.show ?? Boolean(centerPrimaryText || centerSecondaryText));

  const resolvedAccessibilityLabelText = accessibilityLabel
    ?? (title ? `${title}: ${formattedValue}` : `Gauge value ${formattedValue}`);
  const resolvedAccessibilityHint = accessibilityHint ?? 'Displays progress toward the configured bounds.';
  const resolvedAccessibilityRole = accessibilityRole ?? 'progressbar';
  const resolvedAccessible = accessible ?? true;
  const resolvedImportantForAccessibility = importantForAccessibility ?? 'auto';

  return (
    <ChartContainer
      width={width}
      height={height}
      disabled={disabled}
      style={style}
      accessibilityLabel={resolvedAccessibilityLabelText}
      accessibilityHint={resolvedAccessibilityHint}
      accessibilityRole={resolvedAccessibilityRole}
      accessible={resolvedAccessible}
      importantForAccessibility={resolvedImportantForAccessibility}
      {...rest}
    >
      {(title || subtitle) && <ChartTitle title={title} subtitle={subtitle} />}

      {shouldRenderCenterText && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width,
            height,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {centerPrimaryText && (
            <Text
              style={{
                color: centerLabel?.color ?? theme.colors.textPrimary,
                fontSize: centerLabel?.fontSize ?? theme.fontSize.lg,
                fontWeight: '600',
                includeFontPadding: false,
                marginBottom: centerSecondaryText ? centerLabel?.gap ?? 4 : 0,
                textAlign: 'center',
              }}
            >
              {centerPrimaryText}
            </Text>
          )}
          {centerSecondaryText && (
            <Text
              style={{
                color: centerLabel?.secondaryColor ?? theme.colors.textSecondary,
                fontSize: centerLabel?.secondaryFontSize ?? theme.fontSize.sm,
                includeFontPadding: false,
                textAlign: 'center',
              }}
            >
              {centerSecondaryText}
            </Text>
          )}
        </View>
      )}

      <Svg width={width} height={height}>
        <Defs>
          {rangeGradients.map((gradient) => (
            <LinearGradient
              key={gradient.id}
              id={gradient.id}
              x1={`${gradient.x1}`}
              y1={`${gradient.y1}`}
              x2={`${gradient.x2}`}
              y2={`${gradient.y2}`}
            >
              {gradient.stops.map((stop, index) => (
                <Stop
                  key={`${gradient.id}-stop-${index}`}
                  offset={stop.offset}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity ?? 1}
                />
              ))}
            </LinearGradient>
          ))}
        </Defs>
        <G>
          {showTrack && (
            <Path
              d={createArcPath(centerX, centerY, radius, baseStartAngle, baseEndAngle)}
              stroke={trackColor}
              strokeWidth={derivedTrackThickness}
              strokeLinecap="round"
              opacity={trackOpacity}
              fill="none"
            />
          )}

          {rangeSegments.map((segment) => (
            <Path
              key={segment.key}
              d={segment.path}
              stroke={segment.stroke}
              strokeWidth={segment.thickness}
              strokeLinecap="round"
              fill="none"
            />
          ))}
          {markerSegments.map((marker) => {
            const strokeOpacity = marker.active ? 1 : 0.55;

            if (marker.type === 'needle') {
              return (
                <React.Fragment key={marker.key}>
                  <Line
                    x1={marker.start.x}
                    y1={marker.start.y}
                    x2={marker.end.x}
                    y2={marker.end.y}
                    stroke={marker.color}
                    strokeWidth={marker.width}
                    strokeLinecap="round"
                    opacity={strokeOpacity}
                  />
                  {marker.label && marker.labelPoint && (
                    <SvgText
                      x={marker.labelPoint.x}
                      y={marker.labelPoint.y}
                      fill={marker.labelColor}
                      fontSize={marker.labelFontSize}
                      fontWeight="600"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {marker.label}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={marker.key}>
                <Line
                  x1={marker.inner.x}
                  y1={marker.inner.y}
                  x2={marker.outer.x}
                  y2={marker.outer.y}
                  stroke={marker.color}
                  strokeWidth={marker.width}
                  strokeLinecap="round"
                  opacity={strokeOpacity}
                />
                {marker.label && marker.labelPoint && (
                  <SvgText
                    x={marker.labelPoint.x}
                    y={marker.labelPoint.y}
                    fill={marker.labelColor}
                    fontSize={marker.labelFontSize}
                    fontWeight="600"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {marker.label}
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}

          {tickDerived && (
            <G>
              {tickDerived.majors.map((tickValue, index) => {
                const angle = valueToAngle(tickValue, min, max, baseStartAngle, baseEndAngle);
                const outer = getPointOnCircle(centerX, centerY, radius, angle);
                const inner = getPointOnCircle(centerX, centerY, radius - tickDerived.majorLength, angle);
                return (
                  <Line
                    key={`major-${index}`}
                    x1={inner.x}
                    y1={inner.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke={tickDerived.color}
                    strokeWidth={tickDerived.width}
                    strokeLinecap="round"
                  />
                );
              })}
              {tickDerived.minors.map((tickValue, index) => {
                const angle = valueToAngle(tickValue, min, max, baseStartAngle, baseEndAngle);
                const outer = getPointOnCircle(centerX, centerY, radius, angle);
                const inner = getPointOnCircle(centerX, centerY, radius - tickDerived.minorLength, angle);
                return (
                  <Line
                    key={`minor-${index}`}
                    x1={inner.x}
                    y1={inner.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke={tickDerived.color}
                    strokeWidth={Math.max(1, tickDerived.width * 0.6)}
                    strokeLinecap="round"
                  />
                );
              })}
            </G>
          )}

          {showLabels && labelPositions.map((position, index) => {
            const angle = valueToAngle(position, min, max, baseStartAngle, baseEndAngle);
            const point = getPointOnCircle(centerX, centerY, radius + labelOffset, angle);
            const label = labelFormatter(position);
            return (
              <SvgText
                key={`label-${index}`}
                x={point.x}
                y={point.y}
                fill={labelColor}
                fontSize={labelFontSize}
                fontWeight={labelFontWeight}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {label}
              </SvgText>
            );
          })}

          {showNeedle && (
            <AnimatedLine
              x1={centerX}
              y1={centerY}
              animatedProps={needleAnimatedProps}
              stroke={needleColor}
              strokeWidth={needleWidth}
              strokeLinecap="round"
            />
          )}

          {showNeedle && showCenter && (
            <Circle
              cx={centerX}
              cy={centerY}
              r={centerSize}
              fill={centerColor}
            />
          )}
        </G>
      </Svg>

      {legend?.show && legendItems.length > 0 && (
        <ChartLegend
          items={legendItems}
          position={legend.position}
          align={legend.align}
          textColor={legend.textColor}
          fontSize={legend.fontSize}
        />
      )}
    </ChartContainer>
  );
};

GaugeChart.displayName = 'GaugeChart';
