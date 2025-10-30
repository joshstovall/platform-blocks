import { AreaChart } from '@platform-blocks/charts';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const RENEWABLE_SERIES = [
  {
    id: 'solar',
    name: 'Solar',
    data: [32, 38, 44, 52, 57, 61].map((value, index) => ({ x: index, y: value })),
  },
  {
    id: 'wind',
    name: 'Wind',
    data: [48, 42, 50, 47, 53, 58].map((value, index) => ({ x: index, y: value })),
  },
  {
    id: 'hydro',
    name: 'Hydro',
    data: [36, 34, 31, 28, 30, 33].map((value, index) => ({ x: index, y: value })),
  },
];

const formatMonth = (index: number) => MONTH_LABELS[index] ?? `M${index + 1}`;

export default function Demo() {
  return (
    <AreaChart
      layout="stacked"
      title="Renewable Energy Generation"
      subtitle="Utility-scale output by source"
      width={640}
      height={420}
      series={RENEWABLE_SERIES}
      smooth
      grid={{ show: true, style: 'dashed', color: '#E2E8F0' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      xAxis={{
        show: true,
        title: 'Month of 2025',
        labelFormatter: (value: number) => formatMonth(Math.round(value)),
      }}
      yAxis={{
        show: true,
        title: 'Generation (GWh)',
        labelFormatter: (value: number) => `${Math.round(value)} GWh`,
      }}
      enableCrosshair
      liveTooltip
    />
  );
}
