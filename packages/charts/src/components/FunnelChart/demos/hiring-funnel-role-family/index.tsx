import { FunnelChart } from '../../';

type HiringMeta = {
  medianDays?: number;
  topDeclineReason?: string;
};

const compact = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${value}`;
};

const EXTERNAL_CANDIDATES = [
  { label: 'Applied', value: 780, meta: { medianDays: 0 } as HiringMeta },
  { label: 'Screen', value: 420, meta: { medianDays: 3, topDeclineReason: 'Insufficient architecture depth' } as HiringMeta },
  { label: 'HM interview', value: 210, meta: { medianDays: 6, topDeclineReason: 'Product strategy alignment' } as HiringMeta },
  { label: 'Panel', value: 120, meta: { medianDays: 12, topDeclineReason: 'Leadership signal gaps' } as HiringMeta },
  { label: 'Offered', value: 48, meta: { medianDays: 18, topDeclineReason: 'Compensation delta' } as HiringMeta },
  { label: 'Accepted', value: 22, meta: { medianDays: 24 } as HiringMeta },
];

const INTERNAL_TRANSFERS = [
  { label: 'Applied', value: 220, meta: { medianDays: 0 } as HiringMeta },
  { label: 'Screen', value: 188, meta: { medianDays: 2, topDeclineReason: 'Role scope mismatch' } as HiringMeta },
  { label: 'HM interview', value: 150, meta: { medianDays: 5, topDeclineReason: 'Org fit feedback' } as HiringMeta },
  { label: 'Panel', value: 110, meta: { medianDays: 9, topDeclineReason: 'Leadership depth' } as HiringMeta },
  { label: 'Offered', value: 72, meta: { medianDays: 14, topDeclineReason: 'Comp band negotiations' } as HiringMeta },
  { label: 'Accepted', value: 44, meta: { medianDays: 18 } as HiringMeta },
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
      title="Hiring funnel — Staff engineer"
      subtitle="External candidates vs. internal transfers"
      width={620}
      height={480}
      series={HIRING_SERIES}
      layout={{
        shape: 'bar',
        gap: 10,
        align: 'center',
        showConversion: false,
        seriesMode: 'grouped',
        connectors: { show: false },
      }}
      valueFormatter={(value) => compact(value)}
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
