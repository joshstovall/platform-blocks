import { ScatterChart } from '../../';

const SERIES = [
  {
    id: 'paid-social',
    name: 'Paid social',
    color: '#4263EB',
    pointSize: 8,
    data: [
  { id: 'social-lifestyle', x: 90, y: 210, size: 9.4, label: 'Lifestyle creatives' },
  { id: 'social-product', x: 78, y: 188, size: 8.9, label: 'Product video' },
  { id: 'social-lookalike', x: 112, y: 265, size: 10.2, label: 'Lookalike expansion' },
  { id: 'social-remarketing', x: 68, y: 160, size: 8.4, label: 'Retargeting carousel' },
  { id: 'social-brand', x: 82, y: 195, size: 9.1, label: 'Brand storytelling' },
    ],
  },
  {
    id: 'paid-search',
    name: 'Paid search',
    color: '#0CA678',
    pointSize: 7.5,
    data: [
  { id: 'search-brand', x: 55, y: 148, size: 8.1, label: 'Brand keywords' },
  { id: 'search-competitor', x: 72, y: 168, size: 8.8, label: 'Competitor conquest' },
  { id: 'search-feature', x: 48, y: 118, size: 7.8, label: 'Feature launch' },
  { id: 'search-sku', x: 64, y: 152, size: 8.4, label: 'SKU breakout' },
  { id: 'search-automation', x: 60, y: 160, size: 8.2, label: 'Smart bidding' },
    ],
  },
  {
    id: 'display',
    name: 'Programmatic & display',
    color: '#FF922B',
    pointSize: 7.5,
    data: [
  { id: 'display-ctv', x: 95, y: 205, size: 9.6, label: 'CTV extension' },
  { id: 'display-contextual', x: 74, y: 165, size: 8.7, label: 'Contextual placements' },
  { id: 'display-retarget', x: 88, y: 198, size: 9.3, label: 'High-intent retarget' },
  { id: 'display-prospect', x: 82, y: 170, size: 8.9, label: 'Prospecting bundle' },
  { id: 'display-awareness', x: 90, y: 162, size: 9.2, label: 'Awareness push' },
    ],
  },
];

const QUADRANTS = {
  x: 80,
  y: 185,
  fills: {
    topLeft: 'rgba(12, 166, 120, 0.12)',
    topRight: 'rgba(66, 99, 235, 0.12)',
    bottomLeft: 'rgba(255, 163, 72, 0.08)',
    bottomRight: 'rgba(255, 107, 107, 0.12)',
  },
  fillOpacity: 1,
  lineColor: '#C0D6FF',
  lineWidth: 1,
  labels: {
    topLeft: 'High ROI champions',
    topRight: 'Scale candidates',
    bottomLeft: 'Creative tune-up',
    bottomRight: 'Pull back spend',
  },
  labelColor: '#1C1D21',
  labelFontSize: 11,
  labelOffset: 14,
};

const resolveAction = (x: number, y: number) => {
  const labels = QUADRANTS.labels;
  if (!labels) return null;
  const right = x >= QUADRANTS.x;
  const top = y >= QUADRANTS.y;

  if (!right && top) return labels.topLeft ?? null;
  if (right && top) return labels.topRight ?? null;
  if (!right && !top) return labels.bottomLeft ?? null;
  return labels.bottomRight ?? null;
};

export default function Demo() {
  return (
    <ScatterChart
      title="Campaign spend vs. attributed revenue"
      subtitle="Ad set performance, each marker sized by budget grouping"
      width={560}
      height={360}
      data={SERIES.flatMap((serie) => serie.data)}
      series={SERIES}
      quadrants={QUADRANTS}
      pointOpacity={0.86}
      showTrendline="per-series"
      enableCrosshair
      multiTooltip
      liveTooltip
      grid={{ show: true, color: '#EFF2FF' }}
      legend={{ show: true, position: 'bottom' }}
      xAxis={{
        show: true,
        title: 'Spend (USD thousands)',
        labelFormatter: (value: number) => `$${value}k`,
      }}
      yAxis={{
        show: true,
        title: 'Attributed revenue (USD thousands)',
        labelFormatter: (value: number) => `$${value}k`,
      }}
      tooltip={{
        show: true,
        backgroundColor: '#0B1220',
        textColor: '#F1F5F9',
        formatter: (point) => {
          const action = resolveAction(point.x, point.y);
          const lines = [
            point.label ?? 'Ad set',
            `Spend $${point.x}k · Revenue $${point.y}k`,
          ];
          if (action) {
            lines.push(action);
          }
          return lines.join('\n');
        },
      }}
    />
  );
}
