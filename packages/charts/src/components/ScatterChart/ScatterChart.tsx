import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Pressable, Text, PanResponder, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useChartTheme } from '../../theme/ChartThemeContext';
import { ScatterChartProps, ChartInteractionEvent, ChartDataPoint } from '../../types';
import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { ChartGrid } from '../../core/ChartGrid';
import { Axis } from '../../core/Axis';

import {
  scaleLinear,
  scaleLog,
  scaleTime,
  generateTicks,
  generateLogTicks,
  generateTimeTicks,
  getDataDomain,
  dataToChartCoordinates,
  chartToDataCoordinates,
  getColorFromScheme,
  colorSchemes,
  formatNumber,
  distance as calculateDistance
} from '../../utils';
import type { Scale } from '../../utils/scales';
import { useNearestPoint } from '../../hooks/useNearestPoint';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useScatterSeriesRegistration } from './useScatterSeriesRegistration';
import type { ScatterChartSeriesRegistration } from './useScatterSeriesRegistration';

const SPACING_PROP_KEYS = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'] as const;
type SpacingPropKey = typeof SPACING_PROP_KEYS[number];

// Animated scatter point component
const AnimatedScatterPoint: React.FC<{
  point: ChartDataPoint & { chartX: number; chartY: number };
  pointSize: number;
  pointOpacity: number;
  isSelected: boolean;
  isDragged: boolean;
  index: number;
  disabled: boolean;
  theme: ReturnType<typeof useChartTheme>;
  colorScheme: string[];
  fallbackColor?: string;
}> = React.memo(({ 
  point, 
  pointSize, 
  pointOpacity, 
  isSelected, 
  isDragged, 
  index, 
  disabled, 
  theme, 
  colorScheme,
  fallbackColor,
}) => {
  const scale = useSharedValue(disabled ? 1 : 0);
  const opacity = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    if (disabled) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    // Staggered appearance animation
    const delay = index * 50;
    scale.value = withDelay(delay, withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.back(1.2)),
    }));
    opacity.value = withDelay(delay, withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    }));
  }, [disabled, index, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * ((isSelected || isDragged) ? 1.5 : 1) }],
    opacity: opacity.value * pointOpacity,
  }));

  // Skip rendering if coordinates invalid
  if (typeof point.chartX !== 'number' || typeof point.chartY !== 'number') {
    return null;
  }

  const palette = colorScheme && colorScheme.length ? colorScheme : colorSchemes.default;
  const backgroundColor = point.color || fallbackColor || getColorFromScheme(index, palette);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: point.chartX - pointSize,
          top: point.chartY - pointSize,
          width: pointSize * 2,
          height: pointSize * 2,
          borderRadius: pointSize,
          backgroundColor,
          borderWidth: isSelected ? 2 : 0,
          borderColor: theme.colors.accentPalette[0],
          pointerEvents: 'none'
        },
        animatedStyle
      ]}
    />
  );
});

