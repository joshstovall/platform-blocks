// CellGridHitTester — heatmap-style cell grids. A hit is rect membership of the
// pointer against a cell. Absorbs Heatmap's hoverCell floor math. The crosshair
// target carries { row, col } instead of overloading dataX with a column index.

import { ActiveTarget, HitQuery, HitSeries, HitTester } from './types';
import { toActiveTarget } from './toTarget';

export class CellGridHitTester implements HitTester {
  readonly kind = 'cell' as const;

  constructor(private series: HitSeries[]) {}

  hit(q: HitQuery): ActiveTarget | null {
    for (const series of this.series) {
      if (!series.visible) continue;
      for (const mark of series.marks) {
        const r = mark.extent?.rect;
        if (!r) continue;
        if (q.px >= r.x && q.px <= r.x + r.width && q.py >= r.y && q.py <= r.y + r.height) {
          return toActiveTarget(series, mark, 'cell', 0, { cell: mark.extent?.cell });
        }
      }
    }
    return null;
  }
}
