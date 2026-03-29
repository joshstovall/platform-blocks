import { BubbleChart } from '../../';

type Account = {
  account: string;
  healthScore: number;
  expansionPotential: number;
  arr: number;
  segment: 'Enterprise' | 'Mid-market' | 'Growth';
  csOwner: string;
  lastTouch: string;
  color: string;
};

const accounts: Account[] = [
  { account: 'Acme Robotics', healthScore: 86, expansionPotential: 78, arr: 1.82, segment: 'Enterprise', csOwner: 'L. Howard', lastTouch: '4 days', color: '#1d4ed8' },
  { account: 'Bluefin Media', healthScore: 63, expansionPotential: 72, arr: 0.96, segment: 'Mid-market', csOwner: 'A. Patel', lastTouch: '1 day', color: '#0ea5e9' },
  { account: 'Cloudburst Analytics', healthScore: 92, expansionPotential: 88, arr: 2.35, segment: 'Enterprise', csOwner: 'C. Roman', lastTouch: '2 days', color: '#10b981' },
  { account: 'Driftwell', healthScore: 57, expansionPotential: 41, arr: 0.54, segment: 'Growth', csOwner: 'B. Ortiz', lastTouch: '6 days', color: '#f97316' },
  { account: 'Element Labs', healthScore: 74, expansionPotential: 67, arr: 1.22, segment: 'Mid-market', csOwner: 'T. Nguyen', lastTouch: 'Today', color: '#6366f1' },
  { account: 'Fleetbase', healthScore: 48, expansionPotential: 83, arr: 0.81, segment: 'Growth', csOwner: 'D. Blake', lastTouch: '8 days', color: '#facc15' },
  { account: 'Horizon Capital', healthScore: 88, expansionPotential: 53, arr: 1.58, segment: 'Enterprise', csOwner: 'R. Chen', lastTouch: '3 days', color: '#ec4899' },
  { account: 'Northwind Freight', healthScore: 69, expansionPotential: 91, arr: 1.44, segment: 'Mid-market', csOwner: 'S. Kim', lastTouch: '5 days', color: '#14b8a6' },
];

const formatArr = (value: number) => `$${value.toFixed(2)}M ARR`;

export default function Demo() {
  return (
    <BubbleChart
      title="Customer Account Health vs Expansion"
      subtitle="Bubble size reflects current ARR; use upper-right quadrant to spot ready-to-expand logos"
      width={760}
      height={440}
      data={accounts}
      dataKey={{
        x: 'healthScore',
        y: 'expansionPotential',
        z: 'arr',
        label: 'account',
        color: 'color',
        id: 'account',
      }}
      xAxis={{
        title: 'Account health score',
        labelFormatter: (value) => `${Math.round(value)}`,
      }}
      yAxis={{
        title: 'Expansion potential score',
        labelFormatter: (value) => `${Math.round(value)}`,
      }}
      grid={{ show: true, color: '#E0E7FF' }}
      valueFormatter={(value) => formatArr(value)}
      tooltip={{
        formatter: ({ record, value }) => [
          formatArr(value),
          `Segment: ${record.segment} • CSM: ${record.csOwner}`,
          `Last touch: ${record.lastTouch}`,
        ].join('\n'),
      }}
      range={[96, 1728]}
    />
  );
}
