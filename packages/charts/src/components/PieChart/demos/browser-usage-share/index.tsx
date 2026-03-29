import { PieChart, type PieChartDataPoint } from '../../';

const BROWSER_USAGE = [
  { id: 'chrome', label: 'Chrome', value: 52, color: '#5C7CFA' },
  { id: 'safari', label: 'Safari', value: 28, color: '#38D9A9' },
  { id: 'edge', label: 'Edge', value: 11, color: '#FF922B' },
  { id: 'firefox', label: 'Firefox', value: 6, color: '#BE4BDB' },
  { id: 'other', label: 'Other', value: 3, color: '#ADB5BD' },
];

const formatLabel = (slice: PieChartDataPoint) => `${slice.label} ${slice.value}%`;

const formatTooltip = (slice: PieChartDataPoint) => `${slice.label}: ${slice.value}% of sessions`;

export default function Demo() {
  return (
    <PieChart
      title="Browser usage share"
      subtitle="Active sessions"
      width={400}
      height={320}
      data={BROWSER_USAGE}
      outerRadius={150}
      showLabels
      labelPosition="outside"
      padAngle={1.5}
      labelFormatter={formatLabel}
      legend={{ show: true, position: 'bottom' }}
      tooltip={{ show: true, formatter: formatTooltip }}
      animation={{ type: 'spiral', duration: 900 }}
      startAngle={-90}
      endAngle={270}
    />
  );
}
