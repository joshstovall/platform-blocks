import { GaugeChart } from '../../';

const RANGES = [
  { from: 0, to: 60, color: '#F87171', label: 'High risk' },
  {
    from: 60,
    to: 80,
    color: '#FBBF24',
    label: 'Needs attention',
    gradient: {
      angle: 270,
      stops: [
        { offset: 0, color: '#FACC15' },
        { offset: 1, color: '#F97316' },
      ],
    },
  },
  { from: 80, to: 100, color: '#34D399', label: 'Meets target' },
];

const COMPLIANCE_BASELINE = 85;
const SECURITY_SCORE = 78;
const LAST_QUARTER_SCORE = 82;
const MARKERS = [
  { value: COMPLIANCE_BASELINE, label: 'Compliance floor', color: '#0EA5E9', size: 18, labelOffset: 18 },
  {
    type: 'needle' as const,
    value: LAST_QUARTER_SCORE,
    label: 'Last quarter',
    color: '#14B8A6',
    needleLength: 0.86,
    labelOffset: 20,
  },
];

const deltaToBaseline = COMPLIANCE_BASELINE - SECURITY_SCORE;

export default function Demo() {
  return (
    <GaugeChart
      title="Security Posture Score"
      subtitle="Quarterly audit composite"
      width={340}
      height={250}
      value={SECURITY_SCORE}
      min={0}
      max={100}
      thickness={18}
  innerRadiusRatio={0.6}
      track={{ opacity: 0.18 }}
      ranges={RANGES}
      markers={MARKERS}
  markerFocusThreshold={10}
      ticks={{ major: 5, minor: 4, color: '#94A3B8' }}
      labels={{ formatter: (v) => `${Math.round(v)}`, offset: 30 }}
      needle={{ color: '#6366F1', length: 0.84, width: 3.5, centerSize: 7, showCenter: true }}
      centerLabel={{
        show: true,
        formatter: (val) => `${Math.round(val)}/100`,
        secondaryText:
          deltaToBaseline <= 0
            ? 'Meets compliance benchmark'
            : `Need +${deltaToBaseline} pts`,
      }}
      legend={{ show: true, position: 'bottom' }}
    />
  );
}
