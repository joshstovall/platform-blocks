// RadarAxisHitTester — maps a pointer to the nearest radar spoke/axis by angle.
// Absorbs RadarChart's atan2 → axis-index logic. Marks carry extent.axisIndex
// and an angle (via dataX = axis angle in canonical degrees) OR are laid out
// evenly; we match by smallest angular difference.

import { ActiveTarget, HitQuery, HitSeries, HitTester, Mark } from './types';
import { toActiveTarget } from './toTarget';
import { angleFromPoint } from '../../utils/geometry';

function angularDelta(a: number, b: number): number {
  let d = Math.abs(((a - b) % 360) + 360) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

export class RadarAxisHitTester implements HitTester {
  readonly kind = 'axis' as const;

  constructor(private cx: number, private cy: number, private series: HitSeries[]) {}

  hit(q: HitQuery): ActiveTarget | null {
    const { angleDeg } = angleFromPoint(this.cx, this.cy, q.px, q.py);
    let best: ActiveTarget | null = null;
    let bestDelta = Infinity;
    for (const series of this.series) {
      if (!series.visible) continue;
      for (const mark of series.marks) {
        const markAngle = markAngleDeg(mark);
        if (markAngle == null) continue;
        const delta = angularDelta(angleDeg, markAngle);
        if (delta < bestDelta) {
          bestDelta = delta;
          best = toActiveTarget(series, mark, 'axis', delta, {
            axisIndex: mark.extent?.axisIndex,
            angleDeg,
          });
        }
      }
    }
    return best;
  }

  /** Every series' mark at the nearest spoke (an axis slice) for multi-series
   *  tooltips. Marks are keyed by extent.axisIndex (falling back to mark id). */
  slice(q: HitQuery): ActiveTarget[] {
    const { angleDeg } = angleFromPoint(this.cx, this.cy, q.px, q.py);
    const keyOf = (mark: Mark) => mark.extent?.axisIndex ?? mark.id;
    // Find the nearest spoke's key across all series.
    let bestKey: string | number | null = null;
    let bestDelta = Infinity;
    for (const series of this.series) {
      if (!series.visible) continue;
      for (const mark of series.marks) {
        const markAngle = markAngleDeg(mark);
        if (markAngle == null) continue;
        const delta = angularDelta(angleDeg, markAngle);
        if (delta < bestDelta) {
          bestDelta = delta;
          bestKey = keyOf(mark);
        }
      }
    }
    if (bestKey == null) return [];
    const out: ActiveTarget[] = [];
    for (const series of this.series) {
      if (!series.visible) continue;
      const mark = series.marks.find((m) => keyOf(m) === bestKey);
      if (mark) {
        const markAngle = markAngleDeg(mark);
        out.push(toActiveTarget(series, mark, 'axis', markAngle != null ? angularDelta(angleDeg, markAngle) : 0, {
          axisIndex: mark.extent?.axisIndex,
          angleDeg,
        }));
      }
    }
    return out;
  }
}

/** Radar marks encode their spoke angle (canonical degrees) in dataX. */
function markAngleDeg(mark: Mark): number | null {
  return typeof mark.dataX === 'number' ? mark.dataX : null;
}
