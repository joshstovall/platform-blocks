import { BarChart } from '../../';

const RECRUITING_PROGRESS = [
  {
    id: 'engineering',
    category: 'Engineering',
    value: 48,
    color: '#4f46e5',
    data: { previous: 42, openRoles: 6, priority: 'Backend & AI platform' },
  },
  {
    id: 'product',
    category: 'Product',
    value: 21,
    color: '#0ea5e9',
    data: { previous: 18, openRoles: 3, priority: 'Activation journeys' },
  },
  {
    id: 'sales',
    category: 'Revenue',
    value: 27,
    color: '#22c55e',
    data: { previous: 24, openRoles: 4, priority: 'Enterprise AEs' },
  },
  {
    id: 'success',
    category: 'Customer Success',
    value: 19,
    color: '#f59e0b',
    data: { previous: 16, openRoles: 2, priority: 'Strategic segments' },
  },
  {
    id: 'support',
    category: 'Support',
    value: 15,
    color: '#ec4899',
    data: { previous: 14, openRoles: 2, priority: 'Follow-the-sun coverage' },
  },
];

const formatDelta = (value: number, datum: (typeof RECRUITING_PROGRESS)[number]) => {
  const previous = datum.data?.previous ?? 0;
  const delta = value - previous;
  if (delta === 0) return 'No change vs last cycle';
  const sign = delta > 0 ? '+' : '-';
  return `${sign}${Math.abs(delta)} vs last cycle`;
};

export default function Demo() {
  return (
    <BarChart
      title="New hires secured this recruiting cycle"
      subtitle="Compared with winter intake"
      width={720}
      height={440}
      orientation="horizontal"
      data={RECRUITING_PROGRESS}
      barSpacing={0.25}
      legend={{ show: false }}
      valueFormatter={(value) => `${value} hires`}
      valueLabel={{
        formatter: (value, datum) => formatDelta(value, datum as (typeof RECRUITING_PROGRESS)[number]),
        color: '#1f2937',
        fontSize: 12,
        offset: 10,
      }}
      xAxis={{
        title: 'Hires confirmed',
        labelFormatter: (value) => `${Math.round(value)}`,
      }}
      yAxis={{ show: true }}
      grid={{ show: true, color: '#E5E7EB' }}
      tooltip={{
        formatter: (datum) => {
          const previous = datum.data?.previous ?? 0;
          const delta = datum.value - previous;
          const direction = delta >= 0 ? '+' : '-';
          return [
            `${datum.category}`,
            `This cycle: ${datum.value} hires`,
            `Last cycle: ${previous} hires`,
            `Delta: ${direction}${Math.abs(delta)}`,
            datum.data?.priority ? `Focus: ${datum.data.priority}` : undefined,
            datum.data?.openRoles != null ? `Open roles: ${datum.data.openRoles}` : undefined,
          ]
            .filter(Boolean)
            .join('\n');
        },
      }}
    />
  );
}
