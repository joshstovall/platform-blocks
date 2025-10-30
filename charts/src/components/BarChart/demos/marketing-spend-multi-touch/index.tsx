import { BarChart } from '../../';

const CAMPAIGN_SPEND = [
  {
    id: 'paid-search',
    category: 'Paid search',
    value: 820,
    color: '#0891b2',
    data: { objective: 'Capture late-stage demand' },
  },
  {
    id: 'paid-social',
    category: 'Paid social',
    value: 540,
    color: '#6366f1',
    data: { objective: 'Net new persona awareness' },
  },
  {
    id: 'field-events',
    category: 'Field events',
    value: 460,
    color: '#f97316',
    data: { objective: 'Pipeline acceleration' },
  },
  {
    id: 'webinars',
    category: 'Webinars & workshops',
    value: 380,
    color: '#22c55e',
    data: { objective: 'Activation & nurture' },
  },
  {
    id: 'content',
    category: 'Content syndication',
    value: 295,
    color: '#a855f7',
    data: { objective: 'Top-of-funnel scale' },
  },
  {
    id: 'partners',
    category: 'Partner marketing',
    value: 260,
    color: '#f43f5e',
    data: { objective: 'Co-sell influence' },
  },
];

const TOTAL_SPEND = CAMPAIGN_SPEND.reduce((sum, item) => sum + item.value, 0);

const formatSpend = (value: number) => `$${value.toLocaleString()}k`;

export default function Demo() {
  return (
    <BarChart
      title="Marketing spend by channel"
      subtitle="Multi-touch journey campaign mix"
      width={720}
      height={420}
      data={CAMPAIGN_SPEND}
      barSpacing={0.28}
      legend={{ show: false }}
      valueFormatter={(value) => `${formatSpend(value)} invested`}
      valueLabel={{
        color: '#1f2937',
        fontSize: 12,
        offset: 12,
        formatter: (value) => {
          const share = TOTAL_SPEND ? (value / TOTAL_SPEND) * 100 : 0;
          return `${share.toFixed(1)}% of spend`;
        },
      }}
      yAxis={{
        show: true,
        title: 'Investment (USD thousands)',
        titleFontSize: 12,
        labelFormatter: (value) => `$${value.toFixed(0)}k`,
      }}
      xAxis={{ show: true }}
      grid={{ show: true, color: '#E8F1FF' }}
      tooltip={{
        formatter: (datum) => {
          const share = TOTAL_SPEND ? (datum.value / TOTAL_SPEND) * 100 : 0;
          return [
            datum.category,
            `Spend: ${formatSpend(datum.value)}`,
            `Share: ${share.toFixed(1)}% of program`,
            datum.data?.objective ? `Objective: ${datum.data.objective}` : undefined,
          ]
            .filter(Boolean)
            .join('\n');
        },
      }}
    />
  );
}
