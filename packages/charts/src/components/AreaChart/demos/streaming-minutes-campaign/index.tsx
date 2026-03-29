import { AreaChart } from '@platform-blocks/charts';

const CAMPAIGN_WEEKS = ['Teaser Week', 'Launch Week', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

const CONTENT_SEGMENTS = [
  {
    id: 'originals',
    name: 'Original Series',
    values: [62, 88, 112, 131, 126, 118],
  },
  {
    id: 'licensed',
    name: 'Licensed TV',
    values: [78, 96, 108, 114, 109, 104],
  },
  {
    id: 'films',
    name: 'Films',
    values: [54, 63, 82, 91, 87, 84],
  },
  {
    id: 'sports',
    name: 'Live Sports',
    values: [18, 22, 34, 47, 52, 48],
  },
];

const formatWeek = (index: number) => CAMPAIGN_WEEKS[index] ?? `Week ${index + 1}`;

const STREAMING_SERIES = CONTENT_SEGMENTS.map(({ id, name, values }) => ({
  id,
  name,
  data: values.map((minutes, index) => ({
    x: index,
    y: minutes,
    data: { category: name, week: formatWeek(index), minutes },
  })),
}));

const WEEK_TOTALS = CAMPAIGN_WEEKS.map((_, index) =>
  STREAMING_SERIES.reduce((sum, series) => sum + (series.data[index]?.y ?? 0), 0)
);

export default function Demo() {
  return (
    <AreaChart
      title="Streaming Minutes During Campaign"
      subtitle="Share of viewing time by content category"
      width={640}
      height={420}
      series={STREAMING_SERIES}
      layout="stackedPercentage"
      stackOrder="normal"
      areaOpacity={0.6}
      smooth
      grid={{ show: true, style: 'dashed', color: '#E2E8F0' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const index = Math.round(point.x);
          const label = formatWeek(index);
          const minutes = point.data?.minutes ?? 0;
          const total = WEEK_TOTALS[index] ?? 0;
          const share = total > 0 ? (minutes / total) * 100 : 0;
          return `${label} • ${point.data?.category ?? 'Content'}: ${minutes}M min (${share.toFixed(1)}%)`;
        },
      }}
      xAxis={{
        show: true,
        title: 'Campaign cadence',
        labelFormatter: (value: number) => formatWeek(Math.round(value)),
      }}
      yAxis={{
        show: true,
        title: 'Share of weekly minutes',
        labelFormatter: (value: number) => `${Math.round(value * 100)}%`,
      }}
      enableCrosshair
      liveTooltip
    />
  );
}
