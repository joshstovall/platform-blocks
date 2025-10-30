import { FunnelChart } from '../../';

type TrialMeta = {
  dropReason?: string;
};

const TRIAL_CONVERSION = {
  id: 'trial-to-paid',
  name: 'Trial to paid conversion',
  steps: [
    { label: 'Trial sign-ups', value: 12800, color: '#1d4ed8', trendDelta: 0.04 },
    { label: 'Onboarding completed', value: 9100, color: '#2563eb', meta: { dropReason: 'Setup friction and confusing success criteria' } as TrialMeta, trendDelta: 0.06 },
    { label: 'Week 1 active teams', value: 6200, color: '#3b82f6', meta: { dropReason: 'No team invites or connected data sources' } as TrialMeta, trendDelta: -0.03 },
    { label: 'Contracts created', value: 2900, color: '#60a5fa', meta: { dropReason: 'Security review backlog and pricing clarity' } as TrialMeta, trendDelta: 0.01 },
    { label: 'Paid conversions', value: 1850, color: '#93c5fd', meta: { dropReason: 'Budget timing & procurement approvals' } as TrialMeta, trendDelta: 0.05 },
  ],
};

export default function Demo() {
  return (
    <FunnelChart
      title="SaaS trial-to-paid conversion"
      subtitle="Retention view with the leading drop reason surfaced per stage"
      width={640}
      height={520}
      series={TRIAL_CONVERSION}
      layout={{
        shape: 'trapezoid',
        gap: 14,
        align: 'left',
        minSegmentHeight: 68,
        showConversion: false,
        connectors: { show: true, labelOffset: 6 },
      }}
      valueFormatter={(value, index, context) => {
        const step = TRIAL_CONVERSION.steps[index];
        const lines: string[] = [`${value.toLocaleString()} accounts`];
        if (context?.previousValue) {
          const dropRate = context.dropRate * 100;
          const dropCaption = `${context.dropValue.toLocaleString()} dropped (${dropRate.toFixed(1)}%)`;
          lines.push(dropCaption);
        } else {
          lines.push('Starting cohort');
        }
        const reason = (step.meta as TrialMeta | undefined)?.dropReason;
        if (reason && context?.previousValue) {
          lines.push(`Top reason: ${reason}`);
        }
        if (step.trendDelta != null) {
          const arrow = step.trendDelta > 0 ? '▲' : step.trendDelta < 0 ? '▼' : '◆';
          lines.push(`Trend ${arrow} ${(Math.abs(step.trendDelta) * 100).toFixed(1)}% vs. prior cohort`);
        }
        if (context) {
          lines.push(`Retention ${(context.conversion * 100).toFixed(1)}% of sign-ups`);
        }
        return lines;
      }}
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
