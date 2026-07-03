// Registration model. A chart registers a frame + a geometry descriptor + its
// series (marks with pixels pre-computed). The interaction store derives the
// correct HitTester from geometry.kind — charts no longer implement hit-testing
// or maintain bespoke per-chart registration hooks.

import { ChartFrame } from '../frame/types';
import { HitSeries, HitTester } from './types';
import { PointSeriesHitTester } from './point';
import { BandCategoryHitTester } from './band';
import { CellGridHitTester } from './grid';
import { AngularSliceHitTester } from './angular';
import { RadarAxisHitTester } from './radarAxis';

export type GeometrySpec =
  | { kind: 'point' }
  | { kind: 'band'; orientation?: 'x' | 'y' }
  | { kind: 'cell' }
  | { kind: 'slice'; cx: number; cy: number }
  | { kind: 'axis'; cx: number; cy: number };

export interface ChartRegistration {
  /** Frame owning plot rect + scales (used for crosshair math + tooltip anchor). */
  frame: ChartFrame;
  /** Which hit-tester to build. */
  geometry: GeometrySpec;
  /** Registered series with hit-testable marks. */
  series: HitSeries[];
}

/** Derive the concrete HitTester for a registration. */
export function createHitTester(reg: ChartRegistration): HitTester {
  const { geometry, series } = reg;
  switch (geometry.kind) {
    case 'point':
      return new PointSeriesHitTester(series);
    case 'band':
      return new BandCategoryHitTester(series, { orientation: geometry.orientation });
    case 'cell':
      return new CellGridHitTester(series);
    case 'slice':
      return new AngularSliceHitTester(geometry.cx, geometry.cy, series);
    case 'axis':
      return new RadarAxisHitTester(geometry.cx, geometry.cy, series);
  }
}
