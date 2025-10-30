import { LineChart } from '@platform-blocks/charts';

const DAYS = Array.from({ length: 30 }, (_, index) => `Day ${index + 1}`);

const INCIDENT_COUNT = [
  28, 26, 32, 34, 30, 28, 25, 33, 38, 44,
  41, 36, 34, 39, 42, 48, 62, 71, 56, 44,
  38, 34, 31, 28, 32, 36, 40, 37, 33, 30,
];

const mapSeries = (values: number[]) =>
  values.map((value, index) => ({
    x: index,
    y: value,
    data: { dayLabel: DAYS[index], value },
  }));

const computeMovingAverage = (values: number[], window: number) => {
  const points: { x: number; y: number }[] = [];
  let rollingTotal = 0;
  for (let index = 0; index < values.length; index += 1) {
    rollingTotal += values[index];
    if (index >= window) {
      rollingTotal -= values[index - window];
    }
    if (index >= window - 1) {
      points.push({ x: index, y: +(rollingTotal / window).toFixed(2) });
    }
  }
  return points.map((point) => ({
    ...point,
    data: { dayLabel: DAYS[point.x], window },
  }));
};

const SERIES = [
  {
    id: 'incidents',
    name: 'Daily Incidents',
    color: '#DC2626',
    data: mapSeries(INCIDENT_COUNT),
    pointSize: 4,
  },
  {
    id: 'ma-7',
    name: '7-day Moving Average',
    color: '#F97316',
    lineStyle: 'dashed' as const,
    showPoints: false,
    data: computeMovingAverage(INCIDENT_COUNT, 7),
  },
  {
    id: 'ma-14',
    name: '14-day Moving Average',
    color: '#FDBA74',
    lineStyle: 'dotted' as const,
    showPoints: false,
    data: computeMovingAverage(INCIDENT_COUNT, 14),
  },
];

const MAJOR_OUTAGE_DAY = 17; // zero-indexed value 16, display day 17
const STABILIZATION_START = 20.5;
const STABILIZATION_END = 26.5;

export default function Demo() {
  return (
    <LineChart
      title="Incident Volume with Moving Averages"
      subtitle="SRE daily incident intake and trailing trends"
      width={720}
      height={440}
      series={SERIES}
      smooth
      grid={{ show: true, style: 'solid', color: '#F1F5F9' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const label = point.data?.window
            ? `${point.data.window}-day avg`
            : 'Incidents';
          const day = DAYS[Math.round(point.x)];
          return `${day} • ${label}: ${point.y.toFixed(1)} incidents`;
        },
      }}
      annotations={[
        {
          id: 'major-outage',
          shape: 'vertical-line',
          x: MAJOR_OUTAGE_DAY - 1,
          label: 'Major outage root cause',
          color: '#DC2626',
          textColor: '#0F172A',
        },
        {
          id: 'stabilization-window',
          shape: 'range',
          x1: STABILIZATION_START,
          x2: STABILIZATION_END,
          label: 'Stabilization playbook',
          backgroundColor: '#22c55e22',
          textColor: '#14532d',
        },
      ]}
      xAxis={{
        show: true,
        title: 'Rolling 30-day window',
        labelFormatter: (value: number) => DAYS[Math.round(value)] ?? `Day ${Math.round(value) + 1}`,
      }}
      yAxis={{
        show: true,
        title: 'Incident count',
        labelFormatter: (value: number) => `${Math.round(value)}`,
      }}
      enableCrosshair
      multiTooltip
      liveTooltip
    />
  );
}
