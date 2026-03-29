import { CandlestickChart } from '../../';

type CloudCandle = {
  x: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  note?: string;
};

const COST_SERIES: CloudCandle[] = [
  { x: new Date('2025-03-03'), open: 54250, high: 55840, low: 53620, close: 55180, volume: 1180 },
  { x: new Date('2025-03-04'), open: 55180, high: 56210, low: 54240, close: 54560, volume: 1340, note: 'CPU credits burst during load test' },
  { x: new Date('2025-03-05'), open: 54560, high: 54980, low: 53880, close: 54120, volume: 1225 },
  { x: new Date('2025-03-06'), open: 54120, high: 54820, low: 52940, close: 53280, volume: 1560, note: 'Rightsizing experiment kicked off' },
  { x: new Date('2025-03-07'), open: 53280, high: 53840, low: 52460, close: 52810, volume: 1490 },
  { x: new Date('2025-03-10'), open: 52810, high: 53350, low: 51980, close: 52140, volume: 1415 },
  { x: new Date('2025-03-11'), open: 52140, high: 53400, low: 51860, close: 53020, volume: 1305 },
  { x: new Date('2025-03-12'), open: 53020, high: 54680, low: 52510, close: 54440, volume: 1380, note: 'Idle clusters paused overnight' },
  { x: new Date('2025-03-13'), open: 54440, high: 55280, low: 53860, close: 54990, volume: 1255 },
  { x: new Date('2025-03-14'), open: 54990, high: 55710, low: 54480, close: 54620, volume: 1190 },
];

const annotations = [
  {
    id: 'budget-cap',
    shape: 'horizontal-line' as const,
    y: 56000,
    color: '#f97316',
    opacity: 0.55,
  },
  {
    id: 'rightsizing-window',
    shape: 'box' as const,
    x1: new Date('2025-03-05').getTime(),
    x2: new Date('2025-03-11').getTime(),
    y1: 55200,
    y2: 52000,
    color: '#0ea5e9',
    backgroundColor: 'rgba(14,165,233,0.12)',
  },
];

export default function Demo() {
  return (
    <CandlestickChart
      title="Cloud Spend Volatility"
      subtitle="Optimization window captured a 4.7% cost reduction"
      width={640}
      height={420}
      series={[
        {
          id: 'cloud-costs',
          name: 'Daily infrastructure cost',
          data: COST_SERIES,
          colorBull: '#10b981',
          colorBear: '#ef4444',
          wickColor: '#475569',
        },
      ]}
      movingAveragePeriods={[3, 5, 8]}
      movingAverageColors={['#38bdf8', '#6366f1', '#f97316']}
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
          const deltaLabel = `${delta >= 0 ? '+' : ''}$${delta.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
          const note = (candle as CloudCandle).note ? `\n• ${ (candle as CloudCandle).note }` : '';
          return [
            `Start: $${candle.open.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
            `End: $${candle.close.toLocaleString('en-US', { maximumFractionDigits: 0 })} (${deltaLabel})`,
            `Compute hours: ${(candle.volume ?? 0).toLocaleString('en-US')}`,
          ].join(' • ') + note;
        },
      }}
      xAxis={{
        show: true,
        title: 'Billing day',
        labelFormatter: (value) => new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      }}
      yAxis={{
        show: true,
        title: 'Daily cloud cost (USD)',
        labelFormatter: (value) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      }}
      enableCrosshair
      liveTooltip
      xScaleType="time"
    />
  );
}
