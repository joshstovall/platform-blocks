import { GroupedBarChart } from '../../';

const SERIES = [
  {
    id: 'new-business',
    name: 'New business',
    color: '#4C6EF5',
    data: [
      { id: 'tech-new', category: 'Technology', value: 5.8 },
      { id: 'health-new', category: 'Healthcare', value: 4.1 },
      { id: 'finance-new', category: 'Financial services', value: 4.7 },
      { id: 'retail-new', category: 'Retail', value: 3.9 },
      { id: 'manufacturing-new', category: 'Manufacturing', value: 3.1 },
    ],
  },
  {
    id: 'expansion',
    name: 'Upsell / expansion',
    color: '#20C997',
    data: [
      { id: 'tech-expansion', category: 'Technology', value: 4.6 },
      { id: 'health-expansion', category: 'Healthcare', value: 3.4 },
      { id: 'finance-expansion', category: 'Financial services', value: 5.2 },
      { id: 'retail-expansion', category: 'Retail', value: 2.7 },
      { id: 'manufacturing-expansion', category: 'Manufacturing', value: 2.2 },
    ],
  },
];

export default function Demo() {
  return (
    <GroupedBarChart
      title="Sales pipeline by industry"
      subtitle="Qualified pipeline this quarter (USD millions)"
      width={620}
      height={360}
      series={SERIES}
      barSpacing={0.2}
      innerBarSpacing={0.22}
      xAxis={{
        show: true,
        title: 'Industry vertical',
      }}
      yAxis={{
        show: true,
        title: 'Pipeline value (USD millions)',
        labelFormatter: (value) => `$${value.toFixed(1)}M`,
        ticks: [0, 2, 4, 6],
      }}
      grid={{ show: true, color: '#EDF2FF' }}
      legend={{ show: true, position: 'bottom' }}
      valueLabels={{
        show: true,
        position: 'outside',
        formatter: ({ value }) => `$${value.toFixed(1)}M`,
        color: '#2F2F35',
        fontWeight: '600',
        offset: 10,
      }}
      animation={{ duration: 440 }}
    />
  );
}
