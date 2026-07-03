// Unified hit-testing. One pluggable HitTester interface + one normalized
// ActiveTarget that feeds tooltip + crosshair for EVERY chart geometry
// (cartesian points, category bands, cell grids, radial slices, radar axes,
// flow segments). Replaces the 4 overlapping nearest-point routines and the
// per-chart inline hit-test logic.

import type { ReactNode } from 'react';

/** All pixel values are container-origin (see core/frame/types.ts). */
export interface HitQuery {
  px: number;
  py: number;
  /** Max pixel distance for a hit (tester-dependent default). */
  maxDistance?: number;
}

export type TargetKind = 'point' | 'band' | 'cell' | 'slice' | 'axis' | 'segment';

/**
 * The normalized "active target" produced by every hit-tester. Its canonical
 * `pixel` anchor (container-origin) is what the tooltip/popover reads — this is
 * what deletes the multi-alias probing the old aggregator had to do.
 */
export interface ActiveTarget {
  seriesId: string | number;
  /** Stable id of the hit mark (point id / category index / cell id / slice id / axis index). */
  markId: string | number;
  kind: TargetKind;
  /** The original datum for this mark. */
  datum: any;
  /** Canonical anchor for tooltip/crosshair, container-origin pixels. */
  pixel: { x: number; y: number };
  /** Primary numeric value shown in tooltips. */
  value: number;
  /** Pixel distance used for tie-breaking across series/testers. */
  distance: number;
  /** Display label + color, when the tester/registration knows them. */
  label?: string;
  color?: string;
  /** Pre-formatted display value for the tooltip (chart-computed at mark time).
   *  Charts precompute this instead of the tooltip re-deriving per chart type. */
  formattedValue?: string;
  /** Chart-supplied custom tooltip body for this mark. Overrides formattedValue. */
  customTooltip?: ReactNode;

  // --- per-geometry coordinates (all optional; populated by the matching tester) ---
  dataX?: number;
  dataY?: number;
  categoryIndex?: number;
  cell?: { row: number; col: number };
  angleDeg?: number;
  radius?: number;
  ringIndex?: number;
  axisIndex?: number;
}

export interface HitTester {
  kind: TargetKind;
  /** Nearest single target to the query, or null if none within range. */
  hit(q: HitQuery): ActiveTarget | null;
  /**
   * Optional: every series' target at the query's x / angle (a vertical or
   * radial "slice"), for multi-series tooltips. Replaces the aggregator's
   * per-series binary search.
   */
  slice?(q: HitQuery): ActiveTarget[];
}

/** A single hit-testable mark, produced by a chart with its pixel pre-computed. */
export interface Mark {
  id: string | number;
  /** Container-origin anchor pixel. */
  pixel: { x: number; y: number };
  value: number;
  datum: any;
  dataX?: number;
  dataY?: number;
  /** Per-mark label/color overrides (else the owning series' name/color). */
  label?: string;
  color?: string;
  /** Pre-formatted display value for the tooltip (chart-computed). */
  formattedValue?: string;
  /** Custom tooltip body for this mark. Overrides formattedValue. */
  customTooltip?: ReactNode;
  /** Geometry-specific extents, interpreted by the matching tester. */
  extent?: MarkExtent;
}

/** Optional per-mark geometry needed by band/cell/slice/segment testers. */
export interface MarkExtent {
  /** Axis-aligned rect (band/cell) in container-origin pixels. */
  rect?: { x: number; y: number; width: number; height: number };
  /** Grid position (cell). */
  cell?: { row: number; col: number };
  /** Angular sector (slice) in canonical degrees + radii. */
  slice?: { startAngle: number; endAngle: number; innerRadius: number; outerRadius: number };
  /** Radar axis index. */
  axisIndex?: number;
  /** Ring index (radial bar). */
  ringIndex?: number;
  /** Polyline/polygon points (segment) in container-origin pixels. */
  polygon?: Array<{ x: number; y: number }>;
}

/** A registered, hit-testable series. */
export interface HitSeries {
  id: string | number;
  name?: string;
  color?: string;
  visible: boolean;
  marks: Mark[];
}
