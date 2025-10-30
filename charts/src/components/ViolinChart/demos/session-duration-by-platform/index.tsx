import { ViolinChart } from '../../';
import type { ViolinStatsMarkersConfig, ViolinValueBand } from '../../types';
import type { DensitySeries } from '../../../RidgeChart/types';

const createDistribution = (mean: number, spread: number, count: number, floor = 0.6) =>
  Array.from({ length: count }, (_, index) => {
    const angle = index * 0.43;
    const contour = Math.sin(angle) * spread + Math.cos(angle * 0.61) * spread * 0.45;
    const usageCycle = ((index % 13) - 6) * 0.05 * spread;
    const value = Math.max(floor, mean + contour + usageCycle);
    return Number(value.toFixed(2));
  });

const SESSION_SERIES: DensitySeries[] = [
  {
    id: 'ios',
    name: 'iOS',
    color: '#2E9AFF',
    values: createDistribution(6.8, 2.4, 150),
  },
  {
    id: 'android',
    name: 'Android',
    color: '#20C997',
    values: createDistribution(7.4, 2.8, 150),
  },
  {
    id: 'web',
    name: 'Web',
    color: '#FAB005',
    values: createDistribution(5.1, 2.2, 150),
  },
  {
    id: 'tv',
    name: 'Smart TV',
    color: '#845EF7',
    values: createDistribution(11.2, 3.5, 150, 2.2),
  },
];

const ENGAGEMENT_BANDS: ViolinValueBand[] = [
  {
    id: 'sweet-spot',
    from: 3,
    to: 8,
    label: 'Engagement sweet spot',
    color: '#94D82D',
    opacity: 0.12,
    labelPosition: 'left',
  },
];

const STATS: ViolinStatsMarkersConfig = {
  showMedian: true,
  showMean: true,
  showLabels: true,
  colors: {
    median: '#364FC7',
    mean: '#2B8A3E',
  },
  markerWidthRatio: 0.8,
};

export default function Demo() {
  return (
    <ViolinChart
      title="Session duration distribution by platform"
      subtitle="Minutes per active session across major surfaces"
      width={700}
      height={440}
      series={SESSION_SERIES}
      samples={88}
      bandwidth={1.9}
      violinWidthRatio={0.7}
      statsMarkers={STATS}
      valueBands={ENGAGEMENT_BANDS}
      yAxis={{
        title: 'Minutes per session',
        labelFormatter: (value) => `${value.toFixed(1)} min`,
      }}
    />
  );
}
