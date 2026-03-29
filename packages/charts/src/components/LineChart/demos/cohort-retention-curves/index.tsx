import { LineChart } from '@platform-blocks/charts';

const MILESTONES = ['Signup', 'Day 7', 'Day 30', 'Day 60', 'Day 90', 'Day 120'];

const COHORT_VALUES = {
  '2024 Q1 Cohort': [100, 64, 51, 44, 39, 36],
  '2024 Q2 Cohort': [100, 68, 55, 48, 43, 40],
  '2024 Q3 Cohort': [100, 72, 59, 52, 47, 44],
  '2024 Q4 Cohort': [100, 75, 63, 57, 54, 50],
} as const;

const SERIES = Object.entries(COHORT_VALUES).map(([name, values]) => ({
  id: name,
  name,
  data: values.map((value, index) => ({
    x: index,
    y: value,
    data: { milestone: MILESTONES[index], cohort: name },
  })),
  pointSize: 5,
}));

const TARGET_RETENTION = 45;

export default function Demo() {
  return (
    <LineChart
      title="Cohort Retention Across Milestones"
      subtitle="Weekly retention milestones by signup quarter"
      width={720}
      height={440}
      series={SERIES}
      smooth={false}
      showPoints
      grid={{ show: true, style: 'dotted', color: '#E2E8F0' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const milestone = point.data?.milestone ?? `Milestone ${point.x + 1}`;
          const cohort = point.data?.cohort ?? 'Cohort';
          return `${cohort} • ${milestone}: ${point.y.toFixed(0)}% retained`;
        },
      }}
      annotations={[
        {
          id: 'target-retention',
          shape: 'horizontal-line',
          y: TARGET_RETENTION,
          label: 'Target 45% Retention',
          color: '#0EA5E9',
          textColor: '#0F172A',
        },
      ]}
      xAxis={{
        show: true,
        title: 'Customer milestone',
        labelFormatter: (value: number) => MILESTONES[Math.round(value)] ?? `Step ${Math.round(value) + 1}`,
      }}
      yAxis={{
        show: true,
        title: 'Percent of original cohort',
        labelFormatter: (value: number) => `${Math.round(value)}%`,
      }}
      enableCrosshair
      liveTooltip
    />
  );
}
