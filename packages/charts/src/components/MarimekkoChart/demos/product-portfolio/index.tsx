import { MarimekkoChart } from '../../';

const PRODUCT_MIX = [
  {
    label: 'Starter',
    segments: [
      { label: 'Self-serve', value: 240 },
      { label: 'Sales assisted', value: 60 },
      { label: 'Channel', value: 45 },
    ],
  },
  {
    label: 'Growth',
    segments: [
      { label: 'Self-serve', value: 180 },
      { label: 'Sales assisted', value: 110 },
      { label: 'Channel', value: 95 },
    ],
  },
  {
    label: 'Scale',
    segments: [
      { label: 'Self-serve', value: 72 },
      { label: 'Sales assisted', value: 148 },
      { label: 'Channel', value: 126 },
    ],
  },
  {
    label: 'Enterprise',
    segments: [
      { label: 'Self-serve', value: 18 },
      { label: 'Sales assisted', value: 205 },
      { label: 'Channel', value: 164 },
    ],
  },
];

export default function Demo() {
  return (
    <MarimekkoChart
      title="ARR by product tier and motion"
      subtitle="Current quarter"
      width={780}
      height={460}
      data={PRODUCT_MIX}
      segmentBorderRadius={4}
      legend={{ show: true, position: 'right' }}
      yAxis={{ title: 'Revenue share (%)' }}
      categoryLabelFormatter={(category) => `${category.label}\n(${category.data?.region ?? 'Global'})`}
    />
  );
}
