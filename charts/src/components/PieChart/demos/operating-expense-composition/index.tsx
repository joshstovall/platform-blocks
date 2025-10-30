import { PieChart, type PieChartDataPoint } from '../../';

const OPERATING_EXPENSES = [
  { id: 'rnd', label: 'R&D', value: 42, color: '#5C7CFA' },
  { id: 'marketing', label: 'Sales & Marketing', value: 34, color: '#20C997' },
  { id: 'operations', label: 'Operations', value: 28, color: '#FF922B' },
  { id: 'ga', label: 'General & Admin', value: 18, color: '#BE4BDB' },
  { id: 'it', label: 'IT & Security', value: 14, color: '#15AABF' },
  { id: 'facilities', label: 'Facilities', value: 11, color: '#FCC419' },
];

const TOTAL_EXPENSE = OPERATING_EXPENSES.reduce((sum, slice) => sum + slice.value, 0);

const formatTooltip = (slice: PieChartDataPoint) => {
  const share = Math.round((slice.value / TOTAL_EXPENSE) * 100);
  return `${slice.label}: $${slice.value}M (${share}%)`;
};

export default function Demo() {
  return (
    <PieChart
      title="Operating expense mix"
      subtitle="FY25 year-to-date"
      width={420}
      height={360}
      data={OPERATING_EXPENSES}
      innerRadius={90}
      outerRadius={160}
      showLabels
      labelPosition="outside"
      padAngle={1.5}
      labelFormatter={(slice) => `${slice.label} · $${slice.value}M`}
      legend={{ show: true, position: 'bottom' }}
      tooltip={{ show: true, formatter: formatTooltip }}
      startAngle={-90}
      endAngle={270}
    />
  );
}
