import type { BaseChartProps, ChartLegend } from '../../types/base';

export interface GaugeChartRange {
  /** Starting value for the range segment */
  from: number;
  /** Ending value for the range segment */
  to: number;
  /** Color used to render the segment */
  color?: string;
  /** Optional legend label */
  label?: string;
  /** Optional thickness override for this segment */
  thickness?: number;
  /** Optional linear gradient definition for the segment */
  gradient?: {
    /** Unique gradient angle in degrees (0 = left to right) */
    angle?: number;
    /** Gradient stops; defaults to [0, 1] with color/from/to */
    stops: Array<{
      offset: number;
      color: string;
      opacity?: number;
    }>;
  };
}

export interface GaugeChartMarker {
  /** Marker rendering style */
  type?: 'tick' | 'needle';
  /** Numeric position for the marker */
  value: number;
  /** Optional textual label shown near the marker */
  label?: string;
  /** Marker stroke / legend color */
  color?: string;
  /** Line length in px (defaults to track thickness) */
  size?: number;
  /** Radial offset from the track radius (positive pushes outward) */
  offset?: number;
  /** Marker stroke width */
  width?: number;
  /** Needle length ratio when rendering a secondary needle marker */
  needleLength?: number;
  /** Needle width override when rendering a secondary needle marker */
  needleWidth?: number;
  /** Whether the marker should start from the center when using the needle type */
  needleFromCenter?: boolean;
  /** Offset used when rendering the label */
  labelOffset?: number;
  /** Label color override */
  labelColor?: string;
  /** Label font size override */
  labelFontSize?: number;
  /** Include marker entry in legend (defaults to true when label provided) */
  showInLegend?: boolean;
}

export interface GaugeChartTickConfig {
  /** Display ticks (defaults to true when config provided) */
  show?: boolean;
  /** Number of major ticks including endpoints */
  major?: number;
  /** Number of minor ticks between each major tick */
  minor?: number;
  /** Explicit major tick positions */
  majorPositions?: number[];
  /** Explicit minor tick positions */
  minorPositions?: number[];
  /** Major tick length in px */
  majorLength?: number;
  /** Minor tick length in px */
  minorLength?: number;
  /** Tick stroke color */
  color?: string;
  /** Tick stroke width */
  width?: number;
}

export interface GaugeChartLabelConfig {
  /** Toggle label visibility */
  show?: boolean;
  /** Custom label positions */
  positions?: number[];
  /** Label formatter */
  formatter?: (value: number) => string;
  /** Label color */
  color?: string;
  /** Label font size */
  fontSize?: number;
  /** Offset distance from gauge radius */
  offset?: number;
  /** Font weight */
  fontWeight?: 'normal' | 'bold' | '600' | '700';
}

export interface GaugeChartNeedleConfig {
  /** Toggle needle visibility */
  show?: boolean;
  /** Needle color */
  color?: string;
  /** Needle stroke width */
  width?: number;
  /** Needle length as percentage of radius (0-1) */
  length?: number;
  /** Radius of the center hub */
  centerSize?: number;
  /** Center hub color */
  centerColor?: string;
  /** Whether to render the center hub */
  showCenter?: boolean;
}

export interface GaugeChartCenterLabelConfig {
  /** Toggle center label */
  show?: boolean;
  /** Static text to display */
  text?: string;
  /** Formatter for primary text */
  formatter?: (value: number, percentage: number) => string;
  /** Secondary text or formatter */
  secondaryText?: string | ((value: number, percentage: number) => string);
  /** Primary text color */
  color?: string;
  /** Secondary text color */
  secondaryColor?: string;
  /** Primary font size */
  fontSize?: number;
  /** Secondary font size */
  secondaryFontSize?: number;
  /** Spacing between lines */
  gap?: number;
}

export interface GaugeChartTrackConfig {
  /** Toggle track rendering */
  show?: boolean;
  /** Track color */
  color?: string;
  /** Track opacity */
  opacity?: number;
  /** Track thickness override */
  thickness?: number;
}

export interface GaugeChartProps extends BaseChartProps {
  /** Current value */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Gauge start angle (degrees, 0 = top) */
  startAngle?: number;
  /** Gauge end angle (degrees, 0 = top) */
  endAngle?: number;
  /** Rotation offset applied to the entire gauge */
  rotationOffset?: number;
  /** Base arc thickness */
  thickness?: number;
  /** Ratio of inner radius to outer radius when rendering donut style gauges */
  innerRadiusRatio?: number;
  /** Track configuration */
  track?: GaugeChartTrackConfig;
  /** Value ranges displayed on the gauge */
  ranges?: GaugeChartRange[];
  /** Tick configuration */
  ticks?: GaugeChartTickConfig;
  /** Label configuration */
  labels?: GaugeChartLabelConfig;
  /** Needle configuration */
  needle?: GaugeChartNeedleConfig;
  /** Center label configuration */
  centerLabel?: GaugeChartCenterLabelConfig;
  /** Legend configuration */
  legend?: ChartLegend;
  /** Discrete markers rendered along the gauge arc */
  markers?: GaugeChartMarker[];
  /** Strategy used to decide which marker is considered focused */
  markerFocusStrategy?: 'closest' | 'leading';
  /** Threshold in value units before switching focus when using the closest strategy */
  markerFocusThreshold?: number;
  /** Optional formatted output for external display */
  valueFormatter?: (value: number, percentage: number) => string;
  /** Fired when the gauge value updates */
  onValueChange?: (value: number, percentage: number, previousValue: number) => void;
  /** Fired when the active marker changes */
  onMarkerFocus?: (marker: GaugeChartMarker | null) => void;
}
