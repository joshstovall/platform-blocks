import { RadarChart } from '../../';

const AXES = ['Security', 'Reliability', 'Scalability', 'Performance', 'Maintainability'];

const createSeries = (values: number[]) =>
  AXES.map((axis, index) => {
    const value = values[index];
    return {
      axis,
      value,
      formattedValue: `${value.toFixed(1)} / 5`,
    };
  });

const SERIES = [
  {
    id: 'current',
    name: 'Current posture',
    color: 'rgba(239, 68, 68, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: createSeries([2.6, 3.1, 2.8, 3.4, 2.9]),
  },
  {
    id: 'target',
    name: 'Target readiness',
    color: 'rgba(16, 185, 129, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: createSeries([4.2, 4.4, 4.1, 4.3, 4.0]),
  },
];

export default function Demo() {
  return (
    <RadarChart
      title="Engineering readiness radar"
      subtitle="Security, reliability, scalability, performance, maintainability"
      width={440}
      height={420}
      series={SERIES}
      maxValue={5}
      fill
      enableCrosshair
      legend={{ show: true, position: 'bottom' }}
      radialGrid={{
        rings: 5,
        shape: 'circle',
        showAxes: true,
        axisLabelPlacement: 'outside',
        ringLabels: [
          'Reactive',
          'Developing',
          'Consistent',
          'Resilient',
          'Elite',
        ],
        ringLabelPosition: 'inside',
        ringLabelOffset: 18,
      }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.axis}: ${point.value.toFixed(1)} readiness`,
      }}
    />
  );
}
