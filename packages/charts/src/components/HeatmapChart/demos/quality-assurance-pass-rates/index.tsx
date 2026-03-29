import { HeatmapChart } from '../../';

const SUITES = ['Authentication', 'Checkout', 'APIs', 'Mobile app', 'Reporting'];
const RELEASES = ['RC1', 'RC2', 'RC3', 'RC4'];
const PASS_RATES = [
  [92, 95, 97, 96],
  [88, 91, 93, 94],
  [94, 96, 98, 99],
  [85, 89, 92, 93],
  [90, 92, 95, 96],
];

export default function Demo() {
  return (
    <HeatmapChart
      title="QA pass rates by release"
      subtitle="Regression suites vs. release candidates"
      width={680}
      height={340}
      data={{ rows: SUITES, cols: RELEASES, values: PASS_RATES }}
      cellSize={{ width: 110, height: 48 }}
      gap={4}
      colorScale={{
        min: 80,
        max: 100,
        stops: [
          { value: 85, color: '#F87171' },
          { value: 92, color: '#FBBF24' },
          { value: 98, color: '#34D399' },
        ],
      }}
      valueFormatter={({ value }) => `${Math.round(value)}% pass`}
      showCellLabels
      xAxis={{ show: true, title: 'Release candidate' }}
      yAxis={{ show: true, title: 'Test suite' }}
      legend={{
        show: true,
        position: 'bottom',
        items: [
          { label: 'Below target (< 92%)', color: '#F87171' },
          { label: 'At risk (92-97%)', color: '#FBBF24' },
          { label: 'Meets target (> 97%)', color: '#34D399' },
        ],
      }}
      cellCornerRadius={5}
      hoverHighlight={{ rowOpacity: 0.14, columnOpacity: 0.12 }}
      tooltip={{ show: true, aggregate: false }}
    />
  );
}
