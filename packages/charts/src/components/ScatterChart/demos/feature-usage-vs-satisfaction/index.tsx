import { ScatterChart } from '../../';

const SERIES = [
  {
    id: 'early-adopters',
    name: 'Early adopters',
    color: '#7048E8',
    pointSize: 8,
    data: [
      { id: 'ea-1', x: 17, y: 9, label: 'Beta squad' },
      { id: 'ea-2', x: 16, y: 8.6, label: 'Automation guild' },
      { id: 'ea-3', x: 18, y: 9.2, label: 'Platform champions' },
      { id: 'ea-4', x: 15, y: 8.8, label: 'Growth lab' },
    ],
  },
  {
    id: 'power-users',
    name: 'Power users',
    color: '#1098AD',
    pointSize: 7,
    data: [
      { id: 'pu-1', x: 14, y: 8.2, label: 'Analytics crew' },
      { id: 'pu-2', x: 13, y: 7.9, label: 'Delivery ops' },
      { id: 'pu-3', x: 12, y: 8.1, label: 'Mobile pod' },
      { id: 'pu-4', x: 13.5, y: 8.4, label: 'Rev enablement' },
    ],
  },
  {
    id: 'core-users',
    name: 'Core users',
    color: '#51CF66',
    pointSize: 6.5,
    data: [
      { id: 'cu-1', x: 9.5, y: 7.4, label: 'North America' },
      { id: 'cu-2', x: 8.8, y: 7.2, label: 'Europe' },
      { id: 'cu-3', x: 10.2, y: 7.6, label: 'APAC' },
      { id: 'cu-4', x: 9.8, y: 7.5, label: 'LATAM' },
    ],
  },
  {
    id: 'at-risk',
    name: 'At-risk',
    color: '#FF922B',
    pointSize: 6,
    data: [
      { id: 'ar-1', x: 5.5, y: 6.2, label: 'Support desk' },
      { id: 'ar-2', x: 6.3, y: 6.5, label: 'Partner success' },
      { id: 'ar-3', x: 4.8, y: 6, label: 'Finance ops' },
      { id: 'ar-4', x: 5.1, y: 6.3, label: 'Field enablement' },
    ],
  },
];

export default function Demo() {
  return (
    <ScatterChart
      title="Feature usage vs. satisfaction"
      subtitle="Weekly feature interactions mapped to CSAT by cohort"
      width={560}
      height={360}
      data={SERIES.flatMap((serie) => serie.data)}
      series={SERIES}
      pointOpacity={0.85}
      showTrendline="per-series"
      enableCrosshair
      multiTooltip
      liveTooltip
      grid={{ show: true, color: '#EDF2FF' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      xAxis={{
        show: true,
        title: 'Weekly feature uses',
        labelFormatter: (value: number) => `${value}x`,
      }}
      yAxis={{
        show: true,
        title: 'Customer satisfaction (1-10)',
        labelFormatter: (value: number) => value.toFixed(1),
      }}
      tooltip={{
        show: true,
        formatter: (point) =>
          `${point.label ?? 'Cohort'}\nUsage ${point.x.toFixed(1)}x | CSAT ${point.y.toFixed(1)}`,
      }}
    />
  );
}
