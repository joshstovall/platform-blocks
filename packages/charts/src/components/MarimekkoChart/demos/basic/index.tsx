import { MarimekkoChart } from '../../';

const PIPELINE_COMPOSITION = [
  {
    label: 'Inbound',
    segments: [
      { label: 'North America', value: 52 },
      { label: 'EMEA', value: 34 },
      { label: 'APAC', value: 24 },
    ],
  },
  {
    label: 'Outbound',
    segments: [
      { label: 'North America', value: 44 },
      { label: 'EMEA', value: 28 },
      { label: 'APAC', value: 18 },
    ],
  },
  {
    label: 'Partnerships',
    segments: [
      { label: 'North America', value: 29 },
      { label: 'EMEA', value: 22 },
      { label: 'APAC', value: 15 },
    ],
  },
  {
    label: 'Expansion',
    segments: [
      { label: 'North America', value: 37 },
      { label: 'EMEA', value: 18 },
      { label: 'APAC', value: 12 },
    ],
  },
];

export default function Demo() {
  return (
    <MarimekkoChart
      title="Pipeline contribution by segment"
      subtitle="Quarter to date"
      width={760}
      height={440}
      data={PIPELINE_COMPOSITION}
      columnGap={16}
      legend={{ show: true, position: 'bottom' }}
      yAxis={{ title: 'Segment share (%)' }}
      grid={{ show: true, style: 'dotted', color: '#D7DCED' }}
      categoryLabelFormatter={(category) => category.label}
    />
  );
}
