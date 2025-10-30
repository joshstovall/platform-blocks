import { useMemo } from 'react';
import { useChartInteractionContext } from '../interaction/ChartInteractionContext';

/**
 * Hook that aggregates tooltip data for multi-series charts
 * Finds the nearest point in each visible series to the current crosshair position
 * @returns Tooltip entries and anchor position information
 */
export const useTooltipAggregator = () => {
  const { crosshair, series, pointer, config } = useChartInteractionContext();
  const entries = useMemo(() => {
    if (!config.multiTooltip || !crosshair) return [];
    const targetX = crosshair.dataX;
    return series.filter(s => s.visible && s.points.length).map(s => {
      const pts = s.points;
      // Assume points sorted by x (typical). Binary search nearest.
      let lo = 0, hi = pts.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (pts[mid].x === targetX) { lo = hi = mid; break; }
        if (pts[mid].x < targetX) lo = mid; else hi = mid;
      }
      let best = pts[lo];
      if (hi !== lo) {
        const dLo = Math.abs(pts[lo].x - targetX);
        const dHi = Math.abs(pts[hi].x - targetX);
        if (dHi < dLo) best = pts[hi];
      }
      return { seriesId: s.id, label: s.name || String(s.id), color: s.color, point: best };
    });
  }, [crosshair, series, config.multiTooltip]);
  return { entries, anchorPixelX: crosshair?.pixelX, pointer };
};
