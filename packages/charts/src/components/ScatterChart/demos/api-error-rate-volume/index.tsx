import { ScatterChart } from '../../';

const SERIES = [
  {
    id: 'core-apis',
    name: 'Core services',
    color: '#1E66F5',
    pointSize: 8,
    data: [
      { id: 'core-auth', x: 520, y: 2.9, label: 'Auth' },
      { id: 'core-catalog', x: 480, y: 2.6, label: 'Catalog' },
      { id: 'core-inventory', x: 410, y: 2.4, label: 'Inventory' },
      { id: 'core-profiles', x: 365, y: 2.1, label: 'Profiles' },
      { id: 'core-checkout', x: 445, y: 2.7, label: 'Checkout' },
    ],
  },
  {
    id: 'payment-apis',
    name: 'Payment services',
    color: '#F76707',
    pointSize: 8,
    data: [
      { id: 'pay-processing', x: 260, y: 4.1, label: 'Processor' },
      { id: 'pay-ledger', x: 195, y: 3.1, label: 'Ledger' },
      { id: 'pay-invoicing', x: 220, y: 3.6, label: 'Invoicing' },
      { id: 'pay-fx', x: 180, y: 3.4, label: 'FX gateway' },
      { id: 'pay-risk', x: 240, y: 3.9, label: 'Risk scoring' },
    ],
  },
  {
    id: 'edge-apis',
    name: 'Edge and experimental',
    color: '#15AABF',
    pointSize: 7,
    data: [
      { id: 'edge-recos', x: 120, y: 4.2, label: 'Recommendations' },
      { id: 'edge-search', x: 95, y: 4.5, label: 'Search beta' },
      { id: 'edge-proto', x: 70, y: 3.9, label: 'Prototype API' },
      { id: 'edge-labs', x: 55, y: 3.6, label: 'Labs checkout' },
      { id: 'edge-content', x: 82, y: 4, label: 'Content sync' },
    ],
  },
];

const QUADRANTS = {
  x: 180,
  y: 3.5,
  fills: {
    topLeft: 'rgba(255, 193, 7, 0.1)',
    topRight: 'rgba(255, 107, 107, 0.12)',
    bottomLeft: 'rgba(63, 142, 252, 0.08)',
    bottomRight: 'rgba(34, 197, 247, 0.08)',
  },
  fillOpacity: 1,
  lineColor: '#B0C4FE',
  lineWidth: 1,
  labels: {
    topLeft: 'High error - lower volume',
    topRight: 'Critical risk',
    bottomLeft: 'Monitor growth',
    bottomRight: 'Healthy scale',
  },
  labelColor: '#1F2933',
  labelFontSize: 11,
  labelOffset: 12,
};

const describeQuadrant = (x: number, y: number) => {
  const labels = QUADRANTS.labels;
  if (!labels) return null;
  const isRight = x >= QUADRANTS.x;
  const isTop = y >= QUADRANTS.y;

  if (isRight && isTop) return labels.topRight ?? null;
  if (!isRight && isTop) return labels.topLeft ?? null;
  if (isRight && !isTop) return labels.bottomRight ?? null;
  return labels.bottomLeft ?? null;
};

export default function Demo() {
  return (
    <ScatterChart
      title="API error rate vs. request volume"
      subtitle="Each point represents a service, sized by throughput"
      width={560}
      height={360}
      data={SERIES.flatMap((serie) => serie.data)}
      series={SERIES}
      quadrants={QUADRANTS}
      pointOpacity={0.9}
      enableCrosshair
      multiTooltip
      liveTooltip
      grid={{ show: true, color: '#E9ECEF' }}
      legend={{ show: true, position: 'bottom' }}
      xScaleType="log"
      xAxis={{
        show: true,
        title: 'Requests per minute (thousands)',
        labelFormatter: (value: number) => `${Math.round(value)}k`,
      }}
      yAxis={{
        show: true,
        title: 'Error rate (%)',
        labelFormatter: (value: number) => `${value.toFixed(1)}%`,
      }}
      tooltip={{
        show: true,
        backgroundColor: '#12263A',
        textColor: '#F4F6FB',
        formatter: (point) => {
          const quadrantNote = describeQuadrant(point.x, point.y);
          const lines = [
            point.label ?? 'Service',
            `Volume ${Math.round(point.x)}k rpm · Errors ${point.y.toFixed(1)}%`,
          ];
          if (quadrantNote) {
            lines.push(quadrantNote);
          }
          return lines.join('\n');
        },
      }}
    />
  );
}
