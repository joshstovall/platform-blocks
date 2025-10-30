import React from 'react';
import Svg, { G, Line, Circle, Text as SvgText } from 'react-native-svg';
import { RidgeChartProps } from './types';
import type { RidgeTooltipContext } from './types';
import { ChartContainer, ChartTitle } from '../../ChartBase';
import { useChartTheme } from '../../theme/ChartThemeContext';
import { ChartGrid } from '../../core/ChartGrid';
import { Axis } from '../../core/Axis';
import { kde, normalizeDensity } from '../../utils/density';
import { getColorFromScheme, colorSchemes } from '../../utils';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { AnimatedRidgeArea } from './AnimatedRidgeArea';
import { useRidgeSeriesRegistration } from './useRidgeSeriesRegistration';
import type { Scale } from '../../utils/scales';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const defaultValueFormatter = (value: number) => value.toFixed(1);

const computeSeriesStats = (values: number[]): { mean: number; median: number; p90: number } | null => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const total = sorted.length;
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / total;
  const mid = total / 2;
  let median: number;
  if (Number.isInteger(mid)) {
    const upper = sorted[mid];
    const lower = sorted[mid - 1];
    median = (upper + lower) / 2;
  } else {
    median = sorted[Math.floor(mid)];
  }
  const p90Index = Math.min(total - 1, Math.max(0, Math.round((total - 1) * 0.9)));
  const p90 = sorted[p90Index];
  return { mean, median, p90 } as const;
};

const STAT_LABELS: Record<'mean' | 'median' | 'p90', string> = {
  mean: 'Mean',
  median: 'Median',
  p90: 'P90',
};

