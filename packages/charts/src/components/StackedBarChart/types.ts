import type {
  BaseChartProps,
  ChartAnimation,
  ChartAxis,
  ChartGrid,
  ChartInteractionCallbacks,
  ChartLegend,
} from '../../types/base';
import type { BarChartDataPoint } from '../BarChart/types';

export interface StackedBarSeries {
  /** Unique identifier for the series */
  id?: string | number;
  /** Display name for the series */
  name?: string;
  /** Data points contained in the series */
  data: BarChartDataPoint[];
  /** Base color applied to the series */
  color?: string;
  /** Whether the series is visible */
  visible?: boolean;
}

export interface StackedBarChartProps
  extends BaseChartProps,
    ChartInteractionCallbacks<BarChartDataPoint> {
  /** Stacked bar series to render */
  series: StackedBarSeries[];
  /** Gap between stacked groups */
  barSpacing?: number;
  /** Legend configuration */
  legend?: ChartLegend;
  /** X-axis configuration */
  xAxis?: ChartAxis;
  /** Y-axis configuration */
  yAxis?: ChartAxis;
  /** Grid line configuration */
  grid?: ChartGrid;
  /** Animation configuration */
  animation?: ChartAnimation;
}