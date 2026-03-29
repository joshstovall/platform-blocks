import { useCallback, useMemo } from 'react';
import { findClosestDataPoint } from '../utils';
import { SpatialIndex } from '../utils/SpatialIndex';

/**
 * Minimal series interface for nearest point calculations
 */
export interface SeriesLike {
  /** Optional unique identifier for the series */
  id?: string | number;
  /** Data points with x, y coordinates */
  data: { x: number; y: number; id?: any; [k: string]: any }[];
  /** Optional pre-computed chart coordinates */
  chartPoints?: any[];
  /** Whether the series is currently visible */
  visible?: boolean;
}

/**
 * Shared nearest-point finder for cartesian charts.
 * Given pixel chart coordinates (relative to plot origin) returns closest data point across visible series.
 * @param series - Array of series to search
 * @param xDomain - X-axis domain range
 * @param yDomain - Y-axis domain range
 * @param plotWidth - Plot area width in pixels
 * @param plotHeight - Plot area height in pixels
 * @returns Function that finds the nearest point to given coordinates
 */
export const useNearestPoint = (
  series: SeriesLike[],
  xDomain: [number, number],
  yDomain: [number, number],
  plotWidth: number,
  plotHeight: number,
) => {
  // Build spatial indices for large series
  const indices = useMemo(() => {
    return series.map(s => {
      if (s.visible === false || !s.data?.length) return null;
      if (s.data.length < 1000) return null; // threshold
      try {
        return new SpatialIndex(s.data as any, 50);
      } catch { return null; }
    });
  }, [series]);

  return useCallback((chartX: number, chartY: number, maxDistancePx: number = 30) => {
    let closest: { dataPoint: any; distance: number } | null = null;
    series.forEach((s, i) => {
      if (s.visible === false || !s.data?.length) return;
      const idx = indices[i];
      if (idx) {
        // Convert pixel to data coords for index search approximation
        const dataX = xDomain[0] + (chartX/plotWidth)*(xDomain[1]-xDomain[0]);
        const dataY = yDomain[1] - (chartY/plotHeight)*(yDomain[1]-yDomain[0]);
        const cand = idx.findClosest(dataX, dataY, (maxDistancePx/plotWidth)*(xDomain[1]-xDomain[0]));
        if (cand) {
          // Convert candidate point back to pixel distance
          const pxX = ((cand.dataPoint.x - xDomain[0])/(xDomain[1]-xDomain[0]))*plotWidth;
          const pxY = (1-((cand.dataPoint.y - yDomain[0])/(yDomain[1]-yDomain[0])))*plotHeight;
          const dist = Math.hypot(chartX - pxX, chartY - pxY);
          if (dist <= maxDistancePx) {
            if (!closest || dist < closest.distance) closest = { dataPoint: cand.dataPoint, distance: dist };
          }
          return;
        }
      }
      const cand = findClosestDataPoint(
        chartX,
        chartY,
        s.data,
        { x: 0, y: 0, width: plotWidth, height: plotHeight },
        xDomain,
        yDomain,
        maxDistancePx
      );
      if (cand && (!closest || cand.distance < closest.distance)) closest = cand;
    });
    return closest;
  }, [series, indices, xDomain, yDomain, plotWidth, plotHeight]);
};

/**
 * Type representing the return value of useNearestPoint
 */
export type NearestPointFinder = ReturnType<typeof useNearestPoint>;