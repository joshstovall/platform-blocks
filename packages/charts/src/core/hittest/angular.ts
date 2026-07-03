// AngularSliceHitTester — radial slices (pie/donut wedges, radial-bar rings,
// gauge arcs). A hit is annular-sector membership around the frame center.
// Covers Pie / Donut / RadialBar / Gauge for HOVER/CROSSHAIR (press stays on the
// native SVG onPress to remain pixel-perfect with padAngle/rounded corners).

import { ActiveTarget, HitQuery, HitSeries, HitTester } from './types';
import { toActiveTarget } from './toTarget';
import { isPointInSlice, angleFromPoint } from '../../utils/geometry';

export class AngularSliceHitTester implements HitTester {
  readonly kind = 'slice' as const;

  constructor(private cx: number, private cy: number, private series: HitSeries[]) {}

  hit(q: HitQuery): ActiveTarget | null {
    const { angleDeg, radius } = angleFromPoint(this.cx, this.cy, q.px, q.py);
    for (const series of this.series) {
      if (!series.visible) continue;
      for (const mark of series.marks) {
        const s = mark.extent?.slice;
        if (!s) continue;
        if (
          isPointInSlice(
            this.cx,
            this.cy,
            q.px,
            q.py,
            s.innerRadius,
            s.outerRadius,
            s.startAngle,
            s.endAngle,
          )
        ) {
          return toActiveTarget(series, mark, 'slice', 0, {
            angleDeg,
            radius,
            ringIndex: mark.extent?.ringIndex,
          });
        }
      }
    }
    return null;
  }
}
