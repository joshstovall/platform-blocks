import { RadarChart } from '../../';

const AXES = [
  'Code quality',
  'Delivery speed',
  'Testing coverage',
  'Observability',
  'Collaboration',
  'Innovation',
];

const buildSeriesData = (values: number[]) =>
  AXES.map((axis, index) => ({ axis, value: values[index] }));

const SERIES = [
  {
    id: 'frontend-guild',
    name: 'Frontend guild',
    color: 'rgba(59, 130, 246, 0.6)',
    showPoints: true,
    pointSize: 4,
    data: buildSeriesData([92, 84, 78, 86, 90, 74]),
  },
  {
    id: 'platform-guild',
    name: 'Platform guild',
    color: 'rgba(16, 185, 129, 0.6)',
    showPoints: true,
    pointSize: 4,
    data: buildSeriesData([88, 79, 91, 93, 82, 70]),
  },
  {
    id: 'qa-guild',
    name: 'QA guild',
    color: 'rgba(249, 115, 22, 0.6)',
    showPoints: true,
    pointSize: 4,
    data: buildSeriesData([80, 72, 95, 88, 76, 68]),
  },
];

export default function Demo() {
  return (
    <RadarChart
      title="Engineering guild comparison"
      subtitle="Quarterly capability radar"
      width={480}
      height={420}
      series={SERIES}
      maxValue={100}
      radialGrid={{ rings: 5, shape: 'polygon', showAxes: true }}
      enableCrosshair
      multiTooltip
      liveTooltip
      legend={{ show: true, position: 'right', align: 'start' }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.axis}: ${Math.round(point.value)}%`,
      }}
    />
  );
}
