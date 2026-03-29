import { DonutChart } from '../../';
import type { DonutChartDataPoint } from '../../';

const FULFILLMENT_PARTNERS: DonutChartDataPoint[] = [
  { label: 'Direct warehouses', value: 1.35, color: '#4263EB' },
  { label: '3PL network', value: 1.08, color: '#FF6B6B' },
  { label: 'Regional partners', value: 0.82, color: '#20C997' },
  { label: 'Drop-ship vendors', value: 0.54, color: '#FCC419' },
  { label: 'Micro-fulfillment hubs', value: 0.31, color: '#FAB005' },
];

const formatOrders = (value: number) => `${value.toFixed(2)}M`;

export default function Demo() {
  return (
    <DonutChart
      title="Marketplace Fulfillment Mix"
      subtitle="Orders fulfilled in Q3"
      size={300}
      data={FULFILLMENT_PARTNERS}
      padAngle={1.6}
      isolateOnClick
      legend={{ position: 'bottom' }}
      centerLabel={() => 'Orders'}
      centerSubLabel={() => 'Fulfilled volume by partner'}
      centerValueFormatter={(value) => `${formatOrders(value)} total`}
    />
  );
}