// RidgeChart: vertically stacked kernel density curves (normalized) with baseline fill.
export const RidgeChart: React.FC<RidgeChartProps> = ({ 
  width = 600, 
  height = 300, 
  series, 
  title, 
  subtitle, 
  style, 
  samples = 64, 
  bandwidth,
  bandPadding,
  amplitudeScale,
  xAxis,
  yAxis,
  grid,
  statsMarkers,
}) => {
  const theme = useChartTheme();
  const padding = { top: 40, right: 20, bottom: 60, left: 80 };
  const plotWidth = Math.max(0, width - padding.left - padding.right);
  const plotHeight = Math.max(0, height - padding.top - padding.bottom);
  const count = Math.max(series.length, 1);
  const defaultScheme = colorSchemes.default;
  
  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try { interaction = useChartInteractionContext(); } catch { }
  const registerSeries = interaction?.registerSeries;
  const updateSeriesVisibility = interaction?.updateSeriesVisibility;
  const setPointer = interaction?.setPointer;
  const setCrosshair = interaction?.setCrosshair;
  
  // Domain inferred from all samples
  const allValues = series.flatMap(s => s.values);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const bandH = plotHeight / count;
  const axisLabelFormatter = xAxis?.labelFormatter;
  const bandPaddingRatio = clamp(bandPadding ?? 0.25, 0, 0.75);
  const amplitudeRatio = clamp(amplitudeScale ?? 0.85, 0.1, 1);
  const bandGap = bandH * bandPaddingRatio;
  const amplitudeHeight = Math.max(0, (bandH - bandGap) * amplitudeRatio);
  const baselineOffset = bandGap / 2;
  const sampleStep = samples > 1 ? (max - min) / Math.max(1, samples - 1) : 0;

  const densities = React.useMemo(() => {
    return series.map((s, i) => {
      const isVisible = s.visible !== false;
      let dens: Array<{ x: number; y: number; pdf: number; probability: number }> = [];
      if (isVisible) {
        const rawDensity = kde(s.values, [min, max], { bandwidth, samples });
        const normalizedDensity = normalizeDensity(rawDensity);
        dens = normalizedDensity.map((point, idx) => {
          const pdfValue = rawDensity[idx]?.y ?? 0;
          const probability = sampleStep > 0 ? Math.max(0, pdfValue * sampleStep) : 0;
          return {
            x: point.x,
            y: point.y,
            pdf: pdfValue,
            probability,
          };
        });
      }
      const color = s.color || getColorFromScheme(i, defaultScheme);
      const fillOpacity = clamp(s.fillOpacity ?? 0.6, 0, 1);
      const strokeColor = s.strokeColor || color;
      const strokeWidth = s.strokeWidth ?? 1;
      const unit = s.unit;
      const stats = computeSeriesStats(s.values);
      const valueFormatter = s.valueFormatter ?? axisLabelFormatter ?? defaultValueFormatter;
      const valueFormatterSignature = s.valueFormatter
        ? s.valueFormatter.toString()
        : axisLabelFormatter
          ? axisLabelFormatter.toString()
          : 'default';
      const unitSuffix = s.valueFormatter ? '' : unit ? ` ${unit}` : '';

      const defaultTooltipFormatter = ({ value, probability, density }: RidgeTooltipContext) => {
        const sharePercent = Math.max(0, Math.min(100, probability * 100));
        const relativePercent = Math.max(0, Math.min(100, density * 100));
        const shareLabel = sharePercent >= 1 ? sharePercent.toFixed(1) : sharePercent.toFixed(2);
        const relativeLabel = relativePercent >= 1 ? relativePercent.toFixed(1) : relativePercent.toFixed(2);
        return `${valueFormatter(value)}${unitSuffix} • share ${shareLabel}% • relative ${relativeLabel}%`;
      };

      const tooltipFormatter = s.tooltipFormatter ?? defaultTooltipFormatter;
      const tooltipFormatterSignature = s.tooltipFormatter
        ? s.tooltipFormatter.toString()
        : `default-${valueFormatterSignature}-${unit ?? ''}`;

      return {
        id: s.id || i,
        color,
        dens,
        name: s.name || `Series ${i + 1}`,
        visible: isVisible,
        fillOpacity,
        strokeColor,
        strokeWidth,
        tooltipFormatter,
        tooltipFormatterSignature,
        valueFormatter,
        valueFormatterSignature,
        unit,
        stats,
        unitSuffix,
      };
    });
  }, [series, min, max, bandwidth, samples, defaultScheme, axisLabelFormatter, sampleStep]);

  // Create axis scales
  const axisScaleX = React.useMemo<Scale<number>>(() => {
    const range: [number, number] = [0, plotWidth];
    const scale = ((value: number) => ((value - min) / (max - min || 1)) * plotWidth) as Scale<number>;
    
    scale.domain = () => [min, max];
    scale.range = () => range;
    scale.invert = (pixel: number) => min + ((pixel / plotWidth) * (max - min || 1));
    scale.ticks = () => {
      if (xAxis?.ticks && xAxis.ticks.length) return xAxis.ticks;
      const tickCount = Math.min(6, Math.max(3, Math.floor(plotWidth / 80)));
      const ticks = [];
      for (let i = 0; i <= tickCount; i++) {
        ticks.push(min + (i / tickCount) * (max - min));
      }
      return ticks;
    };
    scale.bandwidth = () => plotWidth / (max - min || 1);
    return scale;
  }, [min, max, plotWidth, xAxis?.ticks]);

  const axisScaleY = React.useMemo<Scale<string>>(() => {
    const range: [number, number] = [plotHeight, 0];
    const scale = ((value: string | number) => {
      const index = typeof value === 'number' ? value : series.findIndex(s => s.name === value);
      return index * bandH + bandH / 2;
    }) as Scale<string>;
    
    scale.domain = () => series.map((s, i) => s.name || `Series ${i + 1}`);
    scale.range = () => range;
    scale.ticks = () => series.map((s, i) => s.name || `Series ${i + 1}`);
    scale.bandwidth = () => bandH;
    return scale;
  }, [series, plotHeight, bandH]);

  const scaleX = (x: number) => ((x - min) / (max - min || 1)) * plotWidth;
  // y within each band: 0 at baseline, density extends upward (scaled to band height * 0.9)
  const ridgePath = (dens: { x: number; y: number }[], idx: number) => {
    if (!dens.length) return '';
    const bandTop = idx * bandH;
    const baseY = bandTop + bandH - baselineOffset;
    const amplitude = amplitudeHeight;
    let d = '';
    dens.forEach((p, i) => {
      const x = scaleX(p.x);
      const y = baseY - p.y * amplitude;
      d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    });
    const lastX = scaleX(dens[dens.length - 1].x);
    const firstX = scaleX(dens[0].x);
    d += ` L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
    return d;
  };

  // Prepare registration data for series interaction
  const registrationData = React.useMemo(() => {
    return densities.map((r, i) => ({
      id: r.id,
      name: r.name || `Series ${i + 1}`,
      color: r.color,
      visible: r.visible,
      densityData: r.visible
        ? r.dens.map((p) => ({
            x: p.x,
            yNormalized: p.y,
            pdf: p.pdf,
            probability: p.probability,
            bandIndex: i,
            originalValue: p.x,
          }))
        : [],
      tooltipFormatter: r.tooltipFormatter,
      tooltipFormatterSignature: r.tooltipFormatterSignature,
      valueFormatter: r.valueFormatter,
      valueFormatterSignature: r.valueFormatterSignature,
      stats: r.stats,
      unit: r.unit,
      unitSuffix: r.unitSuffix,
    }));
  }, [densities]);

  const visibleSeriesCount = React.useMemo(() => densities.filter((entry) => entry.visible).length, [densities]);

  const markerSettings = React.useMemo(() => {
    const explicitEnabled = statsMarkers?.enabled;
    let showMean = statsMarkers?.showMean ?? (explicitEnabled ? true : false);
    let showMedian = statsMarkers?.showMedian ?? (explicitEnabled ? true : false);
    let showP90 = statsMarkers?.showP90 ?? false;
    const enabled = explicitEnabled ?? (showMean || showMedian || showP90);
    if (!enabled) {
      showMean = false;
      showMedian = false;
      showP90 = false;
    }
    const markerHeight = statsMarkers?.markerHeight ?? Math.min(18, Math.max(6, amplitudeHeight * 0.6));
    const strokeWidthMarker = statsMarkers?.strokeWidth ?? 2;
    const colors = statsMarkers?.colors ?? {};
    const showLabels = statsMarkers?.showLabels ?? false;
    const labelOffset = statsMarkers?.labelOffset ?? 6;
    const labelFormatter = statsMarkers?.labelFormatter;
    return {
      enabled,
      showMean,
      showMedian,
      showP90,
      markerHeight,
      strokeWidth: strokeWidthMarker,
      colors,
      showLabels,
      labelOffset,
      labelFormatter,
    };
  }, [statsMarkers, amplitudeHeight]);

  // Register series for tooltip interaction
  useRidgeSeriesRegistration({
    series: registrationData,
    registerSeries,
    updateSeriesVisibility,
  });

  // Generate normalized ticks for ChartGrid
  const normalizedXTicks = React.useMemo(() => {
    if (plotWidth <= 0) return [];
    return axisScaleX.ticks?.()
      .map((tick) => {
        const px = axisScaleX(tick);
        return px / plotWidth;
      })
      .filter((value): value is number => value != null && Number.isFinite(value)) || [];
  }, [axisScaleX, plotWidth]);

  const normalizedYTicks = React.useMemo(() => {
    if (plotHeight <= 0) return [];
    return series.map((_, i) => (i * bandH + bandH / 2) / plotHeight);
  }, [series, bandH, plotHeight]);

  let renderIndex = -1;

  return (
    <ChartContainer 
      width={width} 
      height={height} 
      style={style} 
      interactionConfig={{ multiTooltip: true, enableCrosshair: true }}
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
      
      <Svg
        width={width}
        height={height}
        style={{ position: 'absolute' }}
        // @ts-ignore web
        onMouseMove={(e) => {
          if (!setPointer) return; 
          const rect = (e.currentTarget as any).getBoundingClientRect();
          const px = e.clientX - rect.left - padding.left; 
          const py = e.clientY - rect.top - padding.top;
          setPointer({ x: px + padding.left, y: py + padding.top, inside: true, pageX: e.pageX, pageY: e.pageY });
          const dataX = min + ((px / plotWidth) * (max - min || 1));
          setCrosshair?.({ dataX, pixelX: px + padding.left });
        }}
        onMouseLeave={() => { 
          setCrosshair?.(null); 
          if (interaction?.pointer && setPointer) { 
            setPointer({ ...interaction.pointer, inside: false }); 
          } 
        }}
      >
        <G x={padding.left} y={padding.top}>
          {densities.map((r, i) => {
            if (!r.visible) return null;
            const sourceSeries = series[i];
            if (!sourceSeries) return null;
            renderIndex += 1;

            const path = ridgePath(r.dens, i);
            const baseY = i * bandH + bandH - baselineOffset;
            const markerElements: React.ReactNode[] = [];

            if (markerSettings.enabled && r.stats) {
              const { markerHeight, strokeWidth: markerStrokeWidth } = markerSettings;
              const lineHeight = Math.max(1, markerHeight);
              const radius = Math.max(1, markerStrokeWidth * 1.5);
              const colorFor = (stat: 'mean' | 'median' | 'p90') => markerSettings.colors?.[stat] ?? r.strokeColor ?? r.color;
              const formatValue = r.valueFormatter;
              const suffix = r.unitSuffix ?? '';

              const pushMarker = (stat: 'mean' | 'median' | 'p90', enabled: boolean, value?: number | null) => {
                if (!enabled || value == null) return;
                const xPos = scaleX(value);
                if (!Number.isFinite(xPos)) return;
                const clampedX = Math.min(Math.max(xPos, 0), plotWidth);
                const topY = baseY - lineHeight;
                let label: string | null = null;
                let formattedValue = '';
                if (markerSettings.showLabels || markerSettings.labelFormatter) {
                  const formattedRaw = formatValue(value);
                  formattedValue = typeof formattedRaw === 'number' ? String(formattedRaw) : formattedRaw;
                  const defaultLabel = `${STAT_LABELS[stat]} ${formattedValue}${suffix}`;
                  label = markerSettings.showLabels
                    ? markerSettings.labelFormatter
                      ? markerSettings.labelFormatter({ stat, value, formattedValue, series: sourceSeries })
                      : defaultLabel
                    : null;
                }

                markerElements.push(
                  <React.Fragment key={`${r.id}-${stat}`}>
                    <Line
                      x1={clampedX}
                      y1={baseY}
                      x2={clampedX}
                      y2={topY}
                      stroke={colorFor(stat)}
                      strokeWidth={markerStrokeWidth}
                      strokeLinecap="round"
                    />
                    <Circle cx={clampedX} cy={topY} r={radius} fill={colorFor(stat)} />
                    {markerSettings.showLabels && label ? (
                      <SvgText
                        x={clampedX}
                        y={topY - markerSettings.labelOffset}
                        fill={theme.colors.textSecondary}
                        fontSize={10}
                        textAnchor="middle"
                      >
                        {label}
                      </SvgText>
                    ) : null}
                  </React.Fragment>
                );
              };

              pushMarker('mean', markerSettings.showMean, r.stats.mean);
              pushMarker('median', markerSettings.showMedian, r.stats.median);
              pushMarker('p90', markerSettings.showP90, r.stats.p90);
            }

            return (
              <React.Fragment key={r.id}>
                <AnimatedRidgeArea
                  path={path}
                  fill={r.color}
                  fillOpacity={r.fillOpacity}
                  stroke={r.strokeColor}
                  strokeWidth={r.strokeWidth}
                  index={renderIndex}
                  totalAreas={Math.max(visibleSeriesCount, 1)}
                />
                {markerElements}
              </React.Fragment>
            );
          })}
        </G>
      </Svg>
      
      {xAxis?.show !== false && plotWidth > 0 && (
        <Axis
          scale={axisScaleX}
          orientation="bottom"
          length={plotWidth}
          offset={{ x: padding.left, y: padding.top + plotHeight }}
          tickCount={axisScaleX.ticks?.().length || 5}
          tickSize={xAxis?.tickLength ?? 4}
          tickPadding={4}
          tickFormat={(value) => {
            if (xAxis?.labelFormatter) return xAxis.labelFormatter(value);
            return typeof value === 'number' ? value.toFixed(1) : String(value);
          }}
          showLabels={xAxis?.showLabels !== false}
          showTicks={xAxis?.showTicks !== false}
          stroke={xAxis?.color || theme.colors.grid}
          strokeWidth={xAxis?.thickness ?? 1}
          label={xAxis?.title}
          labelOffset={xAxis?.title ? (xAxis?.titleFontSize ?? 12) + 20 : 30}
          tickLabelColor={xAxis?.labelColor || theme.colors.textSecondary}
          tickLabelFontSize={xAxis?.labelFontSize}
          labelColor={xAxis?.titleColor || theme.colors.textPrimary}
          labelFontSize={xAxis?.titleFontSize}
          style={{ width: plotWidth, height: padding.bottom }}
        />
      )}
      
      {yAxis?.show !== false && plotHeight > 0 && (
        <Axis
          scale={axisScaleY}
          orientation="left"
          length={plotHeight}
          offset={{ x: padding.left, y: padding.top }}
          tickCount={series.length}
          tickSize={yAxis?.tickLength ?? 4}
          tickPadding={4}
          tickFormat={(value) => {
            if (yAxis?.labelFormatter) return yAxis.labelFormatter(value);
            return String(value);
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
    </ChartContainer>
  );
};
RidgeChart.displayName = 'RidgeChart';
