import type { BaseChartProps } from '../../types/base';

export interface SparklineDomain {
  /** Explicit x-axis domain override */
  x?: [number, number];
  /** Explicit y-axis domain override */
  y?: [number, number];
}

export interface SparklinePoint {
  /** X-axis value for the sparkline point */
  x: number;
  /** Y-axis value for the sparkline point */
  y: number;
}

export interface SparklineThreshold {
  /** Target value to render as a horizontal guide */
  value: number;
  /** Override line color */
  color?: string;
  /** Line opacity (0-1) */
  opacity?: number;
  /** Render as dashed guide */
  dashed?: boolean;
  /** Optional text label */
  label?: string;
  /** Label placement along the line */
  labelPosition?: 'left' | 'right';
  /** Custom label color */
  labelColor?: string;
  /** Offset label vertically (px) */
  labelOffset?: number;
}

export interface SparklineExtremaHighlight {
  /** Render marker for minimum value */
  showMin?: boolean;
  /** Render marker for maximum value */
  showMax?: boolean;
  /** Marker fill color (defaults to line color) */
  color?: string;
  /** Marker radius */
  radius?: number;
  /** Outline color */
  strokeColor?: string;
  /** Outline width */
  strokeWidth?: number;
}

export interface SparklineBand {
  /** Lower bound of the band */
  from: number;
  /** Upper bound of the band */
  to: number;
  /** Fill color (defaults to line color) */
  color?: string;
  /** Fill opacity (0-1) */
  opacity?: number;
}

export type SparklineAnimationEasing = 'linear' | 'easeOutCubic' | 'easeInOutCubic' | 'easeOutQuad';

export interface SparklineAnimationOptions {
  /** Enable/disable line animation */
  enabled?: boolean;
  /** Animation duration in ms */
  duration?: number;
  /** Delay in ms before animation starts */
  delay?: number;
  /** Easing preset */
  easing?: SparklineAnimationEasing;
}

// Sparkline Types (minimal footprint line chart)
export interface SparklineChartProps extends BaseChartProps {
  /** Optional unique series ID */
  id?: string | number;
  /** Optional series name (for tooltip) */
  name?: string;
  /** Data points (plain y values or explicit {x,y} pairs) */
  data: number[] | SparklinePoint[];
  /** Line color */
  color?: string;
  /** Fill area under line */
  fill?: boolean;
  /** Fill opacity */
  fillOpacity?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Curve smoothing */
  smooth?: boolean;
  /** Show data points */
  showPoints?: boolean;
  /** Point size (for individual data points) */
  pointSize?: number;
  /** Provide min/max to avoid re-scaling jitter across multiple sparklines */
  domain?: SparklineDomain;
  /** Show last value bubble */
  highlightLast?: boolean;
  /** Show min/max markers */
  highlightExtrema?: boolean | SparklineExtremaHighlight;
  /** Format displayed last value */
  valueFormatter?: (value: number) => string;
  /** Compact tooltip when hovered (web) */
  liveTooltip?: boolean;
  /** Enable aggregated tooltip when multiple sparklines share context */
  multiTooltip?: boolean;
  /** Horizontal threshold guides */
  thresholds?: SparklineThreshold[];
  /** Highlight background regions */
  bands?: SparklineBand[];
  /** Control reveal animation */
  animation?: SparklineAnimationOptions;
}
