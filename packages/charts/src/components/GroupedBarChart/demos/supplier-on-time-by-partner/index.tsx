import { GroupedBarChart } from '../../';

const SERIES = [
  {
    id: 'tier-1',
    name: 'Tier 1 suppliers',
    color: '#51CF66',
    data: [
      { id: 'tier1-apex', category: 'Apex Logistics', value: 97 },
      { id: 'tier1-northstar', category: 'NorthStar Freight', value: 95 },
      { id: 'tier1-coastal', category: 'Coastal Courier', value: 93 },
      { id: 'tier1-summit', category: 'Summit Express', value: 96 },
    ],
  },
  {
    id: 'tier-2',
    name: 'Tier 2 suppliers',
    color: '#339AF0',
    data: [
      { id: 'tier2-apex', category: 'Apex Logistics', value: 93 },
      { id: 'tier2-northstar', category: 'NorthStar Freight', value: 90 },
      { id: 'tier2-coastal', category: 'Coastal Courier', value: 88 },
      { id: 'tier2-summit', category: 'Summit Express', value: 91 },
    ],
  },
  {
    id: 'new-suppliers',
    name: 'New suppliers',
    color: '#FF922B',
    data: [
      { id: 'new-apex', category: 'Apex Logistics', value: 88 },
      { id: 'new-northstar', category: 'NorthStar Freight', value: 85 },
      { id: 'new-coastal', category: 'Coastal Courier', value: 82 },
      { id: 'new-summit', category: 'Summit Express', value: 86 },
    ],
  },
];

export default function Demo() {
  return (
    <GroupedBarChart
      title="On-time delivery by logistics partner"
      subtitle="Share of shipments delivered within committed window"
      width={620}
      height={360}
      series={SERIES}
      barSpacing={0.18}
      innerBarSpacing={0.16}
      xAxis={{
        show: true,
        title: 'Logistics partner',
      }}
      yAxis={{
        show: true,
        title: 'On-time shipments (%)',
        labelFormatter: (value) => `${value}%`,
        ticks: [80, 85, 90, 95, 100],
      }}
      grid={{ show: true, color: '#E9F5EC' }}
      legend={{ show: true, position: 'bottom' }}
      valueLabels={{
        show: true,
        position: 'inside',
        formatter: ({ value }) => `${Math.round(value)}%`,
        color: 'rgba(255,255,255,0.95)',
        fontWeight: '600',
        minBarHeightForInside: 22,
      }}
      animation={{ duration: 440 }}
    />
  );
}
