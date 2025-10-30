import { ScatterChart } from '../../';

const SERIES = [
  {
    id: 'engineering',
    name: 'Engineering',
    color: '#1E90FF',
    pointSize: 9,
    data: [
      { id: 'eng-1', x: 5.8, y: 4.6, size: 10.5, label: 'Staff engineer', data: { compensation: 195 } },
      { id: 'eng-2', x: 4.2, y: 4.3, size: 9.5, label: 'Senior engineer', data: { compensation: 172 } },
      { id: 'eng-3', x: 8.1, y: 4.8, size: 11, label: 'Principal engineer', data: { compensation: 230 } },
      { id: 'eng-4', x: 3.4, y: 4.1, size: 8.5, label: 'Platform engineer', data: { compensation: 160 } },
      { id: 'eng-5', x: 6.3, y: 4.5, size: 10, label: 'DevOps lead', data: { compensation: 188 } },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    color: '#FF6B6B',
    pointSize: 8.5,
    data: [
      { id: 'sales-1', x: 5.1, y: 4.4, size: 10, label: 'Enterprise AE', data: { compensation: 210 } },
      { id: 'sales-2', x: 3.8, y: 4, size: 8.8, label: 'Commercial AE', data: { compensation: 165 } },
      { id: 'sales-3', x: 6.8, y: 4.6, size: 10.5, label: 'Regional director', data: { compensation: 220 } },
      { id: 'sales-4', x: 2.9, y: 3.8, size: 8, label: 'SDR lead', data: { compensation: 140 } },
      { id: 'sales-5', x: 4.6, y: 4.1, size: 9.3, label: 'Channel manager', data: { compensation: 170 } },
    ],
  },
  {
    id: 'customer-success',
    name: 'Customer success',
    color: '#20C997',
    pointSize: 8,
    data: [
      { id: 'cs-1', x: 4.9, y: 4.3, size: 8.2, label: 'Strategic CSM', data: { compensation: 150 } },
      { id: 'cs-2', x: 3.6, y: 4, size: 7.5, label: 'Enterprise CSM', data: { compensation: 138 } },
      { id: 'cs-3', x: 5.7, y: 4.5, size: 8.8, label: 'Solution architect', data: { compensation: 162 } },
      { id: 'cs-4', x: 2.8, y: 3.7, size: 7, label: 'Onboarding lead', data: { compensation: 120 } },
      { id: 'cs-5', x: 4.2, y: 4.1, size: 7.8, label: 'Renewals manager', data: { compensation: 132 } },
    ],
  },
];

export default function Demo() {
  return (
    <ScatterChart
      title="Performance rating vs. tenure"
      subtitle="Team-by-team view with marker size scaled to total compensation (USD thousands)"
      width={560}
      height={360}
      data={SERIES.flatMap((serie) => serie.data)}
      series={SERIES}
      pointOpacity={0.88}
      showTrendline="per-series"
      enableCrosshair
      multiTooltip
      liveTooltip
      grid={{ show: true, color: '#F1F3F5' }}
      legend={{ show: true, position: 'bottom' }}
      xAxis={{
        show: true,
        title: 'Tenure (years)',
        labelFormatter: (value: number) => `${value.toFixed(1)} yrs`,
      }}
      yAxis={{
        show: true,
        title: 'Performance rating (1-5)',
        labelFormatter: (value: number) => value.toFixed(1),
      }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const compensation = point.data?.compensation;
          const compensationText = typeof compensation === 'number' ? `$${compensation}k` : 'n/a';
          return `${point.label ?? 'Team member'}\nRating ${point.y.toFixed(1)} | Tenure ${point.x.toFixed(1)} yrs\nComp ${compensationText}`;
        },
      }}
    />
  );
}