AnimatedScatterPoint.displayName = 'AnimatedScatterPoint';
const ScatterChartInner: React.FC<ScatterChartProps> = (props) => {
  const isWeb = Platform.OS === 'web';
  const {
    data: initialData,
    width = 400,
    height = 300,
    pointSize = 6,
    series,
    pointColor,
    pointOpacity = 1,
    allowAddPoints = false,
    allowDragPoints = false,
    showTrendline = false,
    trendlineColor,
    title,
    subtitle,
    xAxis,
    yAxis,
    grid,
    legend,
    tooltip,
    quadrants,
    onPress,
    onDataPointPress,
    disabled = false,
    multiTooltip,
    enableCrosshair,
  } = props;

  const theme = useChartTheme();
  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try { interaction = useChartInteractionContext(); } catch { }
  const crosshairEnabled = enableCrosshair !== false && interaction?.config?.enableCrosshair !== false;
  const registerSeries = interaction?.registerSeries;
  const updateSeriesVisibility = interaction?.updateSeriesVisibility;
  const setPointer = interaction?.setPointer;
  const setCrosshair = interaction?.setCrosshair;
  const [data, setData] = useState<ChartDataPoint[]>(initialData);
  // Normalize multi-series (fallback to single-series wrapper)
  const normalizedSeries = React.useMemo(() => {
    if (series && series.length) {
      return series.map((s, i) => ({
        id: s.id || `series-${i}`,
        name: s.name || `Series ${i + 1}`,
        color: s.color || theme.colors.accentPalette[i % theme.colors.accentPalette.length],
        data: s.data,
        pointSize: s.pointSize ?? pointSize,
        pointColor: s.pointColor || s.color,
      }));
    }
    // Fallback single-series mode using initial data prop
    return [{
      id: 'series-0',
      name: title || 'Series 1',
      color: pointColor || theme.colors.accentPalette[0],
      data: data,
      pointSize,
      pointColor: pointColor || theme.colors.accentPalette[0],
    }];
  }, [series, data, pointSize, pointColor, theme.colors.accentPalette, title]);

  // (Removed per-point animated values to avoid hook-in-loop invalid usage)

  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  const [draggedPoint, setDraggedPoint] = useState<ChartDataPoint | null>(null);

  // Calculate data bounds with some padding
  const computedXDomain = React.useMemo(() => getDataDomain(normalizedSeries.flatMap(s => s.data), d => d.x), [normalizedSeries]);
  const computedYDomain = React.useMemo(() => getDataDomain(normalizedSeries.flatMap(s => s.data), d => d.y), [normalizedSeries]);
  const [xDomainState, setXDomainState] = useState<[number, number] | null>(null);
  const [yDomainState, setYDomainState] = useState<[number, number] | null>(null);
  const rawXDomain = xDomainState || computedXDomain;
  const rawYDomain = yDomainState || computedYDomain;
  const clampToInitial = props.clampToInitialDomain;
  const clampDomain = (domain: [number, number], base: [number, number]) => {
    if (!clampToInitial) return domain;
    const width = domain[1] - domain[0];
    const baseWidth = base[1] - base[0];
    if (width >= baseWidth) return base;
    const min = Math.max(base[0], Math.min(domain[0], base[1] - width));
    const max = min + width;
    return [min, max] as [number, number];
  };
  const xDomain = clampDomain(rawXDomain, computedXDomain);
  const yDomain = clampDomain(rawYDomain, computedYDomain);

  // Add some padding to the domain
  const xPadding = (xDomain[1] - xDomain[0]) * 0.1;
  const yPadding = (yDomain[1] - yDomain[0]) * 0.1;
  const paddedXDomain: [number, number] = [xDomain[0] - xPadding, xDomain[1] + xPadding];
  const paddedYDomain: [number, number] = [yDomain[0] - yPadding, yDomain[1] + yPadding];

  // Chart dimensions - adjust padding based on legend position to prevent overlap
  const basePadding = { top: 40, right: 20, bottom: 60, left: 80 };
  const padding = React.useMemo(() => {
    if (!legend?.show) return basePadding;
    const position = legend.position || 'bottom';
    return {
      ...basePadding,
      top: position === 'top' ? basePadding.top + 40 : basePadding.top,
      bottom: position === 'bottom' ? basePadding.bottom + 40 : basePadding.bottom,
      left: position === 'left' ? basePadding.left + 120 : basePadding.left,
      right: position === 'right' ? basePadding.right + 120 : basePadding.right,
    };
  }, [legend?.show, legend?.position]);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const interactionVisibility = useMemo(() => {
    const visibilityMap = new Map<string, boolean>();
    interaction?.series.forEach((entry) => {
      visibilityMap.set(String(entry.id), entry.visible !== false);
    });
    return visibilityMap;
  }, [interaction?.series]);

  const chartSeries: ScatterChartSeriesRegistration[] = normalizedSeries.map(s => ({
    ...s,
    visible: interactionVisibility.get(String(s.id)) ?? true,
    pointColor: s.pointColor,
    pointSize: s.pointSize,
    chartPoints: s.data.map((point) => {
      const coords = dataToChartCoordinates(point.x, point.y, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain);
      return { ...point, chartX: coords.x, chartY: coords.y };
    })
  }));

  useScatterSeriesRegistration({
    series: chartSeries,
    registerSeries,
  });

  const xTicks = React.useMemo(() => {
    switch (props.xScaleType) {
      case 'log': return generateLogTicks(paddedXDomain, 6);
      case 'time': return generateTimeTicks(paddedXDomain, 6);
      default: return generateTicks(paddedXDomain[0], paddedXDomain[1], 6);
    }
  }, [paddedXDomain, props.xScaleType]);
  const yTicks = React.useMemo(() => {
    switch (props.yScaleType) {
      case 'log': return generateLogTicks(paddedYDomain, 5);
      case 'time': return generateTimeTicks(paddedYDomain, 5);
      default: return generateTicks(paddedYDomain[0], paddedYDomain[1], 5);
    }
  }, [paddedYDomain, props.yScaleType]);

  const axisScaleX = useMemo<Scale<number>>(() => {
    const range: [number, number] = [0, Math.max(plotWidth, 0)];
    const domain = [...paddedXDomain] as [number, number];

    if (plotWidth <= 0) {
      const scale = ((_: number) => 0) as Scale<number>;
      scale.domain = () => domain;
      scale.range = () => [0, 0];
      scale.ticks = () => [...xTicks];
      return scale;
    }

    const scale = ((value: number) => {
      switch (props.xScaleType) {
        case 'log':
          return scaleLog(Math.max(value, 1e-12), domain, range);
        case 'time':
          return scaleTime(value, domain, range);
        default:
          return scaleLinear(value, domain, range);
      }
    }) as Scale<number>;
    scale.domain = () => domain.slice();
    scale.range = () => range.slice();
    scale.ticks = (count?: number) => {
      if (xTicks.length) return xTicks;
      switch (props.xScaleType) {
        case 'log':
          return generateLogTicks(domain, count ?? 6);
        case 'time':
          return generateTimeTicks(domain, count ?? 6);
        default:
          return generateTicks(domain[0], domain[1], count ?? 6);
      }
    };
    return scale;
  }, [plotWidth, paddedXDomain, props.xScaleType, xTicks]);

  const axisScaleY = useMemo<Scale<number>>(() => {
    const range: [number, number] = [Math.max(plotHeight, 0), 0];
    const domain = [...paddedYDomain] as [number, number];

    if (plotHeight <= 0) {
      const scale = ((_: number) => 0) as Scale<number>;
      scale.domain = () => domain;
      scale.range = () => [0, 0];
      scale.ticks = () => [...yTicks];
      return scale;
    }

    const scale = ((value: number) => {
      switch (props.yScaleType) {
        case 'log':
          return scaleLog(Math.max(value, 1e-12), domain, range);
        case 'time':
          return scaleTime(value, domain, range);
        default:
          return scaleLinear(value, domain, range);
      }
    }) as Scale<number>;
    scale.domain = () => domain.slice();
    scale.range = () => range.slice();
    scale.ticks = (count?: number) => {
      if (yTicks.length) return yTicks;
      switch (props.yScaleType) {
        case 'log':
          return generateLogTicks(domain, count ?? 5);
        case 'time':
          return generateTimeTicks(domain, count ?? 5);
        default:
          return generateTicks(domain[0], domain[1], count ?? 5);
      }
    };
    return scale;
  }, [plotHeight, paddedYDomain, props.yScaleType, yTicks]);

  const quadrantVisual = useMemo(() => {
    if (!quadrants) return null;
    if (plotWidth <= 0 || plotHeight <= 0) return null;
    const { x, y } = quadrants;
    if (x == null || y == null) return null;

    const rawX = axisScaleX(x);
    const rawY = axisScaleY(y);
    if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) return null;

    const clampCoord = (value: number, max: number) => Math.min(Math.max(value, 0), max);
    const xCoord = clampCoord(rawX, plotWidth);
    const yCoord = clampCoord(rawY, plotHeight);

    return {
      xCoord,
      yCoord,
      fills: quadrants.fills,
      fillOpacity: Math.min(Math.max(quadrants.fillOpacity ?? 0.08, 0), 1),
      showLines: quadrants.showLines !== false,
      lineColor: quadrants.lineColor || theme.colors.grid,
      lineWidth: Math.max(quadrants.lineWidth ?? 1, 0.5),
      labels: quadrants.labels,
      labelColor: quadrants.labelColor || theme.colors.textSecondary,
      labelFontSize: quadrants.labelFontSize ?? 11,
      labelOffset: quadrants.labelOffset ?? 14,
    };
  }, [quadrants, axisScaleX, axisScaleY, plotHeight, plotWidth, theme.colors.grid, theme.colors.textSecondary]);

  const quadrantLayout = useMemo(() => {
    if (!quadrantVisual) return null;
    return {
      ...quadrantVisual,
      leftWidth: quadrantVisual.xCoord,
      rightWidth: Math.max(0, plotWidth - quadrantVisual.xCoord),
      topHeight: quadrantVisual.yCoord,
      bottomHeight: Math.max(0, plotHeight - quadrantVisual.yCoord),
    };
  }, [plotHeight, plotWidth, quadrantVisual]);

  const normalizedXTicks = useMemo(() => {
    if (plotWidth <= 0) return [] as number[];
    return xTicks.map((tick) => {
      const value = axisScaleX(tick);
      if (!Number.isFinite(value) || plotWidth === 0) return 0;
      return value / plotWidth;
    });
  }, [xTicks, axisScaleX, plotWidth]);

  const normalizedYTicks = useMemo(() => {
    if (plotHeight <= 0) return [] as number[];
    return yTicks.map((tick) => {
      const value = axisScaleY(tick);
      if (!Number.isFinite(value) || plotHeight === 0) return 0;
      return value / plotHeight;
    });
  }, [yTicks, axisScaleY, plotHeight]);

  const xAxisTickSize = xAxis?.tickLength ?? 4;
  const yAxisTickSize = yAxis?.tickLength ?? 4;
  const axisTickPadding = 4;

  const resolvedTextColor = theme.colors.textSecondary;

  const nearestPoint = useNearestPoint(chartSeries as any, paddedXDomain, paddedYDomain, plotWidth, plotHeight);

  const evaluateNearestPoint = useCallback((chartX: number, chartY: number) => {
    const res = nearestPoint(chartX, chartY, 30) as any;
    if (res && res.dataPoint) {
      setSelectedPoint(res.dataPoint);
      setPointer?.({ x: chartX, y: chartY, inside: true });
      if (enableCrosshair !== false) setCrosshair?.({ dataX: res.dataPoint.x, pixelX: chartX });
    }
  }, [nearestPoint, setPointer, setCrosshair, enableCrosshair]);

  // Calculate trend line (simple linear regression)
  const calculateTrendline = () => {
    if (data.length < 2) return null;

    const n = data.length;
    const sumX = data.reduce((sum, p) => sum + p.x, 0);
    const sumY = data.reduce((sum, p) => sum + p.y, 0);
    const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = data.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const startX = paddedXDomain[0];
    const endX = paddedXDomain[1];
    const startY = slope * startX + intercept;
    const endY = slope * endX + intercept;

    return {
      start: dataToChartCoordinates(startX, startY,
        { x: 0, y: 0, width: plotWidth, height: plotHeight },
        paddedXDomain, paddedYDomain),
      end: dataToChartCoordinates(endX, endY,
        { x: 0, y: 0, width: plotWidth, height: plotHeight },
        paddedXDomain, paddedYDomain)
    };
  };

  // Regression helpers
  const computeRegression = (pts: ChartDataPoint[]) => {
    if (pts.length < 2) return null;
    const n = pts.length;
    const sumX = pts.reduce((s, p) => s + p.x, 0);
    const sumY = pts.reduce((s, p) => s + p.y, 0);
    const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
    const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
    const denom = n * sumXX - sumX * sumX;
    if (!denom) return null;
    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  };
  const trendlines = React.useMemo(() => {
    if (!showTrendline) return [] as any[];
    if (showTrendline === 'per-series') {
      return chartSeries.map(s => {
        const reg = computeRegression(s.chartPoints);
        if (!reg) return null;
        const startX = paddedXDomain[0];
        const endX = paddedXDomain[1];
        const startY = reg.slope * startX + reg.intercept;
        const endY = reg.slope * endX + reg.intercept;
        return {
          id: s.id,
          color: s.color,
          start: dataToChartCoordinates(startX, startY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain),
          end: dataToChartCoordinates(endX, endY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain)
        };
      }).filter(Boolean);
    }
    const all = chartSeries.flatMap(s => s.chartPoints);
    const reg = computeRegression(all);
    if (!reg) return [];
    const startX = paddedXDomain[0];
    const endX = paddedXDomain[1];
    const startY = reg.slope * startX + reg.intercept;
    const endY = reg.slope * endX + reg.intercept;
    return [{
      id: 'overall',
      color: trendlineColor || theme.colors.accentPalette[0],
      start: dataToChartCoordinates(startX, startY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain),
      end: dataToChartCoordinates(endX, endY, { x: 0, y: 0, width: plotWidth, height: plotHeight }, paddedXDomain, paddedYDomain)
    }];
  }, [showTrendline, chartSeries, paddedXDomain, paddedYDomain, plotWidth, plotHeight, trendlineColor, theme.colors.accentPalette]);

  // Register scatter points as a single series for unified tooltip
  // Pan/Zoom integration
  const [lastPan, setLastPan] = useState<{ x: number; y: number } | null>(null);
  const [pinchTracking, setPinchTracking] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const panZoom = usePanZoom(
    { xDomain: xDomain, yDomain: yDomain },
    (next) => {
      if (next.xDomain) setXDomainState(next.xDomain);
      if (next.yDomain) setYDomainState(next.yDomain);
    },
    {
      enablePanZoom: props.enablePanZoom,
      zoomMode: props.zoomMode,
      minZoom: props.minZoom,
      wheelZoomStep: props.wheelZoomStep,
      clampDomain: clampDomain,
      baseX: computedXDomain,
      baseY: computedYDomain,
      invertPinchZoom: props.invertPinchZoom,
      invertWheelZoom: props.invertWheelZoom,
    }
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      const native: any = e.nativeEvent || {};
      const touches = native.touches || [];
      if (props.enablePanZoom && (touches.length === 2 || gestureState.numberActiveTouches === 2)) {
        if (touches.length === 2) {
          const dx = touches[1].pageX - touches[0].pageX;
          const dy = touches[1].pageY - touches[0].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          panZoom.startPinch(distance);
          setPinchTracking(true);
          return;
        }
      }
      const { locationX, locationY } = native;
      if (typeof locationX === 'number' && typeof locationY === 'number') {
        setLastPan({ x: locationX, y: locationY });
        panZoom.startPan(locationX, locationY);
        evaluateNearestPoint(locationX - padding.left, locationY - padding.top);
      }
    },
    onPanResponderMove: (e, gestureState) => {
      const native: any = e.nativeEvent || {};
      const touches = native.touches || [];
      const activeTouches = touches.length || gestureState.numberActiveTouches;
      if (props.enablePanZoom && activeTouches === 2) {
        if (!pinchTracking && touches.length === 2) {
          const dx0 = touches[1].pageX - touches[0].pageX;
          const dy0 = touches[1].pageY - touches[0].pageY;
          const startDistance = Math.sqrt(dx0 * dx0 + dy0 * dy0);
          panZoom.startPinch(startDistance);
          setPinchTracking(true);
          return;
        }
        if (pinchTracking && touches.length === 2) {
          const dx = touches[1].pageX - touches[0].pageX;
          const dy = touches[1].pageY - touches[0].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          panZoom.updatePinch(distance);
          return;
        }
      }
      if (props.enablePanZoom && !pinchTracking && lastPan && activeTouches === 1) {
        const { locationX, locationY } = native;
        if (typeof locationX === 'number' && typeof locationY === 'number') {
          panZoom.updatePan(locationX, locationY, plotWidth, plotHeight);
          setLastPan({ x: locationX, y: locationY });
          evaluateNearestPoint(locationX - padding.left, locationY - padding.top);
        }
        return;
      }
      if (activeTouches === 1) {
        const { locationX, locationY } = native;
        if (typeof locationX === 'number' && typeof locationY === 'number') {
          evaluateNearestPoint(locationX - padding.left, locationY - padding.top);
        }
      }
    },
    onPanResponderRelease: () => {
      if (props.resetOnDoubleTap) {
        const now = Date.now();
        if (now - lastTapTime < 300) {
          setXDomainState(null);
          setYDomainState(null);
          setLastTapTime(0);
          // @ts-ignore
          props.onDomainChange?.(computedXDomain, computedYDomain);
        } else {
          setLastTapTime(now);
        }
      }
      panZoom.endPan();
      setLastPan(null);
      if (pinchTracking) { panZoom.endPinch(); setPinchTracking(false); }
      // fire domain change callback after gesture ends
      // @ts-ignore optional
      props.onDomainChange?.(xDomain, yDomain);
    },
    onPanResponderTerminationRequest: () => true,
  });

  // Handle chart interaction
  const handlePress = (event: any) => {
    if (disabled) return;

    const { locationX, locationY } = event.nativeEvent;
    const chartX = locationX - padding.left;
    const chartY = locationY - padding.top;

    // Check if we're clicking on an existing point
    const closest = chartSeries.flatMap(s => s.chartPoints.map(p => ({ series: s, p })))
      .reduce<{ distance: number; point: any } | null>((acc, cur) => {
        const dx = cur.p.chartX - chartX;
        const dy = cur.p.chartY - chartY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const threshold = (cur.p.size || pointSize) + 6;
        if (dist <= threshold) {
          if (!acc || dist < acc.distance) return { distance: dist, point: cur.p };
        }
        return acc;
      }, null);

    if (closest) {
      setSelectedPoint(closest.point);
      const interactionEvent: ChartInteractionEvent = {
        nativeEvent: event,
        chartX,
        chartY,
        dataPoint: closest.point,
        distance: closest.distance,
      };
      onDataPointPress?.(closest.point, interactionEvent);
      setPointer?.({ x: chartX, y: chartY, inside: true });
      if (enableCrosshair !== false) setCrosshair?.({ dataX: closest.point.x, pixelX: chartX });
    } else if (allowAddPoints && chartX >= 0 && chartX <= plotWidth && chartY >= 0 && chartY <= plotHeight) {
      // Add new point
      const dataCoords = chartToDataCoordinates(
        chartX,
        chartY,
        { x: 0, y: 0, width: plotWidth, height: plotHeight },
        paddedXDomain,
        paddedYDomain
      );

      const newPoint: ChartDataPoint = {
        id: Date.now(),
        x: Math.round(dataCoords.x * 100) / 100,
        y: Math.round(dataCoords.y * 100) / 100,
        color: pointColor || getColorFromScheme(data.length, colorSchemes.default),
      };

      setData([...data, newPoint]);
      setSelectedPoint(newPoint);
      setPointer?.({ x: chartX, y: chartY, inside: true });
      setCrosshair?.({ dataX: newPoint.x, pixelX: chartX });
    }

    const interactionEvent: ChartInteractionEvent = {
      nativeEvent: event,
      chartX,
      chartY,
    };
    onPress?.(interactionEvent);
  };

  // Handle point dragging (simplified - for full gesture support, use react-native-gesture-handler)
  const handlePointPanGesture = (event: any, point: any) => {
    if (!allowDragPoints || disabled) return;
    // Simplified drag handling - in production, implement with proper gesture library
  };

  // Ticks already computed earlier (xTicks, yTicks)

  return (
    <>
      {/* Title */}
      {(title || subtitle) && (
        <ChartTitle
          title={title}
          subtitle={subtitle}
        />
      )}

      {grid && (
        <ChartGrid
          grid={
            typeof grid === 'object' ? grid : { show: true, showMajor: true, showMinor: false }
          }
          plotWidth={plotWidth}
          plotHeight={plotHeight}
          xTicks={normalizedXTicks}
          yTicks={normalizedYTicks}
          padding={padding}
          useSVG={false} // ScatterChart is not fully SVG yet
        />
      )}

      {/* Axes */}
      {xAxis?.show !== false && plotWidth > 0 && (
        <Axis
          scale={axisScaleX}
          orientation="bottom"
          length={plotWidth}
          offset={{ x: padding.left, y: padding.top + plotHeight }}
          tickCount={xTicks.length}
          tickSize={xAxisTickSize}
          tickPadding={axisTickPadding}
          tickFormat={(value) => {
            const numeric = typeof value === 'number' ? value : Number(value);
            if (xAxis?.labelFormatter) return xAxis.labelFormatter(numeric);
            if (props.xScaleType === 'time') return new Date(numeric).toLocaleDateString();
            return formatNumber(numeric);
          }}
          showLabels={xAxis?.showLabels !== false}
          showTicks={xAxis?.showTicks !== false}
          stroke={xAxis?.color || theme.colors.grid}
          strokeWidth={xAxis?.thickness ?? 1}
          label={xAxis?.title}
          labelOffset={xAxis?.title ? (xAxis?.titleFontSize ?? 12) + 20 : 40}
          tickLabelColor={xAxis?.labelColor || resolvedTextColor}
          tickLabelFontSize={xAxis?.labelFontSize}
          labelColor={xAxis?.titleColor || theme.colors.textPrimary}
          labelFontSize={xAxis?.titleFontSize}
        />
      )}

      {yAxis?.show !== false && plotHeight > 0 && (
        <Axis
          scale={axisScaleY}
          orientation="left"
          length={plotHeight}
          offset={{ x: padding.left, y: padding.top }}
          tickCount={yTicks.length}
          tickSize={yAxisTickSize}
          tickPadding={axisTickPadding}
          tickFormat={(value) => {
            const numeric = typeof value === 'number' ? value : Number(value);
            if (yAxis?.labelFormatter) return yAxis.labelFormatter(numeric);
            if (props.yScaleType === 'time') return new Date(numeric).toLocaleDateString();
            return formatNumber(numeric);
          }}
          showLabels={yAxis?.showLabels !== false}
          showTicks={yAxis?.showTicks !== false}
          stroke={yAxis?.color || theme.colors.grid}
          strokeWidth={yAxis?.thickness ?? 1}
          label={yAxis?.title}
          labelOffset={yAxis?.title ? (yAxis?.titleFontSize ?? 12) + 20 : 30}
          tickLabelColor={yAxis?.labelColor || resolvedTextColor}
          tickLabelFontSize={yAxis?.labelFontSize}
          labelColor={yAxis?.titleColor || theme.colors.textPrimary}
          labelFontSize={yAxis?.titleFontSize}
          style={{ width: padding.left, height: plotHeight }}
        />
      )}

      {/* Chart interaction area */}
      <View
        style={{
          position: 'absolute',
          left: padding.left,
          top: padding.top,
          width: plotWidth,
          height: plotHeight,
        }}
        {...(!isWeb ? panResponder.panHandlers : {})}
        {...(!isWeb
          ? {
              onStartShouldSetResponder: () => true,
              onMoveShouldSetResponder: () => true,
            }
          : {})}
        // @ts-ignore web-only hover support
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          if ((props.enablePanZoom) && (e.buttons === 1)) { // actively dragging
            panZoom.updatePan(x, y, plotWidth, plotHeight);
          } else {
            evaluateNearestPoint(x, y);
          }
          setPointer?.({ x, y, inside: true, pageX: e.pageX, pageY: e.pageY });
          if (enableCrosshair !== false) {
            const dataX = xDomain[0] + (x / plotWidth) * (xDomain[1] - xDomain[0]);
            setCrosshair?.({ dataX, pixelX: x });
          }
        }}
        // @ts-ignore
        onMouseLeave={() => { setPointer?.(interaction?.pointer ? { ...interaction.pointer, inside: false } : null); setCrosshair?.(null); panZoom.endPan(); }}
        // @ts-ignore
        onMouseDown={(e) => {
          if (!props.enablePanZoom) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          panZoom.startPan(x, y);
        }}
        // @ts-ignore
        onMouseUp={() => {
          if (!props.enablePanZoom) return;
          panZoom.endPan();
          // @ts-ignore
          props.onDomainChange?.(xDomain, yDomain);
        }}
        // @ts-ignore wheel
        onWheel={props.enableWheelZoom ? (e: any) => {
          if (!props.enablePanZoom) return;
          if (e.cancelable) e.preventDefault();
          e.stopPropagation?.();
          const rect = e.currentTarget.getBoundingClientRect();
          const pointerX = (e.clientX - rect.left);
          const pointerY = (e.clientY - rect.top);
          panZoom.wheelZoom(e.deltaY, pointerX / plotWidth, pointerY / plotHeight);
        } : undefined}
      >
        <Pressable
          onPress={handlePress}
          style={{ flex: 1 }}
          android_disableSound
          {...(!isWeb ? panResponder.panHandlers : {})}
          collapsable={false}
        >
          {/* Quadrant background overlays */}
          {quadrantLayout && (
            <>
              {quadrantLayout.fills?.topLeft && quadrantLayout.leftWidth > 0 && quadrantLayout.topHeight > 0 && (
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: quadrantLayout.leftWidth,
                    height: quadrantLayout.topHeight,
                    backgroundColor: quadrantLayout.fills.topLeft,
                    opacity: quadrantLayout.fillOpacity,
                    zIndex: -1,
                  }}
                />
              )}
              {quadrantLayout.fills?.topRight && quadrantLayout.rightWidth > 0 && quadrantLayout.topHeight > 0 && (
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: quadrantLayout.xCoord,
                    top: 0,
                    width: quadrantLayout.rightWidth,
                    height: quadrantLayout.topHeight,
                    backgroundColor: quadrantLayout.fills.topRight,
                    opacity: quadrantLayout.fillOpacity,
                    zIndex: -1,
                  }}
                />
              )}
              {quadrantLayout.fills?.bottomLeft && quadrantLayout.leftWidth > 0 && quadrantLayout.bottomHeight > 0 && (
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: quadrantLayout.yCoord,
                    width: quadrantLayout.leftWidth,
                    height: quadrantLayout.bottomHeight,
                    backgroundColor: quadrantLayout.fills.bottomLeft,
                    opacity: quadrantLayout.fillOpacity,
                    zIndex: -1,
                  }}
                />
              )}
              {quadrantLayout.fills?.bottomRight && quadrantLayout.rightWidth > 0 && quadrantLayout.bottomHeight > 0 && (
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: quadrantLayout.xCoord,
                    top: quadrantLayout.yCoord,
                    width: quadrantLayout.rightWidth,
                    height: quadrantLayout.bottomHeight,
                    backgroundColor: quadrantLayout.fills.bottomRight,
                    opacity: quadrantLayout.fillOpacity,
                    zIndex: -1,
                  }}
                />
              )}

              {quadrantLayout.showLines && (
                <>
                  <View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      left: Math.min(Math.max(quadrantLayout.xCoord - quadrantLayout.lineWidth / 2, 0), Math.max(plotWidth - quadrantLayout.lineWidth, 0)),
                      top: 0,
                      width: quadrantLayout.lineWidth,
                      height: plotHeight,
                      backgroundColor: quadrantLayout.lineColor,
                      opacity: 0.5,
                    }}
                  />
                  <View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: Math.min(Math.max(quadrantLayout.yCoord - quadrantLayout.lineWidth / 2, 0), Math.max(plotHeight - quadrantLayout.lineWidth, 0)),
                      width: plotWidth,
                      height: quadrantLayout.lineWidth,
                      backgroundColor: quadrantLayout.lineColor,
                      opacity: 0.5,
                    }}
                  />
                </>
              )}

              {quadrantLayout.labels && (
                <>
                  {quadrantLayout.labels.topLeft && (
                    <Text
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        left: quadrantLayout.labelOffset,
                        top: quadrantLayout.labelOffset,
                        color: quadrantLayout.labelColor,
                        fontSize: quadrantLayout.labelFontSize,
                        fontFamily: theme.fontFamily,
                      }}
                    >
                      {quadrantLayout.labels.topLeft}
                    </Text>
                  )}
                  {quadrantLayout.labels.topRight && (
                    <Text
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        right: quadrantLayout.labelOffset,
                        top: quadrantLayout.labelOffset,
                        color: quadrantLayout.labelColor,
                        fontSize: quadrantLayout.labelFontSize,
                        fontFamily: theme.fontFamily,
                        textAlign: 'right',
                      }}
                    >
                      {quadrantLayout.labels.topRight}
                    </Text>
                  )}
                  {quadrantLayout.labels.bottomLeft && (
                    <Text
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        left: quadrantLayout.labelOffset,
                        bottom: quadrantLayout.labelOffset,
                        color: quadrantLayout.labelColor,
                        fontSize: quadrantLayout.labelFontSize,
                        fontFamily: theme.fontFamily,
                      }}
                    >
                      {quadrantLayout.labels.bottomLeft}
                    </Text>
                  )}
                  {quadrantLayout.labels.bottomRight && (
                    <Text
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        right: quadrantLayout.labelOffset,
                        bottom: quadrantLayout.labelOffset,
                        color: quadrantLayout.labelColor,
                        fontSize: quadrantLayout.labelFontSize,
                        fontFamily: theme.fontFamily,
                        textAlign: 'right',
                      }}
                    >
                      {quadrantLayout.labels.bottomRight}
                    </Text>
                  )}
                </>
              )}
            </>
          )}

          {/* Trend line */}
          {trendlines.map(tl => tl && (
            <View
              key={`trend-${tl.id}`}
              style={{
                position: 'absolute',
                left: tl.start.x,
                top: tl.start.y,
                width: calculateDistance(tl.start.x, tl.start.y, tl.end.x, tl.end.y),
                height: 2,
                backgroundColor: tl.color,
                opacity: 0.6,
                transform: [{
                  rotate: `${Math.atan2(tl.end.y - tl.start.y, tl.end.x - tl.start.x) * 180 / Math.PI}deg`
                }],
                transformOrigin: 'left center',
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* Data points */}
          {chartSeries.map(s => s.visible !== false ? s.chartPoints.map((point, index) => {
            const isSelected = selectedPoint?.id === point.id;
            const isDragged = draggedPoint?.id === point.id;
            const seriesPointSize = typeof s.pointSize === 'number' && Number.isFinite(s.pointSize) ? s.pointSize : pointSize;
            const rawPointSize = typeof point.size === 'number' && Number.isFinite(point.size) ? point.size : seriesPointSize;
            const resolvedPointSize = Math.max(2, rawPointSize);

            return (
              <AnimatedScatterPoint
                key={`point-${s.id}-${point.id || index}`}
                point={point}
                pointSize={resolvedPointSize}
                pointOpacity={pointOpacity}
                isSelected={isSelected}
                isDragged={isDragged}
                index={index}
                disabled={disabled}
                theme={theme}
                colorScheme={theme.colors.accentPalette}
                fallbackColor={s.pointColor || pointColor}
              />
            );
          }) : null)}

          {/* Crosshair overlays */}
          {crosshairEnabled && interaction?.crosshair && plotHeight > 0 && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: Math.max(0, Math.min(plotWidth - 1, interaction.crosshair.pixelX)),
                top: 0,
                height: plotHeight,
                width: 1,
                backgroundColor: theme.colors.grid || 'rgba(0,0,0,0.2)',
              }}
            />
          )}
          {crosshairEnabled && interaction?.pointer?.inside && typeof interaction.pointer?.y === 'number' && plotWidth > 0 && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                top: Math.max(0, Math.min(plotHeight - 1, interaction.pointer.y)),
                width: plotWidth,
                height: 1,
                backgroundColor: theme.colors.grid || 'rgba(0,0,0,0.2)',
              }}
            />
          )}

          {/* Selected point tooltip */}
          {selectedPoint && tooltip?.show !== false && !multiTooltip && (() => {
            const selectedChartPoint = chartSeries.flatMap(s => s.chartPoints).find(p => p.id === selectedPoint.id);
            if (!selectedChartPoint) return null;

            return (
              <View
                style={{
                  position: 'absolute',
                  left: selectedChartPoint.chartX,
                  top: selectedChartPoint.chartY - 50,
                  backgroundColor: tooltip?.backgroundColor || theme.colors.background,
                  padding: tooltip?.padding || 8,
                  borderRadius: tooltip?.borderRadius || 4,
                  alignItems: 'center',
                  transform: [{ translateX: -50 }], // Center the tooltip
                }}
              >
                <Text
                  style={{
                    fontSize: tooltip?.fontSize || 12,
                    color: tooltip?.textColor || theme.colors.textPrimary,
                    fontFamily: theme.fontFamily,
                  }}
                >
                  {tooltip?.formatter?.(selectedPoint) ||
                    (selectedPoint.label
                      ? `${selectedPoint.label}: ${formatNumber(selectedPoint.x)}, ${formatNumber(selectedPoint.y)}`
                      : `(${formatNumber(selectedPoint.x)}, ${formatNumber(selectedPoint.y)})`)}
                </Text>
              </View>
            );
          })()}
        </Pressable>
      </View>

      {/* Instructions for interactive features */}
      {(allowAddPoints || allowDragPoints) && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: theme.colors.textSecondary,
              fontFamily: theme.fontFamily,
              textAlign: 'center',
            }}
          >
            {allowAddPoints && 'Tap to add points'}
            {allowAddPoints && allowDragPoints && ' • '}
            {allowDragPoints && 'Drag to move points'}
          </Text>
        </View>
      )}

      {/* Legend */}
      {legend?.show && (
        <ChartLegend
          items={chartSeries.map((s, i) => ({
            label: s.name || `Series ${i + 1}`,
            color: s.color || theme.colors.accentPalette[i % theme.colors.accentPalette.length],
            visible: s.visible !== false,
          }))}
          position={legend.position}
          align={legend.align}
          textColor={legend.textColor}
          fontSize={legend.fontSize}
          onItemPress={(item, index, nativeEvent) => {
            const target = chartSeries[index];
            if (!target || !updateSeriesVisibility) return;
            const current = target.visible !== false;
            const isolate = nativeEvent?.shiftKey;
            if (isolate) {
              const visibleIds = chartSeries.filter(s => s.visible !== false).map(s => s.id);
              const isSole = visibleIds.length === 1 && visibleIds[0] === target.id;
              chartSeries.forEach(s => updateSeriesVisibility(s.id, isSole ? true : s.id === target.id));
            } else {
              updateSeriesVisibility(target.id, !current);
            }
          }}
        />
      )}
    </>
  );
};

