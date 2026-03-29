import { RadarChart } from '../../';

const AXES = [
  'Availability',
  'Latency',
  'NPS',
  'Feature velocity',
  'Security posture',
  'Cost efficiency',
];

const makeSeriesData = (values: number[]) =>
  AXES.map((axis, index) => ({ axis, value: values[index] }));

const SERIES = [
  {
    id: 'current-health',
    name: 'Current health',
    color: 'rgba(14, 165, 233, 0.55)',
    showPoints: true,
    pointSize: 3,
    data: makeSeriesData([8.4, 7.2, 6.8, 7.5, 8.8, 6.2]),
  },
  {
    id: 'target-health',
    name: 'Target health',
    color: 'rgba(59, 130, 246, 0.45)',
    showPoints: true,
    pointSize: 3,
    data: makeSeriesData([9.2, 8.6, 8.1, 8.5, 9.0, 7.5]),
  },
];

export default function Demo() {
  return (
    <RadarChart
      title="Product health radar"
      subtitle="Operational score vs. strategic goal"
      width={460}
      height={420}
      series={SERIES}
      maxValue={10}
      radialGrid={{ rings: 4, shape: 'circle', showAxes: false }}
      enableCrosshair
      legend={{ show: true, position: 'bottom', align: 'center' }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.axis}: ${point.value.toFixed(1)} / 10`,
      }}
    />
  );
}
