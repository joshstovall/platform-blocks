import { FunnelChart } from '../../';

type IncidentMeta = {
  medianDuration?: string;
  automationWin?: string;
};

const INCIDENT_RESPONSE = {
  id: 'incident-response',
  name: 'Incident response workflow',
  steps: [
    { label: 'Detection', value: 264, color: '#991b1b', meta: { medianDuration: '4 min to detect' } as IncidentMeta },
    { label: 'Triage', value: 228, color: '#b91c1c', meta: { medianDuration: '16 min to triage', automationWin: 'Pager triage rules auto-close 32 low-signal alerts' } as IncidentMeta },
    { label: 'Containment', value: 182, color: '#dc2626', meta: { medianDuration: '38 min to contain', automationWin: 'Runbooks auto-isolate hosts for 41% of cases' } as IncidentMeta },
    { label: 'Eradication', value: 164, color: '#ef4444', meta: { medianDuration: '1.4 hr to resolve root cause' } as IncidentMeta },
    { label: 'Recovery', value: 158, color: '#f87171', meta: { medianDuration: '2.3 hr to restore services' } as IncidentMeta },
    { label: 'Post-incident review', value: 151, color: '#fca5a5', meta: { medianDuration: 'Completed within 48 hr SLA' } as IncidentMeta },
  ],
};

export default function Demo() {
  return (
    <FunnelChart
      title="Incident response workflow"
      subtitle="Volume flowing through each stage with time-to-complete context"
      width={640}
      height={520}
      series={INCIDENT_RESPONSE}
      layout={{
        shape: 'trapezoid',
        gap: 14,
        align: 'center',
        minSegmentHeight: 58,
        showConversion: false,
      }}
      valueFormatter={(value, index, context) => {
        const step = INCIDENT_RESPONSE.steps[index];
        const meta = step.meta as IncidentMeta | undefined;
        const lines: string[] = [`${value.toLocaleString()} incidents`];
        if (meta?.medianDuration) {
          lines.push(meta.medianDuration);
        }
        if (context?.previousValue) {
          const dropPct = (context.dropRate * 100).toFixed(1);
          lines.push(`Progressed: ${(context.conversion * 100).toFixed(1)}% overall`);
          lines.push(`Drop since prior: ${context.dropValue.toLocaleString()} (${dropPct}%)`);
        }
        if (meta?.automationWin && context?.previousValue) {
          lines.push(`Automation impact: ${meta.automationWin}`);
        }
        return lines;
      }}
      legend={{ show: false }}
      tooltip={{
        show: true,
        formatter: (step) => {
          const idx = INCIDENT_RESPONSE.steps.findIndex((candidate) => candidate.label === step.label);
          const previous = idx > 0 ? INCIDENT_RESPONSE.steps[idx - 1] : undefined;
          const dropValue = previous ? previous.value - step.value : 0;
          const dropRate = previous && previous.value > 0 ? (dropValue / previous.value) * 100 : 0;
          const meta = step.meta as IncidentMeta | undefined;
          return [
            `${step.label}`,
            `${step.value.toLocaleString()} incidents`,
            meta?.medianDuration,
            previous ? `Drop since prior: ${dropValue.toLocaleString()} (${dropRate.toFixed(1)}%)` : 'Start of workflow',
            meta?.automationWin ? `Automation impact: ${meta.automationWin}` : undefined,
          ]
            .filter(Boolean)
            .join('\n');
        },
      }}
    />
  );
}
