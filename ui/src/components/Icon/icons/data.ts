import type { IconRegistry } from '../types';

// Data and table icons
export const dataIcons: IconRegistry = {
  filter: {
    content: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Classic funnel icon for filtering datasets.',
  },
  sort: {
    content: 'M3 6h18M7 12h10m-7 6h4',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Stacked lines showing sortable rows or columns.',
  },
  grid: {
    content: 'M3 3h7v7H3V3ZM14 3h7v7h-7V3ZM14 14h7v7h-7v-7ZM3 14h7v7H3v-7Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Four-square grid indicating tiled or tabular layouts.',
  },
  list: {
    content: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Bulleted list for linear collections or menus.',
  },
  table: {
    content: 'M3 3h18v18H3V3Zm6 0v18M3 9h18M3 15h18',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Table grid marking rows and columns.',
  },
  knobs: {
    content: 'M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Vertical slider knobs for tweakable controls or settings.',
  },
  'bar-chart': {
    content: 'M18 20V10M12 20V4m-6 16v-8',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Ascending bar chart for comparisons or analytics.',
  },
  'line-chart': {
    content: 'M3 3v18h18M7 12l4-4 4 4 4-4',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Line chart with rising trend for data visualization.',
  },
  linechart: {
    content: 'M3 3v18h18M7 12l4-4 4 4 4-4',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Alias of the line chart icon for backward compatibility.',
  },
  'chart-bar': {
    content: 'M3 21V3m0 18h18M7 17v-6m4 6V7m4 10v-4m4 4v-8',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Bar chart with axes for dashboards or reporting.',
  },
  'chart-line': {
    content: 'M3 21V3m0 18h18M6 14l4-6 5 5 4-7',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Line chart variant emphasizing plotted points.',
  },
  'chart-area': {
    content: 'M3 21V3m0 18h18L15 12l-4 3-3-5-5 8z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Filled area chart for showing magnitude over time.',
  },
  'chart-pie': {
    content: 'M12 3v9l7.8 4.5A9 9 0 1 1 12 3zm0 0a9 9 0 0 1 9 9h-9V3z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Pie chart wedge to depict proportional breakdowns.',
  },
  'chart-donut': {
    content: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Donut chart ring for distribution metrics.',
  },
  speedometer: {
    content: 'M4 15a8 8 0 0 1 16 0 M12 15l4-4 M2 19h20',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Speedometer dial for gauges or performance metrics.',
  },
  'chart-scatter': {
    content: 'M3 21V3m0 18h18M7 17h.01M10 12h.01M14 15h.01M17 9h.01M19 13h.01',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Scatter plot grid dotted with sample points.',
  },
  'chart-heatmap': {
    content: 'M3 3h18v18H3V3Zm2 2v4h4V5H5Zm0 6v4h4v-4H5Zm0 6v4h4v-4H5Zm6-12v4h4V5h-4Zm0 6v4h4v-4h-4Zm0 6v4h4v-4h-4Zm6-12v4h4V5h-4Zm0 6v4h4v-4h-4Zm0 6v4h4v-4h-4Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Heatmap grid with cells for intensity comparisons.',
  },
  database: {
    content: 'M12 2C7.03 2 3 3.79 3 6v12c0 2.21 4.03 4 9 4s9-1.79 9-4V6c0-2.21-4.03-4-9-4Zm0 2c4.42 0 7 .89 7 2s-2.58 2-7 2-7-.89-7-2 2.58-2 7-2Zm0 6c4.42 0 7-.89 7-2v3c0 1.11-2.58 2-7 2s-7-.89-7-2V8c0 1.11 2.58 2 7 2Zm0 5c4.42 0 7-.89 7-2v3c0 1.11-2.58 2-7 2s-7-.89-7-2v-3c0 1.11 2.58 2 7 2Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Stacked cylinder database representing stored records.',
  },
};