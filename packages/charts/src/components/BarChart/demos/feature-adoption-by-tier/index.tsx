import { BarChart } from '../../';

const FEATURE_ADOPTION = [
  {
    id: 'enterprise',
    category: 'Enterprise',
    value: 1280,
    color: '#2563eb',
    data: { accounts: 1640, adoptionRate: 0.78 },
  },
  {
    id: 'midmarket',
    category: 'Mid-market',
    value: 930,
    color: '#0ea5e9',
    data: { accounts: 1310, adoptionRate: 0.71 },
  },
  {
    id: 'growth',
    category: 'Growth',
    value: 610,
    color: '#22c55e',
    data: { accounts: 980, adoptionRate: 0.62 },
  },
  {
    id: 'starter',
    category: 'Starter',
    value: 340,
    color: '#f97316',
    data: { accounts: 720, adoptionRate: 0.47 },
  },
];

const formatAccounts = (value: number) => `${value.toLocaleString()} accounts`;

export default function Demo() {
  return (
    <BarChart
      title="Feature adoption by customer tier"
      subtitle="Accounts live on the experimentation canvas within 45 days"
      width={680}
      height={400}
      data={FEATURE_ADOPTION}
      barSpacing={0.26}
      barBorderRadius={12}
      legend={{ show: false }}
      valueFormatter={(value, datum) => {
        const segmentTotal = datum.data?.accounts ?? value;
        const rate = datum.data?.adoptionRate ?? value / segmentTotal;
        const percentage = `${Math.round((rate ?? 0) * 100)}% adoption`;
        return `${formatAccounts(value)} (${percentage})`;
      }}
      valueLabel={{
        position: 'inside',
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
        formatter: (value) => value.toLocaleString(),
      }}
      yAxis={{
        show: true,
        title: 'Activated accounts',
        titleFontSize: 12,
        labelFormatter: (value) => value.toLocaleString(),
      }}
      xAxis={{ show: true }}
      grid={{ show: true, color: '#EFF6FF' }}
      tooltip={{
        formatter: (datum) => {
          const accounts = datum.data?.accounts ?? datum.value;
          const adoptionRate = datum.data?.adoptionRate ?? datum.value / accounts;
          return [
            datum.category,
            `Activated: ${formatAccounts(datum.value)}`,
            `Account base: ${accounts.toLocaleString()}`,
            `Adoption rate: ${(adoptionRate * 100).toFixed(1)}%`,
          ].join('\n');
        },
      }}
    />
  );
}
