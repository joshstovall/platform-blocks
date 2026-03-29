import type { ComboChartProps } from '../ComboChart/types';

export interface ParetoChartDatum {
  /** Category or defect name represented by the bar. */
  label: string;
  /** Absolute contribution for the category. */
  value: number;
  /** Optional color override applied to the bar for this category. */
  color?: string;
}

export interface ParetoChartProps extends Omit<ComboChartProps, 'layers'> {
  /** Raw categories to render inside the Pareto analysis. */
  data: ParetoChartDatum[];
  /** Sorting direction applied before calculating cumulative percentages. */
  sortDirection?: 'desc' | 'asc' | 'none';
  /** Display label for the bar series. */
  valueSeriesLabel?: string;
  /** Display label for the cumulative line series. */
  cumulativeSeriesLabel?: string;
  /** Base color used for the bar series when data points do not provide one. */
  barColor?: string;
  /** Base color used for the cumulative line series. */
  lineColor?: string;
  /** Optional formatter applied to the categorical axis labels. */
  categoryLabelFormatter?: (category: string, index: number) => string;
}