export const ScatterChart: React.FC<ScatterChartProps> = (props) => {
  const {
    width = 400,
    height = 300,
    disabled = false,
    animationDuration = 800,
    animationEasing,
    style,
    multiTooltip,
    enableCrosshair,
    liveTooltip,
    useOwnInteractionProvider,
    suppressPopover,
    testID,
  } = props;
  const popoverProps = (props as any).popoverProps;

  const spacingProps: Partial<Record<SpacingPropKey, number>> = {};
  const spacingSource = props as Record<SpacingPropKey, number | undefined>;
  SPACING_PROP_KEYS.forEach((key) => {
    const value = spacingSource[key];
    if (value != null) {
      spacingProps[key] = value;
    }
  });

  const interactionConfig = useMemo(() => ({
    multiTooltip,
    enableCrosshair: enableCrosshair !== false,
    liveTooltip: liveTooltip !== false,
    enablePanZoom: props.enablePanZoom,
    zoomMode: props.zoomMode,
    minZoom: props.minZoom,
    wheelZoomStep: props.wheelZoomStep,
    resetOnDoubleTap: props.resetOnDoubleTap,
    clampToInitialDomain: props.clampToInitialDomain,
    invertPinchZoom: props.invertPinchZoom,
    invertWheelZoom: props.invertWheelZoom,
  }), [
    multiTooltip,
    enableCrosshair,
    liveTooltip,
    props.enablePanZoom,
    props.zoomMode,
    props.minZoom,
    props.wheelZoomStep,
    props.resetOnDoubleTap,
    props.clampToInitialDomain,
    props.invertPinchZoom,
    props.invertWheelZoom,
  ]);

  return (
    <ChartContainer
      width={width}
      height={height}
      disabled={disabled}
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      style={style}
      interactionConfig={interactionConfig}
      useOwnInteractionProvider={useOwnInteractionProvider}
      suppressPopover={suppressPopover}
      testID={testID}
      popoverProps={popoverProps}
      {...spacingProps}
    >
      <ScatterChartInner
        {...props}
        width={width}
        height={height}
        disabled={disabled}
        animationDuration={animationDuration}
      />
    </ChartContainer>
  );
};

ScatterChart.displayName = 'ScatterChart';
