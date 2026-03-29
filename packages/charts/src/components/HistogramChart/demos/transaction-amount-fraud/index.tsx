import { HistogramChart } from '../../';

const TRANSACTION_AMOUNTS = [
  120, 135, 142, 150, 155, 160, 162, 168, 170, 174,
  180, 184, 188, 192, 198, 205, 210, 218, 225, 230,
  240, 245, 250, 260, 270, 280, 295, 310, 330, 340,
  360, 380, 395, 410, 430, 455, 480, 500, 520, 540,
  560, 580, 600, 620, 640, 660, 690, 720, 750, 780,
  820, 860, 890, 930, 970, 1020, 1080, 1150, 1220, 1310,
];

const REVIEW_THRESHOLD = 750;

export default function Demo() {
  return (
    <HistogramChart
      title="Transaction amount distribution"
      subtitle="Identifying anomalous high-value purchases"
      width={560}
      height={320}
      data={TRANSACTION_AMOUNTS}
      bins={16}
      binMethod="fd"
      showDensity
      barColor="#F97316"
      barOpacity={0.76}
      densityColor="#0EA5E9"
      rangeHighlights={[
        { id: 'high-risk-window', start: 900, end: 1400, color: '#EF4444', opacity: 0.12 },
      ]}
      annotations={[
        {
          id: 'manual-review',
          shape: 'vertical-line',
          x: REVIEW_THRESHOLD,
          color: '#DC2626',
          label: 'Manual review starts',
        },
      ]}
      xAxis={{
        title: 'Transaction amount (USD)',
        labelFormatter: (value) => `$${value.toFixed(0)}`,
      }}
      yAxis={{
        title: 'Probability density',
        labelFormatter: (value) => value.toFixed(3),
      }}
      grid={{ show: true, color: '#FFECE5' }}
      tooltip={{
        show: true,
        formatter: (bin) => `${bin.count} orders between $${bin.start.toFixed(0)}–$${bin.end.toFixed(0)}`,
      }}
      valueFormatter={(count, bin) => `${count} orders · pdf ${bin.density.toFixed(3)}`}
    />
  );
}
