import { BubbleChart } from '../../';

type Initiative = {
  initiative: string;
  strategicValue: number;
  executionEffort: number;
  projectedRevenue: number;
  confidence: number;
  horizon: 'Now' | 'Next' | 'Later';
  owner: string;
  color: string;
};

const initiatives: Initiative[] = [
  { initiative: 'Unified onboarding flow', strategicValue: 9.4, executionEffort: 3.2, projectedRevenue: 8.8, confidence: 76, horizon: 'Now', owner: 'Growth', color: '#2563eb' },
  { initiative: 'Usage-based pricing', strategicValue: 8.6, executionEffort: 5.1, projectedRevenue: 9.7, confidence: 68, horizon: 'Next', owner: 'Monetization', color: '#0891b2' },
  { initiative: 'AI-driven support', strategicValue: 7.9, executionEffort: 6.3, projectedRevenue: 6.9, confidence: 64, horizon: 'Next', owner: 'Support Ops', color: '#10b981' },
  { initiative: 'Insights dashboard revamp', strategicValue: 7.1, executionEffort: 4.5, projectedRevenue: 5.6, confidence: 72, horizon: 'Now', owner: 'Product Intelligence', color: '#a855f7' },
  { initiative: 'Partner ecosystem API', strategicValue: 6.4, executionEffort: 7.8, projectedRevenue: 7.5, confidence: 54, horizon: 'Later', owner: 'Platform', color: '#f97316' },
  { initiative: 'In-app experimentation', strategicValue: 8.1, executionEffort: 3.9, projectedRevenue: 6.1, confidence: 82, horizon: 'Now', owner: 'Growth', color: '#64748b' },
  { initiative: 'Self-healing infrastructure', strategicValue: 9.1, executionEffort: 7.2, projectedRevenue: 5.4, confidence: 58, horizon: 'Later', owner: 'Core Engineering', color: '#ef4444' },
  { initiative: 'Community templates marketplace', strategicValue: 6.8, executionEffort: 4.4, projectedRevenue: 4.9, confidence: 71, horizon: 'Next', owner: 'Ecosystem', color: '#22d3ee' },
];

const formatMillions = (value: number) => `$${value.toFixed(1)}M`;

export default function Demo() {
  return (
    <BubbleChart
      title="Product Initiative Portfolio"
      subtitle="Strategic value vs execution effort — bubble scales with projected revenue"
      width={760}
      height={440}
      data={initiatives}
      dataKey={{
        x: 'executionEffort',
        y: 'strategicValue',
        z: 'projectedRevenue',
        label: 'initiative',
        color: 'color',
        id: 'initiative',
      }}
      grid={{ show: true, color: '#E2E8F0' }}
      xAxis={{
        title: 'Execution effort (1=low, 10=high)',
        labelFormatter: (value) => value.toFixed(1),
      }}
      yAxis={{
        title: 'Strategic value (1=low, 10=high)',
        labelFormatter: (value) => value.toFixed(1),
      }}
      valueFormatter={(value) => formatMillions(value)}
      tooltip={{
        formatter: ({ record, value }) => [
          `Projected revenue: ${formatMillions(value)}`,
          `Confidence: ${record.confidence}%`,
          `Owner: ${record.owner} • Horizon: ${record.horizon}`,
        ].join('\n'),
      }}
      range={[72, 1440]}
    />
  );
}
