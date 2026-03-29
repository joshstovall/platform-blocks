import { ViolinChart } from '../../';
import type { ViolinStatsMarkersConfig, ViolinValueBand } from '../../types';
import type { DensitySeries } from '../../../RidgeChart/types';

const createDistribution = (mean: number, spread: number, count: number) =>
  Array.from({ length: count }, (_, index) => {
    const angle = index * 0.39;
    const texture = Math.sin(angle) * spread + Math.cos(angle * 0.57) * spread * 0.52;
    const drift = ((index % 10) - 5) * 0.07 * spread;
    const value = mean + texture + drift;
    return Number(value.toFixed(2));
  });

const EXPERIMENT_SERIES: DensitySeries[] = [
  {
    id: 'control',
    name: 'Control holdout',
    color: '#ADB5BD',
    values: createDistribution(0.1, 0.9, 140),
    strokeColor: '#868E96',
  },
  {
    id: 'variant-a',
    name: 'Variant A — onboarding nudge',
    color: '#4C6EF5',
    values: createDistribution(1.8, 1.2, 140),
  },
  {
    id: 'variant-b',
    name: 'Variant B — personalization',
    color: '#20C997',
    values: createDistribution(3.6, 1.5, 140),
  },
  {
    id: 'variant-c',
    name: 'Variant C — price emphasis',
    color: '#FA5252',
    values: createDistribution(-0.6, 1.1, 140),
  },
];

const VALUE_BANDS: ViolinValueBand[] = [
  {
    id: 'neutral-band',
    from: -1,
    to: 1,
    label: 'Neutral delta corridor',
    color: '#DEE2E6',
    opacity: 0.32,
    labelPosition: 'left',
    labelColor: '#495057',
  },
  {
    id: 'meaningful-lift',
    from: 2,
    to: 6,
    label: 'Meaningful lift zone',
    color: '#51CF66',
    opacity: 0.18,
    labelPosition: 'right',
    labelColor: '#2B8A3E',
  },
];

const STATS: ViolinStatsMarkersConfig = {
  showMedian: true,
  showMean: true,
  showWhiskers: true,
  showLabels: true,
  markerWidthRatio: 0.72,
  colors: {
    median: '#364FC7',
    mean: '#0B7285',
    whisker: '#868E96',
  },
};

export default function Demo() {
  return (
    <ViolinChart
      title="Experiment metric deltas vs. control"
      subtitle="Percent change in weekly activation compared to holdout"
      width={720}
      height={460}
      series={EXPERIMENT_SERIES}
      samples={88}
      bandwidth={1.5}
      violinWidthRatio={0.68}
      statsMarkers={STATS}
      valueBands={VALUE_BANDS}
      yAxis={{
        title: 'Percent delta',
        labelFormatter: (value) => `${value.toFixed(1)}%`,
      }}
      xAxis={{ show: true, title: 'Variant cohorts' }}
    />
  );
}
