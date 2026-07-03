// BandCategoryHitTester — categorical bars/columns. A hit is either rect
// membership (pointer inside a bar) or, failing that, the nearest category by x
// (so the crosshair snaps to a column even in the gaps). Absorbs Bar's inline
// rect loop + Math.round(invert) crosshair logic. Covers Bar / GroupedBar /
// StackedBar / Histogram / Marimekko / Violin / Ridge (category axis).

import { ActiveTarget, HitQuery, HitSeries, HitTester, Mark } from './types';
import { toActiveTarget } from './toTarget';

export interface BandHitOptions {
  /** 'x' (vertical bars, default) or 'y' (horizontal bars). */
  orientation?: 'x' | 'y';
}

export class BandCategoryHitTester implements HitTester {
  readonly kind = 'band' as const;
  private orientation: 'x' | 'y';

  constructor(private series: HitSeries[], opts: BandHitOptions = {}) {
    this.orientation = opts.orientation ?? 'x';
  }

  private markToTarget(series: HitSeries, mark: Mark, distance: number): ActiveTarget {
    return toActiveTarget(series, mark, 'band', distance, {
      categoryIndex: mark.extent?.cell?.col ?? (typeof mark.id === 'number' ? mark.id : undefined),
    });
  }

  hit(q: HitQuery): ActiveTarget | null {
    // 1) exact rect membership wins (pointer over an actual bar).
    let best: ActiveTarget | null = null;
    for (const series of this.series) {
      if (!series.visible) continue;
      for (const mark of series.marks) {
        const r = mark.extent?.rect;
        if (r && q.px >= r.x && q.px <= r.x + r.width && q.py >= r.y && q.py <= r.y + r.height) {
          // Distance 0 = inside; prefer the bar whose anchor is closest to pointer.
          const d = Math.hypot(q.px - mark.pixel.x, q.py - mark.pixel.y);
          if (!best || d < best.distance) best = this.markToTarget(series, mark, 0);
        }
      }
    }
    if (best) return best;

    // 2) otherwise snap to the nearest category along the band axis.
    const axisCoord = this.orientation === 'x' ? q.px : q.py;
    let bestDist = Infinity;
    for (const series of this.series) {
      if (!series.visible) continue;
      for (const mark of series.marks) {
        const anchor = this.orientation === 'x' ? mark.pixel.x : mark.pixel.y;
        const d = Math.abs(anchor - axisCoord);
        if (d < bestDist) {
          bestDist = d;
          best = this.markToTarget(series, mark, d);
        }
      }
    }
    return best;
  }

  /** All series at the nearest category (a column slice) for multi-tooltips. */
  slice(q: HitQuery): ActiveTarget[] {
    const axisCoord = this.orientation === 'x' ? q.px : q.py;
    // Find the nearest category index across all series first.
    let nearestKey: string | number | null = null;
    let bestDist = Infinity;
    for (const series of this.series) {
      if (!series.visible) continue;
      for (const mark of series.marks) {
        const anchor = this.orientation === 'x' ? mark.pixel.x : mark.pixel.y;
        const d = Math.abs(anchor - axisCoord);
        const key = mark.extent?.cell?.col ?? mark.id;
        if (d < bestDist) {
          bestDist = d;
          nearestKey = key;
        }
      }
    }
    if (nearestKey == null) return [];
    const out: ActiveTarget[] = [];
    for (const series of this.series) {
      if (!series.visible) continue;
      const mark = series.marks.find((m) => (m.extent?.cell?.col ?? m.id) === nearestKey);
      if (mark) {
        const anchor = this.orientation === 'x' ? mark.pixel.x : mark.pixel.y;
        out.push(this.markToTarget(series, mark, Math.abs(anchor - axisCoord)));
      }
    }
    return out;
  }
}
