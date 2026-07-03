import { FunnelChart } from '../../';

type PipelineMeta = {
  note?: string;
};

const compact = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${value}`;
};

const PIPELINE_QUALITY = {
  id: 'data-quality-pipeline',
  name: 'Data quality checkpoints',
  steps: [
    { label: 'Ingested', value: 12_400_000, color: '#0f766e' },
    { label: 'Validated', value: 11_760_000, color: '#0d9488', meta: { note: 'Dropped malformed partner feeds and null timestamps' } as PipelineMeta },
    { label: 'Deduplicated', value: 11_180_000, color: '#14b8a6', meta: { note: 'UserId + sessionId key resolves campaign duplicates' } as PipelineMeta },
    { label: 'QA passed', value: 10_260_000, color: '#2dd4bf', meta: { note: 'Primary blockers: stale reference data & threshold breaches' } as PipelineMeta },
    { label: 'Certified', value: 9_940_000, color: '#5eead4', meta: { note: 'Ready for downstream activation' } as PipelineMeta },
  ],
};

export default function Demo() {
  return (
    <FunnelChart
      title="Data pipeline quality checks"
      subtitle="From ingestion to certified datasets"
      width={520}
      height={440}
      series={PIPELINE_QUALITY}
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
          const idx = PIPELINE_QUALITY.steps.findIndex((candidate) => candidate.label === step.label);
          const previous = idx > 0 ? PIPELINE_QUALITY.steps[idx - 1] : undefined;
          const dropValue = previous ? previous.value - step.value : 0;
          const dropRate = previous && previous.value > 0 ? (dropValue / previous.value) * 100 : 0;
          const meta = step.meta as PipelineMeta | undefined;
          return [
            step.label,
            `${step.value.toLocaleString()} rows`,
            previous ? `Filtered: ${dropValue.toLocaleString()} (${dropRate.toFixed(1)}%)` : 'Ingestion baseline',
            meta?.note,
          ]
            .filter(Boolean)
            .join('\n');
        },
      }}
    />
  );
}
