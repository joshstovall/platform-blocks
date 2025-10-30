import React, { createContext, useContext, useMemo } from 'react';
import { linearScale, bandScale, Scale } from '../utils/scales';
import { ChartDataPoint, BarChartDataPoint } from '../types';

/**
 * Scale configuration for x, y, and color mapping
 */
export interface ChartScales {
  /** Scale function for the x-axis */
  x: Scale<any> | null;
  /** Scale function for the y-axis */
  y: Scale<any> | null;
  /** Optional color mapping function */
  color?: (index: number, id?: string | number) => string;
}

/**
 * Props for the ChartRoot component
 */
export interface ChartRootProps {
  /** Chart width in pixels */
  width: number;
  /** Chart height in pixels */
  height: number;
  /** Padding around the plot area */
  padding?: { top: number; right: number; bottom: number; left: number };
  /** X-axis domain (numeric range or categorical values) */
  xDomain?: [number, number] | string[];
  /** Y-axis domain (numeric range) */
  yDomain?: [number, number];
  /** Chart data points */
  data?: ChartDataPoint[] | BarChartDataPoint[];
  /** If true, treat xDomain as categories */
  categorical?: boolean;
  /** Children components to render */
  children: React.ReactNode;
  /** Optional custom color assignment function */
  colorAssigner?: (index: number, id?: string | number) => string;
}

/**
 * Internal chart context value
 */
interface InternalChartContext {
  /** Total chart width */
  width: number;
  /** Total chart height */
  height: number;
  /** Padding applied to all sides */
  padding: { top: number; right: number; bottom: number; left: number };
  /** Width of the plot area (excluding padding) */
  plotWidth: number;
  /** Height of the plot area (excluding padding) */
  plotHeight: number;
  /** Scale functions for coordinate mapping */
  scales: ChartScales;
}

const Ctx = createContext<InternalChartContext | null>(null);

/**
 * Hook to access the chart root context
 * @throws Error if used outside of ChartRoot
 */
export function useChartRoot() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useChartRoot must be used within <ChartRoot>');
  return ctx;
}

/**
 * Root chart component that provides context for scales and layout
 */
export const ChartRoot: React.FC<ChartRootProps> = ({
  width,
  height,
  padding = { top: 40, right: 20, bottom: 60, left: 80 },
  xDomain,
  yDomain,
  data,
  categorical,
  children,
  colorAssigner,
}) => {
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scales = useMemo<ChartScales>(() => {
    let x: Scale<any> | null = null;
    let y: Scale<any> | null = null;

    if (categorical && Array.isArray(xDomain)) {
      x = bandScale(xDomain as string[], [0, plotWidth], { paddingInner: 0.2, paddingOuter: 0.05 });
    } else if (xDomain && Array.isArray(xDomain) && typeof xDomain[0] === 'number') {
      x = linearScale(xDomain as [number, number], [0, plotWidth]);
    }
    if (yDomain) {
      y = linearScale(yDomain, [plotHeight, 0]);
    }
    return { x, y, color: colorAssigner };
  }, [plotWidth, plotHeight, xDomain, yDomain, categorical, colorAssigner]);

  const value: InternalChartContext = {
    width,
    height,
    padding,
    plotWidth,
    plotHeight,
    scales,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
};

ChartRoot.displayName = 'ChartRoot';
