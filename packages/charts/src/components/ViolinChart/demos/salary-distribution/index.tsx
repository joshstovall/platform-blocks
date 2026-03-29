import { ViolinChart } from '../../';
import type { ViolinStatsMarkersConfig, ViolinValueBand } from '../../types';
import type { DensitySeries } from '../../../RidgeChart/types';

const createDistribution = (median: number, spread: number, count: number) =>
  Array.from({ length: count }, (_, index) => {
    const angle = index * 0.41;
    const oscillation = Math.sin(angle) * spread + Math.cos(angle * 0.63) * spread * 0.55;
    const progression = ((index % 11) - 5) * 0.09 * spread;
    const value = Math.max(48, median + oscillation + progression);
    return Number(value.toFixed(1));
  });

const SALARY_SERIES: DensitySeries[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    color: '#6741D9',
    values: createDistribution(128, 14, 160),
    fillOpacity: 0.32,
  },
  {
    id: 'design',
    name: 'Design',
    color: '#4263EB',
    values: createDistribution(104, 11, 160),
    fillOpacity: 0.32,
  },
  {
    id: 'product',
    name: 'Product',
    color: '#0C8599',
    values: createDistribution(118, 12, 160),
    fillOpacity: 0.32,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    color: '#F08C00',
    values: createDistribution(96, 10, 160),
    fillOpacity: 0.32,
  },
];

const MARKET_RANGE: ViolinValueBand[] = [
  {
    id: 'market',
    from: 88,
    to: 112,
    label: 'Market reference band',
    color: '#228BE6',
    opacity: 0.14,
    labelPosition: 'left',
    labelColor: '#1C7ED6',
  },
];

const STATS: ViolinStatsMarkersConfig = {
  showMedian: true,
  showQuartiles: true,
  showMean: true,
  showLabels: true,
  colors: {
    median: '#364FC7',
    quartile: '#1971C2',
    mean: '#2F9E44',
  },
  markerWidthRatio: 0.78,
};

export default function Demo() {
  return (
    <ViolinChart
      title="Total compensation distribution by department"
      subtitle="Annual salary including bonus (USD thousands)"
      width={720}
      height={480}
      series={SALARY_SERIES}
      samples={96}
      bandwidth={2.8}
      violinWidthRatio={0.74}
      statsMarkers={STATS}
      valueBands={MARKET_RANGE}
      yAxis={{
        title: 'Total compensation (k$)',
        labelFormatter: (value) => `$${value.toFixed(0)}k`,
      }}
    />
  );
}
