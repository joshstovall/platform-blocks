import { GaugeChart } from '../../';

const RANGES = [
  { from: 0, to: 40, color: '#F87171', label: 'High' },
  { from: 40, to: 70, color: '#FBBF24', label: 'Moderate' },
  { from: 70, to: 100, color: '#34D399', label: 'Optimal' },
];

export default function Demo() {
  return (
    <GaugeChart
      title="System Health"
      subtitle="Live CPU utilisation"
      width={320}
      height={240}
      value={68}
      min={0}
      max={100}
      thickness={16}
      track={{ opacity: 0.2 }}
      ranges={RANGES}
      ticks={{ major: 5, minor: 4, color: '#94A3B8' }}
      labels={{ formatter: (v) => `${Math.round(v)}%`, offset: 26 }}
      needle={{ length: 0.85, centerSize: 6, showCenter: true }}
      centerLabel={{ show: true, formatter: (val) => `${Math.round(val)}%`, secondaryText: (_, pct) => `${Math.round(pct * 100)}% of max` }}
      legend={{ show: true, position: 'bottom' }}
    />
  );
}
