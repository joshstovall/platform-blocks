import React, {
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Platform } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

import { StackedBarChartProps } from './types';
import { BarChartDataPoint } from '../BarChart/types';
import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { useChartTheme } from '../../theme/ChartThemeContext';
import { ChartGrid } from '../../core/ChartGrid';
import { Axis } from '../../core/Axis';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { ChartInteractionEvent } from '../../types';
import { bandScale, linearScale, generateNiceTicks } from '../../utils/scales';
import type { Scale } from '../../utils/scales';
import { getColorFromScheme, colorSchemes, formatNumber } from '../../utils';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type ResolvedSeries = {
  id: string;
  name?: string;
  color: string;
  visible: boolean;
  data: BarChartDataPoint[];
  seriesIndex: number;
};

type RawSegment = {
  id: string;
  category: string;
  categoryIndex: number;
  seriesId: string;
  seriesIndex: number;
  seriesName?: string;
  value: number;
  y0: number;
  y1: number;
  color: string;
  dataPoint?: BarChartDataPoint;
  visible: boolean;
};

type ComputedSegment = RawSegment & {
  x: number;
  width: number;
  y: number;
  baseY: number;
  height: number;
  isPositive: boolean;
};

interface CategoryLayout {
  category: string;
  categoryIndex: number;
  segments: RawSegment[];
  positiveTotal: number;
  negativeTotal: number;
}

interface LayoutResult {
  categories: CategoryLayout[];
  valueDomain: [number, number];
  segmentLookup: Map<string, RawSegment>;
}

const toNativePointerEvent = (event: any) => {
  const rect = event?.currentTarget?.getBoundingClientRect?.();
  return {
    nativeEvent: {
      locationX: rect ? event.clientX - rect.left : 0,
      locationY: rect ? event.clientY - rect.top : 0,
      pageX: event?.pageX ?? event?.clientX,
      pageY: event?.pageY ?? event?.clientY,
    },
  };
};

const AnimatedStackedSegment: React.FC<{
  segment: ComputedSegment;
  animationProgress: SharedValue<number>;
  borderRadius: number;
  disabled: boolean;
  onHoverIn: (segment: ComputedSegment) => void;
  onHoverOut: (segment: ComputedSegment) => void;
  onPress: (segment: ComputedSegment, event: any) => void;
}> = React.memo(({ segment, animationProgress, borderRadius, disabled, onHoverIn, onHoverOut, onPress }) => {
  const animatedProps = useAnimatedProps(() => {
    const progress = animationProgress.value;
    const height = segment.height * progress;
    const y = segment.isPositive ? segment.baseY - height : segment.baseY;
    return {
      x: segment.x,
      y,
      width: segment.width,
      height,
    } as any;
  }, [segment]);

  const isWeb = Platform.OS === 'web';

  return (
    <AnimatedRect
      animatedProps={animatedProps}
      rx={borderRadius}
      ry={borderRadius}
      fill={segment.color}
      opacity={segment.visible ? 1 : 0}
      pointerEvents={segment.visible ? 'auto' : 'none'}
      {...(isWeb
        ? {
            onPointerEnter: () => !disabled && onHoverIn(segment),
            onPointerLeave: () => onHoverOut(segment),
            onPointerDown: (event: any) => {
              if (disabled) return;
              event.currentTarget?.setPointerCapture?.(event.pointerId);
            },
            onPointerUp: (event: any) => {
              if (disabled) return;
              event.currentTarget?.releasePointerCapture?.(event.pointerId);
              onPress(segment, toNativePointerEvent(event));
            },
            onPointerCancel: () => onHoverOut(segment),
          }
        : {
            onPressIn: () => !disabled && onHoverIn(segment),
            onPressOut: () => onHoverOut(segment),
            onPress: (event: any) => !disabled && onPress(segment, { nativeEvent: event.nativeEvent }),
          })}
    />
  );
});

AnimatedStackedSegment.displayName = 'AnimatedStackedSegment';

