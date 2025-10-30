import { DonutChart } from '../../';
import type { DonutChartDataPoint } from '../../';

const POWER_BY_SUBSYSTEM: DonutChartDataPoint[] = [
  { label: 'Compute clusters', value: 37, color: '#1C7ED6' },
  { label: 'Storage arrays', value: 21, color: '#51CF66' },
  { label: 'Networking fabric', value: 14, color: '#845EF7' },
  { label: 'Cooling systems', value: 18, color: '#FCC419' },
  { label: 'Ancillary load', value: 10, color: '#FF6B6B' },
];

const formatMegawatts = (value: number) => `${value.toFixed(1)} MW`;

export default function Demo() {
  return (
    <DonutChart
      title="Data Center Power Draw"
      subtitle="May 2025 peak load"
      size={320}
      data={POWER_BY_SUBSYSTEM}
      padAngle={2}
      legend={{ position: 'right', align: 'start' }}
      padding={{ top: 72, right: 168, bottom: 72, left: 72 }}
      centerLabel={() => 'Power load'}
      centerSubLabel={() => 'Across campus subsystems'}
      centerValueFormatter={(value) => formatMegawatts(value)}
      labels={{
        show: true,
        position: 'outside',
        showPercentage: true,
        showValue: true,
        valueFormatter: ({ value }) => formatMegawatts(value),
        leaderLine: { width: 1.5 },
      }}
    />
  );
}
