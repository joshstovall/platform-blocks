import React from 'react';
import { View, PanResponder, GestureResponderEvent, PanResponderGestureState, Platform } from 'react-native';
import Svg, { Defs, G, LinearGradient, Rect as SvgRect, Stop, Text as SvgText } from 'react-native-svg';
import {
  HeatmapChartProps,
  HeatmapCell,
  HeatmapColorScaleConfig,
  HeatmapColorStop,
  HeatmapDataTablePayload,
  HeatmapValueFormatter,
  HeatmapLabelDisplayRule,
} from '../../types';
import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { getColorFromScheme, colorSchemes, clamp, formatNumber } from '../../utils';
import { ChartGrid } from '../../core/ChartGrid';
import { Axis } from '../../core/Axis';
import { useChartTheme } from '../../theme/ChartThemeContext';
import { AnimatedHeatmapCell } from './AnimatedHeatmapCell';
import { useHeatmapSeriesRegistration } from './useHeatmapSeriesRegistration';
import type { Scale } from '../../utils/scales';

function interpolateColor(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16); const pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
  const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${((rr << 16) | (rg << 8) | rb).toString(16).padStart(6, '0')}`;
}

function buildGradient(colors: string[], t: number) {
  if (colors.length === 0) return '#ccc';
  if (colors.length === 1) return colors[0];
  const seg = 1 / (colors.length - 1);
  const idx = Math.min(colors.length - 2, Math.floor(t / seg));
  const localT = (t - idx * seg) / seg;
  return interpolateColor(colors[idx], colors[idx + 1], localT);
}

type ProcessedHeatmapCell = HeatmapCell & {
  chartX: number;
  chartY: number;
  pixelX: number;
  pixelY: number;
  width: number;
  height: number;
  color: string;
  normalizedValue: number;
  displayValue?: string;
  showLabel: boolean;
  index: number;
  rowSum: number;
  columnSum: number;
  rowPercent: number;
  columnPercent: number;
  overallPercent: number;
  rowLabel?: string | number;
  columnLabel?: string | number;
};

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return '#ffffff';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#111827' : '#ffffff';
}

const DEFAULT_MAX_ZOOM = 6;
const LEGEND_HOVER_THROTTLE = 45;

type ValueFormatterLike = HeatmapChartProps['valueFormatter'];

interface FormatterOptions {
  decimals?: number;
  suffix?: string;
}

function buildPresetFormatter(
  preset: string,
  options: FormatterOptions | undefined
): HeatmapValueFormatter {
  return ({
    value,
    rowPercent,
    columnPercent,
    overallPercent,
  }) => {
    const decimals = options?.decimals ?? (preset.includes('percent') ? 1 : 2);
    const suffix = options?.suffix ?? '';
    switch (preset) {
      case 'percent':
        return `${formatNumber(value * 100, decimals)}%${suffix}`;
      case 'percent-of-row':
        return `${formatNumber(rowPercent * 100, decimals)}%${suffix}`;
      case 'percent-of-column':
        return `${formatNumber(columnPercent * 100, decimals)}%${suffix}`;
      case 'compact-percent':
        return `${formatNumber(overallPercent * 100, decimals)}%${suffix}`;
      case 'compact':
      default:
        return `${formatNumber(value, decimals)}${suffix}`;
    }
  };
}

function resolveValueFormatter(
  formatter: ValueFormatterLike,
  options: FormatterOptions | undefined
): HeatmapValueFormatter | undefined {
  if (!formatter) return undefined;
  if (typeof formatter === 'function') return formatter;
  if (typeof formatter === 'string') {
    return buildPresetFormatter(formatter, options);
  }
  if (typeof formatter === 'object' && formatter?.preset) {
    const { preset, decimals, suffix } = formatter;
    return buildPresetFormatter(preset, { decimals, suffix });
  }
  return undefined;
}

function deriveLegendStops(
  scale: HeatmapColorScaleConfig,
  fallbackColors: string[],
  min: number,
  max: number
): HeatmapColorStop[] {
  if (scale.stops && scale.stops.length) {
    return [...scale.stops].sort((a, b) => a.value - b.value);
  }
  if (fallbackColors.length <= 1) {
    return [
      { value: min, color: fallbackColors[0] ?? '#0EA5E9' },
      { value: max, color: fallbackColors[fallbackColors.length - 1] ?? '#1D4ED8' },
    ];
  }
  const span = fallbackColors.length - 1;
  return fallbackColors.map((color, index) => {
    const t = index / span;
    const value = min + (max - min) * t;
    return { value, color };
  });
}

// Phase 1 minimal Heatmap
export const HeatmapChart: React.FC<HeatmapChartProps> = (props) => {
  const {
    data,
    width = 420,
    height = 320,
    title,
    subtitle,
    colorScale,
    cellSize,
    gap = 2,
    style,
    xAxis,
    yAxis,
    grid,
    legend,
    tooltip,
    multiTooltip = true,
    liveTooltip = false,
    enableCrosshair = true,
    showCellLabels,
    valueFormatter,
    cellCornerRadius = 2,
    hoverHighlight,
    maxAnimatedCells = 400,
    disableAnimation = false,
  } = props;

  const theme = useChartTheme();

  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try {
    interaction = useChartInteractionContext();
  } catch {
    interaction = null;
  }
  const setPointer = interaction?.setPointer;
  const setCrosshair = interaction?.setCrosshair;
  const registerSeries = interaction?.registerSeries;

  // Normalize data and preserve matrix labels when provided
  const normalized = React.useMemo(() => {
    if (Array.isArray(data)) {
      return {
        cells: data,
        columnLabels: undefined as (string | number)[] | undefined,
        rowLabels: undefined as (string | number)[] | undefined,
      };
    }
    const { rows, cols, values } = data;
    const list: HeatmapCell[] = [];
    rows.forEach((row, rowIndex) => {
      cols.forEach((col, colIndex) => {
        const v = values[rowIndex]?.[colIndex];
        if (v == null) return;
        list.push({ x: colIndex, y: rowIndex, value: v, label: `${row}-${col}` });
      });
    });
    return {
      cells: list,
      columnLabels: cols,
      rowLabels: rows,
    };
  }, [data]);

  const cells = normalized.cells;
  const columnLabels = normalized.columnLabels;
  const rowLabels = normalized.rowLabels;

  const xMax = React.useMemo(() => {
    if (!cells.length) return -1;
    return Math.max(...cells.map((cell) => cell.x));
  }, [cells]);

  const yMax = React.useMemo(() => {
    if (!cells.length) return -1;
    return Math.max(...cells.map((cell) => cell.y));
  }, [cells]);

  const uniqueX = columnLabels?.length ?? (xMax >= 0 ? xMax + 1 : 0);
  const uniqueY = rowLabels?.length ?? (yMax >= 0 ? yMax + 1 : 0);

  const totals = React.useMemo(() => {
    const rowTotals = Array.from({ length: uniqueY }, () => 0);
    const columnTotals = Array.from({ length: uniqueX }, () => 0);
    let grandTotal = 0;
    cells.forEach((cell) => {
      rowTotals[cell.y] = (rowTotals[cell.y] ?? 0) + cell.value;
      columnTotals[cell.x] = (columnTotals[cell.x] ?? 0) + cell.value;
      grandTotal += cell.value;
    });
    const rowMax = rowTotals.reduce((acc, val) => Math.max(acc, val), 0);
    const columnMax = columnTotals.reduce((acc, val) => Math.max(acc, val), 0);
    return {
      rowTotals,
      columnTotals,
      grandTotal,
      rowMax,
      columnMax,
    };
  }, [cells, uniqueX, uniqueY]);

  const resolvedFormatter = React.useMemo(
    () => resolveValueFormatter(valueFormatter, undefined),
    [valueFormatter]
  );

  const scale: HeatmapColorScaleConfig = colorScale ?? {};
  const minVal = scale.min ?? (cells.length ? Math.min(...cells.map((c) => c.value)) : 0);
  const maxVal = scale.max ?? (cells.length ? Math.max(...cells.map((c) => c.value)) : 1);
  const colors = scale.stops?.length
    ? scale.stops.map((stop) => stop.color)
    : scale.colors || [
        getColorFromScheme(0, colorSchemes.default),
        getColorFromScheme(5, colorSchemes.default),
      ];

  const sortedStops = React.useMemo(() => {
    if (!scale.stops || !scale.stops.length) return null;
    return [...scale.stops].sort((a, b) => a.value - b.value);
  }, [scale.stops]);

  const nullFill = scale.nullColor ?? 'rgba(148, 163, 184, 0.2)';

  const normalizeValue = React.useCallback((value: number) => {
    if (!Number.isFinite(value)) return 0;
    if (maxVal === minVal) return 0.5;
    if (scale.type === 'log') {
      const safeMin = minVal <= 0 ? 1e-6 : minVal;
      const safeMax = Math.max(maxVal, safeMin * (1 + 1e-6));
      const clamped = Math.max(safeMin, Math.min(safeMax, value));
      const numerator = Math.log(clamped) - Math.log(safeMin);
      const denominator = Math.log(safeMax) - Math.log(safeMin);
      if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
        return 0;
      }
      return Math.min(1, Math.max(0, numerator / denominator));
    }
    const numerator = value - minVal;
    const denominator = maxVal - minVal;
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return 0;
    }
    return Math.min(1, Math.max(0, numerator / denominator));
  }, [maxVal, minVal, scale.type]);

  const resolveColor = React.useCallback((value: number | null | undefined) => {
    if (value == null || !Number.isFinite(value)) {
      return nullFill;
    }

    if (sortedStops && sortedStops.length) {
      if (scale.type === 'quantize') {
        for (let i = 0; i < sortedStops.length; i += 1) {
          if (value <= sortedStops[i].value) {
            return sortedStops[i].color;
          }
        }
        return sortedStops[sortedStops.length - 1].color;
      }

      let lower = sortedStops[0];
      let upper = sortedStops[sortedStops.length - 1];
      for (let i = 0; i < sortedStops.length; i += 1) {
        const stop = sortedStops[i];
        if (value === stop.value) {
          return stop.color;
        }
        if (value > stop.value) {
          lower = stop;
          continue;
        }
        upper = stop;
        break;
      }

      if (upper === lower || upper.value === lower.value) {
        return lower.color;
      }

      const ratio = (value - lower.value) / (upper.value - lower.value);
      return interpolateColor(lower.color, upper.color, Math.min(1, Math.max(0, ratio)));
    }

    if (scale.type === 'quantize' && colors.length > 0) {
      const binCount = colors.length;
      const norm = normalizeValue(value);
      const index = Math.min(binCount - 1, Math.floor(norm * binCount));
      return colors[index] ?? colors[colors.length - 1];
    }

    const norm = normalizeValue(value);
    return buildGradient(colors, norm);
  }, [colors, normalizeValue, nullFill, scale.type, sortedStops]);

  const padding = React.useMemo(() => ({ top: 40, left: 80, right: 20, bottom: 60 }), []);
  const availablePlotWidth = Math.max(0, width - padding.left - padding.right);
  const availablePlotHeight = Math.max(0, height - padding.top - padding.bottom);

  const fallbackCellWidth = React.useMemo(() => {
    if (!uniqueX) return 0;
    return Math.max(4, (availablePlotWidth - gap * Math.max(uniqueX - 1, 0)) / Math.max(uniqueX, 1));
  }, [availablePlotWidth, gap, uniqueX]);

  const fallbackCellHeight = React.useMemo(() => {
    if (!uniqueY) return 0;
    return Math.max(4, (availablePlotHeight - gap * Math.max(uniqueY - 1, 0)) / Math.max(uniqueY, 1));
  }, [availablePlotHeight, gap, uniqueY]);

  const cellW = React.useMemo(() => {
    if (!uniqueX) return 0;
    return Math.max(1, cellSize?.width ?? fallbackCellWidth);
  }, [cellSize?.width, fallbackCellWidth, uniqueX]);

  const cellH = React.useMemo(() => {
    if (!uniqueY) return 0;
    return Math.max(1, cellSize?.height ?? fallbackCellHeight);
  }, [cellSize?.height, fallbackCellHeight, uniqueY]);

  const shouldShowCellLabel = React.useCallback(
    (cell: HeatmapCell, rowPercent: number, columnPercent: number, overallPercent: number) => {
      if (typeof showCellLabels === 'boolean') {
        return showCellLabels;
      }
      if (typeof showCellLabels === 'function') {
        return showCellLabels({ cell, width: cellW, height: cellH, rowPercent, columnPercent });
      }
      if (showCellLabels && typeof showCellLabels === 'object') {
        const rule = showCellLabels as HeatmapLabelDisplayRule;
        if (rule.minValue != null && cell.value < rule.minValue) return false;
        if (rule.minRowPercent != null && rowPercent < rule.minRowPercent) return false;
        if (rule.minColumnPercent != null && columnPercent < rule.minColumnPercent) return false;
        if (rule.minOverallPercent != null && overallPercent < rule.minOverallPercent) return false;
        return true;
      }
      return Math.min(cellW, cellH) >= 26;
    },
    [cellH, cellW, showCellLabels]
  );

  const plotWidth = React.useMemo(() => {
    if (!uniqueX) return 0;
    return Math.max(0, cellW * uniqueX + gap * Math.max(uniqueX - 1, 0));
  }, [cellW, gap, uniqueX]);

  const plotHeight = React.useMemo(() => {
    if (!uniqueY) return 0;
    return Math.max(0, cellH * uniqueY + gap * Math.max(uniqueY - 1, 0));
  }, [cellH, gap, uniqueY]);

  const hoverOverlay = React.useMemo(() => ({
    showRow: hoverHighlight?.showRow ?? true,
    showColumn: hoverHighlight?.showColumn ?? true,
    rowFill: hoverHighlight?.rowFill ?? 'rgba(59, 130, 246, 0.08)',
    columnFill: hoverHighlight?.columnFill ?? 'rgba(59, 130, 246, 0.12)',
    rowOpacity: hoverHighlight?.rowOpacity,
    columnOpacity: hoverHighlight?.columnOpacity,
  }), [hoverHighlight]);

  const axisScaleX = React.useMemo<Scale<number>>(() => {
    const domain: [number, number] = uniqueX > 0 ? [0, Math.max(uniqueX - 1, 0)] : [0, 1];
    const range: [number, number] = uniqueX > 0 ? [cellW / 2, Math.max(plotWidth - cellW / 2, cellW / 2)] : [0, 0];
    const scale = ((value: number) => {
      if (!uniqueX) return 0;
      const clamped = Math.max(domain[0], Math.min(domain[1], value));
      return (cellW + gap) * clamped + cellW / 2;
    }) as Scale<number>;
    scale.domain = () => [...domain];
    scale.range = () => [...range];
    scale.ticks = () => {
      if (xAxis?.ticks && xAxis.ticks.length) return xAxis.ticks;
      return Array.from({ length: uniqueX }, (_, index) => index);
    };
    scale.bandwidth = () => cellW;
    return scale;
  }, [cellW, gap, plotWidth, uniqueX, xAxis?.ticks]);

  const axisScaleY = React.useMemo<Scale<number>>(() => {
    const domain: [number, number] = uniqueY > 0 ? [0, Math.max(uniqueY - 1, 0)] : [0, 1];
    const range: [number, number] = uniqueY > 0 ? [cellH / 2, Math.max(plotHeight - cellH / 2, cellH / 2)] : [0, 0];
    const scale = ((value: number) => {
      if (!uniqueY) return 0;
      const clamped = Math.max(domain[0], Math.min(domain[1], value));
      return (cellH + gap) * clamped + cellH / 2;
    }) as Scale<number>;
    scale.domain = () => [...domain];
    scale.range = () => [...range];
    scale.ticks = () => {
      if (yAxis?.ticks && yAxis.ticks.length) return yAxis.ticks;
      return Array.from({ length: uniqueY }, (_, index) => index);
    };
    scale.bandwidth = () => cellH;
    return scale;
  }, [cellH, gap, plotHeight, uniqueY, yAxis?.ticks]);

  const axisXTicks = React.useMemo(() => (axisScaleX.ticks ? axisScaleX.ticks() : []), [axisScaleX]);
  const axisYTicks = React.useMemo(() => (axisScaleY.ticks ? axisScaleY.ticks() : []), [axisScaleY]);

  const normalizedXTicks = React.useMemo(() => {
    if (plotWidth <= 0) return [] as number[];
    return axisXTicks
      .map((tick) => {
        if (typeof tick !== 'number') return null;
        const px = axisScaleX(tick);
        if (!Number.isFinite(px)) return null;
        return px / plotWidth;
      })
      .filter((value): value is number => value != null && Number.isFinite(value));
  }, [axisXTicks, axisScaleX, plotWidth]);

  const normalizedYTicks = React.useMemo(() => {
    if (plotHeight <= 0) return [] as number[];
    return axisYTicks
      .map((tick) => {
        if (typeof tick !== 'number') return null;
        const py = axisScaleY(tick);
        if (!Number.isFinite(py)) return null;
        return py / plotHeight;
      })
      .filter((value): value is number => value != null && Number.isFinite(value));
  }, [axisYTicks, axisScaleY, plotHeight]);

  // Process cells for AnimatedHeatmapCell components
  const processedCells = React.useMemo<ProcessedHeatmapCell[]>(() => {
    if (!cells.length) return [];
    const { rowTotals, columnTotals, grandTotal } = totals;
    return cells.map((cell, index) => {
      const pixelX = cell.x * (cellW + gap);
      const pixelY = cell.y * (cellH + gap);
      const normalizedValue = normalizeValue(cell.value);
      const color = cell.color ?? resolveColor(cell.value);
      const rowSum = rowTotals[cell.y] ?? 0;
      const columnSum = columnTotals[cell.x] ?? 0;
      const rowPercent = rowSum !== 0 ? cell.value / rowSum : 0;
      const columnPercent = columnSum !== 0 ? cell.value / columnSum : 0;
      const overallPercent = grandTotal !== 0 ? cell.value / grandTotal : 0;
      const formattedValue = resolvedFormatter
        ? resolvedFormatter({
            value: cell.value,
            cell,
            min: minVal,
            max: maxVal,
            rowSum,
            columnSum,
            totalSum: grandTotal,
            rowPercent,
            columnPercent,
            overallPercent,
          })
        : cell.formattedValue;
      const displayValue = formattedValue ?? cell.formattedValue;

      return {
        ...cell,
        index,
        chartX: pixelX + cellW / 2,
        chartY: pixelY + cellH / 2,
        pixelX,
        pixelY,
        width: cellW,
        height: cellH,
        color,
        normalizedValue,
        displayValue,
        formattedValue,
        rowSum,
        columnSum,
        rowPercent,
        columnPercent,
        overallPercent,
        rowLabel: rowLabels?.[cell.y],
        columnLabel: columnLabels?.[cell.x],
        showLabel: shouldShowCellLabel(cell, rowPercent, columnPercent, overallPercent),
      };
    });
  }, [cells, cellW, cellH, gap, normalizeValue, resolveColor, totals, resolvedFormatter, minVal, maxVal, rowLabels, columnLabels, shouldShowCellLabel]);

  const totalCells = processedCells.length;
  const animationDisabled = disableAnimation || totalCells > maxAnimatedCells;

  // Register series for tooltip interaction
  useHeatmapSeriesRegistration({
    cells: processedCells,
    seriesName: title || 'Heatmap',
    registerSeries,
  });

  const pointer = interaction?.pointer;
  const hoverCell = React.useMemo(() => {
    if (!pointer || !pointer.inside) return null;
    const localX = pointer.x - padding.left;
    const localY = pointer.y - padding.top;
    if (localX < 0 || localY < 0 || localX > plotWidth || localY > plotHeight) return null;
    const col = Math.floor(localX / (cellW + gap));
    const row = Math.floor(localY / (cellH + gap));
    if (col < 0 || row < 0 || col >= uniqueX || row >= uniqueY) return null;
    return processedCells.find((c) => c.x === col && c.y === row) ?? null;
  }, [pointer, processedCells, cellW, cellH, gap, uniqueX, uniqueY, padding.left, padding.top, plotWidth, plotHeight]);

  const columnHighlight = React.useMemo(() => {
    if (!hoverCell) return null;
    const x = Math.max(0, hoverCell.pixelX - gap / 2);
    const expandedWidth = Math.max(hoverCell.width, hoverCell.width + gap);
    const width = Math.max(0, Math.min(plotWidth - x, expandedWidth));
    return {
      x,
      width: width || hoverCell.width,
    };
  }, [gap, hoverCell, plotWidth]);

  const rowHighlight = React.useMemo(() => {
    if (!hoverCell) return null;
    const y = Math.max(0, hoverCell.pixelY - gap / 2);
    const expandedHeight = Math.max(hoverCell.height, hoverCell.height + gap);
    const height = Math.max(0, Math.min(plotHeight - y, expandedHeight));
    return {
      y,
      height: height || hoverCell.height,
    };
  }, [gap, hoverCell, plotHeight]);

  return (
    <ChartContainer
      width={width}
      height={height}
      style={style}
      interactionConfig={{ multiTooltip, liveTooltip, enableCrosshair }}
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
      <Svg width={width} height={height} style={{ position: 'absolute' }}
        // @ts-ignore
        onMouseMove={(e) => {
          if (!setPointer) return; const rect = (e.currentTarget as any).getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; setPointer({ x, y, inside: true, pageX: e.pageX, pageY: e.pageY });
          // update crosshair to current column index for multiTooltip aggregator
          const localX = x - padding.left; if (localX >= 0 && localX <= plotWidth) { const col = Math.floor(localX / (cellW + gap)); if (col >= 0 && col < uniqueX) setCrosshair?.({ dataX: col, pixelX: x }); }
        }}
        // @ts-ignore
        onMouseLeave={() => { if (interaction?.pointer) setPointer?.({ ...interaction.pointer, inside: false }); }}
      >
        <G x={padding.left} y={padding.top}>
          {hoverCell && hoverOverlay.showColumn && columnHighlight && (
            <SvgRect
              x={columnHighlight.x}
              y={0}
              width={columnHighlight.width}
              height={plotHeight}
              fill={hoverOverlay.columnFill}
              opacity={hoverOverlay.columnOpacity}
              pointerEvents="none"
            />
          )}
          {hoverCell && hoverOverlay.showRow && rowHighlight && (
            <SvgRect
              x={0}
              y={rowHighlight.y}
              width={plotWidth}
              height={rowHighlight.height}
              fill={hoverOverlay.rowFill}
              opacity={hoverOverlay.rowOpacity}
              pointerEvents="none"
            />
          )}
          {processedCells.map((cellData, index) => (
            <AnimatedHeatmapCell
              key={`${cellData.x}-${cellData.y}`}
              cell={cellData}
              isHovered={Boolean(hoverCell && hoverCell.x === cellData.x && hoverCell.y === cellData.y)}
              index={index}
              totalCells={processedCells.length}
              disabled={animationDisabled}
              cornerRadius={cellCornerRadius}
              showText={cellData.showLabel}
            />
          ))}
          {hoverCell && (
            <SvgText
              x={hoverCell.pixelX + hoverCell.width / 2}
              y={hoverCell.pixelY + hoverCell.height / 2 + Math.min(hoverCell.height * 0.1, 6)}
              fontSize={Math.max(10, Math.min(hoverCell.height * 0.45, 16))}
              fill={getContrastColor(hoverCell.color)}
              textAnchor="middle"
              pointerEvents="none"
              fontFamily='System'
              fontWeight="600"
            >
              {hoverCell.displayValue ?? (Number.isFinite(hoverCell.value)
                ? hoverCell.value % 1 === 0
                  ? hoverCell.value.toString()
                  : hoverCell.value.toFixed(1)
                : String(hoverCell.value))}
            </SvgText>
          )}
        </G>
      </Svg>
      {xAxis?.show !== false && plotWidth > 0 && (
        <Axis
          scale={axisScaleX}
          orientation="bottom"
          length={plotWidth}
          offset={{ x: padding.left, y: padding.top + plotHeight }}
          tickCount={axisXTicks.length}
          tickSize={xAxis?.tickLength ?? 4}
          tickPadding={4}
          tickFormat={(value) => {
            const numeric = typeof value === 'number' ? value : Number(value);
            if (Number.isNaN(numeric)) return String(value ?? '');
            if (xAxis?.labelFormatter) return xAxis.labelFormatter(numeric);
            if (columnLabels && columnLabels[numeric] != null) return String(columnLabels[numeric]);
            return String(numeric);
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
          tickCount={axisYTicks.length}
          tickSize={yAxis?.tickLength ?? 4}
          tickPadding={4}
          tickFormat={(value) => {
            const numeric = typeof value === 'number' ? value : Number(value);
            if (Number.isNaN(numeric)) return String(value ?? '');
            if (yAxis?.labelFormatter) return yAxis.labelFormatter(numeric);
            if (rowLabels && rowLabels[numeric] != null) return String(rowLabels[numeric]);
            return String(numeric);
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

HeatmapChart.displayName = 'HeatmapChart';

export default HeatmapChart;
