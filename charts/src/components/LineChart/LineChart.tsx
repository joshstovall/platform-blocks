import React, { useState, useEffect, useCallback } from 'react';
import { View, Pressable, Text, PanResponder, GestureResponderEvent, PanResponderGestureState, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  useAnimatedProps,
  interpolate
} from 'react-native-reanimated';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G
} from 'react-native-svg';

// Create animated SVG components
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const resolveEasing = (preset?: string) => {
  switch (preset) {
    case 'linear':
      return Easing.linear;
    case 'ease-in':
      return Easing.in(Easing.cubic);
    case 'ease-in-out':
      return Easing.inOut(Easing.cubic);
    case 'ease-out':
      return Easing.out(Easing.cubic);
    case 'bounce':
      return Easing.bounce;
    case 'elastic':
      return Easing.elastic(1);
    default:
      return Easing.out(Easing.cubic);
  }
};

// Animated point component (encapsulates hook usage)
const AnimatedPoint: React.FC<{ point: any; animationProgress: any; selected: boolean; color: string; pointSize: number; }> = ({ point, animationProgress, selected, color, pointSize }) => {
  const animatedCircleProps = useAnimatedProps(() => ({
    opacity: animationProgress.value,
    r: (selected ? 1.5 : 1) * pointSize,
  }));
  return (
    <AnimatedCircle
      cx={point.chartX}
      cy={point.chartY}
      fill={point.color || color}
      stroke="white"
      strokeWidth={1}
      animatedProps={animatedCircleProps}
    />
  );
};

// Animated line series component
const AnimatedLineSeries: React.FC<{
  seriesData: any;
  seriesIndex: number;
  animationProgress: any;
  plotHeight: number;
  shouldFill: boolean;
  seriesSmooth: boolean;
  theme: any;
  gradientId: string;
  selectedPoint: any;
  lineThickness: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  showPoints: boolean;
  pointSize: number;
}> = ({
  seriesData,
  seriesIndex,
  animationProgress,
  plotHeight,
  shouldFill,
  seriesSmooth,
  theme,
  gradientId,
  selectedPoint,
  lineThickness,
  lineStyle,
  showPoints,
  pointSize,
}) => {
  if (seriesData.visible === false || seriesData.chartPoints.length === 0) return null;

  const seriesLineColor = seriesData.color || theme.colors.accentPalette[seriesIndex % theme.colors.accentPalette.length];
  const seriesLineThickness = seriesData.lineThickness ?? seriesData.thickness ?? lineThickness;
  const resolvedStyle: 'solid' | 'dashed' | 'dotted' = seriesData.lineStyle || seriesData.style || lineStyle;
  const dashPattern = resolvedStyle === 'dashed' ? [8, 6] : resolvedStyle === 'dotted' ? [2, 6] : undefined;
  const seriesPointColor = seriesData.pointColor || seriesLineColor;
  const linePath = createSVGPath(seriesData.chartPoints, seriesSmooth);

  const animatedPathProps = useAnimatedProps(() => {
    const progress = animationProgress.value;
    if (progress >= 1) {
      return { strokeDashoffset: 0 } as any;
    }
    let totalLength = 0;
    const pts = seriesData.chartPoints;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const dx = curr.chartX - prev.chartX;
      const dy = curr.chartY - prev.chartY;
      totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    const pathLength = Math.max(totalLength, 1);
    return {
      strokeDasharray: `${pathLength}`,
      strokeDashoffset: pathLength * (1 - progress),
    } as any;
  });

  const animatedFillProps = useAnimatedProps(() => ({ opacity: animationProgress.value }));

  return (
    <G key={seriesData.id || seriesIndex}>
      {shouldFill && seriesData.chartPoints.length > 1 && (
        <AnimatedPath
          d={createFillPath(seriesData.chartPoints, plotHeight, seriesSmooth)}
          fill={`url(#${gradientId})`}
       animatedProps={animatedFillProps}
       // Gradient handles opacity and fade
        />
      )}
      <AnimatedPath
        d={linePath}
        stroke={seriesLineColor}
        strokeWidth={seriesLineThickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={dashPattern}
        animatedProps={animatedPathProps}
      />
      {showPoints && seriesData.chartPoints.map((point: any, pointIndex: number) => (
        <AnimatedPoint
          key={`point-${seriesIndex}-${pointIndex}`}
          point={point}
          animationProgress={animationProgress}
          selected={selectedPoint?.id === point.id}
          color={seriesPointColor}
          pointSize={seriesData.pointSize || pointSize}
        />
      ))}
    </G>
  );
};

// Helper function to create SVG path from data points
const createSVGPath = (points: Array<{ chartX: number; chartY: number }>, smooth: boolean = false): string => {
  if (points.length === 0) return '';

  if (smooth) {
    // Convert chartX/chartY to x/y for createSmoothPath
    const convertedPoints = points.map(p => ({ x: p.chartX, y: p.chartY }));
    return createSmoothPath(convertedPoints);
  }

  let path = `M ${points[0].chartX} ${points[0].chartY}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].chartX} ${points[i].chartY}`;
  }
  return path;
};

