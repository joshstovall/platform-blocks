import { PieChart, type PieChartDataPoint } from '../../';

const BUG_TYPES = [
  { id: 'ui', label: 'UI', value: 38, color: '#5C7CFA' },
  { id: 'api', label: 'API', value: 24, color: '#FF6B6B' },
  { id: 'performance', label: 'Performance', value: 18, color: '#51CF66' },
  { id: 'data', label: 'Data Quality', value: 12, color: '#FCC419' },
  { id: 'security', label: 'Security', value: 5, color: '#845EF7' },
  { id: 'infrastructure', label: 'Infrastructure', value: 3, color: '#ADB5BD' },
];

const formatLabel = (slice: PieChartDataPoint) => `${slice.label} ${slice.value}%`;

const formatTooltip = (slice: PieChartDataPoint) => `${slice.label}: ${slice.value}% of release defects`;

export default function Demo() {
  return (
    <PieChart
      title="Bug type distribution"
      subtitle="Latest release cycle"
      width={400}
      height={320}
      data={BUG_TYPES}
      innerRadius={70}
      outerRadius={150}
      showLabels
      labelPosition="center"
      labelFormatter={formatLabel}
      padAngle={1}
      legend={{ show: true, position: 'right' }}
      tooltip={{ show: true, formatter: formatTooltip }}
      animation={{ type: 'bounce', duration: 800, stagger: 80 }}
      startAngle={-90}
      endAngle={270}
    />
  );
}