export const StackedBarChart: React.FC<StackedBarChartProps> = (props) => {
  const {
    series,
    width = 400,
    height = 300,
    barSpacing = 0.25,
    title,
    subtitle,
    legend = { show: true, position: 'bottom', align: 'center' },
    animationDuration = 800,
    disabled = false,
    style,
    xAxis,
    yAxis,
    grid,
    onPress,
    onDataPointPress,
    ...rest
  } = props;

  const theme = useChartTheme();
  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try {
    interaction = useChartInteractionContext();
  } catch {}

  const registerSeries = interaction?.registerSeries;
  const updateSeriesVisibility = interaction?.updateSeriesVisibility;
  const setPointer = interaction?.setPointer;
  const setCrosshair = interaction?.setCrosshair;
  const interactionSeries = interaction?.series;

  const basePadding = { top: 40, right: 24, bottom: 64, left: 80 };
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
  const plotWidth = Math.max(0, width - padding.left - padding.right);
  const plotHeight = Math.max(0, height - padding.top - padding.bottom);

  const categories = useMemo(() => {
    const set = new Set<string>();
    series.forEach((s) => s.data.forEach((d) => set.add(d.category)));
    return Array.from(set);
  }, [series]);

  const categoryIndexMap = useMemo(() => {
    return new Map(categories.map((category, index) => [category, index] as const));
  }, [categories]);

  const resolvedSeries = useMemo<ResolvedSeries[]>(() => {
    return series.map((s, index) => {
      const id = String(s.id ?? `stacked-${index}`);
      const override = interactionSeries?.find((entry) => entry.id === id);
      const visible = override ? override.visible !== false : s.visible !== false;
      const color = s.color || theme.colors.accentPalette[index % theme.colors.accentPalette.length] || getColorFromScheme(index, colorSchemes.default);
      return {
        id,
        name: s.name,
        color,
        visible,
        data: s.data || [],
        seriesIndex: index,
      };
    });
  }, [series, interactionSeries, theme.colors.accentPalette]);

  const layoutResult = useMemo<LayoutResult>(() => {
    const layouts: CategoryLayout[] = categories.map((category, categoryIndex) => ({
      category,
      categoryIndex,
      segments: [],
      positiveTotal: 0,
      negativeTotal: 0,
    }));

    const layoutMap = new Map(categories.map((category, index) => [category, layouts[index]] as const));
    const segmentLookup = new Map<string, RawSegment>();

    resolvedSeries.forEach((seriesEntry) => {
      layouts.forEach((layout) => {
        const dataPoint = seriesEntry.data.find((d) => d.category === layout.category);
        const value = dataPoint?.value ?? 0;
        const isPositive = value >= 0;
        const y0 = isPositive ? layout.positiveTotal : layout.negativeTotal;
        const y1 = y0 + value;
        if (isPositive) layout.positiveTotal = y1;
        else layout.negativeTotal = y1;

        const segment: RawSegment = {
          id: `${seriesEntry.id}::${layout.category}`,
          category: layout.category,
          categoryIndex: layout.categoryIndex,
          seriesId: seriesEntry.id,
          seriesIndex: seriesEntry.seriesIndex,
          seriesName: seriesEntry.name,
          value,
          y0,
          y1,
          color: dataPoint?.color || seriesEntry.color,
          dataPoint,
          visible: seriesEntry.visible,
        };

        layout.segments.push(segment);
        segmentLookup.set(segment.id, segment);
      });
    });

    const maxPositive = layouts.reduce((max, layout) => Math.max(max, layout.segments.some((seg) => seg.visible && seg.value > 0) ? layout.positiveTotal : max), 0);
    const minNegative = layouts.reduce((min, layout) => Math.min(min, layout.segments.some((seg) => seg.visible && seg.value < 0) ? layout.negativeTotal : min), 0);

    const domainMin = Math.min(0, minNegative);
    const domainMax = Math.max(0, maxPositive);
    const range = domainMax - domainMin;
    const valueDomain: [number, number] = range === 0 ? [domainMin, domainMin + 1] : [domainMin, domainMax];

    return {
      categories: layouts,
      valueDomain,
      segmentLookup,
    };
  }, [categories, resolvedSeries]);

  const xScale = useMemo(() => {
    const paddingInner = Math.min(Math.max(barSpacing, 0), 0.9);
    const paddingOuter = 0.1;
    return bandScale(categories, [0, plotWidth], {
      paddingInner,
      paddingOuter,
    });
  }, [categories, plotWidth, barSpacing]);

  const valueScale = useMemo(() => linearScale(layoutResult.valueDomain, [plotHeight, 0]), [layoutResult.valueDomain, plotHeight]);

  const computedSegments = useMemo(() => {
    const bandwidth = xScale.bandwidth ? xScale.bandwidth() : categories.length ? plotWidth / categories.length : 0;
    return layoutResult.categories.map((layout) => {
      const x = xScale(layout.category) ?? 0;
      const segments: ComputedSegment[] = layout.segments.map((segment) => {
        const y0Px = valueScale(segment.y0);
        const y1Px = valueScale(segment.y1);
        const top = Math.min(y0Px, y1Px);
        const bottom = Math.max(y0Px, y1Px);
        const height = Math.max(0, bottom - top);
        const isPositive = segment.y1 >= segment.y0;
        const baseY = isPositive ? bottom : top;
        return {
          ...segment,
          x,
          width: bandwidth,
          y: top,
          baseY,
          height,
          isPositive,
        };
      });
      return { layout, x, segments };
    });
  }, [layoutResult.categories, xScale, valueScale, categories.length, plotWidth]);

  const animationProgress = useSharedValue(disabled ? 1 : 0);

  const dataSignature = useMemo(() => {
    const seriesSignature = resolvedSeries
      .map((seriesEntry) => {
        const values = categories
          .map((category) => {
            const segment = layoutResult.segmentLookup.get(`${seriesEntry.id}::${category}`);
            return `${category}:${segment?.value ?? 0}`;
          })
          .join('|');
        return `${seriesEntry.id}:${seriesEntry.visible ? '1' : '0'}:${values}`;
      })
      .join('||');
    return `${seriesSignature}|domain:${layoutResult.valueDomain.join(',')}`;
  }, [resolvedSeries, categories, layoutResult.segmentLookup, layoutResult.valueDomain]);

  useEffect(() => {
    if (disabled) {
      animationProgress.value = 1;
      return;
    }
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [animationProgress, animationDuration, dataSignature, disabled]);

  const valueTicks = useMemo(() => {
    if (yAxis?.ticks && yAxis.ticks.length) {
      return yAxis.ticks;
    }
    const fallbackCount = 5;
    return generateNiceTicks(layoutResult.valueDomain[0], layoutResult.valueDomain[1], fallbackCount);
  }, [layoutResult.valueDomain, yAxis?.ticks]);

  const normalizedYTicks = useMemo(() => {
    if (plotHeight <= 0) return [] as number[];
    return valueTicks.map((tick) => {
      const pixel = valueScale(tick);
      return pixel / plotHeight;
    });
  }, [valueTicks, valueScale, plotHeight]);

  const normalizedXTicks = useMemo(() => {
    if (plotWidth <= 0) return [] as number[];
    const bandwidth = xScale.bandwidth ? xScale.bandwidth() : 0;
    return categories.map((category) => {
      const position = (xScale(category) ?? 0) + bandwidth / 2;
      return position / plotWidth;
    });
  }, [categories, xScale, plotWidth]);

  const xAxisScale = useMemo<Scale<string>>(() => {
    const bandwidth = xScale.bandwidth ? xScale.bandwidth() : categories.length ? plotWidth / categories.length : 0;
    const scale = ((value: string) => {
      const base = xScale(value) ?? 0;
      return base + bandwidth / 2;
    }) as Scale<string>;
    scale.domain = () => categories.slice();
    scale.range = () => [0, plotWidth];
    scale.ticks = () => categories.slice();
    scale.bandwidth = () => bandwidth;
    return scale;
  }, [xScale, categories, plotWidth]);

  const yAxisScale = useMemo<Scale<number>>(() => {
    const scale = ((value: number) => valueScale(value)) as Scale<number>;
    scale.domain = () => valueScale.domain();
    scale.range = () => valueScale.range();
    scale.ticks = () => valueTicks.slice();
    return scale;
  }, [valueScale, valueTicks]);

  const segmentHoverRef = useRef<string | null>(null);

  const handleHoverIn = useCallback((segment: ComputedSegment) => {
    segmentHoverRef.current = segment.id;
    const pointerX = padding.left + segment.x + segment.width / 2;
    const pointerY = padding.top + segment.y + segment.height / 2;
    setPointer?.({ x: pointerX, y: pointerY, inside: true });
    setCrosshair?.({ dataX: segment.categoryIndex, pixelX: pointerX });
  }, [padding.left, padding.top, setPointer, setCrosshair]);

  const handleHoverOut = useCallback((segment: ComputedSegment) => {
    if (segmentHoverRef.current !== segment.id) return;
    segmentHoverRef.current = null;
    setPointer?.(null);
    setCrosshair?.(null);
  }, [setPointer, setCrosshair]);

  const handlePress = useCallback((segment: ComputedSegment, pressEvent: any) => {
    const dataPoint: BarChartDataPoint = segment.dataPoint || {
      category: segment.category,
      value: segment.value,
      color: segment.color,
    };

    const chartX = (padding.left + segment.x + segment.width / 2) / width;
    const chartY = (padding.top + segment.y + segment.height / 2) / height;

    const interactionEvent: ChartInteractionEvent<BarChartDataPoint> = {
      nativeEvent: pressEvent.nativeEvent,
      chartX,
      chartY,
      dataX: segment.categoryIndex,
      dataY: segment.y1,
      dataPoint,
    };

    onDataPointPress?.(dataPoint, interactionEvent);
    onPress?.(interactionEvent);
  }, [height, width, onDataPointPress, onPress, padding.left, padding.top]);

  const registerSignatureRef = useRef<string | null>(null);
  useEffect(() => {
    if (!registerSeries) return;
    const signature = dataSignature;
    if (registerSignatureRef.current === signature) return;
    registerSignatureRef.current = signature;

    resolvedSeries.forEach((seriesEntry) => {
      const points = categories.map((category) => {
        const segment = layoutResult.segmentLookup.get(`${seriesEntry.id}::${category}`);
        const value = segment?.value ?? 0;
        const meta = segment?.dataPoint || {
          category,
          value,
        };
        return {
          x: categoryIndexMap.get(category) ?? 0,
          y: value,
          meta: {
            ...meta,
            stackedStart: segment?.y0 ?? 0,
            stackedEnd: segment?.y1 ?? value,
          },
        };
      });

      registerSeries({
        id: seriesEntry.id,
        name: seriesEntry.name || `Series ${seriesEntry.seriesIndex + 1}`,
        color: seriesEntry.color,
        points,
        visible: seriesEntry.visible,
      });
    });
  }, [registerSeries, resolvedSeries, categories, layoutResult.segmentLookup, categoryIndexMap, dataSignature]);

  return (
    <ChartContainer
      width={width}
      height={height}
      padding={padding}
      animationDuration={animationDuration}
      disabled={disabled}
      style={style}
      {...rest}
    >
      {(title || subtitle) && <ChartTitle title={title} subtitle={subtitle} />}

      {grid?.show !== false && (
        <ChartGrid
          grid={{
            show: true,
            color: grid?.color || theme.colors.grid,
            thickness: grid?.thickness ?? 1,
            style: grid?.style ?? 'solid',
            showMajor: grid?.showMajor ?? true,
            showMinor: grid?.showMinor ?? false,
            majorLines: grid?.majorLines,
            minorLines: grid?.minorLines,
          }}
          plotWidth={plotWidth}
          plotHeight={plotHeight}
          xTicks={normalizedXTicks}
          yTicks={normalizedYTicks}
          padding={padding}
        />
      )}

      <Svg
        width={plotWidth}
        height={plotHeight}
        style={{ position: 'absolute', left: padding.left, top: padding.top }}
      >
        {computedSegments.map(({ segments }, groupIndex) => (
          <G key={`stack-${groupIndex}`}>
            {segments.map((segment) => (
              segment.visible && segment.height > 0 ? (
                <AnimatedStackedSegment
                  key={segment.id}
                  segment={segment}
                  animationProgress={animationProgress}
                  borderRadius={3}
                  disabled={disabled}
                  onHoverIn={handleHoverIn}
                  onHoverOut={handleHoverOut}
                  onPress={handlePress}
                />
              ) : null
            ))}
          </G>
        ))}
      </Svg>

      {xAxis?.show !== false && (
        <Axis
          orientation="bottom"
          scale={xAxisScale}
          length={plotWidth}
          offset={{ x: padding.left, y: padding.top + plotHeight }}
          tickCount={categories.length}
          tickSize={xAxis?.tickLength ?? 4}
          tickPadding={8}
          tickFormat={(value: string) => {
            const index = categoryIndexMap.get(value) ?? 0;
            return xAxis?.labelFormatter ? xAxis.labelFormatter(index) : String(value);
          }}
          label={xAxis?.title}
          stroke={xAxis?.color || theme.colors.grid}
          strokeWidth={xAxis?.thickness ?? 1}
          showLine={xAxis?.show ?? true}
          showTicks={xAxis?.showTicks ?? true}
          showLabels={xAxis?.showLabels ?? true}
          tickLabelColor={xAxis?.labelColor || theme.colors.textSecondary}
          tickLabelFontSize={xAxis?.labelFontSize ?? 11}
        />
      )}

      {yAxis?.show !== false && (
        <Axis
          orientation="left"
          scale={yAxisScale}
          length={plotHeight}
          offset={{ x: padding.left, y: padding.top }}
          tickCount={valueTicks.length}
          tickSize={yAxis?.tickLength ?? 4}
          tickPadding={6}
          tickFormat={(value: number) => (yAxis?.labelFormatter ? yAxis.labelFormatter(value) : formatNumber(value))}
          label={yAxis?.title}
          stroke={yAxis?.color || theme.colors.grid}
          strokeWidth={yAxis?.thickness ?? 1}
          showLine={yAxis?.show ?? true}
          showTicks={yAxis?.showTicks ?? true}
          showLabels={yAxis?.showLabels ?? true}
          tickLabelColor={yAxis?.labelColor || theme.colors.textSecondary}
          tickLabelFontSize={yAxis?.labelFontSize ?? 11}
        />
      )}

      {legend?.show && (
        <ChartLegend
          items={resolvedSeries.map((seriesEntry, index) => ({
            label: seriesEntry.name || `Series ${index + 1}`,
            color: seriesEntry.color,
            visible: seriesEntry.visible,
          }))}
          position={legend.position}
          align={legend.align}
          textColor={legend.textColor}
          fontSize={legend.fontSize}
          onItemPress={updateSeriesVisibility ? (item, index, nativeEvent) => {
            const seriesEntry = resolvedSeries[index];
            if (!seriesEntry) return;
            const id = seriesEntry.id;
            const currentVisible = interactionSeries?.find((s) => s.id === id)?.visible ?? seriesEntry.visible;
            const isolate = nativeEvent?.shiftKey;
            if (isolate) {
              const currentlyVisible = resolvedSeries.filter((s) => s.visible).map((s) => s.id);
              const isSole = currentlyVisible.length === 1 && currentlyVisible[0] === id;
              resolvedSeries.forEach((entry) => updateSeriesVisibility(entry.id, isSole ? true : entry.id === id));
            } else {
              updateSeriesVisibility(id, !(currentVisible !== false));
            }
          } : undefined}
        />
      )}
    </ChartContainer>
  );
};

StackedBarChart.displayName = 'StackedBarChart';