// Helper function to create fill area path
const createFillPath = (points: Array<{ chartX: number; chartY: number }>, plotHeight: number, smooth: boolean = false): string => {
  if (points.length === 0) return '';

  const linePath = smooth ?
    createSmoothPath(points.map(p => ({ x: p.chartX, y: p.chartY }))) :
    createSVGPath(points, false);

  // Close the path to the bottom
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return `${linePath} L ${lastPoint.chartX} ${plotHeight} L ${firstPoint.chartX} ${plotHeight} Z`;
};
import { useChartTheme } from '../../theme/ChartThemeContext';
import { LineChartProps, ChartInteractionEvent, ChartDataPoint, LineChartSeries } from '../../types';
import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { ChartGrid } from '../../core/ChartGrid';
import type { Scale } from '../../utils/scales';
import { Axis } from '../../core/Axis';
import {
  scaleLinear,
  scaleLog,
  scaleTime,
  generateTicks,
  generateLogTicks,
  generateTimeTicks,
  getDataDomain,
  getMultiSeriesDomain,
  normalizeLineChartData,
  dataToChartCoordinates,
  createSmoothPath,
  getColorFromScheme,
  colorSchemes,
  formatNumber
} from '../../utils';
import { useNearestPoint } from '../../hooks/useNearestPoint';
import { usePanZoom } from '../../hooks/usePanZoom';
// Removed per-series hook-based decimation to avoid nested hook calls; using pure helper instead.

