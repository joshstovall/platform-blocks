import { AreaChart } from '@platform-blocks/charts';

const WEEKLY_SIGNUPS = [
  { x: 0, y: 42 },
  { x: 1, y: 68 },
  { x: 2, y: 83 },
  { x: 3, y: 97 },
  { x: 4, y: 124 },
  { x: 5, y: 138 },
  { x: 6, y: 152 },
  { x: 7, y: 167 },
];

export default function Demo() {
  return (
    <AreaChart
      title="Weekly signups"
      subtitle="Organic vs virality"
      width={360}
      height={240}
      data={WEEKLY_SIGNUPS}
      xAxis={{
        show: true,
        labelFormatter: (value: number) => `Week ${value + 1}`,
      }}
      yAxis={{
        show: true,
        labelFormatter: (value: number) => `${value} users`,
      }}
      grid={{ show: true, style: 'dashed', color: '#CBD5F0' }}
      tooltip={{ show: true }}
      enableCrosshair
      liveTooltip
    />
  );
}
