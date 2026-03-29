import { ParetoChart } from '../../';

const SUPPORT_CASES = [
  { label: 'Login reset', value: 420 },
  { label: 'Billing error', value: 318 },
  { label: 'Delayed shipment', value: 247 },
  { label: 'Missing items', value: 186 },
  { label: 'Promo code', value: 132 },
  { label: 'Damaged product', value: 108 },
  { label: 'Account locked', value: 96 },
  { label: 'Wrong item', value: 74 },
  { label: 'Return label', value: 65 },
  { label: 'Subscription cancel', value: 52 },
];

export default function Demo() {
  return (
    <ParetoChart
      title="Support backlog concentration"
      subtitle="Top ten case drivers this quarter"
      width={760}
      height={440}
      data={SUPPORT_CASES}
      valueSeriesLabel="Cases"
      cumulativeSeriesLabel="Cumulative ticket share"
      yAxis={{ title: 'Case volume' }}
      yAxisRight={{ title: 'Cumulative share' }}
    />
  );
}
