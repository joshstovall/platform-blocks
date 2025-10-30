import { StackedAreaChart } from '../../';

const SERIES = [
  {
    id: 'mobile',
    name: 'Mobile',
    color: '#4C6EF5',
    data: [
      { x: 1, y: 22 },
      { x: 2, y: 26 },
      { x: 3, y: 28 },
      { x: 4, y: 32 },
      { x: 5, y: 36 },
      { x: 6, y: 38 },
      { x: 7, y: 42 },
      { x: 8, y: 44 },
      { x: 9, y: 47 },
      { x: 10, y: 50 },
      { x: 11, y: 52 },
      { x: 12, y: 55 },
    ],
  },
  {
    id: 'web',
    name: 'Web',
    color: '#20C997',
    data: [
      { x: 1, y: 18 },
      { x: 2, y: 20 },
      { x: 3, y: 22 },
      { x: 4, y: 25 },
      { x: 5, y: 26 },
      { x: 6, y: 27 },
      { x: 7, y: 28 },
      { x: 8, y: 30 },
      { x: 9, y: 32 },
      { x: 10, y: 33 },
      { x: 11, y: 34 },
      { x: 12, y: 35 },
    ],
  },
  {
    id: 'api',
    name: 'API',
    color: '#FF922B',
    data: [
      { x: 1, y: 12 },
      { x: 2, y: 14 },
      { x: 3, y: 15 },
      { x: 4, y: 16 },
      { x: 5, y: 18 },
      { x: 6, y: 19 },
      { x: 7, y: 21 },
      { x: 8, y: 22 },
      { x: 9, y: 23 },
      { x: 10, y: 24 },
      { x: 11, y: 25 },
      { x: 12, y: 27 },
    ],
  },
];

export default function Demo() {
  return (
    <StackedAreaChart
      title="Active users by surface"
      subtitle="Monthly totals"
      width={560}
      height={340}
      series={SERIES}
      stackOrder="normal"
      opacity={0.65}
      xAxis={{ show: true, title: 'Month', labelFormatter: (value) => `M${value}` }}
      yAxis={{
        show: true,
        title: 'Active users (thousands)',
        labelFormatter: (value) => `${value}`,
      }}
      grid={{ show: true, color: '#E3E8FB' }}
      legend={{ show: true, position: 'bottom' }}
      enableCrosshair
      multiTooltip
      liveTooltip
    />
  );
}
