import { useMemo } from 'react';
import { ChartDataPoint, LineChartSeries } from '../types';
import { getDataDomain, getMultiSeriesDomain, normalizeLineChartData } from '../utils';

/**
 * Custom hook for optimizing chart data calculations
 * Reduces re-calculations by memoizing expensive operations
 */
export function useChartData(
  data?: ChartDataPoint[],
  series?: LineChartSeries[]
) {
  // Memoize normalized series data
  const normalizedSeries = useMemo(() => 
    normalizeLineChartData(data, series), 
    [data, series]
  );

  // Memoize domain calculations
  const domains = useMemo(() => {
    if (normalizedSeries.length === 0) {
      return { xDomain: [0, 1] as [number, number], yDomain: [0, 1] as [number, number] };
    }

    return {
      xDomain: getMultiSeriesDomain(normalizedSeries, d => d.x),
      yDomain: getMultiSeriesDomain(normalizedSeries, d => d.y),
    };
  }, [normalizedSeries]);

  // Memoize flattened data for performance
  const flattenedData = useMemo(() => 
    normalizedSeries.flatMap(s => s.data), 
    [normalizedSeries]
  );

  return {
    normalizedSeries,
    ...domains,
    flattenedData,
    isEmpty: normalizedSeries.length === 0,
  };
}

/**
 * Hook for memoizing coordinate transformations
 */
export function useChartCoordinates(
  data: ChartDataPoint[],
  plotArea: { x: number; y: number; width: number; height: number },
  xDomain: [number, number],
  yDomain: [number, number]
) {
  return useMemo(() => {
    const transformedData = new Map<string | number, { chartX: number; chartY: number }>();
    
    data.forEach(point => {
      const relativeX = (point.x - xDomain[0]) / (xDomain[1] - xDomain[0]);
      const relativeY = (point.y - yDomain[0]) / (yDomain[1] - yDomain[0]);
      
      const chartX = plotArea.x + relativeX * plotArea.width;
      const chartY = plotArea.y + (1 - relativeY) * plotArea.height;
      
      transformedData.set(point.id || `${point.x}-${point.y}`, { chartX, chartY });
    });
    
    return transformedData;
  }, [data, plotArea, xDomain, yDomain]);
}
