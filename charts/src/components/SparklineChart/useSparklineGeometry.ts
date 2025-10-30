import { useMemo } from 'react';

import { createSmoothPath } from '../../utils';
import type { SparklinePoint, SparklineDomain } from './types';

export interface SparklineChartPoint extends SparklinePoint {
  chartX: number;
  chartY: number;
  index: number;
}

export interface UseSparklineGeometryOptions {
  data: SparklinePoint[];
  width: number;
  height: number;
  smooth: boolean;
  padding: { top: number; right: number; bottom: number; left: number };
  domain?: SparklineDomain;
  enableFill: boolean;
}

export interface SparklineGeometryResult {
  points: SparklineChartPoint[];
  strokePath: string;
  fillPath: string | null;
  pathLength: number;
  xDomain: [number, number];
  yDomain: [number, number];
  zeroNormalized: number | null;
}

const clampDomain = (value: [number, number]): [number, number] => {
  if (value[0] === value[1]) {
    const nextMax = value[1] === 0 ? 1 : value[1] + Math.abs(value[1]) * 0.1 || 1;
    return [value[0] - 1, nextMax];
  }
  return value;
};

export const useSparklineGeometry = (options: UseSparklineGeometryOptions): SparklineGeometryResult => {
  const { data, width, height, smooth, padding, domain, enableFill } = options;

  return useMemo(() => {
    if (!width || !height) {
      return {
        points: [],
        strokePath: '',
        fillPath: null,
        pathLength: 0,
        xDomain: [0, 1],
        yDomain: [0, 1],
        zeroNormalized: null,
      };
    }

    if (!data.length) {
      return {
        points: [],
        strokePath: '',
        fillPath: null,
        pathLength: 0,
        xDomain: [0, 1],
        yDomain: [0, 1],
        zeroNormalized: null,
      };
    }

    const valuesX = data.map((point) => point.x);
    const valuesY = data.map((point) => point.y);

    const computedXDomain: [number, number] = domain?.x ?? [Math.min(...valuesX), Math.max(...valuesX)];
    const computedYDomain: [number, number] = domain?.y ?? [Math.min(...valuesY), Math.max(...valuesY)];

    const xDomainSafe = clampDomain(computedXDomain);
    const yDomainSafe = clampDomain(computedYDomain);

    const plotWidth = Math.max(0, width - padding.left - padding.right);
    const plotHeight = Math.max(0, height - padding.top - padding.bottom);

    const scaleX = (value: number) => {
      if (xDomainSafe[1] === xDomainSafe[0]) {
        return padding.left + plotWidth / 2;
      }
      const ratio = (value - xDomainSafe[0]) / (xDomainSafe[1] - xDomainSafe[0]);
      return padding.left + ratio * plotWidth;
    };

    const scaleY = (value: number) => {
      if (yDomainSafe[1] === yDomainSafe[0]) {
        return padding.top + plotHeight / 2;
      }
      const ratio = (value - yDomainSafe[0]) / (yDomainSafe[1] - yDomainSafe[0]);
      return padding.top + (1 - ratio) * plotHeight;
    };

    const chartPoints: SparklineChartPoint[] = data.map((point, index) => ({
      ...point,
      chartX: scaleX(point.x),
      chartY: scaleY(point.y),
      index,
    }));

    let strokePath = '';
    if (chartPoints.length === 1) {
      const only = chartPoints[0];
      strokePath = `M ${only.chartX} ${only.chartY}`;
    } else if (smooth) {
      strokePath = createSmoothPath(chartPoints.map(({ chartX, chartY }) => ({ x: chartX, y: chartY })));
    } else {
      strokePath = chartPoints
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.chartX} ${point.chartY}`)
        .join(' ');
    }

    let fillPath: string | null = null;
    if (enableFill && chartPoints.length > 1) {
      const firstPoint = chartPoints[0];
      const lastPoint = chartPoints[chartPoints.length - 1];
      const baselineY = padding.top + plotHeight;
      const linePath = chartPoints
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.chartX} ${point.chartY}`)
        .join(' ');
      fillPath = `${linePath} L ${lastPoint.chartX} ${baselineY} L ${firstPoint.chartX} ${baselineY} Z`;
    }

    const pathLength = chartPoints.reduce((total, point, index) => {
      if (index === 0) {
        return total;
      }
      const prev = chartPoints[index - 1];
      const distance = Math.sqrt(
        Math.pow(point.chartX - prev.chartX, 2) + Math.pow(point.chartY - prev.chartY, 2)
      );
      return total + distance;
    }, 0);

    let zeroNormalized: number | null = null;
    if (yDomainSafe[0] <= 0 && yDomainSafe[1] >= 0 && yDomainSafe[1] !== yDomainSafe[0]) {
      zeroNormalized = 1 - (0 - yDomainSafe[0]) / (yDomainSafe[1] - yDomainSafe[0]);
      zeroNormalized = Math.min(1, Math.max(0, zeroNormalized));
    }

    return {
      points: chartPoints,
      strokePath,
      fillPath,
      pathLength,
      xDomain: xDomainSafe,
      yDomain: yDomainSafe,
      zeroNormalized,
    };
  }, [data, domain?.x, domain?.y, enableFill, height, padding.bottom, padding.left, padding.right, padding.top, smooth, width]);
};
