import type {
  BaseChartProps,
  ChartAxis,
  ChartGrid,
  ChartInteractionCallbacks,
  ChartLegend,
} from '../../types/base';

/** Segment describing a sub-category contribution within a Marimekko column. */
export interface MarimekkoSegment {
  /** Unique identifier within the category (falls back to the label). */
  id?: string | number;
  /** Display label for the segment. */
  label: string;
  /** Absolute measure represented by the segment. */
  value: number;
  /** Optional color override applied to this segment instance. */
  color?: string;
  /** Whether the segment is visible. */
  visible?: boolean;
  /** Arbitrary user data carried through interaction callbacks. */
  data?: any;
  /** Total for the category after applying legend visibility (injected by the chart). */
  visibleCategoryTotal?: number;
  /** Share of the visible dataset contributed by the category (injected by the chart). */
  visibleCategoryShare?: number;
}

/** Column within a Marimekko chart composed of stacked segments. */
export interface MarimekkoCategory {
  /** Pre-formatted helpers for tooltip rendering. */
  /** Unique identifier (falls back to the label). */
  id?: string | number;
  /** Display label for the category column. */
  label: string;
  /** Optional base color applied to segments that do not override their own color. */
  color?: string;
  /** Segments stacked within this category column. */
  segments: MarimekkoSegment[];
  /** Whether this category column is visible. */
  visible?: boolean;
  /** Arbitrary user data passed through interaction callbacks. */
  data?: any;
}

/** Rich metadata surfaced for interactions in the Marimekko chart. */
export interface MarimekkoDataPoint {
  categoryId?: string | number;
  categoryLabel: string;
  categoryIndex: number;
  categoryValue: number;
  categoryShare: number;
  visibleCategoryTotal: number;
  visibleCategoryShare: number;
  segmentId?: string | number;
  segmentLabel: string;
  segmentIndex: number;
  value: number;
  segmentShareOfCategory: number;
  visibleSegmentShareOfCategory: number;
  segmentShareOfTotal: number;
  visibleSegmentShareOfTotal: number;
  color: string;
  category?: MarimekkoCategory;
  segment?: MarimekkoSegment;
  formattedValue: string;
  formattedSegmentShareOfCategory: string;
  formattedVisibleSegmentShareOfCategory: string;
  formattedSegmentShareOfTotal: string;
  formattedVisibleSegmentShareOfTotal: string;
}

export interface MarimekkoChartProps
  extends BaseChartProps,
    ChartInteractionCallbacks<MarimekkoDataPoint> {
  /** Categories rendered as variable-width columns. */
  data: MarimekkoCategory[];
  /** Optional legend configuration. */
  legend?: ChartLegend;
  /** Optional x-axis configuration. */
  xAxis?: ChartAxis;
  /** Optional y-axis configuration (defaults to percentage scale). */
  yAxis?: ChartAxis;
  /** Grid configuration applied to the background. */
  grid?: ChartGrid;
  /** Gap (in pixels) inserted between columns. */
  columnGap?: number;
  /** Corner radius applied to each segment rectangle. */
  segmentBorderRadius?: number;
  /** Override padding around the chart plot area. */
  padding?: { top: number; right: number; bottom: number; left: number };
  /** Formatter applied to categorical labels along the x-axis. */
  categoryLabelFormatter?: (category: MarimekkoCategory, index: number) => string;
}
