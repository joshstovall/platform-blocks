import { HeatmapChart } from '../../';

const MODULES = ['Authentication', 'Billing', 'Analytics', 'Messaging', 'Integrations', 'Admin'];
const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const BACKLOG = [
  [6, 14, 21, 9],
  [2, 11, 18, 13],
  [5, 13, 25, 19],
  [3, 9, 17, 12],
  [1, 7, 15, 10],
  [0, 6, 12, 9],
];

export default function Demo() {
  return (
    <HeatmapChart
      title="Support backlog by module"
      subtitle="Open tickets by severity priority"
      width={700}
      height={360}
      data={{ rows: MODULES, cols: PRIORITIES, values: BACKLOG }}
      cellSize={{ width: 108, height: 48 }}
      gap={6}
      colorScale={{
        type: 'log',
        min: 1,
        max: 32,
        colors: ['#EFF6FF', '#60A5FA', '#1D4ED8'],
      }}
      valueFormatter={({ value }) => `${value} ${value === 1 ? 'ticket' : 'tickets'}`}
      showCellLabels={({ cell }) => cell.value >= 8}
      xAxis={{ show: true, title: 'Priority' }}
      yAxis={{ show: true, title: 'Product module' }}
      legend={{
        show: true,
        position: 'bottom',
        items: [
          { label: 'Low volume', color: '#EFF6FF' },
          { label: 'Rising load', color: '#60A5FA' },
          { label: 'Critical backlog', color: '#1D4ED8' },
        ],
      }}
      cellCornerRadius={4}
      hoverHighlight={{ rowOpacity: 0.14, columnOpacity: 0.12 }}
      tooltip={{ show: true, aggregate: true }}
    />
  );
}
