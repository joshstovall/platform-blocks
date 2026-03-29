import { PieChart } from '../../';

const TRAFFIC_SOURCES = [
  { id: 'direct', label: 'Direct', value: 55, color: '#4C6EF5' },
  { id: 'organic', label: 'Organic', value: 25, color: '#51CF66' },
  { id: 'referral', label: 'Referral', value: 15, color: '#FF922B' },
  { id: 'social', label: 'Social', value: 5, color: '#845EF7' },
];

export default function Demo() {
  return (
    <PieChart
      title="Traffic sources"
      width={380}
      height={340}
      data={TRAFFIC_SOURCES}
      innerRadius={70}
      outerRadius={150}
      showLabels={true}
      labelPosition="outside"
      showValues={true}
      valueFormatter={(value) => `${value}%`}
      legend={{ show: true, position: 'right' }}
      tooltip={{
        show: true,
        formatter: (segment) => `${segment.label}: ${segment.value}%`,
      }}
      startAngle={-90}
      endAngle={270}
    />
  );
}
