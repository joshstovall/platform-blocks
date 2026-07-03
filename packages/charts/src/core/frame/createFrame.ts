// Frame factories. These supersede the inline plot-rect + scale construction
// copy-pasted across every chart component.

import { CartesianFrame, RadialFrame, PlotRect } from './types';
import { Scale, linearScale, logScale, timeScale, bandScale, BandScaleOptions } from '../../utils/scales';
import { polarToCartesian, angleFromPoint } from '../../utils/geometry';

export type CartesianScaleSpec =
  | { type: 'linear'; domain: [number, number] }
  | { type: 'log'; domain: [number, number] }
  | { type: 'time'; domain: [number, number] }
  | { type: 'band'; domain: string[]; opts?: BandScaleOptions };

export interface CreateCartesianFrameOptions {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  x: CartesianScaleSpec;
  y: CartesianScaleSpec;
}

function buildScale(spec: CartesianScaleSpec, range: [number, number]): Scale<any> {
  switch (spec.type) {
    case 'linear': return linearScale(spec.domain, range);
    case 'log': return logScale(spec.domain, range);
    case 'time': return timeScale(spec.domain, range);
    case 'band': return bandScale(spec.domain, range, spec.opts);
  }
}

/**
 * Build a cartesian frame. Scale ranges are plot-local ([0, plotWidth] for x,
 * [plotHeight, 0] for y); toPixel/toData add the plot offset so callers work in
 * container-origin pixels.
 */
export function createCartesianFrame(opts: CreateCartesianFrameOptions): CartesianFrame {
  const { width, height, padding } = opts;
  const plot: PlotRect = {
    x: padding.left,
    y: padding.top,
    width: Math.max(0, width - padding.left - padding.right),
    height: Math.max(0, height - padding.top - padding.bottom),
  };
  const x = buildScale(opts.x, [0, plot.width]);
  const y = buildScale(opts.y, [plot.height, 0]);

  const toPixel = (dataX: number | string, dataY: number) => ({
    px: plot.x + (x(dataX as any) as number),
    py: plot.y + (y(dataY as any) as number),
  });

  const toData = (px: number, py: number) => ({
    x: x.invert ? x.invert(px - plot.x) : NaN,
    y: y.invert ? y.invert(py - plot.y) : NaN,
  });

  return { kind: 'cartesian', plot, x, y, toPixel, toData };
}

export interface CreateRadialFrameOptions {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle?: number;
  endAngle?: number;
  angleScale?: Scale<any>;
  radiusScale?: Scale<number>;
}

/**
 * Build a radial frame using the canonical polar convention (0° = up,
 * clockwise). All coordinates are container-origin pixels.
 */
export function createRadialFrame(opts: CreateRadialFrameOptions): RadialFrame {
  const { cx, cy, innerRadius, outerRadius } = opts;
  const startAngle = opts.startAngle ?? 0;
  const endAngle = opts.endAngle ?? 360;
  return {
    kind: 'radial',
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    angleScale: opts.angleScale,
    radiusScale: opts.radiusScale,
    polar: (radius: number, angleDeg: number) => {
      const { x, y } = polarToCartesian(cx, cy, radius, angleDeg);
      return { px: x, py: y };
    },
    fromPixel: (px: number, py: number) => angleFromPoint(cx, cy, px, py),
  };
}
