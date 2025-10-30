import { LineChart } from '@platform-blocks/charts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BUILDINGS = {
  'New York HQ': {
    color: '#0EA5E9',
    smooth: true,
    values: [412, 405, 398, 384, 372, 367, 362, 358, 361, 369, 378, 389],
  },
  'Amsterdam Campus': {
    color: '#10B981',
    smooth: true,
    values: [308, 302, 296, 288, 281, 277, 274, 272, 275, 279, 284, 290],
  },
  'Singapore Hub': {
    color: '#F97316',
    smooth: false,
    values: [352, 348, 345, 341, 338, 336, 334, 331, 333, 336, 340, 343],
  },
} as const;

const SERIES = Object.entries(BUILDINGS).map(([name, meta]) => ({
  id: name,
  name,
  color: meta.color,
  smooth: meta.smooth,
  lineThickness: meta.smooth ? 3 : 2,
  data: meta.values.map((value, index) => ({
    x: index,
    y: value,
    data: { building: name, month: MONTHS[index], value },
  })),
}));

const COOLING_SEASON = { start: 5.5, end: 8.5 };
const PORTFOLIO_TARGET = 360;

export default function Demo() {
  return (
    <LineChart
      title="Energy Consumption Across Office Portfolio"
      subtitle="Monthly MWh usage benchmarking against 360 MWh target"
      width={720}
      height={440}
      series={SERIES}
      smooth={false}
      grid={{ show: true, style: 'dashed', color: '#E5E7EB' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const month = point.data?.month ?? `Month ${point.x + 1}`;
          const building = point.data?.building ?? 'Site';
          return `${building} • ${month}: ${point.y.toFixed(0)} MWh`;
        },
      }}
      annotations={[
        {
          id: 'cooling-season',
          shape: 'range',
          x1: COOLING_SEASON.start,
          x2: COOLING_SEASON.end,
          label: 'Cooling season monitoring',
          backgroundColor: '#0ea5e91a',
          textColor: '#0C4A6E',
        },
        {
          id: 'target-line',
          shape: 'horizontal-line',
          y: PORTFOLIO_TARGET,
          label: 'Target 360 MWh',
          color: '#16A34A',
          textColor: '#14532D',
        },
        {
          id: 'retrofit-complete',
          shape: 'vertical-line',
          x: 3,
          label: 'LED retrofit complete',
          color: '#10B981',
          textColor: '#064E3B',
        },
      ]}
      xAxis={{
        show: true,
        title: '2024 calendar',
        labelFormatter: (value: number) => MONTHS[Math.round(value)] ?? `M${Math.round(value) + 1}`,
      }}
      yAxis={{
        show: true,
        title: 'Energy consumed (MWh)',
        labelFormatter: (value: number) => `${Math.round(value)} MWh`,
      }}
      enableCrosshair
      multiTooltip
      liveTooltip
    />
  );
}
