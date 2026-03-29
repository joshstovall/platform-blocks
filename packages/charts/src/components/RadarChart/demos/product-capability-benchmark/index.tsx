import { RadarChart } from '../../';

const AXES = [
  { axis: 'ai', label: 'AI Assist' },
  { axis: 'integrations', label: 'Integration\nEcosystem' },
  { axis: 'analytics', label: 'Analytics\nDepth' },
  { axis: 'scale', label: 'Enterprise\nScalability' },
  { axis: 'security', label: 'Security\n& Compliance' },
  { axis: 'ux', label: 'User\nExperience' },
];

const buildSeries = (values: number[]) =>
  AXES.map(({ axis, label }, index) => {
    const value = values[index];
    return {
      axis,
      value,
      label,
      formattedValue: `${value.toFixed(1)} / 10`,
    };
  });

const SERIES = [
  {
    id: 'ours',
    name: 'Our platform',
    color: 'rgba(59, 130, 246, 0.6)',
    showPoints: true,
    pointSize: 4,
    data: buildSeries([8.4, 7.8, 8.9, 8.7, 9.4, 8.6]),
  },
  {
    id: 'competitor-a',
    name: 'Competitor Alpha',
    color: 'rgba(14, 165, 233, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: buildSeries([7.6, 8.4, 8.1, 8.2, 8.9, 7.5]),
  },
  {
    id: 'competitor-b',
    name: 'Competitor Beta',
    color: 'rgba(249, 115, 22, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: buildSeries([6.8, 7.4, 7.5, 7.9, 8.1, 6.9]),
  },
];

export default function Demo() {
  return (
    <RadarChart
      title="Product capability vs. competition"
      subtitle="Benchmarking core differentiators"
      width={500}
      height={440}
      series={SERIES}
      maxValue={10}
      fill
      enableCrosshair
      legend={{ show: true, position: 'bottom', align: 'center' }}
      radialGrid={{
        rings: 5,
        shape: 'polygon',
        showAxes: true,
        axisLabelPlacement: 'outside',
        axisLabelOffset: 20,
        ringLabels: [
          'Baseline',
          'Market ready',
          'Parity',
          'Differentiated',
          'Category leader',
        ],
      }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.label ?? point.axis}: ${point.value.toFixed(1)} / 10`,
      }}
    />
  );
}