export const LineChart: React.FC<LineChartProps> = (props) => {
  const {
    data,
    series,
    width = 400,
    height = 300,
    lineColor,
    lineThickness = 2,
    lineStyle = 'solid',
    showPoints = true,
    pointSize = 4,
    pointColor,
    smooth = false,
    fill = false,
    fillColor,
    fillOpacity = 0.3,
    areaFillMode = 'single',
    title,
    subtitle,
    xAxis,
    yAxis,
    grid,
    legend,
    tooltip,
  annotations,
    animation,
    disableAnimations,
    onPress,
    onDataPointPress,
    disabled = false,
    animationDuration = 1000,
    style,
    ...rest
  } = props;

  const theme = useChartTheme();
  const chartInstanceIdRef = React.useRef<string>('');
  if (!chartInstanceIdRef.current) {
    chartInstanceIdRef.current = `linechart-${Math.random().toString(36).slice(2, 10)}`;
  }
  const chartInstanceId = chartInstanceIdRef.current;
  const isWeb = Platform.OS === 'web';
  const defaultScheme = colorSchemes.default;
  const animationProgress = useSharedValue(0);
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  // Store the full chart-space point (with chartX/chartY & color) for rendering highlight even when showPoints=false
  const [highlightPoint, setHighlightPoint] = useState<{ chartX: number; chartY: number; color: string; id?: any; seriesId?: any } | null>(null);
  // use shared interaction context (optional if not wrapped by provider externally)
  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try { interaction = useChartInteractionContext(); } catch {
    console.warn('LineChart: useChartInteractionContext must be used inside a ChartInteractionProvider context');
  }
  const setSharedCrosshair = interaction?.setCrosshair;
  const sharedConfig = interaction?.config;
  const wantsSharedCrosshair = React.useMemo(() => !!(props.enableCrosshair || sharedConfig?.multiTooltip), [props.enableCrosshair, sharedConfig?.multiTooltip]);
  const registerSeries = interaction?.registerSeries;
  const updateSeriesVisibility = interaction?.updateSeriesVisibility;
  const setPointer = interaction?.setPointer;
  const initializeDomains = interaction?.initializeDomains;
  const setDomains = interaction?.setDomains;
  // Visibility now driven by interaction context; local map removed to avoid double state causing loops
  const [xDomainState, setXDomainState] = useState<[number, number] | null>(null);
  const [yDomainState, setYDomainState] = useState<[number, number] | null>(null);
  // Pan/zoom state now driven via usePanZoom hook (removing local gesture math duplication)
  const [lastPan, setLastPan] = useState<{ x: number; y: number } | null>(null); // still used for web mouse fallback
  const [pinchTracking, setPinchTracking] = useState(false); // flag to delegate to hook
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  // Web fallback for mouse drag (PanResponder can be flaky with Pressable)
  const [isMousePanning, setIsMousePanning] = useState(false);
  const [brushStart, setBrushStart] = useState<{ x: number; y: number } | null>(null);
  const [brushCurrent, setBrushCurrent] = useState<{ x: number; y: number } | null>(null);

  // Normalize data input to series format (memoized so domain/pan changes don't recreate array)
  const normalizedSeries = React.useMemo(() => normalizeLineChartData(data, series), [data, series]);

  // Apply optional decimation per series (pure, safe for hooks)
  const decimationThreshold = props.decimationThreshold ?? 2000;
  const decimatedSeries = React.useMemo(() => {
    if (!decimationThreshold) return normalizedSeries;
    const decimate = (dataPoints: any[], threshold: number) => {
      if (!dataPoints || dataPoints.length <= threshold) return dataPoints;
      // LTOB simplified
      const sampled: any[] = [];
      const bucketSize = (dataPoints.length - 2) / (threshold - 2);
      let a = 0;
      sampled.push(dataPoints[a]);
      for (let i = 0; i < threshold - 2; i++) {
        const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
        const rangeEnd = Math.floor((i + 2) * bucketSize) + 1;
        const range = dataPoints.slice(rangeStart, Math.min(rangeEnd, dataPoints.length - 1));
        const pointA = dataPoints[a];
        let maxArea = -1;
        let nextA = a;
        for (let j = 0; j < range.length; j++) {
          const point = range[j];
          const area = Math.abs((pointA.x - point.x) * (pointA.y - point.y));
          if (area > maxArea) { maxArea = area; nextA = rangeStart + j; }
        }
        sampled.push(dataPoints[nextA]);
        a = nextA;
      }
      sampled.push(dataPoints[dataPoints.length - 1]);
      return sampled;
    };
    return normalizedSeries.map(s => ({ ...s, data: decimate(s.data as any, decimationThreshold) }));
  }, [normalizedSeries, decimationThreshold]);

  const animationSignature = React.useMemo(() => {
    return decimatedSeries
      .map((seriesItem, seriesIndex) => {
        const id = seriesItem.id ?? seriesIndex;
        const dataKey = (seriesItem.data || [])
          .map(point => `${point.x}:${point.y}`)
          .join('|');
        return `${id}:${dataKey}`;
      })
      .join('||');
  }, [decimatedSeries]);

  const supportsDrawAnimation = React.useMemo(() => {
    const type = animation?.type;
    if (type == null) return true;
    return type === 'draw' || type === 'drawOn' || type === 'wave';
  }, [animation?.type]);

  React.useEffect(() => {
    if (!supportsDrawAnimation || disableAnimations) {
      animationProgress.value = 1;
      return;
    }

    const resolvedDuration = animation?.duration ?? animationDuration ?? 1000;
    const resolvedDelay = Math.max(0, animation?.delay ?? 0);
    const easingPreset = animation?.easing ?? props.animationEasing;
    const easingFn = resolveEasing(easingPreset);

    animationProgress.value = 0;

    const timing = withTiming(1, {
      duration: Math.max(1, resolvedDuration),
      easing: easingFn,
    });

    animationProgress.value = resolvedDelay > 0 ? withDelay(resolvedDelay, timing) : timing;
  }, [animationProgress, animationSignature, animation?.duration, animation?.delay, animation?.easing, animationDuration, props.animationEasing, disableAnimations, supportsDrawAnimation]);

  // Calculate data bounds from all series
  const computedXDomain = getMultiSeriesDomain(decimatedSeries, d => d.x);
  const computedYDomain = getMultiSeriesDomain(decimatedSeries, d => d.y);
  const rawXDomain = xDomainState || computedXDomain;
  const rawYDomain = yDomainState || computedYDomain;
  const clampToInitial = props.clampToInitialDomain;

  const clampDomain = (domain: [number, number], base: [number, number]) => {
    if (!clampToInitial) return domain;
    const width = domain[1] - domain[0];
    const baseWidth = base[1] - base[0];
    // If larger than base, just return base
    if (width >= baseWidth) return base;
    const min = Math.max(base[0], Math.min(domain[0], base[1] - width));
    const max = min + width;
    return [min, max] as [number, number];
  };

  const xDomain = clampDomain(rawXDomain, computedXDomain);
  const yDomain = clampDomain(rawYDomain, computedYDomain);
  // Push initial domains to context once (only if provider exists and not yet set)
  React.useEffect(() => {
    if (initializeDomains && interaction?.domains == null) {
      initializeDomains({ x: xDomain, y: yDomain });
    }
  }, [initializeDomains, xDomain, yDomain, interaction?.domains]);

  // Chart dimensions - adjust padding based on legend position to prevent overlap
  const basePadding = { top: 40, right: 20, bottom: 60, left: 80 };
  const legendPadding = React.useMemo(() => {
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
  const padding = legendPadding;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Scale helpers based on prop
  const xScaleFn = React.useCallback((v: number, domain: [number, number], range: [number, number]) => {
    switch (props.xScaleType) {
      case 'log': return scaleLog(Math.max(v, 1e-12), domain, range);
      case 'time': return scaleTime(v, domain, range);
      default: return scaleLinear(v, domain, range);
    }
  }, [props.xScaleType]);
  const yScaleFn = React.useCallback((v: number, domain: [number, number], range: [number, number]) => {
    switch (props.yScaleType) {
      case 'log': return scaleLog(Math.max(v, 1e-12), domain, range);
      case 'time': return scaleTime(v, domain, range);
      default: return scaleLinear(v, domain, range);
    }
  }, [props.yScaleType]);

  // Animation effect
  // Build a lightweight signature of the data (series id + length)
  const chartSeriesData = React.useMemo(() => {
    return decimatedSeries.map((seriesItem, seriesIndex) => {
      const ctxVis = interaction?.series.find(sr => sr.id === (seriesItem.id ?? seriesIndex))?.visible;
      if (ctxVis === false) {
        return {
          ...seriesItem,
          chartPoints: [],
          color: seriesItem.color || getColorFromScheme(seriesIndex, defaultScheme),
          visible: false,
          areaFill: seriesItem.areaFill,
          fillColor: seriesItem.fillColor,
          fillOpacity: seriesItem.fillOpacity,
          smooth: seriesItem.smooth,
        };
      }

      const chartPoints = seriesItem.data.map((point) => {
        const coords = dataToChartCoordinates(
          point.x,
          point.y,
          { x: 0, y: 0, width: plotWidth, height: plotHeight },
          xDomain,
          yDomain
        );
        return { ...point, chartX: coords.x, chartY: coords.y };
      });

      const visibleFlag = ctxVis === undefined ? true : ctxVis === true; // normalize to boolean
      return {
        ...seriesItem,
        chartPoints,
        color: seriesItem.color || getColorFromScheme(seriesIndex, defaultScheme),
        visible: visibleFlag,
        areaFill: seriesItem.areaFill,
        fillColor: seriesItem.fillColor,
        fillOpacity: seriesItem.fillOpacity,
        smooth: seriesItem.smooth,
      };
    });
  }, [decimatedSeries, interaction?.series, plotWidth, plotHeight, xDomain, yDomain, defaultScheme]);
  const filledSeriesIndices = React.useMemo(() => {
    return chartSeriesData.reduce<number[]>((indices, seriesData, seriesIndex) => {
      const fillPreference = seriesData.areaFill;
      const baseFill = fillPreference !== undefined
        ? (fill ? fillPreference : false)
        : (fill && (areaFillMode === 'series' ? true : seriesIndex === 0));
      if (baseFill && seriesData.chartPoints.length > 1) {
        indices.push(seriesIndex);
      }
      return indices;
    }, [] as number[]);
  }, [chartSeriesData, fill, areaFillMode]);

  const filledSeriesSet = React.useMemo(() => new Set(filledSeriesIndices), [filledSeriesIndices]);

  const gradientConfigs = React.useMemo(() => {
    return filledSeriesIndices.map(seriesIndex => {
      const seriesData = chartSeriesData[seriesIndex];
      const gradientId = `${chartInstanceId}-gradient-${seriesData.id ?? seriesIndex}`;
      const gradientColor = seriesData.fillColor || fillColor || seriesData.color || theme.colors.accentPalette[seriesIndex % theme.colors.accentPalette.length];
      const gradientOpacity = seriesData.fillOpacity ?? fillOpacity;
      return { id: gradientId, color: gradientColor, opacity: gradientOpacity, seriesIndex };
    });
  }, [chartSeriesData, chartInstanceId, filledSeriesIndices, fillColor, fillOpacity, theme]);

  const shouldRenderGradients = gradientConfigs.length > 0;

  // Register series with interaction context (points in data coords only)
  React.useEffect(() => {
    if (!registerSeries) return;
    chartSeriesData.forEach((s, i) => {
      const points = s.chartPoints?.map((point: any, idx: number) => {
        const raw = s.data[idx];
        return {
          x: point.x,
          y: point.y,
          pixelX: point.chartX,
          pixelY: point.chartY,
          meta: {
            ...raw,
            chartX: point.chartX,
            chartY: point.chartY,
          },
        };
      }) ?? s.data.map((p) => ({ x: p.x, y: p.y, meta: p }));
      registerSeries({
        id: s.id ?? i,
        name: s.name || `Series ${i + 1}`,
        color: s.color,
        points,
        visible: s.visible !== false,
      });
    });
  }, [registerSeries, chartSeriesData]);

  // Handle chart interaction
  const nearestPoint = useNearestPoint(chartSeriesData as any, xDomain, yDomain, plotWidth, plotHeight);

  const pointerToDataX = React.useCallback((chartX: number) => {
    if (plotWidth <= 0) return xDomain[0];
    const clamped = Math.max(0, Math.min(plotWidth, chartX));
    const span = xDomain[1] - xDomain[0];
    if (props.xScaleType === 'log') {
      const safeMin = Math.max(xDomain[0], 1e-12);
      const safeMax = Math.max(xDomain[1], 1e-12);
      const logMin = Math.log(safeMin);
      const logMax = Math.log(safeMax);
      if (logMax === logMin) return safeMin;
      const ratio = clamped / Math.max(plotWidth, 1);
      return Math.exp(logMin + (logMax - logMin) * ratio);
    }
    return xDomain[0] + (span === 0 ? 0 : (clamped / Math.max(plotWidth, 1)) * span);
  }, [plotWidth, props.xScaleType, xDomain]);

  const updateCrosshairFromPointer = React.useCallback((chartX: number) => {
    if (!wantsSharedCrosshair || !setSharedCrosshair) return;
    const dataX = pointerToDataX(chartX);
    const clampedX = Math.max(0, Math.min(plotWidth, chartX));
    setSharedCrosshair({ dataX, pixelX: clampedX });
  }, [pointerToDataX, plotWidth, setSharedCrosshair, wantsSharedCrosshair]);

  const evaluateNearestPoint = useCallback((chartX: number, chartY: number, nativeEvent?: any, fireCallbacks: boolean = false) => {
    updateCrosshairFromPointer(chartX);
    const closestPoint = nearestPoint(chartX, chartY, 30) as any;
    if (closestPoint) {
      const dp = closestPoint.dataPoint;
      setSelectedPoint(dp);
      // Resolve rendered chart coordinates & color from current series (so highlight uses exact point position)
      let resolved: { chartX: number; chartY: number; color: string; id?: any; seriesId?: any } | null = null;
      for (const s of chartSeriesData) {
        if (!s.chartPoints) continue;
        const hit = s.chartPoints.find((p: any) => (p.id != null && dp.id != null ? p.id === dp.id : (p.x === dp.x && p.y === dp.y)));
        if (hit) { resolved = { chartX: hit.chartX, chartY: hit.chartY, color: hit.color || s.color, id: hit.id, seriesId: s.id ?? undefined }; break; }
      }
      if (resolved) {
        // Only update pointer & crosshair if anchor actually changed (reduces churn & drives tooltip movement policy)
        const pointerChanged = !highlightPoint || highlightPoint.chartX !== resolved.chartX || highlightPoint.chartY !== resolved.chartY;
        if (pointerChanged) {
          setPointer?.({ x: resolved.chartX, y: resolved.chartY, inside: true });
          setHighlightPoint(resolved);
        }
      }
      if (fireCallbacks && nativeEvent) {
        const interactionEvent: ChartInteractionEvent = {
          nativeEvent,
          chartX,
          chartY,
          dataPoint: dp,
          distance: closestPoint.distance,
        };
        onDataPointPress?.(dp, interactionEvent);
      }
    } else if (fireCallbacks) {
      if (interaction?.pointer) {
        setPointer?.({ ...interaction.pointer, inside: true });
      }
      setHighlightPoint(null);
    }
  }, [nearestPoint, onDataPointPress, interaction?.pointer, chartSeriesData, highlightPoint, updateCrosshairFromPointer]);

  const handlePress = (event: any) => {
    if (disabled) return;

    const { locationX, locationY } = event.nativeEvent;
    const chartX = locationX - padding.left;
    const chartY = locationY - padding.top;
    evaluateNearestPoint(chartX, chartY, event, true);
    const interactionEvent: ChartInteractionEvent = {
      nativeEvent: event,
      chartX,
      chartY,
    };
    onPress?.(interactionEvent);
  };

  // PanResponder for live tooltip / future pan-zoom
  // Pan/Zoom hook abstraction
  const panZoom = usePanZoom(
    { xDomain: xDomain, yDomain: yDomain },
    (next) => {
      if (next.xDomain) {
        setXDomainState(next.xDomain);
        setDomains?.({ x: next.xDomain });
      }
      if (next.yDomain) {
        setYDomainState(next.yDomain);
        setDomains?.({ y: next.yDomain });
      }
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
      // Pinch start (either touches length OR gestureState.numberActiveTouches)
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
      // Single pointer start
      const { locationX, locationY } = native;
      if (typeof locationX === 'number' && typeof locationY === 'number') {
        setLastPan({ x: locationX, y: locationY });
        panZoom.startPan(locationX, locationY);
        if (props.liveTooltip || sharedConfig?.multiTooltip || props.enableCrosshair) {
          evaluateNearestPoint(locationX - padding.left, locationY - padding.top, e, false);
        }
        setPointer?.({ x: locationX - padding.left, y: locationY - padding.top, inside: true });
      }
    },
    onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const native: any = evt.nativeEvent || {};
      const touches = native.touches || [];
      const activeTouches = touches.length || gestureState.numberActiveTouches;
      // Initiate pinch mid-gesture if second finger added
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
      // Pan (only when not pinching)
      if (props.enablePanZoom && !pinchTracking && lastPan && activeTouches === 1) {
        const { locationX, locationY } = native;
        if (typeof locationX === 'number' && typeof locationY === 'number') {
          panZoom.updatePan(locationX, locationY, plotWidth, plotHeight);
          setLastPan({ x: locationX, y: locationY });
          if (props.liveTooltip || sharedConfig?.multiTooltip || props.enableCrosshair) {
            evaluateNearestPoint(locationX - padding.left, locationY - padding.top, evt, false);
          }
          setPointer?.({ x: locationX - padding.left, y: locationY - padding.top, inside: true });
        }
        return;
      }
      // Live tooltip only
      if ((props.liveTooltip || sharedConfig?.multiTooltip || props.enableCrosshair) && activeTouches === 1) {
        const { locationX, locationY } = native;
        if (typeof locationX === 'number' && typeof locationY === 'number') {
          evaluateNearestPoint(locationX - padding.left, locationY - padding.top, evt, false);
          setPointer?.({ x: locationX - padding.left, y: locationY - padding.top, inside: true });
        }
      }
    },
    onPanResponderRelease: (e) => {
      // Double tap / click reset detection
      if (props.resetOnDoubleTap) {
        const now = Date.now();
        if (now - lastTapTime < 300) { // double within 300ms
          setXDomainState(null);
          setYDomainState(null);
          setSharedCrosshair?.(null);
          setSelectedPoint(null);
          props.onDomainChange?.(computedXDomain, computedYDomain);
          setLastTapTime(0);
        } else {
          setLastTapTime(now);
        }
      }
      panZoom.endPan();
      setLastPan(null);
      if (pinchTracking) {
        panZoom.endPinch();
        setPinchTracking(false);
      }
      props.onDomainChange?.(xDomain, yDomain);
      if (interaction?.pointer) {
        setPointer?.({ ...interaction.pointer, inside: false });
      }
    },
    onPanResponderTerminationRequest: () => true,
  });

  // Generate ticks for axes
  const xTicks = React.useMemo(() => {
    switch (props.xScaleType) {
      case 'log': return generateLogTicks(xDomain, 6);
      case 'time': return generateTimeTicks(xDomain, 6);
      default: return generateTicks(xDomain[0], xDomain[1], 6);
    }
  }, [xDomain, props.xScaleType]);
  const yTicks = React.useMemo(() => {
    switch (props.yScaleType) {
      case 'log': return generateLogTicks(yDomain, 5);
      case 'time': return generateTimeTicks(yDomain, 5);
      default: return generateTicks(yDomain[0], yDomain[1], 5);
    }
  }, [yDomain, props.yScaleType]);

  // Convert ticks to normalized positions (0-1) for ChartGrid
  const normalizedXTicks = xTicks.map(tick => xScaleFn(tick, xDomain, [0, 1]));
  const normalizedYTicks = yTicks.map(tick => yScaleFn(tick, yDomain, [1, 0])); // Inverted for chart coordinates

  const axisScaleX = React.useMemo<Scale<number>>(() => {
    const range: [number, number] = [0, Math.max(plotWidth, 0)];
    const scale = ((value: number) => xScaleFn(value, xDomain, range)) as Scale<number>;
    scale.domain = () => [...xDomain];
    scale.range = () => [...range];
    scale.ticks = () => (xTicks.length ? xTicks : [xDomain[0], xDomain[1]]);
    scale.invert = (pixel: number) => {
      const [domainMin, domainMax] = xDomain;
      if (range[1] === range[0]) return domainMin;
      const clamped = Math.max(range[0], Math.min(range[1], pixel));
      const ratio = (clamped - range[0]) / (range[1] - range[0]);
      if (props.xScaleType === 'log') {
        const logMin = Math.log(Math.max(domainMin, 1e-12));
        const logMax = Math.log(Math.max(domainMax, 1e-12));
        if (logMax === logMin) return Math.exp(logMin);
        return Math.exp(logMin + (logMax - logMin) * ratio);
      }
      return domainMin + (domainMax - domainMin) * ratio;
    };
    return scale;
  }, [plotWidth, xScaleFn, xDomain, xTicks, props.xScaleType]);

  const axisScaleY = React.useMemo<Scale<number>>(() => {
    const range: [number, number] = [Math.max(plotHeight, 0), 0];
    const scale = ((value: number) => yScaleFn(value, yDomain, range)) as Scale<number>;
    scale.domain = () => [...yDomain];
    scale.range = () => [...range];
    scale.ticks = () => (yTicks.length ? yTicks : [yDomain[0], yDomain[1]]);
    return scale;
  }, [plotHeight, yScaleFn, yDomain, yTicks]);


  const xAxisTickSize = xAxis?.tickLength ?? 4;
  const yAxisTickSize = yAxis?.tickLength ?? 4;
  const axisTickPadding = 4;

  return (
    <ChartContainer
      width={width}
      height={height}
      disabled={disabled}
      animationDuration={animationDuration}
      style={style}
      interactionConfig={{
        enablePanZoom: props.enablePanZoom,
        zoomMode: props.zoomMode,
        minZoom: props.minZoom,
        wheelZoomStep: props.wheelZoomStep,
        resetOnDoubleTap: props.resetOnDoubleTap,
        clampToInitialDomain: props.clampToInitialDomain,
        invertPinchZoom: props.invertPinchZoom,
        invertWheelZoom: props.invertWheelZoom,
        enableCrosshair: props.enableCrosshair,
        liveTooltip: props.liveTooltip,
        multiTooltip: props.multiTooltip,
      }}
      {...rest}
    >
      {/* Title */}
      {(title || subtitle) && (
        <ChartTitle
          title={title}
          subtitle={subtitle}
        />
      )}

      {/* Grid lines */}
      {grid && (
        <ChartGrid
          grid={grid}
          plotWidth={plotWidth}
          plotHeight={plotHeight}
          xTicks={normalizedXTicks}
          yTicks={normalizedYTicks}
          padding={padding}
          useSVG={true}
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
          tickFormat={(value) =>
            xAxis?.labelFormatter ? xAxis.labelFormatter(Number(value)) : formatNumber(Number(value))
          }
          showLabels={xAxis?.showLabels !== false}
          showTicks={xAxis?.showTicks !== false}
          stroke={xAxis?.color || theme.colors.grid}
          strokeWidth={xAxis?.thickness ?? 1}
          label={xAxis?.title}
          labelOffset={xAxis?.title ? (xAxis?.titleFontSize ?? 12) + 20 : 40}
          tickLabelColor={xAxis?.labelColor}
          tickLabelFontSize={xAxis?.labelFontSize}
          labelColor={xAxis?.titleColor}
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
          tickFormat={(value) =>
            yAxis?.labelFormatter ? yAxis.labelFormatter(Number(value)) : formatNumber(Number(value))
          }
          showLabels={yAxis?.showLabels !== false}
          showTicks={yAxis?.showTicks !== false}
          stroke={yAxis?.color || theme.colors.grid}
          strokeWidth={yAxis?.thickness ?? 1}
          label={yAxis?.title}
          labelOffset={yAxis?.title ? (yAxis?.titleFontSize ?? 12) + 20 : 30}
          style={{ width: padding.left, height: plotHeight }}
          tickLabelColor={yAxis?.labelColor}
          tickLabelFontSize={yAxis?.labelFontSize}
          labelColor={yAxis?.titleColor}
          labelFontSize={yAxis?.titleFontSize}
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
        // Web mouse fallback handlers
        // @ts-ignore - web only events
        onMouseDown={(e) => {
          try {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (props.enableBrushZoom && e.shiftKey) {
              setBrushStart({ x, y });
              setBrushCurrent({ x, y });
              return;
            }
            if (!props.enablePanZoom) return;
            setLastPan({ x, y });
            setIsMousePanning(true);
            panZoom.startPan(x, y);
            setPointer?.({ x, y, inside: true });
          } catch {
            console.warn('LineChart: onMouseDown event handling failed')
          }
        }}
        // @ts-ignore
        onMouseLeave={(e) => { if (isMousePanning) { setIsMousePanning(false); setLastPan(null); } if (interaction?.pointer) { setPointer?.({ ...interaction.pointer, inside: false }); } setSharedCrosshair?.(null); setBrushStart(null); setBrushCurrent(null); }}
        // @ts-ignore
        onMouseUp={(e) => {
          if (props.enableBrushZoom && brushStart && brushCurrent) {
            const x0 = Math.min(brushStart.x, brushCurrent.x);
            const x1 = Math.max(brushStart.x, brushCurrent.x);
            const y0 = Math.min(brushStart.y, brushCurrent.y);
            const y1 = Math.max(brushStart.y, brushCurrent.y);
            const dataX0 = xDomain[0] + (x0 / plotWidth) * (xDomain[1] - xDomain[0]);
            const dataX1 = xDomain[0] + (x1 / plotWidth) * (xDomain[1] - xDomain[0]);
            const dataY1 = yDomain[1] - (y0 / plotHeight) * (yDomain[1] - yDomain[0]);
            const dataY0 = yDomain[1] - (y1 / plotHeight) * (yDomain[1] - yDomain[0]);
            setXDomainState([dataX0, dataX1]);
            setYDomainState([dataY0, dataY1]);
            props.onDomainChange?.([dataX0, dataX1], [dataY0, dataY1]);
          }
          setBrushStart(null); setBrushCurrent(null);
          if (isMousePanning) { setIsMousePanning(false); setLastPan(null); panZoom.endPan(); props.onDomainChange?.(xDomain, yDomain); }
          if (interaction?.pointer) { setPointer?.({ ...interaction.pointer, inside: true }); }
        }}
        // @ts-ignore
        onMouseMove={(e) => {
          try {
            const rect = e.currentTarget.getBoundingClientRect();
            const locationX = e.clientX - rect.left;
            const locationY = e.clientY - rect.top;
            if (props.enableBrushZoom && brushStart) { setBrushCurrent({ x: locationX, y: locationY }); return; }
            // Hover (not panning)
            if (!isMousePanning) {
              if (props.liveTooltip || sharedConfig?.multiTooltip || props.enableCrosshair) {
                evaluateNearestPoint(locationX, locationY, e, false);
                setPointer?.({ x: locationX, y: locationY, inside: true, pageX: e.pageX, pageY: e.pageY });
              }
              return;
            }
            // Panning mode
            if (!lastPan) return;
            panZoom.updatePan(locationX, locationY, plotWidth, plotHeight);
            setLastPan({ x: locationX, y: locationY });
            if (props.liveTooltip) {
              evaluateNearestPoint(locationX, locationY, e, false);
            }
            setPointer?.({ x: locationX, y: locationY, inside: true, pageX: e.pageX, pageY: e.pageY });
          } catch {
            console.warn('LineChart: onMouseMove event handling failed');
          }
        }}
        {...(props.enableWheelZoom ? { // @ts-ignore web-only
          onWheel: (e: any) => {
            if (!props.enablePanZoom) return;
            // Explicitly mark non-passive & prevent page scroll
            if (e.cancelable) e.preventDefault();
            e.stopPropagation?.();
            const rect = e.currentTarget.getBoundingClientRect();
            const pointerX = (e.clientX - rect.left);
            const pointerY = (e.clientY - rect.top);
            panZoom.wheelZoom(e.deltaY, pointerX / plotWidth, pointerY / plotHeight);
          }
        } : {})}
      >
        <Pressable
          {...(!isWeb ? panResponder.panHandlers : {})}
          onPress={handlePress}
          style={[
            { position: 'absolute', left: 0, top: 0, width: plotWidth, height: plotHeight },
            // @ts-ignore web only cursor
            props.enablePanZoom ? { cursor: 'grab' } : null
          ] as any}
        >
          {props.enableBrushZoom && brushStart && brushCurrent && (
            <View style={{
              position: 'absolute', pointerEvents: 'none',
              left: Math.min(brushStart.x, brushCurrent.x),
              top: Math.min(brushStart.y, brushCurrent.y),
              width: Math.abs(brushCurrent.x - brushStart.x),
              height: Math.abs(brushCurrent.y - brushStart.y),
              backgroundColor: 'rgba(100,150,255,0.2)',
              borderWidth: 1, borderColor: 'rgba(80,130,230,0.9)'
            }} />
          )}
          <Svg
            width={plotWidth}
            height={plotHeight}
            style={{
              position: 'absolute',
              //overflow: 'visible' 

            }}
          >
            {/* Define gradients for fills */}
            {shouldRenderGradients && (
              <Defs>
                {gradientConfigs.map(({ id, color, opacity }) => (
                  <LinearGradient
                    key={id}
                    id={id}
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
                    <Stop offset="100%" stopColor={color} stopOpacity={0} />
                  </LinearGradient>
                ))}
              </Defs>
            )}

            {/* Render all series */}
            {chartSeriesData.map((seriesData, seriesIndex) => {
              const shouldFillSeries = filledSeriesSet.has(seriesIndex);
              const seriesSmoothValue = seriesData.smooth ?? smooth;
              const gradientId = `${chartInstanceId}-gradient-${seriesData.id ?? seriesIndex}`;
              const seriesLineStyle = seriesData.lineStyle || seriesData.style || lineStyle;
              return (
                <AnimatedLineSeries
                  key={seriesData.id || seriesIndex}
                  seriesData={seriesData}
                  seriesIndex={seriesIndex}
                  animationProgress={animationProgress}
                  plotHeight={plotHeight}
                  shouldFill={shouldFillSeries}
                  seriesSmooth={seriesSmoothValue}
                  theme={theme}
                  gradientId={gradientId}
                  selectedPoint={selectedPoint}
                  lineThickness={lineThickness}
                  lineStyle={seriesLineStyle}
                  showPoints={seriesData.showPoints !== undefined ? seriesData.showPoints : showPoints}
                  pointSize={seriesData.pointSize || pointSize}
                />
              );
            })}
            {/* Nearest-point visual highlight (independent of showPoints) */}
            {highlightPoint && (
              <Circle
                cx={highlightPoint.chartX}
                cy={highlightPoint.chartY}
                r={(pointSize || 4) * 1.9}
                fill={highlightPoint.color || theme.colors.accentPalette[0]}
                stroke={theme.colors.background}
                strokeWidth={2}
                opacity={0.9}
              />
            )}
          </Svg>

          {/* Annotation overlays */}
          {annotations?.map((annotation) => {
            if (!annotation || plotWidth <= 0 || plotHeight <= 0) return null;
            if (annotation.shape === 'vertical-line' && annotation.x != null) {
              const pixelX = xScaleFn(Number(annotation.x), xDomain, [0, plotWidth]);
              if (!Number.isFinite(pixelX) || pixelX < 0 || pixelX > plotWidth) return null;
              const lineWidth = annotation.lineWidth ?? 1;
              const color = annotation.color || theme.colors.accentPalette[4] || '#6366f1';
              const opacity = annotation.opacity ?? 0.8;
              const label = annotation.label;
              const textColor = annotation.textColor || theme.colors.textSecondary;
              const fontSize = annotation.fontSize ?? 10;
              return (
                <React.Fragment key={`annotation-${annotation.id}`}>
                  <View
                    style={{
                      position: 'absolute',
                      left: pixelX - lineWidth / 2,
                      top: 0,
                      width: lineWidth,
                      height: plotHeight,
                      backgroundColor: color,
                      opacity,
                    }}
                  />
                  {label ? (
                    <Text
                      style={{
                        position: 'absolute',
                        left: pixelX + 4,
                        top: 4,
                        color: textColor,
                        fontSize,
                        backgroundColor: annotation.backgroundColor || theme.colors.background,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      {label}
                    </Text>
                  ) : null}
                </React.Fragment>
              );
            }

            if (annotation.shape === 'horizontal-line' && annotation.y != null) {
              const pixelY = yScaleFn(Number(annotation.y), yDomain, [plotHeight, 0]);
              if (!Number.isFinite(pixelY) || pixelY < 0 || pixelY > plotHeight) return null;
              const lineWidth = annotation.lineWidth ?? 1;
              const color = annotation.color || theme.colors.accentPalette[3] || '#0ea5e9';
              const opacity = annotation.opacity ?? 0.7;
              const label = annotation.label;
              const textColor = annotation.textColor || theme.colors.textSecondary;
              const fontSize = annotation.fontSize ?? 10;
              return (
                <React.Fragment key={`annotation-${annotation.id}`}>
                  <View
                    style={{
                      position: 'absolute',
                      top: pixelY - lineWidth / 2,
                      left: 0,
                      height: lineWidth,
                      width: plotWidth,
                      backgroundColor: color,
                      opacity,
                    }}
                  />
                  {label ? (
                    <Text
                      style={{
                        position: 'absolute',
                        left: 4,
                        top: Math.max(0, pixelY - 20),
                        color: textColor,
                        fontSize,
                        backgroundColor: annotation.backgroundColor || theme.colors.background,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      {label}
                    </Text>
                  ) : null}
                </React.Fragment>
              );
            }

            if (annotation.shape === 'range' && annotation.x1 != null && annotation.x2 != null) {
              const start = xScaleFn(Number(annotation.x1), xDomain, [0, plotWidth]);
              const end = xScaleFn(Number(annotation.x2), xDomain, [0, plotWidth]);
              if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
              const left = Math.min(start, end);
              const width = Math.abs(end - start);
              if (width <= 0) return null;
              const backgroundColor = annotation.backgroundColor || `${theme.colors.accentPalette[2] ?? '#22d3ee'}33`;
              const opacity = annotation.opacity ?? 0.35;
              return (
                <React.Fragment key={`annotation-${annotation.id}`}>
                  <View
                    style={{
                      position: 'absolute',
                      left,
                      top: 0,
                      width,
                      height: plotHeight,
                      backgroundColor,
                      opacity,
                    }}
                  />
                  {annotation.label ? (
                    <Text
                      style={{
                        position: 'absolute',
                        left: left + 8,
                        top: 8,
                        color: annotation.textColor || theme.colors.textSecondary,
                        fontSize: annotation.fontSize ?? 10,
                        backgroundColor: (annotation.backgroundColor && annotation.backgroundColor !== backgroundColor)
                          ? annotation.backgroundColor
                          : theme.colors.background,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      {annotation.label}
                    </Text>
                  ) : null}
                </React.Fragment>
              );
            }

            return null;
          })}

          {/* Crosshair */}
          {props.enableCrosshair && interaction?.crosshair && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: interaction.crosshair.pixelX,
                top: 0,
                height: plotHeight,
                width: 1,
                backgroundColor: theme.colors.grid || 'rgba(0,0,0,0.2)',
              }}
            />
          )}

          {/* Single tooltip (multi handled globally by ChartPopover) */}
          {tooltip?.show !== false && selectedPoint && !sharedConfig?.multiTooltip && (
            <View
              style={{
                position: 'absolute',
                left: (xScaleFn(selectedPoint.x, xDomain, [0, plotWidth])) - 20,
                top: (yScaleFn(selectedPoint.y, yDomain, [plotHeight, 0])) - 40,
                backgroundColor: tooltip?.backgroundColor || theme.colors.background,
                padding: tooltip?.padding || 8,
                borderRadius: tooltip?.borderRadius || 4,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: tooltip?.fontSize || 12,
                  color: tooltip?.textColor || theme.colors.textPrimary,
                }}
              >
                {tooltip?.formatter?.(selectedPoint) || `(${formatNumber(selectedPoint.x)}, ${formatNumber(selectedPoint.y)})`}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Legend */}
      {legend?.show && (
        <ChartLegend
          items={chartSeriesData.map((s, i) => ({
            label: s.name || `Series ${i + 1}`,
            color: s.color || theme.colors.accentPalette[i % theme.colors.accentPalette.length],
            visible: s.visible !== false,
          }))}
          position={legend.position}
          align={legend.align}
          textColor={legend.textColor}
          fontSize={legend.fontSize}
          onItemPress={props.enableSeriesToggle ? (item, index, nativeEvent) => {
            const series = chartSeriesData[index];
            if (!series || !updateSeriesVisibility) return;
            const id = series.id ?? index;
            const overridden = interaction?.series.find(sr => sr.id === id)?.visible;
            const current = overridden === undefined ? true : overridden !== false;
            const isolate = nativeEvent?.shiftKey;
            if (isolate) {
              const visibleIds = chartSeriesData.filter(s => s.visible !== false).map(s => s.id ?? 0);
              const isSole = visibleIds.length === 1 && visibleIds[0] === id;
              chartSeriesData.forEach((s, i) => updateSeriesVisibility(s.id ?? i, isSole ? true : (s.id ?? i) === id));
            } else {
              updateSeriesVisibility(id, !current);
            }
          } : undefined}
        />
      )}
    </ChartContainer>
  );
};

LineChart.displayName = 'LineChart';
