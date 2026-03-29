import { RidgeChart } from '../../';

const SAMPLE_POINTS = 180;

const createRevenueProfile = (base: number, amplitude: number, tail: number) =>
  Array.from({ length: SAMPLE_POINTS }, (_, index) => {
    const seasonal = Math.sin(index / 9) * amplitude;
    const promotional = Math.max(0, Math.sin((index - 24) / 18)) * tail;
    const variability = Math.cos(index / 4.8) * amplitude * 0.22;
    const enterpriseTail = Math.pow(Math.sin((index + 18) / 48), 4) * tail * 1.4;
    const value = base + seasonal + promotional + variability + enterpriseTail;
    return Number(Math.max(12, value).toFixed(2));
  });

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currencyFormatter.format(Math.max(0, Math.round(value)));

const revenueTooltip = ({ value, density, series }: any) => {
  const p90 = series?.stats?.p90;
  const p90Label = p90 != null ? ` • p90 ${formatCurrency(p90)}` : '';
  return `${formatCurrency(value)} • density ${(density * 100).toFixed(1)}%${p90Label}`;
};

const SERIES = [
  {
    id: 'starter',
    name: 'Starter tier',
    color: '#2563eb',
    values: createRevenueProfile(45, 24, 62),
    fillOpacity: 0.62,
    strokeWidth: 1.3,
    valueFormatter: formatCurrency,
    tooltipFormatter: revenueTooltip,
  },
  {
    id: 'growth',
    name: 'Growth tier',
    color: '#22c55e',
    values: createRevenueProfile(68, 32, 74),
    fillOpacity: 0.62,
    strokeWidth: 1.3,
    valueFormatter: formatCurrency,
    tooltipFormatter: revenueTooltip,
  },
  {
    id: 'enterprise',
    name: 'Enterprise contracts',
    color: '#8b5cf6',
    values: createRevenueProfile(110, 42, 96),
    fillOpacity: 0.62,
    strokeWidth: 1.3,
    valueFormatter: formatCurrency,
    tooltipFormatter: revenueTooltip,
  },
  {
    id: 'add-ons',
    name: 'Usage add-ons',
    color: '#f97316',
    values: createRevenueProfile(32, 20, 48),
    fillOpacity: 0.62,
    strokeWidth: 1.3,
    valueFormatter: formatCurrency,
    tooltipFormatter: revenueTooltip,
  },
];

export default function Demo() {
  return (
    <RidgeChart
      title="Revenue per transaction by product line"
      subtitle="Transaction value distributions across seasonal cycles"
      width={640}
      height={440}
      series={SERIES}
      samples={128}
      bandwidth={14}
      bandPadding={0.28}
      amplitudeScale={0.9}
      grid={{ show: true, color: '#e5e7eb', showMinor: false }}
      xAxis={{
        show: true,
        title: 'Revenue per transaction',
        labelFormatter: (value) => currencyFormatter.format(value as number),
      }}
      yAxis={{
        show: true,
        tickLength: 6,
      }}
    />
  );
}
