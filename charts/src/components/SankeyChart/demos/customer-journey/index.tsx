import { SankeyChart } from '../../';

const NODES = [
  { id: 'paid-social', name: 'Paid Social', color: '#60A5FA' },
  { id: 'organic-search', name: 'Organic Search', color: '#34D399' },
  { id: 'email', name: 'Email Nurture', color: '#FBBF24' },
  { id: 'events', name: 'Field Events', color: '#F472B6' },
  { id: 'signup', name: 'Sign Up', color: '#818CF8' },
  { id: 'trial', name: 'Trial Activation', color: '#A855F7' },
  { id: 'purchase', name: 'Purchase', color: '#10B981' },
  { id: 'churn', name: 'Churn', color: '#EF4444' },
  { id: 'retain', name: 'Retained', color: '#0EA5E9' },
];

const LINKS = [
  { source: 'paid-social', target: 'signup', value: 320 },
  { source: 'organic-search', target: 'signup', value: 420 },
  { source: 'email', target: 'signup', value: 180 },
  { source: 'events', target: 'signup', value: 140 },
  { source: 'signup', target: 'trial', value: 760 },
  { source: 'trial', target: 'purchase', value: 410 },
  { source: 'trial', target: 'churn', value: 350 },
  { source: 'purchase', target: 'retain', value: 290 },
  { source: 'purchase', target: 'churn', value: 120 },
];

export default function Demo() {
  return (
    <SankeyChart
      title="Customer journey flow"
      subtitle="Q3 acquisition to retention"
      width={720}
      height={420}
      nodes={NODES}
      links={LINKS}
    />
  );
}
