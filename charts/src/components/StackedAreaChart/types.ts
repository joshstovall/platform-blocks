import type {
  BaseChartProps,
  ChartAnimation,
  ChartAxis,
  ChartDataPoint,
  ChartGrid,
  ChartInteractionCallbacks,
  ChartLegend,
  ChartTooltip,
} from '../../types/base';

export interface SeriesPoint {
  /** X-axis value */
  x: number;
  /** Y-axis value */
  y: number;
}

export interface StackedAreaSeries {
  /** Series name */
  name: string;
  /** Series color */
  color: string;
  /** Array of data points */
  data: SeriesPoint[];
  /** Optional visibility toggle */
  visible?: boolean;
}

export interface StackedAreaChartProps
  extends BaseChartProps,
    ChartInteractionCallbacks<ChartDataPoint> {
  /** Array of data series for the stacked area chart */
  series?: StackedAreaSeries[];
  /** X-axis configuration */
  xAxis?: ChartAxis;
  /** Y-axis configuration */
  yAxis?: ChartAxis;
  /** Grid configuration */
  grid?: ChartGrid;
  /** Legend configuration */
  legend?: ChartLegend;
  /** Tooltip configuration */
  tooltip?: ChartTooltip<ChartDataPoint>;
  /** Animation configuration */
  animation?: ChartAnimation;
  /** Enable crosshair */
  enableCrosshair?: boolean;
  /** Shared tooltip per stack */
  multiTooltip?: boolean;
  /** Live tooltip follow */
  liveTooltip?: boolean;
}

export type SimpleStackedAreaChartProps = StackedAreaChartProps;