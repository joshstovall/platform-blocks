import React from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { CandlestickChartProps } from './types';
import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { ChartGrid } from '../../core/ChartGrid';
import { Axis } from '../../core/Axis';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { useChartTheme } from '../../theme/ChartThemeContext';
import {
  generateTicks,
  generateLogTicks,
  generateTimeTicks,
  scaleLinear,
  scaleLog,
  scaleTime,
  getDataDomain,
  getColorFromScheme,
  colorSchemes,
  formatNumber,
} from '../../utils';
import type { Scale } from '../../utils/scales';
import { AnimatedCandle } from './AnimatedCandle';
import type { CandleDataPoint } from './AnimatedCandle';
import { useCandlestickSeriesRegistration } from './useCandlestickSeriesRegistration';
import type { CandlestickChartSeriesRegistration } from './useCandlestickSeriesRegistration';

const toNumeric = (value: number | string | Date): number => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Minimal initial CandlestickChart: renders OHLC candles + wicks, registers series, shared crosshair & tooltip ready */
export const CandlestickChart: React.FC<CandlestickChartProps> = (props) => {
  const {
    series,
    width = 400,
    height = 300,
    title, subtitle,
    xAxis, yAxis, grid,
    animationDuration,
    style,
    enableCrosshair,
    liveTooltip,
    multiTooltip,
    enablePanZoom,
    zoomMode,
    minZoom,
    enableWheelZoom,
    wheelZoomStep,
    invertWheelZoom,
    resetOnDoubleTap,
    clampToInitialDomain,
    invertPinchZoom,
    xScaleType = 'time',
    yScaleType = 'linear',
    annotations,
    movingAveragePeriods = [],
    movingAverageColors = [],
    showMovingAverages = true,
    disabled,
    showVolume = false,
    volumeHeightRatio = 0.22,
    tooltip,
    ...rest
  } = props;

  const theme = useChartTheme();
  const flattened = React.useMemo(() => series.flatMap((s) => s.data), [series]);
  const volumeEnabled = React.useMemo(
    () => !!showVolume && flattened.some((point) => Number.isFinite(point.volume ?? NaN) && (point.volume ?? 0) > 0),
    [showVolume, flattened],
  );

  const clampNumber = React.useCallback((value: number, min: number, max: number) => Math.min(Math.max(value, min), max), []);

  const priceFormatter = React.useMemo(() => {
    if (typeof yAxis?.labelFormatter === 'function') {
      return yAxis.labelFormatter;
    }
    if (yScaleType === 'time') {
      const dt = new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
      });
      return (value: number) => dt.format(new Date(value));
    }
    const nf = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (value: number) => nf.format(value);
  }, [yAxis?.labelFormatter, yScaleType]);

  const xTickFormatter = React.useMemo(() => {
    if (typeof xAxis?.labelFormatter === 'function') {
      return xAxis.labelFormatter;
    }
    if (xScaleType === 'time') {
      const dt = new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
      });
      return (value: number) => dt.format(new Date(value));
    }
    return (value: number) => formatNumber(value);
  }, [xAxis?.labelFormatter, xScaleType]);
  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try { interaction = useChartInteractionContext(); } catch {
    console.warn('CandlestickChart: useChartInteractionContext must be used inside a ChartInteractionProvider context');
  }
  const registerSeries = interaction?.registerSeries;
  const updateSeriesVisibility = interaction?.updateSeriesVisibility;
  const setPointer = interaction?.setPointer;
  const setCrosshair = interaction?.setCrosshair;
  const defaultScheme = colorSchemes.default;
  const xDomain = React.useMemo<[number, number]>(() => {
    if (!flattened.length) {
      return [0, 1];
    }
    const points = flattened.map((d) => ({ x: toNumeric(d.x), y: toNumeric(d.x) }));
    return getDataDomain(points as any, (d) => toNumeric(d.x));
  }, [flattened]);
  const yDomain = React.useMemo<[number, number]>(() => {
    if (!flattened.length) {
      return [0, 1];
    }
    const lows = flattened.map((d) => d.low);
    const highs = flattened.map((d) => d.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return [0, 1];
    }
    if (min === max) {
      const delta = Math.abs(min) * 0.05 || 1;
      return [min - delta, max + delta];
    }
    return [min, max];
  }, [flattened]);

  const padding = { top: 40, right: 20, bottom: volumeEnabled ? 72 : 60, left: 80 };
  const volumeGap = volumeEnabled ? 16 : 0;
  const plotWidth = Math.max(0, width - padding.left - padding.right);
  const availableHeight = Math.max(0, height - padding.top - padding.bottom - volumeGap);
  const volumeSectionRatio = clampNumber(volumeHeightRatio ?? 0.22, 0.05, 0.5);
  const volumeHeight = volumeEnabled ? Math.max(40, availableHeight * volumeSectionRatio) : 0;
  const plotHeight = Math.max(0, availableHeight - volumeHeight);

  const xTicks = React.useMemo(() => {
    if (xAxis?.ticks && xAxis.ticks.length) {
      return xAxis.ticks;
    }
    switch (xScaleType) {
      case 'log':
        return generateLogTicks([Math.max(xDomain[0], 1e-12), Math.max(xDomain[1], 1e-12)], 6);
      case 'time':
        return generateTimeTicks(xDomain, 6);
      default:
        return generateTicks(xDomain[0], xDomain[1], 6);
    }
  }, [xAxis?.ticks, xDomain, xScaleType]);

  const yTicks = React.useMemo(() => {
    if (yAxis?.ticks && yAxis.ticks.length) {
      return yAxis.ticks;
    }
    switch (yScaleType) {
      case 'log':
        return generateLogTicks([Math.max(yDomain[0], 1e-12), Math.max(yDomain[1], 1e-12)], 5);
      case 'time':
        return generateTimeTicks(yDomain, 5);
      default:
        return generateTicks(yDomain[0], yDomain[1], 5);
    }
  }, [yAxis?.ticks, yDomain, yScaleType]);

  const scaleX = React.useCallback((v: number | string | Date) => {
    const value = toNumeric(v);
    switch (xScaleType) {
      case 'log':
        return scaleLog(value, xDomain, [0, plotWidth]);
      case 'time':
        return scaleTime(value, xDomain, [0, plotWidth]);
      default:
        return scaleLinear(value, xDomain, [0, plotWidth]);
    }
  }, [xScaleType, xDomain, plotWidth]);
  const scaleY = React.useCallback((v: number) => {
    switch (yScaleType) {
      case 'log': return scaleLog(v, yDomain, [plotHeight, 0]);
      case 'time': return scaleTime(v, yDomain, [plotHeight, 0]);
      default: return scaleLinear(v, yDomain, [plotHeight, 0]);
    }
  }, [yScaleType, yDomain, plotHeight]);

  const axisScaleX = React.useMemo<Scale<number>>(() => {
    const domain: [number, number] = [xDomain[0], xDomain[1]];
    const range: [number, number] = [0, plotWidth];
    if (!Number.isFinite(domain[0]) || !Number.isFinite(domain[1]) || plotWidth <= 0) {
      const fallback = ((_: number) => 0) as Scale<number>;
      fallback.domain = () => domain.slice();
      fallback.range = () => [0, 0];
      fallback.ticks = () => (xTicks ?? []).slice();
      fallback.invert = () => domain[0];
      return fallback;
    }
    const scale = ((value: number) => scaleX(value)) as Scale<number>;
    scale.domain = () => domain.slice();
    scale.range = () => range.slice();
    scale.ticks = (count?: number) => {
      if (xTicks && xTicks.length) return xTicks.slice();
      switch (xScaleType) {
        case 'log':
          return generateLogTicks(domain, count ?? 6);
        case 'time':
          return generateTimeTicks(domain, count ?? 6);
        default:
          return generateTicks(domain[0], domain[1], count ?? 6);
      }
    };
    scale.invert = (pixel: number) => {
      if (range[1] === range[0]) return domain[0];
      const ratio = (pixel - range[0]) / (range[1] - range[0]);
      const clamped = Math.max(0, Math.min(1, ratio));
      switch (xScaleType) {
        case 'log': {
          const logMin = Math.log10(Math.max(domain[0], 1e-12));
          const logMax = Math.log10(Math.max(domain[1], 1e-12));
          const value = Math.pow(10, logMin + (logMax - logMin) * clamped);
          return value;
        }
        default:
          return domain[0] + (domain[1] - domain[0]) * clamped;
      }
    };
    return scale;
  }, [plotWidth, xDomain, xTicks, xScaleType, scaleX]);

  const axisScaleY = React.useMemo<Scale<number>>(() => {
    const domain: [number, number] = [yDomain[0], yDomain[1]];
    const range: [number, number] = [plotHeight, 0];
    if (!Number.isFinite(domain[0]) || !Number.isFinite(domain[1]) || plotHeight <= 0) {
      const fallback = ((_: number) => 0) as Scale<number>;
      fallback.domain = () => domain.slice();
      fallback.range = () => [0, 0];
      fallback.ticks = () => (yTicks ?? []).slice();
      fallback.invert = () => domain[0];
      return fallback;
    }
    const scale = ((value: number) => scaleY(value)) as Scale<number>;
    scale.domain = () => domain.slice();
    scale.range = () => range.slice();
    scale.ticks = (count?: number) => {
      if (yTicks && yTicks.length) return yTicks.slice();
      switch (yScaleType) {
        case 'log':
          return generateLogTicks(domain, count ?? 5);
        case 'time':
          return generateTimeTicks(domain, count ?? 5);
        default:
          return generateTicks(domain[0], domain[1], count ?? 5);
      }
    };
    scale.invert = (pixel: number) => {
      if (range[0] === range[1]) return domain[0];
      const ratio = (pixel - range[0]) / (range[1] - range[0]);
      const clamped = Math.max(0, Math.min(1, ratio));
      switch (yScaleType) {
        case 'log': {
          const logMin = Math.log10(Math.max(domain[0], 1e-12));
          const logMax = Math.log10(Math.max(domain[1], 1e-12));
          return Math.pow(10, logMin + (logMax - logMin) * clamped);
        }
        default:
          return domain[0] + (domain[1] - domain[0]) * clamped;
      }
    };
    return scale;
  }, [plotHeight, yDomain, yTicks, yScaleType, scaleY]);

  const resolvedXTicks = React.useMemo(() => (xTicks ?? []).slice(), [xTicks]);
  const resolvedYTicks = React.useMemo(() => (yTicks ?? []).slice(), [yTicks]);

  const normalizedXTicks = React.useMemo(() => {
    if (plotWidth <= 0) return [] as number[];
    return resolvedXTicks
      .map((tick) => {
        const numeric = typeof tick === 'number' ? tick : Number(tick);
        if (!Number.isFinite(numeric)) return null;
        const px = axisScaleX(numeric);
        if (!Number.isFinite(px)) return null;
        return px / plotWidth;
      })
      .filter((value): value is number => value != null && Number.isFinite(value));
  }, [resolvedXTicks, axisScaleX, plotWidth]);

  const normalizedYTicks = React.useMemo(() => {
    if (plotHeight <= 0) return [] as number[];
    return resolvedYTicks
      .map((tick) => {
        const numeric = typeof tick === 'number' ? tick : Number(tick);
        if (!Number.isFinite(numeric)) return null;
        const py = axisScaleY(numeric);
        if (!Number.isFinite(py)) return null;
        return py / plotHeight;
      })
      .filter((value): value is number => value != null && Number.isFinite(value));
  }, [resolvedYTicks, axisScaleY, plotHeight]);

  const candleWidth = Math.max(2, plotWidth / Math.max(flattened.length, 1) * 0.7);

  // Process candle data for AnimatedCandle components
  const candleData: Array<CandleDataPoint & { seriesIndex: number; dataIndex: number; volume?: number | null }> = React.useMemo(() => {
    const result: Array<CandleDataPoint & { seriesIndex: number; dataIndex: number; volume?: number | null }> = [];
    
    series.forEach((s, seriesIndex) => {
      if (s.visible === false) return;
      
      s.data.forEach((d, dataIndex) => {
        const xPos = scaleX(d.x);
        const open = scaleY(d.open);
        const close = scaleY(d.close);
        const high = scaleY(d.high);
        const low = scaleY(d.low);
        
        const bodyTop = Math.min(open, close);
        const bodyHeight = Math.max(1, Math.abs(close - open));
        
        result.push({
          ...d,
          id: `${seriesIndex}-${dataIndex}`,
          x: toNumeric(d.x),
          y: d.close,
          chartX: xPos,
          chartY: close,
          wickY1: high,
          wickY2: low,
          bodyTop,
          bodyHeight,
          width: candleWidth,
          seriesIndex,
          dataIndex,
          volume: d.volume ?? null,
        });
      });
    });
    
    return result;
  }, [series, scaleX, scaleY, candleWidth]);

  const primaryVolumeSeriesIndex = React.useMemo(() => {
    if (!volumeEnabled) return -1;
    return series.findIndex((s) => s.visible !== false && s.data.some((d) => Number.isFinite(d.volume ?? NaN) && (d.volume ?? 0) > 0));
  }, [volumeEnabled, series]);

  const volumeBars = React.useMemo(() => {
    if (!volumeEnabled || volumeHeight <= 0 || primaryVolumeSeriesIndex < 0) return [] as Array<{ id: string; x: number; y: number; width: number; height: number; color: string }>;
    const targetSeries = series[primaryVolumeSeriesIndex];
    const volumes = targetSeries.data.map((d) => Math.max(0, Number(d.volume ?? 0)));
    const maxVolume = Math.max(...volumes, 0);
    if (!(maxVolume > 0)) return [];
    const bullColor = targetSeries.colorBull || '#16a34a';
    const bearColor = targetSeries.colorBear || '#dc2626';
    const barWidth = Math.max(2, candleWidth * 0.65);
    return targetSeries.data.map((d, index) => {
      const value = Math.max(0, Number(d.volume ?? 0));
      const proportionalHeight = (value / maxVolume) * volumeHeight;
      const heightPx = Math.max(1, proportionalHeight);
      const xCenter = scaleX(d.x);
      const color = d.close >= d.open ? bullColor : bearColor;
      return {
        id: `${primaryVolumeSeriesIndex}-${index}`,
        x: xCenter - barWidth / 2,
        y: volumeHeight - heightPx,
        width: barWidth,
        height: heightPx,
        color,
      };
    });
  }, [
    volumeEnabled,
    volumeHeight,
    primaryVolumeSeriesIndex,
    series,
    candleWidth,
    scaleX,
  ]);

  type PointerCandleEntry = {
    seriesId: string | number;
    seriesName?: string;
    seriesIndex: number;
    dataIndex: number;
    datum: typeof series[number]['data'][number];
    candle: typeof candleData[number];
    formatted?: React.ReactNode | string;
  };

  const resolvePointerPayload = React.useCallback((pixelX: number) => {
    if (!candleData.length) return undefined;
    let nearest = candleData[0];
    let minDistance = Math.abs(pixelX - nearest.chartX);
    for (let i = 1; i < candleData.length; i += 1) {
      const candidate = candleData[i];
      const distance = Math.abs(pixelX - candidate.chartX);
      if (distance < minDistance) {
        nearest = candidate;
        minDistance = distance;
      }
    }
    if (!nearest) return undefined;
    const candlesAtX = candleData.filter((candle) => candle.x === nearest.x);
    const grouped: PointerCandleEntry[] = [];
    candlesAtX.forEach((candle) => {
      const parentSeries = series[candle.seriesIndex];
      const datum = parentSeries?.data?.[candle.dataIndex];
      if (!parentSeries || !datum) return;
      const formatted = tooltip?.formatter?.(datum);
      grouped.push({
        seriesId: parentSeries.id ?? candle.seriesIndex,
        seriesName: parentSeries.name,
        seriesIndex: candle.seriesIndex,
        dataIndex: candle.dataIndex,
        datum,
        candle,
        formatted,
      });
    });
    if (!grouped.length) return undefined;
    const referenceDatum = grouped[0]?.datum;
    return {
      type: 'candlestick' as const,
      xValue: referenceDatum?.x ?? nearest.x,
      candles: grouped,
    };
  }, [candleData, series, tooltip?.formatter]);

  const handlePointerUpdate = React.useCallback((px: number, py: number, meta?: { pageX?: number; pageY?: number }) => {
    if (!setPointer || plotWidth <= 0 || plotHeight <= 0 || disabled) return;
    const inside = px >= 0 && py >= 0 && px <= plotWidth && py <= plotHeight;
    const payload = inside ? resolvePointerPayload(px) : undefined;
    setPointer({
      x: px,
      y: py,
      inside,
      pageX: meta?.pageX,
      pageY: meta?.pageY,
      data: payload,
    });
    if (!enableCrosshair) return;
    if (inside) {
      const dataX = axisScaleX.invert ? axisScaleX.invert(px) : xDomain[0] + (plotWidth ? (px / plotWidth) * (xDomain[1] - xDomain[0]) : 0);
      setCrosshair?.({ dataX, pixelX: px });
    } else {
      setCrosshair?.(null);
    }
  }, [setPointer, plotWidth, plotHeight, disabled, resolvePointerPayload, enableCrosshair, axisScaleX, xDomain, setCrosshair]);

  const handlePointerLeave = React.useCallback(() => {
    if (!setPointer) return;
    setPointer(null);
    setCrosshair?.(null);
  }, [setPointer, setCrosshair]);

  // Build MA SVG paths (after scale helpers) for smoother rendering
  // Moving averages per series (only first series currently used if multiple) – could extend to all later
  const maLines = React.useMemo(() => {
    if (!showMovingAverages || !movingAveragePeriods.length || series.length === 0) return [] as Array<{ period: number; points: { x: number; y: number }[]; color: string }>;
    const base = [...series[0].data].sort((a, b) => toNumeric(a.x) - toNumeric(b.x));
    return movingAveragePeriods.map((p, pi) => {
      const pts: { x: number; y: number }[] = [];
      let sum = 0; const window: number[] = [];
      base.forEach(d => {
        const val = d.close;
        window.push(val);
        sum += val;
        if (window.length > p) sum -= window.shift()!;
        if (window.length === p) pts.push({ x: toNumeric(d.x), y: sum / p });
      });
      return { period: p, points: pts, color: movingAverageColors[pi] || getColorFromScheme(pi + 2, defaultScheme) };
    });
  }, [showMovingAverages, movingAveragePeriods, movingAverageColors, series, defaultScheme]);

  const maSvgPaths = React.useMemo(() => {
    return maLines.map(ma => {
      if (ma.points.length < 2) return { period: ma.period, d: '', color: ma.color };
      let d = `M ${scaleX(ma.points[0].x)} ${scaleY(ma.points[0].y)}`;
      for (let i = 1; i < ma.points.length; i++) {
        const pt = ma.points[i];
        d += ` L ${scaleX(pt.x)} ${scaleY(pt.y)}`;
      }
      return { period: ma.period, d, color: ma.color };
    });
  }, [maLines, scaleX, scaleY]);

  // Register series for tooltip interaction
  const candlestickSeriesData: CandlestickChartSeriesRegistration[] = React.useMemo(() => {
    const candlestickSeries = series.map((s, i) => ({
      id: String(s.id ?? i),
      name: s.name || `Series ${i + 1}`,
      color: s.colorBull || '#16a34a',
      colorBull: s.colorBull || '#16a34a',
      colorBear: s.colorBear || '#dc2626',
      wickColor: s.wickColor,
      visible: s.visible !== false,
      data: s.data.map(d => ({
        x: d.x,
        open: d.open,
        close: d.close,
        high: d.high,
        low: d.low,
        volume: d.volume,
      })),
    }));

    // Add moving averages as overlay series if enabled
    const maOverlaySeries = showMovingAverages ? maLines.map((ma) => ({
      id: `ma-${ma.period}`,
      name: `${ma.period} MA`,
      color: ma.color,
      visible: true,
      data: ma.points.map((p) => ({
        x: p.x,
        open: p.y,
        close: p.y,
        high: p.y,
        low: p.y,
      })),
    })) : [];

    return [...candlestickSeries, ...maOverlaySeries];
  }, [series, showMovingAverages, maLines]);

  useCandlestickSeriesRegistration({
    series: candlestickSeriesData,
    registerSeries,
    tooltipFormatter: tooltip?.formatter,
  });

  return (
    <ChartContainer
      width={width}
      height={height}
      disabled={disabled}
      animationDuration={animationDuration}
      style={style}
      interactionConfig={{
        enablePanZoom, zoomMode, minZoom, wheelZoomStep, resetOnDoubleTap, clampToInitialDomain,
        invertPinchZoom, invertWheelZoom, enableCrosshair, liveTooltip, multiTooltip,
      }}
      {...rest}
    >
      {(title || subtitle) && <ChartTitle title={title} subtitle={subtitle} />}
      {grid && plotWidth > 0 && plotHeight > 0 && (
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
      <View
        style={{
          position: 'absolute',
          left: padding.left,
          top: padding.top,
          width: plotWidth,
          height: plotHeight + (volumeEnabled ? volumeHeight + volumeGap : 0),
        }}
      >
        <View
          style={{ width: plotWidth, height: plotHeight }}
          onStartShouldSetResponder={() => !disabled}
          onResponderGrant={(e) => {
            const { locationX, locationY, pageX, pageY } = e.nativeEvent || {};
            handlePointerUpdate(locationX ?? 0, locationY ?? 0, { pageX, pageY });
          }}
          onResponderMove={(e) => {
            const { locationX, locationY, pageX, pageY } = e.nativeEvent || {};
            handlePointerUpdate(locationX ?? 0, locationY ?? 0, { pageX, pageY });
          }}
          onResponderRelease={handlePointerLeave}
          onResponderTerminate={handlePointerLeave}
        >
          {/* Animated Candles Layer */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: plotWidth,
              height: plotHeight,
            }}
            pointerEvents="none"
          >
            {candleData.map((candle, index) => {
              const s = series[candle.seriesIndex];
              return (
                <AnimatedCandle
                  key={candle.id}
                  candle={candle}
                  colorBull={s.colorBull || '#16a34a'}
                  colorBear={s.colorBear || '#dc2626'}
                  wickColor={s.wickColor}
                  index={index}
                  disabled={disabled}
                  theme={theme}
                />
              );
            })}
          </View>

          {/* SVG overlay for moving averages */}
          <Svg
            width={plotWidth}
            height={plotHeight}
            // Basic pointer tracking for web (RN web exposes onMouseMove); native handled via gesture layer above ChartContainer if present
            // @ts-ignore web only events
            onMouseMove={(e) => {
              const rect = (e.currentTarget as any).getBoundingClientRect?.();
              if (!rect) return;
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              handlePointerUpdate(x, y, { pageX: e.pageX, pageY: e.pageY });
            }}
            // @ts-ignore web only events
            onMouseLeave={handlePointerLeave}
          >
            <G>
              {maSvgPaths.map(p => {
                const vis = interaction?.series.find(sr => sr.id === `ma-${p.period}`)?.visible !== false;
                return (p.d && vis) ? <Path key={`ma-${p.period}`} d={p.d} stroke={p.color} strokeWidth={1.5} fill="none" /> : null;
              })}
            </G>
          </Svg>
        </View>

        {volumeEnabled && (
          <View style={{ width: plotWidth, height: volumeHeight, marginTop: volumeGap }}>
            <Svg width={plotWidth} height={volumeHeight}>
              <G>
                {volumeBars.map((bar) => (
                  <Rect
                    key={bar.id}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    opacity={0.82}
                    rx={1.5}
                  />
                ))}
              </G>
            </Svg>
          </View>
        )}

        {/* Annotations (simplified) */}
        {annotations?.map(a => {
          if (a.shape === 'vertical-line' && a.x != null) {
            const x = scaleX(a.x);
            return <View key={a.id} style={{ position: 'absolute', left: x, top: 0, width: 1, height: plotHeight, backgroundColor: a.color || '#6366f1', opacity: a.opacity ?? 1 }} />
          }
          if (a.shape === 'horizontal-line' && a.y != null) {
            const y = scaleY(a.y);
            return <View key={a.id} style={{ position: 'absolute', top: y, left: 0, height: 1, width: plotWidth, backgroundColor: a.color || '#6366f1', opacity: a.opacity ?? 1 }} />
          }
          if (a.shape === 'point' && a.x != null && a.y != null) {
            const x = scaleX(a.x) - 4; const y = scaleY(a.y) - 4;
            return <View key={a.id} style={{ position: 'absolute', left: x, top: y, width: 8, height: 8, borderRadius: 4, backgroundColor: a.color || '#f59e0b' }} />
          }
          if (a.shape === 'box' && a.x1 != null && a.x2 != null && a.y1 != null && a.y2 != null) {
            const left = scaleX(Math.min(a.x1, a.x2));
            const right = scaleX(Math.max(a.x1, a.x2));
            const top = scaleY(Math.max(a.y1, a.y2));
            const bottom = scaleY(Math.min(a.y1, a.y2));
            return <View key={a.id} style={{ position: 'absolute', left, top, width: right - left, height: bottom - top, backgroundColor: a.backgroundColor || 'rgba(99,102,241,0.15)', borderWidth: 1, borderColor: a.color || '#6366f1' }} />
          }
          if (a.shape === 'text' && a.x != null && a.y != null && a.label) {
            const x = scaleX(a.x) + 4; const y = scaleY(a.y) - 8;
            return <View key={a.id} style={{ position: 'absolute', left: x, top: y, paddingHorizontal: 4, paddingVertical: 2, backgroundColor: a.backgroundColor || 'rgba(0,0,0,0.6)' }}>
              <Text style={{ color: a.textColor || '#fff', fontSize: a.fontSize || 10 }}>{a.label}</Text>
            </View>
          }
          return null;
        })}
      </View>
      {xAxis?.show !== false && plotWidth > 0 && (
        <Axis
          scale={axisScaleX}
          orientation="bottom"
          length={plotWidth}
          offset={{ x: padding.left, y: padding.top + plotHeight }}
          tickCount={resolvedXTicks.length}
          tickSize={xAxis?.tickLength ?? 4}
          tickPadding={4}
          tickFormat={(value) => {
            const numeric = typeof value === 'number' ? value : Number(value);
            if (!Number.isFinite(numeric)) return String(value ?? '');
            return xTickFormatter(numeric);
          }}
          showLabels={xAxis?.showLabels !== false}
          showTicks={xAxis?.showTicks !== false}
          stroke={xAxis?.color || theme.colors.grid}
          strokeWidth={xAxis?.thickness ?? 1}
          label={xAxis?.title}
          labelOffset={xAxis?.title ? (xAxis?.titleFontSize ?? 12) + 20 : 40}
          tickLabelColor={xAxis?.labelColor || theme.colors.textSecondary}
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
          tickCount={resolvedYTicks.length}
          tickSize={yAxis?.tickLength ?? 4}
          tickPadding={4}
          tickFormat={(value) => {
            const numeric = typeof value === 'number' ? value : Number(value);
            if (!Number.isFinite(numeric)) return String(value ?? '');
            return priceFormatter(numeric);
          }}
          showLabels={yAxis?.showLabels !== false}
          showTicks={yAxis?.showTicks !== false}
          stroke={yAxis?.color || theme.colors.grid}
          strokeWidth={yAxis?.thickness ?? 1}
          label={yAxis?.title}
          labelOffset={yAxis?.title ? (yAxis?.titleFontSize ?? 12) + 20 : 30}
          tickLabelColor={yAxis?.labelColor || theme.colors.textSecondary}
          tickLabelFontSize={yAxis?.labelFontSize}
          labelColor={yAxis?.titleColor || theme.colors.textPrimary}
          labelFontSize={yAxis?.titleFontSize}
          style={{ width: padding.left, height: plotHeight }}
        />
      )}
      {series.length > 1 && (
        <ChartLegend
          items={series.map((s, si) => ({ label: s.name || `Series ${si + 1}`, color: s.colorBull || getColorFromScheme(si, colorSchemes.default), visible: s.visible !== false }))}
          position={props.legend?.position}
          align={props.legend?.align}
          onItemPress={(item, index, nativeEvent) => {
            const target = series[index];
            if (!target || !updateSeriesVisibility) return;
            const id = target.id || index;
            const overridden = interaction?.series.find(sr => sr.id === id)?.visible;
            const current = overridden === undefined ? target.visible !== false : overridden !== false;
            const isolate = nativeEvent?.shiftKey;
            if (isolate) {
              const visibleIds = series.filter(s => (interaction?.series.find(sr => sr.id === (s.id ?? ''))?.visible) !== false).map(s => s.id || '');
              const isSole = visibleIds.length === 1 && visibleIds[0] === id;
              series.forEach((s, si) => updateSeriesVisibility(s.id || si, isSole ? true : (s.id || si) === id));
            } else {
              updateSeriesVisibility(id, !current);
            }
          }}
        />
      )}
    </ChartContainer>
  );
};

CandlestickChart.displayName = 'CandlestickChart';
