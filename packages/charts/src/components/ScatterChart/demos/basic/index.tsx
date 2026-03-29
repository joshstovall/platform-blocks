import { ScatterChart } from '../../';

const SERIES = [
  {
    id: 'marketing',
    name: 'Marketing spend',
    color: '#4C6EF5',
    data: [
      { x: 18, y: 42 },
      { x: 22, y: 48 },
      { x: 25, y: 54 },
      { x: 27, y: 58 },
      { x: 30, y: 61 },
      { x: 34, y: 66 },
      { x: 38, y: 70 },
    ],
    pointSize: 8,
  },
  {
    id: 'events',
    name: 'Event sponsorship',
    color: '#20C997',
    data: [
      { x: 12, y: 36 },
      { x: 16, y: 41 },
      { x: 19, y: 44 },
      { x: 23, y: 47 },
      { x: 27, y: 55 },
      { x: 32, y: 62 },
      { x: 35, y: 65 },
    ],
    pointSize: 7,
  },
];

export default function Demo() {
  return (
    <ScatterChart
      title="Spend vs. qualified leads"
      subtitle="Campaign cohort"
      width={520}
      height={340}
      data={SERIES.flatMap((serie) => serie.data)}
      series={SERIES}
      showTrendline="per-series"
      enableCrosshair
      enablePanZoom
      zoomMode="both"
      multiTooltip
      liveTooltip
      xAxis={{
        show: true,
        title: 'Spend (USD thousands)',
        labelFormatter: (value) => `$${value}`,
      }}
      yAxis={{
        show: true,
        title: 'Qualified leads',
      }}
      grid={{ show: true, color: '#E7ECFC' }}
      legend={{ show: true, position: 'bottom' }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.x}k spend → ${point.y} leads`,
      }}
    />
  );
}
