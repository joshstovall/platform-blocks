import { CandlestickChart } from '../../';

type UsageCandle = {
  x: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  note?: string;
};

const USAGE_SERIES: UsageCandle[] = [
  { x: new Date('2024-10-14'), open: 1240, high: 1380, low: 1210, close: 1345, volume: 24200 },
  { x: new Date('2024-10-15'), open: 1345, high: 1480, low: 1320, close: 1452, volume: 26840 },
  { x: new Date('2024-10-16'), open: 1452, high: 1610, low: 1405, close: 1576, volume: 30230, note: 'Feature flags enabled for 35% cohort' },
  { x: new Date('2024-10-17'), open: 1576, high: 1730, low: 1530, close: 1694, volume: 32560 },
  { x: new Date('2024-10-18'), open: 1694, high: 1820, low: 1645, close: 1762, volume: 31890 },
  { x: new Date('2024-10-21'), open: 1762, high: 1885, low: 1710, close: 1856, volume: 34120 },
  { x: new Date('2024-10-22'), open: 1856, high: 1980, low: 1795, close: 1924, volume: 35680, note: 'Marketing launch day' },
  { x: new Date('2024-10-23'), open: 1924, high: 2035, low: 1860, close: 1898, volume: 33140 },
  { x: new Date('2024-10-24'), open: 1898, high: 1975, low: 1805, close: 1832, volume: 28760 },
  { x: new Date('2024-10-25'), open: 1832, high: 1910, low: 1760, close: 1876, volume: 27410 },
];

const annotations = [
  {
    id: 'launch',
    shape: 'vertical-line' as const,
    x: new Date('2024-10-22').getTime(),
    color: '#6366f1',
    opacity: 0.65,
  },
  {
    id: 'capacity-band',
    shape: 'horizontal-line' as const,
    y: 2000,
    color: '#f97316',
    opacity: 0.55,
  },
];

const formatDay = (value: number) => new Date(value).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
});

export default function Demo() {
  return (
    <CandlestickChart
      title="SaaS Usage Peaks"
      subtitle="Daily active sessions during phased launch with capacity guardrails"
      width={700}
      height={420}
      series={[
        {
          id: 'active-sessions',
          name: 'Concurrent sessions',
          data: USAGE_SERIES,
          colorBull: '#22c55e',
          colorBear: '#ef4444',
          wickColor: '#0f172a',
        },
      ]}
      movingAveragePeriods={[3, 5]}
      movingAverageColors={['#0ea5e9', '#f97316']}
      showMovingAverages
      showVolume
      volumeHeightRatio={0.24}
      annotations={annotations}
      grid={{ show: true, color: '#E3E8F4' }}
      legend={{ show: true }}
      tooltip={{
        show: true,
        formatter: (candle) => {
          const delta = candle.close - candle.open;
          const deltaLabel = `${delta >= 0 ? '+' : ''}${delta.toLocaleString('en-US')}`;
          const note = (candle as UsageCandle).note ? `\n• ${(candle as UsageCandle).note}` : '';
          return [
            `Start ${candle.open.toLocaleString('en-US')} sessions`,
            `End ${candle.close.toLocaleString('en-US')} (${deltaLabel})`,
            `Peak ${candle.high.toLocaleString('en-US')} • Floor ${candle.low.toLocaleString('en-US')}`,
            `Requests ${(candle.volume ?? 0).toLocaleString('en-US')}`,
          ].join(' • ') + note;
        },
      }}
      xAxis={{
        show: true,
        title: 'Day',
        labelFormatter: formatDay,
      }}
      yAxis={{
        show: true,
        title: 'Concurrent sessions',
        labelFormatter: (value) => value.toLocaleString('en-US'),
      }}
      enableCrosshair
      liveTooltip
      multiTooltip
      xScaleType="time"
    />
  );
}
