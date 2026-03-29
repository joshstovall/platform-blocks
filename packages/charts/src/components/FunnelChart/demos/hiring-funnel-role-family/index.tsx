import { FunnelChart } from '../../';

type HiringMeta = {
  medianDays?: number;
  topDeclineReason?: string;
};

const EXTERNAL_CANDIDATES = [
  { label: 'Applications received', value: 780, meta: { medianDays: 0 } as HiringMeta, trendDelta: 0.05 },
  { label: 'Recruiter screen', value: 420, meta: { medianDays: 3, topDeclineReason: 'Insufficient architecture depth' } as HiringMeta, trendDelta: 0.03 },
  { label: 'Hiring manager interview', value: 210, meta: { medianDays: 6, topDeclineReason: 'Product strategy alignment' } as HiringMeta, trendDelta: -0.02 },
  { label: 'Panel interview', value: 120, meta: { medianDays: 12, topDeclineReason: 'Leadership signal gaps' } as HiringMeta, trendDelta: -0.04 },
  { label: 'Offers extended', value: 48, meta: { medianDays: 18, topDeclineReason: 'Compensation delta' } as HiringMeta, trendDelta: 0.01 },
  { label: 'Offers accepted', value: 22, meta: { medianDays: 24 } as HiringMeta, trendDelta: 0.02 },
];

const INTERNAL_TRANSFERS = [
  { label: 'Applications received', value: 220, meta: { medianDays: 0 } as HiringMeta, trendDelta: 0.08 },
  { label: 'Recruiter screen', value: 188, meta: { medianDays: 2, topDeclineReason: 'Role scope mismatch' } as HiringMeta, trendDelta: 0.06 },
  { label: 'Hiring manager interview', value: 150, meta: { medianDays: 5, topDeclineReason: 'Org fit feedback' } as HiringMeta, trendDelta: 0.02 },
  { label: 'Panel interview', value: 110, meta: { medianDays: 9, topDeclineReason: 'Leadership depth' } as HiringMeta, trendDelta: 0.01 },
  { label: 'Offers extended', value: 72, meta: { medianDays: 14, topDeclineReason: 'Comp band negotiations' } as HiringMeta, trendDelta: 0.03 },
  { label: 'Offers accepted', value: 44, meta: { medianDays: 18 } as HiringMeta, trendDelta: 0.05 },
];

const HIRING_SERIES = [
  {
    id: 'external-candidates',
    name: 'External candidates',
    color: '#2563eb',
    steps: EXTERNAL_CANDIDATES,
  },
  {
    id: 'internal-transfers',
    name: 'Internal transfers',
    color: '#0ea5e9',
    steps: INTERNAL_TRANSFERS,
  },
];

const STEP_LOOKUP = new Map<any, { series: (typeof HIRING_SERIES)[number]; seriesIndex: number; stepIndex: number }>();
HIRING_SERIES.forEach((series, seriesIndex) => {
  series.steps.forEach((step, stepIndex) => {
    STEP_LOOKUP.set(step, { series, seriesIndex, stepIndex });
  });
});

const findSeriesContext = (step: unknown) => STEP_LOOKUP.get(step as any) ?? null;

export default function Demo() {
  return (
    <FunnelChart
      title="Hiring funnel — Staff engineer role family"
      subtitle="Comparing external candidates vs. internal transfers with stage speed and drop reasons"
      width={720}
      height={560}
      series={HIRING_SERIES}
      layout={{
        shape: 'bar',
        gap: 18,
        align: 'center',
        minSegmentHeight: 56,
        showConversion: false,
        seriesMode: 'grouped',
        connectors: { show: true, labelOffset: 8 },
      }}
      valueFormatter={(value, _index, context) => {
        const stage = context?.step;
        const lookup = stage ? findSeriesContext(stage) : null;
        const meta = stage?.meta as HiringMeta | undefined;
        const lines: string[] = [`${value.toLocaleString()} candidates`];

        if (context?.previousValue) {
          lines.push(`Drop ${context.dropValue.toLocaleString()} (${(context.dropRate * 100).toFixed(1)}%)`);
        } else {
          lines.push('Pipeline intake');
        }

        if (meta?.medianDays != null) {
          lines.push(`Median time: ${meta.medianDays} days`);
        }
        if (meta?.topDeclineReason && context?.previousValue) {
          lines.push(`Top decline: ${meta.topDeclineReason}`);
        }
        if (lookup) {
          lines.push(`${lookup.series.name}`);
        }
        return lines;
      }}
      tooltip={{
        show: true,
        formatter: (step) => {
          const lookup = findSeriesContext(step as any) ?? undefined;
          if (!lookup) {
            return `${step.label}: ${step.value.toLocaleString()} candidates`;
          }
          const series = lookup.series;
          const stepIndex = lookup.stepIndex;
          const previous = stepIndex > 0 ? series.steps[stepIndex - 1] : undefined;
          const dropValue = previous ? previous.value - step.value : 0;
          const dropRate = previous && previous.value > 0 ? (dropValue / previous.value) * 100 : 0;
          const meta = step.meta as HiringMeta | undefined;
          return [
            `${step.label} • ${series.name}`,
            `${step.value.toLocaleString()} candidates`,
            previous ? `Drop: ${dropValue.toLocaleString()} (${dropRate.toFixed(1)}%)` : 'Pipeline intake',
            meta?.medianDays != null ? `Median time in stage: ${meta.medianDays} days` : undefined,
            meta?.topDeclineReason ? `Top decline reason: ${meta.topDeclineReason}` : undefined,
          ]
            .filter(Boolean)
            .join('\n');
        },
      }}
    />
  );
}
