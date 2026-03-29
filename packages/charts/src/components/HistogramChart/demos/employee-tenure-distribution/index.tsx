import { HistogramChart } from '../../';

const TENURE_YEARS = [
  0.3, 0.5, 0.7, 0.8, 1.1, 1.3, 1.5, 1.8, 2.1, 2.3,
  2.8, 3.0, 3.2, 3.5, 3.8, 4.1, 4.4, 4.7, 5.0, 5.3,
  5.7, 6.0, 6.3, 6.8, 7.1, 7.4, 7.8, 8.2, 8.6, 9.0,
  9.5, 10.0, 10.5, 11.0, 11.6, 12.2, 12.8, 13.4, 14.0, 14.7,
];

const medianTenure = (() => {
  const sorted = [...TENURE_YEARS].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
})();

export default function Demo() {
  return (
    <HistogramChart
      title="Employee tenure distribution"
      subtitle="Helps spot retention risks and succession depth"
      width={540}
      height={320}
      data={TENURE_YEARS}
      bins={12}
      binMethod="sqrt"
      showDensity
      densityThickness={2.5}
      barColor="#818CF8"
      densityColor="#22C55E"
      barOpacity={0.8}
      rangeHighlights={[
        { id: 'new-hires', start: 0, end: 1.5, color: '#FACC15', opacity: 0.18 },
        { id: 'veterans', start: 8, end: 15, color: '#22C55E', opacity: 0.12 },
      ]}
      annotations={[
        {
          id: 'median-tenure',
          shape: 'vertical-line',
          x: Number(medianTenure.toFixed(2)),
          color: '#F97316',
          label: `Median ${medianTenure.toFixed(1)} yrs`,
        },
      ]}
      xAxis={{
        title: 'Tenure (years)',
        labelFormatter: (value) => `${value.toFixed(1)} yrs`,
      }}
      yAxis={{
        title: 'Probability density',
        labelFormatter: (value) => value.toFixed(2),
      }}
      grid={{ show: true, color: '#EEF2FF' }}
      tooltip={{
        show: true,
        formatter: (bin) => `${bin.count} teammates between ${bin.start.toFixed(1)}–${bin.end.toFixed(1)} years`,
      }}
      valueFormatter={(count, bin) => `${count} people · pdf ${bin.density.toFixed(3)}`}
    />
  );
}
