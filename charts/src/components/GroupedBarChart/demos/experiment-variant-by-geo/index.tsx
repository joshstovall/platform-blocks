import { GroupedBarChart } from '../../';

const SERIES = [
  {
    id: 'control',
    name: 'Control',
    color: '#ADB5BD',
    data: [
      { id: 'na-control', category: 'North America', value: 4.8 },
      { id: 'emea-control', category: 'EMEA', value: 4.2 },
      { id: 'apac-control', category: 'APAC', value: 3.9 },
      { id: 'latam-control', category: 'LATAM', value: 3.6 },
    ],
  },
  {
    id: 'variant-a',
    name: 'Variant A',
    color: '#5C7CFA',
    data: [
      { id: 'na-var-a', category: 'North America', value: 5.6 },
      { id: 'emea-var-a', category: 'EMEA', value: 4.9 },
      { id: 'apac-var-a', category: 'APAC', value: 4.4 },
      { id: 'latam-var-a', category: 'LATAM', value: 4.1 },
    ],
  },
  {
    id: 'variant-b',
    name: 'Variant B',
    color: '#20C997',
    data: [
      { id: 'na-var-b', category: 'North America', value: 6.1 },
      { id: 'emea-var-b', category: 'EMEA', value: 5.3 },
      { id: 'apac-var-b', category: 'APAC', value: 4.8 },
      { id: 'latam-var-b', category: 'LATAM', value: 4.5 },
    ],
  },
];

export default function Demo() {
  return (
    <GroupedBarChart
      title="Experiment conversion uplift by region"
      subtitle="Completed purchases per 100 sessions"
      width={580}
      height={340}
      series={SERIES}
      barSpacing={0.22}
      innerBarSpacing={0.18}
      xAxis={{
        show: true,
        title: 'Region',
      }}
      yAxis={{
        show: true,
        title: 'Conversion rate (%)',
        labelFormatter: (value) => `${value.toFixed(1)}%`,
        ticks: [3, 4, 5, 6],
      }}
      grid={{ show: true, color: '#EEF2FF' }}
      legend={{ show: true, position: 'bottom' }}
      multiTooltip
      liveTooltip
      valueLabels={{
        show: true,
        position: 'outside',
        formatter: ({ value }) => `${value.toFixed(1)}%`,
        color: '#1F1F24',
        fontWeight: '600',
        offset: 8,
      }}
      animation={{ duration: 420 }}
    />
  );
}
