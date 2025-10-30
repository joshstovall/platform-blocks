import { HistogramChart } from '../../';

const CONTRACT_LENGTHS = [
  6, 6, 6, 7, 8, 9, 9, 10, 10, 11,
  12, 12, 12, 12, 13, 14, 14, 15, 15, 16,
  17, 18, 18, 18, 18, 19, 20, 20, 21, 21,
  22, 24, 24, 24, 24, 25, 26, 26, 27, 28,
  30, 30, 30, 32, 32, 33, 34, 36, 36, 36,
  38, 40, 42, 45, 48,
];

const sortedLengths = [...CONTRACT_LENGTHS].sort((a, b) => a - b);
const median = sortedLengths[Math.floor(sortedLengths.length / 2)];

export default function Demo() {
  return (
    <HistogramChart
      title="Customer contract length distribution"
      subtitle="Used to calibrate retention and renewal strategy"
      width={540}
      height={320}
      data={CONTRACT_LENGTHS}
      bins={12}
      binMethod="sturges"
      density={false}
      showDensity={false}
      barColor="#4361EE"
      barOpacity={0.82}
      rangeHighlights={[{ id: 'core-subscription', start: 12, end: 24, color: '#22C55E', opacity: 0.14 }]}
      annotations={[
        {
          id: 'one-year',
          shape: 'vertical-line',
          x: 12,
          color: '#22C55E',
          label: '1 year',
        },
        {
          id: 'two-year',
          shape: 'vertical-line',
          x: 24,
          color: '#15803D',
          label: '2 years',
        },
        {
          id: 'median',
          shape: 'vertical-line',
          x: median,
          color: '#F97316',
          label: `Median ${median} mo`,
        },
      ]}
      xAxis={{
        title: 'Contract length (months)',
      }}
      yAxis={{
        title: 'Customer accounts',
        labelFormatter: (value) => `${value.toFixed(0)}`,
      }}
      grid={{ show: true, color: '#EEF2FF' }}
      tooltip={{
        show: true,
        formatter: (bin) => `${bin.count} accounts between ${bin.start.toFixed(0)}–${bin.end.toFixed(0)} months`,
      }}
      valueFormatter={(count) => `${count} customers`}
    />
  );
}
