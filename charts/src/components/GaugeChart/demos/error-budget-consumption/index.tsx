import { GaugeChart } from '../../';

const RANGES = [
  { from: 0, to: 50, color: '#34D399', label: 'Healthy' },
  {
    from: 50,
    to: 80,
    color: '#FBBF24',
    label: 'Degraded',
    gradient: {
      angle: 90,
      stops: [
        { offset: 0, color: '#FBBF24' },
        { offset: 1, color: '#F97316' },
      ],
    },
  },
  { from: 80, to: 100, color: '#F87171', label: 'Burnout risk' },
];

const CURRENT_CONSUMPTION = 62;
const FORECAST_CONSUMPTION = 69;

const MARKERS = [
  { value: 75, label: 'SLO target', color: '#6366F1', size: 18, labelOffset: 18 },
  {
    type: 'needle' as const,
    value: FORECAST_CONSUMPTION,
    label: 'Next week forecast',
    color: '#F97316',
    needleLength: 0.9,
    needleWidth: 3.5,
    labelOffset: 22,
  },
];

export default function Demo() {
  return (
    <GaugeChart
      title="Error Budget Consumption"
      subtitle="Rolling 30-day SLO burn"
      width={360}
      height={260}
      value={CURRENT_CONSUMPTION}
      min={0}
      max={100}
  thickness={18}
  innerRadiusRatio={0.58}
      track={{ opacity: 0.18 }}
      ranges={RANGES}
      markers={MARKERS}
  markerFocusStrategy="closest"
  markerFocusThreshold={18}
      ticks={{ major: 5, minor: 4, color: '#94A3B8' }}
      labels={{ formatter: (v) => `${Math.round(v)}%`, offset: 32, fontWeight: '600' }}
      needle={{ color: '#F97316', length: 0.85, width: 4, centerSize: 7, showCenter: true }}
      centerLabel={{
        show: true,
        formatter: (val) => `${Math.round(val)}% consumed`,
        secondaryText: (_, pct) => `${Math.max(0, Math.round((1 - pct) * 100))}% budget remaining`,
      }}
      legend={{ show: true, position: 'bottom' }}
    />
  );
}
