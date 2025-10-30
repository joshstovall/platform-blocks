import { BarChart } from '../../';

const SLA_COMPLIANCE = [
  {
    id: 'enterprise',
    category: 'Enterprise support',
    value: 97.6,
    color: '#16a34a',
    data: { lastQuarter: 96.8 },
  },
  {
    id: 'commercial',
    category: 'Commercial support',
    value: 94.8,
    color: '#f59e0b',
    data: { lastQuarter: 92.4 },
  },
  {
    id: 'success',
    category: 'Customer success',
    value: 96.2,
    color: '#22c55e',
    data: { lastQuarter: 95.1 },
  },
  {
    id: 'platform',
    category: 'Platform incidents',
    value: 91.5,
    color: '#ef4444',
    data: { lastQuarter: 89.7 },
  },
];

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export default function Demo() {
  return (
    <BarChart
      title="SLA compliance by response team"
      subtitle="Rolling 12-month attainment"
      width={680}
      height={420}
      orientation="horizontal"
      data={SLA_COMPLIANCE}
      barSpacing={0.3}
      legend={{ show: false }}
      valueFormatter={(value) => `${formatPercent(value)} SLA met`}
      valueLabel={{
        color: '#111827',
        fontSize: 12,
        offset: 12,
        formatter: (value) => formatPercent(value),
      }}
      xAxis={{
        title: 'Tickets meeting SLA target',
        labelFormatter: (value) => `${Math.round(value)}%`,
      }}
      yAxis={{ show: true }}
      grid={{ show: true, color: '#E4E4F7' }}
      tooltip={{
        formatter: (datum) => {
          const last = datum.data?.lastQuarter ?? datum.value;
          const delta = datum.value - last;
          const direction = delta >= 0 ? '+' : '-';
          return [
            datum.category,
            `Current: ${formatPercent(datum.value)}`,
            `Last quarter: ${formatPercent(last)}`,
            `Change: ${direction}${Math.abs(delta).toFixed(1)} pts`,
          ].join('\n');
        },
      }}
    />
  );
}
