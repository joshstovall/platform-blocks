import { GaugeChart } from '../../';

const RANGES = [
  { from: 0, to: 850, color: '#F87171', label: 'Behind SLA' },
  { from: 850, to: 950, color: '#FBBF24', label: 'At risk' },
  {
    from: 950,
    to: 1200,
    color: '#34D399',
    label: 'Meeting SLA',
    gradient: {
      angle: 90,
      stops: [
        { offset: 0, color: '#34D399' },
        { offset: 1, color: '#22C55E' },
      ],
    },
  },
];

const CURRENT_THROUGHPUT = 940;
const SLA_FLOOR = 900;
const STRETCH_TARGET = 1100;

const MARKERS = [
  { value: SLA_FLOOR, label: 'SLA floor', color: '#2563EB', size: 18, labelOffset: 22 },
  {
    type: 'needle' as const,
    value: STRETCH_TARGET,
    label: 'Stretch goal',
    color: '#F97316',
    needleLength: 1.0,
    needleWidth: 3.5,
    needleFromCenter: false,
    labelOffset: 18,
    showInLegend: false,
  },
];

export default function Demo() {
  return (
    <GaugeChart
      title="Warehouse Throughput"
      subtitle="Orders fulfilled per hour"
      width={360}
      height={260}
      value={CURRENT_THROUGHPUT}
      min={0}
      max={1200}
      thickness={20}
  innerRadiusRatio={0.62}
      track={{ opacity: 0.16 }}
      ranges={RANGES}
      markers={MARKERS}
  markerFocusStrategy="leading"
      ticks={{ major: 7, minor: 5, color: '#94A3B8', majorLength: 16 }}
      labels={{ formatter: (v) => `${Math.round(v)}`, offset: 34, fontWeight: '600' }}
      needle={{ color: '#0EA5E9', length: 0.84, width: 4, centerSize: 8, showCenter: true }}
      centerLabel={{
        show: true,
        formatter: (val) => `${Math.round(val)} orders/hr`,
        secondaryText: (_, pct) => `${Math.round(pct * 100)}% of max capacity`,
      }}
      legend={{ show: true, position: 'bottom' }}
    />
  );
}
