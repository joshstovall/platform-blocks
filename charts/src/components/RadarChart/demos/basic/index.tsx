import { RadarChart } from '../../';

const SERIES = [
  {
    id: 'current',
    name: 'Current quarter',
    color: 'rgba(76, 110, 245, 0.55)',
    data: [
      { axis: 'Sales', value: 42 },
      { axis: 'Marketing', value: 30 },
      { axis: 'R&D', value: 50 },
      { axis: 'Support', value: 35 },
      { axis: 'Operations', value: 24 },
      { axis: 'Finance', value: 18 },
    ],
  },
  {
    id: 'target',
    name: 'Target',
    color: 'rgba(32, 201, 151, 0.55)',
    data: [
      { axis: 'Sales', value: 48 },
      { axis: 'Marketing', value: 36 },
      { axis: 'R&D', value: 44 },
      { axis: 'Support', value: 40 },
      { axis: 'Operations', value: 28 },
      { axis: 'Finance', value: 22 },
    ],
  },
];

export default function Demo() {
  return (
    <RadarChart
      title="Team capability radar"
      width={420}
      height={360}
      series={SERIES}
      maxValue={60}
      radialGrid={{ rings: 5, shape: 'polygon', showAxes: true }}
      smooth
      fill
      enableCrosshair
      multiTooltip
      liveTooltip
      legend={{ show: true, position: 'bottom' }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.axis}: ${point.value}`,
      }}
    />
  );
}
