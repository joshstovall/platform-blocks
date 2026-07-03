import { FunnelChart } from '../../';

type TrialMeta = {
  dropReason?: string;
};

const compact = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${value}`;
};

const TRIAL_CONVERSION = {
  id: 'trial-to-paid',
  name: 'Trial to paid conversion',
  steps: [
    { label: 'Sign-ups', value: 12800, color: '#1d4ed8' },
    { label: 'Onboarded', value: 9100, color: '#2563eb', meta: { dropReason: 'Setup friction and confusing success criteria' } as TrialMeta },
    { label: 'Week-1 active', value: 6200, color: '#3b82f6', meta: { dropReason: 'No team invites or connected data sources' } as TrialMeta },
    { label: 'Contracts', value: 2900, color: '#60a5fa', meta: { dropReason: 'Security review backlog and pricing clarity' } as TrialMeta },
    { label: 'Paid', value: 1850, color: '#93c5fd', meta: { dropReason: 'Budget timing & procurement approvals' } as TrialMeta },
  ],
};

export default function Demo() {
  return (
    <FunnelChart
      title="SaaS trial-to-paid conversion"
      subtitle="Retention from sign-up to paid"
      width={520}
      height={440}
      series={TRIAL_CONVERSION}
      layout={{
        shape: 'trapezoid',
        gap: 8,
        align: 'center',
        showConversion: false,
        connectors: { show: false },
      }}
      valueFormatter={(value) => compact(value)}
      legend={{ show: false }}
      tooltip={{
        show: true,
        formatter: (step) => {
          const index = TRIAL_CONVERSION.steps.findIndex((candidate) => candidate.label === step.label);
          const previous = index > 0 ? TRIAL_CONVERSION.steps[index - 1] : undefined;
          const dropValue = previous ? previous.value - step.value : 0;
          const dropRate = previous && previous.value > 0 ? (dropValue / previous.value) * 100 : 0;
          const reason = (step.meta as TrialMeta | undefined)?.dropReason;
          return [
            `${step.label}`,
            `${step.value.toLocaleString()} accounts`,
            previous ? `Drop: ${dropValue.toLocaleString()} (${dropRate.toFixed(1)}%)` : 'Starting cohort',
            reason ? `Top reason: ${reason}` : undefined,
          ]
            .filter(Boolean)
            .join('\n');
        },
      }}
    />
  );
}
