import { FunnelChart } from '../../';

type PipelineMeta = {
  note?: string;
};

const PIPELINE_QUALITY = {
  id: 'data-quality-pipeline',
  name: 'Data quality checkpoints',
  steps: [
    { label: 'Ingested records', value: 12_400_000, color: '#0f766e' },
    { label: 'Schema validated', value: 11_760_000, color: '#0d9488', meta: { note: 'Dropped malformed partner feeds and null timestamps' } as PipelineMeta },
    { label: 'Deduplicated', value: 11_180_000, color: '#14b8a6', meta: { note: 'UserId + sessionId key resolves campaign duplicates' } as PipelineMeta },
    { label: 'Quality checks passed', value: 10_260_000, color: '#2dd4bf', meta: { note: 'Primary blockers: stale reference data & threshold breaches' } as PipelineMeta },
    { label: 'Certified for dashboards', value: 9_940_000, color: '#5eead4', meta: { note: 'Ready for downstream activation' } as PipelineMeta },
  ],
};

export default function Demo() {
  return (
    <FunnelChart
      title="Data pipeline quality checks"
      subtitle="From ingestion to certified analytics datasets"
      width={660}
      height={500}
      series={PIPELINE_QUALITY}
      layout={{
        shape: 'trapezoid',
        gap: 16,
        align: 'right',
        minSegmentHeight: 60,
        showConversion: false,
      }}
      valueFormatter={(value, index, context) => {
        const step = PIPELINE_QUALITY.steps[index];
        const meta = step.meta as PipelineMeta | undefined;
        const lines: string[] = [`${value.toLocaleString()} rows`];
        if (context?.previousValue) {
          const dropRate = (context.dropRate * 100).toFixed(1);
          const drop = context.dropValue.toLocaleString();
          lines.push(`Filtered ${drop} rows (${dropRate}%)`);
        }
  lines.push(`Retention ${((context?.conversion ?? 1) * 100).toFixed(1)}% of ingest`);
        if (meta?.note) {
          lines.push(meta.note);
        }
        return lines;
      }}
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
