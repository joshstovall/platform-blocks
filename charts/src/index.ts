// NOTE: This charts package lives outside ui/src rootDir; consuming tsconfigs must include this folder explicitly.
// Export order kept stable for tree-shaking predictability.

// Main chart components
export { BarChart } from './components/BarChart';
export { BubbleChart } from './components/BubbleChart';
export { PieChart } from './components/PieChart';
export { LineChart } from './components/LineChart';
export { ScatterChart } from './components/ScatterChart';
export { AreaChart } from './components/AreaChart';
export { StackedAreaChart } from './components/StackedAreaChart';
export { CandlestickChart } from './components/CandlestickChart';
export { RadarChart } from './components/RadarChart';
export { HeatmapChart } from './components/HeatmapChart';
export { FunnelChart } from './components/FunnelChart';
export { StackedBarChart } from './components/StackedBarChart';
export { GroupedBarChart } from './components/GroupedBarChart';
export { RadialBarChart } from './components/RadialBarChart';
export { GaugeChart } from './components/GaugeChart';
export { SparklineChart } from './components/SparklineChart';
export { HistogramChart } from './components/HistogramChart';
export { ComboChart } from './components/ComboChart';
export { RidgeChart } from './components/RidgeChart';
export { ViolinChart } from './components/ViolinChart';
export { SankeyChart } from './components/SankeyChart';
export { DonutChart } from './components/DonutChart';
export { NetworkChart } from './components/NetworkChart';

// Core chart building blocks and context
export { ChartRoot } from './core/ChartContext';
export { ChartContainer, ChartTitle, ChartLegend } from './ChartBase';
export { ChartsProvider, GlobalChartsRoot } from './ChartsProvider';
export { ChartPopover } from './interaction/ChartPopover';
export { ChartGrid } from './core/ChartGrid';
export { Axis } from './core/Axis';
export { ChartPlot, ChartLayer } from './core/ChartLayers';
export { ChartThemeProvider, useChartTheme } from './theme/ChartThemeContext';
export type { ChartTheme, HostThemeBridge } from './theme/ChartThemeContext';

// Utilities, scales, types
export * from './utils/scales';
export * from './types';
export * from './utils';
