import { RidgeChart } from '../../';

const DAYS = 180;

const createCohort = (base: number, amplitude: number, lift: number) =>
  Array.from({ length: DAYS }, (_, day) => {
    const seasonal = Math.sin(day / 12) * amplitude;
    const adoption = Math.max(0, Math.sin((day - 36) / 28)) * lift;
    const engagementCycle = Math.cos(day / 3.6) * amplitude * 0.18;
    const trend = (day / DAYS) * lift * 0.45;
    const value = base + seasonal + adoption + engagementCycle + trend;
    return Math.max(120, Math.round(value));
  });

const formatUsers = (value: number) => `${Math.round(value).toLocaleString()} users`;

const userDensityTooltip = ({ value, density, series }: any) => {
  const median = series?.stats?.median;
  const medianLabel = median != null ? ` • median ${Math.round(median).toLocaleString()} users` : '';
  return `${Math.round(value).toLocaleString()} users • density ${(density * 100).toFixed(1)}%${medianLabel}`;
};

const SERIES = [
  {
    id: 'core-product',
    name: 'Core product cohort',
    color: '#2563eb',
    values: createCohort(420, 48, 96),
    fillOpacity: 0.68,
    strokeWidth: 1.4,
    valueFormatter: formatUsers,
    tooltipFormatter: userDensityTooltip,
  },
  {
    id: 'collaboration-suite',
    name: 'Collaboration suite',
    color: '#0ea5e9',
    values: createCohort(360, 42, 78),
    fillOpacity: 0.68,
    strokeWidth: 1.4,
    valueFormatter: formatUsers,
    tooltipFormatter: userDensityTooltip,
  },
  {
    id: 'automation',
    name: 'Automation workflows',
    color: '#10b981',
    values: createCohort(260, 36, 64),
    fillOpacity: 0.68,
    strokeWidth: 1.4,
    valueFormatter: formatUsers,
    tooltipFormatter: userDensityTooltip,
  },
  {
    id: 'ai-features',
    name: 'AI assistant features',
    color: '#8b5cf6',
    values: createCohort(180, 34, 72),
    fillOpacity: 0.68,
    strokeWidth: 1.4,
    valueFormatter: formatUsers,
    tooltipFormatter: userDensityTooltip,
  },
  {
    id: 'mobile-experience',
    name: 'Mobile experience',
    color: '#f97316',
    values: createCohort(220, 32, 58),
    fillOpacity: 0.68,
    strokeWidth: 1.4,
    valueFormatter: formatUsers,
    tooltipFormatter: userDensityTooltip,
  },
];

const formatThousands = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export default function Demo() {
  return (
    <RidgeChart
      title="Daily active users across feature cohorts"
      subtitle="Distribution of session counts over the last six months"
      width={640}
      height={480}
      series={SERIES}
      samples={128}
      bandwidth={18}
      bandPadding={0.32}
      amplitudeScale={0.95}
      grid={{ show: true, color: '#e5e7eb', showMinor: false }}
      xAxis={{
        show: true,
        title: 'Daily active users',
        labelFormatter: (value) => formatThousands.format(Math.round(value as number)),
        tickLength: 6,
      }}
      yAxis={{
        show: true,
        tickLength: 6,
      }}
    />
  );
}
