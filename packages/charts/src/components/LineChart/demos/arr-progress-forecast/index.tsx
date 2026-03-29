import { LineChart } from '@platform-blocks/charts';

type RegionKey = 'americas' | 'emea' | 'apac';

const MONTH_LABELS = [
  'Jan 2024',
  'Feb 2024',
  'Mar 2024',
  'Apr 2024',
  'May 2024',
  'Jun 2024',
  'Jul 2024',
  'Aug 2024',
  'Sep 2024',
  'Oct 2024',
  'Nov 2024',
  'Dec 2024',
  'Jan 2025',
  'Feb 2025',
  'Mar 2025',
  'Apr 2025',
];

const REGION_COLORS: Record<RegionKey, string> = {
  americas: '#2563EB',
  emea: '#22C55E',
  apac: '#F59E0B',
};

const ACTUAL_VALUES: Record<RegionKey, number[]> = {
  americas: [118, 124, 131, 139, 147, 156, 166, 177, 189, 202, 214, 228],
  emea: [86, 91, 96, 102, 107, 113, 119, 125, 131, 138, 144, 151],
  apac: [62, 66, 70, 74, 79, 84, 90, 96, 103, 110, 118, 125],
};

const FORECAST_DELTA: Record<RegionKey, number[]> = {
  americas: [240, 255, 271, 288],
  emea: [159, 168, 177, 187],
  apac: [133, 142, 152, 163],
};

const buildActualSeries = (region: RegionKey) => ({
  id: `${region}-actual`,
  name: `${region.toUpperCase()} Actual`,
  color: REGION_COLORS[region],
  data: ACTUAL_VALUES[region].map((value, index) => ({
    x: index,
    y: value,
    data: { label: MONTH_LABELS[index], region },
  })),
});

const buildForecastSeries = (region: RegionKey) => {
  const actual = ACTUAL_VALUES[region];
  const forecast = FORECAST_DELTA[region];
  const baselineIndex = actual.length - 1;
  const baselineValue = actual[baselineIndex];
  return {
    id: `${region}-forecast`,
    name: `${region.toUpperCase()} Forecast`,
    color: REGION_COLORS[region],
    lineStyle: 'dashed' as const,
    showPoints: false,
    data: [
      { x: baselineIndex, y: baselineValue, data: { label: MONTH_LABELS[baselineIndex], region, type: 'baseline' } },
      ...forecast.map((value, offset) => {
        const index = baselineIndex + 1 + offset;
        return {
          x: index,
          y: value,
          data: { label: MONTH_LABELS[index], region, type: 'forecast' },
        };
      }),
    ],
  };
};

const SERIES = [
  buildActualSeries('americas'),
  buildActualSeries('emea'),
  buildActualSeries('apac'),
  buildForecastSeries('americas'),
  buildForecastSeries('emea'),
  buildForecastSeries('apac'),
];

const FORECAST_START = ACTUAL_VALUES.americas.length - 0.5;
const FORECAST_END = MONTH_LABELS.length - 1 + 0.25;

export default function Demo() {
  return (
    <LineChart
      title="ARR Progression vs. Forecast"
      subtitle="GTM regions actualized ARR with forward-looking plans"
      width={720}
      height={440}
      series={SERIES}
      smooth
      showPoints
      pointSize={5}
      grid={{ show: true, style: 'dashed', color: '#E2E8F0' }}
      legend={{ show: true, position: 'bottom', align: 'center' }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const month = MONTH_LABELS[Math.round(point.x)];
          const region = point.data?.region?.toUpperCase?.() ?? 'Region';
          const label = point.data?.type === 'forecast' ? 'Forecast' : 'Actual';
          return `${month} • ${region} ${label}: $${point.y.toFixed(0)}M ARR`;
        },
      }}
      annotations={[
        {
          id: 'forecast-window',
          shape: 'range',
          x1: FORECAST_START,
          x2: FORECAST_END,
          label: 'Forecast window',
          backgroundColor: '#2563eb1a',
          textColor: '#1f2937',
        },
      ]}
      xAxis={{
        show: true,
        title: 'Timeline',
        labelFormatter: (value: number) => MONTH_LABELS[Math.round(value)] ?? `M${Math.round(value) + 1}`,
      }}
      yAxis={{
        show: true,
        title: 'ARR ($M)',
        labelFormatter: (value: number) => `$${Math.round(value)}M`,
      }}
      enableCrosshair
      multiTooltip
      liveTooltip
    />
  );
}
