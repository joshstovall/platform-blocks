import { BarChart } from '../../';

const QUARTERLY_REVENUE = [
  { id: 'q1', category: 'Q1', value: 420_000 },
  { id: 'q2', category: 'Q2', value: 515_000 },
  { id: 'q3', category: 'Q3', value: 468_500 },
  { id: 'q4', category: 'Q4', value: 590_200 },
];

export default function Demo() {
  return (
    <BarChart
      title="Quarterly revenue"
      subtitle="North America"
      width={380}
      height={260}
      data={QUARTERLY_REVENUE}
      barColor="#4C6EF5"
      barSpacing={0.25}
      barBorderRadius={6}
      valueFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
      xAxis={{ show: true }}
      yAxis={{
        show: true,
        labelFormatter: (value) => `$${(value / 1000).toFixed(0)}k`,
      }}
      grid={{ show: true, style: 'dotted', color: '#E1E6F9' }}
      tooltip={{
        show: true,
        formatter: (point) => `${point.category}: $${point.value.toLocaleString()}`,
      }}
      enableCrosshair
      liveTooltip
    />
  );
}
