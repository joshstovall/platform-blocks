import type { ReactNode } from 'react';

import type {
  BaseChartProps,
  ChartAnimation,
  ChartInteractionCallbacks,
  ChartLegend,
  ChartTooltip,
} from '../../types/base';

export interface DonutChartDataPoint {
  /** Unique identifier for the slice */
  id?: string | number;
  /** Display label */
  label: string;
  /** Numerical value */
  value: number;
  /** Optional color override */
  color?: string;
  /** Custom metadata forwarded through interactions */
  data?: any;
}

export interface DonutChartRing {
  /** Unique identifier for the ring */
  id?: string | number;
  /** Human readable label for tooltips or analytics */
  label?: string;
  /** Data rendered in this ring */
  data: DonutChartDataPoint[];
  /** Padding between slices specific to this ring (degrees) */
  padAngle?: number;
  /** Starting angle override (degrees) */
  startAngle?: number;
  /** Ending angle override (degrees) */
  endAngle?: number;
  /** Explicit thickness for the ring */
  thickness?: number;
  /** Thickness ratio (0-1) relative to chart radius when explicit thickness is not provided */
  thicknessRatio?: number;
  /** Explicit inner radius ratio (0-1) relative to chart radius */
  innerRadiusRatio?: number;
  /** Optional palette to cycle through when slice colors are not provided */
  colorPalette?: string[];
  /** Determines whether slices from this ring appear in the legend (default true for primary ring) */
  showInLegend?: boolean;
}

export interface DonutChartSliceDetails extends DonutChartDataPoint {
  ringId: string;
  ringIndex: number;
  ringLabel?: string;
  color: string;
  percentage: number;
}

export interface DonutChartRingDetails {
  id: string;
  index: number;
  label?: string;
  total: number;
  slices: DonutChartSliceDetails[];
}

export interface DonutChartCenterRenderContext {
  total: number;
  primaryRing?: DonutChartRingDetails;
  rings: DonutChartRingDetails[];
  focusedSlice: DonutChartSliceDetails | null;
}

export type DonutChartCenterRenderer = (context: DonutChartCenterRenderContext) => ReactNode;

export interface DonutChartLabelFormatterContext {
  slice: DonutChartSliceDetails;
  ring: DonutChartRingDetails;
  value: number;
  percentage: number;
}

export interface DonutChartLabelsConfig {
  /** Enable or disable label rendering */
  show?: boolean;
  /** Target rings by numeric index or id */
  rings?: Array<number | string>;
  /** Place labels inside the ring or outside with leader lines */
  position?: 'inside' | 'outside';
  /** Custom formatter for label lines */
  formatter?: (context: DonutChartLabelFormatterContext) => string | string[] | null | undefined;
  /** Whether to append a formatted value line */
  showValue?: boolean;
  /** Whether to append a percentage line */
  showPercentage?: boolean;
  /** Formatter for the numeric value when showValue is true */
  valueFormatter?: (context: DonutChartLabelFormatterContext) => string;
  /** Minimum slice sweep (degrees) required before labeling */
  minAngle?: number;
  /** Override label font size */
  fontSize?: number;
  /** Override label color */
  textColor?: string;
  /** Override line height for multi-line labels */
  lineHeight?: number;
  /** Offset distance applied beyond the ring edge (for outside labels) */
  offset?: number;
  /** Configuration for leader lines */
  leaderLine?: {
    show?: boolean;
    color?: string;
    width?: number;
    length?: number;
  };
}

export type DonutCenterValueFormatter = (
  value: number,
  total: number,
  dataPoint?: DonutChartDataPoint | null
) => string;

export type DonutCenterLabelFormatter = (
  total: number,
  data: DonutChartDataPoint[],
  focused?: DonutChartDataPoint | null
) => string;

export interface DonutChartProps
  extends BaseChartProps,
    ChartInteractionCallbacks<DonutChartDataPoint> {
  /** Data points rendered in the donut */
  data?: DonutChartDataPoint[];
  /** Optional multi-ring configuration. When provided, the top-level data acts as a fallback */
  rings?: DonutChartRing[];
  /** Convenience size that sets both width and height when explicit values are omitted */
  size?: number;
  /** Ratio (0-1) of the inner radius relative to the outer radius when thickness is not provided */
  innerRadiusRatio?: number;
  /** Explicit ring thickness override (outerRadius - innerRadius) */
  thickness?: number;
  /** Gap in chart units between concentric rings (defaults to 8 for multi-ring charts) */
  ringGap?: number;
  /** Padding between slices in degrees */
  padAngle?: number;
  /** Starting angle for the first slice (degrees) */
  startAngle?: number;
  /** Ending angle for the last slice (degrees) */
  endAngle?: number;
  /** Index of the ring used for center totals and value formatting (defaults to 0) */
  primaryRingIndex?: number;
  /** Index of the ring whose slices feed the legend (defaults to primaryRingIndex) */
  legendRingIndex?: number;
  /** When true, slices across rings reuse colors based on their label/id */
  inheritColorByLabel?: boolean;
  /** Legend configuration */
  legend?: ChartLegend;
  /** Tooltip configuration */
  tooltip?: ChartTooltip<DonutChartDataPoint>;
  /** Animation configuration */
  animation?: ChartAnimation;
  /** Primary label rendered in the center (string or formatter) */
  centerLabel?: string | DonutCenterLabelFormatter;
  /** Secondary label rendered beneath the primary center label */
  centerSubLabel?: string | DonutCenterLabelFormatter;
  /** Formatter for the numerical value shown in the center */
  centerValueFormatter?: DonutCenterValueFormatter;
  /** Custom renderer for the center content. When provided, overrides default labels */
  renderCenterContent?: DonutChartCenterRenderer;
  /** Label displayed when no data is provided */
  emptyLabel?: string;
  /** Optional padding override for the chart container */
  padding?: { top: number; right: number; bottom: number; left: number };
  /** When true, clicking a slice isolates it (toggles other slices off) and another click restores */
  isolateOnClick?: boolean;
  /** Global label rendering configuration */
  labels?: DonutChartLabelsConfig;
}

export type SimpleDonutChartProps = DonutChartProps;