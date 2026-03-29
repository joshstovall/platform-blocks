import { PieChart, type PieChartDataPoint } from '../../';

const SUPPORT_CHANNELS = [
  { id: 'chat', label: 'Live chat', value: 460, color: '#5C7CFA' },
  { id: 'email', label: 'Email', value: 380, color: '#20C997' },
  { id: 'phone', label: 'Phone', value: 240, color: '#FF922B' },
  { id: 'self-service', label: 'Self-service', value: 310, color: '#845EF7' },
  { id: 'social', label: 'Social', value: 90, color: '#12B886' },
];

const TOTAL_INTERACTIONS = SUPPORT_CHANNELS.reduce((sum, slice) => sum + slice.value, 0);

const toShare = (value: number) => Math.round((value / TOTAL_INTERACTIONS) * 100);

const formatLabel = (slice: PieChartDataPoint) => `${slice.label} ${toShare(slice.value)}%`;

const formatTooltip = (slice: PieChartDataPoint) => {
  const share = toShare(slice.value);
  return `${slice.label}: ${slice.value.toLocaleString()} interactions (${share}%)`;
};

export default function Demo() {
  return (
    <PieChart
      title="Support contact mix"
      subtitle="Last 30 days"
      width={420}
      height={340}
      data={SUPPORT_CHANNELS}
      innerRadius={80}
      outerRadius={150}
      showLabels
      labelPosition="outside"
      padAngle={1}
      labelFormatter={formatLabel}
      legend={{ show: true, position: 'right' }}
      tooltip={{ show: true, formatter: formatTooltip }}
      startAngle={-70}
      endAngle={290}
    />
  );
}
