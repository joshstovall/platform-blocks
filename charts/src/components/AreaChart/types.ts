import type { LineChartProps } from '../LineChart/types';

export type AreaChartLayout = 'overlap' | 'stacked' | 'stackedPercentage';

export interface AreaChartProps extends LineChartProps {
  /**
   * Controls how multiple series are rendered.
   * - `overlap` leaves each area independent (default).
   * - `stacked` cumulatively stacks values and renders using stacked layers.
   */
  layout?: AreaChartLayout;
  /** Opacity used when rendering stacked layers (if not provided defaults to fillOpacity). */
  areaOpacity?: number;
  /** Adjust the stacking order when using stacked layouts. */
  stackOrder?: 'normal' | 'reverse';
}