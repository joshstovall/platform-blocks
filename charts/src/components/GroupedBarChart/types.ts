import type {
  BaseChartProps,
  ChartAnimation,
  ChartAxis,
  ChartGrid,
  ChartInteractionCallbacks,
  ChartLegend,
} from '../../types/base';
import type { BarChartDataPoint } from '../BarChart/types';
import type { StackedBarSeries } from '../StackedBarChart/types';

export interface GroupedBarColorOptions {
  /** Palette name or array used for automatic colors */
  palette?: string | any;
  /** Enable color hashing based on category labels */
  hash?: boolean;
}

export interface GroupedBarValueLabelFormatterParams {
  /** Raw numeric value for the bar */
  value: number;
  /** Category the bar belongs to */
  category: string;
  /** Zero-based index of the category */
  categoryIndex: number;
  /** Identifier for the series */
  seriesId: string;
  /** Optional human readable series name */
  seriesName?: string;
  /** Zero-based index of the series */
  seriesIndex: number;
  /** Original datum backing the bar */
  datum: BarChartDataPoint;
}

export interface GroupedBarValueLabelConfig {
  /** Display numeric labels for each bar */
  show?: boolean;
  /** Position strategy for labels */
  position?: 'inside' | 'outside' | 'auto';
  /** Custom formatter for label text */
  formatter?: (params: GroupedBarValueLabelFormatterParams) => string | number;
  /** Text color */
  color?: string;
  /** Font size */
  fontSize?: number;
  /** Font weight */
  fontWeight?: string | number;
  /** Font family override */
  fontFamily?: string;
  /** Pixel offset applied to label placement */
  offset?: number;
  /** Minimum bar height (px) required to keep labels inside */
  minBarHeightForInside?: number;
}

export interface GroupedBarChartProps
  extends BaseChartProps,
    ChartInteractionCallbacks<BarChartDataPoint> {
  /** Grouped series data to render */
  series: StackedBarSeries[];
  /** Gap between grouped categories */
  barSpacing?: number;
  /** Gap between bars inside a group */
  innerBarSpacing?: number;
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
  /** Palette and hashing options for bar colors */
  colorOptions?: GroupedBarColorOptions;
  /** Optional bar value label configuration */
  valueLabels?: GroupedBarValueLabelConfig;
  /** Enable multi-series aggregated tooltip content */
  multiTooltip?: boolean;
  /** Keep tooltip visible while pointer moves within chart */
  liveTooltip?: boolean;
  /** Toggle crosshair overlay and events (defaults to enabled) */
  enableCrosshair?: boolean;
}