import { DonutChart } from '../../';
import type { DonutChartDataPoint } from '../../';

const ARR_SEGMENTS: DonutChartDataPoint[] = [
  { id: 'enterprise', label: 'Enterprise', value: 82, color: '#5F5CF1', data: { metric: 'arr' } },
  { id: 'mid-market', label: 'Mid-Market', value: 54, color: '#4CC38A', data: { metric: 'arr' } },
  { id: 'smb', label: 'SMB', value: 36, color: '#FDA065', data: { metric: 'arr' } },
  { id: 'self-serve', label: 'Self-Serve', value: 22, color: '#74C0FC', data: { metric: 'arr' } },
];

const GROWTH_CONTRIBUTION: DonutChartDataPoint[] = [
  { id: 'enterprise', label: 'Enterprise', value: 34, data: { metric: 'growth' } },
  { id: 'mid-market', label: 'Mid-Market', value: 28, data: { metric: 'growth' } },
  { id: 'smb', label: 'SMB', value: 22, data: { metric: 'growth' } },
  { id: 'self-serve', label: 'Self-Serve', value: 16, data: { metric: 'growth' } },
];

const formatMillions = (value: number) => `${Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}M`;
const getRingId = (slice?: DonutChartDataPoint | null) => (slice as any)?.ringId as string | undefined;

export default function Demo() {
  return (
    <DonutChart
      title="ARR Mix by Segment"
      subtitle="FY26 to date"
      size={320}
      ringGap={16}
      rings={[
        {
          id: 'arr',
          label: 'Annual Recurring Revenue',
          data: ARR_SEGMENTS,
          padAngle: 1.8,
          showInLegend: true,
        },
        {
          id: 'growth',
          label: 'YoY Growth Contribution',
          data: GROWTH_CONTRIBUTION,
          thicknessRatio: 0.16,
          padAngle: 1.2,
          showInLegend: false,
        },
      ]}
      primaryRingIndex={0}
      legendRingIndex={0}
      centerLabel={(total, _data, focused) => {
        if (focused) {
          return focused.label;
        }
        return 'Total ARR';
      }}
      centerSubLabel={(total, _data, focused) => {
        if (!focused) return 'YoY growth vs. FY25';
        return getRingId(focused) === 'growth' ? 'Growth contribution' : 'Segment share';
      }}
      centerValueFormatter={(value, _total, focused) => {
        if (focused && getRingId(focused) === 'growth') {
          return `${value.toFixed(0)}%`;
        }
        return `$${formatMillions(value)}`;
      }}
      legend={{ position: 'bottom' }}
    />
  );
}
