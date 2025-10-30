import { AreaChart } from '@platform-blocks/charts';

const PHASE_LABELS = ['Pre-Launch', 'Launch Week', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

const SESSION_SERIES = [
  {
    id: 'ios',
    name: 'iOS',
    data: [42, 78, 92, 88, 96, 101].map((value, index) => ({ x: index, y: value, data: { label: 'iOS' } })),
  },
  {
    id: 'android',
    name: 'Android',
    data: [58, 94, 103, 108, 112, 118].map((value, index) => ({ x: index, y: value, data: { label: 'Android' } })),
  },
  {
    id: 'web',
    name: 'Web',
    data: [64, 71, 69, 75, 82, 87].map((value, index) => ({ x: index, y: value, data: { label: 'Web' } })),
  },
];

const formatPhase = (index: number) => PHASE_LABELS[index] ?? `Week ${index + 1}`;

export default function Demo() {
  return (
    <AreaChart
      title="Active Sessions During Launch"
      subtitle="Layered by device platform"
      width={640}
      height={420}
      series={SESSION_SERIES}
      smooth
      grid={{ show: true, style: 'solid', color: '#F1F5F9' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      enableSeriesToggle
      tooltip={{
        show: true,
        formatter: (point) => {
          const label = formatPhase(Math.round(point.x));
          const channel = point.data?.label ?? 'Sessions';
          return `${label} • ${channel}: ${Math.round(point.y)}k`;
        },
      }}
      xAxis={{
        show: true,
        title: 'Launch timeline',
        labelFormatter: (value: number) => formatPhase(Math.round(value)),
      }}
      yAxis={{
        show: true,
        title: 'Daily sessions (thousands)',
        labelFormatter: (value: number) => `${Math.round(value)}k`,
      }}
      enableCrosshair
      liveTooltip
    />
  );
}
