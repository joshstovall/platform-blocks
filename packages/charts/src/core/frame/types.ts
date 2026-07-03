// ChartFrame — the single source of truth for a chart's plot area, scales, and
// pixel<->data transforms. It is a plain, memoizable data object (NOT a React
// context) so it can be called from render, from pointer handlers, and from the
// hit-test engine without hook rules.
//
// COORDINATE CONVENTION (whole library): all pixel values produced/consumed by a
// frame, its hit-testers, marks, and ActiveTarget.pixel are in CONTAINER-ORIGIN
// pixels — i.e. relative to the chart container's top-left, the same space as
// NormalizedPointerEvent.containerX/Y and the popover anchor. The plot rect
// carries its own offset (plot.x = padding.left, plot.y = padding.top), and the
// frame applies it internally, so charts never add/subtract padding by hand.

import { Scale } from '../../utils/scales';

/** Plot drawing region in container-origin pixels. */
export interface PlotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CartesianFrame {
  kind: 'cartesian';
  /** Plot region (container-origin). */
  plot: PlotRect;
  /** X scale. Range is [0, plotWidth] (plot-local); frame adds plot.x. */
  x: Scale<any>;
  /** Y scale. Range is [plotHeight, 0] (plot-local, y-flipped); frame adds plot.y. */
  y: Scale<any>;
  /** Map a data coordinate to container-origin pixels. */
  toPixel(dataX: number | string, dataY: number): { px: number; py: number };
  /** Inverse of toPixel where the scales are invertible (linear/log/time). */
  toData(px: number, py: number): { x: number; y: number };
}

export interface RadialFrame {
  kind: 'radial';
  /** Center in container-origin pixels. */
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  /** Sweep bounds in canonical degrees (0° = up, clockwise). */
  startAngle: number;
  endAngle: number;
  /** Optional value/index -> angle scale (gauge, radialbar, radar, pie). */
  angleScale?: Scale<any>;
  /** Optional value -> radius scale. */
  radiusScale?: Scale<number>;
  /** Polar -> container-origin pixels (canonical convention). */
  polar(radius: number, angleDeg: number): { px: number; py: number };
  /** Container-origin pixel -> polar (canonical convention). */
  fromPixel(px: number, py: number): { angleDeg: number; radius: number };
}

export type ChartFrame = CartesianFrame | RadialFrame;

export function isCartesianFrame(f: ChartFrame): f is CartesianFrame {
  return f.kind === 'cartesian';
}

export function isRadialFrame(f: ChartFrame): f is RadialFrame {
  return f.kind === 'radial';
}
