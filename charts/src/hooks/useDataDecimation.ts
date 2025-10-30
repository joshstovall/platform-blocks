import { useMemo } from 'react';
import { ChartDataPoint } from '../types';

/**
 * Largest-Triangle-One-Bucket (LTOB) decimation for large time/ordinal series.
 * Preserves visual trend with O(n) pass.
 * @param data - Array of data points to decimate
 * @param threshold - Maximum number of points to return (default 1000)
 * @returns Decimated array of data points
 */
export function useDataDecimation(data: ChartDataPoint[], threshold: number = 1000) {
  return useMemo(() => {
    if (!data || data.length <= threshold) return data;
    // LTOB implementation
    const sampled: ChartDataPoint[] = [];
    const bucketSize = (data.length - 2) / (threshold - 2);
    let a = 0; // first point index
    sampled.push(data[a]);
    for (let i = 0; i < threshold - 2; i++) {
      const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
      const rangeEnd = Math.floor((i + 2) * bucketSize) + 1;
      const range = data.slice(rangeStart, Math.min(rangeEnd, data.length - 1));
      const pointA = data[a];
      let maxArea = -1;
      let nextA = a;
      for (let j = 0; j < range.length; j++) {
        const point = range[j];
        const area = Math.abs((pointA.x - point.x) * (pointA.y - point.y));
        if (area > maxArea) {
          maxArea = area;
          nextA = rangeStart + j;
        }
      }
      sampled.push(data[nextA]);
      a = nextA;
    }
    sampled.push(data[data.length - 1]);
    return sampled;
  }, [data, threshold]);
}
