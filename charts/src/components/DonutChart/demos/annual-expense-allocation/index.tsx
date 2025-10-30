import { DonutChart } from '../../';
import type { DonutChartDataPoint } from '../../';

const DEPARTMENT_ALLOCATIONS: DonutChartDataPoint[] = [
  { label: 'Product & Engineering', value: 42, color: '#5C7CFA' },
  { label: 'Go-to-Market', value: 24, color: '#FF922B' },
  { label: 'Customer Success', value: 14, color: '#20C997' },
  { label: 'G&A', value: 9, color: '#748FFC' },
  { label: 'R&D Partnerships', value: 7, color: '#F76707' },
  { label: 'Workplace & Ops', value: 4, color: '#15AABF' },
];

const formatBudget = (value: number) => `$${Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}M`;

export default function Demo() {
  return (
    <DonutChart
      title="Annual Expense Allocation"
      subtitle="FY26 operating plan"
      size={300}
      data={DEPARTMENT_ALLOCATIONS}
      padAngle={1.8}
      legend={{ position: 'bottom' }}
      centerLabel={() => 'Budget'}
      centerSubLabel={() => 'Allocation by function'}
      centerValueFormatter={(value) => formatBudget(value)}
    />
  );
}
