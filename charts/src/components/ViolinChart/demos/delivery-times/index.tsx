import { ViolinChart } from '../../';
import type { ViolinStatsMarkersConfig, ViolinValueBand } from '../../types';
import type { DensitySeries } from '../../../RidgeChart/types';

const createDistribution = (mean: number, spread: number, count: number, floor: number) =>
  Array.from({ length: count }, (_, index) => {
    const angle = index * 0.37;
    const wobble = Math.sin(angle) * spread + Math.cos(angle * 0.53) * spread * 0.6;
    const seasonal = ((index % 9) - 4) * 0.12 * spread;
    const value = Math.max(floor, mean + wobble + seasonal);
    return Number(value.toFixed(2));
  });

const FULFILLMENT_CENTERS: DensitySeries[] = [
  {
    id: 'northeast',
    name: 'Northeast Hub',
    color: '#1C7ED6',
    values: createDistribution(27.5, 3.2, 140, 18),
  },
  {
    id: 'pacific',
    name: 'Pacific Hub',
    color: '#4C6EF5',
    values: createDistribution(30.4, 3.8, 140, 20),
  },
  {
    id: 'central',
    name: 'Central Sortation',
    color: '#1098AD',
    values: createDistribution(24.6, 2.9, 140, 16),
  },
  {
    id: 'southern',
    name: 'South Regional',
    color: '#12B886',
    values: createDistribution(29.1, 3.4, 140, 18),
  },
];

const SLA_WINDOW: ViolinValueBand[] = [
  {
    id: 'sla',
    label: 'Target SLA window (22-30 hrs)',
    from: 22,
    to: 30,
    color: '#38D9A9',
    opacity: 0.16,
    labelPosition: 'right',
  },
];

const STATS_MARKERS: ViolinStatsMarkersConfig = {
  showMedian: true,
  showQuartiles: true,
  showWhiskers: true,
  showLabels: true,
  colors: {
    median: '#0B7285',
    quartile: '#4C6EF5',
    whisker: '#ADB5BD',
  },
};

export default function Demo() {
  return (
    <ViolinChart
      title="Delivery time spread by fulfillment center"
      subtitle="Distribution of hours from order capture to doorstep delivery"
      width={720}
      height={460}
      series={FULFILLMENT_CENTERS}
      samples={96}
      bandwidth={1.6}
      violinWidthRatio={0.82}
      statsMarkers={STATS_MARKERS}
      valueBands={SLA_WINDOW}
      yAxis={{ title: 'Hours to deliver', show: true, labelFormatter: (value) => `${value.toFixed(0)}h` }}
    />
  );
}
