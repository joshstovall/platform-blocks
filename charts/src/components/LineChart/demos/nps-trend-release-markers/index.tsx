import { LineChart } from '@platform-blocks/charts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const NPS_VALUES = [43, 45, 47, 52, 54, 58, 61, 64];

const SERIES = [
  {
    id: 'nps-score',
    name: 'NPS',
    color: '#6366F1',
    areaFill: true,
    fillOpacity: 0.25,
    data: NPS_VALUES.map((value, index) => ({
      x: index,
      y: value,
      data: { month: MONTHS[index], value },
    })),
  },
];

const RELEASE_MARKERS = [
  { id: 'apr-release', x: 3, label: 'Onboarding revamp' },
  { id: 'jun-release', x: 5, label: 'Mobile UI refresh' },
  { id: 'jul-release', x: 6.5, label: 'Insights launch' },
];

export default function Demo() {
  return (
    <LineChart
      title="NPS Trend with Product Releases"
      subtitle="Quarterly sentiment lift alongside major launches"
      width={640}
      height={420}
      series={SERIES}
      smooth
      fill
      grid={{ show: true, style: 'dashed', color: '#E0E7FF' }}
      legend={{ show: false }}
      tooltip={{
        show: true,
        formatter: (point) => {
          const month = point.data?.month ?? `Month ${point.x + 1}`;
          return `${month} NPS: ${point.y.toFixed(0)}`;
        },
      }}
      annotations={[
        ...RELEASE_MARKERS.map((marker) => ({
          id: marker.id,
          shape: 'vertical-line' as const,
          x: marker.x,
          label: marker.label,
          color: '#6366F1',
          textColor: '#312E81',
          backgroundColor: '#E0E7FF',
        })),
        {
          id: 'nps-target',
          shape: 'horizontal-line',
          y: 55,
          label: 'Target 55 NPS',
          color: '#16A34A',
          textColor: '#0F172A',
        },
      ]}
      xAxis={{
        show: true,
        title: '2024 timeline',
        labelFormatter: (value: number) => MONTHS[Math.round(value)] ?? `M${Math.round(value) + 1}`,
      }}
      yAxis={{
        show: true,
        title: 'Net Promoter Score',
        labelFormatter: (value: number) => `${Math.round(value)}`,
      }}
      enableCrosshair
      liveTooltip
    />
  );
}
