import React from 'react';
import { View } from 'react-native';
import { useChartRoot } from './ChartContext';

export interface ChartLayerRenderProps {
  plotWidth: number;
  plotHeight: number;
  padding: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  scales: ReturnType<typeof useChartRoot>['scales'];
}

export interface ChartLayerProps {
  zIndex?: number;
  pointerEvents?: 'none' | 'auto';
  children: React.ReactNode | ((props: ChartLayerRenderProps) => React.ReactNode);
  style?: any;
}

// Root plot area (already positioned by padding); you typically nest layers inside.
export const ChartPlot: React.FC<{ style?: any; children: React.ReactNode }>= ({ style, children }) => {
  const { padding, plotWidth, plotHeight } = useChartRoot();
  return (
    <View style={[{ position: 'absolute', left: padding.left, top: padding.top, width: plotWidth, height: plotHeight }, style]}>
      {children}
    </View>
  );
};

export const ChartLayer: React.FC<ChartLayerProps> = ({ zIndex, pointerEvents='none', children, style }) => {
  const ctx = useChartRoot();
  const renderProps: ChartLayerRenderProps = {
    plotWidth: ctx.plotWidth,
    plotHeight: ctx.plotHeight,
    padding: ctx.padding,
    width: ctx.width,
    height: ctx.height,
    scales: ctx.scales,
  };
  return (
    <View style={[{ position: 'absolute', left: 0, top: 0, width: ctx.plotWidth, height: ctx.plotHeight, zIndex }, style]} pointerEvents={pointerEvents}>
      {typeof children === 'function' ? children(renderProps) : children}
    </View>
  );
};

ChartPlot.displayName = 'ChartPlot';
ChartLayer.displayName = 'ChartLayer';
