import { HeatmapChart } from '../../';

const SEGMENTS = ['New leads', 'Free trials', 'Customers', 'Churn risk'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CLICK_RATES = [
  [18, 22, 35, 31, 29, 26, 20],
  [24, 28, 38, 36, 33, 30, 27],
  [14, 18, 22, 20, 19, 17, 16],
  [30, 34, 42, 39, 36, 32, 28],
];

export default function Demo() {
  return (
    <HeatmapChart
      title="Email click-through performance"
      subtitle="Daily CTR (%) across audience segments"
      width={760}
      height={320}
      data={{ rows: SEGMENTS, cols: DAYS, values: CLICK_RATES }}
      cellSize={{ width: 80, height: 44 }}
      gap={4}
      colorScale={{
        min: 10,
        max: 45,
        colors: ['#F5F3FF', '#C4B5FD', '#7C3AED'],
      }}
      valueFormatter={({ value }) => `${Math.round(value)}% CTR`}
      showCellLabels={({ cell }) => cell.value >= 32}
      xAxis={{ show: true, title: 'Day of week' }}
      yAxis={{ show: true, title: 'Segment' }}
      legend={{
        show: true,
        position: 'bottom',
        items: [
          { label: 'Baseline', color: '#F5F3FF' },
          { label: 'Above average', color: '#C4B5FD' },
          { label: 'Top performing', color: '#7C3AED' },
        ],
      }}
      cellCornerRadius={6}
      hoverHighlight={{ rowOpacity: 0.12, columnOpacity: 0.1 }}
      tooltip={{ show: true, aggregate: false }}
    />
  );
}
