import { LineChart } from '../../';

const SERIES = [
  {
    id: 'north-america',
    name: 'North America',
    color: '#4C6EF5',
    data: [
      { x: 1, y: 120 },
      { x: 2, y: 138 },
      { x: 3, y: 152 },
      { x: 4, y: 167 },
      { x: 5, y: 176 },
      { x: 6, y: 189 },
      { x: 7, y: 205 },
      { x: 8, y: 220 },
      { x: 9, y: 232 },
      { x: 10, y: 246 },
      { x: 11, y: 260 },
      { x: 12, y: 278 },
    ],
  },
  {
    id: 'emea',
    name: 'EMEA',
    color: '#20C997',
    data: [
      { x: 1, y: 96 },
      { x: 2, y: 108 },
      { x: 3, y: 117 },
      { x: 4, y: 126 },
      { x: 5, y: 134 },
      { x: 6, y: 142 },
      { x: 7, y: 150 },
      { x: 8, y: 158 },
      { x: 9, y: 168 },
      { x: 10, y: 175 },
      { x: 11, y: 182 },
      { x: 12, y: 191 },
    ],
  },
];

export default function Demo() {
  return (
    <LineChart
      title="Monthly active customers"
      subtitle="FY25"
      width={560}
      height={320}
      series={SERIES}
      xAxis={{
        show: true,
        title: 'Month',
        labelFormatter: (value) => `M${value}`,
      }}
      yAxis={{
        show: true,
        title: 'Customers (thousands)',
        labelFormatter: (value) => `${value}`,
      }}
      grid={{ show: true, style: 'dashed', color: '#E0E7FF' }}
      legend={{ show: true, position: 'bottom' }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.y}k customers in month ${point.x}`,
      }}
      enableCrosshair
      multiTooltip
      liveTooltip
      enablePanZoom
      zoomMode="x"
      minZoom={0.3}
    />
  );
}
