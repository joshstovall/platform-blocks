import { RadarChart } from '../../';

const AXES = [
  { axis: 'governance', label: 'Data\nGovernance' },
  { axis: 'quality', label: 'Data\nQuality' },
  { axis: 'lineage', label: 'Lineage &\nCataloguing' },
  { axis: 'selfServe', label: 'Self-service\nEnablement' },
  { axis: 'automation', label: 'Automation &\nObservability' },
  { axis: 'culture', label: 'Culture &\nLiteracy' },
];

const maturityLabel = (value: number) => {
  if (value >= 4.5) return 'Optimized';
  if (value >= 3.5) return 'Managed';
  if (value >= 2.5) return 'Defined';
  if (value >= 1.5) return 'Emerging';
  return 'Ad hoc';
};

const assembleSeries = (values: number[]) =>
  AXES.map(({ axis, label }, index) => {
    const value = values[index];
    return {
      axis,
      value,
      label,
      formattedValue: `${value.toFixed(1)} / 5`,
      tooltip: `${value.toFixed(1)} / 5 • ${maturityLabel(value)}`,
    };
  });

const SERIES = [
  {
    id: 'current',
    name: 'Current state',
    color: 'rgba(59, 130, 246, 0.55)',
    showPoints: true,
    pointSize: 4,
    data: assembleSeries([2.3, 2.8, 2.2, 1.9, 2.5, 2.1]),
  },
  {
    id: 'target',
    name: 'Target FY24',
    color: 'rgba(99, 102, 241, 0.45)',
    showPoints: true,
    pointSize: 4,
    data: assembleSeries([3.6, 3.8, 3.4, 3.2, 3.5, 3.3]),
  },
  {
    id: 'leader',
    name: 'Industry leader benchmark',
    color: 'rgba(16, 185, 129, 0.5)',
    showPoints: true,
    pointSize: 4,
    data: assembleSeries([4.5, 4.6, 4.4, 4.2, 4.5, 4.3]),
  },
];

export default function Demo() {
  return (
    <RadarChart
      title="Data platform maturity"
      subtitle="Governance and enablement dimensions"
      width={520}
      height={460}
      series={SERIES}
      maxValue={5}
      fill
      enableCrosshair
      multiTooltip
      legend={{ show: true, position: 'bottom', align: 'center' }}
      radialGrid={{
        rings: 5,
        shape: 'polygon',
        axisLabelPlacement: 'outside',
        axisLabelOffset: 24,
        ringLabels: [
          'Ad hoc',
          'Emerging',
          'Defined',
          'Managed',
          'Optimized',
        ],
        ringLabelPosition: 'outside',
        ringLabelOffset: 16,
      }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.label ?? point.axis}: ${point.value.toFixed(1)} / 5`,
      }}
    />
  );
}
