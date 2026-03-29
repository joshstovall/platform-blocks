import { LineChart } from '../../';

const date = (month: number, value: number) => ({ x: Date.UTC(2024, month, 1), y: value });

const SERIES = [
  {
    id: 'sessions',
    name: 'Sessions',
    color: '#0EA5E9',
    data: [
      date(0, 4200),
      date(1, 4680),
      date(2, 5120),
      date(3, 5560),
      date(4, 6025),
      date(5, 6480),
      date(6, 7020),
      date(7, 7385),
      date(8, 7810),
      date(9, 8050),
      date(10, 8320),
      date(11, 8585),
    ],
  },
  {
    id: 'goal-completions',
    name: 'Goal completions',
    color: '#22C55E',
    data: [
      date(0, 520),
      date(1, 560),
      date(2, 595),
      date(3, 640),
      date(4, 705),
      date(5, 760),
      date(6, 812),
      date(7, 860),
      date(8, 905),
      date(9, 948),
      date(10, 980),
      date(11, 1015),
    ],
  },
];

const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' });

export default function Demo() {
  return (
    <LineChart
      title="Web analytics"
      subtitle="Sessions and goals over time"
      width={600}
      height={360}
      series={SERIES}
      xScaleType="time"
      enableCrosshair
      multiTooltip
      liveTooltip
      enablePanZoom
      enableBrushZoom
      zoomMode="x"
      minZoom={0.25}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      grid={{ show: true, style: 'dotted', color: '#CBD5F5' }}
      xAxis={{
        show: true,
        title: 'Month',
        labelFormatter: (value) => formatter.format(new Date(value)),
      }}
      yAxis={{
        show: true,
        title: 'Count',
        labelFormatter: (value) => value.toLocaleString(),
      }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const label = formatter.format(new Date(point.x));
          return `${label}: ${point.y.toLocaleString()} ${point.id === 'goal-completions' ? 'goals' : 'sessions'}`;
        },
      }}
      annotations={[
        {
          id: 'holiday-campaign',
          shape: 'range',
          x1: Date.UTC(2024, 10, 1),
          x2: Date.UTC(2024, 11, 31),
          label: 'Holiday campaign',
          color: '#0EA5E9',
          backgroundColor: 'rgba(14,165,233,0.12)',
        },
      ]}
    />
  );
}
