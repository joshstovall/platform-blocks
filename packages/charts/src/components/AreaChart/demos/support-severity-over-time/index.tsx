import { AreaChart } from '@platform-blocks/charts';

const WEEKS = Array.from({ length: 12 }, (_, index) => `Week ${index + 1}`);

const SEVERITY_SERIES = [
  {
    id: 'sev1',
    name: 'Critical',
    data: [12, 10, 9, 8, 7, 9, 8, 7, 6, 6, 5, 5].map((value, index) => ({ x: index, y: value })),
  },
  {
    id: 'sev2',
    name: 'High',
    data: [28, 32, 34, 29, 26, 24, 22, 23, 21, 19, 18, 17].map((value, index) => ({ x: index, y: value })),
  },
  {
    id: 'sev3',
    name: 'Medium',
    data: [46, 48, 51, 49, 45, 43, 41, 39, 36, 34, 33, 32].map((value, index) => ({ x: index, y: value })),
  },
];

const formatWeek = (index: number) => WEEKS[index] ?? `Week ${index + 1}`;

export default function Demo() {
  return (
    <AreaChart
      title="Quarterly Support Ticket Mix"
      subtitle="Stacked by severity level"
      width={640}
      height={420}
      series={SEVERITY_SERIES}
      layout="stacked"
      smooth
      grid={{ show: true, style: 'dashed', color: '#E2E8F0' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      xAxis={{
        show: true,
        title: 'Quarter timeline',
        labelFormatter: (value: number) => formatWeek(Math.round(value)),
      }}
      yAxis={{
        show: true,
        title: 'Tickets created',
        labelFormatter: (value: number) => `${Math.round(value)}`,
      }}
      enableCrosshair
      liveTooltip
    />
  );
}
