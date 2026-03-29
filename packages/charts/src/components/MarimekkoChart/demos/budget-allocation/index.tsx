import { MarimekkoChart } from '../../';

const BUDGET_PLAN = [
  {
    label: 'Growth',
    segments: [
      { label: 'Paid media', value: 28 },
      { label: 'Field marketing', value: 24 },
      { label: 'Events', value: 18 },
      { label: 'Advocacy', value: 12 },
    ],
  },
  {
    label: 'Product',
    segments: [
      { label: 'Roadmap', value: 26 },
      { label: 'Design', value: 14 },
      { label: 'Research', value: 10 },
      { label: 'Maintenance', value: 22 },
    ],
  },
  {
    label: 'Customer',
    segments: [
      { label: 'Success', value: 18 },
      { label: 'Support', value: 21 },
      { label: 'Education', value: 9 },
      { label: 'Community', value: 7 },
    ],
  },
  {
    label: 'Operations',
    segments: [
      { label: 'Security', value: 15 },
      { label: 'IT', value: 11 },
      { label: 'Finance', value: 14 },
      { label: 'People', value: 13 },
    ],
  },
];

export default function Demo() {
  return (
    <MarimekkoChart
      title="FY26 budget allocation"
      subtitle="Percentage of total discretionary spend"
      width={720}
      height={420}
      data={BUDGET_PLAN}
      segmentBorderRadius={3}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      yAxis={{ title: 'Share of category (%)' }}
      categoryLabelFormatter={(category) => `${category.label} (${category.segments.reduce((sum, seg) => sum + seg.value, 0)}%)`}
    />
  );
}
