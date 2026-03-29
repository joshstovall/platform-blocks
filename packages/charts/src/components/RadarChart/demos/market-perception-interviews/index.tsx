import { RadarChart } from '../../';

const AXES = [
  { axis: 'ease', label: 'Ease of\nUse' },
  { axis: 'feature', label: 'Feature\nDepth' },
  { axis: 'innovation', label: 'Innovation\nStory' },
  { axis: 'trust', label: 'Trust &\nCredibility' },
  { axis: 'support', label: 'Support\nExperience' },
  { axis: 'value', label: 'Value for\nMoney' },
];

const buildSeries = (values: number[]) =>
  AXES.map(({ axis, label }, index) => {
    const value = values[index];
    return {
      axis,
      value,
      label,
      formattedValue: `${value.toFixed(1)} / 5`,
    };
  });

const SERIES = [
  {
    id: 'customers',
    name: 'Existing customers',
    color: 'rgba(59, 130, 246, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: buildSeries([4.6, 4.1, 4.3, 4.4, 4.7, 4.2]),
  },
  {
    id: 'prospects',
    name: 'Active prospects',
    color: 'rgba(249, 115, 22, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: buildSeries([4.2, 3.8, 4.0, 4.1, 3.9, 4.0]),
  },
  {
    id: 'analysts',
    name: 'Industry analysts',
    color: 'rgba(16, 185, 129, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: buildSeries([4.4, 4.3, 4.5, 4.2, 4.0, 4.1]),
  },
];

export default function Demo() {
  return (
    <RadarChart
      title="Market perception signal"
      subtitle="Customer interview scorecard"
      width={480}
      height={440}
      series={SERIES}
      maxValue={5}
      fill
      enableCrosshair
      multiTooltip
      legend={{ show: true, position: 'right', align: 'center' }}
      radialGrid={{
        rings: 5,
        shape: 'polygon',
        axisLabelPlacement: 'outside',
        axisLabelOffset: 18,
        ringLabels: ({ index }) => ['Poor', 'Fair', 'Good', 'Great', 'Exceptional'][index],
      }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.label ?? point.axis}: ${point.value.toFixed(1)} / 5`,
      }}
    />
  );
}
