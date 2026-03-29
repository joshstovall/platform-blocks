import { RadarChart } from '../../';

const AXES = [
  { axis: 'strategy', label: 'Product\nStrategy' },
  { axis: 'delivery', label: 'Delivery\nExecution' },
  { axis: 'customer', label: 'Customer\nInsight' },
  { axis: 'collaboration', label: 'Cross-team\nCollaboration' },
  { axis: 'quality', label: 'Quality &\nReliability' },
];

const makeSeries = (values: number[]) =>
  AXES.map(({ axis, label }, index) => {
    const value = values[index];
    return {
      axis,
      value,
      label,
      formattedValue: `${value} pts`,
    };
  });

const SERIES = [
  {
    id: 'target',
    name: 'Target capability',
    color: 'rgba(37, 99, 235, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: makeSeries([92, 90, 95, 94, 93]),
  },
  {
    id: 'engineering',
    name: 'Engineering org',
    color: 'rgba(56, 189, 248, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: makeSeries([88, 82, 76, 84, 80]),
  },
  {
    id: 'product',
    name: 'Product org',
    color: 'rgba(22, 163, 74, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: makeSeries([86, 78, 90, 88, 82]),
  },
  {
    id: 'design',
    name: 'Design org',
    color: 'rgba(249, 115, 22, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: makeSeries([80, 70, 88, 90, 76]),
  },
];

export default function Demo() {
  return (
    <RadarChart
      title="Role family skills gap analysis"
      subtitle="Percent attainment against competency targets"
      width={520}
      height={460}
      series={SERIES}
      maxValue={100}
      fill
      enableCrosshair
      multiTooltip
      legend={{ show: true, position: 'right', align: 'start' }}
      radialGrid={{
        rings: 4,
        shape: 'polygon',
        axisLabelPlacement: 'outside',
        axisLabelOffset: 24,
        ringLabels: ({ value }) => `${Math.round(value)} pts`,
      }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.label ?? point.axis}: ${Math.round(point.value)} / 100`,
      }}
    />
  );
}
