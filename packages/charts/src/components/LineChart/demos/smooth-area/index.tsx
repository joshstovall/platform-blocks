import { LineChart } from '../../';

const SERIES = [
  {
    id: 'projected-revenue',
    name: 'Projected revenue',
    color: '#6366F1',
    data: [
      { x: 1, y: 940 },
      { x: 2, y: 980 },
      { x: 3, y: 1020 },
      { x: 4, y: 1090 },
      { x: 5, y: 1175 },
      { x: 6, y: 1260 },
      { x: 7, y: 1340 },
      { x: 8, y: 1415 },
      { x: 9, y: 1490 },
      { x: 10, y: 1575 },
      { x: 11, y: 1660 },
      { x: 12, y: 1740 },
    ],
  },
  {
    id: 'actual-revenue',
    name: 'Actual revenue',
    color: '#F97316',
    data: [
      { x: 1, y: 910 },
      { x: 2, y: 960 },
      { x: 3, y: 1005 },
      { x: 4, y: 1088 },
      { x: 5, y: 1150 },
      { x: 6, y: 1225 },
      { x: 7, y: 1312 },
      { x: 8, y: 1384 },
      { x: 9, y: 1478 },
      { x: 10, y: 1532 },
      { x: 11, y: 1610 },
      { x: 12, y: 1705 },
    ],
  },
];

export default function Demo() {
  return (
    <LineChart
      title="Revenue trajectory"
      subtitle="Smoothed forecast vs. actuals"
      width={560}
      height={320}
      series={SERIES}
      smooth
      fill
      showPoints={false}
      lineThickness={3}
      fillOpacity={0.28}
      enableCrosshair
      multiTooltip
      liveTooltip
      enablePanZoom
      zoomMode="x"
      minZoom={0.35}
      legend={{ show: true, position: 'top', align: 'center' }}
      grid={{ show: true, style: 'dashed', color: '#E0E7FF' }}
      xAxis={{
        show: true,
        title: 'Month',
        labelFormatter: (value) => `M${value}`,
      }}
      yAxis={{
        show: true,
        title: 'Revenue (USD thousands)',
        labelFormatter: (value) => `$${Math.round(value)}`,
      }}
      tooltip={{
        show: true,
        formatter: (point) => `$${point.y.toLocaleString()}k in month ${point.x}`,
      }}
      annotations={[
        {
          id: 'midyear-target',
          shape: 'vertical-line',
          x: 6,
          label: 'Mid-year target',
          color: '#6366F1',
          dashArray: [6, 6],
        },
      ]}
    />
  );
}
