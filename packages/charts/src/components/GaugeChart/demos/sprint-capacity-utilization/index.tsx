import { GaugeChart } from '../../';

const RANGES = [
  { from: 0, to: 70, color: '#CBD5F5', label: 'Under target' },
  { from: 70, to: 100, color: '#34D399', label: 'On plan' },
  {
    from: 100,
    to: 120,
    color: '#F97316',
    label: 'Stretch zone',
    gradient: {
      angle: 0,
      stops: [
        { offset: 0, color: '#F97316' },
        { offset: 1, color: '#F43F5E' },
      ],
    },
  },
];

const PLANNED_POINTS = 96;
const COMPLETED_POINTS = 88;
const VELOCITY_TREND = 92;

const MARKERS = [
  { value: PLANNED_POINTS, label: 'Planned load', color: '#0EA5E9', size: 20, labelOffset: 20 },
  {
    type: 'needle' as const,
    value: VELOCITY_TREND,
    label: 'Velocity trend',
    color: '#6366F1',
    needleLength: 0.88,
    needleWidth: 3.5,
    labelOffset: 20,
  },
];

const percentOfPlan = Math.round((COMPLETED_POINTS / PLANNED_POINTS) * 100);

export default function Demo() {
  return (
    <GaugeChart
      title="Sprint Capacity Utilisation"
      subtitle="Completed story points vs. plan"
      width={360}
      height={260}
      value={COMPLETED_POINTS}
      min={0}
      max={120}
      thickness={18}
  innerRadiusRatio={0.6}
      track={{ opacity: 0.2 }}
      ranges={RANGES}
      markers={MARKERS}
  markerFocusThreshold={15}
      ticks={{ major: 6, minor: 4, color: '#94A3B8' }}
      labels={{ formatter: (v) => `${Math.round(v)} pts`, offset: 28 }}
      needle={{ color: '#6366F1', length: 0.82, width: 4, centerSize: 7, showCenter: true }}
      centerLabel={{
        show: true,
        formatter: () => `${COMPLETED_POINTS} pts delivered`,
        secondaryText: `${percentOfPlan}% of plan`,
      }}
      legend={{ show: true, position: 'bottom' }}
    />
  );
}
