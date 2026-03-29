import { useEffect, useRef, useState, useCallback } from 'react';
import { ChartDataPoint } from '../types';

/**
 * Options for streaming data behavior
 */
interface StreamingOptions {
  /** Maximum number of data points to keep */
  maxDataPoints?: number;
  /** Minimum milliseconds between updates */
  updateInterval?: number;
  /** Enable smooth transitions between updates */
  smoothTransitions?: boolean;
  /** Callback when data points are removed due to overflow */
  onDataOverflow?: (removedData: ChartDataPoint[]) => void;
}

/**
 * Hook for handling streaming/real-time chart data
 * Optimizes performance for high-frequency updates
 * @param initialData - Initial data points
 * @param options - Streaming configuration options
 * @returns Object with data and control functions
 */
export function useStreamingData(
  initialData: ChartDataPoint[] = [],
  options: StreamingOptions = {}
) {
  const {
    maxDataPoints = 100,
    updateInterval = 100,
    smoothTransitions = true,
    onDataOverflow,
  } = options;

  const [data, setData] = useState<ChartDataPoint[]>(initialData);
  const [isStreaming, setIsStreaming] = useState(false);
  const updateQueue = useRef<ChartDataPoint[]>([]);
  const lastUpdateTime = useRef(Date.now());

  // Batch updates for performance
  const flushUpdates = useCallback(() => {
    if (updateQueue.current.length === 0) return;

    const newPoints = [...updateQueue.current];
    updateQueue.current = [];

    setData(prevData => {
      const combined = [...prevData, ...newPoints];
      
      // Remove excess data points if needed
      if (combined.length > maxDataPoints) {
        const removed = combined.slice(0, combined.length - maxDataPoints);
        onDataOverflow?.(removed);
        return combined.slice(-maxDataPoints);
      }
      
      return combined;
    });
  }, [maxDataPoints, onDataOverflow]);

  // Add new data point(s)
  const addDataPoint = useCallback((point: ChartDataPoint | ChartDataPoint[]) => {
    const points = Array.isArray(point) ? point : [point];
    updateQueue.current.push(...points);

    const now = Date.now();
    if (now - lastUpdateTime.current >= updateInterval) {
      flushUpdates();
      lastUpdateTime.current = now;
    }
  }, [updateInterval, flushUpdates]);

  // Start/stop streaming
  const startStreaming = useCallback(() => {
    setIsStreaming(true);
  }, []);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    flushUpdates(); // Flush any remaining updates
  }, [flushUpdates]);

  // Clear all data
  const clearData = useCallback(() => {
    setData([]);
    updateQueue.current = [];
  }, []);

  // Auto-flush updates on interval
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(flushUpdates, updateInterval);
    return () => clearInterval(interval);
  }, [isStreaming, updateInterval, flushUpdates]);

  return {
    data,
    addDataPoint,
    startStreaming,
    stopStreaming,
    clearData,
    isStreaming,
    queueSize: updateQueue.current.length,
  };
}

/**
 * Hook for animating data changes smoothly
 * @param data - Current data points
 * @param transitionDuration - Duration of transition in milliseconds (default 500)
 * @returns Animated data points
 */
export function useDataTransitions(
  data: ChartDataPoint[],
  transitionDuration: number = 500
) {
  const [animatedData, setAnimatedData] = useState(data);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // Simple transition - in production, consider using react-spring or similar
    animationRef.current = setTimeout(() => {
      setAnimatedData(data);
    }, 16); // Single frame delay for smoother transitions

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [data]);

  return animatedData;
}

/**
 * Hook for data aggregation and downsampling
 * Useful for large datasets to maintain performance
 * @param data - Full dataset to aggregate
 * @param maxPoints - Maximum number of points to return (default 1000)
 * @returns Downsampled data points
 */
export function useDataAggregation(
  data: ChartDataPoint[],
  maxPoints: number = 1000
) {
  const [aggregatedData, setAggregatedData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (data.length <= maxPoints) {
      setAggregatedData(data);
      return;
    }

    // Simple downsampling - take every nth point
    const step = Math.ceil(data.length / maxPoints);
    const sampled: ChartDataPoint[] = [];

    for (let i = 0; i < data.length; i += step) {
      sampled.push(data[i]);
    }

    // Always include the last point
    if (sampled[sampled.length - 1] !== data[data.length - 1]) {
      sampled.push(data[data.length - 1]);
    }

    setAggregatedData(sampled);
  }, [data, maxPoints]);

  return {
    aggregatedData,
    compressionRatio: data.length > 0 ? aggregatedData.length / data.length : 1,
    isCompressed: data.length > maxPoints,
  };
}
