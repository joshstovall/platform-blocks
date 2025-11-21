import { MarimekkoChart } from '../../';

const REGIONAL_REVENUE = [
  {
    label: 'North America',
    segments: [
      { label: 'New business', value: 186 },
      { label: 'Expansion', value: 142 },
      { label: 'Renewal', value: 128 },
      { label: 'Services', value: 94 },
    ],
  },
  {
    label: 'EMEA',
    segments: [
      { label: 'New business', value: 132 },
      { label: 'Expansion', value: 98 },
      { label: 'Renewal', value: 87 },
      { label: 'Services', value: 76 },
    ],
  },
  {
    label: 'APAC',
    segments: [
      { label: 'New business', value: 94 },
      { label: 'Expansion', value: 72 },
      { label: 'Renewal', value: 65 },
      { label: 'Services', value: 48 },
    ],
  },
  {
    label: 'LATAM',
    segments: [
      { label: 'New business', value: 46 },
      { label: 'Expansion', value: 34 },
      { label: 'Renewal', value: 28 },
      { label: 'Services', value: 22 },
    ],
  },
];

export default function Demo() {
  return (
    <MarimekkoChart
      title="Revenue mix by region"
      subtitle="Trailing twelve months"
      width={760}
      height={440}
      data={REGIONAL_REVENUE}
      columnGap={20}
      legend={{ show: true, position: 'bottom', align: 'start' }}
      grid={{ show: true, style: 'dotted', color: '#E1E6F9' }}
      yAxis={{ title: 'Share within region (%)' }}
    />
  );
}
