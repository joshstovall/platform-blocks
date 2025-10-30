import { HeatmapChart } from '../../';

const TEAMS = ['Product', 'Engineering', 'Sales', 'Customer Success', 'Operations'];
const DIMENSIONS = ['Leadership', 'Growth', 'Recognition', 'Workload', 'Inclusion', 'Purpose'];
const SCORES = [
  [4.2, 4.4, 3.9, 3.2, 4.5, 4.1],
  [4.6, 4.1, 3.8, 3.4, 4.3, 3.9],
  [3.8, 3.6, 4.2, 3.1, 3.7, 3.5],
  [4.5, 4.2, 4.0, 3.6, 4.4, 4.1],
  [4.1, 3.9, 3.7, 3.3, 4.0, 3.8],
];

export default function Demo() {
  return (
    <HeatmapChart
      title="Employee engagement survey"
      subtitle="Dimension scores (1-5) by team"
      width={720}
      height={360}
      data={{ rows: TEAMS, cols: DIMENSIONS, values: SCORES }}
      cellSize={{ width: 96, height: 48 }}
      gap={4}
      colorScale={{
        min: 1,
        max: 5,
        stops: [
          { value: 2.5, color: '#F97316' },
          { value: 3.5, color: '#FACC15' },
          { value: 4.5, color: '#22C55E' },
        ],
      }}
      valueFormatter={({ value }) => `${value.toFixed(1)} score`}
      showCellLabels
      xAxis={{ show: true, title: 'Engagement dimension' }}
      yAxis={{ show: true, title: 'Team' }}
      legend={{
        show: true,
        position: 'bottom',
        items: [
          { label: 'Needs focus (< 3.0)', color: '#F97316' },
          { label: 'Steady (3-4)', color: '#FACC15' },
          { label: 'High confidence (> 4)', color: '#22C55E' },
        ],
      }}
      cellCornerRadius={4}
      hoverHighlight={{ rowOpacity: 0.12, columnOpacity: 0.12 }}
      tooltip={{ show: true, aggregate: false }}
    />
  );
}
