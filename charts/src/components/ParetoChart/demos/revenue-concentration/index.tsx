import { ParetoChart } from '../../';

const ACCOUNT_REVENUE = [
  { label: 'Acme Corp', value: 2_480_000 },
  { label: 'Brightside', value: 1_940_000 },
  { label: 'Northwind', value: 1_275_000 },
  { label: 'Globex', value: 968_000 },
  { label: 'Initech', value: 744_000 },
  { label: 'Soylent', value: 612_000 },
  { label: 'Umbra', value: 481_000 },
  { label: 'LumenPay', value: 378_000 },
  { label: 'Veridian', value: 326_000 },
  { label: 'Terranova', value: 294_000 },
  { label: 'Zephyr', value: 242_000 },
  { label: 'BlueSky', value: 205_000 },
];

export default function Demo() {
  return (
    <ParetoChart
      title="Annual revenue concentration"
      subtitle="Top enterprise accounts"
      width={780}
      height={460}
      data={ACCOUNT_REVENUE}
      valueSeriesLabel="ARR"
      cumulativeSeriesLabel="Cumulative revenue"
      barColor="#3B82F6"
      lineColor="#F97316"
      yAxis={{
        title: 'Recurring revenue',
        labelFormatter: (value) => `$${(value / 1_000_000).toFixed(1)}M`,
      }}
      yAxisRight={{
        title: 'Revenue share',
      }}
    />
  );
}
