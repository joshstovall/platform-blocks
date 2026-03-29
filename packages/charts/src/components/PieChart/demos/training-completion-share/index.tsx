import { PieChart, type PieChartDataPoint } from '../../';

const TRAINING_COMPLETIONS = [
  { id: 'engineering', label: 'Engineering', value: 320, color: '#5C7CFA' },
  { id: 'product', label: 'Product', value: 180, color: '#845EF7' },
  { id: 'success', label: 'Customer Success', value: 150, color: '#20C997' },
  { id: 'sales', label: 'Sales', value: 210, color: '#FF922B' },
  { id: 'operations', label: 'Operations', value: 140, color: '#51CF66' },
  { id: 'people', label: 'People', value: 90, color: '#FCC419' },
];

const TOTAL_COMPLETIONS = TRAINING_COMPLETIONS.reduce((sum, slice) => sum + slice.value, 0);

const toPercent = (value: number) => Math.round((value / TOTAL_COMPLETIONS) * 100);

const formatLabel = (slice: PieChartDataPoint) => `${slice.label} ${toPercent(slice.value)}%`;

const formatTooltip = (slice: PieChartDataPoint) => {
  const share = toPercent(slice.value);
  return `${slice.label}: ${slice.value.toLocaleString()} completions (${share}%)`;
};

export default function Demo() {
  return (
    <PieChart
      title="Training completion share"
      subtitle="Annual compliance program"
      width={420}
      height={340}
      data={TRAINING_COMPLETIONS}
      innerRadius={100}
      outerRadius={160}
      showLabels
      labelPosition="outside"
      padAngle={1.2}
      labelFormatter={formatLabel}
      legend={{ show: true, position: 'bottom' }}
      tooltip={{ show: true, formatter: formatTooltip }}
      animation={{ type: 'wave', duration: 900, stagger: 70 }}
      startAngle={-100}
      endAngle={260}
    />
  );
}
