import { RidgeChart } from '../../';

const SAMPLE_POINTS = 140;

const createScoreProfile = (baseline: number, amplitude: number, lift: number) =>
  Array.from({ length: SAMPLE_POINTS }, (_, index) => {
    const seasonal = Math.sin(index / 9.5) * amplitude;
    const programLift = Math.max(0, Math.sin((index - 24) / 20)) * lift;
    const sentimentNoise = Math.cos(index / 3.4) * amplitude * 0.2;
    const value = baseline + seasonal + programLift + sentimentNoise;
    const clamped = Math.min(4.95, Math.max(1.05, value));
    return Number(clamped.toFixed(2));
  });

const formatScore = (value: number) => `${value.toFixed(1)} / 5`;

const satisfactionTooltip = ({ value, density, series }: any) => {
  const median = series?.stats?.median;
  const medianLabel = median != null ? ` • median ${formatScore(median)}` : '';
  return `${formatScore(value)} • density ${(density * 100).toFixed(1)}%${medianLabel}`;
};

const SERIES = [
  {
    id: 'product',
    name: 'Product management',
    color: '#2563eb',
    values: createScoreProfile(3.8, 0.32, 0.42),
    fillOpacity: 0.7,
    strokeWidth: 1.2,
    valueFormatter: formatScore,
    tooltipFormatter: satisfactionTooltip,
  },
  {
    id: 'platform',
    name: 'Platform engineering',
    color: '#7c3aed',
    values: createScoreProfile(4.1, 0.3, 0.36),
    fillOpacity: 0.7,
    strokeWidth: 1.2,
    valueFormatter: formatScore,
    tooltipFormatter: satisfactionTooltip,
  },
  {
    id: 'success',
    name: 'Customer success',
    color: '#f59e0b',
    values: createScoreProfile(3.6, 0.36, 0.48),
    fillOpacity: 0.7,
    strokeWidth: 1.2,
    valueFormatter: formatScore,
    tooltipFormatter: satisfactionTooltip,
  },
  {
    id: 'gtm',
    name: 'Go-to-market teams',
    color: '#ef4444',
    values: createScoreProfile(3.4, 0.4, 0.52),
    fillOpacity: 0.7,
    strokeWidth: 1.2,
    valueFormatter: formatScore,
    tooltipFormatter: satisfactionTooltip,
  },
];

export default function Demo() {
  return (
    <RidgeChart
      title="Employee satisfaction score distribution"
      subtitle="Quarterly pulse survey responses by team"
      width={620}
      height={420}
      series={SERIES}
      samples={110}
      bandwidth={0.35}
      bandPadding={0.3}
      amplitudeScale={0.85}
      grid={{ show: true, color: '#e5e7eb', showMinor: false }}
      xAxis={{
        show: true,
        title: 'Satisfaction score (1-5)',
        labelFormatter: (value) => (value as number).toFixed(1),
        tickLength: 6,
      }}
      yAxis={{
        show: true,
        tickLength: 6,
      }}
    />
  );
}
