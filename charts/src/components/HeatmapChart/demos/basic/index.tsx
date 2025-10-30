import { HeatmapChart } from '../../';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SESSIONS = ['Morning', 'Afternoon', 'Evening'];
const UTILIZATION = [
  [12, 18, 25, 22, 28],
  [8, 14, 19, 24, 20],
  [6, 9, 12, 15, 11],
];

export default function Demo() {
  return (
    <HeatmapChart
      title="Support ticket load"
      subtitle="Average tickets per hour"
      width={520}
      height={320}
      data={{ rows: SESSIONS, cols: DAYS, values: UTILIZATION }}
      cellSize={{ width: 48, height: 44 }}
      gap={4}
      colorScale={{
        min: 0,
        max: 30,
        colors: ['#EBF4FF', '#60A5FA', '#1D4ED8'],
      }}
      xAxis={{
        show: true,
        title: 'Weekday',
      }}
      yAxis={{
        show: true,
        title: 'Shift',
      }}
      grid={{ show: false }}
      legend={{
        show: true,
        position: 'bottom',
        items: [
          { label: 'Low', color: '#EBF4FF' },
          { label: 'High', color: '#1D4ED8' },
        ],
      }}
      tooltip={{ show: true }}
    />
  );
}
