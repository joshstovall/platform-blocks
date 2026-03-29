import { AreaChart } from '@platform-blocks/charts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const INVENTORY_SEGMENTS = [
  {
    id: 'north',
    name: 'North DC',
    values: [420, 432, 446, 438, 412, 398],
    fillColor: '#3B82F6',
    smooth: true,
  },
  {
    id: 'central',
    name: 'Central Hub',
    values: [506, 498, 473, 452, 438, 421],
    fillColor: '#0EA5E9',
    smooth: false,
  },
  {
    id: 'south',
    name: 'South Cross-dock',
    values: [318, 332, 347, 352, 366, 371],
    fillColor: '#22D3EE',
    smooth: true,
  },
];

const formatMonth = (index: number) => MONTHS[index] ?? `M${index + 1}`;

const INVENTORY_SERIES = INVENTORY_SEGMENTS.map(({ id, name, values, fillColor, smooth }) => ({
  id,
  name,
  fillColor,
  smooth,
  data: values.map((units, index) => ({
    x: index,
    y: units,
    data: { warehouse: name, month: formatMonth(index), units },
  })),
}));

export default function Demo() {
  return (
    <AreaChart
      title="Inventory Levels by Warehouse"
      subtitle="Safety stock adjustments across the first half"
      width={640}
      height={420}
      series={INVENTORY_SERIES}
      smooth={false}
      grid={{ show: true, style: 'solid', color: '#E5E7EB' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const label = formatMonth(Math.round(point.x));
          return `${label} • ${point.data?.warehouse ?? 'Warehouse'}: ${Math.round(point.y)}k units`;
        },
      }}
      xAxis={{
        show: true,
        title: '2025 timeline',
        labelFormatter: (value: number) => formatMonth(Math.round(value)),
      }}
      yAxis={{
        show: true,
        title: 'Inventory on hand (thousands)',
        labelFormatter: (value: number) => `${Math.round(value)}k`,
      }}
      enableCrosshair
      liveTooltip
    />
  );
}
