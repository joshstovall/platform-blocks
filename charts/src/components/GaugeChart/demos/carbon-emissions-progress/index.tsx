import { GaugeChart } from '../../';

const RANGES = [
  { from: 0, to: 8, color: '#F87171', label: 'Behind plan' },
  { from: 8, to: 15, color: '#FBBF24', label: 'On watch' },
  {
    from: 15,
    to: 20,
    color: '#34D399',
    label: 'Ahead of goal',
    gradient: {
      angle: 45,
      stops: [
        { offset: 0, color: '#34D399' },
        { offset: 1, color: '#059669' },
      ],
    },
  },
];

const TARGET_REDUCTION = 15;
const CURRENT_REDUCTION = 12.4;
const LAST_YEAR_REDUCTION = 10.7;

const MARKERS = [
  { value: TARGET_REDUCTION, label: 'Quarter target', color: '#14B8A6', size: 18, labelOffset: 16 },
  {
    type: 'needle' as const,
    value: LAST_YEAR_REDUCTION,
    label: 'Last year',
    color: '#0EA5E9',
    needleLength: 0.78,
    labelOffset: 18,
  },
];

const goalProgress = Math.min(1, CURRENT_REDUCTION / TARGET_REDUCTION);

export default function Demo() {
  return (
    <GaugeChart
      title="Carbon Emissions Reduction"
      subtitle="Progress vs. quarterly goal"
      width={340}
      height={250}
      value={CURRENT_REDUCTION}
      min={0}
      max={20}
      thickness={18}
  innerRadiusRatio={0.62}
      track={{ opacity: 0.18 }}
      ranges={RANGES}
      markers={MARKERS}
  markerFocusThreshold={8}
      ticks={{ major: 5, minor: 4, color: '#94A3B8' }}
      labels={{ formatter: (v) => `${Math.round(v)}%`, offset: 30 }}
      needle={{ color: '#0EA5E9', length: 0.82, width: 3.5, centerSize: 7, showCenter: true }}
      centerLabel={{
        show: true,
        formatter: (val) => `${val.toFixed(1)}% reduction`,
        secondaryText: `${Math.round(goalProgress * 100)}% of target`,
      }}
      legend={{ show: true, position: 'bottom' }}
    />
  );
}
