// PointSeriesHitTester — cartesian series-of-points nearest-neighbour in PIXEL
// space. Absorbs useNearestPoint + findClosestDataPoint + SpatialIndex. Covers
// Line / Area / Scatter / Sparkline / Bubble and MA overlays.

import { ActiveTarget, HitQuery, HitSeries, HitTester, Mark } from './types';
import { toActiveTarget } from './toTarget';
import { SpatialIndex } from '../../utils/SpatialIndex';

const DEFAULT_MAX_DISTANCE = 30;
/** Above this mark count a spatial index beats a linear scan. */
const INDEX_THRESHOLD = 1000;

interface IndexedSeries {
  series: HitSeries;
  index: SpatialIndex | null;
}

export class PointSeriesHitTester implements HitTester {
  readonly kind = 'point' as const;
  private indexed: IndexedSeries[];

  constructor(series: HitSeries[]) {
    this.indexed = series.map((s) => {
      let index: SpatialIndex | null = null;
      if (s.visible && s.marks.length >= INDEX_THRESHOLD) {
        try {
          // Index in pixel space; carry the mark so we can recover it on hit.
          index = new SpatialIndex(
            s.marks.map((m) => ({ x: m.pixel.x, y: m.pixel.y, __mark: m } as any)),
          );
        } catch {
          index = null;
        }
      }
      return { series: s, index };
    });
  }

  hit(q: HitQuery): ActiveTarget | null {
    const maxDistance = q.maxDistance ?? DEFAULT_MAX_DISTANCE;
    let best: ActiveTarget | null = null;

    for (const { series, index } of this.indexed) {
      if (!series.visible || !series.marks.length) continue;

      if (index) {
        const cand = index.findClosest(q.px, q.py, maxDistance);
        if (cand) {
          const mark = (cand.dataPoint as any).__mark as Mark;
          if (!best || cand.distance < best.distance) {
            best = toActiveTarget(series, mark, 'point', cand.distance);
          }
        }
        continue;
      }

      for (const mark of series.marks) {
        const d = Math.hypot(q.px - mark.pixel.x, q.py - mark.pixel.y);
        if (d <= maxDistance && (!best || d < best.distance)) {
          best = toActiveTarget(series, mark, 'point', d);
        }
      }
    }

    return best;
  }

  /** All series' nearest mark by x (vertical slice) for multi-series tooltips. */
  slice(q: HitQuery): ActiveTarget[] {
    const out: ActiveTarget[] = [];
    for (const { series } of this.indexed) {
      if (!series.visible || !series.marks.length) continue;
      let bestMark: Mark | null = null;
      let bestDx = Infinity;
      let bestDy = Infinity;
      for (const mark of series.marks) {
        const dx = Math.abs(mark.pixel.x - q.px);
        const dy = Math.abs(mark.pixel.y - q.py);
        if (dx < bestDx - 1e-6 || (Math.abs(dx - bestDx) <= 1e-6 && dy < bestDy)) {
          bestDx = dx;
          bestDy = dy;
          bestMark = mark;
        }
      }
      if (bestMark) {
        const d = Math.hypot(bestMark.pixel.x - q.px, bestMark.pixel.y - q.py);
        out.push(toActiveTarget(series, bestMark, 'point', d));
      }
    }
    return out;
  }
}
